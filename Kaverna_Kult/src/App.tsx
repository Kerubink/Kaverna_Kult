import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/cartContext/cartContext";
import Navbar from "./components/layout/Navbar/navbar";
import Footer from "./components/layout/Footer/footer";
import Home from "@/pages/Home/homePage";
import ProductsPage from "@/pages/ProductsPage/productPage";
import Contato from "@/pages/Contato/contatoPage";
import NotFound from "@/pages/NotFound/notFoundPage";
import PedidosPage from "@/pages/admin/adminPages/pedidosAdmin";
import ConfiguracoesPage from "@/pages/admin/adminPages/geralAdmin";
import DashboardPage from "@/pages/admin/dashboardAdmin";
import CheckoutPage from "@/pages/checkout/checkoutPage";
import LoginPage from "@/pages/login/login";
import { getAuth } from "firebase/auth";
import ProdutosPage from "@/pages/admin/adminPages/produtosAdmin";

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
  const location = useLocation();

  // Determina se a rota é uma rota de admin ou checkout
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCheckoutRoute = location.pathname.startsWith("/checkout");

  return (
    <CartProvider>
      <div
        className={`flex flex-col min-h-screen relative bg-black ${
          isAdminRoute || isCheckoutRoute ? "" : "with-navbar-footer"
        }`}
      >
        {/* Renderiza a Navbar apenas se não for uma rota de admin nem a rota de checkout */}
        {!isAdminRoute && !isCheckoutRoute && <Navbar />}

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
              <Route path="produtos" element={<ProdutosPage />} />
              <Route path="pedidos" element={<PedidosPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
            </Route>

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Renderiza o Footer apenas se não for uma rota de admin */}
        {!isAdminRoute && !isCheckoutRoute && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;
