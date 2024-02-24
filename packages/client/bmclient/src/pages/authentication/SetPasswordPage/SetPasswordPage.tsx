import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ErrorManager } from "@/datasource/http/error.manager";
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(50, { message: "Password is too long." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }).max(50, { message: "Password is too long." }),
});

export default function SetNewPasswordPage() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Access query parameters
  const token = new URLSearchParams(location.search).get("token");
  const userId = new URLSearchParams(location.search).get("userId");

  console.log(token, userId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const password = values.password;
    const confirmPassword = values.confirmPassword;

    if (password === confirmPassword) {
      singleCall(new NetworkApi().resetPassword(token || "", userId || "", password)).then(() => {
        navigate("/auth/set-password-success", {
          replace: true,
        });
      });
    } else {
      ErrorManager.getInstance().dispatch("Passwords do not match.");
    }
  }

  return (
    <>
      <Header />
      {/* Set New Password Page */}

      <section className="flex items-center justify-center h-auto sm:mt-40 md:mt-40 lg:mt-40 xl:mt-40 mt-14">
        <Card className="w-full mx-auto sm:w-3/4 lg:w-1/3 xl:w-1/3">
          <CardHeader>
            <div className="flex flex-col items-center justify-center mb-3">
              <h1 className="text-2xl font-bold text-center">Set New Password</h1>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <br />

                {/* Password Confirmation */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Confirm Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Set New Password Button full width */}
                <div className="flex flex-col align-center justify-center pt-4">
                  <Button variant="default" className="w-full">
                    Set New Password
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
