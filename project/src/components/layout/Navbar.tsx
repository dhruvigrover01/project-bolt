import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Moon, 
  Sun,
  ChevronDown,
  BarChart3,
  Trophy,
  Briefcase,
  Settings,
  LogOut,
  Heart,
  GitCompare,
  LogIn,
  UserPlus,
  Wallet
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { mockNotifications } from '../../data/mockData';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, compareList } = useStore();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const isAuthenticated = !!user;

  const navLinks = [
    { path: '/marketplace', label: 'Marketplace', icon: Briefcase },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, requireAuth: true },
  ];

  const unreadCount = mockNotifications.filter(n => !n.is_read).length;

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    navigate('/');
  };

  // Get display name and avatar
  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`;
  const subscriptionTier = profile?.subscription_tier || 'Free';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">AlgoMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              // Skip auth-required links if not authenticated
              if (link.requireAuth && !isAuthenticated) return null;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    location.pathname === link.path
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className={`hidden lg:flex items-center relative transition-all ${searchFocused ? 'w-80' : 'w-64'}`}>
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search strategies..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Compare Button */}
            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <GitCompare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-xs text-white flex items-center justify-center">
                  {compareList.length}
                </span>
              </Link>
            )}

            {/* Favorites Button - Only show when authenticated */}
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-slate-700">
                        <h3 className="font-semibold text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer ${
                              !notification.is_read ? 'bg-emerald-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full ${
                                !notification.is_read ? 'bg-emerald-500' : 'bg-slate-600'
                              }`} />
                              <div>
                                <p className="text-sm font-medium text-white">{notification.title}</p>
                                <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        to="/notifications"
                        className="block p-3 text-center text-sm text-emerald-400 hover:bg-slate-700/50"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-slate-700">
                        <p className="font-medium text-white">{displayName}</p>
                        <p className="text-sm text-slate-400 capitalize">{subscriptionTier}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/creator-dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                          onClick={() => setProfileOpen(false)}
                        >
                          <BarChart3 className="w-4 h-4" />
                          Creator Dashboard
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <hr className="my-2 border-slate-700" />
                        <button 
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-700 rounded-lg w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Auth Buttons for Non-Authenticated Users */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  state={{ from: location.pathname }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="p-4 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search strategies..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {navLinks.map((link) => {
              if (link.requireAuth && !isAuthenticated) return null;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="pt-4 space-y-2 border-t border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile Sign Out */}
            {isAuthenticated && (
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-slate-800 rounded-lg w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
