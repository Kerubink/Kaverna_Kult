
import BannerInsta from "@/components/layout/bannerInsta/bannerInsta";
import BannerPromotion from "@/components/layout/bannerPromotion/bannerPromotion";
import CollectionsSection from "@/components/layout/CollectionsSection/collectionsSection";
import { ProductModalProvider } from "@/contexts/productModalContext/ProductModalContext";
import ProductsSection from "@/components/layout/ProductsSection/ProductsSection";
import ProductModal from "@/components/product/productModal/ProductModal";
import styles from "./homePage.module.css";
import Carrossel from "@/components/carrossel/carrossel";
import CategoryCarousel from "@/components/layout/category/categoryCarrossel";

function Home() {


  return (
    <>
      <Carrossel/>

      <CategoryCarousel/>

      <ProductModalProvider>
        <ProductsSection />
        <ProductModal />
      </ProductModalProvider>

      <BannerPromotion />
      <CollectionsSection />
      <BannerInsta />
    </>
  );
}

export default Home;
