import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import SocialFeedPage from './pages/SocialFeedPage';
import ResourcesPage from './pages/ResourcesPage';
import BookingPage from './pages/BookingPage';
import AuthPage from './pages/AuthPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import ClosingPage from './pages/dashboard/ClosingPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import AdminPage from './pages/dashboard/AdminPage';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isPricingPage = location.pathname === '/pricing';
  const isSocialPage = location.pathname === '/social';
  const isResourcesPage = location.pathname === '/resources';
  const isBookingPage = location.pathname === '/booking';
  const isDashboardPage = location.pathname.startsWith('/dashboard') ||
                          location.pathname === '/orders' ||
                          location.pathname === '/closing' ||
                          location.pathname === '/analytics' ||
                          location.pathname === '/admin';

  return (
    <div className="min-h-screen">
      {!isAuthPage && !isPricingPage && !isSocialPage && !isResourcesPage && !isDashboardPage && !isBookingPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/closing" element={<ClosingPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/social" element={<SocialFeedPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      {!isAuthPage && !isPricingPage && !isSocialPage && !isResourcesPage && !isDashboardPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;