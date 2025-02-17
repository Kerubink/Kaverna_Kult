import { useEffect, useState } from "react";
import { db } from "../../../database/firebase_config";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ArtistTable = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      const querySnapshot = await getDocs(collection(db, "artists"));
      const artistList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArtists(artistList);
      setLoading(false);
    };

    fetchArtists();
  }, []);

  const approveArtist = async (id: string) => {
    await updateDoc(doc(db, "artists", id), { isApproved: true });
    setArtists((prev) => prev.map((a) => (a.id === id ? { ...a, isApproved: true } : a)));
  };

  const banArtist = async (id: string) => {
    await updateDoc(doc(db, "artists", id), { isApproved: false });
    setArtists((prev) => prev.map((a) => (a.id === id ? { ...a, isApproved: false } : a)));
  };

  const deleteArtist = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artista?")) {
      await deleteDoc(doc(db, "artists", id));
      setArtists((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerenciar Artistas</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando artistas...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Aprovado?</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>@{artist.username}</TableCell>
                  <TableCell>{artist.email}</TableCell>
                  <TableCell>{artist.isApproved ? "✅ Sim" : "❌ Não"}</TableCell>
                  <TableCell className="flex gap-2">
                    {!artist.isApproved && <Button onClick={() => approveArtist(artist.id)}>Aprovar</Button>}
                    {artist.isApproved && <Button variant="destructive" onClick={() => banArtist(artist.id)}>Banir</Button>}
                    <Button variant="secondary" onClick={() => alert("Editar funcionalidade futura")}>Editar</Button>
                    <Button variant="destructive" onClick={() => deleteArtist(artist.id)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtistTable;
