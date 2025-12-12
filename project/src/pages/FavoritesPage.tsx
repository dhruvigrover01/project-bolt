import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  Users, 
  TrendingUp, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockStrategies } from '../data/mockData';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useStore();
  
  // Get favorite strategies from mock data - filter out any that don't exist
  const favoriteStrategies = favorites
    .map(id => mockStrategies.find(s => s.id === id))
    .filter((s): s is typeof mockStrategies[0] => s !== undefined);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-rose-500" />
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-slate-400">
            {favoriteStrategies.length} {favoriteStrategies.length === 1 ? 'strategy' : 'strategies'} saved
          </p>
        </div>

        {/* Content */}
        {favoriteStrategies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group"
              >
                {/* Strategy Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={strategy.creator_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={strategy.creator_name || 'Creator'}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {strategy.name}
                        </h3>
                        <p className="text-sm text-slate-400">{strategy.creator_name || 'Unknown Creator'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(strategy.id)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-slate-700/50 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {strategy.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white">{strategy.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{strategy.total_subscribers}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-bold">
                        +{strategy.performance?.[1]?.roi_percentage ?? strategy.performance?.[0]?.roi_percentage ?? 0}%
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">${strategy.price_monthly}</span>
                      <span className="text-slate-400 text-sm">/mo</span>
                    </div>
                    <Link
                      to={`/strategy/${strategy.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No favorites yet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Start exploring strategies and add them to your favorites to keep track of the ones you're interested in.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Explore Marketplace
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
