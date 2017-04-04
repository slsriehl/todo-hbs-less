const models = require('../models');
const util = require('util');

const helpers = {
	lookupTodos: (req, res, data) => {
		let userId;
		if(data) {
			const userIdObj = JSON.parse(data.dataValues.data);
			userId = userIdObj.userId;
		} else {
			userId = req.session.userId;
		}
		//do the join to get the nested object of the user's contexts and items
		if(userId) {

			return models.User.findOne({
				where: { id: userId },
				include: [{
					model: models.Context,
					include: [{
						model: models.Item
					}]
				}]
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
				});
				res.render('todos.hbs', {userContextItem, layout: false});
			})
			.catch((error) => {
				console.log('join failed');
				throw error;
			});
		} else {
			res.render('login.hbs');
		}
	},
}

module.exports = helpers;
