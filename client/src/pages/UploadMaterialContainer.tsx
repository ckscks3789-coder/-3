import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import UploadMaterial from "./UploadMaterial";

export default function UploadMaterialContainer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/materials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seller/materials"] });
      toast({
        title: "등록 완료",
        description: "자료가 성공적으로 등록되었습니다",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "등록 실패",
        description: error.message || "자료 등록 중 오류가 발생했습니다",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    uploadMutation.mutate(data);
  };

  return <UploadMaterial onSubmit={handleSubmit} />;
}
