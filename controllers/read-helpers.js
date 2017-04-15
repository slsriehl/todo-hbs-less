const models = require('../models');
const util = require('util');

const helpers = {
	lookupTodos: (req, res, data, message) => {
		let userId;
		if(data) {
			const userIdObj = JSON.parse(data.dataValues.data);
			userId = userIdObj.userId;
		} else {
			userId = req.session.userId;
		}
		//do the join to get the nested object of the user's contexts and items
		if(userId) {

			helpers.findAllOfThem(userId)
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
				if(message) {
					res.render('todos.hbs', {data: message, userContextItem, layout: false});
				} else {
					res.render('todos.hbs', {userContextItem, layout: false});
				}
			})
			.catch((error) => {
				console.log('join failed');
				throw error;
			});
		} else {
			res.render('login.hbs', {data: message, layout: false});
		}
	},
	lookupEdits: (req, res, data) => {
		const userIdObj = JSON.parse(data.dataValues.data);
		const userId = userIdObj.userId;
		helpers.findAllOfThem(userId)
		.then(user => {
			console.log(user.dataValues.Contexts);
			let userContexts, editItemObj;
			let userContextArr = [];
			for(let i in user.dataValues.Contexts) {
				for(let j in user.dataValues.Contexts[i].Items) {
				 	if(user.dataValues.Contexts[i].Items[j].id === req.params.id) {
						editItemObj = Object.assign({}, {
							itemId: user.dataValues.Contexts[i].Items[j].id,
							itemName: user.dataValues.Contexts[i].Items[j].name,
							doneness: user.dataValues.Contexts[i].Items[j].done,
							description: user.dataValues.Contexts[i].Items[j].description,
							itemContextId: user.dataValues.Contexts[i].dataValues.id,
							itemContextName: user.dataValues.Contexts[i].dataValues.name
						});
					}
				}
			}
			for(let i in user.dataValues.Contexts) {
				if(user.dataValues.Contexts[i].dataValues.id != editItemObj.itemContextId) {
					userContexts = Object.assign({}, {
						contextId: user.dataValues.Contexts[i].dataValues.id,
						contextName: user.dataValues.Contexts[i].dataValues.name
					});
					userContextArr = userContextArr.concat(userContexts);
				}
			}
			console.log(userContextArr);
			console.log(editItemObj);
			res.render('edit-item-modal.hbs', {contexts: userContextArr, item: editItemObj, layout: false});
		})
		.catch(error => {
			throw error;
		});
	},
	getContextModals: (req, res, templateName) => {
		const sentCookie = cookieHelpers.readCookie(req, 'do-it');
		helpers.findSession(sentCookie)
		.then(data => {
			console.log(data.dataValues);
			const sessionObj = JSON.parse(data.dataValues.data);
			console.log(sessionObj);
			return models.User
			.findOne({
				where: { id: sessionObj.userId },
				include: [{
					model: models.Context
				}]
			})
		})
		.then(user => {
			console.log(user);
			const contextObj = helpers.makeContextObj(user.dataValues.Contexts);
			console.log(contextObj);
			res.render(templateName, {contexts: contextObj, layout: false});
		})
		.catch(error => {
			console.log(`${templateName} lookup failed`);
			throw error;
		})
	},
	makeContextObj: (contexts) => {
		let userContexts;
		let userContextArr = [];
		for(let i in contexts) {
			userContexts = Object.assign({}, {
				contextId: contexts[i].dataValues.id,
				contextName: contexts[i].dataValues.name
			});
			userContextArr = userContextArr.concat(userContexts);
		}
		return userContextArr;
	},
	findAllOfThem: userId => {
		return models.User
		.findOne({
			where: { id: userId },
			include: [{
				model: models.Context,
				include: [{
					model: models.Item
				}]
			}]
		})
	},
	findSession: cookie => {
		return models.ConnectSession
		.findOne({
			where: { sid: cookie }
		})
	}
}

module.exports = helpers;
