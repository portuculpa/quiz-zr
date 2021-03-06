// definicion del modelo de quiz

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Quiz',
		{ 
			pregunta: {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta pregunta"}}
			},
		  	respuesta: {
		  		type: DataTypes.STRING,
		  		validate: {notEmpty: {msg: "-> Falta respuesta"}}
			},
			tematica: {
		  		type: DataTypes.STRING,
		  		validate: {notEmpty: {msg: "-> Falta temática"}}
			}
		}
	);
}