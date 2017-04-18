const express = require('express');

const router = new express.Router;

const userController = require('../controllers/user');

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

module.exports = router;
