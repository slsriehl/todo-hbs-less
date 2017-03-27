const models = require('../models');
const readController = require('./read.js');

const controller = {
	createContext: (req, res) => {
		console.log(req.body);
		models.Context.sync()
		.then(() => {
			return models.Context
			//obj destructuring doesn't work
			.create({name: req.body.name, UserId: req.session.userId})
			.then((data) => {
				console.log(data.dataValues);
				controller.readContexts(req, res);
			})
			.catch((error) => {
				console.log("create function failed");
				throw error;
			});
		})
		.catch((error) => {
			console.log("context model didn't sync");
			throw error;
		});
	},

	addInitialContexts: (req, res) => {
		models.Context.sync()
		.then(() => {
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
				controller.readContexts(req, res);
			});
		})
		.catch((error) => {
			console.log('context model sync or bulk create failed');
			throw error;
		})
	},

	updateContext: (req, res) => {

	},
	deleteContext: (req, res) => {

	}
}

module.exports = controller;
