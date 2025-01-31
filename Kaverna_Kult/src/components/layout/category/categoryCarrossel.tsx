import React from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 1, name: "Masculino", icon: <img src="/icons/camiseta_masculina.png" alt="icone de camiseta" className="w-10" /> },
  { id: 2, name: "Feminino", icon: <img src="/icons/camiseta_feminina.png" alt="icone de camiseta" className="w-10" /> },
  { id: 3, name: "Infantil", icon: <img src="/icons/roupas_de_bebe.png" alt="icone de camiseta" className="w-10" /> },
  { id: 4, name: "Acessorios", icon: <img src="/icons/acessorios.png" alt="icone de camiseta" className="w-10" /> },
  { id: 5, name: "Kustom", icon: <img src="/icons/Kustom.png" alt="icone de camiseta" className="w-10" /> },
];

const CategoryCarousel: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    console.log("Categoria clicada:", category); // Log para depuração
    navigate(`/produtos?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="mt-2">
      <div className="overflow-x-scroll flex gap-4 scrollbar-hide text-white">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center justify-center min-w-20 h-24 rounded-lg shadow px-3 cursor-pointer hover:bg-gray-600"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="p-2 rounded-full bg-slate-100/20">{category.icon}</div>
            <span className="text-sm text-center">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryCarousel;
