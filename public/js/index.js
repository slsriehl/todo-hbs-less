var createCookie, formToJSON, handleSignupSubmit, readCookie;

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

handleSignupSubmit = function(event) {
  var data;
  event.preventDefault();
  data = formToJSON(event.target.elements);
  console.log(data);
  axios.post('/user/signup', data).then(function(result) {
    var value;
    console.log(result);
    document.write(result.data);
    value = result.headers.cookie;
    console.log(value);
    return createCookie('do-it', value, 3);
  })["catch"](function(error) {
    return console.log(error);
  });
  return false;
};

$(document).ready(function() {
  return $('#signup-form').submit(handleSignupSubmit);
});
