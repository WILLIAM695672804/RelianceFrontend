import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroCarousel.css';

interface Slide {
    image: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
}

interface HeroCarouselProps {
    slides: Slide[];
    ctaLink?: string;
    ctaText?: string;
    className?: string;
    interval?: number;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
    slides,
    ctaLink = '/devenir-membre',
    ctaText = 'Devenir membre',
    className = '',
    interval = 6000,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, interval);

        return () => clearInterval(timer);
    }, [slides.length, interval]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className={`hero-carousel ${className}`}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="hero-overlay"></div>
                    <div className="container hero-content-wrapper">
                        {/* Applying the extreme left padding preference directly here or via CSS class */}
                        <div className="hero-slide-content">
                            <h1 className="hero-title">{slide.title}</h1>
                            {slide.subtitle && <div className="hero-subtitle">{slide.subtitle}</div>}
                            <Link to={ctaLink} className="btn btn-primary hero-cta">
                                {ctaText}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <button className="carousel-nav prev" onClick={prevSlide}>
                <FaChevronLeft />
            </button>
            <button className="carousel-nav next" onClick={nextSlide}>
                <FaChevronRight />
            </button>

            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
