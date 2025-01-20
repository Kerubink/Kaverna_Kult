// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/cartContext/cartContext";
import Navbar from "./components/layout/Navbar/navbar";
import Footer from "./components/layout/Footer/footer";
import Home from "@/pages/Home/homePage";
import ProductsPage from "@/pages/ProductsPage/productPage";
import Contato from "@/pages/Contato/contatoPage";
import NotFound from "@/pages/NotFound/notFoundPage";
import ProductForm from "@/pages/admin/adminPages/produtosAdmin";
import PedidosPage from "@/pages/admin/adminPages/pedidosAdmin";
import ConfiguracoesPage from "@/pages/admin/adminPages/geralAdmin";
import DashboardPage from "@/pages/admin/dashboardAdmin";
import CheckoutPage from "@/pages/checkout/checkoutPage";
import LoginPage from "@/pages/login/login";
import { getAuth } from "firebase/auth";

// Verifica se o usuário está autenticado com o Firebase
const isAuthenticated = () => {
  const user = getAuth().currentUser;
  return user !== null;
};

// Componente para rotas protegidas
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      <div
        className={`flex flex-col min-h-screen relative bg-black ${
          isAdminRoute ? "" : "with-navbar-footer"
        }`}
      >
        {!isAdminRoute && <Navbar />}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={<ProtectedRoute element={<DashboardPage />} />}
            >
              <Route path="produtos" element={<ProductForm />} />
              <Route path="pedidos" element={<PedidosPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
            </Route>

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;
