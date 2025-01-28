import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/protect/authContext";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Mostre um spinner ou tela de carregamento enquanto verifica o estado da autenticação
    return <div>Carregando...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
