import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  products,
  contacts,
  siteSettings,
  productLines,
  features,
  testimonials,
  customSections,
  customSectionItems,
  customSectionProducts,
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
  type InsertCustomSectionItem,
  type CustomSectionProduct,
  type InsertCustomSectionProduct,
} from "@shared/schema";
import type { IStorage } from "./storage";

export async function seedDatabase() {
  console.log("Checking if database needs seeding...");
  
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }
  
  console.log("Seeding database with initial data...");
  
  await db.insert(siteSettings).values({
    id: "main",
    contactEmail: "contato@vellaris.com.br",
    contactPhone: "(11) 99999-9999",
    whatsapp: "5511999999999",
    instagram: "https://instagram.com/vellaris",
    facebook: "https://facebook.com/vellaris",
    address: "Av. Paulista, 1000 - São Paulo, SP",
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
  });
  
  await db.insert(productLines).values([
    {
      id: randomUUID(),
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
      id: randomUUID(),
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
      id: randomUUID(),
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
  ]);
  
  await db.insert(products).values([
    {
      id: randomUUID(),
      name: "Shampoo Fiber Force",
      description: "Limpeza profunda com tecnologia de reconstrução molecular para cabelos danificados. Fórmula enriquecida com queratina e aminoácidos.",
      category: "Tratamento",
      line: "fiber-force",
      price: 8900,
      showPrice: true,
      image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400",
      benefits: ["Reconstrução molecular", "Limpeza profunda", "Fortalecimento", "Anti-quebra"],
      featured: true,
    },
    {
      id: randomUUID(),
      name: "Máscara Fiber Force",
      description: "Tratamento intensivo com queratina hidrolisada para reconstrução profunda de cabelos muito danificados.",
      category: "Tratamento",
      line: "fiber-force",
      price: 12900,
      showPrice: true,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
      benefits: ["Reconstrução intensa", "Força e resistência", "Elasticidade", "Recuperação"],
      featured: true,
    },
    {
      id: randomUUID(),
      name: "Shampoo Hydra Balance",
      description: "Limpeza suave com hidratação equilibrada para cabelos secos e ressecados.",
      category: "Hidratação",
      line: "hydra-balance",
      price: 7900,
      showPrice: true,
      image: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400",
      benefits: ["Hidratação profunda", "Equilíbrio do pH", "Maciez", "Brilho natural"],
      featured: true,
    },
    {
      id: randomUUID(),
      name: "Máscara Hydra Balance",
      description: "Máscara de hidratação profunda com ácido hialurônico e aloe vera para cabelos ressecados.",
      category: "Hidratação",
      line: "hydra-balance",
      price: 11900,
      showPrice: true,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
      benefits: ["Hidratação intensa", "Maciez prolongada", "Redução de frizz", "Brilho"],
      featured: false,
    },
    {
      id: randomUUID(),
      name: "Óleo Nutri Oil",
      description: "Blend de óleos vegetais nobres para nutrição profunda e brilho incomparável.",
      category: "Nutrição",
      line: "nutri-oil",
      price: 9900,
      showPrice: true,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
      benefits: ["Nutrição profunda", "Brilho intenso", "Sedosidade", "Proteção térmica"],
      featured: true,
    },
    {
      id: randomUUID(),
      name: "Leave-in Nutri Oil",
      description: "Finalizador nutritivo com óleos de argan e macadâmia. Ideal para uso diário.",
      category: "Nutrição",
      line: "nutri-oil",
      price: 5900,
      showPrice: true,
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400",
      benefits: ["Nutrição leve", "Brilho natural", "Anti-frizz", "Proteção UV"],
      featured: false,
    },
  ]);
  
  await db.insert(features).values([
    {
      id: randomUUID(),
      icon: "sparkles",
      title: "Tecnologia Avançada",
      description: "Fórmulas desenvolvidas com nanotecnologia para máxima absorção e resultados visíveis.",
      displayOrder: 1,
      isActive: true,
    },
    {
      id: randomUUID(),
      icon: "leaf",
      title: "Ingredientes Naturais",
      description: "Extratos botânicos premium e óleos essenciais cuidadosamente selecionados.",
      displayOrder: 2,
      isActive: true,
    },
    {
      id: randomUUID(),
      icon: "shield",
      title: "Proteção Completa",
      description: "Proteção térmica e ambiental para manter seus cabelos saudáveis.",
      displayOrder: 3,
      isActive: true,
    },
    {
      id: randomUUID(),
      icon: "droplets",
      title: "Hidratação Profunda",
      description: "Complexo hidratante que penetra na fibra capilar para resultados duradouros.",
      displayOrder: 4,
      isActive: true,
    },
  ]);
  
  await db.insert(testimonials).values([
    {
      id: randomUUID(),
      name: "Maria Silva",
      role: "Cabeleireira Profissional",
      content: "Os produtos VELLARIS transformaram completamente o trabalho no meu salão. Os clientes adoram os resultados!",
      rating: 5,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: randomUUID(),
      name: "Ana Santos",
      role: "Cliente",
      content: "Nunca tive um cabelo tão saudável e brilhante. A diferença é visível desde a primeira aplicação.",
      rating: 5,
      displayOrder: 2,
      isActive: true,
    },
    {
      id: randomUUID(),
      name: "Carla Oliveira",
      role: "Influenciadora de Beleza",
      content: "Qualidade profissional real. Recomendo para quem busca resultados extraordinários.",
      rating: 5,
      displayOrder: 3,
      isActive: true,
    },
  ]);
  
  console.log("Database seeded successfully!");
}

