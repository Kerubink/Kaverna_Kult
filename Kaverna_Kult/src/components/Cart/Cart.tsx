import React from "react";
import useCartHook from "@/hooks/useCart";
import { CartItem } from "@/types/cartTypes";

const Cart: React.FC = () => {
  const { cart, removeProductFromCart, clearAllItems } = useCartHook();

  const handleRemove = (id: number) => {
    removeProductFromCart(id);
  };

  const handleClear = () => {
    clearAllItems();
  };

  if (cart.length === 0) {
    return <div>Seu carrinho está vazio.</div>;
  }

  return (
    <>
      <div className="cart flex-1">
        <button onClick={handleClear}>Limpar Carrinho</button>
        <ul>
          {cart.map((item: CartItem) => (
            <li key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="w-20 h-20" />
              <div>
                <p>{item.name}</p>
                <p>{item.price}</p>
                <p>Quantidade: {item.quantity}</p>
              </div>
              <button onClick={() => handleRemove(item.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="cart flex-1">
        <p>
          Total: R${" "}
          {cart
            .reduce((acc, curr) => {
              return (
                acc +
                (typeof curr.price === "number"
                  ? curr.price * curr.quantity
                  : 0)
              );
            }, 0)
            .toFixed(2)}
        </p>{" "}
        <button>Finalizar Compra</button>
      </div>
    </>
  );
};

export default Cart;
