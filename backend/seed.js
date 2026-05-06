import bcrypt from 'bcrypt';
import db from './config/db.js';

async function seed() {
    try {
        console.log('Starte Seed...');
        
        // Admin erstellen
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const [adminExists] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@refound.local']);
        
        if (adminExists.length === 0) {
            await db.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['Admin', 'admin@refound.local', hashedPassword, 'ADMIN']
            );
            console.log('✅ Admin-User erfolgreich angelegt (admin@refound.local / admin123)');
        } else {
            console.log('ℹ️ Admin-User exisitiert bereits.');
        }

        console.log('Seed abgeschlossen!');
        process.exit();
    } catch (error) {
        console.error('❌ Fehler beim Seeden:', error);
        process.exit(1);
    }
}

seed();
