const express = require('express');

const router = new express.Router;

const itemController = require('../controllers/item'),
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

//Read edit item modal content
router.get('/editItemModal/:id', (req, res) => {
	readController.editItemModal(req, res);
});

//Read add item modal content
router.get('/addItemModal', (req, res) => {
	readController.addItemModal(req, res);
});


//Update to-do
router.put('/item', (req, res) => {
	itemController.updateItem(req, res);
});

//Delete to-do
router.delete('/item/:id', (req, res) => {
	itemController.deleteItem(req, res);
});



module.exports = router;
