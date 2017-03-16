var formToJSON, handleSignupSubmit;

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
  axios.post('/user/signup', data, {
    headers: {
      'Accept': 'text/html'
    }
  }).then(function(result) {
    return console.log(result);
  })["catch"](function(error) {
    return console.log(error);
  });
  return false;
};

$('#signup-form').submit(handleSignupSubmit);
