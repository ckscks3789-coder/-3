import { useQuery } from "@tanstack/react-query";
import SellerDashboard from "./SellerDashboard";
import type { Material } from "@shared/schema";

export default function SellerDashboardContainer() {
  const { data: materials = [], isLoading: loadingMaterials } = useQuery<Material[]>({
    queryKey: ["/api/seller/materials"],
    queryFn: async () => {
      const response = await fetch("/api/seller/materials");
      if (!response.ok) throw new Error("Failed to fetch materials");
      return response.json();
    },
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/seller/stats"],
    queryFn: async () => {
      const response = await fetch("/api/seller/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  if (loadingMaterials || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return <SellerDashboard materials={materials} stats={stats} />;
}
