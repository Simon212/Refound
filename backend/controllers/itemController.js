import db from '../config/db.js';

export const getAllItems = async (req, res) => {
    try {
        const { search, category, status, sort } = req.query;
        let query = `
            SELECT i.*, u.username 
            FROM items i 
            JOIN users u ON i.user_id = u.id
            WHERE 1=1
        `;
        let queryParams = [];

        if (search) {
            query += ' AND (i.title LIKE ? OR i.description LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND i.category = ?';
            queryParams.push(category);
        }
        if (status) {
            query += ' AND i.status = ?';
            queryParams.push(status);
        }

        if (sort === 'oldest') {
            query += ' ORDER BY i.created_at ASC';
        } else {
            query += ' ORDER BY i.created_at DESC';
        }

        const [items] = await db.query(query, queryParams);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        const [items] = await db.query(
            'SELECT i.*, u.username FROM items i JOIN users u ON i.user_id = u.id WHERE i.id = ?', 
            [req.params.id]
        );
        if (items.length === 0) return res.status(404).json({ error: 'Item nicht gefunden' });
        res.status(200).json(items[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createItem = async (req, res) => {
    try {
        const { title, description, category, location, date_found, status } = req.body;

        if (!title || !description || !category || !location || !date_found) {
            return res.status(400).json({ error: 'Bitte alle erforderlichen Felder (Titel, Beschreibung, Kategorie, Ort, Datum) ausfüllen!' });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        const [result] = await db.query(
            'INSERT INTO items (user_id, title, description, category, location, date_found, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.userId, title, description, category, location, date_found, status || 'Zur Abholung bereit', imageUrl]
        );
        
        res.status(201).json({ message: 'Item erfolgreich erstellt!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const { title, description, category, location, date_found, status } = req.body;
        const itemId = req.params.id;

        // Prüfen, ob Item existiert und wem es gehört
        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [itemId]);
        if (items.length === 0) return res.status(404).json({ error: 'Item nicht gefunden' });
        
        const item = items[0];
        
        // Nur der Ersteller oder ein Admin darf das ändern
        if (item.user_id !== req.userId && req.userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Update nicht erlaubt (fehlende Rechte).' });
        }

        let imageUrl = item.image_url;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        await db.query(
            'UPDATE items SET title = ?, description = ?, category = ?, location = ?, date_found = ?, status = ?, image_url = ? WHERE id = ?',
            [title || item.title, description || item.description, category || item.category, location || item.location, date_found || item.date_found, status || item.status, imageUrl, itemId]
        );

        res.status(200).json({ message: 'Item aktualisiert!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [itemId]);
        
        if (items.length === 0) return res.status(404).json({ error: 'Item nicht gefunden' });
        const item = items[0];

        if (item.user_id !== req.userId && req.userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Löschen nicht erlaubt.' });
        }

        await db.query('DELETE FROM items WHERE id = ?', [itemId]);
        res.status(200).json({ message: 'Item erfolgreich gelöscht.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
