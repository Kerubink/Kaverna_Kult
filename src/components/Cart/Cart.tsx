import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useCartHook from "@/hooks/useCart";
import { CartItem } from "@/types/cartTypes";
import { Minus, Plus } from "lucide-react";

// Componente de Item do Carrinho Reutilizável
const CartItemComponent = ({
  item,
  onRemove,
  onToggle,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onRemove: () => void;
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) => {
  const uniqueKey = `${item.id}-${item.selectedColor}-${item.selectedSize}`;

  return (
    <li
      key={uniqueKey}
      className="flex items-center py-1 text-white rounded-lg shadow-md border border-violet-950"
    >
      {/* Checkbox Personalizado */}
      <label className="flex cursor-pointer items-center justify-center">
        <input
          className="peer appearance-none"
          type="checkbox"
          checked={item.isSelected}
          onChange={onToggle}
          aria-label={`Selecionar ${item.name}`}
        />
        <span className="h-[1.5em] w-[1.5em] relative left-[25%] rounded-[0.25em] border-[1px] border-white" />
        <svg
          className="h-[1.5em] w-[1.5em] relative left-[-25%] top-0 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
          viewBox="0 0 38 37"
          fill="none"
          height="37"
          width="38"
          aria-hidden="true"
        >
          <path
            d="M6.617 36.785c-.676-5.093 4.49-10.776 6.318-14.952 1.887-4.31 4.315-10.701 6.055-15.506C20.343 2.59 20.456.693 20.57.789c3.262 2.744 1.697 10.518 2.106 14.675 1.926 19.575 4.62 12.875-7.635 4.43C12.194 17.933 2.911 12.1 1.351 8.82c-1.177-2.477 5.266 0 7.898 0 2.575 0 27.078-1.544 27.907-1.108.222.117-.312.422-.526.554-1.922 1.178-3.489 1.57-5.266 3.046-3.855 3.201-8.602 6.002-12.11 9.691-4.018 4.225-5.388 10.245-11.321 10.245"
            strokeWidth="1.5px"
            pathLength="100"
            stroke="#fff"
          />
        </svg>
      </label>

      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md"
        loading="lazy"
      />
      
      <div className="flex flex-col flex-1 p-2">
        <div className="flex flex-col gap-1">
          <div className="flex w-full items-center justify-between">
            <p className="text-[12px] font-semibold">
              {item.name} - {item.collection}
            </p>
            <button
              onClick={onRemove}
              className="hover:text-red-600"
              aria-label="Remover item"
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
              aria-hidden="true"
            />
            <span>{item.selectedSize}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-md text-white font-bold">
            R${(item.price * item.quantity).toFixed(2)}
          </p>
          <div className="flex items-center gap-2">
            <QuantityButton onClick={onDecrease} icon={<Minus size={14} />} />
            <span className="text-lg font-semibold">{item.quantity}</span>
            <QuantityButton onClick={onIncrease} icon={<Plus size={14} />} />
          </div>
        </div>
      </div>
    </li>
  );
};

// Componente de Botão de Quantidade Reutilizável
const QuantityButton = ({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="border-violet-700 border-2 text-violet-500 text-center p-1 rounded-md hover:bg-violet-800 hover:text-violet-300"
    aria-label="Alterar quantidade"
  >
    {icon}
  </button>
);

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeProductFromCart,
    clearAllItems,
    toggleSelectionProduction,
    updateProductQuantity,
  } = useCartHook();

  // Memoiza cálculo do total
  const total = useMemo(
    () => cart.reduce((acc, curr) => acc + (curr.price * curr.quantity || 0), 0),
    [cart]
  );

  // Handlers memoizados
  const handleRemove = useCallback(
    (id: number, color: string, size: string) => () => {
      removeProductFromCart(id, color, size);
    },
    [removeProductFromCart]
  );

  const handleToggle = useCallback(
    (id: number, color: string, size: string) => () => {
      toggleSelectionProduction(id, color, size);
    },
    [toggleSelectionProduction]
  );

  const handleQuantityChange = useCallback(
    (id: number, color: string, size: string, delta: number) => () => {
      const item = cart.find(
        i => i.id === id && i.selectedColor === color && i.selectedSize === size
      );
      if (item) {
        const newQuantity = Math.max(1, item.quantity + delta);
        updateProductQuantity(id, color, size, newQuantity);
      }
    },
    [cart, updateProductQuantity]
  );

  const handleFinalize = useCallback(() => {
    try {
      const selectedItems = cart.filter(item => item.isSelected);
      if (!selectedItems.length) {
        alert("Selecione ao menos um item para finalizar a compra.");
        return;
      }
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
      navigate("/checkout");
    } catch (error) {
      console.error("Erro ao salvar itens:", error);
      alert("Não foi possível salvar os itens selecionados.");
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return (
      <div className="text-white text-center py-8">
        Seu carrinho está vazio.
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600"
        >
          Continuar comprando
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <ul className="space-y-1">
          {cart.map(item => (
            <CartItemComponent
              key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
              item={item}
              onRemove={handleRemove(item.id, item.selectedColor, item.selectedSize)}
              onToggle={handleToggle(item.id, item.selectedColor, item.selectedSize)}
              onIncrease={handleQuantityChange(item.id, item.selectedColor, item.selectedSize, 1)}
              onDecrease={handleQuantityChange(item.id, item.selectedColor, item.selectedSize, -1)}
            />
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 text-white p-4 rounded-lg shadow-md mt-6 sticky bottom-0 bg-neutral-900">
        <div className="text-xl flex justify-between font-semibold">
          Total:
          <span>R${total.toFixed(2)}</span>
        </div>
        
        <button
          onClick={handleFinalize}
          className="bg-violet-500 shadow-violet-500 w-full font-bold text-white px-6 py-2 rounded-lg hover:bg-violet-600 transition-colors"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Cart;