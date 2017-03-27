const models = require('../models');
util = require('util');

const controller = {
	readTodos: (req, res) => {
		console.log(req.params);
		//use cookie to locate session
		return models.ConnectSession.findOne({
			where: { sid: req.params.cookie }
		})
		.then(data => {
			console.log(data);
			//parse the data object from the ConnectSessions table
			const userIdObj = JSON.parse(data.dataValues.data);
			const userId = userIdObj.userId;
			//do the join to get the nested object of the user's contexts and items
			return models.User.findOne({
				where: { id: userId },
				include: [{
					model: models.Context,
					include: [{
						model: models.Item
					}]
				}]
			})
		})
		.then(user => {
			console.log(util.inspect(user.dataValues.Contexts[0].Items));
			const userContextItem = Object.assign({}, {
				userId: user.dataValues.id,
				user: user.dataValues.email,
				contexts: user.dataValues.Contexts.map(context => {
					return Object.assign({}, {
						contextId: context.dataValues.id,
						contextName: context.dataValues.name,
						items: context.dataValues.Items.map(items => {
							return Object.assign({}, {
								itemId: items.dataValues.id,
								itemName: items.dataValues.name,
								doneness: items.dataValues.done,
								description: items.dataValues.description
							});
						})
					});
				})
			})
			res.render('todos.hbs', {userContextItem, layout: false});
		})
		.catch((error) => {
			console.log('join failed');
			throw error;
		});
	}
}

module.exports = controller;
