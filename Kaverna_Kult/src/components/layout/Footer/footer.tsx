function Footer() {
    return ( 
        <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
              <p className="text-sm text-gray-400">
                Somos uma loja especializada em camisetas personalizadas,
                trazendo estilo e exclusividade para o seu dia a dia.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <a href="#produtos" className="hover:text-gray-200">
                    Produtos
                  </a>
                </li>
                <li>
                  <a href="#sobre" className="hover:text-gray-200">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#contato" className="hover:text-gray-200">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#ajuda" className="hover:text-gray-200">
                    Ajuda
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>Email: contato@kavernakult.com</li>
                <li>Telefone: (99) 99999-9999</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200"
                >
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200"
                >
                  <i className="fab fa-instagram"></i> Instagram
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200"
                >
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
            © 2024 Kaverna Kult. Todos os direitos reservados.
          </div>
        </div>
      </footer>
     );
}

export default Footer;