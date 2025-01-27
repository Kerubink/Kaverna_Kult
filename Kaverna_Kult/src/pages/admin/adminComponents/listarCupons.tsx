import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const ListarCupons: React.FC = () => {
  const [cupons, setCupons] = useState<any[]>([]);

  const fetchCupons = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "cupons"));
      const cuponsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCupons(cuponsList);
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
    }
  };

  const handleDeleteCupom = async (id: string) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "cupons", id));
      alert("Cupom excluído com sucesso!");
      fetchCupons(); // Atualiza a lista de cupons
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      alert("Erro ao excluir o cupom. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchCupons();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Listar Cupons</h2>
      {cupons.length === 0 ? (
        <p className="text-gray-600">Nenhum cupom encontrado.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {cupons.map((cupom) => (
            <li key={cupom.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{cupom.nome}</p>
                <p className="text-sm text-gray-500">
                  {cupom.desconto}% de desconto - Válido até {cupom.validade}
                </p>
              </div>
              <button
                onClick={() => handleDeleteCupom(cupom.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListarCupons;
