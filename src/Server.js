import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import Contenedor from './models/Contenedor.js';

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
});
server.on("Error", error => console.log(`Error en servidor ${error}`));

const io = new Server(server);
const messages = [];
const file = "./files/productos.txt"
const productos = new Contenedor(file);

app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(express.static(__dirname+'/public'))

app.engine(
    "handlebars",
    handlebars.engine()
);

app.set('views', './views');
app.set('view engine', 'handlebars');

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
    socket.emit('productos', {productos : productos.getAll()});

    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', [data]);
    });

    socket.on('new-product', data => {
        productos.save(data);
        io.sockets.emit('productos', {productos : productos.getAll()});
    });
})

app.get("/", (req, res) => {
    let productosAll = productos.getAll();
    res.render('indexForm');
});