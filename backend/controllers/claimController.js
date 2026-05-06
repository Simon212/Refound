import db from '../config/db.js';

export const createClaim = async (req, res) => {
    try {
        const { itemId, message } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Bitte füge eine Nachricht für deinen Besitzanspruch hinzu.' });
        }
        
        const [existing] = await db.query('SELECT * FROM claims WHERE item_id = ? AND user_id = ?', [itemId, req.userId]);
        if (existing.length > 0) return res.status(400).json({ error: 'Du hast dieses Item bereits beansprucht.' });

        await db.query(
            'INSERT INTO claims (item_id, user_id, message) VALUES (?, ?, ?)',
            [itemId, req.userId, message]
        );
        res.status(201).json({ message: 'Dein Besitzanspruch wurde gemeldet und wird geprüft.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserClaims = async (req, res) => {
    try {
        const [claims] = await db.query(
            'SELECT c.*, i.title as item_title FROM claims c JOIN items i ON c.item_id = i.id WHERE c.user_id = ?',
            [req.userId]
        );
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
