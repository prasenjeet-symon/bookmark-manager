import { Navigate, Outlet } from "react-router-dom";

export default function AuthenticationPage() {
  const { isAuthenticated, isLoading } = { isAuthenticated: true, isLoading: false };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col align-center p-7 ml-2  mr-2 bg-card rounded shadow-sm border-2  md:w-1/3">
          <h2 className="text-2xl font-bold mb-10 text-center">Loading...</h2>
        </div>
      </div>
    );
  } else if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Outlet />;
  }
}
