import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, API_BASE_URL } from '../utils/api';
import { MapPin, Calendar, Tag } from 'lucide-react';

export default function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', category: '', status: '' });

    useEffect(() => {
        fetchItems();
    }, [filters]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(filters).toString();
            const data = await apiFetch(`/items?${queryParams}`);
            setItems(data);
        } catch (error) {
            console.error('Fehler beim Laden der Items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="container animate-fade-in">
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                <h1 className="text-center" style={{ marginBottom: '1rem' }}>Finde Verlorenes wieder</h1>
                <p className="text-center text-muted mb-4">Durchsuche unsere Datenbank oder melde selbst einen gefundenen Gegenstand.</p>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        name="search" 
                        placeholder="Suchen (z.B. Schlüssel, Handy...)" 
                        className="form-control" 
                        style={{ flex: 1, minWidth: '250px' }}
                        onChange={handleFilterChange} 
                    />
                    <select name="category" className="form-control" style={{ width: 'auto' }} onChange={handleFilterChange}>
                        <option value="">Alle Kategorien</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="Kleidung">Kleidung</option>
                        <option value="Schlüssel">Schlüssel</option>
                        <option value="Sonstiges">Sonstiges</option>
                    </select>
                    <select name="status" className="form-control" style={{ width: 'auto' }} onChange={handleFilterChange}>
                        <option value="">Alle Status</option>
                        <option value="Zur Abholung bereit">Zur Abholung bereit</option>
                        <option value="Zur freien Entnahme">Zur freien Entnahme</option>
                        <option value="Bereits abgeholt">Bereits abgeholt</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center mt-4"><h3>Lade Fundstücke...</h3></div>
            ) : items.length === 0 ? (
                <div className="text-center mt-4 text-muted"><h3>Keine Fundstücke gefunden.</h3></div>
            ) : (
                <div className="items-grid">
                    {items.map(item => (
                        <div key={item.id} className="card">
                            <div className="card-img-wrapper">
                                {item.image_url ? 
                                    <img src={`${API_BASE_URL}${item.image_url}`} alt={item.title} className="card-img" /> : 
                                    <span className="text-muted">Kein Bild</span>
                                }
                            </div>
                            <div className="card-body">
                                <div className="flex justify-between align-center mb-2">
                                    <span className={`badge ${item.status === 'Zur Abholung bereit' ? 'badge-success' : 'badge-warning'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{item.title}</h3>
                                <p className="text-muted" style={{ marginBottom: '1rem', flex: 1 }}>{item.description.substring(0, 80)}...</p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                    <div className="flex align-center gap-2"><MapPin size={16} /> {item.location}</div>
                                    <div className="flex align-center gap-2"><Calendar size={16} /> {new Date(item.date_found).toLocaleDateString()}</div>
                                </div>
                                
                                <Link to={`/item/${item.id}`} className="btn btn-outline" style={{ width: '100%' }}>Details ansehen</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
