import React from "react";
import useCartHook from "@/hooks/useCart";
import { CartItem } from "@/types/cartTypes";

const Cart: React.FC = () => {
    const { cart, removeProductFromCart, clearAllItems, toggleSelectionProduction } = useCartHook();
  
    const handleRemove = (id: number, selectedColor: string, selectedSize: string) => {
      removeProductFromCart(id, selectedColor, selectedSize);
    };
  
    const handleClear = () => {
      clearAllItems();
    };
  
    const handleToggleSelection = (id: number, selectedColor: string, selectedSize: string) => {
      toggleSelectionProduction(id, selectedColor, selectedSize);
    };
  
    const handleFinalize = () => {
      const selectedItems = cart.filter(item => item.isSelected); // Filtra itens selecionados
      console.log("Itens selecionados para compra:", selectedItems);
      // Redirecionar para a página de finalização da compra com os itens selecionados
    };
  
    if (cart.length === 0) {
      return <div>Seu carrinho está vazio.</div>;
    }
  
    return (
      <>
        <div className="flex-1 overflow-auto">
          <ul className="space-y-4">
            {cart.map((item: CartItem) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg shadow-md hover:bg-gray-700"
              >
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="mr-auto">
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-300">{item.price}</p>
                  <p className="text-sm text-gray-400">Quantidade: {item.quantity}</p>
                  <p className="text-sm text-gray-400">Subtotal: R${" "}
                    {item.price * item.quantity}
                  </p>
                  <p>Cor: {item.selectedColor}</p>
                </div>
  
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={() => handleToggleSelection(item.id, item.selectedColor, item.selectedSize)}
                    className="h-5 w-5 text-green-500"
                  />
                  <button
                    onClick={() => handleRemove(item.id, item.selectedColor, item.selectedSize)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg shadow-md mt-6">
          <p className="text-xl font-semibold">
            Total: R${" "}
            {cart
              .reduce((acc, curr) => {
                return acc + (typeof curr.price === "number" ? curr.price * curr.quantity : 0);
              }, 0)
              .toFixed(2)}
          </p>
  
          <div className="space-x-4 flex">
            <button
              onClick={handleClear}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
            >
              Limpar Carrinho
            </button>
            <button
              onClick={handleFinalize}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </>
    );
  };
  
export default Cart;
