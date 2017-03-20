const models = require('../models');
const helpers = require('./user-helpers');

const util = require('util');


const controller = {
	//when the root route loads, check the cookie against the session store
	// and load the signin page or the todo page accordingly
	// solved this problem with a landing page that sends cookie based on presence
	// of h2 dom element
	land: (req, res) => {
		console.log(`this is req.params.cookie ${req.params.cookie}`);
		//search the session store for the user's cookie
		models.ConnectSession.sync()
		.then(() => {
			return models.ConnectSession
			.findOne({
				where: { sid: req.params.cookie }
			})
			//render todo or login page depending on login status from cookie check
			.then((data) => {
				console.log(`data.dataValues ${data.dataValues}`);
				res.render('todos.hbs');
			});
		})
		//in case the cookie check fails, redirect user to login page
		.catch((error) => {
			console.log(error);
			res.render('login.hbs');
		})

	},

	//save a new user to the db
	signupUser: (req, res) => {
		//body elements are email and password
		console.log(req.body);
		//sync models and save user to the Users table
		//hash password
		const hash = helpers.setHash(req.body.password);
		console.log(hash);
		//create new user to save
		const newUser = {
			email: req.body.email,
			password: hash
		}
		//sequelize call to save user
		models.User.sync()
		.then(() => {
			return models.User
			.create(newUser)
			.then((data) => {
				//if signup succeeds, save session, send cookie in header, and render
				//the todo page
					req.session.message = 'Signup successful!  Start saving to-dos now.';
					helpers.saveSession(req, res, data);
					res.header('Cookie', req.session.id);
					res.render('todos.hbs', {data: req.session.message});
				//console.log(`data from user save ${util.inspect(data)}`);
			});
		})
		//if there's some error with the sequelize call,
		//render the signup page again with a fail message
		.catch((error) => {
			helpers.sessionMessage(req, res, `Signup not successful.`, 'signup.hbs');
		});

	},
	//login a user by authenticating login info against the DB
	loginUser: (req, res) => {
		//body elements are email and password
		console.log(req.body);
		//sequelize call to authenticate user against the Users table
		models.User.sync()
		.then(() => {
			return models.User
			.findOne({
				//obj destructing doesn't work.
				where: { email: req.body.email }
			})
			.then((data) => {
				//console.log(`data ${util.inspect(data)}`);
				//sequelize call succeeded
				//compare stored hash to password sent in post request
				const hash = helpers.getHash(req.body.password, data.dataValues.password);
				//if the password matches, send cookie in header and
				//render todo page with the session success message
				if(hash) {
					req.session.message = `You have successfully logged in.`;
					helpers.saveSession(req, res, data);
					res.header('Cookie', req.session.id);
					res.render('todos.hbs', {data: req.session.message});
				} else {
					//if there's data but the hash doesn't match the entered password
					helpers.sessionMessage(req, res, `Sorry, your credentials don't match any users.  Please check them and try again.`, 'login.hbs');
				}
			});
		})
		//if the sequelize call fails
		.catch((error) => {
			console.log(error);
			helpers.sessionMessage(req, res, `Sorry, your credentials don't match any users.  Please check them and try again.`, 'login.hbs');
		});
	},
	//delete the session object on logout and render the login page
	logoutUser: (req, res) => {
		console.log(req.body);
		req.session.destroy();
		res.render('login.hbs');
		//
	},
	//display settings page
	userSettings: (req, res) => {
		console.log(req.params);
		//query the session store for the user's session
		//to display their email address on the settings page
		models.ConnectSession.sync()
		.then(() => {
			return models.ConnectSession
			.findOne({
				where: { sid: req.params.cookie }
			})
			.then((data) => {
				console.log(data.dataValues);
				//the data in the session store is saved as a string,
				//so parse it into an object
				sessionObj = JSON.parse(data.dataValues.data);
				console.log(sessionObj.email);
				//render email on settings page
				res.render('settings.hbs', {email: sessionObj.email});
			});
		})
		//if the call to the session store fails
		.catch((error) => {
			console.log(error);
			helpers.sessionMessage(req, res, `Sorry, your credentials don't match any users.  Please check them and try again.`, 'login.hbs');
		});

	},
	//change user login info in the Users table
	updateUser: (req, res) => {
		//the user will provide either a new password or a new email, or both,
		//to update their account
		//they must send their current password to authorize them to change the data
		console.log(req.body);
		//if they send both
		if(req.body.newPassword && req.body.newEmail) {
			const hash = helpers.setHash(req.body.newPassword)
			const objToUpdate = { password: hash, email: req.body.newEmail };
			helpers.updateUser(req, res, objToUpdate);
		} else if(req.body.newPassword) {
			//if they just change the password,
			//pass the new password to the helper function to change the stored hash
			const hash = helpers.setHash(req.body.newPassword)
			const objToUpdate = { password: hash };
			helpers.updateUser(req, res, objToUpdate);
		} else if(req.body.newEmail) {
			//if they just change the email
			//pass the new email to the helper function to change the stored address
			const objToUpdate = { email: req.body.newEmail };
			helpers.updateUser(req, res, objToUpdate);
		} else {
			//if neither a new password nor a new email is received
			helpers.settingsSessMessage(req, res, 'Please check the data you were trying to change and send it again.', null, null);
		}
	},
	//to delete the user and all her todos in the db
	deleteUser: (req, res) => {
		console.log(`req.body ${util.inspect(req.body)}`);
		//sync the users table
		models.User.sync()
		.then(() => {
			//query the session store for the user's email address based on the
			//cookie stored on the client side
			return models.ConnectSession
			.findOne({
				where: { sid: req.body.cookie }
			})
			.then((data) => {
				//if the cookie is found
				console.log(`found session? ${util.inspect(data.data)}`);
				//parse the string in the session data column to an object
				const emailObj = JSON.parse(data.data);
				//query the Users table for the user stored in the session
				//if the user is found
				console.log(`found user? ${util.inspect(emailObj)}`);
				const hash = helpers.getHash(req.body.password, emailObj.password);
				//if the password sent to authorize delete matches the stored hash
				if(hash) {
					console.log('password is correct');
					//delete the User and cascade delete all her todos
					return models.User
					.destroy({
						//object destructuring doesn't work here either. pooh!
						where: { email: emailObj.email }
					})
					.then((data) => {
						//if a response is received from deleting the user
						//console.log(`data ${util.inspect(data)}`);
						//console.log(typeof data);
						if(data === 0) {
						//the user wasn't deleted
							helpers.sessionMessage(req, res, `Sorry, your account wasn't deleted.  Please check your credentials and try again.`, 'login.hbs');
						} else if(data === 1) {
							//the user was deleted so delete her session as well
							req.session.destroy();
							res.render('login.hbs', {data: 'Your account and all your to-dos were successfully deleted.'});
						}
					})
					.catch((error) => {
						//no data was received from deleting the user
						console.log('error, destroy user call failed');
						throw error;
					});
				} else {
					//if the password sent to authorize the user delete
					//doesn't match the stored hash
					helpers.sessionMessage(req, res, 'Your password is incorrect.  Please try again.', 'login.hbs');
			})
			.catch((error) => {
				//if the client side cookie is not found in the session store
				console.log(`error, find session call failed.`);
				throw error;
			});
		})
		.catch((error) => {
			//send message to render to the login page if any of the steps fail
			//render the login page because who knows how far the user got into the
			//delete process.  logging in again will fail if the user was
			//actually deleted.
			helpers.sessionMessage(req, res, 'Error deleting your account.  Please login again.', 'login.hbs');
			throw error;
		});
	}
}




module.exports = controller;
