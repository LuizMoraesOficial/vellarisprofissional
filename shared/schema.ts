import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const features = pgTable("features", {
  id: varchar("id", { length: 50 }).primaryKey(),
  icon: text("icon").notNull().default("sparkles"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
});

export const productLines = pgTable("product_lines", {
  id: varchar("id", { length: 50 }).primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  heroImage: text("hero_image"),
  featuredImage: text("featured_image"),
  accentColor: text("accent_color").notNull().default("#D4AF37"),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
});

export const products = pgTable("products", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  line: text("line").notNull(),
  price: integer("price"),
  showPrice: boolean("show_price").default(true),
  image: text("image").notNull(),
  benefits: text("benefits").array().notNull(),
  featured: boolean("featured").default(false),
});

export const contacts = pgTable("contacts", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id", { length: 50 }).primaryKey(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  youtube: text("youtube"),
  tiktok: text("tiktok"),
  address: text("address"),
  logoUrl: text("logo_url"),
  heroImage: text("hero_image"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  fiberForceImage: text("fiber_force_image"),
  hydraBalanceImage: text("hydra_balance_image"),
  nutriOilImage: text("nutri_oil_image"),
  benefitsSectionTitle: text("benefits_section_title"),
  benefitsSectionSubtitle: text("benefits_section_subtitle"),
  benefitsSectionLabel: text("benefits_section_label"),
  testimonialsSectionTitle: text("testimonials_section_title"),
  testimonialsSectionSubtitle: text("testimonials_section_subtitle"),
  testimonialsSectionLabel: text("testimonials_section_label"),
  testimonialsSectionImage: text("testimonials_section_image"),
  ctaSectionTitle: text("cta_section_title"),
  ctaSectionSubtitle: text("cta_section_subtitle"),
  contactPageTitle: text("contact_page_title"),
  contactPageSubtitle: text("contact_page_subtitle"),
  contactPageLabel: text("contact_page_label"),
  contactPageProfessionalTitle: text("contact_page_professional_title"),
  contactPageProfessionalText: text("contact_page_professional_text"),
  contactPageProfessionalEmail: text("contact_page_professional_email"),
  footerDescription: text("footer_description"),
});

export const insertFeatureSchema = createInsertSchema(features).omit({ id: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });
export const insertProductLineSchema = createInsertSchema(productLines).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertSettingsSchema = createInsertSchema(siteSettings).omit({ id: true });

export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertProductLine = z.infer<typeof insertProductLineSchema>;
export type ProductLine = typeof productLines.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
