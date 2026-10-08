import { Route, Routes, Navigate } from 'react-router';
import { LandingPage } from '@/pages/LandingPage';
import { ScannerPage } from './pages/ScannerPage';
import { Layout } from '@/components/Layout';
import { NavbarProvider } from '@/context/NavbarContext';

function App() {
  return (
    <NavbarProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavbarProvider>
  );
}

export default App;