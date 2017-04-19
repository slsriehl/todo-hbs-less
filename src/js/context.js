/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var changeContextModal, deleteContext, deleteContextModal, editContextModal, getChangeContext, getDeleteContext, getEditContextModal, getRenameContext, postContexts, putChangeContext, putRenameContext, renameContextModal;

editContextModal = null;

renameContextModal = null;

changeContextModal = null;

deleteContextModal = null;

getEditContextModal = function() {
  var address, modalActions;
  address = axios.get("/editContextModal");
  modalActions = function(options) {
    editContextModal = new Modal(options);
    return editContextModal.open();
  };
  return modalCruds(address, modalActions);
};

getRenameContext = function() {
  var address, modalActions;
  address = axios.get("/renameContext");
  modalActions = function(options) {
    renameContextModal = new Modal(options);
    editContextModal.close();
    return renameContextModal.open();
  };
  return modalCruds(address, modalActions);
};

getChangeContext = function() {
  var address, modalActions;
  address = axios.get("/changeContext");
  modalActions = function(options) {
    changeContextModal = new Modal(options);
    editContextModal.close();
    return changeContextModal.open();
  };
  return modalCruds(address, modalActions);
};

getDeleteContext = function() {
  var address, modalActions;
  address = axios.get("/deleteContext");
  modalActions = function(options) {
    deleteContextModal = new Modal(options);
    editContextModal.close();
    return deleteContextModal.open();
  };
  return modalCruds(address, modalActions);
};

postContexts = function(event) {
  var address, data, modalActions;
  data = formToJSON(event.target.elements);
  address = axios.post('/context', data);
  modalActions = function() {
    return editContextModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};

putRenameContext = function(event) {
  var address, data, modalActions;
  data = formToJSON(event.target.elements);
  address = axios.put('/renameContext', data);
  modalActions = function() {
    return renameContextModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};

putChangeContext = function(event) {
  var address, data, modalActions;
  data = formToJSON(event.target.elements);
  address = axios.put('/changeContext', data);
  modalActions = function() {
    return changeContextModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};

deleteContext = function(event) {
  var address, data, modalActions;
  data = $("[name='contextToDelete']:checked").val();
  address = axios["delete"]("/deleteContext/" + data);
  modalActions = function() {
    return deleteContextModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};
