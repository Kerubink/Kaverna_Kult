// src/services/authService.ts
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/database/firebase_config"; // Supondo que o Firebase já esteja configurado no seu projeto
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";

// Função para verificar o papel do usuário
export const getUserRole = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData?.role || "artist"; // Retorna o papel ou 'artist' como padrão
    }
    return "artist"; // Caso o usuário não exista, assume-se que é um "artist"
  } catch (error) {
    console.error("Erro ao verificar o papel do usuário: ", error);
    return "artist";
  }
};

export const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair: ", error);
    }
  };

// Função para obter o ID do usuário atual
export const getCurrentUserRole = async (): Promise<string> => {
    const user = auth.currentUser; // Obtém usuário atual imediatamente
  
    if (user) {
      return await getUserRole(user.uid);
    }
  
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const role = await getUserRole(user.uid);
          resolve(role);
        } else {
          resolve("artist"); // Garante um retorno seguro
        }
      });
    });
  };

  // Função para obter os dados do usuário atual (nome, email, avatar)
export const getCurrentUserData = async () => {
    const user = auth.currentUser; // Obtém usuário atual imediatamente
  
    if (user) {
      return await getUserData(user.uid);
    }
  
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getUserData(user.uid);
          resolve(userData);
        } else {
          resolve(null); // Retorna null caso não tenha usuário logado
        }
      });
    });
  };
  
  // Função para buscar dados do usuário no Firestore
  export const getUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data(); // Retorna todos os dados do usuário
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário: ", error);
      return null;
    }
  };
  