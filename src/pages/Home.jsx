import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <Navbar/>

      <HeroSection/>

      <FeatureSection/>

      <HowItWorks/>

      <Footer/>
      
    </div>
  );
}