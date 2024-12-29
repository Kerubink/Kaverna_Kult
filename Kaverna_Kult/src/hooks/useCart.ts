import { useCart } from "@/contexts/cartContext/cartContext";
import { CartItem } from "@/types/cartTypes";

const useCartHook = () => {
  const { cart, addToCart, removeFromCart, clearCart, toggleSelection } = useCart(); // Obtenha a função toggleSelection do contexto

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
    toggleSelection(id, selectedColor, selectedSize); // Use a função de toggle do contexto
  };

  return {
    cart,
    addProductToCart,
    removeProductFromCart,
    clearAllItems,
    toggleSelectionProduction, // Retorne a função para ser usada no componente
  };
};

export default useCartHook;
