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
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 text-2xl text-gray-400 hover:text-white z-50"
        >
          <i className="fi fi-rr-arrow-left"></i>
        </button>

        {/* Section de Imagens */}
        <div className={` ${styles.contentImg}`}>
          <div className="flex-1 rounded-xl bg-cover bg-center flex justify-center items-end relative group overflow-hidden bg-white">
            {/* Imagem Principal */}
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
            {/* Galeria */}
            <div className="flex gap-2 overflow-x-auto p-1 bg-white rounded-lg mb-7 shadow-xl absolute bottom-2">
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
        </div>

        {/* Section de Informações dos Produtos */}
        <div className={`gap-4 ${styles.contentInf}`}>
          <div>
            <div className="flex justify-between items-end text-white">
              <div>
                <span className="text-[10px] text-gray-400">
                  {product.collection}
                </span>
                <h2 className="text-xl font-bold">{product.name}</h2>
              </div>
              <p className="text-xl font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </p>
            </div>
          </div>

          {/* Seleção de Cor, Tamanho e Quantidade */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
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

            <div className="flex items-center justify-between">
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

            <div className="flex items-center justify-between">
              <label className="block text-gray-300 mb-2">Quantidade</label>
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
            </div>
          </div>

          <p className="text-sm text-gray-400">{product.description}</p>

        </div>

        <button
          className="bg-white text-black font-bold rounded-lg p-4 py-2 fixed bottom-4 left-1/2 -translate-x-1/2 w-3/4"
          onClick={handleAddToCart}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
