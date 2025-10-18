import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { categoryEnum } from "@shared/schema";

interface UploadMaterialProps {
  onSubmit?: (data: any) => void;
}

export default function UploadMaterial({ onSubmit }: UploadMaterialProps) {
  const [sampleImages, setSampleImages] = useState<string[]>([]);
  const [gradeProof, setGradeProof] = useState<string>("");
  const [materialFile, setMaterialFile] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate upload - in real implementation, upload to server
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setSampleImages([...sampleImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSampleImages(sampleImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title"),
      courseName: formData.get("courseName"),
      professorName: formData.get("professorName"),
      category: formData.get("category"),
      semester: formData.get("semester"),
      price: parseInt(formData.get("price") as string),
      description: formData.get("description"),
      sampleImages,
      gradeProof,
      materialFile,
    };

    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">학습 자료 등록</h1>
            <p className="text-muted-foreground">
              자료 정보를 입력하고 성적표를 업로드하여 신뢰도를 높이세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">자료 제목 *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="예: 2024-1학기 대학영어 중간고사 족보"
                    required
                    data-testid="input-title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseName">과목명 *</Label>
                    <Input
                      id="courseName"
                      name="courseName"
                      placeholder="예: 대학영어"
                      required
                      data-testid="input-course-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professorName">교수명 *</Label>
                    <Input
                      id="professorName"
                      name="professorName"
                      placeholder="예: 김철수"
                      required
                      data-testid="input-professor-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select name="category" required>
                      <SelectTrigger id="category" data-testid="select-category">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryEnum.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">학기 *</Label>
                    <Input
                      id="semester"
                      name="semester"
                      placeholder="예: 2024-1"
                      required
                      data-testid="input-semester"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">가격 (원) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="예: 5000"
                    required
                    data-testid="input-price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">상세 설명 *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={6}
                    placeholder="자료의 내용, 특징, 활용법 등을 자세히 설명해주세요"
                    required
                    data-testid="textarea-description"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sample Images */}
            <Card>
              <CardHeader>
                <CardTitle>샘플 이미지</CardTitle>
                <CardDescription>
                  구매자가 자료를 미리 확인할 수 있도록 일부 내용을 업로드하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="sample-images"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    data-testid="input-sample-images"
                  />
                  <label
                    htmlFor="sample-images"
                    className="cursor-pointer inline-flex flex-col items-center"
                  >
                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      클릭하여 이미지 업로드 (최대 5장)
                    </p>
                  </label>
                </div>

                {sampleImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sampleImages.map((img, index) => (
                      <div key={index} className="relative group" data-testid={`preview-sample-${index}`}>
                        <img
                          src={img}
                          alt={`Sample ${index + 1}`}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-remove-sample-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Grade Proof */}
            <Card>
              <CardHeader>
                <CardTitle>성적 인증</CardTitle>
                <CardDescription>
                  A 이상의 성적표를 업로드하면 '성적 인증' 배지를 받습니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="grade-proof"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setGradeProof(URL.createObjectURL(file));
                      }
                    }}
                    data-testid="input-grade-proof"
                  />
                  <label
                    htmlFor="grade-proof"
                    className="cursor-pointer inline-flex flex-col items-center"
                  >
                    <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">성적표 업로드 (선택)</p>
                  </label>
                </div>

                {gradeProof && (
                  <div className="mt-4 relative group" data-testid="preview-grade-proof">
                    <img
                      src={gradeProof}
                      alt="Grade proof"
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setGradeProof("")}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      data-testid="button-remove-grade-proof"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                data-testid="button-submit"
              >
                <Upload className="w-5 h-5 mr-2" />
                자료 등록하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
