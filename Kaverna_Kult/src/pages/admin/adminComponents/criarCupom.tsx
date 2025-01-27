import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const CriarCupom: React.FC = () => {
  const [cupomData, setCupomData] = useState({
    nome: "",
    desconto: 0,
    quantidade: 0,
    validade: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCupomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      await addDoc(collection(db, "cupons"), cupomData);
      alert("Cupom criado com sucesso!");
      setCupomData({ nome: "", desconto: 0, quantidade: 0, validade: "" }); // Reseta o formulário
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      alert("Erro ao criar o cupom. Tente novamente.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Criar Cupom</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold" htmlFor="nome">
            Nome do Cupom
          </label>
          <input
            id="nome"
            name="nome"
            value={cupomData.nome}
            onChange={handleInputChange}
            placeholder="Digite o nome do cupom"
            className="w-full p-3 border rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="desconto"
          >
            Percentual de Desconto (%)
          </label>
          <input
            id="desconto"
            name="desconto"
            type="number"
            value={cupomData.desconto}
            onChange={handleInputChange}
            placeholder="Ex: 10"
            className="w-full p-3 border rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="quantidade"
          >
            quantidade de cupons
          </label>
          <input
            id="quantidade"
            name="quantidade"
            type="number"
            value={cupomData.quantidade}
            onChange={handleInputChange}
            placeholder="Ex: 10"
            className="w-full p-3 border rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold"
            htmlFor="validade"
          >
            Data de Validade
          </label>
          <input
            id="validade"
            name="validade"
            type="date"
            value={cupomData.validade}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Criar Cupom
        </button>
      </form>
    </div>
  );
};

export default CriarCupom;
