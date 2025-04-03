function BannerPromotion() {
    return ( 
        <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16 px-4 sm:px-8">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Promoção Imperdível: 30% OFF em Todas as Camisetas!
            </h2>
            <p className="text-lg mb-6 sm:max-w-lg">
              Aproveite nossa oferta especial e adicione estilo ao seu
              guarda-roupa com camisetas exclusivas e criativas. Só até o final
              do mês!
            </p>
            <a
              href="/promo"
              className="bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-8 rounded-lg text-lg font-bold transition duration-300"
            >
              Aproveite Agora
            </a>
          </div>
        </section>
     );
}

export default BannerPromotion;