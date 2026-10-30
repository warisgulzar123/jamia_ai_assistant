import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserSearch from './components/UserSearch';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import AdminLoginModal from './components/AdminLoginModal';
import { Heart, Globe, Shield, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'admin'

  // Public User state (stored in localStorage)
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Admin state (stored in localStorage)
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Load persisted sessions on initial mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('jamia_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedAdminToken = localStorage.getItem('jamia_admin_token');
      if (savedAdminToken) {
        setAdminAuthenticated(true);
      }
    } catch (e) {
      console.warn('Session retrieval error:', e);
    }
  }, []);

  // Public User Auth Handlers
  const handleAuthSuccess = (userData, adminToken) => {
    setCurrentUser(userData);
    localStorage.setItem('jamia_user', JSON.stringify(userData));

    // Restrict Admin Dashboard access: only opens when logged in with admin@gmail.com
    if (userData?.role === 'admin' || userData?.email?.toLowerCase() === 'admin@gmail.com' || adminToken) {
      const token = adminToken || 'jamia_admin_secure_token_' + Date.now();
      setAdminAuthenticated(true);
      localStorage.setItem('jamia_admin_token', token);
      setActiveTab('admin');
    }
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('jamia_user');
    if (adminAuthenticated) {
      setAdminAuthenticated(false);
      localStorage.removeItem('jamia_admin_token');
      setActiveTab('search');
    }
  };

  // Admin Auth Handlers
  const handleAdminAuthSuccess = (adminData) => {
    setAdminAuthenticated(true);
    localStorage.setItem('jamia_admin_token', adminData.token);
    setActiveTab('admin');
  };

  const handleLogoutAdmin = () => {
    setAdminAuthenticated(false);
    localStorage.removeItem('jamia_admin_token');
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">

      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogoutUser={handleLogoutUser}
        adminAuthenticated={adminAuthenticated}
        onOpenAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'search' && <UserSearch />}

        {activeTab === 'admin' && (
          adminAuthenticated ? (
            <AdminDashboard onLogoutAdmin={handleLogoutAdmin} />
          ) : (
            <div className="max-w-md mx-auto py-20 px-4 text-center animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-emerald-900/50 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Admin Dashboard Protected</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Access to this section is strictly restricted. Only users authenticated with <span className="text-emerald-400 font-mono font-semibold">admin@gmail.com</span> and password <span className="text-emerald-400 font-mono font-semibold">admin123</span> can access this dashboard.
              </p>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950 transition active:scale-98"
              >
                Sign In as Administrator (admin@gmail.com)
              </button>
            </div>
          )
        )}
      </main>

   {/* Footer */}
<footer className="bg-slate-950 border-t border-slate-800/80 py-6 px-4 text-xs text-slate-400">
  <div className="max-w-7xl mx-auto flex items-center justify-center">
    <p className="text-slate-500 text-xs text-center">
      &copy; {new Date().getFullYear()} Jamiatul Madina AI Knowledge Portal. All Rights Reserved, Developed by Waris Ali.
    </p>
  </div>
</footer>

      {/* Public User Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onAdminAuthSuccess={handleAdminAuthSuccess}
      />

    </div>
  );
}
