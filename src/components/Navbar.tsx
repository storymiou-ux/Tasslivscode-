import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package, Sparkles, ChevronDown } from 'lucide-react';

interface DropdownItem {
  title: string;
  description: string;
  path: string;
}

interface NavItem {
  name: string;
  path?: string;
  dropdown?: DropdownItem[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    {
      name: 'Accueil',
      path: '/',
    },
    {
      name: 'Tarifs',
      path: '/pricing',
    },
    {
      name: 'Ressources',
      path: '/resources',
    },
  ];

  const isActive = (path?: string) => path && location.pathname === path;

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className={`${location.pathname === '/' ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-50`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center space-x-8">
            {location.pathname === '/' ? (
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Tassli
                </span>
              </div>
            ) : (
              <Link to="/" className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Tassli
                </span>
              </Link>
            )}

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="group flex items-center space-x-1 px-4 py-2.5 text-[15px] font-medium text-white hover:text-white/80 transition-all duration-150"
                    >
                      <span className="relative">
                        {item.name}
                        <span
                          className={`absolute -bottom-[17px] left-0 right-0 h-[2px] bg-white transition-transform duration-200 origin-left ${
                            isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </span>
                      {item.dropdown && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      className="group flex items-center space-x-1 px-4 py-2.5 text-[15px] font-medium text-white hover:text-white/80 transition-all duration-150"
                    >
                      <span className="relative">
                        {item.name}
                        <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-white transition-transform duration-200 origin-left scale-x-0 group-hover:scale-x-100" />
                      </span>
                      {item.dropdown && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                  )}

                  {item.dropdown && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-2 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
                        {item.dropdown.map((dropdownItem, index) => (
                          <Link
                            key={index}
                            to={dropdownItem.path}
                            className="block px-4 py-3 rounded-md hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="text-sm font-semibold text-gray-900 mb-0.5">
                              {dropdownItem.title}
                            </div>
                            <div className="text-xs text-gray-600">
                              {dropdownItem.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/auth?mode=login"
              className="text-[15px] font-medium text-white hover:text-white/80 transition-colors duration-150"
            >
              Se connecter
            </Link>
            <Link
              to="/auth?mode=signup"
              className="px-4 py-2 text-white text-[15px] font-medium rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-150"
            >
              S'inscrire
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-white/80 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden fixed inset-0 top-[72px] bg-white z-40">
            <div className="px-6 py-8 space-y-2">
              {navItems.map((item) => (
                item.path ? (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-4 text-lg font-semibold rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    className="w-full text-left px-4 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    {item.name}
                  </button>
                )
              ))}
              <div className="pt-6 space-y-3">
                <Link
                  to="/auth?mode=login"
                  className="block w-full text-center text-gray-700 border-2 border-gray-200 hover:border-gray-300 px-6 py-3.5 rounded-xl font-semibold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Se connecter
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
