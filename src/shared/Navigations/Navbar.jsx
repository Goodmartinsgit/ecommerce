import { Menu, Search, ShoppingBag } from "lucide-react";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ProductContext } from "../../Context/ProductContext";
import { User } from "lucide-react";

const Navbar = () => {
  const { cartCount, isAuthenticated, user } = useContext(ProductContext);
  const navLinks = [
    {
      id: 1,
      name: "About",
      path: "/about",
    },
    {
      id: 2,
      name: "Contact",
      path: "/contact",
    },
    {
      id: 3,
      name: "New Arrival",
      path: "/newArrival",
    },
    {
      id: 4,
      name: "Men",
      path: "/menCloths",
    },
    {
      id: 5,
      name: "Women",
      path: "/womenCloths",
    },
    {
      id: 6,
      name: "Children",
      path: "/childrenCloths",
    },
    // {
    //   id: 7,
    //   name: "Login",
    //   path: "/userlogin",
    // },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const HandleMenuOpen = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const HandleSearchOpen = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <div className="sticky top-0 z-30">
      {/* big screen */}
      <div className="hidden lg:block ">
        <div className=" bg-primary flex justify-between items-center p-4 md:px-28 py-6 w-full text-white">
          <Link to={"/"} className="logo text-3xl font-bold font-serif italic">
            Granduer
          </Link>

          <div className="hidden lg:block">
            <div className=" links flex justify-center items-center pr-20 text-lg font-light">
              {navLinks.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "px-6 py-2 border border-white rounded-full bg-white text-black transition-colors"
                      : " bg-none hover:rounded-full px-6 py-2 text-white hover:bg-white hover:text-black transition-transform ease-in-out"
                  }
                  key={item.id}
                  to={item.path}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="Cartsearch flex items-center gap-4">
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="absolute right-52 w-52 md:w-80 px-4 py-2 rounded-full text-black outline-none"
                  autoFocus
                />
              )}
              <span
                onClick={() => HandleSearchOpen()}
                className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <Search size={20} />
              </span>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 border border-white rounded-full bg-white text-black transition-colors relative"
                    : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors relative"
                }
                to="/cart"
              >
                <ShoppingBag size={20} />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount || 0}
                </span>
              </NavLink>

              {/* User Account Icon */}
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "p-2 border border-white rounded-full bg-white text-black transition-colors"
                    : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                }
                to={isAuthenticated ? "/dashboard" : "/userlogin"}
                title={isAuthenticated ? `${user?.fullName}` : "Login"}
              >
                <User size={20} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* mobile Header */}
      <div className="lg:hidden bg-primary flex justify-between items-center p-4 md:px-28 py-6 w-full text-white">
        <div className="Cartsearch flex items-center gap-2">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 border border-white rounded-full bg-white text-black hover:bg-white hover:text-black transition-colors relative"
                : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors relative"
            }
            to={"/cart"}
          >
            <ShoppingBag size={14} />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount || 0}
            </span>
          </NavLink>

          <div className="relative flex items-center">
            <span
              onClick={() => HandleSearchOpen()}
              className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              <Search size={14} />
            </span>

            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search..."
                className="absolute left-12 w-52 md:w-80 px-4 py-2 rounded-full text-black outline-none focus:ring-2 focus:ring-white"
                autoFocus
              />
            )}
          </div>
        </div>

        <Link to={"/"} className="logo text-2xl font-bold font-serif italic">
          Granduer
        </Link>

        <span
          onClick={() => HandleMenuOpen()}
          className="flex justify-center items-center lg:hidden cursor-pointer"
        >
          <Menu size={25} />
        </span>

        {/* menu */}
        <div
          className={`${
            isMenuOpen
              ? "transition ease-in-out duration-500 block"
              : " opacity-0"
          } absolute left-0 top-[100%] w-full`}
        >
          <div className=" links flex lg:hidden flex-col absolute left-0 bg-white w-full top-[100%] text-lg font-light">
            {navLinks.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "px-6 py-2 border border-white rounded-full bg-black text-white transition-colors"
                    : " bg-none hover:rounded-full px-6 py-2 text-black hover:bg-black hover:text-white transition-transform ease-in-out"
                }
                key={item.id}
                to={item.path}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
