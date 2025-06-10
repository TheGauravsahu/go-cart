import GradiantText from "@/components/GradiantText";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

function CartPage() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useCartStore();

  return (
    <div className="p-4 md:px-8 h-full w-full pb-16">
      <h1 className="text-3xl font-bold">
        My <GradiantText text="Cart" size="3xl" />
      </h1>

      <div className="flex gap-4 justify-between w-full h-full items-start">
        {items.length > 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 container mt-8">
            {items.map((i) => (
              <div
                key={i.id}
                className="flex  border-b-2 items-center justify-between gap-4 w-full h-56 p-4"
              >
                <div className="h-52 w-64 overflow-hidden p-1 object-cover">
                  <img
                    src={i.image}
                    alt={i.name + "img"}
                    className="w-full h-full"
                  />
                </div>
                <div className="w-full h-full">
                  <div className="flex items-center justify-between w-full">
                    <h1 className="text-xl font-semibold">{i.name}</h1>
                    <Button
                      onClick={() => removeFromCart(i.id)}
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                  <h3 className="text-lg text-muted-foreground">₹{i.price}</h3>
                  <div className="flex w-52 justify-between">
                    <span className="my-2">Quantity</span>
                    <span className="flex gap-1 items-center *:cursor-pointer">
                      <span onClick={() => increaseQuantity(i.id)}>
                        <Plus size={14} />
                      </span>
                      <span className="bg-pink-600 w-8 h-8 text-white flex items-center justify-center">
                        {i.quantity}
                      </span>
                      <span onClick={() => decreaseQuantity(i.id)}>
                        <Minus size={14} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-muted-foreground py-4 px-2">
            No items in the cart.
          </h1>
        )}

        <div className="bg-secondary  w-md p-4 px-2 flex flex-col justify-between">
          <div className="w-full gap-2 flex flex-col  px-2 justify-center border-b-2 pb-4">
            {items.length > 0 ? (
              items.map((i) => (
                <h3
                  key={i.id}
                  className="text-muted-foreground text-lg font-semibold flex gap-4 items-center justify-between"
                >
                  {i.name} <span>₹{i.price}</span>
                </h3>
              ))
            ) : (
              <h1 className="text-muted-foreground items-start">Empty cart.</h1>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-lg px-2 py-2 w-full flex items-center justify-between">
              Total <span>₹{totalPrice()}</span>
            </h3>

            {items.length > 0 && (
              <Link to="/checkout">
                <Button className="w-full cursor-pointer">Proceed to Checkout</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
