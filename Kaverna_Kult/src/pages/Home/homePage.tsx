import BannerInsta from "@/components/layout/bannerInsta/bannerInsta";
import BannerPromotion from "@/components/layout/bannerPromotion/bannerPromotion";
import CollectionsSection from "@/components/layout/CollectionsSection/collectionsSection";
import { ProductModalProvider } from "@/contexts/productModalContext/ProductModalContext";
import ProductsSection from "@/components/layout/ProductsSection/ProductsSection";
import ProductModal from "@/components/product/productModal/ProductModal";
import styles from "./homePage.module.css";
import Carrossel from "@/components/carrossel/carrossel";
import CategoryCarousel from "@/components/layout/category/categoryCarrossel";
import CarrosselPromo from "@/components/carrossel/carrosselPromo/carrosselPromo";
import ProdutosPopulares from "@/components/product/productPopu/productPopu";
import ButtonRastreio from "@/components/buttons/buttonRastreio/Rastreio";

function Home() {
  return (
    <>
      <div>
        <Carrossel />
        <CarrosselPromo />
      </div>

      <CategoryCarousel />

      <ProductModalProvider>
        <ProdutosPopulares />
        <ProductsSection />
        <ProductModal />
      </ProductModalProvider>

      <BannerPromotion />
      <CollectionsSection />
      <BannerInsta />

      <ButtonRastreio />
    </>
  );
}

export default Home;
