import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import NavigationMenuComponent from "./navigationMenu";
import { useCart } from "@/contexts/cartContext/cartContext";
import Cart from "@/components/Cart/Cart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="w-full p-3 flex flex-col gap-3 sticky z-50 top-0 bg-black text-white">
      <div className="flex items-center justify-between gap-4 relative">
        <img src="logo.png" alt="Logo" className="w-10 h-10" />

        <div className="absolute left-1/2 transform -translate-x-1/2 text-center font-bold">
          Kaverna Kult
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="py-2 flex items-center justify-center gap-1 text-sm text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
              />
            </svg>
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                className="py-2 flex items-center justify-center gap-1 text-sm text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
                    <path d="M17 17H6V3H4" />
                    <path d="m6 5l14 1l-1 7H6" />
                  </g>
                </svg>
                <span>{cart.length}</span>
              </button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>Meu carrinho</SheetTitle>
                
              </SheetHeader>
              <SheetDescription className="flex flex-col flex-1 overflow-auto">
                  <Cart />
                </SheetDescription>
            </SheetContent>
          </Sheet>

          {/* <button className="md:hidden p-2 text-white" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button> */}
        </div>
      </div>

      {/* <Separator className="bg-white" /> */}

      {/* <div
        className={`flex justify-center ${isMenuOpen ? "hidden" : "md:block"}`}
      >
        <NavigationMenuComponent />
      </div> */}

      {/* {isMenuOpen && (
        <div className="md:hidden bg-black text-white p-4">
          <div className="flex flex-col gap-3">
            <a href="/" className="text-white py-2">
              Novidades
            </a>
            <a href="/" className="text-white py-2">
              Coleções
            </a>
            <a href="/" className="text-white py-2">
              Mais Vendidos
            </a>
            <a href="/docs" className="text-white py-2">
              Contato
            </a>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Navbar;
