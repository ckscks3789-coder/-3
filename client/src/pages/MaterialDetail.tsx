import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckBadgeIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { Eye, ShoppingCart, Download, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import type { MaterialWithSeller, ReviewWithUser } from "@shared/schema";

interface MaterialDetailProps {
  material?: MaterialWithSeller;
  reviews?: ReviewWithUser[];
  isPurchased?: boolean;
  onPurchase?: () => void;
  onDownload?: () => void;
}

export default function MaterialDetail({
  material,
  reviews = [],
  isPurchased = false,
  onPurchase,
  onDownload,
}: MaterialDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">자료를 찾을 수 없습니다</p>
      </div>
    );
  }

  const images = material.sampleImages || ["https://placehold.co/800x450/e2e8f0/64748b?text=No+Image"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/browse">
          <Button variant="ghost" className="gap-2 mb-6" data-testid="button-back">
            <ChevronLeft className="w-4 h-4" />
            목록으로
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Images & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={material.title}
                className="w-full h-full object-cover"
                data-testid="img-main-preview"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Tabs: Description & Reviews */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description" data-testid="tab-description">상세 설명</TabsTrigger>
                <TabsTrigger value="reviews" data-testid="tab-reviews">
                  후기 ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-description">
                      {material.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-4">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground" data-testid="text-no-reviews">아직 후기가 없습니다</p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id} data-testid={`card-review-${review.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold" data-testid={`text-reviewer-${review.id}`}>{review.user.name}</p>
                                <StarRating rating={review.rating} size="sm" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground" data-testid={`text-review-comment-${review.id}`}>{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="secondary" data-testid="badge-category">{material.category}</Badge>
                  <CardTitle className="text-2xl" data-testid="text-title">{material.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Info */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">과목명</p>
                  <p className="font-medium" data-testid="text-course">{material.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">교수명</p>
                  <p className="font-medium" data-testid="text-professor">{material.professorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">학기</p>
                  <p className="font-medium" data-testid="text-semester">{material.semester}</p>
                </div>

                <Separator />

                {/* Seller Info */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">판매자</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{material.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium" data-testid="text-seller">{material.seller.name}</p>
                        {material.isContentVerified && (
                          <CheckBadgeIcon className="w-4 h-4 text-primary" data-testid="icon-verified" />
                        )}
                      </div>
                      {material.seller.department && (
                        <p className="text-sm text-muted-foreground" data-testid="text-seller-department">
                          {material.seller.department}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {material.isGradeVerified && (
                    <Badge variant="outline" className="border-success text-success gap-1" data-testid="badge-grade-verified">
                      <AcademicCapIcon className="w-3 h-3" />
                      성적 인증
                    </Badge>
                  )}
                  {material.isContentVerified && (
                    <Badge variant="outline" className="border-primary text-primary gap-1" data-testid="badge-content-verified">
                      <CheckBadgeIcon className="w-3 h-3" />
                      노트 검증
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground" data-testid="stat-views">
                    <Eye className="w-4 h-4" />
                    <span>{material.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground" data-testid="stat-purchases">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{material.purchaseCount}명 구매</span>
                  </div>
                  {material.averageRating && (
                    <StarRating rating={material.averageRating} size="sm" showNumber />
                  )}
                </div>

                <Separator />

                {/* Price */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">가격</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-price">
                    {material.price.toLocaleString()}원
                  </p>
                </div>

                {/* Purchase Button */}
                {isPurchased ? (
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={onDownload}
                    data-testid="button-download"
                  >
                    <Download className="w-5 h-5" />
                    자료 다운로드
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={onPurchase}
                    data-testid="button-purchase"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    구매하기
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
