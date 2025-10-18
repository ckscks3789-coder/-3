import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckBadgeIcon, AcademicCapIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { BookOpen, Search, CreditCard, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const features = [
    {
      icon: <CheckBadgeIcon className="w-8 h-8 text-success" />,
      title: "성적 인증 시스템",
      description: "A+ 이상 성적표로 검증된 자료만 거래됩니다",
    },
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "간편한 검색",
      description: "과목명, 교수명으로 원하는 자료를 빠르게 찾으세요",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "안전한 거래",
      description: "투명한 가격과 미리보기로 안심하고 구매하세요",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "판매자 등록",
      description: "자료와 성적표를 업로드하고 가격을 설정합니다",
    },
    {
      number: "2",
      title: "구매자 검색",
      description: "카테고리와 키워드로 원하는 자료를 찾습니다",
    },
    {
      number: "3",
      title: "거래 완료",
      description: "결제 후 바로 자료를 다운로드할 수 있습니다",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <BookOpen className="w-12 h-12 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold">인하노트</h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              A+ 선배가 직접 정리한<br />교양 노트 모음집
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              인하대학교 학생들을 위한 신뢰할 수 있는 학습 자료 공유 플랫폼
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8 gap-2" data-testid="button-get-started">
                  지금 시작하기
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-browse">
                  자료 둘러보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">왜 인하노트인가요?</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">이용 방법</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative" data-testid={`step-${index}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheckIcon className="w-16 h-16 text-success mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">신뢰할 수 있는 플랫폼</h3>
            <p className="text-lg text-muted-foreground mb-8">
              모든 자료는 성적 인증을 거치며, 구매자의 후기를 통해<br />
              투명하게 품질이 관리됩니다
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">지금 바로 시작하세요</h3>
            <p className="text-lg text-muted-foreground mb-8">
              인하대 학생들이 가장 먼저 찾는 학습 자료 거래 플랫폼
            </p>
            <Link href="/auth">
              <Button size="lg" className="text-lg px-12" data-testid="button-cta-signup">
                무료 회원가입
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
