import React, { useState } from 'react';
import {
    FaImage,
    FaMapMarkerAlt,
    FaSmile,
    FaThumbsUp,
    FaComment,
    FaShare,
    FaEllipsisH
} from 'react-icons/fa';
import './SocialWall.css';

const SocialWall: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ALL' | 'HELP' | 'NEWS'>('ALL');
    const [likes, setLikes] = useState<{ [key: number]: boolean }>({});

    // Mock Posts
    const posts = [
        {
            id: 1,
            author: "Marc D.",
            role: "Électricien Expert",
            time: "Il y a 2h",
            content: "Quelqu'un a déjà travaillé sur les nouveaux tableaux Schneider ? J'ai un doute sur le raccordement du différentiel type F.",
            image: null,
            likes: 5,
            comments: 12,
            type: "HELP"
        },
        {
            id: 2,
            author: "Reliance Admin",
            role: "Support",
            time: "Il y a 4h",
            content: "📢 Rappel : Une maintenance de l'application est prévue ce soir à 22h. Pensez à synchroniser vos missions avant.",
            image: null,
            likes: 42,
            comments: 3,
            type: "NEWS"
        },
        {
            id: 3,
            author: "Thomas B.",
            role: "Plombier",
            time: "Hier",
            content: "Chantier terminé à Bonapriso ! Rénovation complète de salle de bain. Le client est ravi. 💪🚿",
            image: "placeholder-image-url",
            likes: 28,
            comments: 8,
            type: "ALL"
        }
    ];

    const toggleLike = (id: number) => {
        setLikes(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredPosts = activeTab === 'ALL'
        ? posts
        : posts.filter(p => p.type === activeTab || (activeTab === 'HELP' && p.type === 'HELP') || (activeTab === 'NEWS' && p.type === 'NEWS'));

    return (
        <div className="tech-page social-page">
            <h1 className="page-title">Mur Communautaire</h1>

            {/* Create Post */}
            <div className="create-post-card">
                <div className="create-post-header">
                    <div className="user-avatar-small">W</div>
                    <textarea
                        className="post-input"
                        placeholder="Partagez une astuce, une question ou une réalisation..."
                    />
                </div>
                <div className="post-actions">
                    <div className="action-buttons">
                        <button className="media-btn" title="Photo"><FaImage /></button>
                        <button className="media-btn" title="Lieu"><FaMapMarkerAlt /></button>
                        <button className="media-btn" title="Emoji"><FaSmile /></button>
                    </div>
                    <button className="post-submit-btn">Publier</button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="feed-filter">
                <button
                    className={`filter-tab ${activeTab === 'ALL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ALL')}
                >
                    Tout
                </button>
                <button
                    className={`filter-tab ${activeTab === 'HELP' ? 'active' : ''}`}
                    onClick={() => setActiveTab('HELP')}
                >
                    Entraide
                </button>
                <button
                    className={`filter-tab ${activeTab === 'NEWS' ? 'active' : ''}`}
                    onClick={() => setActiveTab('NEWS')}
                >
                    Annonces Reliance
                </button>
            </div>

            {/* Feed */}
            <div className="feed-list">
                {filteredPosts.map(post => (
                    <div key={post.id} className="feed-post">
                        <div className="post-header">
                            <div className="author-info">
                                <div className="user-avatar-small">{post.author.charAt(0)}</div>
                                <div>
                                    <h4 className="author-name">
                                        {post.author}
                                        {post.type === 'NEWS' && <span className="post-badge">Officiel</span>}
                                    </h4>
                                    <span className="post-meta">{post.role} • {post.time}</span>
                                </div>
                            </div>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                <FaEllipsisH />
                            </button>
                        </div>

                        <div className="post-content">
                            <p>{post.content}</p>
                            {post.image && (
                                <div className="post-image" style={{ background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                    <FaImage style={{ fontSize: '3rem' }} />
                                </div>
                            )}
                        </div>

                        <div className="post-footer">
                            <button
                                className={`interaction-btn ${likes[post.id] ? 'liked' : ''}`}
                                onClick={() => toggleLike(post.id)}
                            >
                                <FaThumbsUp /> {post.likes + (likes[post.id] ? 1 : 0)} J'aime
                            </button>
                            <button className="interaction-btn">
                                <FaComment /> {post.comments} Commentaires
                            </button>
                            <button className="interaction-btn">
                                <FaShare /> Partager
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialWall;
