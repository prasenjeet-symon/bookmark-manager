import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EmailSentPage() {
  return (
    <>
      <Header />
      {/* Email Sent Page */}

      <section className="flex items-center justify-center mt-40">
        <Card className="w-96">
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
