import React, { useState, useEffect, useContext } from 'react';
import { apiFetch } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [claims, setClaims] = useState([]);
    const [users, setUsers] = useState([]);
    const [tab, setTab] = useState('claims');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const claimsData = await apiFetch('/admin/claims');
            setClaims(claimsData);
            const usersData = await apiFetch('/admin/users');
            setUsers(usersData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClaimUpdate = async (id, status) => {
        try {
            await apiFetch(`/admin/claims/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container animate-fade-in">
            <h1 className="mb-4">Admin Dashboard</h1>

            <div className="flex gap-4 mb-4">
                <button className={`btn ${tab === 'claims' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('claims')}>
                    Besitzansprüche ({claims.filter(c => c.status === 'PENDING').length})
                </button>
                <button className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('users')}>
                    Benutzer
                </button>
            </div>

            {tab === 'claims' && (
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 className="mb-4">Eingegangene Besitzansprüche</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>Datum</th>
                                    <th style={{ padding: '1rem' }}>Item</th>
                                    <th style={{ padding: '1rem' }}>User</th>
                                    <th style={{ padding: '1rem' }}>Nachricht</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Aktion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.map(claim => (
                                    <tr key={claim.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{new Date(claim.created_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>{claim.item_title}</td>
                                        <td style={{ padding: '1rem' }}>{claim.claimant_name}</td>
                                        <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{claim.message}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={`badge ${claim.status === 'APPROVED' ? 'badge-success' : claim.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            {claim.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => handleClaimUpdate(claim.id, 'APPROVED')} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#10b981', borderColor: '#10b981' }}>Annehmen</button>
                                                    <button onClick={() => handleClaimUpdate(claim.id, 'REJECTED')} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}>Ablehnen</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {claims.length === 0 && <tr><td colSpan="6" className="text-center" style={{ padding: '1rem' }}>Keine Ansprüche vorhanden</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'users' && (
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 className="mb-4">Alle Benutzer</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>ID</th>
                                    <th style={{ padding: '1rem' }}>Username</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Rolle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{u.id}</td>
                                        <td style={{ padding: '1rem' }}>{u.username}</td>
                                        <td style={{ padding: '1rem' }}>{u.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={`badge ${u.role === 'ADMIN' ? 'badge-warning' : 'badge-success'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
