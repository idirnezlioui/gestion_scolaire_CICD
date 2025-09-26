# 1) Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# 2) Nginx
FROM nginx:alpine

# Supprime l'index par défaut
RUN rm -rf /usr/share/nginx/html/*

# COPIE le CONTENU de browser/   à la racine Nginx**
COPY --from=build /app/dist/gestion-scolaire/browser/ /usr/share/nginx/html/

#pour evite le 404
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
