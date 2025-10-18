import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { SiKakaotalk } from "react-icons/si";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  amount: number;
  onConfirm: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  title,
  amount,
  onConfirm,
}: CheckoutDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("kakao");

  const paymentMethods = [
    {
      id: "kakao",
      name: "카카오페이",
      icon: <SiKakaotalk className="w-5 h-5" />,
      description: "간편하고 빠른 결제",
    },
    {
      id: "card",
      name: "신용/체크카드",
      icon: <CreditCard className="w-5 h-5" />,
      description: "모든 카드 결제 가능",
    },
    {
      id: "transfer",
      name: "계좌이체",
      icon: <Banknote className="w-5 h-5" />,
      description: "실시간 계좌이체",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-checkout">
        <DialogHeader>
          <DialogTitle>결제하기</DialogTitle>
          <DialogDescription>결제 수단을 선택하고 구매를 완료하세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">구매 자료</p>
            <p className="font-semibold mb-3" data-testid="text-checkout-title">{title}</p>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">결제 금액</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-checkout-amount">
                {amount.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">결제 수단</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-3 hover-elevate transition-all">
                    <RadioGroupItem value={method.id} id={method.id} data-testid={`radio-payment-${method.id}`} />
                    <Label
                      htmlFor={method.id}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <div className="text-primary">{method.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Notice */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <p className="text-sm text-warning-foreground">
              <strong>알림:</strong> 현재는 결제 UI 시연 모드입니다. 실제 결제는 추후 연동될 예정입니다.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-checkout"
            >
              취소
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              data-testid="button-confirm-checkout"
            >
              <Smartphone className="w-4 h-4" />
              {amount.toLocaleString()}원 결제하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
