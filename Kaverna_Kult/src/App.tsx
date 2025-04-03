import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/cartContext/cartContext";
import Navbar from "./components/layout/Navbar/navbar";
import Footer from "./components/layout/Footer/footer";
import Home from "@/pages/Home/homePage";
import ProductsPage from "@/pages/ProductsPage/productPage";
import Contato from "@/pages/Contato/contatoPage";
import NotFound from "@/pages/NotFound/notFoundPage";
import CheckoutPage from "@/pages/checkout/checkoutPage";
import LoginPage from "@/pages/login/login";
import CheckOrderStatusPage from "@/pages/CheckOrderStatusPage/CheckOrderStatusPage";
// import { AuthProvider } from "@/contexts/protect/authContext";
// import ProtectedRoute from "./components/protect/ProtectedRoute";
import ScannerPage from "./pages/ScannerAR/scanner";
import ArtistPage from "./pages/artistPage/artistPage";
import { ProductModalProvider } from "./contexts/productModalContext/ProductModalContext";


function App() {
  const location = useLocation();

  // Determina se a rota é uma rota de admin ou checkout
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCheckoutRoute = location.pathname.startsWith("/checkout");
  const isLoginRoute = location.pathname.startsWith("/login");
  const isSouArtistaRoute = location.pathname.startsWith("/souArtista");
  const isCadastroArtistaRoute =
    location.pathname.startsWith("/cadastroArtista");

  return (
      <ProductModalProvider>
        <CartProvider>
          <div
            className={`flex flex-col min-h-screen relative bg-black ${
              isAdminRoute ||
              isCheckoutRoute ||
              isLoginRoute ||
              isSouArtistaRoute ||
              isCadastroArtistaRoute
                ? ""
                : "with-navbar-footer"
            }`}
          >
            {!isAdminRoute &&
              !isCheckoutRoute &&
              !isLoginRoute &&
              !isSouArtistaRoute &&
              !isCadastroArtistaRoute && <Navbar />}

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<ProductsPage />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/Scanner" element={<ScannerPage />} />
                <Route
                  path="/checkoutOrder"
                  element={<CheckOrderStatusPage />}
                />

                {/* Nova rota para a página do artista */}
                <Route path="/artist/:artistId" element={<ArtistPage />} />

                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Renderiza o Footer apenas se não for uma rota de admin */}
            {!isAdminRoute &&
              !isCheckoutRoute &&
              !isLoginRoute &&
              !isCadastroArtistaRoute && <Footer />}
          </div>
        </CartProvider>
      </ProductModalProvider>
  );
}

export default App;
