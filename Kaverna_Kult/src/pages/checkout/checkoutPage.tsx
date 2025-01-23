import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { calcularFreteSimulado } from "../../services/freteService";
import { enviarPedido } from "../../services/serviceCheckout/pedidoService";
import { buscarEnderecoPorCep } from "@/services/serviceCheckout/buscaCep";

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
    logradouro: "",
    numeroCasa: "",
    complemento: "",
  });

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

  const handleBuscarEndereco = async () => {
    if (!cepDestino) {
      alert("Por favor, insira um CEP válido.");
      return;
    }
    const endereco = await buscarEnderecoPorCep(cepDestino);
    if (endereco) {
      setFormData((prev) => ({
        ...prev,
        cep: cepDestino,
        cidade: endereco.localidade,
        estado: endereco.uf,
        complemento: endereco.complemento || "",
        logradouro: endereco.logradouro || "", // Adiciona o logradouro
      }));
    } else {
      alert("Não foi possível encontrar o endereço para o CEP informado.");
    }
  };

  const handleConfirmarPedido = () => {
    setFormData((prev) => ({ ...prev, cep: cepDestino })); // Preenche o CEP automaticamente no formulário
    setIsModalOpen(true);
  };

  const handleEnviarPedido = async () => {
    try {
      // Validação de campos obrigatórios
      if (
        !formData.nome ||
        !formData.telefone ||
        !formData.cidade ||
        !formData.estado ||
        !formData.logradouro ||
        !formData.numeroCasa
      ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      // Construção do pedido
      const pedido = {
        itens: selectedItems.map((item: any) => ({
          nome: item.name,
          tamanho: item.selectedSize,
          cor: item.selectedColor,
          quantidade: item.quantity,
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
            logradouro: formData.logradouro,
            complemento: formData.complemento,
          },
        },
      };

      // Envio do pedido para o backend
      const response = await enviarPedido(pedido);
      console.log("Resposta do envio de pedido:", response); // Verifique a resposta no console

      if (response?.success) {
        alert("Pedido enviado com sucesso!");
        setIsModalOpen(false);

        // Gerar mensagem para WhatsApp
        const whatsappNumber = "+5582999276798"; // Substitua pelo número correto
        const mensagem = encodeURIComponent(`
          Novo Pedido Recebido!
          Cliente: ${formData.nome}
          Telefone: ${formData.telefone}
          Endereço: ${formData.logradouro}, ${formData.numeroCasa}, ${
          formData.cidade
        }/${formData.estado}, CEP: ${formData.cep}
          Observação: ${formData.observacao || "Nenhuma"}
          Total do Pedido: R$ ${totalPrice.toFixed(2)}
  
          Itens:
          ${selectedItems
            .map(
              (item: any) =>
                `- ${item.name} (Tamanho: ${item.selectedSize}, Cor: ${item.selectedColor}, Quantidade: ${item.quantity})`
            )
            .join("\n")}
        `);

        // Verifique se o WhatsApp URL está correto
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${mensagem}`;
        console.log("Redirecionando para o WhatsApp:", whatsappUrl); // Verifique a URL

        // Tentar abrir o WhatsApp em uma nova aba ou na mesma aba
        window.open(whatsappUrl, "_blank");
        // Ou, se preferir redirecionar na mesma aba:
        // window.location.href = whatsappUrl;
      } else {
        alert("Ocorreu um erro ao enviar o pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
      alert("Ocorreu um erro inesperado. Por favor, tente novamente.");
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

  const handleCalcularFreteEBuscarEndereco = () => {
    handleCalcularFrete();
    handleBuscarEndereco();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-3 w-full max-w-3xl min-h-screen">
      <div>
        <Link to="/">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </button>
        </Link>
      </div>
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
            onClick={handleCalcularFreteEBuscarEndereco}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md transition duration-200"
          >
            Buscar Endereço
          </button>
        </div>

        {resultadoFrete && (
          <div className="mt-6 text-sm flex flex-col gap-2">
            <p className="text-sm font-semibold ">
              Frete aproximado: {resultadoFrete.valorSimulado}
            </p>
            <p>{resultadoFrete.prazoEntrega}</p>

            <p>{resultadoFrete.mensagemAviso}</p>
          </div>
        )}

        <button
          onClick={handleConfirmarPedido}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md transition duration-200"
        >
          Confirmar Pedido
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white h-full overflow-auto p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Dados do Cliente
            </h2>
            <form>
              {/* Formulário de Dados do Cliente */}
              {[
                "nome",
                "telefone",
                "idade",
                "cidade",
                "estado",
                "numeroCasa",
                "logradouro",
                "complemento",
              ].map((field) => (
                <div key={field} className="mb-4">
                  <label
                    className="block text-gray-700 font-semibold"
                    htmlFor={field}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleInputChange}
                    placeholder={`Digite ${field}`}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}
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
