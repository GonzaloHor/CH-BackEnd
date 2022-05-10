const { options } = require('./options/mariaDB.js')
const knex = require('knex')(options);



knex.schema.createTable('mensajes',table =>{
    table.increments('id')
    table.string('Email')
    table.integer('Mensaje')
    table.string('dataTimeMensaje')

})
.then(()=> console.log('Tabla Creada'))
.catch((err)=> { console.log(err); throw err})
.finally(()=>{
    knex.destroy();
})

