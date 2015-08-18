//definicion del modelo de comment con validación

module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
		{
			texto: {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta texto comentario"}}
			},
			publicado: {
				type: DataTypes.BOOLEAN, 
				defaultValue: false
			}
		}
	);
}