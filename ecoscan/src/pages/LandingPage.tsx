import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { useNavbarConfig } from '@/context/NavbarContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { setConfig } = useNavbarConfig();

  useEffect(() => {
    setConfig({
      onScanClick: () => navigate('/scanner'),
      onHomeClick: () => navigate('/'),
      ecoPoints: 0,
      showPoints: false,
      isScannerPage: false,
    });
  }, [navigate, setConfig]);

  return (
    <HeroSection
      onScanClick={() => navigate('/scanner')}
      onDemoClick={() => navigate('/scanner')}
    />
  );
}