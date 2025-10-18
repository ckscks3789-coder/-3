import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, MessageSquare, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import type { PurchaseWithMaterial } from "@shared/schema";

interface MyPurchasesProps {
  purchases?: PurchaseWithMaterial[];
  onDownload?: (materialId: string) => void;
  onSubmitReview?: (purchaseId: string, rating: number, comment: string) => void;
}

export default function MyPurchases({
  purchases = [],
  onDownload,
  onSubmitReview,
}: MyPurchasesProps) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseWithMaterial | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmitReview = () => {
    if (selectedPurchase && onSubmitReview) {
      onSubmitReview(selectedPurchase.id, rating, comment);
      setReviewDialogOpen(false);
      setSelectedPurchase(null);
      setRating(5);
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">내 구매 목록</h1>
          <p className="text-muted-foreground">구매한 자료를 확인하고 다운로드하세요</p>
        </div>

        {/* Purchases List */}
        {purchases.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4" data-testid="text-no-purchases">
                아직 구매한 자료가 없습니다
              </p>
              <Link href="/browse">
                <Button data-testid="button-browse-materials">자료 둘러보기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} data-testid={`card-purchase-${purchase.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 flex-shrink-0">
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={
                            purchase.material.sampleImages?.[0] ||
                            "https://placehold.co/400x225/e2e8f0/64748b?text=No+Image"
                          }
                          alt={purchase.material.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="secondary" className="mb-2" data-testid={`badge-category-${purchase.id}`}>
                            {purchase.material.category}
                          </Badge>
                          <Link href={`/material/${purchase.material.id}`}>
                            <h3 className="text-xl font-semibold hover:text-primary cursor-pointer mb-1" data-testid={`link-material-${purchase.id}`}>
                              {purchase.material.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-course-${purchase.id}`}>
                            {purchase.material.courseName} · {purchase.material.professorName}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-seller-${purchase.id}`}>
                            판매자: {purchase.material.seller.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary" data-testid={`text-price-${purchase.id}`}>
                            {purchase.amount.toLocaleString()}원
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-date-${purchase.id}`}>
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="default"
                          className="gap-2"
                          onClick={() => onDownload && onDownload(purchase.material.id)}
                          data-testid={`button-download-${purchase.id}`}
                        >
                          <Download className="w-4 h-4" />
                          다운로드
                        </Button>

                        <Dialog
                          open={reviewDialogOpen && selectedPurchase?.id === purchase.id}
                          onOpenChange={(open) => {
                            setReviewDialogOpen(open);
                            if (open) {
                              setSelectedPurchase(purchase);
                            } else {
                              setSelectedPurchase(null);
                              setRating(5);
                              setComment("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2" data-testid={`button-review-${purchase.id}`}>
                              <MessageSquare className="w-4 h-4" />
                              후기 작성
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>후기 작성</DialogTitle>
                              <DialogDescription>
                                구매한 자료에 대한 평가를 남겨주세요
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">별점</label>
                                <StarRating
                                  rating={rating}
                                  interactive
                                  onRatingChange={setRating}
                                  size="lg"
                                  className="justify-center"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">후기 (선택)</label>
                                <Textarea
                                  placeholder="자료에 대한 의견을 남겨주세요"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  rows={4}
                                  data-testid="textarea-review-comment"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setReviewDialogOpen(false);
                                  setSelectedPurchase(null);
                                  setRating(5);
                                  setComment("");
                                }}
                              >
                                취소
                              </Button>
                              <Button onClick={handleSubmitReview} data-testid="button-submit-review">
                                후기 등록
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
