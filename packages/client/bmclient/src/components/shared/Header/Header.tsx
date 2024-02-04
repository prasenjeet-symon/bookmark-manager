import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <>
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        {/* Left: Company Logo */}
        <div className="flex items-center">
          <img src="https://wiki.videolan.org/images/Firefox-logo.png" alt="Company Logo" className="h-8 mr-2" />
          <span className="text-xl font-bold">Linkify</span>
        </div>

        {/* Right: Signin and Sign up Buttons */}
        <div className="flex items-center">
          <Button variant="link">Signin</Button>
          <span className="mx-2">|</span>
          <Button variant="default" className="ml-5">
            Signup
          </Button>
        </div>
      </header>
    </>
  );
}
