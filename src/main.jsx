import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NewArrival from "./pages/NewArrival.jsx";
import MensCloth from "./pages/MensCloth.jsx";
import WomensCloth from "./pages/WomensCloth.jsx";
import Children from "./pages/Children.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import UserLoginPage from "./pages/Auth/UserLoginPage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import BestSellersPage from "./pages/BestSellersPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ProductProvider } from "./context/NewProductContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import VerifyPayment from "./pages/VerrifyPayment.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <About />,
        path: "/about",
      },
      {
        element: <Contact />,
        path: "/contact",
      },
      {
        element: <NewArrival />,
        path: "/newArrival",
      },
      {
        element: <MensCloth />,
        path: "/menCloths",
      },
      {
        element: <WomensCloth />,
        path: "/womenCloths",
      },
      {
        element: <Children />,
        path: "/childrenCloths",
      },
      {
        element: <Cart />,
        path: "/cart",
      },
      {
        element: <Checkout />,
        path: "/checkout",
      },
      {
        element: <UserLoginPage />,
        path: "/userlogin",
      },
      {
        element: <UserLoginPage />,
        path: "/login",
      },
      {
        element: <ResetPasswordPage />,
        path: "/reset-password",
      },
      {
        element: <SingleProduct />,
        path: "/product/:id",
      },
      {
        element: <BestSellersPage />,
        path: "/bestSellers",
      },
      {
        element: <VerifyPayment/>,
        path: "/verify-payment",
      },
      {
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        path: "/dashboard",
      },
      {
        element: (
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        ),
        path: "/admin/dashboard",
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </ErrorBoundary>
  </StrictMode>
);
