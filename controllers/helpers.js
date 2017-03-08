
const models = require('../models');
const util = require('util');

const helpers = {
	updateUser: (req, res, objToUpdate) => {
		models.User.sync()
		.then(() => {
			//TODO: bcrypt the password here too
			return models.User
			.update({ objToUpdate }, {
				//TODO: object destructuring threw an error here, fix maybe?
				where: { email: req.body.email, password: req.body.password }
			})
			.then((data) => {
				console.log(`data in update user ${util.inspect(data)}`);
				//stringify the data object so that we can check the value to determine the message to send
				dataStr = JSON.stringify(data);
				console.log(dataStr)
				//user mods not saved
				if(dataStr === '[0]') {
					res.send(`Info not updated.  Try again.`);
					//user mods not saved
				} else if (dataStr === '[1]') {
					res.send(`You're golden!  Please use your new credentials to log in in the future.`);
				}
			});
		});
	}
}

module.exports = helpers;
