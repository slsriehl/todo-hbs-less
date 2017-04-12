const models = require('../models');

const helpers = {
	putContexts: (req, res, model, objToUpdate, updateWhere, action) => {
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		return models.ConnectSession
		.findOne({
			where: { sid: sentCookie }
		})
		.then(data => {
			if(data) {
				return model
				.update(objToUpdate, {
					where: updateWhere
				})
			}
		})
		.then(result => {
			let dataStr = JSON.stringify(result);
			console.log(dataStr);
			if(dataStr === '[0]') {
				req.session.message = `Sorry, your context ${action} failed.  Please try again.`;
			}
			readController.readTodos(req, res, null);
		})
		.catch(error => {
			console.log(`context ${action} error.`);
			throw error;
		});
	},
}

module.exports = helpers;
