/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var deleteAccount, getLogin, getSettings, getSignup, logout, postLogin, postSignup, putSettings, settingsModal;

settingsModal = null;

getSignup = function(event) {
  var address;
  address = axios.get('/user/signup');
  return cruds(event, address);
};

getLogin = function(event) {
  var address;
  address = axios.get('/user/login');
  return cruds(event, address);
};

getSettings = function() {
  var address, modalActions;
  address = axios.get('/user');
  modalActions = function(options) {
    settingsModal = new Modal(options);
    return settingsModal.open();
  };
  return modalCruds(address, modalActions);
};

postSignup = function(event) {
  var address, data;
  hideShowSubmit();
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.post('/user/signup', data);
  return cruds(event, address);
};

postLogin = function(event) {
  var address, data;
  hideShowSubmit();
  data = formToJSON(event.target.elements);
  address = axios.post('/user/login', data);
  return cruds(event, address);
};

putSettings = function(event) {
  var address, data, modalActions;
  hideShowSubmit();
  $('.hide-show').parent().find('[name="newPassword"]').attr('type', 'password');
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.put('/user', data);
  modalActions = function() {
    return settingsModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};

logout = function(event) {
  var address;
  address = axios["delete"]('/user/logout');
  return cruds(event, address);
};

deleteAccount = function(event) {
  var address, password;
  password = $('[name="password"]').val();
  console.log(password);
  address = axios["delete"]('/user', {
    headers: {
      'password': password
    }
  });
  return cruds(event, address);
};
