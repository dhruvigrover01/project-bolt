import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AdvancedSearch from './components/marketplace/AdvancedSearch';
import StrategyDetail from './components/strategy/StrategyDetail';
import Leaderboard from './components/leaderboard/Leaderboard';
import StrategyComparison from './components/compare/StrategyComparison';
import UserProfile from './components/profile/UserProfile';
import SubscriptionPlans from './components/subscription/SubscriptionPlans';
import CreatorDashboard from './components/creator/CreatorDashboard';
import RiskSimulator from './components/simulator/RiskSimulator';
import BacktestUpload from './components/upload/BacktestUpload';
import NotificationCenter from './components/notifications/NotificationCenter';
import AffiliateCenter from './components/affiliate/AffiliateCenter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="marketplace" element={<AdvancedSearch />} />
          <Route path="strategy/:id" element={<StrategyDetail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="compare" element={<StrategyComparison />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="pricing" element={<SubscriptionPlans />} />
          <Route path="creator-dashboard" element={<CreatorDashboard />} />
          <Route path="simulator" element={<RiskSimulator />} />
          <Route path="upload" element={<BacktestUpload />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="affiliate" element={<AffiliateCenter />} />
          <Route path="dashboard" element={<CreatorDashboard />} />
          <Route path="favorites" element={<AdvancedSearch />} />
          <Route path="settings" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
