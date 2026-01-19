import { 
  type Product, 
  type InsertProduct, 
  type Contact, 
  type InsertContact,
  type SiteSettings,
  type InsertSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByLine(line: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
  getSettings(): Promise<SiteSettings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<SiteSettings>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private contacts: Map<string, Contact>;
  private settings: SiteSettings;

  constructor() {
    this.products = new Map();
    this.contacts = new Map();
    this.settings = {
      id: "main",
      contactEmail: "contato@vellaris.com.br",
      contactPhone: "(11) 99999-9999",
      whatsapp: "5511999999999",
      instagram: "https://instagram.com/vellaris",
      facebook: "https://facebook.com/vellaris",
      youtube: null,
      tiktok: null,
      address: "Av. Paulista, 1000 - São Paulo, SP",
    };
    this.seedProducts();
  }

  private seedProducts() {
    const products: Product[] = [
      {
        id: "1",
        name: "Shampoo Fiber Force",
        description: "Limpeza profunda com tecnologia de reconstrução molecular para cabelos danificados. Fórmula enriquecida com queratina e aminoácidos.",
        category: "Tratamento",
        line: "fiber-force",
        price: 8900,
        image: "/products/shampoo.jpg",
        benefits: ["Reconstrução molecular", "Limpeza profunda", "Fortalecimento", "Anti-quebra"],
        featured: true,
      },
      {
        id: "2",
        name: "Máscara Fiber Force",
        description: "Tratamento intensivo com queratina hidrolisada para reconstrução profunda de cabelos muito danificados.",
        category: "Tratamento",
        line: "fiber-force",
        price: 12900,
        image: "/products/mascara.jpg",
        benefits: ["Reconstrução intensa", "Força e resistência", "Elasticidade", "Recuperação"],
        featured: true,
      },
      {
        id: "3",
        name: "Shampoo Hydra Balance",
        description: "Limpeza suave com hidratação equilibrada para cabelos secos e ressecados.",
        category: "Hidratação",
        line: "hydra-balance",
        price: 7900,
        image: "/products/shampoo-hydra.jpg",
        benefits: ["Hidratação profunda", "Equilíbrio do pH", "Maciez", "Brilho natural"],
        featured: true,
      },
      {
        id: "4",
        name: "Máscara Hydra Balance",
        description: "Máscara de hidratação profunda com ácido hialurônico e aloe vera para cabelos ressecados.",
        category: "Hidratação",
        line: "hydra-balance",
        price: 11900,
        image: "/products/mascara-hydra.jpg",
        benefits: ["Hidratação intensa", "Maciez prolongada", "Redução de frizz", "Brilho"],
        featured: false,
      },
      {
        id: "5",
        name: "Óleo Nutri Oil",
        description: "Blend de óleos vegetais nobres para nutrição profunda e brilho incomparável.",
        category: "Nutrição",
        line: "nutri-oil",
        price: 9900,
        image: "/products/oleo.jpg",
        benefits: ["Nutrição profunda", "Brilho intenso", "Sedosidade", "Proteção térmica"],
        featured: true,
      },
      {
        id: "6",
        name: "Leave-in Nutri Oil",
        description: "Finalizador nutritivo com óleos de argan e macadâmia. Ideal para uso diário.",
        category: "Nutrição",
        line: "nutri-oil",
        price: 5900,
        image: "/products/leavein.jpg",
        benefits: ["Nutrição leve", "Brilho natural", "Anti-frizz", "Proteção UV"],
        featured: false,
      },
    ];

    products.forEach((product) => {
      this.products.set(product.id, product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getProductsByLine(line: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.line.toLowerCase() === line.toLowerCase()
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      line: insertProduct.line || "fiber-force",
      featured: insertProduct.featured ?? null
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = {
      ...existing,
      ...updates,
      id,
      featured: updates.featured !== undefined ? updates.featured : existing.featured,
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id,
      phone: insertContact.phone ?? null,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    const contacts = Array.from(this.contacts.values());
    return contacts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }

  async getSettings(): Promise<SiteSettings> {
    return this.settings;
  }

  async updateSettings(updates: Partial<InsertSettings>): Promise<SiteSettings> {
    this.settings = {
      ...this.settings,
      ...updates,
    };
    return this.settings;
  }
}

export const storage = new MemStorage();
