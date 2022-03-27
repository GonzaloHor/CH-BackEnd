const express = require('express')
const { Router } = express
const app = express()
const router = Router()
const fs = require('fs')
const alert = require('alert'); 


const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


app.use(express.json())
app.use(express.urlencoded({extended: true}))



class creteFile{
    constructor(nameFile){
        this.nameFile = nameFile;   
    };
    
    readFile(){
        const ruta = `./${this.nameFile}.txt`

        try {
            const datas = fs.readFileSync(ruta,'utf-8');
            const dataJson = JSON.parse(datas);


             return dataJson
 
        } catch (error){
            if(error.message == "Unexpected end of JSON input"){
                let mensaje = "No hay contenido"
                return mensaje
            }
               
            console.log(`Hubo un error: ${error.message}`);
            return
        }

    }

    writeFile(producto){
        const ruta = `./${this.nameFile}.txt`

        try {

        
            fs.writeFileSync(ruta,JSON.stringify(producto, null, '\t'));
       
 
        } catch (error){
            console.log(`Hubo un error: ${error}`);
        }

    }
    

}

let productos = new creteFile('Productos');
let historialMensajes = new creteFile('historialMensajes');



httpServer.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
})



let todosLosProductos = productos.readFile();
let mensajes = historialMensajes.readFile();

// Conexión con Socket.io 
io.on('connection',socket => {
    socket.emit('productos',todosLosProductos);
    socket.emit('mensajes', mensajes);

    socket.on('new-producto', (data) => {

        let todosLosProductos = productos.readFile();

        if(data.Title == "" || data.Price == "" || data.Thumbnail == ""){
        alert("Completa todos los campos")
        return
        }

        data.id = todosLosProductos.length + 1
    
        todosLosProductos.push(data)
    
        productos.writeFile(todosLosProductos)

        todosLosProductos = productos.readFile();


        io.sockets.emit('productos', todosLosProductos);
    });

    socket.on('new-mensaje',(nuevoMensaje) => {

        let mensajes = historialMensajes.readFile();
        
                
                if(mensajes == "No hay contenido"){nuevoMensaje.id = 1
                } 
                else { nuevoMensaje.id = mensajes.length + 1 }
               
                
                // Obtener fecha y hora del msg
                let dataTime = new Date();
                let hoy = new Date(dataTime)
            
                let fecha = hoy.toLocaleDateString()
                let hora = hoy.toLocaleTimeString()
        
                let tiempoMensaje =  `${fecha} ${hora} `
        
                nuevoMensaje.dataTimeMensaje = tiempoMensaje
        
                if(mensajes == "No hay contenido"){
        
                    nuevoMensaje = [nuevoMensaje]
                    
                    historialMensajes.writeFile(nuevoMensaje)
        
                } else{
                    mensajes.push(nuevoMensaje)
            
                    historialMensajes.writeFile(mensajes)
                }
             
              
        
                mensajes = historialMensajes.readFile();
        
                
        
                io.sockets.emit('mensajes', mensajes);

    });


    socket.on('delete-product', (id) =>{
        let todosLosProductos = productos.readFile();

        todosLosProductos = todosLosProductos.filter((item) => item.id !== id);

        productos.writeFile(todosLosProductos)
        
        io.sockets.emit('productos', todosLosProductos);

    })


});





app.use(express.static("public"));



app.get('/',(req, res) => {

    console.log("Pagina regargada")

    let todosLosProductos = productos.readFile();
    let mensajes = historialMensajes.readFile();

    io.on('connection',socket => {
        socket.emit('productos',todosLosProductos);
        socket.emit('mensajes', mensajes);
    
    })
   
       res.redirect('/')
   
   
   })



