import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Please enter your full name." }).max(50, { message: "Full name is too long." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(50, { message: "Password is too long." }),
});

export default function SignUpPage() {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <Header />
      {/* SignUp Page */}

      <section>
        <Card className="w-1/3 m-auto mt-10">
          <CardHeader>
            <div className="flex flex-row align-center justify-center">
              {/* left logo and right text */}
              <img className="w-10 h-10 mr-5" src="https://wiki.videolan.org/images/Firefox-logo.png" alt="Logo" />
              <h1 className="text-2xl font-bold mb-5 text-center">Sign Up Now</h1>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <br />
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <br />
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SignUp Button full width */}
                <div className="flex flex-row align-center justify-stretch pt-5">
                  <Button type="submit" variant="default" className="w-full">
                    Sign Up
                  </Button>
                </div>
              </form>
            </Form>

            {/* A divider then Google Login Button */}
            <div className="flex items-center justify-center pt-5">
              <hr className="flex-grow border-t border-slate-500 mx-4" />
              <p className="text-sm text-slate-500">or</p>
              <hr className="flex-grow border-t border-slate-500 mx-4" />
            </div>

            {/* Google SignUp Button */}
            <div className="flex flex-row align-center justify-center pt-3">
              <button type="button" className="bg-transparent text-foreground font-bold py-2 px-4 rounded-full flex items-center justify-center border border-foreground w-full">
                <img alt="Google Logo" src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-5 h-5 mr-2" />
                Sign Up with Google
              </button>
            </div>

            {/* Sign in Link */}
            <div className="flex flex-row align-center justify-center pt-5">
              <a href="#" className="text-sm text-slate-400 hover:text-slate-100">
                Already have an account? Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
