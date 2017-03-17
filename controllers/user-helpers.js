
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
							req.session.message = `Info not updated.  Try again.`;
							req.session.save();
							res.render('settings.hbs', {data: req.session.message, email: req.session.email});
							//user mods not saved
						} else if (dataStr === '[1]') {
							req.session.message = `You're golden!  Please use your new credentials to log in in the future.`;
							if(req.body.newEmail) {
								req.session.email = req.body.newEmail;
							}
							req.session.save();
							res.render('settings.hbs', {data: req.session.message, email: req.session.email});
						}
					});
				} else {
					res.send(`Your current password doesn't match our records.`);
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
	loginFail: (req, res) => {
		req.session.message = `Sorry, your credentials don't match any users.  Please check them and try again.`;
		res.render('login.hbs', {data: req.session.message});
	}
}

module.exports = helpers;
