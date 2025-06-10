import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProduct";
import { useParams } from "react-router-dom";
import ErrorOccured from "@/components/ErrorOccured";
import { useCartStore } from "@/store/cartStore";
import ProductDetails from "./ProductDetails";
import Reviews from "./Reviews";

function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isPending, isError } = useProduct(id!);
  const { addToCart } = useCartStore();

  if (isPending) return <Loader />;

  if (isError) return <ErrorOccured />;

  return (
    <div className="w-full h-full p-4 md:px-12">
      <div className="w-full h-full flex flex-col md:flex-row gap-4">
        <div className="md:h-[90vh] md:w-1/2 w-full h-full bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
          <img
            loading="lazy"
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 md:px-8 w-full">
          <div>
            <div className="w-full flex justify-between">
              <div>
                <h1 className="text-3xl">{product.name}</h1>
                <h2 className="my-2 text-xl">₹{product.price}</h2>
              </div>
              <p>⭐ {product.rating} Ratings</p>
            </div>
            <Button
              onClick={() => addToCart(product)}
              variant="gradiant"
              className="w-full my-2 cursor-pointer"
            >
              Add to Cart
            </Button>
          </div>

          <div className="mt-4">
            <ProductDetails product={product} />
          </div>
        </div>
      </div>
      <div className="mt-12 min-h-[20vh] border-t py-4">
        <Reviews productId={id!} />
      </div>
    </div>
  );
}



export default ProductDetailsPage;
