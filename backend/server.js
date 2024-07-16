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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://localhost:27017/movieDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Utilisation des routes
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

// Stockage de l'historique des messages
let messageHistory = [];

// Gestion connexion socket
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
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
