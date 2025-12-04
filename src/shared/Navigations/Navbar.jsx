import { Menu, Search, ShoppingBag, User, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ProductContext from "../../context/NewProductContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { cartCount, isAuthenticated, user, HandleLogout } = useContext(ProductContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const desktopUserMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);

  // Sync user state from context or localStorage
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else {
      // Fallback to localStorage if context is not yet updated
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, [user, isAuthenticated]);

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
  ];

  const HandleMenuOpen = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const HandleSearchOpen = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    HandleLogout();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop = desktopUserMenuRef.current && !desktopUserMenuRef.current.contains(event.target);
      const isOutsideMobile = mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target);

      // Close if clicking outside both refs
      if (isOutsideDesktop && isOutsideMobile) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

              {/* User Account Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={desktopUserMenuRef}>
                  <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center gap-2 p-2 px-3 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                    title={`${currentUser?.firstname} ${currentUser?.lastname}`}
                  >
                    <User size={20} />
                    <span className="text-sm font-medium hidden xl:inline">
                      {currentUser?.firstname}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {currentUser?.firstname} {currentUser?.lastname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                        {currentUser?.role === "ADMIN" && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          navigate(currentUser?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
                          setIsUserMenuOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </button>

                      {currentUser?.role !== "ADMIN" && (
                        <>
                          <button
                            onClick={() => {
                              navigate("/dashboard?section=profile");
                              setIsUserMenuOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <User size={16} />
                            Profile
                          </button>

                          <button
                            onClick={() => {
                              navigate("/dashboard?section=orders");
                              setIsUserMenuOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <ShoppingBag size={16} />
                            Orders
                          </button>

                          <button
                            onClick={() => {
                              navigate("/dashboard?section=settings");
                              setIsUserMenuOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Settings size={16} />
                            Settings
                          </button>
                        </>
                      )}

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "p-2 border border-white rounded-full bg-white text-black transition-colors"
                      : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                  }
                  to="/login"
                  title="Login"
                >
                  <User size={20} />
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* mobile Header */}
      <div className="lg:hidden bg-primary flex justify-between items-center p-4 px-4 py-6 w-full text-white">
        <div className="Cartsearch flex items-center gap-2">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 border border-white rounded-full bg-white text-black hover:bg-white hover:text-black transition-colors relative"
                : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors relative"
            }
            to={"/cart"}
          >
            <ShoppingBag size={16} />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount || 0}
            </span>
          </NavLink>

          <div className="relative flex items-center">
            <span
              onClick={() => HandleSearchOpen()}
              className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              <Search size={16} />
            </span>

            {isSearchOpen && (
              <input
                type="text"
                placeholder="Search..."
                className="absolute left-12 w-52 sm:w-64 px-4 py-2 rounded-full text-black outline-none focus:ring-2 focus:ring-white z-50"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            )}
          </div>

          {/* Mobile User Icon/Dropdown */}
          {isAuthenticated ? (
            <div className="relative" ref={mobileUserMenuRef}>
              <button
                onClick={handleUserMenuToggle}
                className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              >
                <User size={16} />
              </button>

              {/* Mobile Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {currentUser?.firstname} {currentUser?.lastname}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                    {currentUser?.role === "ADMIN" && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      navigate(currentUser?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
                      setIsUserMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </button>

                  {currentUser?.role !== "ADMIN" && (
                    <>
                      <button
                        onClick={() => {
                          navigate("/dashboard?section=profile");
                          setIsUserMenuOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User size={16} />
                        Profile
                      </button>

                      <button
                        onClick={() => {
                          navigate("/dashboard?section=orders");
                          setIsUserMenuOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <ShoppingBag size={16} />
                        Orders
                      </button>

                      <button
                        onClick={() => {
                          navigate("/dashboard?section=settings");
                          setIsUserMenuOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-200 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "p-2 border border-white rounded-full bg-white text-black transition-colors"
                  : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              }
              to="/login"
            >
              <User size={16} />
            </NavLink>
          )}
        </div>

        <Link to={"/"} className="logo text-xl sm:text-2xl font-bold font-serif italic">
          Granduer
        </Link>

        <span
          onClick={() => HandleMenuOpen()}
          className="flex justify-center items-center lg:hidden cursor-pointer p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <Menu size={20} />
        </span>

        {/* menu */}
        <div
          className={`${
            isMenuOpen
              ? "transition ease-in-out duration-500 block opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
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
                onClick={() => setIsMenuOpen(false)}
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
