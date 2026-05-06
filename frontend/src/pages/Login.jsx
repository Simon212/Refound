import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h2 className="text-center">Willkommen zurück</h2>
                <p className="text-center text-muted mb-4">Logge dich in deinen Account ein.</p>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Einloggen</button>
                </form>
                
                <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                    Noch keinen Account? <Link to="/register" style={{ color: 'var(--primary)' }}>Hier registrieren</Link>
                </p>
            </div>
        </div>
    );
}
