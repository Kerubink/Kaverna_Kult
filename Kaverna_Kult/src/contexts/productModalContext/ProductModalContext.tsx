import React, { createContext, useState, useContext, ReactNode } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string; 
  gallery: string[]; 
  rating: number; 
  stock: number;
  shippingDetails: string; 
};

type ProductModalContextProps = {
  product: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
  isOpen: boolean;
};

const ProductModalContext = createContext<ProductModalContextProps | undefined>(undefined);

export const ProductModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (product: Product) => {
    setProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setProduct(null);
    setIsOpen(false);
  };

  return (
    <ProductModalContext.Provider value={{ product, openModal, closeModal, isOpen }}>
      {children}
    </ProductModalContext.Provider>
  );
};

export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error("useProductModal must be used within a ProductModalProvider");
  }
  return context;
};
