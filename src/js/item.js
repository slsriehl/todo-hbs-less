/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var addItemModal, auth, deleteTodo, editItemModal, getAddTodoModal, getEditTodoModal, getTodos, postNewTodo, putTodo;

addItemModal = null;

editItemModal = null;

auth = function(cookie) {
  var address;
  if (cookie && cookie !== 'undefined') {
    address = axios.get('/item');
    return cruds(event, address);
  } else {
    return getLogin(null);
  }
};

getTodos = function(event) {
  var address;
  address = axios.get('/item');
  return cruds(event, address);
};

getAddTodoModal = function() {
  var address, modalActions;
  address = axios.get("/addItemModal");
  modalActions = function(options) {
    addItemModal = new Modal(options);
    return addItemModal.open();
  };
  return modalCruds(address, modalActions);
};

getEditTodoModal = function(itemId) {
  var address, modalActions;
  console.log(itemId);
  address = axios.get("/editItemModal/" + itemId);
  modalActions = function(options) {
    editItemModal = new Modal(options);
    return editItemModal.open();
  };
  return modalCruds(address, modalActions);
};

postNewTodo = function(event) {
  var address, data, modalActions;
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.post('/item', data);
  modalActions = function() {
    return addItemModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};

putTodo = function(event) {
  var address, data, modalActions;
  data = formToJSON(event.target.elements);
  address = axios.put("/item", data);
  if (!$('[name="ContextId"]').val()) {
    $('.original-check').prop('checked', true);
  }
  modalActions = function() {
    return editItemModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};

deleteTodo = function(event) {
  var address, data, modalActions;
  data = $("[name='id']").val();
  address = axios["delete"]("/item/" + data);
  modalActions = function() {
    return editItemModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};
