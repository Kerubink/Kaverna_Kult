export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  colors: string[];
  sizes: string[];
  image: string;
  selectedColor: string;
  selectedSize: string;
  gallery: string[];
  rating: number;
  stock: number;
  quantity: number;
  shippingDetails: string;
  isSelected: boolean; 

  }
  