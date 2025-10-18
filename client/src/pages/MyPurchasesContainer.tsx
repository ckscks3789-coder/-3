import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MyPurchases from "./MyPurchases";
import type { PurchaseWithMaterial } from "@shared/schema";

export default function MyPurchasesContainer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: purchases = [], isLoading } = useQuery<PurchaseWithMaterial[]>({
    queryKey: ["/api/purchases/my"],
    queryFn: async () => {
      const response = await fetch("/api/purchases/my");
      if (!response.ok) throw new Error("Failed to fetch purchases");
      return response.json();
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      purchaseId,
      materialId,
      rating,
      comment,
    }: {
      purchaseId: string;
      materialId: string;
      rating: number;
      comment: string;
    }) => {
      return await apiRequest("POST", "/api/reviews", {
        purchaseId,
        materialId,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "후기 등록 완료",
        description: "후기가 성공적으로 등록되었습니다",
      });
    },
    onError: (error: any) => {
      toast({
        title: "후기 등록 실패",
        description: error.message || "후기 등록 중 오류가 발생했습니다",
        variant: "destructive",
      });
    },
  });

  const handleDownload = (materialId: string) => {
    toast({
      title: "다운로드 시작",
      description: "자료 다운로드가 시작되었습니다",
    });
    // In real implementation, this would download the file
  };

  const handleSubmitReview = (purchaseId: string, rating: number, comment: string) => {
    const purchase = purchases.find((p) => p.id === purchaseId);
    if (purchase) {
      reviewMutation.mutate({
        purchaseId,
        materialId: purchase.materialId,
        rating,
        comment,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">구매 내역을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <MyPurchases
      purchases={purchases}
      onDownload={handleDownload}
      onSubmitReview={handleSubmitReview}
    />
  );
}
