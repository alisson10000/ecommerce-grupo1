import { api } from "./api";
import { Platform } from 'react-native';

export type CategoriaResumo = {
  id: number;
  nome: string;
};

export type CategoriaDTO = {
  id: number;
  nome: string;
  descricao?: string;
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

export type UpdateProductDTO = {
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoriaId: number;
};

function normalizeImageUrl(url: string | null | undefined, productId: number): string {
  const baseURL = api.defaults.baseURL || 'http://192.168.100.5:8080';
  
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

export async function getProductById(id: number): Promise<Product> {
  try {
    const response = await api.get(`/produtos/${id}`);
    const product = response.data;

    return {
      ...product,
      foto: normalizeImageUrl(product.foto, product.id)
    };
  } catch (error: any) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await api.delete(`/produtos/${id}`);
  } catch (error: any) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
}

export async function getCategories(): Promise<CategoriaDTO[]> {
  try {
    const response = await api.get("/categorias");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
}

export type CreateProductDTO = {
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoriaId: number;
};

export async function createProduct(data: CreateProductDTO): Promise<Product> {
  try {
    const response = await api.post("/produtos", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
}

export async function updateProduct(id: number, data: UpdateProductDTO): Promise<Product> {
  try {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

export async function uploadProductImage(productId: number, imageUri: string): Promise<void> {
  try {
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // @ts-ignore - FormData accepts this format in React Native
    formData.append('file', {
      uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
      name: filename,
      type: type,
    });

    await api.post(`/produtos/${productId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error: any) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
}
