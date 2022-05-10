const mongoose = require('mongoose')

const mensajesCollection = "mensajes";

const mensajesSchema = new mongoose.Schema({

    author: {
        id: {type: String, required: true, max: 100},
        Nombre: {type: String, required: true, max: 100},
        Apellido: {type: String, required: true, max: 100},
        edad: {type: String, required: true, max: 100},
        alias: {type: String, required: true, max: 100},
        avatar: {type: String, required: true, max: 100},
    },
    text: {type: String, required: true, max: 100},
});

const Mensajes = mongoose.model(mensajesCollection, mensajesSchema);

module.exports = Mensajes;