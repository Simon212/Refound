import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch, API_BASE_URL } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, User, Info } from 'lucide-react';

export default function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [claimMessage, setClaimMessage] = useState('');
    const [showClaimForm, setShowClaimForm] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const fetchItemDetails = async () => {
        try {
            const itemData = await apiFetch(`/items/${id}`);
            setItem(itemData);
            const commentsData = await apiFetch(`/comments/item/${id}`);
            setComments(commentsData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await apiFetch(`/comments/item/${id}`, {
                method: 'POST',
                body: JSON.stringify({ content: newComment })
            });
            setNewComment('');
            fetchItemDetails();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleClaim = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/claims', {
                method: 'POST',
                body: JSON.stringify({ itemId: id, message: claimMessage })
            });
            alert('Besitzanspruch erfolgreich gemeldet. Ein Admin wird dies prüfen.');
            setShowClaimForm(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async () => {
        if(window.confirm('Item wirklich löschen?')) {
            try {
                await apiFetch(`/items/${id}`, { method: 'DELETE' });
                navigate('/');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    if (!item) return <div className="container text-center mt-4">Lade...</div>;

    const canModify = user && (user.id === item.user_id || user.role === 'ADMIN');

    return (
        <div className="container animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
            {/* Left Col: Details */}
            <div>
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <div className="flex justify-between align-center mb-4">
                        <span className={`badge ${item.status === 'Zur Abholung bereit' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
                        {canModify && <button onClick={handleDelete} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Löschen</button>}
                    </div>
                    <h1 style={{ marginBottom: '1rem' }}>{item.title}</h1>
                    
                    {item.image_url && (
                        <div style={{ margin: '2rem 0', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                            <img src={`${API_BASE_URL}${item.image_url}`} alt={item.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                        <div className="flex align-center gap-2"><MapPin size={18} /> {item.location}</div>
                        <div className="flex align-center gap-2"><Calendar size={18} /> {new Date(item.date_found).toLocaleDateString()}</div>
                        <div className="flex align-center gap-2"><User size={18} /> Gefunden von: {item.username}</div>
                    </div>
                    
                    <h3>Beschreibung</h3>
                    <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{item.description}</p>
                </div>
            </div>

            {/* Right Col: Actions & Comments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3>Gehört dir das?</h3>
                    <p className="text-muted mt-1 mb-4" style={{ fontSize: '0.9rem' }}>Melde dich, wenn dies dein Gegenstand ist.</p>
                    
                    {!user ? (
                        <div className="error-msg flex align-center gap-2" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)'}}>
                            <Info size={18}/> Bitte logge dich ein, um Ansprüche zu melden.
                        </div>
                    ) : user.id === item.user_id ? (
                        <div className="badge badge-success" style={{ display: 'block', textAlign: 'center', padding: '1rem' }}>Du hast das gemeldet</div>
                    ) : showClaimForm ? (
                        <form onSubmit={handleClaim}>
                            <textarea className="form-control mb-2" rows="3" placeholder="Beschreibe Details (z.B. Kratzer, Sperrcode), um zu beweisen, dass es dir gehört..." value={claimMessage} onChange={e => setClaimMessage(e.target.value)} required></textarea>
                            <div className="flex gap-2">
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Absenden</button>
                                <button type="button" className="btn btn-outline" onClick={() => setShowClaimForm(false)}>Abbrechen</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setShowClaimForm(true)} className="btn btn-primary" style={{ width: '100%' }}>Das gehört mir!</button>
                    )}
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', flex: 1 }}>
                    <h3>Kommentare ({comments.length})</h3>
                    {user ? (
                        <form onSubmit={handleAddComment} className="mt-4 mb-4">
                            <textarea className="form-control mb-2" rows="2" placeholder="Frage etwas zum Fundstück..." value={newComment} onChange={e => setNewComment(e.target.value)} required></textarea>
                            <button type="submit" className="btn btn-outline">Kommentieren</button>
                        </form>
                    ) : (
                        <p className="text-muted mt-2 mb-4" style={{ fontSize: '0.9rem' }}>Login erforderlich für Kommentare.</p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comments.map(c => (
                            <div key={c.id} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                                <div className="flex justify-between" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    <strong>{c.username}</strong>
                                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: '0.95rem' }}>{c.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
