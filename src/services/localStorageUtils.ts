import { CartItem } from "@/types/cartTypes";

const CART_STORAGE_KEY = "cart";

export const getCartFromLocalStorage = (): CartItem[] => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCartToLocalStorage = (cart: CartItem[]): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};
