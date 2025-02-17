import { useState } from "react";
import { db } from "../../../database/firebase_config"; // Importa o Firestore configurado
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddArtistForm = () => {
  const [artist, setArtist] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
    bannerPicture: "",
    instagram: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtist({ ...artist, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "artists"), {
        ...artist,
        createdAt: serverTimestamp(),
        isApproved: false, 
        earnings: 0,
        shirts: [],
      });

      alert("Artista adicionado com sucesso!");
      setArtist({
        name: "",
        username: "",
        email: "",
        bio: "",
        profilePicture: "",
        bannerPicture: "",
        instagram: "",
        website: "",
      });
    } catch (error) {
      console.error("Erro ao adicionar artista:", error);
      alert("Erro ao adicionar artista!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Adicionar Artista</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Nome" value={artist.name} onChange={handleChange} required />
          <Input name="username" placeholder="Username" value={artist.username} onChange={handleChange} required />
          <Input name="email" placeholder="Email" type="email" value={artist.email} onChange={handleChange} required />
          <Input name="bio" placeholder="Biografia" value={artist.bio} onChange={handleChange} />
          <Input name="profilePicture" placeholder="URL da Foto de Perfil" value={artist.profilePicture} onChange={handleChange} />
          <Input name="bannerPicture" placeholder="URL do Banner" value={artist.bannerPicture} onChange={handleChange} />
          <Input name="instagram" placeholder="Instagram (opcional)" value={artist.instagram} onChange={handleChange} />
          <Input name="website" placeholder="Website (opcional)" value={artist.website} onChange={handleChange} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adicionando..." : "Adicionar Artista"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddArtistForm;
