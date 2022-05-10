const express = require('express')
const { Router } = express
const app = express()
const { options } = require('./options/mariaDB.js')
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose')
const MongoMensajes = require('./src/ContenedorMogoDB.js')



const knex = require('knex')(options);




const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { application } = require('express');

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.set('view engine', 'hbs');








httpServer.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
})

const getProducts = async () => {

    const data = await knex('products')

    const dataMensajes = await knex('mensajes')


    mongoose.connect("mongodb://localhost:27017/mensajes", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });


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
    


                const mensajeMongo = new MongoMensajes();
                const respuesta = mensajeMongo.guardarNuevoMensaje(nuevoMensaje);
                       
                        
                        
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


app.get('/api/productos-test', (req, res) => {


    let usarios = [];



    for(i= 0;i < 5;i++){
        let dato = {
            Nombre: faker.commerce.product(),
            Precio: faker.commerce.price(),
            Imagen: faker.image.imageUrl()
        }

        usarios.push(dato)
    }

    







    res.render('nuevo', {usarios})

})






