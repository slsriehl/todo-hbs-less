const models = require('../models');
const util = require('util');
const helpers = require('./read-helpers');

const controller = {
	readTodos: (req, res, cookie) => {
		//use cookie to locate session
		if(req.body.cookie) {
			return models.ConnectSession.findOne({
				where: { sid: req.body.cookie }
			})
			.then(data => {
				console.log(data);
				//parse the data object from the ConnectSessions table
				helpers.lookupTodos(req, res, data);
			})
			.catch((error) => {
				console.log('cookie present but no page returned');
				throw error;
			})
		} else if(cookie === req.session.id) {
			helpers.lookupTodos(req, res, null);
		}
	}
}

module.exports = controller;
