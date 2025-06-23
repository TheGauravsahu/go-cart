import GradiantText from "@/components/GradiantText";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be alteast of 6 characters"),
});

export type LoginFormValues = z.infer<typeof formSchema>;

function LoginPage({
  isModal,
  closeDialog,
}: {
  isModal: boolean;
  closeDialog?: () => void;
}) {
  const { mutate: loginUser, isPending } = useLogin(isModal, closeDialog);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    loginUser(data);
  }

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <div
        className={`w-xl mx-auto p-8 rounded-lg ${
          isModal ? "" : "shadow border mt-16"
        }`}
      >
        <h1 className="font-semibold text-3xl text-center w-full">
          Login to your <GradiantText size="3xl" text="account" />
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-secondary"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-secondary"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              className="w-full"
              variant="gradiant"
              text="Login"
              loadingText="Logging in"
              isLoading={form.formState.isSubmitting || isPending}
            />

            <span>
              Don&apos;t have an account ?{" "}
              <Link to="/signup" className="text-pink-600 hover:underline">
                Signup
              </Link>
            </span>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
