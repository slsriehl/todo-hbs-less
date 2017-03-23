const models = require('../models');


const controller = {
	createContext: (req, res) => {
		console.log(req.body);
		models.Context.sync()
		.then(() => {
			return models.Context
			//obj destructuring doesn't work
			.create({name: req.body.name})
			.then((data) => {
				console.log(data.dataValues);
				res.redirect('/context');
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
	readContexts: (req, res) => {
		models.Context.sync()
		.then(() => {
			return models.Context
			.findAll({})
			.then((data) => {
				console.log(data);
				let contextObj;
				let contexts = [];
				for(let obj of data) {
					contextObj = {id, name} = obj.dataValues
					contexts.push(contextObj);
				}
				res.render('todos.hbs', {contexts, data: req.session.message, layout: false});
			})
			.catch((error) => {
				console.log('find all contexts failed');
				throw error;
			});
		})
		.catch((error) => {
			console.log('read contexts sync failed');
			throw error;
		});
	},
	createItem: (req, res) => {

	},
	readItems: (req, res) => {

	},
	updateItem: (req, res) => {

	},
	deleteItem: (req, res) => {

	}
}

module.exports = controller;
