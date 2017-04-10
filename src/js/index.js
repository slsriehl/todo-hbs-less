/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
$(document).ready(function() {
  console.log($('#intro').text().trim());
  if ($('#intro').text().trim() === 'Welcome to the do-It task management application') {
    auth(readCookie('do-it'));
  }
  $(document).on('click', '#go-to-dos', getTodos);
  $(document).on('click', '#log-out', logout);
  $(document).on('click', '.hide-show span', hideShow);
  $(document).on('submit', '#add-context', postContexts);
  $(document).on('submit', '#add-todo', postItems);
  $(document).on('click', '.context-radio', toggleRadios);
  $(document).on('click', '.edit-item', function() {
    return getModalContent(this.id);
  });
  $(document).on('submit', '#edit-todo', editTodoSubmit);
  $(document).on('click', '#delete-todo', deleteTodo);
  $(document).on('click', '#log-in', getLogin);
  $(document).on('submit', '#login-form', postLogin);
  $(document).on('click', '#sign-up', getSignup);
  $(document).on('submit', '#signup-form', postSignup);
  $(document).on('click', '#settings', getSettings);
  $(document).on('submit', '#change-form', putSettings);
  return $(document).on('click', '#delete-account', deleteAccount);
});

/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var auth, createCookie, cruds, deleteAccount, formToJSON, getLogin, getSettings, getSignup, getTodos, hideShow, hideShowSubmit, isValidElement, isValidValue, logout, postContexts, postItems, postLogin, postSignup, putSettings, readCookie, toggleRadios;

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

isValidElement = function(element) {
  return element.name && element.value;
};

isValidValue = function(element) {
  return !['checkbox', 'radio'].includes(element.type) || element.checked;
};

formToJSON = function(elements) {
  return [].reduce.call(elements, function(data, element) {
    if (isValidElement(element) && isValidValue(element)) {
      data[element.name] = element.value;
    }
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
  var address, cookie, data;
  hideShowSubmit();
  $('.hide-show').parent().find('[name="newPassword"]').attr('type', 'password');
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
  if ($(this).hasClass('show')) {
    $('.hide-show span').text('Hide');
    $('[name="password"]').attr('type', 'text');
    $('[name="newPassword"]').attr('type', 'text');
    return $('.hide-show span').removeClass('show');
  } else {
    $('.hide-show span').text('Show');
    $('[name="password"]').attr('type', 'password');
    $('[name="newPassword"]').attr('type', 'password');
    return $('.hide-show span').addClass('show');
  }
};

hideShowSubmit = function() {
  $('.hide-show span').text('Show').addClass('show');
  return $('.hide-show').parent().find('[name="password"]').attr('type', 'password');
};

toggleRadios = function(event) {
  if ($(this).hasClass('checked')) {
    $(this).children('input').prop('checked', false);
    return $(this).removeClass('checked');
  } else {
    $(this).children('input').prop('checked', true);
    return $(this).addClass('checked');
  }
};

/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var Modal, closeAndRefresh, deleteTodo, editItemModal, editTodoSubmit, extendDefaults, getModalContent,
  hasProp = {}.hasOwnProperty;

Modal = (function(_this) {
  return function(optionsObj) {
    var defaults;
    ({
      closeButton: null,
      modal: null,
      overlay: null
    });
    defaults = {
      className: 'fade-and-drop',
      closeButton: true,
      content: "",
      maxWidth: 1000,
      minWidth: 400,
      overlay: true
    };
    return {
      options: extendDefaults(defaults, optionsObj),
      close: function() {
        this.modal.parentNode.removeChild(this.modal);
        return this.overlay.parentNode.removeChild(this.overlay);
      },
      open: function() {
        console.log(this.options);
        this.buildOut.call(this);
        this.initializeEvents.call(this);
        window.getComputedStyle(this.modal).height;
        this.modal.className = this.modal.className + "  " + (this.modal.offsetHeight > window.innerHeight ? 'modal-is-open anchored' : 'modal-is-open');
        if (this.options.overlay) {
          return this.overlay.className = this.overlay.className + " modal-is-open";
        }
      },
      buildOut: function() {
        var contentHolder;
        this.modal = document.createElement("div");
        this.modal.className = "project-modal " + this.options.className;
        this.modal.style.minWidth = this.options.minWidth + " px";
        this.modal.style.maxWidth = this.options.maxWidth + " px";
        if (this.options.closeButton) {
          this.closeButton = document.createElement("button");
          this.closeButton.className = "project-close close-button";
          this.closeButton.innerHTML = "<i class='fa fa-times'></i>";
          this.modal.appendChild(this.closeButton);
        }
        if (this.options.overlay) {
          this.overlay = document.createElement("div");
          this.overlay.className = "project-overlay " + this.options.className;
          document.body.appendChild(this.overlay);
        }
        contentHolder = document.createElement("div");
        contentHolder.className = "project-content";
        contentHolder.innerHTML = this.options.content;
        this.modal.appendChild(contentHolder);
        return document.body.appendChild(this.modal);
      },
      initializeEvents: function() {
        if (this.closeButton) {
          this.closeButton.addEventListener('click', this.close.bind(this));
        }
        if (this.overlay) {
          return this.overlay.addEventListener('click', this.close.bind(this));
        }
      },
      transitionSelect: function() {
        var el;
        el = document.createElement("div");
        if (el.style.WebkitTransition) {
          return "webkitTransitionEnd";
        }
        if (el.style.OTransition) {
          return "oTransitionEnd";
        }
      }
    };
  };
})(this);

extendDefaults = function(sourceOptions, passedOptions) {
  var property, sourceCopy;
  sourceCopy = sourceOptions;
  for (property in passedOptions) {
    if (!hasProp.call(passedOptions, property)) continue;
    sourceCopy[property] = passedOptions[property];
  }
  return sourceCopy;
};

editItemModal = null;

getModalContent = function(itemId) {
  var cookie;
  cookie = readCookie('do-it');
  console.log(itemId);
  return axios.get("/editItemModal/" + itemId, {
    headers: {
      'clientcookie': cookie
    }
  }).then(function(data) {
    var options;
    console.log(data);
    options = {
      content: data.data
    };
    console.log(options);
    editItemModal = new Modal(options);
    return editItemModal.open();
  })["catch"](function(error) {
    console.log(error);
    return error;
  });
};

editTodoSubmit = function(event) {
  var address, cookie, data;
  event.preventDefault();
  cookie = readCookie('do-it');
  data = formToJSON(event.target.elements);
  address = axios.put("/item", data, {
    headers: {
      'clientcookie': cookie
    }
  });
  return closeAndRefresh(event, address);
};

deleteTodo = function(event) {
  var address, cookie, data;
  event.preventDefault();
  cookie = readCookie('do-it');
  data = $("[name='id']").val();
  console.log(data);
  address = axios["delete"]("/item/" + data, {
    headers: {
      'clientcookie': cookie
    }
  });
  return closeAndRefresh(event, address);
};

closeAndRefresh = function(event, address) {
  return address.then(function(result) {
    editItemModal.close();
    console.log(result);
    $('#content').html(result.data);
    if (result.headers.cookie) {
      return createCookie('do-it', result.headers.cookie, 3);
    }
  })["catch"](function(error) {
    console.log(error);
    return error;
  });
};
