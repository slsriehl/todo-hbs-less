const express = require('express');

const router = new express.Router;

const contextController = require('../controllers/context'),
			readController = require('../controllers/read');

//++++++ CONTEXT routes ++++++
//Create new context
router.post('/context', (req, res) => {
	contextController.createContext(req, res);
});

//Read context edit modal
router.get('/editContextModal', (req, res) => {
	readController.editContextModal(req, res);
});

//Read rename context modal
router.get('/renameContext', (req, res) => {
	readController.getRenameContext(req, res);
});

//Read change context modal
router.get('/changeContext', (req, res) => {
	readController.getChangeContext(req, res);
});

//Read delete context modal
router.get('/deleteContext', (req, res) => {
	readController.getDeleteContext(req, res);
});

//Update: rename context
router.put('/renameContext', (req, res) => {
	contextController.renameContext(req, res);
});

//Update: change context
router.put('/changeContext', (req, res) => {
	contextController.changeContext(req, res);
});

//Delete context
router.delete('/deleteContext/:id', (req, res) => {
	contextController.deleteContext(req, res);
});


module.exports = router;
