import Footer from "../Navigations/Footer";
import Navbar from "../Navigations/Navbar";
// import ResponsiveNavbar from "../Navigations/RespNavbar"

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
