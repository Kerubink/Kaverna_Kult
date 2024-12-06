import { useCart } from "@/contexts/cartContext/cartContext";
import { CartItem } from "@/types/cartTypes";

const useCartHook = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const addProductToCart = (product: CartItem) => {
    addToCart(product);
  };

  const removeProductFromCart = (id: number) => {
    removeFromCart(id);
  };

  const clearAllItems = () => {
    clearCart();
  };

  return {
    cart,
    addProductToCart,
    removeProductFromCart,
    clearAllItems,
  };
};

export default useCartHook;
