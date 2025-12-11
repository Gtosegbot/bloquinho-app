
import { Navbar } from '../../components/layout/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from '../../components/layout/Footer';
import { ChatWidget } from '../chat/components/ChatWidget';

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
            <ChatWidget />
        </div>
    );
};
