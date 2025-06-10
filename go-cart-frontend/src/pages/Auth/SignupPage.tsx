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
import { useSignup } from "@/hooks/useAuth";

const formSchema = z.object({
  first_name: z.string().min(2, "First name is required").max(30),
  last_name: z.string().min(2, "Last name is required").max(30),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string().min(6, "Password must be alteast of 6 characters"),
});

export type SignupFormValues = z.infer<typeof formSchema>;

function SignupPage() {
  const { mutate: signupUser, isPending } = useSignup();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignupFormValues) {
    signupUser(data);
    form.reset();
  }

  return (
    <div className="w-full flex justify-center items-center px-4 mt-16 md:mt-0 md:px-0">
      <div className="bg-white shadow border w-xl p-8 rounded-lg">
        <h1 className="font-semibold text-3xl text-center">
          Create an <GradiantText size="3xl" text="account" />
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-secondary"
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
                      className="bg-secondary"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-secondary"
                      placeholder="Enter your phone number"
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
              className="w-full"
              variant="gradiant"
              text="Create Account"
              loadingText="Creating Account"
              isLoading={form.formState.isSubmitting || isPending}
              type="submit"
            />

            <span>
              Already have an account ?{" "}
              <Link to="/login" className="text-pink-600 hover:underline">
                Login
              </Link>
            </span>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignupPage;
