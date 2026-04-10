import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Phone, BarChart3, LogOut, User, Plus, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';
import { getOrders } from '../lib/orders';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(0);

  useEffect(() => {
    if (user) {
      loadOrderCount();
    }
  }, [user]);

  const loadOrderCount = async () => {
    if (!user) return;
    try {
      const orders = await getOrders(user.id);
      const deliveredCount = orders.filter(order => order.status === 'delivered').length;
      setOrderCount(deliveredCount);
    } catch (error) {
      console.error('Error loading order count:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      route: '/dashboard'
    },
    {
      name: 'Commandes',
      icon: Package,
      route: '/orders'
    },
    {
      name: 'Service de closing',
      icon: Phone,
      route: '/closing'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      route: '/analytics'
    },
    ...(isAdmin ? [{
      name: 'Administration',
      icon: Shield,
      route: '/admin'
    }] : [])
  ];

  const isActive = (route: string) => location.pathname === route;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#246BFD] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {(profile?.full_name || profile?.business_name || user?.email || 'T').charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {profile?.business_name || profile?.full_name || user?.email?.split('@')[0] || 'TASSLI'}
            </span>
          </div>
          {isMobile && (
            <button
              onClick={closeMobileMenu}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <Link
              key={item.route}
              to={item.route}
              onClick={isMobile ? closeMobileMenu : undefined}
              className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                active
                  ? 'bg-[#e0ebff] text-[#246BFD]'
                  : 'text-[#44546F] hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.name === 'Commandes' && orderCount > 0 && (
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  active ? 'bg-[#246BFD] text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {orderCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3 bg-white rounded-lg mb-2">
          <div className="w-8 h-8 bg-[#246BFD] rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            handleSignOut();
            if (isMobile) closeMobileMenu();
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-[#F8FAFB] border-r border-gray-200 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMobileMenu}>
          <div className="w-64 h-full bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Page Title */}
              <div className="lg:ml-0">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {menuItems.find(item => isActive(item.route))?.name || 'Dashboard'}
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 hidden lg:block">Gérez votre activité en temps réel</p>
              </div>
            </div>

            {/* New Order Button */}
            <button
              onClick={() => navigate('/booking')}
              className="bg-[#246BFD] text-white px-3 lg:px-6 py-2 lg:py-2.5 rounded-lg font-medium hover:bg-[#1557e0] transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline">Nouvelle commande</span>
              <span className="lg:hidden text-sm">Nouveau</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Assistance Button */}
      <button
        onClick={() => window.open('https://wa.me/221762883202', '_blank')}
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
        aria-label="Assistance WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Besoin d'aide ?
        </span>
      </button>
    </div>
  );
};

export default DashboardLayout;
