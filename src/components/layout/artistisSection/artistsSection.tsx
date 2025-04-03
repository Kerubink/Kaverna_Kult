import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../database/firebase_config';

interface Artist {
  id: string;
  name: string;
  bio: string;
  profilePicture: string;
}

const FeaturedArtistsSection: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      try {
        const q = query(collection(db, 'artists'), limit(4));
        const querySnapshot = await getDocs(q);
        const fetchedArtists: Artist[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Artist[];
        setArtists(fetchedArtists);
      } catch (error) {
        console.error('Erro ao buscar artistas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtists();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center text-white items-center h-40">
        <p>carregando artistas...</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Artistas em Destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map(artist => (
          <div 
            key={artist.id} 
            className="bg-gray-800 p-5 rounded-2xl shadow-md hover:scale-105 transition-transform"
          >
            <img 
              src={artist.profilePicture} 
              alt={artist.name} 
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold text-white mt-4">{artist.name}</h3>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{artist.bio}</p>
            <a 
              href={`/artist/${artist.id}`} 
              className="mt-4 block bg-blue-500 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-600 transition"
            >
              Ver Perfil
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedArtistsSection;
