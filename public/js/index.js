var createCookie, formToJSON, getLogin, getLoginSignup, getSignup, logout, postLogin, postLoginSignup, postSignup, readCookie;

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
  var a, b, c, cookies, i, j, len;
  cookies = " " + document.cookie;
  a = cookies.split(';');
  for (j = 0, len = a.length; j < len; j++) {
    i = a[j];
    b = a[i].split('=');
    if (b[0] === (" " + cookieName)) {
      c = JSON.parse(b[1]);
    }
  }
  return c;
};

formToJSON = function(elements) {
  return [].reduce.call(elements, function(data, element) {
    data[element.name] = element.value;
    return data;
  }, {});
};

getLoginSignup = function(event, pathTo) {
  return axios.get(pathTo).then(function(result) {
    console.log(result);
    return $('body').html(result.data);
  })["catch"](function(error) {
    return console.log(error);
  });
};

postLoginSignup = function(event, postTo) {
  var data;
  data = formToJSON(event.target.elements);
  console.log(data);
  axios.post(postTo, data).then(function(result) {
    console.log(result);
    $('body').html(result.data);
    return createCookie('do-it', result.headers.cookie, 3);
  })["catch"](function(error) {
    return console.log(error);
  });
  return false;
};

getSignup = function(event) {
  var address;
  address = '/user/signup';
  return getLoginSignup(event, address);
};

getLogin = function(event) {
  var address;
  address = '/user/login';
  return getLoginSignup(event, address);
};

postSignup = function(event) {
  var address;
  address = '/user/signup';
  return postLoginSignup(event, address);
};

postLogin = function(event) {
  var address;
  address = '/user/login';
  return postLoginSignup(event, address);
};

logout = function(event) {
  return axios["delete"]('/user/logout').then(function(result) {
    console.log(result);
    return $('body').html(result.data);
  })["catch"](function(error) {
    return console.log(error);
  });
};

$(document).on('click', '#sign-up', getSignup);

$(document).on('click', '#log-in', getLogin);

$(document).on('submit', '#signup-form', postSignup);

$(document).on('submit', '#login-form', postLogin);

$(document).on('click', '#log-out', logout);
