import { Product } from "../api/products";

// types.ts ou types.d.ts
export type RootStackParamList = {
  Login: undefined; // Não aceita parâmetros
  HomeTabs: undefined; // Não aceita parâmetros
  ProductDetails: { productId: string }; // Exemplo: Aceita um parâmetro
  Payment: undefined;
};
export type RootTabParamList = {
  Home: undefined;
  Products: undefined;
  Cart: undefined;
  ChatBot: undefined;
};
