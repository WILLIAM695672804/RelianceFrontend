import React from 'react';
import '../styles/variables.css';
import Header from '../components/layout/Header';
import Hero from '../components/sections/Hero';
import Mission from '../components/sections/Mission';
import HowItWorks from '../components/sections/HowItWorks';
import Services from '../components/sections/Services';
import Advantages from '../components/sections/Advantages';
import Stats from '../components/sections/Stats';
import CTA from '../components/sections/CTA';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
    return (
        <div className="page-home">
            <Header />
            <main>
                <Hero />
                <Mission />
                <HowItWorks />
                <Services />
                <Advantages />
                <Stats />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
