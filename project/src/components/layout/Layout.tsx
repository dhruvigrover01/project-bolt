import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

