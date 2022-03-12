const express = require('express')
const { Router } = express
const app = express()
const router = Router()
const fs = require('fs')

app.use('/inicio', express.static(__dirname + '/public'));


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
            console.log(`Hubo un error: ${error}`);
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


app.use('/api/productos', router)

app.listen(() => {
    try {
        console.log(`Servidor funcionando`)

    } catch (error){
        console.log(`Hubo un error: ${error}`);
    }
})

app.route('/')
    .get((req, res) => {
    
        let todosLosProductos = productos.readFile()
        
        res.send(todosLosProductos) 
                        
                        
    })
    .post((req, res) => {
 
        let todosLosProductos = productos.readFile();
    
        const producto = req.body
    
        producto.id = todosLosProductos.length + 1
    
        todosLosProductos.push(producto)
    
        productos.writeFile(todosLosProductos)
    
        
        res.send(producto) 
                                   
    })

    
app.route('/:id')
    .get((req, res) => {

        let id = req.params.id
        
        let todosLosProductos = productos.readFile()
        
        let producto = todosLosProductos.find(e => e.id == id)


        if(producto == undefined) {producto = { error : 'producto no encontrado' }}
                        
        res.send(producto)                
    })
    .put((req, res) => {
 
        const id = req.params.id
        const nuevoProducto = req.body
    
        
        let todosLosProductos = productos.readFile()
        
        let producto = todosLosProductos.find(e => e.id == id)
        if(producto == undefined) {
    
            producto = { error : 'producto no encontrado' } 
            res.send(producto) 
        }
    
        nuevoProducto.id = producto.id
    
        let nuevoObjeto = todosLosProductos.filter((e) => e.id !== producto.id)
        nuevoObjeto.push(nuevoProducto)
      
        productos.writeFile(nuevoObjeto)
    
        res.send(`Producto actualizado correctamente`) 
    
    
    })
    .delete((req, res) => {
    
    
        const id = req.params.id
        let todosLosProductos = productos.readFile()
    
        let producto = todosLosProductos.find(e => e.id == id)
        if(producto == undefined) {
    
            producto = { error : 'producto no encontrado' } 
            res.send(producto) 
        }
    
        let nuevoObjeto = todosLosProductos.filter((e) => e.id !== producto.id)
        productos.writeFile(nuevoObjeto)
    
        res.send(`Producto eliminado correctamente`) 
    
    
    })





app.listen(8080)
