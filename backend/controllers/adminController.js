import db from '../config/db.js';

export const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email, role, created_at FROM users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        res.status(200).json({ message: 'Rolle erfolgreich aktualisiert.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await db.query('DELETE FROM users WHERE id = ?', [userId]);
        res.status(200).json({ message: 'Benutzer gelöscht.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllClaims = async (req, res) => {
    try {
        const [claims] = await db.query(`
            SELECT c.*, i.title as item_title, u.username as claimant_name 
            FROM claims c 
            JOIN items i ON c.item_id = i.id 
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
        `);
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateClaimStatus = async (req, res) => {
    try {
        const { claimId } = req.params;
        const { status } = req.body; // 'APPROVED' or 'REJECTED'
        
        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return res.status(400).json({ error: 'Ungültiger Status. Erlaubt sind: APPROVED, REJECTED, PENDING.' });
        }
        
        await db.query('UPDATE claims SET status = ? WHERE id = ?', [status, claimId]);
        res.status(200).json({ message: `Anspruch-Status geändert auf ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
