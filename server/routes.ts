import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import {
  insertUserSchema,
  insertMaterialSchema,
  insertPurchaseSchema,
  insertReviewSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

// Extend session data
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "inha-notes-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // ==================== AUTH ROUTES ====================
  
  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      // Validate input
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        const error = fromError(validation.error);
        return res.status(400).json({ message: error.toString() });
      }

      const { email, password, name, department } = validation.data;

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "이미 존재하는 이메일입니다" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        department,
      });

      // Set session
      req.session.userId = user.id;

      res.json({ id: user.id, email: user.email, name: user.name, department: user.department });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "회원가입 중 오류가 발생했습니다" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
      }

      // Set session
      req.session.userId = user.id;

      res.json({ id: user.id, email: user.email, name: user.name, department: user.department });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "로그인 중 오류가 발생했습니다" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "로그아웃 중 오류가 발생했습니다" });
      }
      res.json({ message: "로그아웃되었습니다" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });
      }

      res.json({ id: user.id, email: user.email, name: user.name, department: user.department });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "사용자 정보 조회 중 오류가 발생했습니다" });
    }
  });

  // ==================== MATERIAL ROUTES ====================

  // Get all materials (with filters)
  app.get("/api/materials", async (req, res) => {
    try {
      const { category, minPrice, maxPrice, search } = req.query;

      const materials = await storage.getMaterials({
        category: category as string,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        search: search as string,
      });

      res.json(materials);
    } catch (error: any) {
      console.error("Get materials error:", error);
      res.status(500).json({ message: "자료 조회 중 오류가 발생했습니다" });
    }
  });

  // Get single material
  app.get("/api/materials/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const material = await storage.getMaterialWithSeller(id);
      if (!material) {
        return res.status(404).json({ message: "자료를 찾을 수 없습니다" });
      }

      // Increment view count
      await storage.incrementMaterialView(id);

      res.json(material);
    } catch (error: any) {
      console.error("Get material error:", error);
      res.status(500).json({ message: "자료 조회 중 오류가 발생했습니다" });
    }
  });

  // Create material
  app.post("/api/materials", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Validate input
      const validation = insertMaterialSchema.safeParse({
        ...req.body,
        sellerId: userId,
      });
      if (!validation.success) {
        const error = fromError(validation.error);
        return res.status(400).json({ message: error.toString() });
      }

      const material = await storage.createMaterial(validation.data);
      res.json(material);
    } catch (error: any) {
      console.error("Create material error:", error);
      res.status(500).json({ message: "자료 등록 중 오류가 발생했습니다" });
    }
  });

  // Update material
  app.put("/api/materials/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId!;

      // Check if material belongs to user
      const existingMaterial = await storage.getMaterial(id);
      if (!existingMaterial) {
        return res.status(404).json({ message: "자료를 찾을 수 없습니다" });
      }
      if (existingMaterial.sellerId !== userId) {
        return res.status(403).json({ message: "권한이 없습니다" });
      }

      const material = await storage.updateMaterial(id, req.body);
      res.json(material);
    } catch (error: any) {
      console.error("Update material error:", error);
      res.status(500).json({ message: "자료 수정 중 오류가 발생했습니다" });
    }
  });

  // ==================== PURCHASE ROUTES ====================

  // Create purchase
  app.post("/api/purchases", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Validate input
      const validation = insertPurchaseSchema.safeParse({
        ...req.body,
        buyerId: userId,
      });
      if (!validation.success) {
        const error = fromError(validation.error);
        return res.status(400).json({ message: error.toString() });
      }

      const { materialId, amount } = validation.data;

      // Check if already purchased
      const alreadyPurchased = await storage.checkPurchaseExists(userId, materialId);
      if (alreadyPurchased) {
        return res.status(400).json({ message: "이미 구매한 자료입니다" });
      }

      // Get material to verify amount
      const material = await storage.getMaterial(materialId);
      if (!material) {
        return res.status(404).json({ message: "자료를 찾을 수 없습니다" });
      }

      // Cannot buy own material
      if (material.sellerId === userId) {
        return res.status(400).json({ message: "본인의 자료는 구매할 수 없습니다" });
      }

      // Create purchase
      const purchase = await storage.createPurchase({
        buyerId: userId,
        materialId,
        amount,
        status: "completed",
      });

      // Increment purchase count
      await storage.incrementMaterialPurchase(materialId);

      res.json(purchase);
    } catch (error: any) {
      console.error("Create purchase error:", error);
      res.status(500).json({ message: "구매 중 오류가 발생했습니다" });
    }
  });

  // Get my purchases
  app.get("/api/purchases/my", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const purchases = await storage.getPurchasesByBuyer(userId);
      res.json(purchases);
    } catch (error: any) {
      console.error("Get purchases error:", error);
      res.status(500).json({ message: "구매 내역 조회 중 오류가 발생했습니다" });
    }
  });

  // Check if purchased
  app.get("/api/purchases/check/:materialId", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { materialId } = req.params;

      const purchased = await storage.checkPurchaseExists(userId, materialId);
      res.json({ purchased });
    } catch (error: any) {
      console.error("Check purchase error:", error);
      res.status(500).json({ message: "구매 확인 중 오류가 발생했습니다" });
    }
  });

  // ==================== REVIEW ROUTES ====================

  // Get reviews for material
  app.get("/api/reviews/:materialId", async (req, res) => {
    try {
      const { materialId } = req.params;
      const reviews = await storage.getReviewsByMaterial(materialId);
      res.json(reviews);
    } catch (error: any) {
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "후기 조회 중 오류가 발생했습니다" });
    }
  });

  // Create review
  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Validate input
      const validation = insertReviewSchema.safeParse({
        ...req.body,
        userId,
      });
      if (!validation.success) {
        const error = fromError(validation.error);
        return res.status(400).json({ message: error.toString() });
      }

      const { purchaseId, materialId, rating, comment } = validation.data;

      // Verify purchase
      const purchase = await storage.getPurchase(purchaseId);
      if (!purchase || purchase.buyerId !== userId) {
        return res.status(403).json({ message: "구매한 자료에만 후기를 작성할 수 있습니다" });
      }

      const review = await storage.createReview({
        purchaseId,
        materialId,
        userId,
        rating,
        comment,
      });

      res.json(review);
    } catch (error: any) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "후기 작성 중 오류가 발생했습니다" });
    }
  });

  // ==================== SELLER ROUTES ====================

  // Get seller's materials
  app.get("/api/seller/materials", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const materials = await storage.getMaterials({ sellerId: userId });
      res.json(materials);
    } catch (error: any) {
      console.error("Get seller materials error:", error);
      res.status(500).json({ message: "판매 자료 조회 중 오류가 발생했습니다" });
    }
  });

  // Get seller stats
  app.get("/api/seller/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const materials = await storage.getMaterials({ sellerId: userId });

      let totalRevenue = 0;
      let totalPurchases = 0;
      let totalRating = 0;
      let ratingCount = 0;

      for (const material of materials) {
        const purchases = await storage.getPurchasesByMaterial(material.id);
        totalPurchases += purchases.length;
        totalRevenue += purchases.reduce((sum, p) => sum + p.amount, 0);

        const avgRating = await storage.getMaterialAverageRating(material.id);
        if (avgRating > 0) {
          totalRating += avgRating;
          ratingCount++;
        }
      }

      res.json({
        totalMaterials: materials.length,
        totalRevenue,
        totalPurchases,
        averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
      });
    } catch (error: any) {
      console.error("Get seller stats error:", error);
      res.status(500).json({ message: "통계 조회 중 오류가 발생했습니다" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
