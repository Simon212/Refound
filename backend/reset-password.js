import bcrypt from 'bcrypt';
import db from './config/db.js';

// Argumente aus der Konsole auslesen
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('❌ Fehler: Bitte E-Mail und neues Passwort angeben.');
    console.log('👉 Verwendung: node reset-password.js <email> <neues_passwort>');
    console.log('   Beispiel:  node reset-password.js max@beispiel.de geheim123');
    process.exit(1);
}

const email = args[0];
const newPassword = args[1];

async function resetPassword() {
    try {
        // Prüfen, ob der User überhaupt existiert
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log(`❌ Fehler: Kein Benutzer mit der E-Mail '${email}' gefunden.`);
            process.exit(1);
        }

        // Neues Passwort sicher mit bcrypt hashen
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Das alte verschlüsselte Passwort in der DB mit dem neuen überschreiben
        await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);

        console.log(`✅ Erfolg: Das Passwort für den User '${users[0].username}' (${email}) wurde erfolgreich geändert!`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Ein Datenbank-Fehler ist aufgetreten:', error);
        process.exit(1);
    }
}

resetPassword();
