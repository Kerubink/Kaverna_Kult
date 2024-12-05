function Contato() {
    return ( 
        <section className="bg-black text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Título */}
          <h2 className="text-3xl font-bold mb-4">Entre em Contato</h2>

          {/* Parágrafo */}
          <p className="text-gray-400 mb-8">
            Tem alguma dúvida ou sugestão? Envie-nos uma mensagem e
            retornaremos o mais rápido possível.
          </p>

          {/* Formulário */}
          <form className="space-y-6">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Digite seu nome"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Digite seu email"
                required
              />
            </div>

            {/* Mensagem */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Digite sua mensagem"
                required
              />
            </div>

            {/* Botão de envio */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 transition-colors"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>
     );
}

export default Contato;