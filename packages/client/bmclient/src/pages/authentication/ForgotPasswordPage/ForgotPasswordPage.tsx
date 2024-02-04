import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      {/* Forgot Password Page */}

      <section className="flex items-center justify-center mt-40">
        <Card className="w-96">
          <CardHeader>
            <div className="flex flex-col items-center justify-center mb-6">
              {/* left logo and right text */}
              <img className="w-16 h-16 mb-2" src="https://wiki.videolan.org/images/Firefox-logo.png" alt="Logo" />
              <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
            </div>

            {/* Form Fields Group */}
            <div className="flex flex-col align-center justify-center pt-4">
              <p className="text-sm text-gray-600 mb-2 text-center">
                Enter your email address to reset your password.
              </p>
              <Input type="email" placeholder="Email" className="mb-4" />
            </div>

            {/* Reset Password Button full width */}
            <div className="flex flex-col align-center justify-center pt-4">
              <Button variant="default" className="w-full">
                Reset Password
              </Button>
            </div>

            {/* Sign in Link */}
            <div className="flex flex-row align-center justify-center pt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <a href="#" className="text-blue-500 hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </CardHeader>
        </Card>
      </section>
    </>
  );
}
