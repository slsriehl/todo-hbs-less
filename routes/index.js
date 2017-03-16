
const express = require('express');

const router = new express.Router;

const userController = require('../controllers/user'),
			itemController = require('../controllers/item'),
			contextController = require('../controllers/context');


//++++++ ITEM routes ++++++
//Create new to-do
router.post('/item', (req, res) => {
	itemController.createItem(req, res);
});

//Read to-dos
router.get('/item', (req, res) => {
	itemController.readItems(req, res);
});

//Update to-do
router.put('/item', (req, res) => {
	itemController.updateItem(req, res);
});

//Delete to-do
router.delete('/item/:id', (req, res) => {
	itemController.deleteItem(req, res);
});

//++++++ USER routes ++++++

//render signup page
router.get('/user/signup', (req, res) => {
	res.render('signup.hbs');
});

//Create new user
router.post('/user/signup', (req, res) => {
	userController.signupUser(req, res);
});

//render login page
router.get('/user/login', (req, res) => {
	res.render('index.hbs');
});

//Login new user
router.post('/user/login', (req, res) => {
	userController.loginUser(req, res);
});

//Update user
router.put('/user', (req, res) => {
	userController.updateUser(req, res);
});

//Delete user
router.delete('/user', (req, res) => {
	userController.deleteUser(req, res);
});

router.delete('/user/logout', (req, res) => {
	userController.logoutUser(req, res);
});

//++++++ CONTEXT routes ++++++
//Create new context
router.post('/context', (req, res) => {
	contextController.createContext(req, res);
});

//Read contexts
router.get('/context', (req, res) => {
	contextController.readContexts(req, res);
});



module.exports = router;
