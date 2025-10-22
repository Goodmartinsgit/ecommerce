import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';

export default function ResponsiveNavbar() {

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
    {
      id: 7,
      name: "Home22",
      path: "/home22",
    },
  ];

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const HandleSearchOpen = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-primary text-white w-full">
      {/* Desktop & Mobile Header */}
      <div className="flex justify-between items-center p-4 md:px-8 lg:px-28 py-6">
        {/* Logo */}
        <Link to="/" className="logo text-2xl md:text-3xl font-bold font-serif italic z-50">
          Granduer
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4">
          {navLinks.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "px-4 xl:px-6 py-2 border border-white rounded-full bg-white text-black transition-colors text-sm xl:text-base"
                  : "px-4 xl:px-6 py-2 text-white hover:bg-white hover:text-black hover:rounded-full transition-all ease-in-out text-sm xl:text-base"
              }
              key={item.id}
              to={item.path}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Search & Cart */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 relative">
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search..."
              className="absolute right-20 xl:right-24 w-52 xl:w-80 px-4 py-2 rounded-full text-black outline-none"
              autoFocus
            />
          )}
          <button
            onClick={HandleSearchOpen}
            className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
          >
            <Search size={20} />
          </button>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 border border-white rounded-full bg-white text-black transition-colors"
                : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
            }
            to="/cart"
          >
            <ShoppingBag size={20} />
          </NavLink>
        </div>

        {/* Mobile Menu Button & Icons */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Mobile Search */}
          <button
            onClick={HandleSearchOpen}
            className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
          >
            <Search size={18} />
          </button>
          
          {/* Mobile Cart */}
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "p-2 border border-white rounded-full bg-white text-black transition-colors"
                : "p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
            }
            to="/cart"
          >
            <ShoppingBag size={18} />
          </NavLink>

          {/* Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors z-50"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 pb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-full text-black outline-none"
            autoFocus
          />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-primary z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
          {navLinks.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "px-8 py-3 border border-white rounded-full bg-white text-black text-lg transition-colors"
                  : "px-8 py-3 text-white hover:bg-white hover:text-black hover:rounded-full hover:border hover:border-white text-lg transition-all"
              }
              key={item.id}
              to={item.path}
              onClick={toggleMobileMenu}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}