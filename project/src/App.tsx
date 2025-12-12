import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';

// App Pages
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
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes - No Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

          {/* Main App Routes - With Layout */}
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="marketplace" element={<AdvancedSearch />} />
            <Route path="strategy/:id" element={<StrategyDetail />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="compare" element={<StrategyComparison />} />
            <Route path="pricing" element={<SubscriptionPlans />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="creator-dashboard" element={
              <ProtectedRoute>
                <CreatorDashboard />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="my-dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="simulator" element={
              <ProtectedRoute>
                <RiskSimulator />
              </ProtectedRoute>
            } />
            <Route path="upload" element={
              <ProtectedRoute>
                <BacktestUpload />
              </ProtectedRoute>
            } />
            <Route path="notifications" element={
              <ProtectedRoute>
                <NotificationCenter />
              </ProtectedRoute>
            } />
            <Route path="affiliate" element={
              <ProtectedRoute>
                <AffiliateCenter />
              </ProtectedRoute>
            } />
            <Route path="favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
