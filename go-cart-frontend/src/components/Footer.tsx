import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full h-[50vh] p-4 bg-black text-white flex flex-col md:flex-row md:items-center justify-center gap-8">
      <div>
        <h1 className="md:text-[30vh]  text-4xl font-bold leading-tight">
          GoCart
        </h1>
        <p className="text-white/60 my-2 md:ml-8">
          © {new Date().getFullYear()} GoCart. All rights reserved.
        </p>
      </div>
      <div className="md:w-[60%] h-full">
        <h1 className="font-semibold tracking-tight text-xl">
          GoCart - Your Ultimate Shopping Destination. Discover an extensive
          collection of fashion, electronics, and lifestyle products at
          unbeatable prices. Shop with confidence and enjoy seamless delivery
          right to your doorstep.
        </h1>
        <div className="flex items-center my-4">
          <Link to="/signup">
            <button className="border px-6 py-1 cursor-pointer rounded-full">
              Sign up
            </button>
          </Link>
          <Link to="/login">
            <button className="border px-6 py-1 cursor-pointer rounded-full">
              Login
            </button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
