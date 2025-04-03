// src/services/cepService.ts
export const buscarEnderecoPorCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("Erro ao buscar o endereço.");
      const data = await response.json();
  
      if (data.erro) throw new Error("CEP não encontrado.");
      return data; // Retorna o objeto com os dados do endereço
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      alert("Erro ao buscar o endereço. Verifique o CEP e tente novamente.");
      return null;
    }
  };
  