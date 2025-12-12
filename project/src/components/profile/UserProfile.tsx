import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Award
} from 'lucide-react';
import { demoUser } from '../../store/useStore';
import { mockStrategies } from '../../data/mockData';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<'strategies' | 'achievements' | 'activity'>('strategies');
  const user = demoUser;

  const userStrategies = mockStrategies.slice(0, 3);

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

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600" />
        
        {/* Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-32 h-32 rounded-2xl border-4 border-slate-950 object-cover"
                />
                {user.is_verified_creator && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-950">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                    {user.subscription_tier.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-400 mb-4 max-w-2xl">{user.bio}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  {user.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  {user.website && (
                    <a href={user.website} className="flex items-center gap-1 hover:text-emerald-400">
                      <LinkIcon className="w-4 h-4" />
                      {user.website.replace('https://', '')}
                    </a>
                  )}
                  {user.twitter && (
                    <a href={`https://twitter.com/${user.twitter.replace('@', '')}`} className="flex items-center gap-1 hover:text-emerald-400">
                      <Twitter className="w-4 h-4" />
                      {user.twitter}
                    </a>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pb-4">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <Link
                  to="/settings"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{user.followers_count.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Followers</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{user.following_count}</p>
            <p className="text-sm text-slate-400">Following</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{user.performance_score}</p>
            <p className="text-sm text-slate-400">Performance Score</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{user.strategies_created}</p>
            <p className="text-sm text-slate-400">Strategies Created</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{user.strategies_subscribed}</p>
            <p className="text-sm text-slate-400">Subscribed</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">${user.total_earnings.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Skill Tags */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {user.skill_tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Badges</h3>
          <div className="flex flex-wrap gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative group bg-gradient-to-br ${getRarityColor(badge.rarity)} p-0.5 rounded-xl`}
              >
                <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{badge.name}</p>
                    <p className="text-xs text-slate-400">{badge.description}</p>
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
        <div className="flex items-center gap-2 border-b border-slate-700 mb-6">
          {[
            { id: 'strategies', label: 'Strategies', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'activity', label: 'Activity', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userStrategies.map((strategy) => (
              <Link
                key={strategy.id}
                to={`/strategy/${strategy.id}`}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">{strategy.name}</h4>
                  {strategy.is_verified && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </div>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{strategy.description}</p>
                <div className="flex items-center justify-between">
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

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 ${
                  achievement.completed ? 'border-emerald-500/50' : 'border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                    achievement.completed ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <p className="text-sm text-slate-400">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
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
                  <span className="text-amber-400 text-sm font-medium">
                    +{achievement.reward_points} points
                  </span>
                  {achievement.completed && (
                    <span className="text-emerald-400 text-sm flex items-center gap-1">
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
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="space-y-4">
              {[
                { action: 'Subscribed to', target: 'Momentum Surge Alpha', time: '2 hours ago', icon: TrendingUp },
                { action: 'Earned badge', target: 'Top Performer', time: '1 day ago', icon: Award },
                { action: 'Left a review on', target: 'Crypto Arbitrage Pro', time: '3 days ago', icon: Star },
                { action: 'Created strategy', target: 'Custom Mean Reversion', time: '1 week ago', icon: Target },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <activity.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-300">
                      {activity.action} <span className="text-white font-medium">{activity.target}</span>
                    </p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
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

