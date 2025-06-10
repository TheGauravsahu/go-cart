export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
  created_at: string;
  updated_at: string;
  details: {
    weight: string;
    material: string;
    fabric: string;
    sizes: string[];
    color: string;
    gender: string;
  };
}
