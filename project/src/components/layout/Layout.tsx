import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Footer';
import { useTheme } from '../../hooks/useTheme';

export default function Layout() {
  // Apply theme to document body
  useTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-white transition-colors duration-300">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
