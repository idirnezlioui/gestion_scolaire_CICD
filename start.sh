#!/bin/bash

echo "🚀 Lancement de l'application complète"

# 1. Démarrer MySQL via XAMPP
echo "📦 Démarrage de MySQL (XAMPP)..."
sudo /opt/lampp/lampp start

# 2. Lancer le backend (Node.js)
echo "🟢 Lancement du backend..."
gnome-terminal -- bash -c "cd ~/Documents/gestion-scolaire-back && npm install && npm run dev; exec bash"

# 3. Lancer le frontend (Angular)
echo "🟠 Lancement du frontend..."
gnome-terminal -- bash -c 'cd ~/Documents/gestion-scolaire-front/gestion-scolaire && npm install && ng serve; exec bash'

echo "✅ Tous les services ont été lancés !"
