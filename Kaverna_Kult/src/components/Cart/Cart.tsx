import React from "react";
import { useNavigate } from "react-router-dom";
import useCartHook from "@/hooks/useCart";
import { CartItem } from "@/types/cartTypes";
import CheckoutFrete from "./calculadoraFrete/freightCalculator";

const Cart: React.FC = () => {
  const {
    cart,
    removeProductFromCart,
    clearAllItems,
    toggleSelectionProduction,
    updateProductQuantity,
  } = useCartHook();

  const navigate = useNavigate();

  const handleRemove = (
    id: number,
    selectedColor: string,
    selectedSize: string
  ) => {
    removeProductFromCart(id, selectedColor, selectedSize);
  };

  const handleClear = () => {
    clearAllItems();
  };

  const handleToggleSelection = (
    id: number,
    selectedColor: string,
    selectedSize: string
  ) => {
    toggleSelectionProduction(id, selectedColor, selectedSize);
  };

  const handleFinalize = () => {
    const selectedItems = cart.filter((item) => item.isSelected);

    if (selectedItems.length > 0) {
      // Salva os itens selecionados no localStorage
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));

      // Redireciona para a página de checkout
      navigate("/checkout");
    } else {
      alert("Selecione ao menos um item para finalizar a compra.");
    }
  };

  const handleIncreaseQuantity = (
    id: number,
    selectedColor: string,
    selectedSize: string
  ) => {
    const item = cart.find(
      (item) =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );
    if (item) {
      const updatedQuantity = item.quantity + 1;
      updateProductQuantity(id, selectedColor, selectedSize, updatedQuantity);
    }
  };

  const handleDecreaseQuantity = (
    id: number,
    selectedColor: string,
    selectedSize: string
  ) => {
    const item = cart.find(
      (item) =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );
    if (item && item.quantity > 1) {
      const updatedQuantity = item.quantity - 1;
      updateProductQuantity(id, selectedColor, selectedSize, updatedQuantity);
    }
  };

  if (cart.length === 0) {
    return <div>Seu carrinho está vazio.</div>;
  }

  return (
    <>
      <div className="flex-1 overflow-auto">
        <ul className="space-y-1">
          {cart.map((item: CartItem) => (
            <li
              key={item.id}
              className="flex items-center py-1 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700"
            >
              {/* Efeito Estrela para o checkbox */}
              <label
                className="flex cursor-pointer items-center justify-center"
                htmlFor={`checkbox-${item.id}`}
              >
                <input
                  className="peer appearance-none"
                  id={`checkbox-${item.id}`}
                  type="checkbox"
                  checked={item.isSelected}
                  onChange={() =>
                    handleToggleSelection(
                      item.id,
                      item.selectedColor,
                      item.selectedSize
                    )
                  }
                />
                <span className="h-[1.5em] w-[1.5em] relative left-[25%] rounded-[0.25em] border-[1px] border-white"></span>
                <svg
                  className="h-[1.5em] w-[1.5em] relative left-[-25%] top-0 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
                  viewBox="0 0 38 37"
                  fill="none"
                  height="37"
                  width="38"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.617 36.785c-.676-5.093 4.49-10.776 6.318-14.952 1.887-4.31 4.315-10.701 6.055-15.506C20.343 2.59 20.456.693 20.57.789c3.262 2.744 1.697 10.518 2.106 14.675 1.926 19.575 4.62 12.875-7.635 4.43C12.194 17.933 2.911 12.1 1.351 8.82c-1.177-2.477 5.266 0 7.898 0 2.575 0 27.078-1.544 27.907-1.108.222.117-.312.422-.526.554-1.922 1.178-3.489 1.57-5.266 3.046-3.855 3.201-8.602 6.002-12.11 9.691-4.018 4.225-5.388 10.245-11.321 10.245"
                    strokeWidth="1.5px"
                    pathLength="100"
                    stroke="#fff"
                  ></path>
                </svg>
              </label>

              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex flex-col gap flex-1 p-2">
                <div className="flex flex-col gap-1">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-[12px] font-semibold">
                      {item.name} - {item.collection}
                    </p>
                    <button
                      className=" hover:text-red-600"
                      onClick={() =>
                        handleRemove(
                          item.id,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="rounded-full p-[0.4rem] w-1 h-1"
                      style={{ backgroundColor: item.selectedColor }}
                    ></span>

                    <span>{item.selectedSize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-md text-white font-bold">
                    R${item.price * item.quantity}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleDecreaseQuantity(
                          item.id,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="bg-gray-700 text-white px-2  rounded-md hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleIncreaseQuantity(
                          item.id,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="bg-gray-700 text-white px-2 rounded-md hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 justify-between bg-gray-800 text-white p-4 rounded-lg shadow-md mt-6">
        <div className="text-xl flex justify-between font-semibold">
          Total:
          <span>
            R$
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
          </span>
        </div>

        <div className="flex">
          <button
            onClick={handleFinalize}
            className="bg-green-500 w-full text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
