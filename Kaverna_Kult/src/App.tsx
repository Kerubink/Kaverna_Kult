import "./App.css";
import Navbar from "./components/layout/Navbar/navbar";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <section
          className="h-dvh flex justify-center items-center text-white bg-zinc-900"
          style={{ height: `calc(100vh - 125px)` }}
        >
          <div className="flex-1 flex flex-col items-center">
            <div className="flex flex-col w-1/2 gap-6">
              <h1 className="text-4xl font-bol">Bem-vindo à Kaverna Kult</h1>
              <p className="text-lg">
                Descubra camisetas personalizadas exclusivas, feitas com amor e
                criatividade. Perfeitas para você se destacar com estilo e
                conforto!
              </p>
              <Button className="bg-slate-700 hover:bg-slate-600">
                compre agora
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-slate-400 w-80 h-80">imagem</div>
          </div>
        </section>
        <section className="w-full min-h-screen bg-black text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Título */}
            <h1 className="text-4xl font-bold mb-6 text-center">Produtos</h1>

            {/* Filtros */}
            <div className="flex items-center justify-between mb-8">
              <ul className="flex gap-4 text-lg">
                <li className="cursor-pointer hover:text-gray-400">
                  mostrar todos
                </li>
                <li className="cursor-pointer hover:text-gray-400">
                  categoria 1
                </li>
                <li className="cursor-pointer hover:text-gray-400">
                  categoria 2
                </li>
                <li className="cursor-pointer hover:text-gray-400">
                  categoria 3
                </li>
              </ul>
              <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700">
                Filtro
              </button>
            </div>

            {/* Cards de Produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Exemplo de Card */}
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">Imagem</span>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">
                      Produto {index + 1}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Descrição breve do produto.
                    </p>
                    <p className="text-xl font-bold mt-2">R$ 99,99</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500">
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
banner
        </section>
        <footer className="bg-black text-white py-8">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
        <p className="text-sm text-gray-400">
          Somos uma loja especializada em camisetas personalizadas, trazendo estilo e exclusividade para o seu dia a dia.
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

      </div>
    </>
  );
}

export default App;
