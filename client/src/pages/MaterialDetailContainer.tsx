import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import MaterialDetail from "./MaterialDetail";
import type { MaterialWithSeller, ReviewWithUser } from "@shared/schema";
import { useState } from "react";

export default function MaterialDetailContainer() {
  const [, params] = useRoute("/material/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCheckout, setShowCheckout] = useState(false);

  const materialId = params?.id || "";

  const { data: material, isLoading: loadingMaterial } = useQuery<MaterialWithSeller>({
    queryKey: ["/api/materials", materialId],
    queryFn: async () => {
      const response = await fetch(`/api/materials/${materialId}`);
      if (!response.ok) throw new Error("Failed to fetch material");
      return response.json();
    },
    enabled: !!materialId,
  });

  const { data: reviews = [] } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews", materialId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${materialId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: !!materialId,
  });

  const { data: purchaseCheck } = useQuery<{ purchased: boolean }>({
    queryKey: ["/api/purchases/check", materialId],
    queryFn: async () => {
      const response = await fetch(`/api/purchases/check/${materialId}`);
      if (!response.ok) throw new Error("Failed to check purchase");
      return response.json();
    },
    enabled: !!materialId && !!user,
  });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/purchases", {
        materialId,
        amount: material?.price || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchases/check", materialId] });
      queryClient.invalidateQueries({ queryKey: ["/api/purchases/my"] });
      toast({
        title: "구매 완료",
        description: "자료를 다운로드할 수 있습니다",
      });
    },
    onError: (error: any) => {
      toast({
        title: "구매 실패",
        description: error.message || "구매 중 오류가 발생했습니다",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "구매하려면 로그인이 필요합니다",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    setShowCheckout(true);
  };

  const handleConfirmPurchase = () => {
    purchaseMutation.mutate();
  };

  const handleDownload = () => {
    toast({
      title: "다운로드 시작",
      description: "자료 다운로드가 시작되었습니다",
    });
    // In real implementation, this would download the file
  };

  if (loadingMaterial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">자료를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <MaterialDetail
        material={material}
        reviews={reviews}
        isPurchased={purchaseCheck?.purchased || false}
        onPurchase={handlePurchase}
        onDownload={handleDownload}
      />
      {material && (
        <CheckoutDialog
          open={showCheckout}
          onOpenChange={setShowCheckout}
          title={material.title}
          amount={material.price}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </>
  );
}
