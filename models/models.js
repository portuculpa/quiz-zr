﻿try{
var path = require('path');
//EN WINDOWS... console.log(process.env);
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
//Trabajando en windows el archivo .env no genera variables de entorno, intento controlarlo para no estar pendiente en la subidas	
if(process.env.DATABASE_URL === undefined) process.env.DATABASE_URL="sqlite://:@:/";
if(process.env.DATABASE_STORAGE === undefined) 	process.env.DATABASE_STORAGE="quiz.sqlite";

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// exportar tablas
exports.Quiz = Quiz; 

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Quiz.bulkCreate( 
              [ 
               {tema: 'otro', pregunta: '¿ Capital de Italia ?',   respuesta: 'Roma'}, 
               {tema: 'otro', pregunta: '¿ Capital de Portugal ?',   respuesta: 'Lisboa'} 
              ]
            ).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
          };
        });
});
}
catch(err){
	console.log(err);
}