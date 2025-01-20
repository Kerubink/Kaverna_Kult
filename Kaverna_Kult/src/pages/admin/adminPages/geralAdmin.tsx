// src/pages/Admin/Configuracoes.tsx
import React, { useState } from "react";
import { db } from "@/database/firebase_config"; // Configuração do Firebase
import { updateDoc, doc } from "firebase/firestore";

const ConfiguracoesPage = () => {
  const [bannerUrl, setBannerUrl] = useState("");
  const [carouselImages, setCarouselImages] = useState([]);
  const [couponCode, setCouponCode] = useState("");

  const handleUpdateBanner = async () => {
    const configRef = doc(db, "config", "general");
    try {
      await updateDoc(configRef, { bannerUrl });
      alert("Banner atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o banner:", error);
      alert("Erro ao atualizar o banner");
    }
  };

  const handleUpdateCarousel = async () => {
    const configRef = doc(db, "config", "general");
    try {
      await updateDoc(configRef, { carouselImages });
      alert("Imagens do carrossel atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar as imagens do carrossel:", error);
      alert("Erro ao atualizar as imagens do carrossel");
    }
  };

  const handleAddCoupon = async () => {
    const configRef = doc(db, "config", "general");
    try {
      await updateDoc(configRef, { couponCode });
      alert("Cupom adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar cupom:", error);
      alert("Erro ao adicionar cupom");
    }
  };

  return (
    <div>
      <h1>Configurações Gerais</h1>

      <div>
        <h2>Banner de Promoção</h2>
        <input
          type="text"
          placeholder="URL do Banner"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
        />
        <button onClick={handleUpdateBanner}>Atualizar Banner</button>
      </div>

      <div>
        <h2>Imagens do Carrossel</h2>
        <input
          type="text"
          placeholder="URLs das Imagens"
          value={carouselImages.join(", ")}
          onChange={(e) => setCarouselImages(e.target.value.split(", "))}
        />
        <button onClick={handleUpdateCarousel}>Atualizar Carrossel</button>
      </div>

      <div>
        <h2>Cupons</h2>
        <input
          type="text"
          placeholder="Código do Cupom"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button onClick={handleAddCoupon}>Adicionar Cupom</button>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
