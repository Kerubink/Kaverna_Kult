import AddArtistForm from "../adminComponents/formArtist";
import ArtistTable from "../adminComponents/tableArtists";

function ArtistsAdmin() {
    return ( 
        <>
        <AddArtistForm/>
        <ArtistTable/>
        </>
     );
}

export default ArtistsAdmin;