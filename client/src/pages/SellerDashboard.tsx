import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileText, DollarSign, Star, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Material } from "@shared/schema";

interface SellerDashboardProps {
  materials?: Material[];
  stats?: {
    totalMaterials: number;
    totalRevenue: number;
    totalPurchases: number;
    averageRating: number;
  };
}

export default function SellerDashboard({ materials = [], stats }: SellerDashboardProps) {
  const defaultStats = {
    totalMaterials: materials.length,
    totalRevenue: 0,
    totalPurchases: 0,
    averageRating: 0,
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">판매자 대시보드</h1>
            <p className="text-muted-foreground">등록한 자료와 판매 현황을 확인하세요</p>
          </div>
          <Link href="/upload">
            <Button className="gap-2" data-testid="button-upload-new">
              <Upload className="w-4 h-4" />
              새 자료 등록
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-stat-materials">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">등록한 자료</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-materials">
                {displayStats.totalMaterials}개
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-revenue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 수익</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-revenue">
                {displayStats.totalRevenue.toLocaleString()}원
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-purchases">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 판매</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-purchases">
                {displayStats.totalPurchases}건
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-rating">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-stat-rating">
                {displayStats.averageRating.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Materials Table */}
        <Card>
          <CardHeader>
            <CardTitle>내 자료 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {materials.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4" data-testid="text-no-materials">
                  아직 등록한 자료가 없습니다
                </p>
                <Link href="/upload">
                  <Button data-testid="button-upload-first">첫 자료 등록하기</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>가격</TableHead>
                      <TableHead>조회수</TableHead>
                      <TableHead>판매수</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>등록일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id} data-testid={`row-material-${material.id}`}>
                        <TableCell className="font-medium">
                          <Link href={`/material/${material.id}`}>
                            <span className="hover:text-primary cursor-pointer" data-testid={`link-material-${material.id}`}>
                              {material.title}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" data-testid={`badge-category-${material.id}`}>
                            {material.category}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-price-${material.id}`}>
                          {material.price.toLocaleString()}원
                        </TableCell>
                        <TableCell data-testid={`text-views-${material.id}`}>
                          {material.viewCount}
                        </TableCell>
                        <TableCell data-testid={`text-purchases-${material.id}`}>
                          {material.purchaseCount}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {material.isGradeVerified && (
                              <Badge variant="outline" className="border-success text-success text-xs" data-testid={`badge-verified-${material.id}`}>
                                성적인증
                              </Badge>
                            )}
                            {material.isContentVerified && (
                              <Badge variant="outline" className="border-primary text-primary text-xs">
                                검증완료
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground" data-testid={`text-date-${material.id}`}>
                          {new Date(material.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
