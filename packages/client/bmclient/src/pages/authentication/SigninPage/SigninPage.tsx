import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SigninPage() {
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
              <h1 className="text-2xl font-bold mb-10 text-center">Signin Now </h1>
            </div>
            
            {/* Form Fields Group */}
            <div className="flex flex-col align-center justify-center pt-5">
              <Input type="email" placeholder="Email" />
              <br />
              <Input type="password" placeholder="Password" />
            </div>

            {/* Forgot password Link */}
            <div className="flex flex-row align-center justify-end pt-5 ">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-100">
                Forgot Password?
              </a>
            </div>

            {/* Signin Button full width */}
            <div className="flex flex-row align-center justify-stretch pt-5">
              <Button variant="default" className="w-full">
                Signin
              </Button>
            </div>

            {/* A divider then Google Login Button */}
            <div className="flex items-center justify-center pt-5">
              <hr className="flex-grow border-t border-slate-500 mx-4" />
              <p className="text-sm text-slate-500">or</p>
              <hr className="flex-grow border-t border-slate-500 mx-4" />
            </div>

            {/* Google Login Button */}
            <div className="flex flex-row align-center justify-center pt-3">
              <button type="button" className="bg-transparent text-foreground font-bold py-2 px-4 rounded-full flex items-center justify-center border border-foreground w-full">
                <img alt="Google Logo" src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-5 h-5 mr-2" />
                Signin with Google
              </button>
            </div>

            {/* Sign up Link */}
            <div className="flex flex-row align-center justify-center pt-5">
              <a href="#" className="text-sm text-slate-400 hover:text-slate-100">
                Don't have an account? Signup
              </a>
            </div>
          </CardHeader>
        </Card>
      </section>
    </>
  );
}
