import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
  Calendar,
  Star,
  Trophy,
  Medal,
  Target,
  TrendingUp,
  Users,
  Settings,
  Share2,
  Edit,
  CheckCircle2,
  Award,
  Camera,
  X,
  Save,
  Loader2,
  Heart,
  Copy
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../store/useStore';
import { mockStrategies } from '../../data/mockData';

export default function UserProfile() {
  const { profile, updateProfile } = useAuth();
  const { favorites } = useStore();
  
  const [activeTab, setActiveTab] = useState<'strategies' | 'achievements' | 'activity' | 'favorites'>('strategies');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    twitter: profile?.twitter || '',
  });

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        twitter: profile.twitter || '',
      });
    }
  }, [profile]);

  // Use profile from auth or fallback to demo
  const user = profile || {
    id: 'demo-1',
    name: 'Demo User',
    email: 'demo@algomart.com',
    avatar_url: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Quantitative trader with 8+ years of experience in algorithmic trading.',
    location: 'New York, USA',
    website: 'https://alexthompson.dev',
    twitter: '@alextrader',
    joined_at: '2023-06-15',
    subscription_tier: 'trader_pro',
    badges: [
      { id: '1', name: 'Early Adopter', description: 'Joined during beta', icon: '🚀', color: '#3B82F6', earned_at: '2023-06-15', rarity: 'rare' as const },
      { id: '2', name: 'Top Performer', description: 'Achieved 100%+ ROI', icon: '🏆', color: '#F59E0B', earned_at: '2024-01-20', rarity: 'epic' as const },
      { id: '3', name: 'Community Leader', description: '100+ helpful reviews', icon: '⭐', color: '#10B981', earned_at: '2024-03-10', rarity: 'legendary' as const },
    ],
    achievements: [
      { id: '1', name: 'First Trade', description: 'Execute your first trade', icon: '📈', progress: 1, max_progress: 1, completed: true, completed_at: '2023-06-16', reward_points: 100 },
      { id: '2', name: 'Strategy Hunter', description: 'Subscribe to 10 strategies', icon: '🎯', progress: 7, max_progress: 10, completed: false, reward_points: 500 },
      { id: '3', name: 'Profit Master', description: 'Earn $10,000 in profits', icon: '💰', progress: 8500, max_progress: 10000, completed: false, reward_points: 1000 },
    ],
    skill_tags: ['Momentum Trading', 'Risk Management', 'Python', 'Machine Learning'],
    performance_score: 87,
    followers_count: 1234,
    following_count: 56,
    total_earnings: 45670,
    strategies_created: 3,
    strategies_subscribed: 7,
    is_verified_creator: true,
    referral_code: 'ALEX2024',
    referral_earnings: 2340,
  };

  const userStrategies = mockStrategies.slice(0, 3);
  const favoriteStrategies = mockStrategies.filter(s => favorites.includes(s.id));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-slate-400 to-slate-500';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-violet-400 to-purple-600';
      case 'legendary':
        return 'from-amber-400 to-orange-600';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referral_code || 'ALEX2024');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.name} on AlgoMart`,
        text: `Check out ${user.name}'s trading strategies on AlgoMart`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600" />
        
        {/* Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-slate-950 object-cover"
                />
                {user.is_verified_creator && (
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-950">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-950 hover:bg-emerald-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pb-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                  <span className="px-2 sm:px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs sm:text-sm font-medium">
                    {(user.subscription_tier || 'free').replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-400 mb-4 max-w-2xl text-sm sm:text-base">{user.bio}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                  {user.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  {user.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-400">
                      <LinkIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{user.website.replace('https://', '')}</span>
                      <span className="sm:hidden">Website</span>
                    </a>
                  )}
                  {user.twitter && (
                    <a href={`https://twitter.com/${user.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-400">
                      <Twitter className="w-4 h-4" />
                      {user.twitter}
                    </a>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.joined_at || '2023-06-15').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 pb-4">
                <button 
                  onClick={shareProfile}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <Link
                  to="/settings"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 sm:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Twitter</label>
                  <input
                    type="text"
                    value={editForm.twitter}
                    onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                    placeholder="@username"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-slate-700">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Followers', value: (user.followers_count || 0).toLocaleString(), color: 'text-white' },
            { label: 'Following', value: user.following_count || 0, color: 'text-white' },
            { label: 'Performance', value: user.performance_score || 0, color: 'text-emerald-400' },
            { label: 'Created', value: user.strategies_created || 0, color: 'text-white' },
            { label: 'Subscribed', value: user.strategies_subscribed || 0, color: 'text-white' },
            { label: 'Earnings', value: `$${(user.total_earnings || 0).toLocaleString()}`, color: 'text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4 text-center">
              <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Code */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Share & Earn</h3>
              <p className="text-sm text-slate-400">Earn 20% commission when friends subscribe using your code</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 rounded-lg font-mono text-emerald-400">
                {user.referral_code || 'ALEX2024'}
              </div>
              <button
                onClick={copyReferralCode}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Tags */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {(user.skill_tags || []).map((tag) => (
              <span
                key={tag}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 text-slate-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Badges</h3>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {(user.badges || []).map((badge) => (
              <div
                key={badge.id}
                className={`relative group bg-gradient-to-br ${getRarityColor(badge.rarity)} p-0.5 rounded-xl`}
              >
                <div className="bg-slate-900 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{badge.icon}</span>
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">{badge.name}</p>
                    <p className="text-xs text-slate-400 hidden sm:block">{badge.description}</p>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-slate-800 rounded-full text-xs font-medium capitalize" style={{ color: badge.color }}>
                  {badge.rarity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-700 mb-6 overflow-x-auto pb-px">
          {[
            { id: 'strategies', label: 'Strategies', icon: TrendingUp },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'activity', label: 'Activity', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'strategies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {userStrategies.map((strategy) => (
              <Link
                key={strategy.id}
                to={`/strategy/${strategy.id}`}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white text-sm sm:text-base">{strategy.name}</h4>
                  {strategy.is_verified && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-4 line-clamp-2">{strategy.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white">{strategy.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{strategy.total_subscribers}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    +{strategy.performance[1]?.roi_percentage}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {favoriteStrategies.length > 0 ? (
              favoriteStrategies.map((strategy) => (
                <Link
                  key={strategy.id}
                  to={`/strategy/${strategy.id}`}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-white text-sm sm:text-base">{strategy.name}</h4>
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mb-4 line-clamp-2">{strategy.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white">{strategy.rating}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">
                      +{strategy.performance[1]?.roi_percentage}%
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Heart className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No favorites yet</h3>
                <p className="text-slate-400 mb-4">Browse strategies and add them to your favorites</p>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Explore Marketplace
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(user.achievements || []).map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 sm:p-6 ${
                  achievement.completed ? 'border-emerald-500/50' : 'border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl ${
                    achievement.completed ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">{achievement.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-400">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">
                      {achievement.progress.toLocaleString()} / {achievement.max_progress.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        achievement.completed ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.max_progress) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-amber-400 text-xs sm:text-sm font-medium">
                    +{achievement.reward_points} points
                  </span>
                  {achievement.completed && (
                    <span className="text-emerald-400 text-xs sm:text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {[
                { action: 'Subscribed to', target: 'Momentum Surge Alpha', time: '2 hours ago', icon: TrendingUp },
                { action: 'Earned badge', target: 'Top Performer', time: '1 day ago', icon: Award },
                { action: 'Left a review on', target: 'Crypto Arbitrage Pro', time: '3 days ago', icon: Star },
                { action: 'Created strategy', target: 'Custom Mean Reversion', time: '1 week ago', icon: Target },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-900/50 rounded-lg">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm sm:text-base">
                      {activity.action} <span className="text-white font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
