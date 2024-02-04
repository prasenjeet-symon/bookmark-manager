import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import AuthenticationPage from "./pages/authentication/AuthenticationPage/AuthenticationPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage/DashboardPage";
import HomePage from "./pages/dashboard/HomePage/HomePage";
import SigninPage from "./pages/authentication/SigninPage/SigninPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SigninPage />,
  },
  {
    path: "auth",
    element: <AuthenticationPage />,
    children: [],
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
]);
/**
 *
 *
 *
 *
 */
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
}

export default App;
