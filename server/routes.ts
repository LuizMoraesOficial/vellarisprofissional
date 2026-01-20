import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertProductSchema, insertSettingsSchema, insertProductLineSchema } from "@shared/schema";
import { z } from "zod";
import { randomBytes } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const adminTokens = new Map<string, number>();
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function isTokenValid(token: string): boolean {
  const expiry = adminTokens.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    adminTokens.delete(token);
    return false;
  }
  return true;
}

function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const token = authHeader.substring(7);
  if (!isTokenValid(token)) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/products", async (req, res) => {
    try {
      const { category, line } = req.query;
      
      if (line && typeof line === "string") {
        const products = await storage.getProductsByLine(line);
        return res.json(products);
      }
      
      if (category && typeof category === "string") {
        const products = await storage.getProductsByCategory(category);
        return res.json(products);
      }
      
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!ADMIN_PASSWORD) {
        return res.status(503).json({ error: "Admin não configurado" });
      }
      
      if (password === ADMIN_PASSWORD) {
        const token = generateToken();
        const expiry = Date.now() + TOKEN_EXPIRY_MS;
        adminTokens.set(token, expiry);
        return res.json({ success: true, token });
      }
      
      res.status(401).json({ error: "Invalid password" });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", verifyAdminToken, async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.substring(7);
      adminTokens.delete(token);
    }
    res.json({ success: true });
  });

  app.post("/api/admin/products", verifyAdminToken, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = insertProductSchema.partial();
      const validatedUpdates = updateSchema.parse(req.body);
      
      const product = await storage.updateProduct(id, validatedUpdates);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/admin/contacts", verifyAdminToken, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/admin/contacts/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await storage.getContactById(id);
      
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.delete("/api/admin/contacts/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteContact(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Contact not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  app.get("/api/admin/settings", verifyAdminToken, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", verifyAdminToken, async (req, res) => {
    try {
      const updateSchema = insertSettingsSchema.partial();
      const validatedUpdates = updateSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedUpdates);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.get("/api/settings/public", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json({
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        whatsapp: settings.whatsapp,
        instagram: settings.instagram,
        facebook: settings.facebook,
        youtube: settings.youtube,
        tiktok: settings.tiktok,
        address: settings.address,
        logoUrl: settings.logoUrl,
        heroImage: settings.heroImage,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        fiberForceImage: settings.fiberForceImage,
        hydraBalanceImage: settings.hydraBalanceImage,
        nutriOilImage: settings.nutriOilImage,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/product-lines", async (req, res) => {
    try {
      const lines = await storage.getAllProductLines();
      const activeLines = lines.filter(line => line.isActive);
      res.json(activeLines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product lines" });
    }
  });

  app.get("/api/product-lines/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const line = await storage.getProductLineBySlug(slug);
      
      if (!line) {
        return res.status(404).json({ error: "Product line not found" });
      }
      
      res.json(line);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product line" });
    }
  });

  app.get("/api/admin/product-lines", verifyAdminToken, async (req, res) => {
    try {
      const lines = await storage.getAllProductLines();
      res.json(lines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product lines" });
    }
  });

  app.get("/api/admin/product-lines/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const line = await storage.getProductLineById(id);
      
      if (!line) {
        return res.status(404).json({ error: "Product line not found" });
      }
      
      res.json(line);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product line" });
    }
  });

  app.post("/api/admin/product-lines", verifyAdminToken, async (req, res) => {
    try {
      const validatedData = insertProductLineSchema.parse(req.body);
      
      const existing = await storage.getProductLineBySlug(validatedData.slug);
      if (existing) {
        return res.status(400).json({ error: "Uma linha com esse slug já existe" });
      }
      
      const line = await storage.createProductLine(validatedData);
      res.status(201).json(line);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product line" });
    }
  });

  app.put("/api/admin/product-lines/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = insertProductLineSchema.partial();
      const validatedUpdates = updateSchema.parse(req.body);
      
      if (validatedUpdates.slug) {
        const existing = await storage.getProductLineBySlug(validatedUpdates.slug);
        if (existing && existing.id !== id) {
          return res.status(400).json({ error: "Uma linha com esse slug já existe" });
        }
      }
      
      const line = await storage.updateProductLine(id, validatedUpdates);
      
      if (!line) {
        return res.status(404).json({ error: "Product line not found" });
      }
      
      res.json(line);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product line" });
    }
  });

  app.delete("/api/admin/product-lines/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProductLine(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Product line not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product line" });
    }
  });

  return httpServer;
}
