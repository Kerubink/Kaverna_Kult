import BannerInsta from "@/components/layout/bannerInsta/bannerInsta";
import BannerPromotion from "@/components/layout/bannerPromotion/bannerPromotion";
import CollectionsSection from "@/components/layout/CollectionsSection/collectionsSection";
import { ProductModalProvider } from "@/contexts/ProductModalContext";
import ProductsSection from "@/components/layout/ProductsSection/ProductsSection";
import ProductModal from "@/components/product/productModal/ProductModal";

function Home() {
  return (
    <>
      <section
        className="h-dvh flex flex-col lg:flex-row justify-center items-center text-white bg-zinc-900 px-4"
        style={{ height: `calc(100vh - 125px)` }}
      >
        <div className="flex-1 flex flex-col items-center text-center lg:text-left">
          <div className="flex flex-col w-full lg:w-3/5 gap-6">
            <h1 className="text-3xl lg:text-5xl font-bold">
              Bem-vindo à Kaverna Kult
            </h1>
            <p className="text-base lg:text-lg">
              Descubra camisetas personalizadas exclusivas, feitas com amor e
              criatividade. Perfeitas para você se destacar com estilo e conforto!
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-center mt-8 lg:mt-0">
          <div className="bg-slate-400 w-60 h-60 sm:w-80 sm:h-80">imagem</div>
        </div>
      </section>

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
