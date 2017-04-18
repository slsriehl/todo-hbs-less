const models = require('../models');
readController = require('./read');
cookieHelpers = require('./cookie-helpers');

const controller = {
	createItem: (req, res) => {
		console.log(req.body);
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		const newItem = {
			name: req.body.item,
			description: req.body.description,
			ContextId: req.body.context,
			done: 0
		}
		console.log(newItem);
		return models.ConnectSession
		.findOne({ where: { sid: sentCookie } })
		.then((data) => {
			console.log(data);
			return models.Item
			.create(newItem)
		})
		.then((data) => {
			console.log(data);
			readController.readTodos(req, res);
		})
		.catch((error) => {
			console.log('fail create');
			throw error;
		});
	},
	//read items in the read controller
	updateItem: (req, res) => {
		console.log(req.body);
		if (!req.body.done) {
			req.body.done = false;
		} else {
			req.body.done = true;
		}
		console.log(req.body);
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		//send item id and doneness and other items
		return models.ConnectSession
		.findOne({ where: { sid: sentCookie } })
		.then((data) => {
			return models.Item
			.update(req.body, {
				where: { id: req.body.id }
			})
		})
		.then((data) => {
			console.log(data);
			dataStr = JSON.stringify(data);
			console.log(dataStr)
			if(dataStr === '[0]') {
				//if no item record was updated
				//send a flash message that the thing wasn't updated
				console.log('item not updated');
				readController.readTodos(req, res);
			} else if (dataStr === '[1]') {
				//if one item record was updated
				console.log('item successfully updated');
				readController.readTodos(req, res);
			} else {
				//more than one item record is updated, yikes!
				console.log('more than one item record was updated, oh snap!');
			}
		})
		.catch((error) => {
			console.log('update item failed');
			throw error;
		})
	},
	deleteItem: (req, res) => {
		console.log(req.params);
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		return models.ConnectSession
		.findOne({ where: { sid: sentCookie } })
		.then((data) => {
			return models.Item
			.destroy({ where: { id: req.params.id } })
		})
		.then((data) => {
			console.log(data);
			if(data === 1) {
				console.log('item destroy successful');
				readController.readTodos(req, res);
			} else {
				console.log('item destroy unsuccessful');
				readController.readTodos(req, res);
			}
		})
		.catch((error) => {
			console.log('item destroy failed');
			throw error;
		})
	}
}

module.exports = controller;
