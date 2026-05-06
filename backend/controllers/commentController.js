import db from '../config/db.js';

export const getCommentsByItemId = async (req, res) => {
    try {
        const { itemId } = req.params;
        const [comments] = await db.query(
            'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.item_id = ? ORDER BY c.created_at DESC',
            [itemId]
        );
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { content } = req.body;

        if (!content) return res.status(400).json({ error: 'Kommentar darf nicht leer sein.' });

        const [result] = await db.query(
            'INSERT INTO comments (item_id, user_id, content) VALUES (?, ?, ?)',
            [itemId, req.userId, content]
        );
        
        res.status(201).json({ message: 'Kommentar hinzugefügt!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        
        const [comments] = await db.query('SELECT * FROM comments WHERE id = ?', [commentId]);
        if (comments.length === 0) return res.status(404).json({ error: 'Kommentar nicht gefunden.' });
        
        const comment = comments[0];
        
        if (comment.user_id !== req.userId && req.userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Keine Berechtigung diesen Kommentar zu löschen.' });
        }

        await db.query('DELETE FROM comments WHERE id = ?', [commentId]);
        res.status(200).json({ message: 'Kommentar gelöscht.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
