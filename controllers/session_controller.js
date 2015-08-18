

//MW de autorizacion de accesos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	}else{
		res.redirect('/login');
	}
};

// GET /login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
}

//POST /login
exports.create = function(req, res) {

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){
		if (error) {
			req.session.errors = [{"message": "Se ha producido un error: "+error}];
			res.redirect("/login");
			return;
		}

		//crear req.session.user y guardar campos id y username
		//la sesion se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username:user.username};

		res.redirect(req.session.redir.toString()); //redireccion a la pagina anterior a login
	})

}


//GET (DELETE) /logout
exports.destroy = function(req, res) {

	delete req.session.user;
	if (req.query.auto){
	    res.render('message', {
	    	message: 'Sesion caducada. Ha excedido el tiempo de inactividad'
	    });
	}else{
		res.redirect(req.session.redir.toString()); //redireccion a la pagina anterior a logout
	}
}

