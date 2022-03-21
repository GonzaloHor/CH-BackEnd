const express = require('express')
const { Router } = express
const app = express()
const router = Router()
const fs = require('fs')



app.use('/', express.static(__dirname + '/views/index.pug'));



app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views','./views');
app.set('view engine', 'pug');



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


app.use('/', router)

app.listen(() => {
    try {
        console.log(`Servidor funcionando`)

    } catch (error){
        console.log(`Hubo un error: ${error}`);
    }
})

router.route('/productos')
    .get((req, res) => {
    
        let todosLosProductos = productos.readFile()

        

     
        res.render('productos.pug', {datos : todosLosProductos})
                             
                        
                        
    })
    .post((req, res) => {
 
        let todosLosProductos = productos.readFile();
    
        const producto = req.body

    
        producto.id = todosLosProductos.length + 1
    
        todosLosProductos.push(producto)
    
        productos.writeFile(todosLosProductos)

        
        res.redirect('/')
                                   
    })

    
router.route('/')
    .get((req, res) =>{
        res.render('index.pug')
    })

router.route('/:id')
    .get((req, res) => {
  
        const id = req.params.id
        let todosLosProductos = productos.readFile()
    
        let producto = todosLosProductos.find(e => e.id == id)
        if(producto == undefined) {
    
            producto = { error : 'producto no encontrado' } 
            res.send(producto) 
        }
    
        let nuevoObjeto = todosLosProductos.filter((e) => e.id !== producto.id)
        productos.writeFile(nuevoObjeto)

        
    
        res.redirect('/productos')
    
    })

app.listen(8080)
