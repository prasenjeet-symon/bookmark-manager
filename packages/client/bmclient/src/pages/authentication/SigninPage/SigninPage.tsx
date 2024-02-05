import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchemaSignin = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(50, { message: "Password is too long." }),
});

export default function SigninPage() {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      singleCall(new NetworkApi().signinGoogle(token))
    },
  });

  const form = useForm<z.infer<typeof formSchemaSignin>>({
    resolver: zodResolver(formSchemaSignin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchemaSignin>) {
    const email = values.email;
    const password = values.password;

    singleCall(new NetworkApi().signin(email, password)).then(() => {
      navigate("/dashboard");
    });
  }

  // Clear stack and nav to signup screen
  function clearStackAndNavigateToSignup() {
    navigate("/auth/sign-up", {
      replace: true,
    });
  }

  // Nav to forgot password screen
  function navigateToForgotPassword() {
    navigate("/auth/forgot-password", {
      replace: true,
    });
  }

  return (
    <>
      <Header />
      {/* Signin Page */}

      <section>
        <Card className="w-1/3 m-auto mt-10">
          <CardHeader>
            <div className="flex flex-row align-center justify-center">
              {/* left logo and right text */}
              <img className="w-10 h-10 mr-5" src="https://wiki.videolan.org/images/Firefox-logo.png" alt="Logo" />
              <h1 className="text-2xl font-bold mb-5 text-center">Signin Now </h1>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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

                {/* Forget Password */}
                <div className="flex flex-row align-center justify-end pt-4 pb-2">
                  <a onClick={navigateToForgotPassword} className="text-sm text-slate-500 hover:text-slate-300 hover:underline hover:cursor-pointer">
                    Forget Password?
                  </a>
                </div>

                {/* Signin Button full width */}
                <div className="flex flex-row align-center justify-stretch pt-5">
                  <Button type="submit" variant="default" className="w-full">
                    Signin
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

            {/* Google Login Button */}
            <div className="flex flex-row align-center justify-center pt-3">
              <button onClick={() => googleLogin()} type="button" className="bg-transparent text-foreground font-bold py-2 px-4 rounded-full flex items-center justify-center border border-foreground w-full">
                <img alt="Google Logo" src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-5 h-5 mr-2" />
                Signin with Google
              </button>
            </div>

            {/* Sign up Link */}
            <div className="flex flex-row align-center justify-center pt-5">
              <a onClick={clearStackAndNavigateToSignup} className="text-sm text-slate-400 hover:text-slate-100 hover: cursor-pointer hover:underline">
                Don't have an account? Signup
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
