const { optionsSqlite } = require('./options/SQLite3')
const knex = require('knex')(optionsSqlite);



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