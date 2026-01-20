import { 
  type Product, 
  type InsertProduct, 
  type Contact, 
  type InsertContact,
  type SiteSettings,
  type InsertSettings,
  type ProductLine,
  type InsertProductLine
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
  getAllProductLines(): Promise<ProductLine[]>;
  getProductLineBySlug(slug: string): Promise<ProductLine | undefined>;
  getProductLineById(id: string): Promise<ProductLine | undefined>;
  createProductLine(line: InsertProductLine): Promise<ProductLine>;
  updateProductLine(id: string, updates: Partial<InsertProductLine>): Promise<ProductLine | undefined>;
  deleteProductLine(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private contacts: Map<string, Contact>;
  private productLines: Map<string, ProductLine>;
  private settings: SiteSettings;

  constructor() {
    this.products = new Map();
    this.contacts = new Map();
    this.productLines = new Map();
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
      logoUrl: null,
      heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200",
      heroTitle: "Performance profissional para cabelos exigentes",
      heroSubtitle: "Tecnologia avançada, ativos selecionados e performance profissional para resultados de salão.",
      fiberForceImage: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600",
      hydraBalanceImage: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=600",
      nutriOilImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600",
    };
    this.seedProductLines();
    this.seedProducts();
  }

  private seedProductLines() {
    const lines: ProductLine[] = [
      {
        id: "1",
        slug: "fiber-force",
        name: "Fiber Force",
        description: "Linha de reconstrução profissional para cabelos danificados e quebradiços",
        longDescription: "Tecnologia avançada de reconstrução que penetra na fibra capilar, restaurando a força e elasticidade dos fios. Ideal para cabelos que passaram por processos químicos intensos.",
        heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200",
        featuredImage: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600",
        accentColor: "#f97316",
        isActive: true,
        displayOrder: 1,
      },
      {
        id: "2",
        slug: "hydra-balance",
        name: "Hydra Balance",
        description: "Linha de hidratação profunda para cabelos secos e ressecados",
        longDescription: "Fórmula exclusiva com ácido hialurônico e pantenol que proporciona hidratação profunda e duradoura, devolvendo a maciez e o brilho natural dos fios.",
        heroImage: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=1200",
        featuredImage: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=600",
        accentColor: "#a855f7",
        isActive: true,
        displayOrder: 2,
      },
      {
        id: "3",
        slug: "nutri-oil",
        name: "Nutri Oil",
        description: "Linha de nutrição e brilho para cabelos opacos e sem vida",
        longDescription: "Blend exclusivo de óleos essenciais como argan, macadâmia e pracaxi que nutre profundamente os fios, proporcionando brilho extraordinário e proteção contra danos externos.",
        heroImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1200",
        featuredImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600",
        accentColor: "#ca8a04",
        isActive: true,
        displayOrder: 3,
      },
    ];

    lines.forEach((line) => {
      this.productLines.set(line.id, line);
    });
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
        showPrice: true,
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
        showPrice: true,
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
        showPrice: true,
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
        showPrice: true,
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
        showPrice: true,
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
        showPrice: true,
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
      price: insertProduct.price ?? null,
      showPrice: insertProduct.showPrice ?? true,
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

  async getAllProductLines(): Promise<ProductLine[]> {
    const lines = Array.from(this.productLines.values());
    return lines.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getProductLineBySlug(slug: string): Promise<ProductLine | undefined> {
    return Array.from(this.productLines.values()).find(
      (line) => line.slug.toLowerCase() === slug.toLowerCase()
    );
  }

  async getProductLineById(id: string): Promise<ProductLine | undefined> {
    return this.productLines.get(id);
  }

  async createProductLine(insertLine: InsertProductLine): Promise<ProductLine> {
    const id = randomUUID();
    const line: ProductLine = {
      ...insertLine,
      id,
      longDescription: insertLine.longDescription ?? null,
      heroImage: insertLine.heroImage ?? null,
      featuredImage: insertLine.featuredImage ?? null,
      accentColor: insertLine.accentColor || "#D4AF37",
      isActive: insertLine.isActive ?? true,
      displayOrder: insertLine.displayOrder ?? 0,
    };
    this.productLines.set(id, line);
    return line;
  }

  async updateProductLine(id: string, updates: Partial<InsertProductLine>): Promise<ProductLine | undefined> {
    const existing = this.productLines.get(id);
    if (!existing) return undefined;

    const updated: ProductLine = {
      ...existing,
      ...updates,
      id,
    };
    this.productLines.set(id, updated);
    return updated;
  }

  async deleteProductLine(id: string): Promise<boolean> {
    return this.productLines.delete(id);
  }
}

export const storage = new MemStorage();
