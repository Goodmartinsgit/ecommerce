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
import { ProductProvider } from "./context/ProductContext.jsx";
import Home22 from "./pages/Home22.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import UserLoginPage from "./pages/Auth/UserLoginPage.jsx";
import Cart from "./pages/Cart.jsx";
import BestSellersPage from "./pages/BestSellersPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

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
        element: <UserLoginPage />,
        path: "/userlogin",
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
        element: <Dashboard/>,
        path: "/dashboard",
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <ProductProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ProductProvider>
);
