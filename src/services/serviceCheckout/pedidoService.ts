// src/services/pedidoService.ts
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

interface Pedido {
  id?: string;
  total: number;
  descontos: {
    cupom: string;
    porcentagem: number;
    valor: number;
  };
  cliente: {
    nome: string;
    telefone: string;
    idade: string;
    endereco: {
      cep: string;
      cidade: string;
      estado: string;
      logradouro: string;
      numero: string;
      complemento?: string;
    };
  };
  createdAt: Timestamp; // Data de criação fixa
  status: {
    updatedAt: Timestamp; // Atualizado a cada mudança
    statusAtual: "Recebido" | "processando" | "enviado" | "entregue";
  };
}

interface ItemPedido {
  id?: string;
  pedidoId: string;
  nome: string;
  tamanho: string;
  cor: string;
  quantidade: number;
  precoUnitario: number;
  colecao: string;
  statusProducao: "pendente" | "em_producao" | "produzido";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const enviarPedido = async (
  pedido: Omit<Pedido, "id" | "createdAt" | "status">,
  itens: Omit<
    ItemPedido,
    "id" | "pedidoId" | "createdAt" | "updatedAt" | "statusProducao"
  >[]
): Promise<{ success: boolean; pedidoId?: string; message?: string }> => {
  const db = getFirestore();
  const batch = writeBatch(db);

  try {
    // 1. Criar pedido principal
    const pedidoRef = doc(collection(db, "pedidos"));
    const now = Timestamp.now();
    
    const pedidoCompleto: Pedido = {
      ...pedido,
      id: pedidoRef.id,
      createdAt: now, // Data de criação imutável
      status: {
        updatedAt: now, // Inicializa com data atual
        statusAtual: "Recebido",
      },
    };
    batch.set(pedidoRef, pedidoCompleto);

    // 2. Criar itens na coleção global
    const itensRef = collection(db, "itensPedidos");
    itens.forEach((item) => {
      const itemRef = doc(itensRef);
      const itemCompleto: ItemPedido = {
        ...item,
        id: itemRef.id,
        pedidoId: pedidoRef.id,
        statusProducao: "pendente",
        createdAt: now,
        updatedAt: now,
      };
      batch.set(itemRef, itemCompleto);
    });

    await batch.commit();

    return {
      success: true,
      pedidoId: pedidoRef.id,
      message: "Pedido registrado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao enviar o pedido:", error);
    return {
      success: false,
      message: "Erro ao processar o pedido. Tente novamente mais tarde.",
    };
  }
};

// Função para atualizar status (exemplo de uso)
export const atualizarStatusPedido = async (
  pedidoId: string, 
  novoStatus: Pedido["status"]["statusAtual"]
) => {
  const db = getFirestore();
  const pedidoRef = doc(db, "pedidos", pedidoId);

  try {
    await updateDoc(pedidoRef, {
      "status.statusAtual": novoStatus,
      "status.updatedAt": Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return false;
  }
};