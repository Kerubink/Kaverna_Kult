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
import ProdutosPage from "@/pages/admin/adminPages/produtosAdmin";
import CheckOrderStatusPage from "@/pages/CheckOrderStatusPage/CheckOrderStatusPage";
import { AuthProvider } from "@/contexts/protect/authContext";
import ProtectedRoute from "./components/protect/ProtectedRoute";
import ScannerPage from "./pages/ScannerAR/scanner";

function App() {
  const location = useLocation();

  // Determina se a rota é uma rota de admin ou checkout
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCheckoutRoute = location.pathname.startsWith("/checkout");
  const isLoginRoute = location.pathname.startsWith("/login");

  return (
    <AuthProvider>
      <CartProvider>
        <div
          className={`flex flex-col min-h-screen relative bg-black ${
            isAdminRoute || isCheckoutRoute || isLoginRoute
              ? ""
              : "with-navbar-footer"
          }`}
        >
          {/* Renderiza a Navbar apenas se não for uma rota de admin nem a rota de checkout */}
          {!isAdminRoute && !isCheckoutRoute && !isLoginRoute && <Navbar />}

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/Scanner" element={<ScannerPage />} />
              <Route path="/checkoutOrder" element={<CheckOrderStatusPage />} />

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
    </AuthProvider>
  );
}

export default App;
