import Header from "./Header";
import Footer from "./Footer";
import type React from "react";
import { Toaster } from "./ui/sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <Header />
      <Toaster position="bottom-center"/>
      <main className="min-h-screen p-2 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
