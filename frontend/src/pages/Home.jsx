import { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import axios from 'axios';

export default function Homepage({ isLoggedIn, setIsLoggedIn, setLoadingRooms }) {
  useEffect(() => {
    axios.get("https://codesync-server-7x03.onrender.com/auth/profile", { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(response.data.user)
      }
      )
      .catch(() => {
        setIsLoggedIn(null);
        setLoadingRooms(false);
      });
  }, []);
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-mono">

      <HeroSection isLoggedIn={isLoggedIn} />

      <FeatureSection />

      <HowItWorks />

      <Footer />

    </div>
  );
}