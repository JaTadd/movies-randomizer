# Étape 1 : Build avec Node.js
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste et construire le frontend
COPY . .
RUN npm run build

# Étape 2 : Servir les fichiers avec Nginx
FROM nginx:alpine

# Copier les fichiers build dans Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour Nginx
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
