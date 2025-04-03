import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Interface para o cupom
interface Cupom {
  nome: string;
  desconto: string; // Desconto em porcentagem
  validade: string; // Data de validade do cupom
}

// Função para verificar e aplicar o desconto do cupom
export const verificarCupom = async (codigo: string): Promise<{ valido: boolean; desconto?: number; mensagem?: string }> => {
  const db = getFirestore();
  const cupomRef = collection(db, "cupons");
  const q = query(cupomRef, where("nome", "==", codigo)); // Buscar cupom pelo nome

  try {
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { valido: false, mensagem: "Cupom não encontrado." };
    }

    const cupom = querySnapshot.docs[0].data() as Cupom;
    const validade = new Date(cupom.validade);
    const hoje = new Date();

    // Verifica se o cupom está dentro da validade
    if (hoje > validade) {
      return { valido: false, mensagem: "O cupom está vencido." };
    }

    // Se o cupom for válido, retorna o desconto em porcentagem
    return { valido: true, desconto: parseFloat(cupom.desconto) };
  } catch (error) {
    console.error("Erro ao verificar o cupom:", error);
    return { valido: false, mensagem: "Erro ao verificar o cupom. Tente novamente." };
  }
};
