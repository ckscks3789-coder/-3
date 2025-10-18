import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckBadgeIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { Eye, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import type { MaterialWithSeller } from "@shared/schema";

interface MaterialCardProps {
  material: MaterialWithSeller;
}

export function MaterialCard({ material }: MaterialCardProps) {
  const sampleImage = material.sampleImages?.[0] || "https://placehold.co/400x225/e2e8f0/64748b?text=No+Image";

  return (
    <Link href={`/material/${material.id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-200 cursor-pointer group" data-testid={`card-material-${material.id}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={sampleImage}
            alt={material.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Grade Badge */}
          {material.isGradeVerified && (
            <div className="absolute top-0 right-0 bg-success text-success-foreground px-3 py-1 rounded-bl-lg font-semibold text-sm flex items-center gap-1" data-testid={`badge-grade-verified-${material.id}`}>
              <AcademicCapIcon className="w-4 h-4" />
              A+
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category Badge */}
          <Badge variant="secondary" className="mb-2" data-testid={`badge-category-${material.id}`}>
            {material.category}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors" data-testid={`text-title-${material.id}`}>
            {material.title}
          </h3>

          {/* Course & Professor */}
          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-course-${material.id}`}>
            {material.courseName} · {material.professorName}
          </p>

          {/* Seller Info */}
          <div className="flex items-center gap-2 mb-3">
            {material.isContentVerified && (
              <CheckBadgeIcon className="w-4 h-4 text-primary" data-testid={`icon-verified-${material.id}`} />
            )}
            <span className="text-sm text-muted-foreground" data-testid={`text-seller-${material.id}`}>
              {material.seller.name}
            </span>
          </div>

          {/* Stats & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1" data-testid={`stat-views-${material.id}`}>
                <Eye className="w-4 h-4" />
                <span>{material.viewCount}</span>
              </div>
              <div className="flex items-center gap-1" data-testid={`stat-purchases-${material.id}`}>
                <ShoppingCart className="w-4 h-4" />
                <span>{material.purchaseCount}</span>
              </div>
              {material.averageRating && (
                <div className="flex items-center gap-1" data-testid={`stat-rating-${material.id}`}>
                  <span className="text-yellow-500">★</span>
                  <span>{material.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="text-xl font-bold text-primary" data-testid={`text-price-${material.id}`}>
              {material.price.toLocaleString()}원
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
