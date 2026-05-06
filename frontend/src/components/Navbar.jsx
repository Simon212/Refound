import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Package, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass">
            <div className="container">
                <Link to="/" className="nav-brand">
                    <Package color="#6366f1" size={28} />
                    ReFound
                </Link>
                
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {user && <Link to="/create-item" className="nav-link">Gefunden!</Link>}
                    
                    {!user ? (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Registrieren</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="nav-link" style={{ color: '#fbbf24' }}>Admin Panel</Link>
                            )}
                            <span className="nav-link" style={{ cursor: 'default', color: '#6366f1' }}>{user.username}</span>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                <LogOut size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
