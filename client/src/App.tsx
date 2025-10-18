import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";

// Pages
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import BrowseContainer from "@/pages/BrowseContainer";
import MaterialDetailContainer from "@/pages/MaterialDetailContainer";
import UploadMaterialContainer from "@/pages/UploadMaterialContainer";
import SellerDashboardContainer from "@/pages/SellerDashboardContainer";
import MyPurchasesContainer from "@/pages/MyPurchasesContainer";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, isAuthenticated, login, signup, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
      setLocation("/browse");
    } catch (error: any) {
      toast({
        title: "로그인 실패",
        description: error.message || "이메일 또는 비밀번호를 확인해주세요",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
    name: string,
    department?: string
  ) => {
    try {
      await signup({ email, password, name, department });
      toast({
        title: "회원가입 성공",
        description: "인하노트에 오신 것을 환영합니다!",
      });
      setLocation("/browse");
    } catch (error: any) {
      toast({
        title: "회원가입 실패",
        description: error.message || "다시 시도해주세요",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "로그아웃",
        description: "안전하게 로그아웃되었습니다",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "오류",
        description: "로그아웃 중 문제가 발생했습니다",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    setLocation(`/browse?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show navbar only when not on landing or auth page */}
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} onSearch={handleSearch} />}

      <main className="flex-1">
        <Switch>
          {!isAuthenticated && !isLoading ? (
            <>
              <Route path="/" component={Landing} />
              <Route path="/auth">
                <Auth onLogin={handleLogin} onSignup={handleSignup} />
              </Route>
              <Route path="/browse" component={BrowseContainer} />
              <Route path="/material/:id" component={MaterialDetailContainer} />
            </>
          ) : (
            <>
              <Route path="/" component={BrowseContainer} />
              <Route path="/browse" component={BrowseContainer} />
              <Route path="/material/:id" component={MaterialDetailContainer} />
              <Route path="/upload" component={UploadMaterialContainer} />
              <Route path="/dashboard" component={SellerDashboardContainer} />
              <Route path="/purchases" component={MyPurchasesContainer} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
