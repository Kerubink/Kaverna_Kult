import React from "react";

type Collection = {
  name: string;
  description: string;
  image: string;
  isNew?: boolean;
};

const collections: Collection[] = [
  {
    name: "Coleção Neon",
    description: "Ilumine seu estilo com designs vibrantes e ousados.",
    image: "/images/neon.jpg",
    isNew: true, 
  },
  {
    name: "Minimalismo Essencial",
    description: "Camisetas simples e elegantes para o dia a dia.",
    image: "/images/minimalist.jpg",
  },
  {
    name: "Vintage Nostálgico",
    description: "Reviva a moda com designs inspirados em décadas passadas.",
    image: "/images/vintage.jpg",
  },
  {
    name: "Arte Contemporânea",
    description: "Estampas exclusivas de artistas independentes.",
    image: "/images/contemporary.jpg",
  },
  {
    name: "Streetwear Urbano",
    description: "Explore o melhor do estilo das ruas com camisetas autênticas.",
    image: "/images/streetwear.jpg",
  },
];

const CollectionsSection: React.FC = () => {
  return (
    <section className="bg-gray-900 text-gray-100 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[#6495ed] mb-8">
          Nossas Coleções
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coleção principal destacada */}
          <div className="md:col-span-2">
            {collections
              .filter((collection) => collection.isNew)
              .map((collection, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden shadow-lg group"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-96 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-left">
                    <h3 className="text-2xl font-bold text-[#6495ed]">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-300">{collection.description}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Outras coleções */}
          <div className="grid grid-cols-2 gap-6 md:col-span-1">
            {collections
              .filter((collection) => !collection.isNew)
              .map((collection, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden shadow-md group"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2">
                    <h3 className="text-lg font-semibold text-[#6495ed]">
                      {collection.name}
                    </h3>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
