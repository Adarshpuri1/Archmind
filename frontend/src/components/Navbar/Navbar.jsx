import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Cpu, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl"
      style={{ background: 'rgba(15, 15, 26, 0.9)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Cpu size={16} className="text-white" />
          </div>
          <span className="font-display font-700 text-lg text-white">Archi<span className="text-brand-400">Gen</span></span>
        </Link>

        {/* Right side */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                <span className="text-brand-300 text-sm font-semibold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">{user?.name || 'User'}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/10 shadow-xl overflow-hidden"
                style={{ background: '#1e1e35' }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-medium text-slate-200 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-brand-600/25"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
