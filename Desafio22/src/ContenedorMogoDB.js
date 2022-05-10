const mongoose = require('mongoose')
const Mensajes = require('./models/mensajes.js')




class ContenedorMongo {
  constructor(collection) {
    this.collection = collection
  }

  

  async guardarNuevoMensaje(mensaje) {

      try {
        mongoose.connect("mongodb://localhost:27017/mensajes", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });


        

          const mensajeNuevo = new Mensajes(mensaje);
          await mensajeNuevo.save();


        



    } catch (error) {
      throw new Error(`Error al guardar: ${error}`)
    }
  }

  
}


class MongoMensajes extends ContenedorMongo {
  constructor() {
    super('Mensajes')
  }


}

module.exports = MongoMensajes;
