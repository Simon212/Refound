import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h2 className="text-center">Account erstellen</h2>
                <p className="text-center text-muted mb-4">Tritt der ReFound Community bei.</p>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Benutzername</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>E-Mail Adresse</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Passwort</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Registrieren</button>
                </form>
                
                <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                    Bereits einen Account? <Link to="/login" style={{ color: 'var(--primary)' }}>Zum Login</Link>
                </p>
            </div>
        </div>
    );
}