export class DatabaseStorage implements IStorage {
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProductsByLine(line: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.line, line));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values({ ...product, id: randomUUID() }).returning();
    return created;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [created] = await db.insert(contacts).values({ ...contact, id: randomUUID() }).returning();
    return created;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id)).returning();
    return result.length > 0;
  }

  async getSettings(): Promise<SiteSettings> {
    const [settings] = await db.select().from(siteSettings);
    if (settings) return settings;
    
    const defaultSettings = {
      id: "main",
      contactEmail: "contato@vellaris.com.br",
      contactPhone: "(11) 99999-9999",
      whatsapp: "5511999999999",
      instagram: "https://instagram.com/vellaris",
      facebook: "https://facebook.com/vellaris",
      address: "Av. Paulista, 1000 - São Paulo, SP",
      heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200",
      heroTitle: "Performance profissional para cabelos exigentes",
      heroSubtitle: "Tecnologia avançada, ativos selecionados e performance profissional para resultados de salão.",
      benefitsSectionTitle: "Excelência em cada fórmula",
      benefitsSectionSubtitle: "Cada produto VELLARIS é resultado de anos de pesquisa e desenvolvimento, combinando ciência e natureza.",
    };
    
    const [created] = await db.insert(siteSettings).values(defaultSettings).returning();
    return created;
  }

  async updateSettings(updates: Partial<InsertSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const [updated] = await db.update(siteSettings).set(updates).where(eq(siteSettings.id, current.id)).returning();
    return updated;
  }

  async getAllProductLines(): Promise<ProductLine[]> {
    return await db.select().from(productLines);
  }

  async getProductLineBySlug(slug: string): Promise<ProductLine | undefined> {
    const [line] = await db.select().from(productLines).where(eq(productLines.slug, slug));
    return line;
  }

  async getProductLineById(id: string): Promise<ProductLine | undefined> {
    const [line] = await db.select().from(productLines).where(eq(productLines.id, id));
    return line;
  }

  async createProductLine(line: InsertProductLine): Promise<ProductLine> {
    const [created] = await db.insert(productLines).values({ ...line, id: randomUUID() }).returning();
    return created;
  }

  async updateProductLine(id: string, updates: Partial<InsertProductLine>): Promise<ProductLine | undefined> {
    const [updated] = await db.update(productLines).set(updates).where(eq(productLines.id, id)).returning();
    return updated;
  }

  async deleteProductLine(id: string): Promise<boolean> {
    const result = await db.delete(productLines).where(eq(productLines.id, id)).returning();
    return result.length > 0;
  }

  async getAllFeatures(): Promise<Feature[]> {
    return await db.select().from(features);
  }

  async getFeatureById(id: string): Promise<Feature | undefined> {
    const [feature] = await db.select().from(features).where(eq(features.id, id));
    return feature;
  }

  async createFeature(feature: InsertFeature): Promise<Feature> {
    const [created] = await db.insert(features).values({ ...feature, id: randomUUID() }).returning();
    return created;
  }

  async updateFeature(id: string, updates: Partial<InsertFeature>): Promise<Feature | undefined> {
    const [updated] = await db.update(features).set(updates).where(eq(features.id, id)).returning();
    return updated;
  }

  async deleteFeature(id: string): Promise<boolean> {
    const result = await db.delete(features).where(eq(features.id, id)).returning();
    return result.length > 0;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getTestimonialById(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [created] = await db.insert(testimonials).values({ ...testimonial, id: randomUUID() }).returning();
    return created;
  }

  async updateTestimonial(id: string, updates: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updated] = await db.update(testimonials).set(updates).where(eq(testimonials.id, id)).returning();
    return updated;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }

  async getAllCustomSections(): Promise<CustomSection[]> {
    return await db.select().from(customSections);
  }

  async getCustomSectionById(id: string): Promise<CustomSection | undefined> {
    const [section] = await db.select().from(customSections).where(eq(customSections.id, id));
    return section;
  }

  async getCustomSectionBySlug(slug: string): Promise<CustomSection | undefined> {
    const [section] = await db.select().from(customSections).where(eq(customSections.slug, slug));
    return section;
  }

  async createCustomSection(section: InsertCustomSection): Promise<CustomSection> {
    const [created] = await db.insert(customSections).values({ ...section, id: randomUUID() }).returning();
    return created;
  }

  async updateCustomSection(id: string, updates: Partial<InsertCustomSection>): Promise<CustomSection | undefined> {
    const [updated] = await db.update(customSections).set(updates).where(eq(customSections.id, id)).returning();
    return updated;
  }

  async deleteCustomSection(id: string): Promise<boolean> {
    await db.delete(customSectionItems).where(eq(customSectionItems.sectionId, id));
    const result = await db.delete(customSections).where(eq(customSections.id, id)).returning();
    return result.length > 0;
  }

  async getItemsBySectionId(sectionId: string): Promise<CustomSectionItem[]> {
    return await db.select().from(customSectionItems).where(eq(customSectionItems.sectionId, sectionId));
  }

  async getCustomSectionItemById(id: string): Promise<CustomSectionItem | undefined> {
    const [item] = await db.select().from(customSectionItems).where(eq(customSectionItems.id, id));
    return item;
  }

  async createCustomSectionItem(item: InsertCustomSectionItem): Promise<CustomSectionItem> {
    const [created] = await db.insert(customSectionItems).values({ ...item, id: randomUUID() }).returning();
    return created;
  }

  async updateCustomSectionItem(id: string, updates: Partial<InsertCustomSectionItem>): Promise<CustomSectionItem | undefined> {
    const [updated] = await db.update(customSectionItems).set(updates).where(eq(customSectionItems.id, id)).returning();
    return updated;
  }

  async deleteCustomSectionItem(id: string): Promise<boolean> {
    const result = await db.delete(customSectionItems).where(eq(customSectionItems.id, id)).returning();
    return result.length > 0;
  }

  async getProductsBySectionId(sectionId: string): Promise<CustomSectionProduct[]> {
    return await db.select().from(customSectionProducts).where(eq(customSectionProducts.sectionId, sectionId));
  }

  async addProductToSection(sectionId: string, productId: string, displayOrder: number = 0): Promise<CustomSectionProduct> {
    const [created] = await db.insert(customSectionProducts).values({ 
      id: randomUUID(),
      sectionId, 
      productId,
      displayOrder
    }).returning();
    return created;
  }

  async removeProductFromSection(sectionId: string, productId: string): Promise<boolean> {
    const result = await db.delete(customSectionProducts)
      .where(eq(customSectionProducts.sectionId, sectionId))
      .returning();
    return result.length > 0;
  }

  async setProductsForSection(sectionId: string, productIds: string[]): Promise<CustomSectionProduct[]> {
    await db.delete(customSectionProducts).where(eq(customSectionProducts.sectionId, sectionId));
    
    if (productIds.length === 0) return [];
    
    const productsToInsert = productIds.map((productId, index) => ({
      id: randomUUID(),
      sectionId,
      productId,
      displayOrder: index
    }));
    
    const created = await db.insert(customSectionProducts).values(productsToInsert).returning();
    return created;
  }
}
