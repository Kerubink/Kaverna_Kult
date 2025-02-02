import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import InputMask from "react-input-mask";
import { enviarPedido } from "../../services/serviceCheckout/pedidoService";
import { verificarCupom } from "../../services/serviceCheckout/cupomService";

const buscarEnderecoPorCEP = async (cep: string) => {
  const response = await fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://viacep.com.br/ws/${cep}/json/`
    )}`
  );
  const data = await response.json();
  return JSON.parse(data.contents); // A resposta estará em "contents"
};

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const selectedItems =
    location.state?.items ||
    JSON.parse(localStorage.getItem("selectedItems") || "[]");

  const totalPrice = selectedItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  const [cupom, setCupom] = useState(""); // Novo estado para o cupom
  const [desconto, setDesconto] = useState(0);

  const handleCupomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCupom(e.target.value);
  };

  const aplicarDesconto = async () => {
    if (cupom) {
      const response = await verificarCupom(cupom);
      if (response.valido) {
        setDesconto(response.desconto || 0);
        alert(`Cupom aplicado com sucesso! Desconto de ${response.desconto}%`);
      } else {
        alert(response.mensagem || "Erro ao aplicar o cupom.");
      }
    } else {
      alert("Digite um código de cupom.");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    idade: "",
    cidade: "",
    estado: "",
    logradouro: "",
    numeroCasa: "",
    complemento: "",
    cep: "",
  });

  const handleConfirmarPedido = () => {
    setIsModalOpen(true);
  };

  const validarFormulario = () => {
    const camposObrigatorios = [
      "nome",
      "telefone",
      "idade",
      "cep",
      "logradouro",
      "numeroCasa",
      "cidade",
      "estado",
    ];
    const camposVazios = camposObrigatorios.filter(
      (campo) => !formData[campo as keyof typeof formData]
    );

    if (camposVazios.length > 0) {
      alert(
        `Preencha todos os campos obrigatórios: ${camposVazios.join(", ")}`
      );
      return false;
    }
    return true;
  };

  // Função para enviar os dados
  const handleEnviarDados = async () => {
    const valorComDesconto = totalPrice * (1 - desconto / 100);

    if (validarFormulario()) {
      const pedido = {
        itens: selectedItems.map((item: any) => ({
          nome: item.name,
          tamanho: item.selectedSize,
          cor: item.selectedColor,
          quantidade: item.quantity,
          colecao: item.colecao || "default", // Substitua "default" pela lógica correta para coleções
        })),
        totalSemDescontos: totalPrice,
        descontos: {
          cupom: cupom, // Adiciona o cupom utilizado
          desconto: desconto, // Adiciona o desconto aplicado
          valorComDesconto: valorComDesconto.toFixed(2), // Valor com desconto
        },
        timestamp: new Date().toISOString(), // Adiciona o timestamp do pedido
        cliente: {
          nome: formData.nome,
          telefone: formData.telefone,
          idade: formData.idade,
          endereco: {
            cep: formData.cep,
            logradouro: formData.logradouro,
            numeroCasa: formData.numeroCasa,
            cidade: formData.cidade,
            estado: formData.estado,
            complemento: formData.complemento || "",
          },
        },
      };

      try {
        const response = await enviarPedido(pedido);

        if (response.success) {
          alert("Pedido enviado com sucesso!");
          setIsModalOpen(false);

          // Opcional: limpar os dados do formulário e do carrinho
          setFormData({
            nome: "",
            telefone: "",
            idade: "",
            cidade: "",
            estado: "",
            logradouro: "",
            numeroCasa: "",
            complemento: "",
            cep: "",
          });
          localStorage.removeItem("selectedItems");
        } else {
          alert(response.message || "Ocorreu um erro ao enviar o pedido.");
        }
      } catch (error) {
        console.error("Erro ao enviar o pedido:", error);
        alert("Não foi possível enviar o pedido. Tente novamente mais tarde.");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função chamada quando o CEP é preenchido
  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cepSomenteNumeros = value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setFormData((prev) => ({ ...prev, cep: value }));

    // Valida se o CEP tem exatamente 8 dígitos antes de fazer a requisição
    if (cepSomenteNumeros.length === 8) {
      try {
        const endereco = await buscarEnderecoPorCEP(cepSomenteNumeros);

        // Verifica se o retorno da API contém o endereço
        if (endereco && !endereco.erro) {
          setFormData((prev) => ({
            ...prev,
            logradouro: endereco.logradouro || "",
            cidade: endereco.localidade || "",
            estado: endereco.uf || "",
          }));
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar o endereço:", error);
        alert(
          "Não foi possível buscar o endereço. Tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <div className="bg-black text-white shadow-lg rounded-lg p-3 w-full max-w-3xl min-h-screen">
      <div className="flex justify-center items-center relative">
        <Link to="/" className="absolute left-0">
          <button className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Checkout</h1>
      </div>

      <ul className="divide-y divide-gray-200">
        {selectedItems.map((item: any) => (
          <li key={item.id} className="flex items-end  py-4">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <span className="absolute text-white text-sm font-extrabold bg-purple-600/80 flex p-[1px] rounded-full top-0 right-0">{item.quantity}x</span>
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-white-800">
                {item.name}
              </h2>
              <p className="text-sm font-bold flex items-center gap-1 text-gray-500">
                Tamanho: {item.selectedSize} | Cor:{" "}
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{ backgroundColor: item.selectedColor }}
                ></span>
              </p>
            </div>
            <div className="text-md font-bold text-white-800">
              R${(item.price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      <div className="fixed w-full bottom-0 mt-6 left-0 flex flex-col gap-4">
        <div className="flex items-center px-2 gap-4">
          <input
            type="text"
            placeholder="Código do cupom"
            value={cupom}
            onChange={handleCupomChange}
            className="w-full p-3 text-black border border-purple-700 rounded-md shadow-sm"
          />
          <button
            onClick={aplicarDesconto}
            className="px-4 py-2 text-white bg-purple-600 font-bold rounded-md"
          >
            Aplicar
          </button>
        </div>

        <div className="bg-neutral-900 p-2 flex flex-col gap-2"> 
        <div className="flex flex-col border-t gap-2">
          <div className="flex text-lg gap-2 mt-3 font-semibold">
            <span>Subtotal:</span>
            <span className="text-white">R${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex text-lg gap-2 font-semibold">
            <span>Desconto:</span>
            <span className="text-green-600">-{desconto}%</span>
          </div>
          <div className="flex text-lg gap-2 font-semibold">
            <span>Total:</span>
            <span className="text-green-600">
              R${(totalPrice * (1 - desconto / 100)).toFixed(2)}
            </span>
          </div>
          <p className="text-[12px] font-semibold text-slate-600">
            O frete será calculado por um vendedor através do WhatsApp após você
            confirmar o pedido.
          </p>
        </div>

        <button
          onClick={handleConfirmarPedido}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-md transition duration-200"
        >
          Confirmar Pedido
        </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black/75 backdrop-blur-sm text-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-6">
              Dados do Cliente
            </h2>

            <form>
              {/* Campo de Nome */}
              <div className="mb-4">
                <label
                  className="block font-semibold"
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
                  className="w-full mt-1 p-2 border text-black rounded-md shadow-sm"
                />
              </div>

              {/* Campo de Telefone com Máscara */}
              <div className="mb-4">
                <label
                  className="block font-semibold"
                  htmlFor="telefone"
                >
                  Telefone
                </label>
                <InputMask
                  mask="(99) 99999-9999"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="Digite seu telefone"
                  className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                />
              </div>

              {/* Campo de Idade com Máscara */}
              <div className="mb-4">
                <label
                  className="block font-semibold"
                  htmlFor="idade"
                >
                  Idade
                </label>
                <InputMask
                  mask="99"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleInputChange}
                  placeholder="Digite sua idade"
                  className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                />
              </div>

              {/* Campo de CEP */}
              <div className="mb-4">
                <label
                  className="block font-semibold"
                  htmlFor="cep"
                >
                  CEP
                </label>
                <InputMask
                  mask="99999-999"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleCEPChange}
                  placeholder="Digite o CEP"
                  className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                />
              </div>

              {/* Campos de Endereço */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label
                    className="block font-semibold"
                    htmlFor="logradouro"
                  >
                    Logradouro
                  </label>
                  <input
                    id="logradouro"
                    name="logradouro"
                    value={formData.logradouro}
                    onChange={handleInputChange}
                    placeholder="Digite o logradouro"
                    className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label
                    className="block font-semibold"
                    htmlFor="numeroCasa"
                  >
                    Número
                  </label>
                  <input
                    id="numeroCasa"
                    name="numeroCasa"
                    value={formData.numeroCasa}
                    onChange={handleInputChange}
                    placeholder="Digite o número"
                    className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-1">
                  <label
                    className="block font-semibold"
                    htmlFor="cidade"
                  >
                    Cidade
                  </label>
                  <input
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    placeholder="Digite a cidade"
                    className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                  />
                </div>
                <div className="col-span-1">
                  <label
                    className="block font-semibold"
                    htmlFor="estado"
                  >
                    Estado
                  </label>
                  <input
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    placeholder="Digite o estado"
                    className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="mb-4 mt-4">
                <label
                  className="block font-semibold"
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
                  className="w-full mt-1 p-2 border text-black  rounded-md shadow-sm"
                />
              </div>
            </form>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 font-bold text-gray-800 py-2 px-4 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarDados}
                className="bg-purple-600 hover:bg-purple-700 font-bold text-white py-2 px-4 rounded-md"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
