import { useState } from "react";
import ArtistTable from "../adminComponents/tableArtists";
import ArtistPedingTable from "../adminComponents/tablePendingArtists";

function ArtistsAdmin() {
  const [searchTerm, setSearchTerm] = useState<string>("");  // Estado para armazenar o termo de busca

  return (
    <div>
      {/* Campo de busca global */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar por nome, e-mail ou @"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-class"  // Altere a classe conforme necessário
        />
      </div>

      {/* Tabelas com busca aplicada */}
      <ArtistPedingTable searchTerm={searchTerm} />
      <ArtistTable searchTerm={searchTerm} />
    </div>
  );
}

export default ArtistsAdmin;
