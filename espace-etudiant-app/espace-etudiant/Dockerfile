# Étape 1 : image node alpine
FROM node:20-alpine

# Étape 2 : créer dossier
WORKDIR /app

# Étape 3 : copier les dépendances
COPY package*.json ./

# Étape 4 : installer les dépendances
RUN npm install

# Étape 5 : installer Angular CLI globalement
RUN npm install -g @angular/cli

# Étape 6 : copier tout le projet
COPY . .

# Étape 7 : lancer Angular
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]


