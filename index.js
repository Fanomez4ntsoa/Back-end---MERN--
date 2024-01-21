const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour gérer le corps des requêtes JSOn
app.use(express.json());

// Configuration de la base de données
// mongoose.connect('mongodb://127.0.0.1:27017/e-commerce', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Routes
app.get('/', (req, res) => {
    res.send('Welcome on the project MERN !')
});

// Ecoute du serveur sur le port spécifique
app.listen(port, () => {
    console.log('Le serveur est en écoute sur le port ${port} ')
});