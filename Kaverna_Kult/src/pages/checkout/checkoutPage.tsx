import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { calcularFreteSimulado } from "../../services/freteService";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firebase Firestore

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const selectedItems =
    location.state?.items ||
    JSON.parse(localStorage.getItem("selectedItems") || "[]");

  const totalPrice = selectedItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  const [cepDestino, setCepDestino] = useState("");
  const [pesoTotal, setPesoTotal] = useState(0);
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);
  const [resultadoFrete, setResultadoFrete] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    idade: "",
    observacao: "",
    cep: "",
    cidade: "",
    estado: "",
    numeroCasa: "",
    complemento: "",
  });

  const db = getFirestore();

  const calcularPesoEQuantidade = () => {
    let peso = 0;
    let quantidade = 0;

    selectedItems.forEach((item: { peso: number; quantity: number }) => {
      peso += item.peso * item.quantity;
      quantidade += item.quantity;
    });

    setPesoTotal(peso);
    setQuantidadeTotal(quantidade);
  };

  const handleCalcularFrete = () => {
    if (cepDestino) {
      const frete = calcularFreteSimulado({
        cepDestino,
        peso: pesoTotal,
        quantidade: quantidadeTotal,
      });
      setResultadoFrete(frete);
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  };

  const handleConfirmarPedido = () => {
    setFormData((prev) => ({ ...prev, cep: cepDestino })); // Preenche o CEP automaticamente no formulário
    setIsModalOpen(true);
  };

  const handleEnviarPedido = async () => {
    if (
      !formData.nome ||
      !formData.telefone ||
      !formData.cidade ||
      !formData.estado ||
      !formData.numeroCasa
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const pedido = {
      itens: selectedItems.map((item: any) => ({
        nome: item.name,
        tamanho: item.selectedSize,
        cor: item.selectedColor,
        quantidade: item.selectedQuantity,
        colecao: item.colecao || "Não especificado",
      })),
      total: totalPrice,
      cliente: {
        nome: formData.nome,
        telefone: formData.telefone,
        idade: formData.idade,
        observacao: formData.observacao,
        endereco: {
          cep: formData.cep,
          cidade: formData.cidade,
          estado: formData.estado,
          numeroCasa: formData.numeroCasa,
          complemento: formData.complemento,
        },
      },
    };

    try {
      await addDoc(collection(db, "pedidos"), pedido);
      alert("Pedido enviado com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
      alert("Ocorreu um erro ao enviar o pedido. Tente novamente.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    calcularPesoEQuantidade();
  }, [selectedItems]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        <ul className="divide-y divide-gray-200">
          {selectedItems.map((item: any) => (
            <li key={item.id} className="flex items-center py-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Tamanho: {item.selectedSize} | Cor:{" "}
                  <span
                    className="inline-block w-4 h-4 rounded-full border"
                    style={{ backgroundColor: item.selectedColor }}
                  ></span>
                </p>
              </div>
              <div className="text-lg font-bold text-gray-800">
                R${(item.price * item.quantity).toFixed(2)}
              </div>
              <p>{item.quantity}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span className="text-green-600">R${totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-4">
            <label htmlFor="cep" className="block text-gray-700 font-semibold">
              CEP de destino:
            </label>
            <input
              type="text"
              id="cep"
              value={cepDestino}
              onChange={(e) => setCepDestino(e.target.value)}
              placeholder="Digite o CEP"
              className="w-full mt-2 p-2 border rounded-md"
            />
            <button
              onClick={handleCalcularFrete}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md transition duration-200"
            >
              Calcular Frete
            </button>
          </div>

          {resultadoFrete && (
            <div className="mt-6">
              <p className="text-lg font-semibold text-green-600">
                Frete: {resultadoFrete.valorSimulado}
              </p>
            </div>
          )}

          <button
            onClick={handleConfirmarPedido}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md transition duration-200"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white h-full overflow-auto p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Dados do Cliente
            </h2>
            <form>
              {/* Nome */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="nome"
                >
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>

              {/* Telefone */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="telefone"
                >
                  Telefone de contato
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="Digite seu telefone"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>

              {/* Idade */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="idade"
                >
                  Idade
                </label>
                <input
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleInputChange}
                  placeholder="Digite sua idade"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>

              {/* Observação */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="observacao"
                >
                  Observação do Pedido
                </label>
                <textarea
                  id="observacao"
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleInputChange}
                  placeholder="Digite suas observações (opcional)"
                  className="w-full mt-2 p-2 border rounded-md"
                ></textarea>
              </div>

              {/* CEP */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="cep"
                >
                  CEP
                </label>
                <input
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  placeholder="Digite seu CEP"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>

              {/* Cidade */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="cidade"
                >
                  Cidade
                </label>
                <input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Digite sua cidade"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>

              {/* Estado */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="estado"
                >
                  Estado
                </label>
                <input
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="Digite seu estado"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>

              {/* Número da Casa */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="numeroCasa"
                >
                  Número da Casa
                </label>
                <input
                  id="numeroCasa"
                  name="numeroCasa"
                  value={formData.numeroCasa}
                  onChange={handleInputChange}
                  placeholder="Digite o número da casa"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>

              {/* Complemento */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold"
                  htmlFor="complemento"
                >
                  Complemento
                </label>
                <input
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  placeholder="Digite o complemento (opcional)"
                  className="w-full mt-2 p-2 border rounded-md"
                />
              </div>
            </form>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarPedido}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
