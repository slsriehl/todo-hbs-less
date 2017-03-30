/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var auth, createCookie, cruds, deleteAccount, formToJSON, getLogin, getSettings, getSignup, getTodos, hideShow, logout, postContexts, postItems, postLogin, postSignup, putSettings, readCookie;

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

cruds = function(event, address) {
  if (event) {
    event.preventDefault();
  }
  return address.then(function(result) {
    console.log(result);
    $('#content').html(result.data);
    if (result.headers.cookie) {
      return createCookie('do-it', result.headers.cookie, 3);
    }
  })["catch"](function(error) {
    return console.log(error);
  });
};

auth = function(cookie) {
  var address;
  if (cookie && cookie !== 'undefined') {
    console.log('auth fired');
    address = axios.get('/item', {
      headers: {
        'clientcookie': cookie
      }
    });
    return cruds(event, address);
  } else {
    return getLogin(null);
  }
};

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

getSettings = function(event) {
  var address, cookie;
  cookie = readCookie('do-it');
  address = axios.get('/user', {
    headers: {
      'clientcookie': cookie
    }
  });
  return cruds(event, address);
};

postSignup = function(event) {
  var address, data;
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.post('/user/signup', data);
  return cruds(event, address);
};

postLogin = function(event) {
  var address, data;
  $('.hide-show span').text('Show').addClass('show');
  $('.hide-show').parent().find('[name="password"]').attr('type', 'password');
  data = formToJSON(event.target.elements);
  address = axios.post('/user/login', data);
  return cruds(event, address);
};

putSettings = function(event) {
  var address, cookie, data;
  data = formToJSON(event.target.elements);
  cookie = readCookie('do-it');
  console.log(data);
  address = axios.put('/user', data, {
    headers: {
      'clientcookie': cookie
    }
  });
  return cruds(event, address);
};

logout = function(event) {
  var address;
  address = axios["delete"]('/user/logout');
  return cruds(event, address);
};

deleteAccount = function(event) {
  var address, cookie, data;
  data = {
    password: $('#password').val()
  };
  cookie = readCookie('do-it');
  console.log(data);
  address = axios["delete"]('/user', data, {
    headers: {
      'clientcookie': cookie
    }
  });
  return cruds(event, address);
};

postContexts = function(event) {
  var address, cookie, data;
  data = formToJSON(event.target.elements);
  console.log(data);
  cookie = readCookie('do-it');
  address = axios.post('/context', data, {
    headers: {
      'clientcookie': cookie
    }
  });
  return cruds(event, address);
};

getTodos = function(event) {
  var address, cookie;
  cookie = readCookie('do-it');
  address = axios.get('/item', {
    headers: {
      'clientcookie': cookie
    }
  });
  return cruds(event, address);
};

postItems = function(event) {
  var address, cookie, data;
  data = formToJSON(event.target.elements);
  cookie = readCookie('do-it');
  console.log(data);
  address = axios.post('/item', data, {
    headers: {
      'clientcookie': cookie
    }
  });
  return cruds(event, address);
};

hideShow = function(event) {
  console.log('foo');
  if ($(this).hasClass('show')) {
    $(this).text('Hide');
    $('[name="password"]').attr('type', 'text');
    return $(this).removeClass('show');
  } else {
    $(this).text('Show');
    $('[name="password"]').attr('type', 'password');
    return $(this).addClass('show');
  }
};

$(document).ready(function() {
  console.log($('#intro').text().trim());
  if ($('#intro').text().trim() === 'Welcome to the do-It task management application') {
    return auth(readCookie('do-it'));
  }
});
