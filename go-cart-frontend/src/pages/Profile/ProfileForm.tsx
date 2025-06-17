import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/button";
import { useEditProfile, useProfile } from "@/hooks/useAuth";
import ErrorOccured from "@/components/ErrorOccured";
import Loader from "@/components/Loader";

interface ProfileFormProps {
  editable: boolean;
  closeDialog?: () => void;
}

const formSchema = z.object({
  first_name: z.string().min(2, "First name is required").max(30),
  last_name: z.string().min(2, "Last name is required").max(30),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type ProfileFormValues = z.infer<typeof formSchema>;

function ProfileForm({ editable, closeDialog }: ProfileFormProps) {
  const { data: user, isPending, isError } = useProfile();
  const { mutate: editProfile, isPending: isEditingProfile } = useEditProfile(closeDialog);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  function onSubmit(values: ProfileFormValues) {
    // console.log("EDITING_PROFILE", values);
    editProfile(values);
  }

  if (isPending) return <Loader />;
  if (isError) return <ErrorOccured />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-4 mt-4 pb-8 ${editable ? "" : " w-xs md:w-xl"}`}
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  readOnly={!editable}
                  className={
                    editable
                      ? "bg-secondary"
                      : "shadow-none border-none bg-white py-5"
                  }
                  placeholder="Enter your first name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  readOnly={!editable}
                  className={
                    editable
                      ? "bg-secondary"
                      : "shadow-none border-none bg-white py-5"
                  }
                  placeholder="Enter your last name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  readOnly={!editable}
                  className={
                    editable
                      ? "bg-secondary"
                      : "shadow-none border-none bg-white py-5"
                  }
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  readOnly={!editable}
                  className={
                    editable
                      ? "bg-secondary"
                      : "shadow-none border-none bg-white py-5"
                  }
                  placeholder="Enter your phone number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {editable && (
          <LoadingButton
            variant="gradiant"
            text="Save Changes"
            loadingText="Saving Changes"
            isLoading={form.formState.isSubmitting || isEditingProfile}
            type="submit"
          />
        )}
      </form>
    </Form>
  );
}

export default ProfileForm;
