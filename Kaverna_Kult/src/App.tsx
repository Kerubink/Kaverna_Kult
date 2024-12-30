import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/cartContext/cartContext"; 
import Navbar from "./components/layout/Navbar/navbar";
import Footer from "./components/layout/Footer/footer";
import Home from "@/pages/Home/homePage";
import ProductsPage from "@/pages/ProductsPage/productPage";
import Contato from "@/pages/Contato/contatoPage";
import NotFound from "@/pages/NotFound/notFoundPage";
import ProductForm from "@/pages/admin/dashboardAdmin"

function App() {
  return (
    <CartProvider> 
      <div className="flex flex-col min-h-screen relative bg-black">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/admin" element={<ProductForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </CartProvider>
  );
}

export default App;
