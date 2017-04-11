
const express = require('express');

const router = new express.Router;

const userController = require('../controllers/user'),
			contextController = require('../controllers/context'),
			itemController = require('../controllers/item'),
			readController = require('../controllers/read');


//++++++ ITEM routes ++++++
//Create new to-do
router.post('/item', (req, res) => {
	itemController.createItem(req, res);
});

//Read to-dos
router.get('/item', (req, res) => {
	readController.readTodos(req, res);
});

//Update to-do
router.put('/item', (req, res) => {
	itemController.updateItem(req, res);
});

//Delete to-do
router.delete('/item/:id', (req, res) => {
	itemController.deleteItem(req, res);
});

//get edit item modal content
router.get('/editItemModal/:id', (req, res) => {
	readController.editItemModal(req, res);
});

//++++++ USER routes ++++++

//render landing page based on logged in status
router.get('/', (req, res) => {
	res.render('index.hbs');
});

//render signup page
router.get('/user/signup', (req, res) => {
	res.render('signup.hbs', {layout: false});
});

//Create new user
router.post('/user/signup', (req, res) => {
	userController.signupUser(req, res);
});

//render login page
router.get('/user/login', (req, res) => {
	res.render('login.hbs', {layout: false});
});

//Login new user
router.post('/user/login', (req, res) => {
	userController.loginUser(req, res);
});

//get user settings
router.get('/user', (req, res) => {
	userController.userSettings(req, res);
});

//Update user
router.put('/user', (req, res) => {
	userController.updateUser(req, res);
});

//Delete user
router.delete('/user', (req, res) => {
	userController.deleteUser(req, res);
});

//logout user
router.delete('/user/logout', (req, res) => {
	userController.logoutUser(req, res);
});

//++++++ CONTEXT routes ++++++
//Create new context
router.post('/context', (req, res) => {
	contextController.createContext(req, res);
});

//context edit modal
router.get('/editContextModal', (req, res) => {
	readController.editContextModal(req, res);
});

// //Read contexts
// router.get('/context', (req, res) => {
// 	contextController.readContexts(req, res);
// });



module.exports = router;
