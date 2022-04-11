const express = require('express')
const { Router } = express
const app = express()
const { options } = require('./options/mariaDB.js')
const { optionsSqlite } = require('./options/SQLite3')

const knex = require('knex')(options);
const knexSqlite = require('knex')(optionsSqlite);




const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { getCipherInfo } = require('crypto');

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


app.use(express.json())
app.use(express.urlencoded({extended: true}))







httpServer.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
})

const getProducts = async () => {

    const data = await knex('products')
    const dataMensajes = await knex('mensajes')



    io.sockets.emit('productos', data);
    io.sockets.emit('mensajes', dataMensajes);

    
  }






// Conexión con Socket.io 
io.on('connection',socket => {
    
    getProducts()
    // socket.emit('mensajes', mensajes);

    socket.on('new-producto', (data) => {


            if(data.Title == "" || data.Price == "" || data.Thumbnail == ""){
            console.log("Completa todos los campos")
            return
            }

            
        
            knex('products').insert(data)
            .then(()=> console.log('Producto Agregado'))
            .catch((err)=> { console.log(err); throw err})
            .finally(()=>{
                knex.destroy();
                })

            
            getProducts()
            
    });

    socket.on('new-mensaje',(nuevoMensaje) => {

        
                
            
                
                // Obtener fecha y hora del msg
                let dataTime = new Date();
                let hoy = new Date(dataTime)
            
                let fecha = hoy.toLocaleDateString()
                let hora = hoy.toLocaleTimeString()
        
                let tiempoMensaje =  `${fecha} ${hora} `
        
                nuevoMensaje.dataTimeMensaje = tiempoMensaje
        
                
        
                    knex('mensajes').insert(nuevoMensaje)
                    .then(()=> console.log('Mensaje Agregado'))
                    .catch((err)=> { console.log(err); throw err})
                    .finally(()=>{
                        knex.destroy();
                        })
              
            
                
        
                        getProducts()
    });


    socket.on('delete-product', (id) =>{

        knex('products')
        .where({ id: id })
        .del()
        .then(()=> console.log('Producto Eliminado'))
        .catch((err)=> { console.log(err); throw err})
        
        getProducts()


    })


});





app.use(express.static("public"));




