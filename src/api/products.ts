import { api } from "./api";
import { Platform } from 'react-native';

export type CategoriaResumo = {
  id: number;
  nome: string;
};

export type Product = {
  id: number;
  nome: string;
  preco: number;
  foto: string;
  descricao: string;
  quantidadeEstoque: number;
  categoria?: CategoriaResumo;
};

function normalizeImageUrl(url: string | null | undefined, productId: number): string {
  const baseURL = api.defaults.baseURL || 'http://192.168.1.11:8080';
  
  if (!url || url.trim() === '') {
    return `${baseURL}/imagens/${productId}.jpg?t=${Date.now()}`;
  }

  let normalizedUrl = url;
  if (url.includes('localhost:8080')) {
    normalizedUrl = url.replace(/http:\/\/localhost:8080/g, baseURL);
  }

  if (normalizedUrl.startsWith('/')) {
    normalizedUrl = `${baseURL}${normalizedUrl}`;
  }

  if (!normalizedUrl.includes('?')) {
    normalizedUrl = `${normalizedUrl}?t=${Date.now()}`;
  } else if (!normalizedUrl.includes('t=')) {
    normalizedUrl = `${normalizedUrl}&t=${Date.now()}`;
  }
  
  return normalizedUrl;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get("/produtos");
    const products = response.data;

    return products.map((product: Product) => ({
      ...product,
      foto: normalizeImageUrl(product.foto, product.id)
    }));
  } catch (error: any) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}
