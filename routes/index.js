
const express = require('express');

const router = new express.Router;

const userController = require('../controllers/user'),
			contextItemController = require('../controllers/contextItem');


//++++++ ITEM routes ++++++
//Create new to-do
router.post('/item', (req, res) => {
	contextItemController.createItem(req, res);
});

//Read to-dos
router.get('/item', (req, res) => {
	contextItemController.readItems(req, res);
});

//Update to-do
router.put('/item', (req, res) => {
	contextItemController.updateItem(req, res);
});

//Delete to-do
router.delete('/item/:id', (req, res) => {
	contextItemController.deleteItem(req, res);
});

//++++++ USER routes ++++++

//render landing page based on logged in status
router.get('/', (req, res) => {
	res.render('index.hbs');
});

router.post('/auth', (req, res) => {
	console.log('auth cookie fired');
	userController.auth(req, res);
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
router.get('/user/:cookie', (req, res) => {
	userController.userSettings(req, res);
});

//Update user
router.put('/user', (req, res) => {
	userController.updateUser(req, res);
});

//Delete user
router.put('/user/delete', (req, res) => {
	userController.deleteUser(req, res);
});

router.delete('/user/logout', (req, res) => {
	userController.logoutUser(req, res);
});

//++++++ CONTEXT routes ++++++
//Create new context
router.post('/context', (req, res) => {
	contextItemController.createContext(req, res);
});

//Read contexts
router.get('/context', (req, res) => {
	contextcontextItemController.readContexts(req, res);
});



module.exports = router;
