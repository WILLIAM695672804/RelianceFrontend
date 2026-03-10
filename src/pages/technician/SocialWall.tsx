import React, { useState } from 'react';
import {
    FaImage,
    FaVideo,
    FaPaperPlane,
    FaHeart,
    FaRegHeart,
    FaComment,
    FaShare,
    FaCheckCircle,
    FaUserPlus,
    FaUserCheck
} from 'react-icons/fa';
import './SocialWall.css';

interface Comment {
    id: string;
    author: string;
    text: string;
}

interface Post {
    id: string;
    author: string;
    avatar: string;
    role: string;
    time: string;
    tag: string;
    content: string;
    image?: string;
    likes: number;
    likedByMe: boolean;
    comments: Comment[];
    followingAuthor?: boolean; // V2 Follow state
}

const SocialWall: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [newPostContent, setNewPostContent] = useState('');

    // Initial mock data
    const [posts, setPosts] = useState<Post[]>([
        {
            id: '1',
            author: 'Jean Dupont',
            avatar: 'JD',
            role: 'Plombier Expert',
            time: 'Il y a 2h',
            tag: 'réalisations',
            content: 'Intervention ce matin sur une fuite encastrée particulièrement complexe. Grâce à la caméra thermique, nous avons pu localiser et réparer sans casser tout le mur ! Client très satisfait.',
            image: 'https://images.unsplash.com/photo-1585728748176-455b52e18eac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            likes: 24,
            likedByMe: false,
            comments: [
                { id: 'c1', author: 'Marie L.', text: 'Super boulot !' }
            ],
            followingAuthor: true
        },
        {
            id: '2',
            author: 'Reliance Team',
            avatar: 'R',
            role: 'Administration',
            time: 'Il y a 5h',
            tag: 'actualité',
            content: '🚀 Nouvelle mise à jour V2 : Découvrez le matching Live ! Préparez-vous à recevoir vos missions en temps réel avec calcul de distance GPS intégré.',
            likes: 156,
            likedByMe: true,
            comments: [],
            followingAuthor: true
        },
        {
            id: '3',
            author: 'Paul Électricien',
            avatar: 'PE',
            role: 'Électricien',
            time: 'Hier',
            tag: 'entraide',
            content: 'Bonjour la communauté. Quelqu\'un aurait un bon plan pour des disjoncteurs différentiels 30mA en gros sur Douala ? Rupture de stock chez mon fournisseur habituel...',
            likes: 5,
            likedByMe: false,
            comments: [
                { id: 'c2', author: 'Jean D.', text: 'Essaie Quincaillerie Pro au marché central, ils ont reçu un stock hier.' }
            ],
            followingAuthor: false
        }
    ]);

    const handlePublish = () => {
        if (!newPostContent.trim()) return;

        const newPost: Post = {
            id: Date.now().toString(),
            author: 'Moi (Vous)',
            avatar: 'M',
            role: 'Technicien',
            time: 'À l\'instant',
            tag: 'réalisations',
            content: newPostContent,
            likes: 0,
            likedByMe: false,
            comments: [],
            followingAuthor: true
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
    };

    const toggleLike = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likedByMe: !post.likedByMe,
                    likes: post.likedByMe ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const toggleFollow = (postId: string) => {
        // Toggle follow status for all posts from this author (simulating a database relationship)
        setPosts(prev => {
            const postToChange = prev.find(p => p.id === postId);
            if (!postToChange) return prev;

            return prev.map(post => {
                if (post.author === postToChange.author && post.author !== 'Moi (Vous)') {
                    return { ...post, followingAuthor: !post.followingAuthor };
                }
                return post;
            });
        });
    };

    return (
        <div className="tech-page social-page">
            <h1 className="page-title">Communauté & Réseau</h1>

            {/* Create Post */}
            <div className="create-post-box">
                <div className="create-post-input-area">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Me" className="user-avatar-small" />
                    <textarea
                        className="post-textarea"
                        placeholder="Partagez une réalisation, une question ou une actualité..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                </div>
                <div className="create-post-actions">
                    <div className="post-media-btns">
                        <button className="btn-post-media" title="Ajouter une photo"><FaImage /></button>
                        <button className="btn-post-media" title="Ajouter une vidéo"><FaVideo /></button>
                    </div>
                    <button className="btn-publish" onClick={handlePublish}>
                        <FaPaperPlane style={{ marginRight: '8px' }} /> Publier
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="social-tabs">
                <button className={`social-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Tout</button>
                <button className={`social-tab ${activeTab === 'réalisations' ? 'active' : ''}`} onClick={() => setActiveTab('réalisations')}>Réalisations</button>
                <button className={`social-tab ${activeTab === 'entraide' ? 'active' : ''}`} onClick={() => setActiveTab('entraide')}>Entraide</button>
                <button className={`social-tab ${activeTab === 'actualité' ? 'active' : ''}`} onClick={() => setActiveTab('actualité')}>Reliance News</button>
            </div>

            {/* Feed */}
            <div className="social-feed">
                {posts.filter(p => activeTab === 'all' || p.tag === activeTab).map(post => (
                    <div key={post.id} className="social-post">
                        {/* Post Header */}
                        <div className="post-header">
                            <div className="post-author">
                                <div className="author-avatar">{post.avatar}</div>
                                <div className="author-info">
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {post.author}
                                        {post.role.includes('Expert') || post.author.includes('Team') ? <FaCheckCircle style={{ color: '#10b981', fontSize: '0.8rem' }} /> : null}
                                    </h4>
                                    <span className="author-meta">{post.role} • {post.time}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className={`post-tag ${post.tag}`}>{post.tag}</span>

                                {/* V2: Follow Button for Community Building */}
                                {post.author !== 'Moi (Vous)' && (
                                    <button
                                        onClick={() => toggleFollow(post.id)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: post.followingAuthor ? '#10b981' : '#64748b',
                                            fontSize: '1.2rem',
                                            padding: '4px'
                                        }}
                                        title={post.followingAuthor ? 'Abonné' : 'S\'abonner'}
                                    >
                                        {post.followingAuthor ? <FaUserCheck /> : <FaUserPlus />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="post-content">
                            <p>{post.content}</p>
                            {post.image && (
                                <img src={post.image} alt="Post content" style={{ width: '100%', borderRadius: '12px', marginTop: '12px' }} />
                            )}
                        </div>

                        {/* Post Actions */}
                        <div className="post-actions">
                            <button className={`post-action-btn ${post.likedByMe ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                                {post.likedByMe ? <FaHeart /> : <FaRegHeart />} {post.likes} J'aime
                            </button>
                            <button className="post-action-btn">
                                <FaComment /> {post.comments.length} Commentaires
                            </button>
                            <button className="post-action-btn">
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
