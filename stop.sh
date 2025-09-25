#!/bin/bash

echo "🛑 Arrêt de l'application..."

# 1. Arrêt de XAMPP (MySQL, Apache)
echo "📦 Arrêt de MySQL via XAMPP..."
sudo /opt/lampp/lampp stop

# 2. Fermeture des serveurs Node (backend)
echo "🟢 Fermeture du backend (Node.js)..."
pkill -f "node index.js"

# 3. Fermeture du serveur Angular
echo "🟠 Fermeture du frontend Angular..."
pkill -f "ng serve"

echo "✅ Tous les services ont été arrêtés."
