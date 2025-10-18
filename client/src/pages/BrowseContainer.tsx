import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Browse from "./Browse";
import type { MaterialWithSeller } from "@shared/schema";

export default function BrowseContainer() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 50000,
    verified: false,
    sort: "latest",
  });

  const { data: materials = [], isLoading } = useQuery<MaterialWithSeller[]>({
    queryKey: ["/api/materials", searchQuery, filters.category, filters.minPrice, filters.maxPrice],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice > 0) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice < 50000) params.append("maxPrice", filters.maxPrice.toString());
      
      const response = await fetch(`/api/materials?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch materials");
      return response.json();
    },
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Apply client-side sorting
  const sortedMaterials = [...materials].sort((a, b) => {
    switch (filters.sort) {
      case "popular":
        return b.purchaseCount - a.purchaseCount;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0);
      default: // latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">자료를 불러오는 중...</p>
      </div>
    );
  }

  return <Browse materials={sortedMaterials} onFilterChange={handleFilterChange} />;
}
