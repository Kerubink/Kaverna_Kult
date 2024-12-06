import React, { useState, useEffect } from "react";
import { useProductModal } from "@/contexts/productModalContext/ProductModalContext";
import { useCart } from "@/contexts/cartContext/cartContext";

const ProductModal: React.FC = () => {
  const { product, closeModal, isOpen } = useProductModal();
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors ? product.colors[0] : undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto'; 
    }

    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Por favor, selecione a cor e o tamanho antes de adicionar ao carrinho.");
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
    setQuantity(prev => Math.max(1, increment ? prev + 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-gray-800 text-white rounded-lg p-6 w-4/5 h-4/5 relative overflow-auto max-h-full">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row items-center space-x-6">
          <img
            src={product.image || ""}
            alt={product.name}
            className="w-full md:w-48 h-48 object-cover rounded-md mb-4 md:mb-0"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            <p className="text-gray-400 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <span className="flex text-yellow-500">
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={index < product.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="w-5 h-5 mr-1"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </span>
              <span className="text-gray-400">({product.rating} / 5)</span>
            </div>

            <p className="text-xl font-semibold text-yellow-500 mb-4">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </p>

            {/* Seleção de cor com radio buttons */}
            <div className="mb-4">
              <label htmlFor="color" className="block text-gray-300 mb-2">Cor</label>
              <div className="flex space-x-4">
                {product.colors?.map((color, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`color-${color}`}
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                      className="text-blue-600"
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seleção de tamanho com radio buttons */}
            <div className="mb-4">
              <label htmlFor="size" className="block text-gray-300 mb-2">Tamanho</label>
              <div className="flex space-x-4">
                {product.sizes?.map((size, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`size-${size}`}
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="text-blue-600"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Controle de quantidade com botões de incremento e decremento */}
            <div className="mb-4 flex items-center space-x-2">
              <label htmlFor="quantity" className="block text-gray-300 mb-2">Quantidade</label>
              <button
                onClick={() => handleQuantityChange(false)}
                className="bg-gray-700 text-white p-2 rounded-md"
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                value={quantity}
                readOnly
                className="w-12 bg-gray-700 text-white text-center p-2 rounded-md"
              />
              <button
                onClick={() => handleQuantityChange(true)}
                className="bg-gray-700 text-white p-2 rounded-md"
              >
                +
              </button>
            </div>

            <p className="text-gray-400 mb-4">
              {product.stock > 0
                ? `Em estoque: ${product.stock} unidades`
                : "Produto fora de estoque"}
            </p>
            <p className="text-gray-400 mb-4">{product.shippingDetails}</p>

            <div className="flex justify-between items-center space-x-4">
              <button
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500"
                onClick={handleAddToCart}
              >
                Adicionar ao Carrinho
              </button>
              <button
                className="w-full md:w-auto bg-gray-600 text-white py-2 rounded-md hover:bg-gray-500"
                onClick={closeModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
        
        {/* Galeria de imagens */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Galeria de Imagens</h3>
          <div className="flex overflow-x-auto space-x-4">
            {product.gallery?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name}-img-${index}`}
                className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-80"
                onClick={() => {
                  // Função para exibir a imagem em tamanho maior
                  console.log("Exibir imagem:", img);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
