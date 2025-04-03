import { useCart } from "@/contexts/cartContext/cartContext";
import { CartItem } from "@/types/cartTypes";

const useCartHook = () => {
  const { cart, addToCart, removeFromCart, clearCart, toggleSelection, updateQuantity } = useCart();

  const addProductToCart = (product: CartItem) => {
    addToCart(product);
  };

  const removeProductFromCart = (id: number, selectedColor: string, selectedSize: string) => {
    removeFromCart(id, selectedColor, selectedSize); 
  };

  const clearAllItems = () => {
    clearCart();
  };

  const toggleSelectionProduction = (id: number, selectedColor: string, selectedSize: string) => {
    toggleSelection(id, selectedColor, selectedSize); 
  };

  const updateProductQuantity = (id: number, selectedColor: string, selectedSize: string, quantity: number) => {
    updateQuantity(id, selectedColor, selectedSize, quantity);
  };

  return {
    cart,
    addProductToCart,
    removeProductFromCart,
    clearAllItems,
    toggleSelectionProduction,
    updateProductQuantity, // Retorne a função de atualização de quantidade
  };
};

export default useCartHook;
