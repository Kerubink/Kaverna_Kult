import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistLoginForm from "./forms/ArtistLoginForm";
import ArtistRegistrationForm from "./forms//ArtistRegistrationForm";

const ArtistAuth = () => {
  return (
    <section className="w-full h-screen bg-[url('/banner.jpg')] bg-cover flex flex-col items-center justify-center">
      <div className="absolute z-10 w-full h-full bg-black/75 backdrop-blur-sm"></div>
      <Tabs defaultValue="entrar" className="w-full lg:w-[450px] absolute z-50">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entrar">Entrar</TabsTrigger>
          <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
        </TabsList>
        <TabsContent value="entrar">
          <ArtistLoginForm />
        </TabsContent>
        <TabsContent value="cadastro">
          <ArtistRegistrationForm />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ArtistAuth;
