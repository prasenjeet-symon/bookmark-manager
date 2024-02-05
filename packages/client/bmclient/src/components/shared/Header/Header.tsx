import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // Clear stack and nav to login screen
  function goToSigninPage() {
    navigate("/auth/signin", {
      replace: true,
    });
  }

  // Clear stack and nav to signup screen
  function clearStackAndNavigateToSignup() {
    navigate("/auth/sign-up", {
      replace: true,
    });
  }

  // Clear stack and nav to home page
  function clearStackAndNavigateToHome() {
    navigate("/", {
      replace: true,
    });
  }

  return (
    <>
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        {/* Left: Company Logo */}
        <div onClick={clearStackAndNavigateToHome} className="flex items-center hover:cursor-pointer">
          <img src="https://wiki.videolan.org/images/Firefox-logo.png" alt="Company Logo" className="h-8 mr-2" />
          <span className="text-xl font-bold">Linkify</span>
        </div>

        {/* Right: Signin and Sign up Buttons */}
        <div className="flex items-center">
          <Button onClick={goToSigninPage} variant="link">
            Signin
          </Button>
          <span className="mx-2">|</span>
          <Button onClick={clearStackAndNavigateToSignup} variant="default" className="ml-5">
            Signup
          </Button>
        </div>
      </header>
    </>
  );
}
