import { useEffect, useState } from "react";
import { db } from "../../../database/firebase_config";
import { collection, updateDoc, doc, deleteDoc, onSnapshot, deleteField } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ArtistTable = ({ searchTerm }: { searchTerm: string }) => {
  const [artists, setArtists] = useState<any[]>([]);
  const [bannedArtists, setBannedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [banReason, setBanReason] = useState<string>("");  
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "artists"), (querySnapshot) => {
      const artistList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArtists(artistList.filter((artist) => !artist.isBanned));
      setBannedArtists(artistList.filter((artist) => artist.isBanned));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const approveArtist = async (id: string) => {
    await updateDoc(doc(db, "artists", id), { isApproved: true });
  };

  const banArtist = async () => {
    if (selectedArtistId && banReason.trim()) {
      await updateDoc(doc(db, "artists", selectedArtistId), {
        isBanned: true,
        isApproved: false,
        banReason: banReason.trim(),
      });

      setBanReason("");
      setSelectedArtistId(null);
    }
  };

  const unbanArtist = async (id: string) => {
    await updateDoc(doc(db, "artists", id), {
      isBanned: false,
      isApproved: true,
      banReason: deleteField(),
    });

    setArtists((prevArtists) => prevArtists.filter((artist) => artist.id !== id));
    setBannedArtists((prevBanned) => prevBanned.filter((artist) => artist.id !== id));
  };

  const deleteArtist = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artista?")) {
      await deleteDoc(doc(db, "artists", id));
    }
  };

  // Filter artists based on search term
  const filterArtists = (artists: any[]) => {
    const search = searchTerm.toLowerCase();
    return artists.filter((artist) => {
      return (
        (artist.fullName && artist.fullName.toLowerCase().includes(search)) ||
        (artist.username && artist.username.toLowerCase().includes(search)) ||
        (artist.contato && artist.contato.toLowerCase().includes(search)) ||
        (artist.email && artist.email.toLowerCase().includes(search))
      );
    });
  };

  return (
    <div>
      {/* Tabela de artistas aprovados */}
      <Card className="w-full">
        <CardHeader className="bg-green-500 rounded-lg text-white">
          <CardTitle>Gerenciar Artistas Aprovados</CardTitle>
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
                  <TableCell>Total de Produtos</TableCell>
                  <TableCell>Popularidade</TableCell>
                  <TableCell>Total de vendas</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterArtists(artists).map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell>{artist.fullName}</TableCell>
                    <TableCell>@{artist.username}</TableCell>
                    <TableCell>{artist.email}</TableCell>
                    <TableCell>{artist.totalProducts}</TableCell>
                    <TableCell>{artist.popularity}</TableCell>
                    <TableCell>{artist.totalSales}</TableCell>
                    <TableCell className="flex gap-2">
                      {!artist.isApproved && <Button onClick={() => approveArtist(artist.id)}>Aprovar</Button>}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" onClick={() => setSelectedArtistId(artist.id)}>Banir</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Motivo do Banimento</DialogTitle>
                          <DialogDescription>
                            Por favor, forneça um motivo para o banimento deste artista:
                          </DialogDescription>
                          <Input
                            placeholder="Digite o motivo"
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                          />
                          <DialogFooter>
                            <Button onClick={banArtist}>Confirmar Banimento</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Tabela de artistas banidos */}
      <Card className="w-full mt-6">
        <CardHeader className="bg-red-500 rounded-lg text-white">
          <CardTitle>Artistas Banidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando artistas banidos...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Motivo do Banimento</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterArtists(bannedArtists).map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell>{artist.fullName}</TableCell>
                    <TableCell>@{artist.username}</TableCell>
                    <TableCell>{artist.contato}</TableCell>
                    <TableCell>{artist.banReason || "Sem motivo especificado"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="secondary" onClick={() => unbanArtist(artist.id)}>Desbanir</Button>
                      <Button variant="destructive" onClick={() => deleteArtist(artist.id)}>Excluir</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistTable;
