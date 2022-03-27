const socket = io.connect();



function render(data) {

    const html = data.map((elem, index) => {
        return(`<div class="card m-4 productos" style="width: 18rem;">
            <img src=${elem.Thumbnail} class="card-img-top">
            <div class="card-body">
            <h5 class="card-title">Titulo ${elem.Title}</h5>
            <h5 class="card-title">Precio $ ${elem.Price}</h5>
            <h5 class="card-title">Id ${elem.id}</h5>
            <button class="btn btn-warning m-1" onclick="deleteProduct(${elem.id})"" >Eliminar </button>
            </div></div>`)
    }).join(" ");
    console.log("Renderizando productos")

    document.getElementById('productos').innerHTML = html;
}


function renderMensajes(data) {

    const mensaje = data
    if(mensaje == "No hay contenido") {

        const html = "<h3>No hay mensajes registrados<h3>"
    
        document.getElementById('menssages').innerHTML = html;

    } else {
        const html = mensaje.map((elem, index) => {
            return(`<div>
               <p class="m-2">[${elem.Email}</p>
               <p class="m-2">${elem.dataTimeMensaje}]</p>
               <p class="m-2 mensaje">: ${elem.Mensaje}</p>
               </div>`)
        }).join(" ");
    
        document.getElementById('menssages').innerHTML = html;
    }

}


socket.on('productos', function(data) { render(data); });
socket.on('mensajes', function(data) { renderMensajes(data); });

function addProducto(e) {
    const producto = {
        Title: document.getElementById('Title').value,
        Price: document.getElementById('Price').value,
        Thumbnail: document.getElementById('Thumbnail').value
    };
    console.log("Esta cargando productos")

    socket.emit('new-producto', producto);
    return false;
}


function addMessage(e) {
    const mensaje = {
        Email: document.getElementById('Email').value,
        Mensaje: document.getElementById('Mensaje').value,
    };
  
    socket.emit('new-mensaje', mensaje);
    return false;
}


function deleteProduct(id) {

    socket.emit('delete-product', id);
    return false;
}


