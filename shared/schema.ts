import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - 간단한 이메일/비밀번호 인증
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  department: varchar("department", { length: 100 }), // 학과
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categories enum
export const categoryEnum = ["전공", "핵심교양", "일반교양"] as const;
export type Category = typeof categoryEnum[number];

// Materials table - 학습 자료
export const materials = pgTable("materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  courseName: varchar("course_name", { length: 255 }).notNull(), // 과목명
  professorName: varchar("professor_name", { length: 100 }).notNull(), // 교수명
  category: varchar("category", { length: 50 }).notNull(), // 전공/핵심교양/일반교양
  semester: varchar("semester", { length: 50 }).notNull(), // 연도/학기 (예: 2024-1)
  price: integer("price").notNull(), // 가격 (원)
  description: text("description").notNull(), // 상세 설명
  sampleImages: text("sample_images").array().notNull().default(sql`ARRAY[]::text[]`), // 샘플 이미지 URLs
  materialFile: varchar("material_file", { length: 500 }), // 자료 파일 URL
  gradeProof: varchar("grade_proof", { length: 500 }), // 성적표 이미지 URL
  isGradeVerified: boolean("is_grade_verified").default(false).notNull(), // 성적 인증 여부
  isContentVerified: boolean("is_content_verified").default(false).notNull(), // 노트 검증 여부
  viewCount: integer("view_count").default(0).notNull(), // 조회수
  purchaseCount: integer("purchase_count").default(0).notNull(), // 구매수
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("materials_seller_idx").on(table.sellerId),
  index("materials_category_idx").on(table.category),
  index("materials_course_idx").on(table.courseName),
]);

// Purchases table - 구매 내역
export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  materialId: varchar("material_id").notNull().references(() => materials.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // 구매 금액
  status: varchar("status", { length: 50 }).notNull().default("completed"), // completed, pending, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("purchases_buyer_idx").on(table.buyerId),
  index("purchases_material_idx").on(table.materialId),
]);

// Reviews table - 후기
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseId: varchar("purchase_id").notNull().references(() => purchases.id, { onDelete: "cascade" }),
  materialId: varchar("material_id").notNull().references(() => materials.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 별점
  comment: text("comment"), // 후기 내용
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("reviews_material_idx").on(table.materialId),
  index("reviews_user_idx").on(table.userId),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  materials: many(materials),
  purchases: many(purchases),
  reviews: many(reviews),
}));

export const materialsRelations = relations(materials, ({ one, many }) => ({
  seller: one(users, {
    fields: [materials.sellerId],
    references: [users.id],
  }),
  purchases: many(purchases),
  reviews: many(reviews),
}));

export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  buyer: one(users, {
    fields: [purchases.buyerId],
    references: [users.id],
  }),
  material: one(materials, {
    fields: [purchases.materialId],
    references: [materials.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  purchase: one(purchases, {
    fields: [reviews.purchaseId],
    references: [purchases.id],
  }),
  material: one(materials, {
    fields: [reviews.materialId],
    references: [materials.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  purchaseCount: true,
  isGradeVerified: true,
  isContentVerified: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Extended types for frontend
export type MaterialWithSeller = Material & {
  seller: User;
  averageRating?: number;
  reviewCount?: number;
};

export type ReviewWithUser = Review & {
  user: User;
};

export type PurchaseWithMaterial = Purchase & {
  material: Material & { seller: User };
};
