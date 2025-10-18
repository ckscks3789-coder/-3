import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, User, LogOut, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User as UserType } from "@shared/schema";

interface NavbarProps {
  user?: UserType;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

export function Navbar({ user, onLogout, onSearch }: NavbarProps) {
  const [location] = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (onSearch && query) {
      onSearch(query);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-lg transition-all" data-testid="link-home">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">인하노트</span>
          </div>
        </Link>

        {/* Search Bar (중앙) */}
        {user && (
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="과목명, 교수명으로 검색..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </form>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Upload Button */}
              <Link href="/upload">
                <Button variant="default" className="gap-2" data-testid="button-upload">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">자료 등록</span>
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold" data-testid="text-user-name">{user.name}</p>
                    <p className="text-xs text-muted-foreground" data-testid="text-user-email">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer" data-testid="link-dashboard">
                      <User className="w-4 h-4 mr-2" />
                      판매자 대시보드
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/purchases">
                    <DropdownMenuItem className="cursor-pointer" data-testid="link-purchases">
                      <BookOpen className="w-4 h-4 mr-2" />
                      내 구매 목록
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={onLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth">
              <Button data-testid="button-login">로그인</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
