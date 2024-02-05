import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function PasswordResetSuccessPage() {
  const navigate = useNavigate();

  // Clear stack and nav to login screen
  const goToSigninPage = () => {
    navigate("/auth/signin", {
      replace: true,
    });
  };

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
              <p className="text-sm text-gray-600 mb-4 text-center">Your password has been successfully reset. You can now sign in with your new password.</p>
            </div>

            {/* Back to Sign In Button */}
            <div className="flex flex-col align-center justify-center pt-4">
              <Button onClick={goToSigninPage} variant="default" className="w-full">
                Back to Sign In
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>
    </>
  );
}
