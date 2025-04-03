import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import InputMask from "react-input-mask";
import { Timestamp } from "firebase/firestore";
import { enviarPedido } from "../../services/serviceCheckout/pedidoService";
import { verificarCupom } from "../../services/serviceCheckout/cupomService";

// Componente de Input Reutilizável
const InputField = ({
  label,
  name,
  value,
  onChange,
  mask,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mask?: string;
  placeholder?: string;
  type?: string;
}) => {
  const inputProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    type,
    className:
      "w-full mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200 transition-colors duration-300",
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold" htmlFor={name}>
        {label}
      </label>
      {mask ? (
        <InputMask mask={mask} {...inputProps} />
      ) : (
        <input {...inputProps} />
      )}
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);

  // Obter itens do carrinho
  const selectedItems = useMemo(
    () =>
      location.state?.items ||
      JSON.parse(localStorage.getItem("selectedItems") || "[]"),
    [location.state]
  );

  // Cálculos de preço
  const totalPrice = useMemo(
    () =>
      selectedItems.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const valorComDesconto = useMemo(
    () => totalPrice * (1 - desconto / 100),
    [totalPrice, desconto]
  );

  // Estado do formulário
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

  // Buscar endereço por CEP
  const buscarEnderecoPorCEP = async (cep: string) => {
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://viacep.com.br/ws/${cep}/json/`
        )}`
      );
      const data = await response.json();
      return JSON.parse(data.contents);
    } catch (error) {
      throw new Error("Erro ao buscar CEP");
    }
  };

  // Handlers
  const handleCupomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCupom(e.target.value.toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cepNumeros = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, cep: value }));

    if (cepNumeros.length === 8) {
      try {
        const endereco = await buscarEnderecoPorCEP(cepNumeros);
        if (endereco?.erro) throw new Error("CEP não encontrado");

        setFormData((prev) => ({
          ...prev,
          logradouro: endereco.logradouro || "",
          cidade: endereco.localidade || "",
          estado: endereco.uf || "",
        }));
      } catch (error) {
        alert(error instanceof Error ? error.message : "Erro ao buscar CEP");
      }
    }
  };

  // Cupom
  const aplicarDesconto = async () => {
    if (!cupom) return alert("Digite um código de cupom");

    try {
      const response = await verificarCupom(cupom);
      if (response.valido) {
        setDesconto(response.desconto);
        alert(`Cupom aplicado! Desconto de ${response.desconto}%`);
      } else {
        alert(response.mensagem || "Cupom inválido");
      }
    } catch (error) {
      alert("Erro ao verificar cupom");
    }
  };

  // Validação e envio
  const validarFormulario = () => {
    const requiredFields = [
      "nome",
      "telefone",
      "idade",
      "cep",
      "logradouro",
      "numeroCasa",
      "cidade",
      "estado",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length) {
      alert(`Campos obrigatórios: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleEnviarDados = async () => {
    if (!validarFormulario()) return;

    try {
      const pedidoData = {
        totalSemDescontos: totalPrice,
        descontos: {
          cupom,
          porcentagem: desconto,
          valorDesconto: valorComDesconto,
          valorFinal: totalPrice - valorComDesconto,
        },
        cliente: {
          ...formData,
          endereco: {
            cep: formData.cep,
            logradouro: formData.logradouro,
            numero: formData.numeroCasa,
            cidade: formData.cidade,
            estado: formData.estado,
            complemento: formData.complemento || "",
          },
        },
        status: {
          timestamp: Timestamp.now(),
          statusAtual: "Recebido",
        },
      };

      const itensData = selectedItems.map((item: any) => ({
        nome: item.name,
        tamanho: item.selectedSize,
        cor: item.selectedColor,
        quantidade: item.quantity,
        precoUnitario: item.price,
        colecao: item.colecao || "default",
        sku: item.sku || null,
      }));

      const resultado = await enviarPedido(pedidoData, itensData);

      if (resultado.success) {
        localStorage.removeItem("selectedItems");
        setIsModalOpen(false);
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
        setCupom("");
        setDesconto(0);
        alert(`Pedido #${resultado.pedidoId} criado!`);
      }
    } catch (error) {
      console.error("Erro no pedido:", error);
      alert("Erro ao processar pedido");
    }
  };

  // Renderização
  return (
    <div className="bg-neutral-950 text-white shadow-lg rounded-lg p-3 w-full max-w-3xl min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-center items-center relative mb-6">
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
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Lista de Itens */}
      <ul className="divide-y divide-gray-200">
        {selectedItems.map((item: any) => (
          <li key={item.id} className="flex items-end py-4">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <span className="absolute text-white text-sm font-extrabold bg-purple-600/80 flex py-0.5 px-1 rounded-full -top-3 -right-3">
                {item.quantity}x
              </span>
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm font-bold flex items-center gap-1 text-gray-500">
                Tamanho: {item.selectedSize} | Cor:{" "}
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{ backgroundColor: item.selectedColor }}
                />
              </p>
            </div>
            <div className="text-md font-bold">
              R${(item.price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      {/* Seção de Pagamento */}
      <div className="fixed w-full bottom-0 left-0 flex flex-col gap-4 bg-neutral-950 p-2">
        <div className="flex gap-4 px-2">
          <input
            type="text"
            placeholder="Código do cupom"
            value={cupom}
            onChange={handleCupomChange}
            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-200 transition-colors duration-300"
          />
          <button
            onClick={aplicarDesconto}
            className="px-4 py-2 text-white bg-violet-600 font-bold rounded-md hover:bg-violet-700 transition-colors"
          >
            Aplicar
          </button>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Desconto:</span>
              <span className="text-green-600">{desconto}%</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-green-600">
                R${valorComDesconto.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-md transition-colors mt-4"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-neutral-950 text-white w-full max-w-lg p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-6">Dados do comprador</h2>

            <form className="space-y-4">
              <InputField
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo"
              />
              <InputField
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                mask="(99) 99999-9999"
                placeholder="Número para contato"
              />
              <InputField
                label="Idade"
                name="idade"
                value={formData.idade}
                onChange={handleInputChange}
                mask="99"
                placeholder="Idede"
              />
              <InputField
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={handleCEPChange}
                mask="99999-999"
                placeholder="CEP"
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleInputChange}
                  placeholder="Logradouro"
                />
                <InputField
                  label="Número"
                  name="numeroCasa"
                  value={formData.numeroCasa}
                  onChange={handleInputChange}
                  placeholder="Nº"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                />
                <InputField
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="Estado"
                />
              </div>

              <InputField
                label="Complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                optional
                placeholder="Complemento (opcional)"
              />
            </form>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarDados}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
