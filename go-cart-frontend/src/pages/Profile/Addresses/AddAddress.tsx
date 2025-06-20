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
import { useAddAddress } from "@/hooks/useAddress";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  house: z.string().min(1, "House is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
});

export type AddAddressValues = z.infer<typeof formSchema>;

function AddAddress() {
  const { mutate: addAddress, isPending } = useAddAddress();

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

  function onSubmit(values: AddAddressValues) {
    addAddress(values);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" variant="gradiant" className="rounded-sm">
          Add Address
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Address</DialogTitle>
          <DialogDescription>
            Enter the details and click save when you&apos;re done.
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

export default AddAddress;
