import React from 'react';
import { FaWrench, FaBolt, FaVideo, FaMapMarkerAlt, FaLaptop, FaCog } from 'react-icons/fa';
import './Services.css';

const Services: React.FC = () => {
    const services = [
        {
            icon: <FaWrench />,
            title: 'Plomberie',
            description: 'Réparation et installation de systèmes sanitaires',
            color: 'red'
        },
        {
            icon: <FaBolt />,
            title: 'Électricité',
            description: 'Installation électrique et dépannage',
            color: 'blue'
        },
        {
            icon: <FaVideo />,
            title: 'Caméras & Sécurité',
            description: 'Installation de systèmes de surveillance',
            color: 'red'
        },
        {
            icon: <FaMapMarkerAlt />,
            title: 'GPS & Tracking',
            description: 'Installation de systèmes de géolocalisation',
            color: 'blue'
        },
        {
            icon: <FaLaptop />,
            title: 'Informatique',
            description: 'Maintenance et réparation informatique',
            color: 'red'
        },
        {
            icon: <FaCog />,
            title: 'Maintenance',
            description: 'Entretien et réparations générales',
            color: 'blue'
        }
    ];

    return (
        <section id="services" className="services section">
            <div className="container">
                <h2 className="section-title">Nos Domaines d'Intervention</h2>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <div className={`service-icon ${service.color}`}>
                                        {service.icon}
                                    </div>
                                    <h3 className="service-title">{service.title}</h3>
                                </div>
                                <div className={`flip-card-back ${service.color}`}>
                                    <h3 className="service-title-back">{service.title}</h3>
                                    <p className="service-description">{service.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
