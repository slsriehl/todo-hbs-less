var createCookie, formToJSON, handleLoginSubmit, handleSignupSubmit, handleSubmit, logout, readCookie;

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

handleSubmit = function(event, postTo) {
  var data;
  event.preventDefault();
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

handleSignupSubmit = function(event) {
  var address;
  address = '/user/signup';
  return handleSubmit(event, address);
};

handleLoginSubmit = function(event) {
  var address;
  address = '/user/login';
  return handleSubmit(event, address);
};

logout = function(event) {
  return axios["delete"]('/user/logout').then(function(result) {
    console.log(result);
    return $('body').html(result.data);
  })["catch"](function(error) {
    return console.log(error);
  });
};

$(document).on('click', '#log-out', logout);

$(document).ready(function() {
  $('#signup-form').submit(handleSignupSubmit);
  return $('#login-form').submit(handleLoginSubmit);
});
