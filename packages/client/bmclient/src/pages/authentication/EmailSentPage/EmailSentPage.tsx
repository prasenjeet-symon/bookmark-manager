import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function EmailSentPage() {
  const navigate = useNavigate();

  // Clear stack and nav to login screen
  function goToSigninPage() {
    navigate("/auth/signin", {
      replace: true,
    });
  }

  return (
    <>
      <Header />
      {/* Email Sent Page */}

      <section className="flex items-center justify-center sm:mt-40 lg:mt-40 xl:mt-40 mt-14">
        <Card className="w-full sm:w-full xl:w-1/3 lg:w/3">
          <CardHeader>
            <div className="flex flex-col items-center justify-center mb-6">
              {/* Envelope Icon */}
              <FontAwesomeIcon icon={faEnvelope} className="text-6xl text-blue-500 mb-2" />

              <h1 className="text-2xl font-bold text-center">Email Sent Successfully</h1>
            </div>

            {/* Message */}
            <div className="flex flex-col align-center justify-center pt-4">
              <p className="text-sm text-gray-600 mb-4 text-center">We've sent you an email with instructions to reset your password. Please check your inbox.</p>
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
