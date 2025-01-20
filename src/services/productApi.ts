import { ProductResponse } from "../types/productTypes";


const BASE_URL = 'https://dummyjson.com';
const PRODUCTS_PER_PAGE = 20;

export const fetchProducts = async (skip: number): Promise<ProductResponse> => {
  const response = await fetch(`${BASE_URL}/products?limit=${PRODUCTS_PER_PAGE}&skip=${skip}&select=title,price,thumbnail`);
  return response.json();
};

export const searchProducts = async (query: string, skip: number): Promise<ProductResponse> => {
  const response = await fetch(`${BASE_URL}/products/search?q=${query}&limit=${PRODUCTS_PER_PAGE}&skip=${skip}&select=title,price,thumbnail`);
  return response.json();
};