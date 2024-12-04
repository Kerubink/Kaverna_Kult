import { Separator } from "@/components/ui/separator"
import NavigationMenuComponent from "./navigationMenu";
function Navbar() {
  return (
    <>
      <div className="w-full p-3 flex flex-col gap-3 sticky top-0 bg-black text-white">
        <div className="">
            <div className="flex items-center justify-between gap-4 relative">
                <img src="logo.png" alt="Logo" className="w-10 h-10" />
                
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center font-bold">
                    Kaverna Kult
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 flex items-center justify-center gap-1 text-sm text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/></svg>
                    favoritos
                    </button>
                    <button className="px-4 py-2 flex items-center justify-center gap-1 text-sm text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="M17 17H6V3H4"/><path d="m6 5l14 1l-1 7H6"/></g></svg>
                    carrinho
                    </button>
                </div>
            </div>
        </div>
        <Separator className="bg-white"/>
        <div className="flex justify-center">
          <NavigationMenuComponent/>
        </div>
      </div>
    </>
  );
}

export default Navbar;
