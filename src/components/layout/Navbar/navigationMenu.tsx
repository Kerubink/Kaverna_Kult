import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

function NavigationMenuComponent() {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList className="flex space-x-6">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">Lançamentos</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-black text-white p-4 rounded-md shadow-lg">
            <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-4">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-700/50 to-gray-800 p-6 no-underline outline-none focus:shadow-md"
                    href="/novidades"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Lançamentos Imperdíveis
                    </div>
                    <p className="text-sm leading-tight text-gray-400">
                      Descubra as novas estampas que acabaram de chegar na nossa coleção.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Estampas Exclusivas</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Camisetas de Temporada</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Novas Colaborações</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Linha Premium</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">Estilos Populares</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-black text-white p-4 rounded-md shadow-lg">
            <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[700px]">
              <li>
                <NavigationMenuLink href="#">Minimalista</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Arte Contemporânea</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Cultura Pop</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Estilo Vintage</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Grafismos Coloridos</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Estilo Geek</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">Descubra</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-black text-white p-4 rounded-md shadow-lg md:w-[400px] md:grid-cols-2 lg:w-[600px]">
            <ul className="p-4">
              <li>
                <NavigationMenuLink href="#">Camisetas Exclusivas para Presente</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Edições Limitadas</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Melhores Avaliações</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Tendências do Momento</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/contato" className={`${navigationMenuTriggerStyle()}, ${'hover:bg-zinc-600'}`}>
            <NavigationMenuLink >Contato</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavigationMenuComponent;
