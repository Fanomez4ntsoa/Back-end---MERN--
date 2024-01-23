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

app.use(express.json());

// Routes
app.get('/api/', (req, res) => {
    res.send('API is running....')
  })
app.use('/api/users', UserRoute);
app.use('/api/products', ProductRoute);
app.use('/api/orders', OrderRoute);

// Middleware pour gérer le corps des requêtes JSOn
const static = path.resolve()
app.use('/public/uploads', express.static(path.join(static, '/public/uploads')))

app.use(notFound)
app.use(errorHandler)

// Ecoute du serveur sur le port spécifique
app.listen(
    PORT, () => {
    console.log(`Le serveur est en écoute sur le port ${PORT}`.yellow.bold)
});