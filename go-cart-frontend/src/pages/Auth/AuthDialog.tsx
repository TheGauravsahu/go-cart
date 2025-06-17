import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginPage from "./LoginPage";
import { useState } from "react";

function AuthDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="md:w-[60vw] h-[50vh] md:h-[60vh] overflow-hidden flex items-center justify-center">
        <LoginPage isModal={true} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;
