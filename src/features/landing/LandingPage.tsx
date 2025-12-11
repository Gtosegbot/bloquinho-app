import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from '../../components/layout/Footer';

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
};
