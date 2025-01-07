import React from "react";

const produtos = [
  {
    id: 1,
    nome: "Camiseta Básica",
    preco: "R$ 49,90",
    imagem: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    nome: "Calça Jeans",
    preco: "R$ 119,90",
    imagem: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    nome: "Tênis Esportivo",
    preco: "R$ 199,90",
    imagem: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    nome: "Jaqueta de Couro",
    preco: "R$ 299,90",
    imagem: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    nome: "Relógio Clássico",
    preco: "R$ 399,90",
    imagem: "https://via.placeholder.com/100",
  },
];

function ProdutosPopulares() {
  return (
    <section className="p-2">
      <div className="text-white">
        <h1 className="text-lg font-extralight text-l">Populares</h1>
        <hr className="w-[50px] h-[3.5px] mt-1 bg-primary-dark" />
      </div>
      <div className="w-full overflow-x-scroll scrollbar-hide flex gap-4 p-2">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="flex-shrink-0 w-40 rounded-lg shadow-md bg-white p-2"
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-32 object-cover rounded-md"
            />
            <div className="mt-2 text-center">
              <h3 className="text-sm font-semibold">{produto.nome}</h3>
              <p className="text-gray-500 text-sm">{produto.preco}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProdutosPopulares;
