import { 
  type Product, 
  type InsertProduct, 
  type Contact, 
  type InsertContact,
  type SiteSettings,
  type InsertSettings,
  type ProductLine,
  type InsertProductLine,
  type Feature,
  type InsertFeature,
  type Testimonial,
  type InsertTestimonial,
  type CustomSection,
  type InsertCustomSection,
  type CustomSectionItem,
  type InsertCustomSectionItem
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
  getAllFeatures(): Promise<Feature[]>;
  getFeatureById(id: string): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeature(id: string, updates: Partial<InsertFeature>): Promise<Feature | undefined>;
  deleteFeature(id: string): Promise<boolean>;
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, updates: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  getAllCustomSections(): Promise<CustomSection[]>;
  getCustomSectionById(id: string): Promise<CustomSection | undefined>;
  getCustomSectionBySlug(slug: string): Promise<CustomSection | undefined>;
  createCustomSection(section: InsertCustomSection): Promise<CustomSection>;
  updateCustomSection(id: string, updates: Partial<InsertCustomSection>): Promise<CustomSection | undefined>;
  deleteCustomSection(id: string): Promise<boolean>;
  getItemsBySectionId(sectionId: string): Promise<CustomSectionItem[]>;
  getCustomSectionItemById(id: string): Promise<CustomSectionItem | undefined>;
  createCustomSectionItem(item: InsertCustomSectionItem): Promise<CustomSectionItem>;
  updateCustomSectionItem(id: string, updates: Partial<InsertCustomSectionItem>): Promise<CustomSectionItem | undefined>;
  deleteCustomSectionItem(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private contacts: Map<string, Contact>;
  private productLines: Map<string, ProductLine>;
  private features: Map<string, Feature>;
  private testimonials: Map<string, Testimonial>;
  private customSections: Map<string, CustomSection>;
  private customSectionItems: Map<string, CustomSectionItem>;
  private settings: SiteSettings;

  constructor() {
    this.products = new Map();
    this.contacts = new Map();
    this.productLines = new Map();
    this.customSections = new Map();
    this.customSectionItems = new Map();
    this.features = new Map();
    this.testimonials = new Map();
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
      benefitsSectionTitle: "Excelência em cada fórmula",
      benefitsSectionSubtitle: "Cada produto VELLARIS é resultado de anos de pesquisa e desenvolvimento, combinando ciência e natureza.",
      benefitsSectionLabel: "Por que VELLARIS",
      testimonialsSectionTitle: "O que dizem sobre nós",
      testimonialsSectionSubtitle: "Profissionais e clientes compartilham suas experiências com os produtos VELLARIS.",
      testimonialsSectionLabel: "Depoimentos",
      testimonialsSectionImage: null,
      ctaSectionTitle: "Pronto para transformar seus cabelos?",
      ctaSectionSubtitle: "Entre em contato conosco e descubra como os produtos VELLARIS podem elevar os resultados do seu salão ou cuidados pessoais.",
      featuredProductsSectionEnabled: true,
      contactPageTitle: "Entre em Contato",
      contactPageSubtitle: "Estamos aqui para ajudar. Envie sua mensagem e nossa equipe entrará em contato o mais breve possível.",
      contactPageLabel: "Fale Conosco",
      contactPageProfessionalTitle: "Para Profissionais",
      contactPageProfessionalText: "Se você é proprietário de salão ou profissional da beleza, temos condições especiais para você. Entre em contato para conhecer nossa linha profissional e condições de parceria.",
      contactPageProfessionalEmail: "profissionais@vellaris.com.br",
      footerDescription: "Linha profissional de cuidados capilares para resultados extraordinários. Tecnologia avançada para cabelos saudáveis e brilhantes.",
    };
    this.seedProductLines();
    this.seedProducts();
    this.seedFeatures();
    this.seedTestimonials();
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
      line: insertProduct.line,
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

  private seedFeatures() {
    const featuresData: Feature[] = [
      {
        id: "1",
        icon: "sparkles",
        title: "Tecnologia Avançada",
        description: "Fórmulas desenvolvidas com nanotecnologia para máxima absorção e resultados visíveis.",
        displayOrder: 1,
        isActive: true,
      },
      {
        id: "2",
        icon: "leaf",
        title: "Ingredientes Naturais",
        description: "Extratos botânicos premium e óleos essenciais cuidadosamente selecionados.",
        displayOrder: 2,
        isActive: true,
      },
      {
        id: "3",
        icon: "shield",
        title: "Proteção Completa",
        description: "Proteção térmica e ambiental para manter seus cabelos saudáveis.",
        displayOrder: 3,
        isActive: true,
      },
      {
        id: "4",
        icon: "droplets",
        title: "Hidratação Profunda",
        description: "Complexo hidratante que penetra na fibra capilar para resultados duradouros.",
        displayOrder: 4,
        isActive: true,
      },
    ];
    featuresData.forEach((f) => this.features.set(f.id, f));
  }

  private seedTestimonials() {
    const testimonialsData: Testimonial[] = [
      {
        id: "1",
        name: "Maria Silva",
        role: "Cabeleireira Profissional",
        content: "Os produtos VELLARIS transformaram completamente o trabalho no meu salão. Os clientes adoram os resultados!",
        rating: 5,
        displayOrder: 1,
        isActive: true,
      },
      {
        id: "2",
        name: "Ana Santos",
        role: "Cliente",
        content: "Nunca tive um cabelo tão saudável e brilhante. A diferença é visível desde a primeira aplicação.",
        rating: 5,
        displayOrder: 2,
        isActive: true,
      },
      {
        id: "3",
        name: "Carla Oliveira",
        role: "Influenciadora de Beleza",
        content: "Qualidade profissional real. Recomendo para quem busca resultados extraordinários.",
        rating: 5,
        displayOrder: 3,
        isActive: true,
      },
    ];
    testimonialsData.forEach((t) => this.testimonials.set(t.id, t));
  }

  async getAllFeatures(): Promise<Feature[]> {
    const features = Array.from(this.features.values());
    return features.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getFeatureById(id: string): Promise<Feature | undefined> {
    return this.features.get(id);
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const id = randomUUID();
    const feature: Feature = {
      ...insertFeature,
      id,
      icon: insertFeature.icon || "sparkles",
      displayOrder: insertFeature.displayOrder ?? 0,
      isActive: insertFeature.isActive ?? true,
    };
    this.features.set(id, feature);
    return feature;
  }

  async updateFeature(id: string, updates: Partial<InsertFeature>): Promise<Feature | undefined> {
    const existing = this.features.get(id);
    if (!existing) return undefined;

    const updated: Feature = {
      ...existing,
      ...updates,
      id,
    };
    this.features.set(id, updated);
    return updated;
  }

  async deleteFeature(id: string): Promise<boolean> {
    return this.features.delete(id);
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    const testimonials = Array.from(this.testimonials.values());
    return testimonials.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getTestimonialById(id: string): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      rating: insertTestimonial.rating ?? 5,
      displayOrder: insertTestimonial.displayOrder ?? 0,
      isActive: insertTestimonial.isActive ?? true,
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: string, updates: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existing = this.testimonials.get(id);
    if (!existing) return undefined;

    const updated: Testimonial = {
      ...existing,
      ...updates,
      id,
    };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  async getAllCustomSections(): Promise<CustomSection[]> {
    const sections = Array.from(this.customSections.values());
    return sections.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getCustomSectionById(id: string): Promise<CustomSection | undefined> {
    return this.customSections.get(id);
  }

  async getCustomSectionBySlug(slug: string): Promise<CustomSection | undefined> {
    return Array.from(this.customSections.values()).find(s => s.slug === slug);
  }

  async createCustomSection(insertSection: InsertCustomSection): Promise<CustomSection> {
    const id = randomUUID();
    const section: CustomSection = {
      ...insertSection,
      id,
      type: insertSection.type || "products",
      subtitle: insertSection.subtitle || null,
      label: insertSection.label || null,
      displayOrder: insertSection.displayOrder ?? 0,
      isActive: insertSection.isActive ?? true,
      position: insertSection.position || "after-product-lines",
    };
    this.customSections.set(id, section);
    return section;
  }

  async updateCustomSection(id: string, updates: Partial<InsertCustomSection>): Promise<CustomSection | undefined> {
    const existing = this.customSections.get(id);
    if (!existing) return undefined;

    const updated: CustomSection = {
      ...existing,
      ...updates,
      id,
    };
    this.customSections.set(id, updated);
    return updated;
  }

  async deleteCustomSection(id: string): Promise<boolean> {
    const items = await this.getItemsBySectionId(id);
    for (const item of items) {
      this.customSectionItems.delete(item.id);
    }
    return this.customSections.delete(id);
  }

  async getItemsBySectionId(sectionId: string): Promise<CustomSectionItem[]> {
    const items = Array.from(this.customSectionItems.values())
      .filter(item => item.sectionId === sectionId);
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getCustomSectionItemById(id: string): Promise<CustomSectionItem | undefined> {
    return this.customSectionItems.get(id);
  }

  async createCustomSectionItem(insertItem: InsertCustomSectionItem): Promise<CustomSectionItem> {
    const id = randomUUID();
    const item: CustomSectionItem = {
      ...insertItem,
      id,
      description: insertItem.description || null,
      image: insertItem.image || null,
      videoUrl: insertItem.videoUrl || null,
      link: insertItem.link || null,
      displayOrder: insertItem.displayOrder ?? 0,
      isActive: insertItem.isActive ?? true,
    };
    this.customSectionItems.set(id, item);
    return item;
  }

  async updateCustomSectionItem(id: string, updates: Partial<InsertCustomSectionItem>): Promise<CustomSectionItem | undefined> {
    const existing = this.customSectionItems.get(id);
    if (!existing) return undefined;

    const updated: CustomSectionItem = {
      ...existing,
      ...updates,
      id,
    };
    this.customSectionItems.set(id, updated);
    return updated;
  }

  async deleteCustomSectionItem(id: string): Promise<boolean> {
    return this.customSectionItems.delete(id);
  }
}

export const storage = new MemStorage();
