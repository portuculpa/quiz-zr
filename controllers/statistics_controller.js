var models = require ('../models/models.js');
var Sequelize = require('sequelize');

//statistics - factoriza el codigo si la ruta incluiye quizId
exports.statistics = function(req, res, next) {



	//numero de preguntas
	models.Quiz.count().then(function (count) {
		var statistics = {};
		statistics.nquizes = count;
		models.Comment.count().then(function (count) {
			statistics.ncomments = count;
			models.Quiz.count({
			    include: [{
			    	required: true,
			        model: models.Comment
			    }]
			}).then(function (count) {
				statistics.nquizWithComments = count;
				res.render("quizes/statistics",{statistics: statistics});
			}).catch(function (error){
				next (error);
			})
		}).catch(function (error){
			next (error);
		})
	}).catch(function (error){
		next (error);
	})

}

