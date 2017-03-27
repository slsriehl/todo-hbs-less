const models = require('../models');
readController = require('./read')

const controller = {
	createItem: (req, res) => {
		console.log(req.body);
		const newItem = {
			name: req.body.name,
			description: req.body.description,
			ContextId: parseInt(req.body.context),
			done: 0
		}
		models.Item.sync()
		.then(() => {
			return models.Item
			.create(newItem)
			.then((data) => {
				console.log(data);
				readController.readTodos(req, res);
			})
			.catch((error) => {
				console.log('fail create');
				throw error;
			})
		})
		.catch((error) => {
			console.log('fail syncing');
			throw error;
		});
	},
	//read items in the read controller
	updateItem: (req, res) => {

	},
	deleteItem: (req, res) => {

	}
}

module.exports = controller;
