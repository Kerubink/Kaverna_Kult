import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function ButtonRastreio() {
  const [expanded, setExpanded] = useState(true); // Estado inicial como expandido

  useEffect(() => {
    // Reduz o botão após 3 segundos
    const timer = setTimeout(() => {
      setExpanded(false);
    }, 2500);

    // Limpeza do timeout ao desmontar o componente
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link to={"/checkoutOrder"}>
      <button
        className={`bg-slate-600 fixed bottom-4 right-4 text-white font-bold h-12 gap-2 flex items-center justify-center rounded-full opacity-50  transition-all duration-500 ${
          expanded ? "w-[200px] px-4 opacity-100 flex items-center justify-center" : "w-12"
        }`}
      >
        <img
          src="./icons/numero-de-rastreio.svg"
          alt="icone de caixa de rastreio"
          className="w-8"
        />
        {expanded && <span className="whitespace-nowrap text-sm">Consutar pedido</span>}
      </button>
    </Link>
  );
}

export default ButtonRastreio;
