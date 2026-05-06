# ReFound - Start Anleitung

Herzlichen Glückwunsch! Die App **ReFound** wurde erfolgreich generiert!
Da du auf Windows mit XAMPP arbeitest, hier die Schritt-für-Schritt Anleitung, wie du das Projekt startest.

### 1. Datenbank einrichten
1. Öffne **XAMPP** und starte das Modul **MySQL**.
2. Öffne **phpMyAdmin** in deinem Browser (meist `http://localhost/phpmyadmin`).
3. Importiere die generierte SQL-Datei:
   - Du kannst direkt in phpMyAdmin auf "Importieren" gehen und die Datei `C:\Users\Admin\Documents\Schule\ITP\refound\setup.sql` auswählen, ODER
   - In phpMyAdmin auf SQL klicken und einfach den Inhalt der `setup.sql` pasten und ausführen.

### 2. Backend starten
Das Backend benötigt Node.js.
1. Öffne ein neues Terminal (PowerShell oder CMD) im Ordner `refound/backend`.
2. Installiere die Abhängigkeiten:
   ```cmd
   npm install
   ```   
3. Führe das Datenbank-Seed-Script aus, um den Admin-User zu generieren:
   ```cmd
   npm run seed
   ```
4. Starte den Backend-Server:
   ```cmd
   npm start
   ```
   *Wenn alles klappt, steht im Terminal: `Server läuft auf http://localhost:5000` und `Datenbank erfolgreich verbunden!`*

### 3. Frontend starten
Das Frontend basiert auf React und Vite.
1. Öffne noch ein **zweites** Terminal im Ordner `refound/frontend`.
2. Installiere die Pakete:
   ```cmd
   npm install
   ```
3. Starte den Entwicklungsserver:
   ```cmd
   npm run dev
   ```
4. Das Terminal zeigt dir nun einen Link an (meist `http://localhost:5173`). Klicke diesen an (oder kopiere ihn in deinen Browser).

### 4. Admin Test-Login
Du kannst dich direkt mit dem generierten Admin-User einloggen:
- **E-Mail:** `admin@refound.local`
- **Passwort:** `admin123`

Damit kannst du oben im Menü das **Admin Panel** öffnen und sofort die Features testen!
Viel Erfolg bei deinem Projekt!
