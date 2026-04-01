import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHeart, FaComment, FaShare, FaImage, FaPaperPlane, FaWrench } from 'react-icons/fa';
import './SocialFeed.css';

interface Post {
    id: string;
    author: {
        name: string;
        avatar: string;
        profession: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    timeAgo: string;
}

const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        author: { name: 'Alain Dupont', avatar: 'AD', profession: 'Plombier Certifié' },
        content: 'Intervention d\'urgence ce matin : remplacement complet d\'un chauffe-eau percé en moins de 2 heures. Client satisfait ! 💧🔧 #plomberie #reliance',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        likes: 124,
        comments: 18,
        timeAgo: 'Il y a 2h'
    },
    {
        id: 'p2',
        author: { name: 'Sarah Koné', avatar: 'SK', profession: 'Électricienne' },
        content: 'Mise aux normes d\'un tableau électrique dans une ancienne bâtisse. La sécurité d\'abord ! ⚡️ N\'hésitez pas si vous avez des doutes sur votre installation.',
        likes: 89,
        comments: 5,
        timeAgo: 'Il y a 5h'
    },
    {
        id: 'p3',
        author: { name: 'Garage MoteurPro', avatar: 'MP', profession: 'Mécanique Auto' },
        content: 'Diagnostic et réparation d\'un problème de transmission complexe sur un SUV. Prêt pour la route des vacances ! 🚙👨‍🔧',
        image: 'https://images.unsplash.com/photo-1486262715619-67081010308f?auto=format&fit=crop&q=80&w=800',
        likes: 210,
        comments: 42,
        timeAgo: 'Hier'
    }
];

const SocialFeed: React.FC = () => {
    const { isAuthenticated, openAuthModal, role } = useAuth();
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

    // L'Auth Guard pour intercepter les actions
    const handleAction = (actionCallback: () => void) => {
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            actionCallback();
        }
    };

    const handleLike = (postId: string) => {
        handleAction(() => {
            setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
        });
    };

    const handleRequestIntervention = (techName: string) => {
        handleAction(() => {
            alert(`Vous allez être redirigé vers le formulaire de demande pour ${techName}.`);
        });
    };

    return (
        <div className="social-feed-container">
            <div className="feed-header">
                <div className="feed-header-content">
                    <h1>L'Actualité des Artisans</h1>
                    <p>Découvrez les réalisations de nos professionnels, trouvez l'inspiration et demandez une intervention en un clic.</p>
                </div>
            </div>

            <div className="feed-layout">
                <div className="feed-main-column">
                    {/* Zone de création de Post (visible uniquement si connecté) */}
                    {isAuthenticated && (
                        <div className="create-post-widget">
                            <div className="create-post-header">
                                <div className="user-mini-avatar">VO</div>
                                <input type="text" placeholder={`Partagez une réalisation, ${role === 'technician' ? 'artisan' : 'client'}...`} />
                            </div>
                            <div className="create-post-actions">
                                <button className="btn-post-media"><FaImage /> Photo/Vidéo</button>
                                <button className="btn-post-submit"><FaPaperPlane /> Publier</button>
                            </div>
                        </div>
                    )}

                    {/* Liste des Posts */}
                    <div className="posts-list">
                        {posts.map(post => (
                            <div key={post.id} className="post-card">
                                <div className="post-header">
                                    <div className="post-author-info">
                                        <div className="post-avatar">{post.author.avatar}</div>
                                        <div>
                                            <Link to={`/artisan/${post.author.name.toLowerCase().replace(' ', '-')}`} style={{color: 'inherit', textDecoration: 'none'}}>
                                                <strong>{post.author.name}</strong>
                                            </Link>
                                            <span>{post.author.profession} • {post.timeAgo}</span>
                                        </div>
                                    </div>
                                    {/* Bouton CTA pour engager le client (AuthGuard activé) */}
                                    <button 
                                        className="btn-request-tech"
                                        onClick={() => handleRequestIntervention(post.author.name)}
                                    >
                                        <FaWrench /> Demander ses services
                                    </button>
                                </div>

                                <div className="post-content">
                                    <p>{post.content}</p>
                                    {post.image && (
                                        <div className="post-image">
                                            <img src={post.image} alt="Réalisation" loading="lazy" />
                                        </div>
                                    )}
                                </div>

                                <div className="post-footer">
                                    <button className="post-action-btn" onClick={() => handleLike(post.id)}>
                                        <FaHeart /> {post.likes}
                                    </button>
                                    <button className="post-action-btn" onClick={() => handleAction(() => alert('Ouverture des commentaires'))}>
                                        <FaComment /> {post.comments}
                                    </button>
                                    <button className="post-action-btn" onClick={() => handleAction(() => alert('Outil de partage'))}>
                                        <FaShare /> Partager
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="feed-side-column">
                    <div className="highlight-widget">
                        <h3>Pourquoi s'inscrire ?</h3>
                        <ul>
                            <li>✔️ Accès gratuit à +500 artisans qualifiés</li>
                            <li>✔️ Messagerie sécurisée et Devis validés</li>
                            <li>✔️ Paiement par séquestre sans risque</li>
                        </ul>
                        {!isAuthenticated && (
                            <button className="btn-join-now" onClick={openAuthModal}>
                                Rejoindre Reliance
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialFeed;
