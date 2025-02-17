import React, { useEffect, useState } from "react";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../database/firebase_config";
import ProductModal from "@/components/product/productModal/ProductModal";

interface Artist {
  id: string;
  name: string;
  bio: string;
  profilePicture: string;
  username: string;
  banner: string;
  socialLinks?: { instagram?: string; twitter?: string };
  totalProducts?: number;
  totalSales?: number;
  popularity?: number;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface Order {
  id: string;
  productIds: string[];  // IDs dos produtos no pedido
  totalPrice: number;    // Preço total do pedido
}

const ArtistPage: React.FC = () => {
  const { openModal } = useProductModal();
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const artistRef = doc(db, "artists", artistId);
        const artistSnap = await getDoc(artistRef);

        if (artistSnap.exists()) {
          const artistData = artistSnap.data() as Artist;
          setArtist(artistData);

          // Buscar os produtos do artista
          const productQuery = query(
            collection(db, "products"),
            where("artistId", "==", artistId)
          );
          const productSnapshot = await getDocs(productQuery);
          const fetchedProducts: Product[] = productSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];

          setProducts(fetchedProducts);

          // Buscar pedidos relacionados ao artista para calcular as vendas
          const orderQuery = query(
            collection(db, "orders"),
            where("productIds", "array-contains", artistId) // Filtra pedidos que contenham o ID do artista
          );
          const orderSnapshot = await getDocs(orderQuery);
          const fetchedOrders: Order[] = orderSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[];

          setOrders(fetchedOrders);

        }
      } catch (error) {
        console.error("Erro ao carregar os dados do artista:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center text-white mt-10">Artista não encontrado</div>
    );
  }

  // Calculando o total de produtos e vendas
  const totalProducts = products.length;
  const totalSales = orders.reduce((acc, order) => {
    // Para cada pedido, somamos o preço total dos produtos relacionados ao artista
    return acc + order.productIds.filter(id => products.some(product => product.id === id)).length * 100; // Ajuste o cálculo do valor total se necessário
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Banner */}
      <div className="relative">
        <div className="relative rounded-b-3xl w-full h-60 md:h-80 bg-gray-700">
          <img
            src={artist.banner}
            alt={`Banner de ${artist.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold">{artist.name}</h1>
          </div>
        </div>

        {/* Informações do Artista */}
        <div className="flex flex-col items-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:left-[10%]">
          <img
            src={artist.profilePicture}
            alt={artist.name}
            className="w-28 h-28 md:w-40 md:h-40 rounded-full border-8 border-black shadow-lg"
          />
        </div>
      </div>

      <div className="pt-10 bg-black flex-1">
        <div className="w-full flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mt-4">{artist.name}</h2>
          <p className="text-gray-500 text-center text-sm max-w-lg m-1 ">
            @{artist.username}
          </p>
        </div>
        <div className="flex justify-around mt-8">
          <div className="text-center">
            <p className="font-semibold text-lg">{totalProducts}</p>
            <p className="text-gray-400">Estampas</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalSales)}
            </p>
            <p className="text-gray-400">Vendas</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">
              {artist.popularity} Estrelas
            </p>
            <p className="text-gray-400">Popularidade</p>
          </div>
        </div>

        <hr className="mx-2 my-3 border-gray-700" />

        {/* Produtos do Artista */}
        <div className="px-2 py-4">
          {products.length === 0 ? (
            <p className="text-gray-400">
              Este artista ainda não possui produtos.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    openModal(product);
                  }}
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
                    <div className="flex items-center justify-between mt-1">
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
          )}
        </div>
        <ProductModal />
      </div>
    </div>
  );
};

export default ArtistPage;
