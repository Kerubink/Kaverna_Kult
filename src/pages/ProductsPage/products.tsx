import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "@/database/firebase_config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

const categoryBanners: Record<string, string> = {
  Kustom: "/banners/kustom-banner.jpg",
  Masculino: "/banners/streetwear-banner.jpg",
  Feminino: "/banners/casual-banner.jpg",
  Infantil: "/banners/casual-banner.jpg",
  Acessorios: "/banners/casual-banner.jpg",
};

function Products() {
  const { openModal } = useProductModal();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (!categoryFromUrl) {
          console.log("⚠ Nenhuma categoria na URL, buscando TODOS os produtos...");
          return;
        }

        console.log("📡 Buscando produtos da categoria:", categoryFromUrl);

        const productsQuery = query(
          collection(db, "products"),
          where("category", "==", categoryFromUrl)
        );

        const querySnapshot = await getDocs(productsQuery);
        let productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        console.log("✅ Produtos filtrados:", productsList);

        // Aplicar ordenação por preço
        productsList.sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

        setProducts(productsList);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryFromUrl, sortOrder]);

  return (
    <div className="bg-black sm:px-8">
      {/* 🔥 Banner Dinâmico */}
      {categoryFromUrl && (
        <div className="relative bg-slate-800 w-full h-80 sm:h-64 md:h-72 lg:h-80 mb-8">
          <img
            src={categoryBanners[categoryFromUrl] || "/banners/default-banner.jpg"}
            alt={categoryFromUrl}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">{categoryFromUrl}</h2>
          </div>
        </div>
      )}

      {/* 🔥 Filtro de Ordenação */}
      <div className="flex justify-between items-center px-4 mb-6">
        <h2 className="text-xl text-white font-bold">{categoryFromUrl ? `Produtos - ${categoryFromUrl}` : "Todos os Produtos"}</h2>
        <select
          className="bg-gray-700 text-white p-2 rounded-lg"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Menor Preço</option>
          <option value="desc">Maior Preço</option>
        </select>
      </div>

      {/* 🔥 Lista de Produtos */}
      {loading ? (
        <p className="text-center text-white my-4">Carregando produtos...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 flex-1 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openModal(product)}
            >
             <div className="h-48 flex items-center rounded-md justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">Sem Imagem</span>
                  )}
                </div>
                <div className="">
                  <div className="flex items-center text-white justify-between mt-1">
                    <h2 className="text-sm font-semibold">{product.name}</h2>
                    <p className="text-sm font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {product.pattern || "sem classificação"}
                  </p>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white m-4">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}

export default Products;
