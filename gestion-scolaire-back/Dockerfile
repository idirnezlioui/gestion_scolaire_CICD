FROM node:20-alpine

#repertoire du travaile
WORKDIR /app

#copier toute les dependence 
COPY package*.json ./

# Installer uniquement les dépendances de prod

#Outils de build nécessaires pour bcrypt (sous Alpine)
RUN apk add --no-cache python3 make g++ \
  && npm ci --omit=dev  # (= --only=production)

#copier tout le projet 

COPY . .

# Déclarer les variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

#expose c'est variable la 
EXPOSE 3000

CMD [ "npm","start" ]
