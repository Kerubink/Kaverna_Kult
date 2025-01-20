import React, { useState, useEffect } from "react";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";
import { useCart } from "@/contexts/cartContext/cartContext";
import styles from "./ProductModal.module.css";

const ProductModal: React.FC = () => {
  const { product, closeModal, isOpen } = useProductModal();
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string | undefined>(
    product?.image
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert(
        "Por favor, selecione a cor e o tamanho antes de adicionar ao carrinho."
      );
      return;
    }

    const productWithOptions = {
      ...product,
      selectedColor,
      selectedSize,
      quantity,
    };

    addToCart(productWithOptions);
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => Math.max(1, increment ? prev + 1 : prev - 1));
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-auto ${styles.modalConteiner}`}
    >
      <div className={` ${styles.modalContent}`}>
        <div className="absolute top-5 z-50 flex items-center justify-between w-full p-4 text-black ">
          <button
            onClick={closeModal}
            className=" text-2xl text-gray-400 hover:text-black "
          >
            <i className="fi fi-rr-arrow-left"></i>
          </button>

          <div className="ml-auto mr-auto">
            <div className="flex justify-between items-center">
              <div className="flex flex-col justify-between">
                {/* <span className="text-[10px] text-gray-400">
                  {product.collection}
                </span> */}
                <h2 className="text-xl font-extralight">{product.name}</h2>
              </div>
            </div>
          </div>

         
        </div>

        {/* Section de Imagens */}
        <div className={` ${styles.contentImg} relative`}>
          <div
            className={`${styles.inverted_radius} flex-1 rounded-xl bg-cover bg-center flex justify-center items-end relative group overflow-hidden bg-white`}
          >
            {/* Imagem Principal */}
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
            {/* Galeria */}
            <div className="flex flex-col gap-2 overflow-x-auto p-1 bg-white rounded-lg mb-2 shadow-xl absolute bottom-2 right-2">
              {product.gallery?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name}-img-${index}`}
                  className="w-14 h-14 object-cover rounded-md border-2 bg-white cursor-pointer hover:opacity-80"
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 text-white">
            <p className="text-md text-white font-extralight">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </p>{" "}
          </div>
        </div>

        {/* Section de Informações dos Produtos */}
        <div className={`gap-4 overflow-auto ${styles.contentInf}`}>
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Descrição
            </label>
            <p className="text-md text-gray-400">{product.description}</p>
          </div>

          {/* Seleção de Cor, Tamanho e Quantidade */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex  flex-col justify-between">
              <label className="block text-gray-300 mb-2">Cor</label>
              <div className="flex gap-2">
                {product.colors?.map((color, index) => (
                  <button
                    key={index}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-[1px] ${
                      selectedColor === color
                        ? "border-blue-500"
                        : "border-[#ccc]"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col  justify-between">
              <label className="block text-gray-300 mb-2">Tamanho</label>
              <div className="flex gap-2">
                {product.sizes?.map((size, index) => (
                  <label
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                      selectedSize === size
                        ? "bg-slate-700 text-white border-slate-700"
                        : "bg-white text-black border-gray-300"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="hidden"
                    />
                    <span className="font-semibold">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-around p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(false)}
              className="bg-gray-700 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-12 bg-transparent text-white text-center p-2 rounded-md appearance-none"
            />
            <button
              onClick={() => handleQuantityChange(true)}
              className="bg-gray-700 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>

          <button
            className="bg-white text-black font-bold rounded-lg p-2"
            onClick={handleAddToCart}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
