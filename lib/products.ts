import fs from "fs/promises";
import path from "path";
import type { Product } from "@/types";
import { getFaultStatus } from "./faults";

// Products per page
const PRODUCTS_PER_PAGE = 6;

// Get all products from JSON file
async function getAllProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

// Get products with pagination
export async function getProducts(
  page = 1
): Promise<{ products: Product[]; totalPages: number }> {
  const allProducts = await getAllProducts();
  const faults = await getFaultStatus();

  // Apply jamPagination fault if active
  const effectivePage = faults.jamPagination ? 1 : page;

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (effectivePage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const products = allProducts.slice(startIndex, endIndex);

  return {
    products,
    totalPages,
  };
}

// Get a single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  const allProducts = await getAllProducts();
  const product = allProducts.find((p) => p.id === id) || null;
  const faults = await getFaultStatus();

  // Apply fakeOutOfStock fault if active
  if (product && faults.fakeOutOfStock) {
    return { ...product, stock: 0 };
  }

  return product;
}
