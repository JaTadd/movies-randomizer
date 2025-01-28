# Utiliser une image Node.js comme base
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel le backend écoute
EXPOSE 5000

# Démarrer le serveur
CMD ["node", "server.js"]
