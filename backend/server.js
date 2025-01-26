require("dotenv").config(); // Charger les variables d'environnement
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

// Connexion à la base de données MongoDB Atlas
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/movieDB"; // Fallback pour dev local

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
