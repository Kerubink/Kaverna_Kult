import React, { createContext, useState, useEffect, useContext } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  colors: string[];
  sizes: string[];
  image: string;
  selectedColor: string;
  selectedSize: string;
  gallery: string[];
  rating: number;
  stock: number;
  quantity: number;
  shippingDetails: string;
  isSelected: boolean; 
};

type CartContextProps = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number, selectedColor: string, selectedSize: string) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleSelection: (id: number, selectedColor: string, selectedSize: string) => void; 
};

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const existingProduct = cart.find(
      (item) =>
        item.id === product.id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id &&
          item.selectedColor === product.selectedColor &&
          item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + product.quantity } 
            : item
        )
      );
    } else {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (
    id: number,
    selectedColor: string,
    selectedSize: string
  ) => {
    setCart(
      cart.filter(
        (item) =>
          item.id !== id ||
          item.selectedColor !== selectedColor ||
          item.selectedSize !== selectedSize
      )
    );
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleSelection = (id: number, selectedColor: string, selectedSize: string) => {
    setCart(
      cart.map((item) =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, isSelected: !item.isSelected } 
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, toggleSelection, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
