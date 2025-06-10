import React from "react";

function Hero() {
  const images = [
    "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1612215327100-60fc5c4d7938?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
  ];
  return (
    <div className="h-full w-full">
      <div className="md:w-[60%] mx-auto mt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          <span className="font-bold bg-gradient-to-t from-pink-400 to-pink-600 bg-clip-text text-transparent">
            GoCart
          </span>{" "}
          - Everything You Need, All in One Cart
        </h1>
      </div>
      {/* Image list */}
      <div className="md:h-screen w-full flex px-16 gap-4 justify-center">
        {images.map((image, index) => (
          <div key={index} className="w-80 h-96 mx-auto mt-10">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
