import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Logo from '../../../assets/LinKet.png';

const schema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    const email = values.email;
    singleCall(new NetworkApi().forgotPassword(email)).then(() => {
      navigate("/auth/forgot-password-sent");
    });
  }

  // Clear stack and nav to login screen
  function goToSigninPage() {
    navigate("/auth/signin", {
      replace: true,
    });
  }

  return (
    <>
      <Header />
      {/* Forgot Password Page */}

      <section className="flex items-center justify-center mt-14 sm:mt-40 lg:mt-40 xl:mt-40">
        <Card className="w-full sm:w-full xl:w-1/3 lg:w/3">
          <CardHeader>
            <div className="flex flex-col items-center justify-center mb-2">
              {/* left logo and right text */}
              <img className="w-16 h-16 mb-2 rounded-2xl" src={Logo} alt={import.meta.env.VITE_APP_NAME} />
              <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
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
                      <p className="text-sm text-gray-400 text-center mb-5"> Enter your email address to reset your password.</p>

                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reset Password Button full width */}
                <div className="flex flex-col align-center justify-center pt-4">
                  <Button type="submit" variant="default" className="w-full">
                    Reset Password
                  </Button>
                </div>
              </form>
            </Form>

            {/* Sign in Link */}
            <div className="flex flex-row align-center justify-center pt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <a onClick={goToSigninPage} className="text-blue-500 hover:underline hover:cursor-pointer">
                  Sign in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
