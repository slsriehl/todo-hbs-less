/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var auth, createCookie, deleteAccount, formToJSON, getDelete, getLogin, getSettings, getSignup, logout, postLogin, postPut, postSignup, putSettings, readCookie;

createCookie = function(name, value, days) {
  var date, expires;
  if (days) {
    date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + (date.toGMTString());
  } else {
    expires = '';
  }
  return document.cookie = name + "=" + value + expires + "; path=/";
};

readCookie = function(cookieName) {
  var a, b, cookies, i, j, len, n;
  cookies = " " + document.cookie;
  a = cookies.split(';');
  console.log(a);
  for (i = j = 0, len = a.length; j < len; i = ++j) {
    n = a[i];
    b = a[i].split('=');
    console.log(b);
    if (b[0] === (" " + cookieName)) {
      console.log(b[1]);
      return b[1];
    }
  }
  return null;
};

formToJSON = function(elements) {
  return [].reduce.call(elements, function(data, element) {
    data[element.name] = element.value;
    return data;
  }, {});
};

auth = function(cookie) {
  if (cookie && cookie !== 'undefined') {
    console.log('auth fired');
    return axios.get("/auth/" + cookie).then(function(result) {
      console.log(result);
      return $('body').html(result.data);
    })["catch"](function(error) {
      return console.log(error);
    });
  } else {
    return getLogin(null);
  }
};

getDelete = function(event, getDeleteTo) {
  if (event) {
    event.preventDefault();
  }
  return getDeleteTo.then(function(result) {
    console.log(result);
    return $('body').html(result.data);
  })["catch"](function(error) {
    return console.log(error);
  });
};

postPut = function(event, postPutTo) {
  event.preventDefault();
  return postPutTo.then(function(result) {
    console.log(result);
    $('body').html(result.data);
    return createCookie('do-it', result.headers.cookie, 3);
  })["catch"](function(error) {
    return console.log(error);
  });
};

getSignup = function(event) {
  var address;
  address = axios.get('/user/signup');
  return getDelete(event, address);
};

getLogin = function(event) {
  var address;
  address = axios.get('/user/login');
  return getDelete(event, address);
};

getSettings = function(event) {
  var address, cookie;
  cookie = readCookie('do-it');
  address = axios.get("/user/" + cookie);
  return getDelete(event, address);
};

postSignup = function(event) {
  var address, data;
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.post('/user/signup', data);
  return postPut(event, address);
};

postLogin = function(event) {
  var address, data;
  data = formToJSON(event.target.elements);
  address = axios.post('/user/login', data);
  return postPut(event, address);
};

putSettings = function(event) {
  var address, data;
  data = formToJSON(event.target.elements);
  data.cookie = readCookie('do-it');
  console.log(data);
  address = axios.put('/user', data);
  return postPut(event, address);
};

logout = function(event) {
  var address;
  address = axios["delete"]('/user/logout');
  return getDelete(event, address);
};

deleteAccount = function(event) {
  var address, data;
  data = {
    password: $('#password').val(),
    cookie: readCookie('do-it')
  };
  console.log(data);
  address = axios.put("/user/delete", data);
  return getDelete(event, address);
};

$(document).ready(function() {
  $('#sign-up').click(getSignup);
  $('#log-in').click(getLogin);
  $('#settings').click(getSettings);
  $('#signup-form').submit(postSignup);
  $('#login-form').submit(postLogin);
  $('#change-form').submit(putSettings);
  $('#log-out').click(logout);
  $('#delete-account').click(deleteAccount);
  console.log($('#intro').text().trim());
  if ($('#intro').text().trim() === 'Welcome to the do-It task management application') {
    return auth(readCookie('do-it'));
  }
});
