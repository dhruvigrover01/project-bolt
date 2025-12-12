import { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2,
  Camera,
  Send
} from 'lucide-react';
import { Review } from '../../types';

interface ReviewsSectionProps {
  strategyId: string;
  reviews: Review[];
}

export default function ReviewsSection({ strategyId, reviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
  });

  const filteredReviews = reviews
    .filter(r => !filterRating || r.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        case 'rating':
          return b.rating - a.rating;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0,
  }));

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <p className="text-5xl font-bold text-white mb-2">{avgRating.toFixed(1)}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= avgRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-400">{reviews.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`flex items-center gap-3 w-full py-1.5 hover:bg-slate-700/30 rounded transition-colors ${
                  filterRating === rating ? 'bg-slate-700/30' : ''
                }`}
              >
                <span className="text-sm text-slate-400 w-8">{rating}★</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400 w-12 text-right">{count}</span>
              </button>
            ))}
          </div>

          {/* Write Review Button */}
          <div>
            <button
              onClick={() => setShowWriteReview(!showWriteReview)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Write Your Review</h3>
          
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Review Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Review</label>
            <textarea
              value={newReview.content}
              onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your experience with this strategy..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">Pros</label>
              {newReview.pros.map((pro, i) => (
                <input
                  key={i}
                  type="text"
                  value={pro}
                  onChange={(e) => {
                    const newPros = [...newReview.pros];
                    newPros[i] = e.target.value;
                    if (i === newPros.length - 1 && e.target.value) {
                      newPros.push('');
                    }
                    setNewReview(prev => ({ ...prev, pros: newPros }));
                  }}
                  placeholder="Add a pro..."
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-2"
                />
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-400 mb-2">Cons</label>
              {newReview.cons.map((con, i) => (
                <input
                  key={i}
                  type="text"
                  value={con}
                  onChange={(e) => {
                    const newCons = [...newReview.cons];
                    newCons[i] = e.target.value;
                    if (i === newCons.length - 1 && e.target.value) {
                      newCons.push('');
                    }
                    setNewReview(prev => ({ ...prev, cons: newCons }));
                  }}
                  placeholder="Add a con..."
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-2"
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Camera className="w-5 h-5" />
              Add Screenshots
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowWriteReview(false)}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors">
              <Send className="w-5 h-5" />
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Sort & Filter */}
      <div className="flex items-center justify-between">
        <p className="text-slate-400">
          Showing <span className="text-white font-medium">{filteredReviews.length}</span> reviews
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={review.user_avatar}
                  alt={review.user_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{review.user_name}</span>
                    {review.is_verified_purchase && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <h4 className="text-lg font-semibold text-white mb-2">{review.title}</h4>
            <p className="text-slate-300 mb-4">{review.content}</p>

            {/* Pros & Cons */}
            {(review.pros.length > 0 || review.cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {review.pros.length > 0 && (
                  <div className="bg-emerald-500/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-emerald-400 mb-2">Pros</p>
                    <ul className="space-y-1">
                      {review.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-400">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons.length > 0 && (
                  <div className="bg-rose-500/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-rose-400 mb-2">Cons</p>
                    <ul className="space-y-1">
                      {review.cons.map((con, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-rose-400">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Creator Response */}
            {review.creator_response && (
              <div className="bg-slate-900/50 rounded-lg p-4 mt-4 border-l-2 border-emerald-500">
                <p className="text-sm font-medium text-emerald-400 mb-2">Creator Response</p>
                <p className="text-sm text-slate-300">{review.creator_response.content}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Helpful ({review.helpful_count})</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
}

