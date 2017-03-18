
const models = require('../models');
const bcrypt = require('bcryptjs');
const util = require('util');

const helpers = {
	updateUser: (req, res, objToUpdate) => {
		models.User.sync()
		.then(() => {
			//TODO: bcrypt the password here too
			return models.User
			.findOne({
				where: { email: req.session.email }
			})
			.then((data) => {
				console.log(data.dataValues);
				const hash = helpers.getHash(req.body.password, data.dataValues.password);
				console.log(hash);
				if(hash) {
					models.User.sync()
					.then(() => {
						return models.User
						.update(objToUpdate, {
							//TODO: object destructuring threw an error here, fix maybe?
							where: { email: req.session.email }
						})
						.then((result) => {
							console.log(`result in update user ${util.inspect(result)}`);
							//stringify the data object so that we can check the value to determine the message to send
							dataStr = JSON.stringify(result);
							console.log(dataStr)
							//user mods not saved
							if(dataStr === '[0]') {
								helpers.sessionMessage(req, res, `Info not updated.  Try again.`, 'settings.hbs');
								//user mods not saved
							} else if (dataStr === '[1]') {
								if(req.body.newEmail) {
									req.session.email = req.body.newEmail;
								}
								helpers.sessionMessage(req, res, `You're golden!  Please use your new credentials to login in the future.`, 'settings.hbs');
							}
						});
					})
					.catch((error) => {
						helpers.sessionMessage(req, res, `Info not updated.  Try again.`, 'settings.hbs');
					})
				} else {
					helpers.sessionMessage(req, res, `Your current password doesn't match our records.`, 'settings.hbs');
				}
			})

		});
	},
	//bcrypt save password
	setHash: (password) => {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt);
	},
	//bcrypt retrieve password
	getHash: (password, hash) => {
		return bcrypt.compareSync(password, hash);
	},
	saveSession: function(req, res, data) {
    req.session.email = data.dataValues.email;
    req.session.cookie.expires = 1000 * 60 * 60 * 24 * 3;
    req.session.save();
  },
	sessionMessage: (req, res, message, render) => {
		req.session.message = message;
		req.session.save();
		res.render(render, {data: req.session.message, email: req.session.email});
	},
}

module.exports = helpers;
