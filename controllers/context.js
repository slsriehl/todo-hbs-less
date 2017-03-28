const models = require('../models');
const readController = require('./read.js');

const controller = {
	createContext: (req, res) => {
		console.log(req.body);
		return models.Context
		//obj destructuring doesn't work
		.create({name: req.body.name, UserId: req.session.userId})
		.then((data) => {
			console.log(data.dataValues);
			readController.readTodos(req, res);
		})
		.catch((error) => {
			console.log("create function failed");
			throw error;
		});
	},

	addInitialContexts: (req, res, cookie) => {
		return models.Context
		.bulkCreate([{
			name: 'Home',
			UserId: req.session.userId
		}, {
			name: 'Work',
			UserId: req.session.userId
		}, {
			name: 'Phone',
			UserId: req.session.userId
		}, {
			name: 'Computer',
			UserId: req.session.userId
		}])
		.then(function(data) {
			readController.readTodos(req, res, cookie);
		})
		.catch((error) => {
			console.log('context bulk create failed');
			throw error;
		})
	},

	updateContext: (req, res) => {

	},
	deleteContext: (req, res) => {

	}
}

module.exports = controller;
