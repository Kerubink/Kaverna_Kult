import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "@/database/firebase_config";

const ConfiguracoesPage = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [instagramImages, setInstagramImages] = useState<string[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    image: "",
    isMain: false,
  });
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBannerImages();
    fetchInstagramImages();
    fetchCollections();
  }, []);

  const fetchBannerImages = async () => {
    const configRef = doc(db, "config", "general");
    try {
      const configDoc = await getDoc(configRef);
      if (configDoc.exists()) {
        setBannerImages(configDoc.data().bannerImages || []);
      }
    } catch (error) {
      console.error("Erro ao recuperar imagens de banner:", error);
    }
  };

  const fetchInstagramImages = async () => {
    const configRef = doc(db, "config", "general");
    try {
      const configDoc = await getDoc(configRef);
      if (configDoc.exists()) {
        setInstagramImages(configDoc.data().instagramImages || []);
      }
    } catch (error) {
      console.error("Erro ao recuperar imagens do Instagram:", error);
    }
  };

  const fetchCollections = async () => {
    const collectionsRef = collection(db, "collections");
    try {
      const snapshot = await getDocs(collectionsRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCollections(data);
    } catch (error) {
      console.error("Erro ao recuperar coleções:", error);
    }
  };

  const updateBannerImages = async () => {
    setLoading(true);
    const configRef = doc(db, "config", "general");
    try {
      await updateDoc(configRef, { bannerImages });
      alert("Imagens de banner atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar imagens de banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInstagramImages = async () => {
    setLoading(true);
    const configRef = doc(db, "config", "general");
    try {
      await updateDoc(configRef, { instagramImages });
      alert("Imagens do Instagram atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar imagens do Instagram:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCollection = async () => {
    if (!newCollection.name || !newCollection.image) {
      alert("Por favor, preencha o nome e a imagem da coleção.");
      return;
    }

    setLoading(true);
    try {
      if (editingCollection) {
        const docRef = doc(db, "collections", editingCollection.id);
        await updateDoc(docRef, newCollection);
        alert("Coleção editada com sucesso!");
      } else {
        const collectionsRef = collection(db, "collections");
        await addDoc(collectionsRef, newCollection);
        alert("Coleção criada com sucesso!");
      }
      fetchCollections();
      resetCollectionForm();
    } catch (error) {
      console.error("Erro ao salvar coleção:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetCollectionForm = () => {
    setNewCollection({ name: "", description: "", image: "", isMain: false });
    setEditingCollection(null);
  };

  const editCollection = (collection: any) => {
    setNewCollection(collection);
    setEditingCollection(collection);
  };

  const markAsMainCollection = async (id: string) => {
    try {
      for (const collection of collections) {
        const docRef = doc(db, "collections", collection.id);
        await updateDoc(docRef, { isMain: collection.id === id });
      }
      fetchCollections();
    } catch (error) {
      console.error("Erro ao marcar como coleção principal:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configurações de Marketing</h1>

      {/* Imagens de Banner */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Imagens de Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bannerImages.map((url, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={url}
                alt={`Banner ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const updated = [...bannerImages];
                  updated[index] = e.target.value;
                  setBannerImages(updated);
                }}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          ))}
        </div>
        <button
          onClick={updateBannerImages}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Imagens de Banner"}
        </button>
      </div>

      {/* Imagens do Instagram */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Imagens do Instagram</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {instagramImages.map((url, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={url}
                alt={`Instagram ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const updated = [...instagramImages];
                  updated[index] = e.target.value;
                  setInstagramImages(updated);
                }}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          ))}
        </div>
        <button
          onClick={updateInstagramImages}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Imagens do Instagram"}
        </button>
      </div>

      {/* Coleções */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Coleções</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className={`border p-4 rounded-lg ${
                col.isMain ? "border-green-500" : "border-gray-300"
              }`}
            >
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{col.name}</h3>
              <p className="text-gray-600">{col.description}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => editCollection(col)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => markAsMainCollection(col.id)}
                  className={`px-4 py-2 rounded-lg ${
                    col.isMain
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {col.isMain ? "Principal" : "Marcar como Principal"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulário de Coleções */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingCollection ? "Editar Coleção" : "Nova Coleção"}
        </h2>
        <input
          type="text"
          value={newCollection.name}
          onChange={(e) =>
            setNewCollection({ ...newCollection, name: e.target.value })
          }
          placeholder="Nome da coleção"
          className="p-2 border rounded-lg w-full mb-2"
        />
        <textarea
          value={newCollection.description}
          onChange={(e) =>
            setNewCollection({ ...newCollection, description: e.target.value })
          }
          placeholder="Descrição"
          className="p-2 border rounded-lg w-full mb-2"
        />
        <input
          type="text"
          value={newCollection.image}
          onChange={(e) =>
            setNewCollection({ ...newCollection, image: e.target.value })
          }
          placeholder="URL da imagem"
          className="p-2 border rounded-lg w-full mb-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newCollection.isMain}
            onChange={(e) =>
              setNewCollection({ ...newCollection, isMain: e.target.checked })
            }
          />
          Marcar como principal
        </label>
        <button
          onClick={saveCollection}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Coleção"}
        </button>
        {editingCollection && (
          <button
            onClick={resetCollectionForm}
            className="ml-4 bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
