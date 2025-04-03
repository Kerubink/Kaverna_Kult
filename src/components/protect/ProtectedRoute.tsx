import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/protect/authContext";

const ProtectRoute = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (role === "admin") return <Navigate to="/admin/home" replace />;
  if (role === "artist") return <Navigate to="/artist/home" replace />;

  return <Outlet />;
};

export default ProtectRoute;
