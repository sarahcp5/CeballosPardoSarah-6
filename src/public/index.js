const socket = io.connect();
let productos = [];

socket.on('messages', data => {
    render(data);
});

socket.on('productos', data => {
    renderTable(data.productos);
});

function render(data) {
   data.forEach((elem) => {
        $("#mensajes").append(`
            <div> 
                <strong class="text-primary">${elem.email}</strong>
                <em class="text-brown">[${elem.fecha}]: </em> 
                <em class="fst-italic text-success">${elem.mensaje}</em>
            </div>
        `)
    });
}

async function renderTable(productos) {
    const response = await fetch("/tablaProductos.handlebars");
    const source = await response.text();
    const template = Handlebars.compile(source);
    const context = { productos: productos };
    let html = template(context);
    $("#tablaProductos").empty();
    $("#tablaProductos").append(html);
}

$("#formChat").submit((e) => {
    e.preventDefault();
    const mensaje = {
        email: $('#email').val(),
        fecha: new Date().toLocaleString(),
        mensaje: $('#mensaje').val(),
    };

    socket.emit('new-message', mensaje);
    emptyInput('#mensaje');

});

$("#formProducto").submit((e) => {
    e.preventDefault();
    const producto = {
        title: $('#title').val(),
        price: $('#price').val(),
        thumbnail: $('#thumbnail').val(),
    };
    
    socket.emit('new-product', producto);
    emptyInput('#title');
    emptyInput('#price');
    emptyInput('#thumbnail');
});

function emptyInput(value) {
    $(value).val("");
}