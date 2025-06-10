import { Button } from "@/components/ui/button";
import type { Product } from "../../types/product.types";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  return (
    <div className="h-[400px] md:h-[300px] w-[300px]">
      <div className="relative bg-secondary h-80 rounded-lg overflow-hidden flex items-center">
        <div className="absolute top-2 left-2">
          <Button
            onClick={() => addToCart(product)}
            variant="outline"
            className="cursor-pointer"
          >
            <ShoppingCart /> Add to Cart
          </Button>
        </div>
        <Link to={`/p/${product.id}`}>
          <img
            className="rounded-lg w-full  h-full object-cover"
            src={product.image}
            alt={product.name}
          />
        </Link>
      </div>

      <div className="w-full flex justify-between mt-4">
        <div>
          <Link to={`/p/${product.id}`}>
            <h2>{product.name}</h2>
          </Link>
          <span className="text-xs text-muted-foreground">
            {product.category}
          </span>
        </div>
        <div className="">
          <h3 className="rounded-lg bg-secondary py-2 px-6">
            ₹{product.price}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
