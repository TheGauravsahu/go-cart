import { useAuthStore } from "@/store/authStore";
import {
  LogOut,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cartStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="w-full sticky top-0 right-0 left-0 z-50 bg-background border-b">
      <div className="md:px-16 px-4 py-3 flex justify-between items-center w-full">
        <div>
          <Link to="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
              Go<span>Cart.</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden md:block space-x-8">
          <Link to="/" className="text-gray-700 hover:text-pink-600">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-pink-600">
            New Arrivals
          </Link>
          <Link to="/" className="text-gray-700 hover:text-pink-600">
            About Us
          </Link>
       
        </nav>

        <div className="flex items-center">
          {isAuthenticated() ? (
            <UserDropdown />
          ) : (
            <Link to="/login">
              <button className="border px-6 py-1.5 rounded-full cursor-pointer">
                Login
              </button>
            </Link>
          )}
          <CartDropdown />
        </div>
      </div>
    </header>
  );
};

const UserDropdown = () => {
  const { user, clearUser } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="cursor-pointer" size="icon">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="*:cursor-pointer w-52 p-2 px-4">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="py-2">
          <p className="text-sm font-medium">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <Link to="/profile" className="cursor-pointer">
          <DropdownMenuItem>
            <User />
            Go to account
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => clearUser()}>
          <span className="flex items-center gap-2 text-red-600 hover:text-foreground">
            <LogOut className="hover:text-foreground" />
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CartDropdown = () => {
  const {
    clearCart,
    totalItems,
    totalPrice,
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const latestItems = [...items].slice(-5).reverse();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="cursor-pointer">
          <ShoppingCart className="size-5" />
          <span className="rounded-full text-white px-2 bg-pink-500 text-xs">
            {totalItems()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="*:cursor-pointer w-64 p-2 px-4 mr-4">
        <DropdownMenuLabel>My Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="py-2 flex flex-col gap-2">
          {latestItems.length > 0 ? (
            latestItems.map((i) => (
              <div
                key={i.id}
                className="flex w-full p-2 border-b items-center justify-between"
              >
                <div className="w-full  flex items-center gap-2">
                  <div className="w-8 h-8 overflow-hidden bg-secondary">
                    <img
                      className="w-full h-full object-cover"
                      src={i.image}
                      alt={i.id}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">{i.name}</h2>
                    <span className="flex items-center gap-1 my-1">
                      <span className="text-xs">₹{i.price}</span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        x {i.quantity}
                      </span>
                      <span className="flex gap-1">
                        <span onClick={() => increaseQuantity(i.id)}>
                          <Plus size={12} />
                        </span>
                        <span onClick={() => decreaseQuantity(i.id)}>
                          <Minus size={12} />
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => removeFromCart(i.id)}
                  variant="ghost"
                  className="cursor-pointer"
                  size="icon"
                >
                  <X size={12} />
                </Button>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground text-sm px-1">
              Cart is empty.
            </span>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="text-sm flex justify-between px-1 pb-2">
          <span className="font-medium">Total:</span>
          <span>₹{totalPrice()}</span>
        </div>

        <DropdownMenuSeparator />
        <Link to="/cart" className="cursor-pointer">
          <DropdownMenuItem>
            <ShoppingCart className="w-4 h-4" />
            Go to my cart
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => clearCart()}>
          <span className="flex items-center gap-2 text-red-600 hover:text-foreground">
            <Trash2 className="hover:text-foreground" /> Clear Cart
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Header;
