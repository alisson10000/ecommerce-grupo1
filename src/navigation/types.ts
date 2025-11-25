import { Product } from "../api/products";

export type RootStackParamList = {
  Login: undefined;
  HomeTabs: undefined;
  ProductDetails: { product: Product };
  Payment: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Products: undefined;
  Cart: undefined;
};
