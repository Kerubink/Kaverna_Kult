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
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="p-3 flex flex-col gap-3 fixed left-1/2 top-2 translate-x-[-50%] w-[95%] rounded-lg z-50 backdrop-blur-xl bg-black/50 text-white">
      <div className="flex items-center justify-between gap-4 relative">
        <Link to="/">
          <img src="logo.png" alt="Logo" className="w-10 h-10" />
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2 text-center font-bold">
          Kaverna Kult
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="py-2 flex items-center justify-center gap-1 text-sm text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent className="flex flex-col p-1">
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
