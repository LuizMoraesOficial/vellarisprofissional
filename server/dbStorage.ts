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
} from "@shared/schema";
import type { IStorage } from "./storage";

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
}
