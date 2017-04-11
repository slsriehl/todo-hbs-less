const models = require('../models');
const util = require('util');
const helpers = require('./read-helpers');

const controller = {
	readTodos: (req, res, cookie) => {
		//use cookie to locate session
		if(req.headers.clientcookie) {
			return models.ConnectSession
			.findOne({
				where: { sid: req.headers.clientcookie }
			})
			.then(data => {
				console.log(data);
				//parse the data object from the ConnectSessions table
				helpers.lookupTodos(req, res, data);
			})
			.catch((error) => {
				console.log('cookie present but no page returned');
				throw error;
				res.render('login.hbs');
			})
		} else if(cookie === req.session.id) {
			helpers.lookupTodos(req, res, null);
		}
	},
	editItemModal: (req, res) => {
		console.log(req.params.id);
		return models.ConnectSession
		.findOne({
			where: { sid: req.headers.clientcookie }
		})
		.then(data => {
			console.log(data);
			helpers.lookupEdits(req, res, data);
		})
		.catch(error => {
			console.log('cookie present but no page returned');
			throw error;
			res.render('login.hbs');
		});
	}
}

module.exports = controller;
