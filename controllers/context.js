const models = require('../models');
const readController = require('./read.js');
const cookieHelpers = require('./cookie-helpers');
const helpers = require('./context-helpers');

const controller = {
	createContext: (req, res) => {
		console.log(req.body);
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		let sessionObj;
		return models.ConnectSession
		.findOne({
			where: { sid: sentCookie }
		})
		.then((data) => {
			sessionObj = JSON.parse(data.dataValues.data);
			return models.Context
			.findOne({
				where: { name: req.body.name }
			})
		})
		.then(data => {
			if(!data) {
				return models.Context
				//obj destructuring doesn't work
				.create({
					name: req.body.name,
					UserId: sessionObj.userId
				})
			} else {
				readController.readTodos(req, res, null);
			}
		})
		.then((data) => {
			console.log(data.dataValues);
			readController.readTodos(req, res, null);
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

	renameContext: (req, res) => {
		console.log(req.body);
		const objToUpdate = { name: req.body.newName };
		const updateWhere = { id: req.body.contextToRename };
		const model = models.Context;
		helpers.putContexts(req, res, model, objToUpdate, updateWhere, 'rename');
	},
	changeContext: (req, res) => {
		console.log(req.body);
		const objToUpdate = { ContextId: req.body.newContext };
		const updateWhere = { ContextId: req.body.oldContext };
		const model = models.Item;
		helpers.putContexts(req, res, model, objToUpdate, updateWhere, 'change');
		//update all items with ContextId: req.body.newContext where contextid is equal to req.body.oldContext
	},
	deleteContext: (req, res) => {
		console.log(req.params);
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		return models.ConnectSession
		.findOne({
			where: { sid: sentCookie }
		})
		.then((data) => {
			if(data) {
				return models.Context
				.destroy({
					where: { id: req.params.id }
				})
			}
		})
		.then((data) => {
			console.log(data);
			if(data === 1) {
				console.log('context destroy successful');
				readController.readTodos(req, res);
			} else {
				console.log('context destroy unsuccessful');
				readController.readTodos(req, res);
			}
		})
		.catch((error) => {
			console.log('context destroy failed');
			throw error;
		})
	}
}

module.exports = controller;
