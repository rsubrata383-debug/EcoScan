import { Outlet } from 'react-router';
import { Navbar } from './common/Navbar';
import { NavbarProvider } from '@/context/NavbarContext';

export function Layout() {
  return (
    <NavbarProvider>
      <div className="min-h-screen">
        <main id="main-content">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </NavbarProvider>
  );
}