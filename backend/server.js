require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");
// Socket
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Sélection de l'URI MongoDB en fonction de l'environnement
const mongoURI = process.env.NODE_ENV === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

console.log(`🔍 Connecting to MongoDB: ${mongoURI}`);

// Connexion unique à MongoDB 
mongoose.set("strictQuery", true);
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

// ✅ Ajout d'un garde-fou pour éviter la suppression de la base en ligne
if (process.env.NODE_ENV !== "test") {
  console.warn("ATTENTION: Vous êtes connecté à la base de production !");
}

// Utilisation des routes
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

// Stockage de l'historique des messages
let messageHistory = [];

// Gestion des connexions socket
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Envoyer l'historique des messages au client qui vient de se connecter
  socket.emit("messageHistory", messageHistory);

  socket.on("sendMessage", (data) => {
    // Ajouter le message à l'historique
    messageHistory.push(data);
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, server };
