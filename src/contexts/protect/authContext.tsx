import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/database/firebase_config";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserRole(currentUser.uid);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        setRole(userRole);

        if (userRole === "admin") {
          navigate("/admin/home");
        } else if (userRole === "artist") {
          navigate("/artist/home");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.error("Usuário não encontrado no Firestore.");
        setRole(null);
      }
    } catch (error) {
      console.error("Erro ao buscar role:", error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserRole(userCredential.user.uid);
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Falha ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
