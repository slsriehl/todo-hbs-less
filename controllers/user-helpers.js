
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
				where: { email: req.body.email }
			})
			.then((data) => {
				console.log(data.dataValues);
				const hash = helpers.getHash(req.body.password, data.dataValues.password);
				console.log(hash);
				if(hash) {
					return models.User
					.update(objToUpdate, {
						//TODO: object destructuring threw an error here, fix maybe?
						where: { email: req.body.email }
					})
					.then((result) => {
						console.log(`result in update user ${util.inspect(result)}`);
						//stringify the data object so that we can check the value to determine the message to send
						dataStr = JSON.stringify(result);
						console.log(dataStr)
						//user mods not saved
						if(dataStr === '[0]') {
							res.send(`Info not updated.  Try again.`);
							//user mods not saved
						} else if (dataStr === '[1]') {
							res.send(`You're golden!  Please use your new credentials to log in in the future.`);
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
	}
}

module.exports = helpers;
