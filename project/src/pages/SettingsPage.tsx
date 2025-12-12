import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Moon,
  Sun,
  Globe,
  Mail,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Check,
  ChevronRight,
  LogOut,
  Trash2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { theme, toggleTheme } = useStore();
  const { profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    twitter: profile?.twitter || '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_new_strategies: true,
    email_reviews: true,
    email_performance: false,
    email_newsletter: true,
    push_new_strategies: true,
    push_reviews: true,
    push_performance: true,
    push_account: true,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(profileForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-slate-400">Manage your account preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-2 lg:sticky lg:top-24">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeSection === section.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}

              {/* Sign Out Button */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <img
                      src={profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                      alt="Profile"
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                        Change Photo
                      </button>
                      <p className="text-sm text-slate-400 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Twitter</label>
                      <input
                        type="text"
                        value={profileForm.twitter}
                        onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                        placeholder="@username"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : saved ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                
                {/* Email Notifications */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: 'email_new_strategies', label: 'New strategies available', description: 'Get notified when new strategies match your preferences' },
                      { key: 'email_reviews', label: 'Reviews and comments', description: 'Receive emails when someone interacts with your content' },
                      { key: 'email_performance', label: 'Performance updates', description: 'Weekly summary of your strategy performance' },
                      { key: 'email_newsletter', label: 'Newsletter', description: 'Trading tips, market insights, and platform updates' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: 'push_new_strategies', label: 'New strategies', description: 'Instant alerts for new strategies' },
                      { key: 'push_reviews', label: 'Reviews', description: 'Get notified about new reviews' },
                      { key: 'push_performance', label: 'Performance alerts', description: 'Real-time performance notifications' },
                      { key: 'push_account', label: 'Account activity', description: 'Security and account updates' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-6">Appearance</h2>
                
                {/* Theme */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center">
                          <Moon className="w-8 h-8 text-slate-300" />
                        </div>
                      </div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-sm text-slate-400">Easy on the eyes</p>
                    </button>
                    <button
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                          <Sun className="w-8 h-8 text-amber-500" />
                        </div>
                      </div>
                      <p className="text-white font-medium">Light Mode</p>
                      <p className="text-sm text-slate-400">Classic look</p>
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Language</h3>
                  <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <select className="flex-1 bg-transparent text-white focus:outline-none">
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Change Password */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={securityForm.currentPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Key className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityForm.twoFactorEnabled}
                        onChange={(e) => setSecurityForm({ ...securityForm, twoFactorEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                      <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-4 py-2 bg-rose-500/20 text-rose-400 font-medium rounded-lg hover:bg-rose-500/30 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Current Plan */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Current Plan</h2>
                  
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div>
                      <p className="text-emerald-400 font-semibold text-lg">
                        {(profile?.subscription_tier || 'free').replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {profile?.subscription_tier === 'free' 
                          ? 'Limited features' 
                          : 'Full access to all features'
                        }
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                      {profile?.subscription_tier === 'free' ? 'Upgrade' : 'Manage Plan'}
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="text-white font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-slate-400">Expires 12/2025</p>
                      </div>
                    </div>
                    <button className="text-emerald-400 hover:text-emerald-300 font-medium">
                      Update
                    </button>
                  </div>

                  <button className="mt-4 text-sm text-slate-400 hover:text-white">
                    + Add another payment method
                  </button>
                </div>

                {/* Billing History */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Billing History</h2>
                  
                  <div className="space-y-3">
                    {[
                      { date: 'Dec 1, 2024', amount: '$99.00', status: 'Paid', invoice: '#INV-001' },
                      { date: 'Nov 1, 2024', amount: '$99.00', status: 'Paid', invoice: '#INV-002' },
                      { date: 'Oct 1, 2024', amount: '$99.00', status: 'Paid', invoice: '#INV-003' },
                    ].map((item) => (
                      <div key={item.invoice} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.date}</p>
                          <p className="text-sm text-slate-400">{item.invoice}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{item.amount}</p>
                          <p className="text-sm text-emerald-400">{item.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
