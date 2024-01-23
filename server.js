const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const databaseConnection = require('./config/connection');
const UserRoute = require('./routes/UserRoute');
const ProductRoute = require('./routes/ProductRoute');
const OrderRoute = require('./routes/OrderRoute');

dotenv.config();
// Connection base de donnée
databaseConnection();

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV === 'development';

if(ENV) {
    app.use(morgan('dev'));
}

// Middleware pour gérer le corps des requêtes JSOn
app.use(express.json());
app.use(notFound)
app.use(errorHandler)

// Routes
app.get('/api/users', UserRoute);
app.get('/api/products', ProductRoute);
app.get('/api/orders', OrderRoute);

const static = path.resolve()
app.use('/public/uploads', express.static(path.join(static, '/public/uploads')))

// Ecoute du serveur sur le port spécifique
app.listen(
    PORT, () => {
    console.log(`Le serveur est en écoute sur le port ${PORT}`.yellow.bold)
});