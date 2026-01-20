import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
});

export const insertProductLineSchema = createInsertSchema(productLines).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertSettingsSchema = createInsertSchema(siteSettings).omit({ id: true });

export type InsertProductLine = z.infer<typeof insertProductLineSchema>;
export type ProductLine = typeof productLines.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
