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

export type ProductInserir = {
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoriaId: number;
};

export type CategoriaDTO = {
  id: number;
  nome: string;
  descricao?: string;
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

export async function searchProductsByName(nome: string): Promise<Product[]> {
  try {
    const response = await api.get("/produtos/search", {
      params: { nome },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar produtos por nome:", error);
    throw error;
  }
}

export async function getProductsByCategory(
  categoriaId: number
): Promise<Product[]> {
  try {
    const response = await api.get(`/produtos/categoria/${categoriaId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar produtos por categoria:", error);
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

export async function createProduct(
  product: ProductInserir
): Promise<Product> {
  try {
    const response = await api.post("/produtos", product);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
}

export async function updateProduct(
  id: number,
  product: ProductInserir
): Promise<Product> {
  try {
    const response = await api.put(`/produtos/${id}`, product);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await api.delete(`/produtos/${id}`);
  } catch (error: any) {
    console.error("Erro ao deletar produto:", error);
    throw error;
  }
}

export async function uploadProductImage(
  productId: number,
  imageUri: string
): Promise<void> {
  try {

    const formData = new FormData();

    const filename = imageUri.split('/').pop() || `${productId}.jpg`;

    let mimeType = 'image/jpeg';
    if (filename.toLowerCase().endsWith('.png')) {
      mimeType = 'image/png';
    } else if (filename.toLowerCase().endsWith('.gif')) {
      mimeType = 'image/gif';
    }

    formData.append('file', {
      uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
      type: mimeType,
      name: `${productId}.jpg`,
    } as any);

    console.log("=== UPLOAD REQUEST ===");
    console.log("URL:", `/produtos/${productId}/upload`);
    console.log("URI:", imageUri);
    console.log("Type:", mimeType);
    console.log("Name:", `${productId}.jpg`);

    const response = await api.post(`/produtos/${productId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log("=== UPLOAD RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error("=== UPLOAD ERROR ===");
    console.error("Error:", error);
    console.error("Response:", error.response?.data);
    console.error("Status:", error.response?.status);
    throw error;
  }
}
