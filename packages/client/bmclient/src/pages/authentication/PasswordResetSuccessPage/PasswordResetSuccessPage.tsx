import Header from "@/components/shared/Header/Header";
import { Card, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

export default function PasswordResetSuccessPage() {
  return (
    <>
      <Header />
      {/* Password Reset Success Page */}

      <section className="flex items-center justify-center h-auto mt-40">
        <Card className="w-96">
          <CardHeader>
            <div className="flex flex-col items-center justify-center mb-6">
              {/* Check Circle Icon */}
              <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-green-500 mb-2" />

              <h1 className="text-2xl font-bold text-center">Password Reset Successful</h1>
            </div>

            {/* Message */}
            <div className="flex flex-col align-center justify-center pt-4">
              <p className="text-sm text-gray-600 mb-4 text-center">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>

            {/* Back to Sign In Button */}
            <div className="flex flex-col align-center justify-center pt-4">
              <Button variant="default" className="w-full">
                Back to Sign In
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>
    </>
  );
}
