import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen ">
        <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
    </div>
  );
}

export default Loader;
