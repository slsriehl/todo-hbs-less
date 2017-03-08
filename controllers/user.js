const models = require('../models');
const helpers = require('./helpers');

const util = require('util');

//TODO: res.render partials and different template inputs at the same time,
//from the same res.render

const controller = {
	//save a new user to the db
	signupUser: (req, res) => {
		//body elements are email and password
		console.log(req.body);
		//sync models and save user to the Users table
		models.User.sync()
		.then(() => {
			return models.User
				.create({ email, password } = req.body)
				.then((data) => {
					//TODO: add cookies and login user on signup. sessions?
					if(data) {
						res.send('Signup successful!  Start saving to-dos now.');
					} else if(!data) {
						res.send('signup not successful.');
					}
					console.log(`data from user save ${util.inspect(data)}`);
				});
		});

	},
	//login a user by authenticating login info against the DB
	loginUser: (req, res) => {
		//body elements are email and password
		console.log(req.body);
		//sync models and authenticate user against the Users table
		//TODO: bcrypt password and store the hash
		//TODO: only retrieve the email and not whole user object
		models.User.sync()
		.then(() => {
			return models.User
				.findOne({
					//obj destructing doesn't work.
					where:{ email: req.body.email, password: req.body.password }
				})
				.then((data) => {
					//TODO: send a cookie instead of the data on login. sessions?
					if(!data) {
						res.send(`Sorry, your credentials don't match any users.  Please check them and try again.`);
					} else {
						res.json(data);
					}
				});
		});
	},
	updateUser: (req, res) => {
		//the user will provide either a new password or a new email to update their account
		console.log(req.body);
		if(req.body.newPassword) {
			//pass the new password to the helper function to change it
			const objToUpdate = { password: req.body.newPassword };
			helpers.updateUser(req, res, objToUpdate);
		} else if(req.body.newEmail) {
			//pass the new email to the helper function to change it
			const objToUpdate = { email: req.body.newEmail };
			helpers.updateUser(req, res, objToUpdate);
		} else {
			res.send('Please check the data you were trying to change and send it again.')
		}
	},
	deleteUser: (req, res) => {
		console.log(req.body);
		models.User.sync()
		.then(() => {
			return models.User
			.destroy({
				//object destructuring doesn't work here either. pooh!
				where: { email: req.body.email, password: req.body.password }
			})
			.then((data) => {
				console.log(`data ${util.inspect(data)}`);
				console.log(typeof data);
				if(data === 0) {
					res.send(`Sorry, your account wasn't deleted.  Please check your credentials and try again.`);
				} else if(data === 1) {
					res.send('Your account and all your to-dos were successfully deleted.');
				}
			});
		});
	}
}




module.exports = controller;
