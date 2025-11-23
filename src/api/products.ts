import { api } from "./api";

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category?: string;
};

export async function getProducts(): Promise<Product[]> {
  const response = await api.get("/products");
  return response.data;
}
