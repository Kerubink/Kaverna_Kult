import { db } from "../database/firebase_config"; // Ajuste o caminho conforme necessário
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Função para obter o papel do usuário logado
export const getUserRole = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    // Acessa o documento do usuário no Firestore
    const userDocRef = doc(db, "users", user.uid); // Supondo que você tenha uma coleção 'users'
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role; // Retorna o papel (role) do usuário
    }
  }

  return null; // Retorna null se o papel não for encontrado
};
