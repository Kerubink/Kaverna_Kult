import { ProductModalProvider } from "@/contexts/productModalContext/ProductModalContext";
import ProductModal from "@/components/product/productModal/ProductModal";
import Products from "./products";



function ProductsPage() {
 
  return (
    <ProductModalProvider>
      <Products/>
      <ProductModal />
    </ProductModalProvider>
  );
}

export default ProductsPage;
