import {
  users,
  materials,
  purchases,
  reviews,
  type User,
  type InsertUser,
  type Material,
  type InsertMaterial,
  type Purchase,
  type InsertPurchase,
  type Review,
  type InsertReview,
  type MaterialWithSeller,
  type ReviewWithUser,
  type PurchaseWithMaterial,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Material operations
  getMaterial(id: string): Promise<Material | undefined>;
  getMaterialWithSeller(id: string): Promise<MaterialWithSeller | undefined>;
  getMaterials(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sellerId?: string;
  }): Promise<MaterialWithSeller[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: string, material: Partial<InsertMaterial>): Promise<Material | undefined>;
  incrementMaterialView(id: string): Promise<void>;
  incrementMaterialPurchase(id: string): Promise<void>;

  // Purchase operations
  getPurchase(id: string): Promise<Purchase | undefined>;
  getPurchasesByBuyer(buyerId: string): Promise<PurchaseWithMaterial[]>;
  getPurchasesByMaterial(materialId: string): Promise<Purchase[]>;
  checkPurchaseExists(buyerId: string, materialId: string): Promise<boolean>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;

  // Review operations
  getReview(id: string): Promise<Review | undefined>;
  getReviewsByMaterial(materialId: string): Promise<ReviewWithUser[]>;
  createReview(review: InsertReview): Promise<Review>;
  getMaterialAverageRating(materialId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Material operations
  async getMaterial(id: string): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material;
  }

  async getMaterialWithSeller(id: string): Promise<MaterialWithSeller | undefined> {
    const result = await db
      .select()
      .from(materials)
      .leftJoin(users, eq(materials.sellerId, users.id))
      .where(eq(materials.id, id));

    if (result.length === 0 || !result[0].users) return undefined;

    const avgRating = await this.getMaterialAverageRating(id);
    const reviewCount = (await this.getReviewsByMaterial(id)).length;

    return {
      ...result[0].materials,
      seller: result[0].users,
      averageRating: avgRating,
      reviewCount,
    };
  }

  async getMaterials(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sellerId?: string;
  }): Promise<MaterialWithSeller[]> {
    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(materials.category, filters.category));
    }
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(materials.price, filters.minPrice));
    }
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(materials.price, filters.maxPrice));
    }
    if (filters?.search) {
      conditions.push(
        sql`(${materials.title} ILIKE ${'%' + filters.search + '%'} OR ${materials.courseName} ILIKE ${'%' + filters.search + '%'} OR ${materials.professorName} ILIKE ${'%' + filters.search + '%'})`
      );
    }
    if (filters?.sellerId) {
      conditions.push(eq(materials.sellerId, filters.sellerId));
    }

    const query = db
      .select()
      .from(materials)
      .leftJoin(users, eq(materials.sellerId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(materials.createdAt));

    const results = await query;

    const materialsWithSeller: MaterialWithSeller[] = await Promise.all(
      results
        .filter((r) => r.users)
        .map(async (r) => {
          const avgRating = await this.getMaterialAverageRating(r.materials.id);
          const reviewCount = (await this.getReviewsByMaterial(r.materials.id)).length;
          return {
            ...r.materials,
            seller: r.users!,
            averageRating: avgRating || 0,
            reviewCount,
          };
        })
    );

    return materialsWithSeller;
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const [material] = await db.insert(materials).values(insertMaterial).returning();
    return material;
  }

  async updateMaterial(id: string, updateData: Partial<InsertMaterial>): Promise<Material | undefined> {
    const [material] = await db
      .update(materials)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(materials.id, id))
      .returning();
    return material;
  }

  async incrementMaterialView(id: string): Promise<void> {
    await db
      .update(materials)
      .set({ viewCount: sql`${materials.viewCount} + 1` })
      .where(eq(materials.id, id));
  }

  async incrementMaterialPurchase(id: string): Promise<void> {
    await db
      .update(materials)
      .set({ purchaseCount: sql`${materials.purchaseCount} + 1` })
      .where(eq(materials.id, id));
  }

  // Purchase operations
  async getPurchase(id: string): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase;
  }

  async getPurchasesByBuyer(buyerId: string): Promise<PurchaseWithMaterial[]> {
    const results = await db
      .select()
      .from(purchases)
      .leftJoin(materials, eq(purchases.materialId, materials.id))
      .leftJoin(users, eq(materials.sellerId, users.id))
      .where(eq(purchases.buyerId, buyerId))
      .orderBy(desc(purchases.createdAt));

    return results
      .filter((r) => r.materials && r.users)
      .map((r) => ({
        ...r.purchases,
        material: {
          ...r.materials!,
          seller: r.users!,
        },
      }));
  }

  async getPurchasesByMaterial(materialId: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.materialId, materialId));
  }

  async checkPurchaseExists(buyerId: string, materialId: string): Promise<boolean> {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.buyerId, buyerId), eq(purchases.materialId, materialId)))
      .limit(1);
    return !!purchase;
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
    return purchase;
  }

  // Review operations
  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByMaterial(materialId: string): Promise<ReviewWithUser[]> {
    const results = await db
      .select()
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.materialId, materialId))
      .orderBy(desc(reviews.createdAt));

    return results
      .filter((r) => r.users)
      .map((r) => ({
        ...r.reviews,
        user: r.users!,
      }));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async getMaterialAverageRating(materialId: string): Promise<number> {
    const result = await db
      .select({ avg: sql<number>`AVG(${reviews.rating})` })
      .from(reviews)
      .where(eq(reviews.materialId, materialId));

    return result[0]?.avg || 0;
  }
}

export const storage = new DatabaseStorage();
