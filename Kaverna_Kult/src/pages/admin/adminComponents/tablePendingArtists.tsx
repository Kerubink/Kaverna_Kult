import { useEffect, useState } from "react";
import { db } from "../../../database/firebase_config";
import { collection, getDocs, getDoc, deleteDoc, setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ArtistPedingTable = ({ searchTerm }: { searchTerm: string }) => {
  const [pendingArtists, setPendingArtists] = useState<any[]>([]);
  const [approvedArtists, setApprovedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending and approved artists
  useEffect(() => {
    const fetchArtists = async () => {
      const pendingSnapshot = await getDocs(collection(db, "artists_pending"));
      const pendingList = pendingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const approvedSnapshot = await getDocs(collection(db, "artists"));
      const approvedList = approvedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPendingArtists(pendingList);
      setApprovedArtists(approvedList);
      setLoading(false);
    };

    fetchArtists();
  }, []);

  // Approve artist (move from pending to approved)
  const approveArtist = async (id: string) => {
    const artistRef = doc(db, "artists_pending", id);
    const artistSnapshot = await getDoc(artistRef);
    if (artistSnapshot.exists()) {
      const artistData = artistSnapshot.data();
  
      // Add artist to approved collection
      await setDoc(doc(db, "artists", id), { ...artistData, isApproved: true });
  
      // Remove artist from pending collection
      await deleteDoc(artistRef);
  
      // Update state
      setPendingArtists((prev) => prev.filter((a) => a.id !== id));
      setApprovedArtists((prev) => [...prev, { id, ...artistData, isApproved: true }]);
    }
  };

  // Delete artist from either pending or approved
  const deleteArtist = async (id: string, collectionName: string) => {
    if (confirm("Tem certeza que deseja excluir este artista?")) {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === "artists_pending") {
        setPendingArtists((prev) => prev.filter((a) => a.id !== id));
      } else {
        setApprovedArtists((prev) => prev.filter((a) => a.id !== id));
      }
    }
  };

  // Filter artists based on search term
  const filterArtists = (artists: any[]) => {
    return artists.filter((artist) => {
      const search = searchTerm.toLowerCase();
      
      // Verificando se os campos necessários existem antes de compará-los
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
      {/* Table for Pending Artists */}
      <Card className="w-full mb-6">
        <CardHeader className="bg-yellow-500 rounded-lg text-white">
          <CardTitle>Artistas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando artistas pendentes...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Portfólio</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterArtists(pendingArtists).map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell>{artist.fullName}</TableCell>
                    <TableCell>@{artist.username}</TableCell>
                    <TableCell>{artist.email}</TableCell>
                    <TableCell>{artist.contato}</TableCell>
                    <TableCell>{artist.portfolioLink}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button onClick={() => approveArtist(artist.id)}>Aprovar</Button>
                      <Button variant="destructive" onClick={() => deleteArtist(artist.id, "artists_pending")}>Excluir</Button>
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

export default ArtistPedingTable;
