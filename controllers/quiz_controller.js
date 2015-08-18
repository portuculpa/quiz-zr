var models = require ('../models/models.js');

//Autoload - factoriza el codigo si la ruta incluiye quizId
exports.load = function(req, res, next, quizId) {

	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(function (quiz) {
		if (quiz){
			req.quiz = quiz;
			next();
		}else{
			next(new Error("No existe quizId = " + quizId));
		}
	}).catch(function (error){
		next (error);
	})
}

// GET /quizes
exports.index = function(req, res) {
	var query = {order: "pregunta"};
	if (req.query.search){
		var search ="%"+req.query.search.replace(/\s+/, '%')+"%";
		query.where = ["pregunta like ?", search];
	}
	
	models.Quiz.findAll(query)
		.then(function(quizes){
			res.render('quizes/index', {quizes: quizes});
		})
		.catch(function (error){
			next(error);
		})

};

// GET /quizes/:id
exports.show = function(req, res) {
	console.log('show');
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	console.log('answer');
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado });
};


// GET /quizes/new
exports.new = function(req, res) {

	var quiz = models.Quiz.build({
		pregunta: "Pregunta",
		respuesta: "Respuesta",
		tematica: "otro"
	});

	res.render('quizes/new', {quiz: quiz});

};


//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) {
		if (err){
			res.render("quizes/new",{quiz: quiz, errors: err.errors});
		} else {
			quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
				res.redirect('/quizes');
			});
		}
	});
}

// GET /quizes/edit
exports.edit = function(req, res) {

	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz});

};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

	req.quiz.validate().then(function(err) {
		if (err){
			res.render("quizes/edit",{quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
				res.redirect('/quizes');
			});
		}
	});

}


// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){
		next(error);
	});
}