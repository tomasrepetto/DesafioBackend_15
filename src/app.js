import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

import products from './routers/products.js';
import carts from './routers/carts.js';
import views from './routers/views.js';
import tickets from './routers/tickets.js';
import auth from './routers/auth.js';
import { dirname } from './utils.js';
import { dbConnection } from './config/config.js';
import { messageModel } from './models/messagesModel.js';
import { addProductService, getProductsService } from './dao/productsMongo.js';
import { initializaPassport } from './config/passport.js';
import { errorHandler } from './middleware/errorHandler.js';

// Importar el logger
import logger from './config/logger.js';

const app = express();
const PORT = process.env.PORT || 8080;

if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined in the environment variables.');
}

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not defined in the environment variables.');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, 'public')));

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 3600
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

initializaPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine());
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware para loguear todas las solicitudes HTTP
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

app.use('/', views);
app.use('/api/products', products);
app.use('/api/carts', carts);
app.use('/api/tickets', tickets);
app.use('/api/auth', auth);

// Endpoint de prueba
app.get('/loggerTest', (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warning('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');
    res.send('Logger test complete');
});

// Agregar el manejador de errores después de todas las rutas
app.use(errorHandler);

try {
    await dbConnection();
    const expressServer = app.listen(PORT, () => {
        logger.info(`Corriendo aplicación en el puerto ${PORT}`);
    });
    const io = new Server(expressServer);

    io.on('connection', async (socket) => {
        try {
            const { payload } = await getProductsService({});
            const productos = payload;
            socket.emit('productos', payload);

            socket.on('agregarProducto', async (producto) => {
                const newProduct = await addProductService({ ...producto });
                if (newProduct) {
                    productos.push(newProduct);
                    socket.emit('productos', producto);
                }
            });

            const messages = await messageModel.find();
            socket.emit('message', messages);

            socket.on('message', async (data) => {
                const newMessage = await messageModel.create({ ...data });
                if (newMessage) {
                    const messages = await messageModel.find();
                    io.emit('messageLogs', messages);
                }
            });

            socket.broadcast.emit('nuevo_user');
        } catch (error) {
            logger.error('Error handling socket connection:', error);
        }
    });
} catch (error) {
    logger.error('Error connecting to the database:', error);
}









