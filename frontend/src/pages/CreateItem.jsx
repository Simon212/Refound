import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function CreateItem() {
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'Sonstiges', location: '', date_found: new Date().toISOString().split('T')[0]
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="container text-center mt-4">Bitte logge dich ein, um einen Fund zu melden.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) data.append('image', image);

            await apiFetch('/items', {
                method: 'POST',
                body: data
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '600px' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h2>Neuen Fund melden</h2>
                <p className="text-muted mb-4">Hast du etwas gefunden? Hilf mit, es dem Besitzer zurückzugeben!</p>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Titel / Kurzbeschreibung</label>
                        <input type="text" className="form-control" required 
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    
                    <div className="form-group">
                        <label>Details</label>
                        <textarea className="form-control" rows="4" required 
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Kategorie</label>
                            <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="Elektronik">Elektronik</option>
                                <option value="Kleidung">Kleidung</option>
                                <option value="Schlüssel">Schlüssel</option>
                                <option value="Sonstiges">Sonstiges</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Funddatum</label>
                            <input type="date" className="form-control" required
                                value={formData.date_found} onChange={e => setFormData({...formData, date_found: e.target.value})} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Genauer Fundort (z.B. HTL Flur 2. Stock)</label>
                        <input type="text" className="form-control" required
                            value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Bild (Optional)</label>
                        <input type="file" className="form-control" accept="image/*"
                            onChange={e => setImage(e.target.files[0])} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Eintragen</button>
                </form>
            </div>
        </div>
    );
}
