import { ProductModalProvider } from "@/contexts/ProductModalContext";
import ProductsSection from "@/components/layout/ProductsSection/ProductsSection";
import ProductModal from "@/components/product/productModal/ProductModal";

function ProductsPage() {
  return (
    <div className="bg-gray-800 py-16 px-4 sm:px-8">
      <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-white text-center">
        Produtos
      </h2>
      <ProductModalProvider>
        <ProductsSection />
        <ProductModal />
      </ProductModalProvider>
    </div>
  );
}

export default ProductsPage;
