import { useState } from "react";
import { MaterialCard } from "@/components/MaterialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import type { MaterialWithSeller } from "@shared/schema";
import { categoryEnum } from "@shared/schema";

interface BrowseProps {
  materials?: MaterialWithSeller[];
  onFilterChange?: (filters: any) => void;
}

export default function Browse({ materials = [], onFilterChange }: BrowseProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 50000,
    verified: false,
    sort: "latest",
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: "",
      minPrice: 0,
      maxPrice: 50000,
      verified: false,
      sort: "latest",
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">학습 자료 둘러보기</h1>
            <p className="text-muted-foreground">
              {materials.length}개의 자료를 찾았습니다
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 md:hidden"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-toggle-filters"
          >
            <Filter className="w-4 h-4" />
            필터
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 flex-shrink-0`}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>필터</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    data-testid="button-reset-filters"
                  >
                    초기화
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label>카테고리</Label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) => handleFilterChange("category", value === "all" ? "" : value)}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {categoryEnum.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>가격 범위</Label>
                  <div className="space-y-4">
                    <Slider
                      min={0}
                      max={50000}
                      step={1000}
                      value={[filters.minPrice, filters.maxPrice]}
                      onValueChange={([min, max]) => {
                        setFilters((prev) => {
                          const newFilters = { ...prev, minPrice: min, maxPrice: max };
                          if (onFilterChange) {
                            onFilterChange(newFilters);
                          }
                          return newFilters;
                        });
                      }}
                      data-testid="slider-price"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span data-testid="text-min-price">{filters.minPrice.toLocaleString()}원</span>
                      <span data-testid="text-max-price">{filters.maxPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <Label>정렬</Label>
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => handleFilterChange("sort", value)}
                  >
                    <SelectTrigger data-testid="select-sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">최신순</SelectItem>
                      <SelectItem value="popular">인기순</SelectItem>
                      <SelectItem value="price-low">낮은 가격순</SelectItem>
                      <SelectItem value="price-high">높은 가격순</SelectItem>
                      <SelectItem value="rating">평점순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Materials Grid */}
          <div className="flex-1">
            {materials.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg" data-testid="text-no-results">
                  검색 결과가 없습니다
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
