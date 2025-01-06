function BannerInsta() {
    return ( 
        <section className="bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Título */}
            <h2 className="text-3xl font-bold mb-4">
              Siga a gente no Instagram
            </h2>

            {/* Parágrafo */}
            <p className="text-gray-400 mb-8">
              Fique por dentro das nossas novidades e inspirações diárias! Não
              perca nossos lançamentos exclusivos e ideias de looks incríveis.
            </p>

            {/* Container de Imagens */}
            <div className="flex gap-1  justify-center items-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-1/4 bg-slate-600 ${
                    index % 2 === 0 ? "h-[200px]" : "h-[250px]"
                  }`}
                >
                  {/* Imagem Simulada */}
                  <img
                    src={`https://via.placeholder.com/300x${
                      index % 2 === 0 ? "100" : "150"
                    }`}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
     );
}

export default BannerInsta;