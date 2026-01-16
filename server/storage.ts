import { 
  type Product, 
  type InsertProduct, 
  type Contact, 
  type InsertContact 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.products = new Map();
    this.contacts = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    const products: Product[] = [
      {
        id: "1",
        name: "Shampoo Reparador Profissional",
        description: "Limpeza profunda com tecnologia de reconstrução molecular para cabelos danificados. Fórmula enriquecida com queratina e aminoácidos.",
        category: "Tratamento",
        price: 8900,
        image: "/products/shampoo.jpg",
        benefits: ["Reconstrução molecular", "Limpeza profunda", "Hidratação intensa", "Fortalecimento"],
        featured: true,
      },
      {
        id: "2",
        name: "Máscara Nutritiva Intensiva",
        description: "Tratamento intensivo com queratina hidrolisada e óleos essenciais de argan e macadâmia para nutrição profunda.",
        category: "Hidratação",
        price: 12900,
        image: "/products/mascara.jpg",
        benefits: ["Nutrição profunda", "Brilho intenso", "Maciez prolongada", "Redução de frizz"],
        featured: true,
      },
      {
        id: "3",
        name: "Sérum Finalizador Premium",
        description: "Proteção térmica e controle do frizz com tecnologia anti-quebra. Proteção até 230°C.",
        category: "Finalização",
        price: 7500,
        image: "/products/serum.jpg",
        benefits: ["Proteção térmica", "Anti-frizz", "Brilho natural", "Sem oleosidade"],
        featured: true,
      },
      {
        id: "4",
        name: "Condicionador Reconstrutor",
        description: "Fórmula avançada que sela as cutículas e proporciona desembaraço instantâneo com ação prolongada.",
        category: "Tratamento",
        price: 7900,
        image: "/products/condicionador.jpg",
        benefits: ["Desembaraço fácil", "Selagem de cutículas", "Proteção diária", "Maciez imediata"],
        featured: false,
      },
      {
        id: "5",
        name: "Óleo Capilar Restaurador",
        description: "Blend de óleos vegetais nobres para restauração profunda e brilho incomparável.",
        category: "Hidratação",
        price: 9900,
        image: "/products/oleo.jpg",
        benefits: ["Restauração profunda", "Brilho intenso", "Nutrição duradoura", "Proteção ambiental"],
        featured: false,
      },
      {
        id: "6",
        name: "Leave-in Protetor",
        description: "Proteção térmica e ambiental com ação anti-UV. Ideal para uso diário sem pesar.",
        category: "Finalização",
        price: 5900,
        image: "/products/leavein.jpg",
        benefits: ["Proteção UV", "Leveza", "Hidratação leve", "Facilidade no pentear"],
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

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export const storage = new MemStorage();
