import { Button, LoadingButton } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddAddressValues } from "./AddAddress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { useAddressById, useEditAddress } from "@/hooks/useAddress";
import { useEffect } from "react";
import ErrorOccured from "@/components/ErrorOccured";

const formSchema = z.object({
  house: z.string().min(1, "House is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
});

function EditAddressDialog({ addrId }: { addrId: string }) {
  const { data, isError } = useAddressById(addrId);
  const address = data?.data;

  const { mutate: editAddress, isPending } = useEditAddress(addrId);

  //   console.log(data);

  const form = useForm<AddAddressValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      house: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (address) {
      form.reset({
        city: address.city,
        house: address.house,
        pincode: address.pincode,
        state: address.state,
        street: address.street,
      });
    }
  }, [address, form]);

  function onSubmit(values: AddAddressValues) {
    // console.log("EDITING_VALUES", values);
    editAddress(values);
  }

  if (isError) return <ErrorOccured />;

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="cursor-pointer" variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Edit the details and click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-2">
              {(["house", "street", "city", "state", "pincode"] as const).map(
                (fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {fieldName}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter ${fieldName}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <LoadingButton
                  variant="gradiant"
                  text="Save Changes"
                  type="submit"
                  loadingText="Saving"
                  isLoading={isPending}
                />
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAddressDialog;
