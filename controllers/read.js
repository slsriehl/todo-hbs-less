const models = require('../models');
const util = require('util');
const helpers = require('./read-helpers');
const cookieHelpers = require('./cookie-helpers');

const controller = {
	readTodos: (req, res, cookie, message) => {
		//use cookie to locate session
		console.log(req.headers);
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		if(sentCookie) {
			helpers.findSession(sentCookie)
			.then(data => {
				console.log(data);
				//parse the data object from the ConnectSessions table
				helpers.lookupTodos(req, res, data, message);
			})
			.catch((error) => {
				console.log('cookie present but no page returned');
				throw error;
				res.render('login.hbs', {data: message, layout: false});
			})
		} else if(cookie === req.session.id) {
			helpers.lookupTodos(req, res, null, message);
		}
	},
	editItemModal: (req, res) => {
		console.log(req.params.id);
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		helpers.findSession(sentCookie)
		.then(data => {
			console.log(data);
			helpers.lookupEdits(req, res, data);
		})
		.catch(error => {
			console.log('cookie present but no page returned');
			throw error;
			res.render('login.hbs');
		});
	},
	editContextModal: (req, res) => {
		res.render('edit-context-modal.hbs', {layout: false});
	},
	getRenameContext: (req, res) => {
		helpers.getContextModals(req, res, 'context-rename.hbs');
	},
	getChangeContext: (req, res) => {
		helpers.getContextModals(req, res, 'context-change.hbs');
	},
	getDeleteContext: (req, res) => {
		helpers.getContextModals(req, res, 'context-delete.hbs');
	},
	addItemModal: (req, res) => {
		helpers.getContextModals(req, res, 'add-item-modal.hbs');
	}
}

module.exports = controller;
