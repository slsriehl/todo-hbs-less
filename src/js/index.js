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
  $(document).off('click', '#go-to-dos').on('click', '#go-to-dos', getTodos);
  $(document).off('click', '#log-out').on('click', '#log-out', logout);
  $(document).off('click', '.hide-show span').on('click', '.hide-show span', hideShow);
  $(document).off('click', '#add-todo-menu').on('click', '#add-todo-menu', getAddItemModal);
  $(document).off('submit', '#add-context').on('submit', '#add-context', postContexts);
  $(document).off('submit', '#add-todo').on('submit', '#add-todo', postAddItemModal);
  $(document).off('click', '.context-radio').on('click', '.context-radio', toggleRadios);
  $(document).off('click', '.edit-item').on('click', '.edit-item', function() {
    return getItemModalContent(this.id);
  });
  $(document).off('click', '#edit-contexts').on('click', '#edit-contexts', getContextModalContent);
  $(document).off('submit', '#edit-todo').on('submit', '#edit-todo', putTodo);
  $(document).off('click', '#delete-todo').on('click', '#delete-todo', deleteTodo);
  $(document).off('click', '#log-in').on('click', '#log-in', getLogin);
  $(document).off('submit', '#login-form').on('submit', '#login-form', postLogin);
  $(document).off('click', '#sign-up').on('click', '#sign-up', getSignup);
  $(document).off('submit', '#signup-form').on('submit', '#signup-form', postSignup);
  $(document).off('click', '#settings').on('click', '#settings', getSettings);
  $(document).off('submit', '#change-form').on('submit', '#change-form', putSettings);
  $(document).off('click', '#delete-account').on('click', '#delete-account', deleteAccount);
  $(document).off('click', '#rename-context').on('click', '#rename-context', getRenameContext);
  $(document).off('click', '#change-context').on('click', '#change-context', getChangeContext);
  $(document).off('click', '#delete-context').on('click', '#delete-context', getDeleteContext);
  $(document).off('submit', '#context-rename').on('submit', '#context-rename', putRenameContext);
  $(document).off('submit', '#context-change').on('submit', '#context-change', putChangeContext);
  return $(document).off('submit', '#context-delete').on('submit', '#context-delete', deleteContext);
});

/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var auth, createCookie, cruds, deleteAccount, formToJSON, getLogin, getSettings, getSignup, getTodos, hideShow, hideShowSubmit, isValidElement, isValidValue, logout, postLogin, postSignup, putSettings, readCookie, toggleRadios;

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
    address = axios.get('/item');
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
  var address;
  address = axios.get('/user');
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
  var address, data;
  hideShowSubmit();
  $('.hide-show').parent().find('[name="newPassword"]').attr('type', 'password');
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.put('/user', data);
  return cruds(event, address);
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

getTodos = function(event) {
  var address;
  address = axios.get('/item');
  return cruds(event, address);
};

hideShow = function(event) {
  console.log('hide show fired');
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
var Modal, addItemModal, changeContextModal, closeAndRefresh, deleteContext, deleteContextModal, deleteTodo, editContextModal, editItemModal, extendDefaults, getAddItemModal, getChangeContext, getContextModalContent, getDeleteContext, getItemModalContent, getRenameContext, modalCruds, postAddItemModal, postContexts, putChangeContext, putRenameContext, putTodo, renameContextModal,
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
      closeButton: false,
      content: "",
      maxWidth: 1900,
      minWidth: 0,
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

editContextModal = null;

renameContextModal = null;

changeContextModal = null;

deleteContextModal = null;

addItemModal = null;

modalCruds = function(address, modalActions) {
  return address.then(function(data) {
    var options;
    console.log(data);
    options = {
      content: data.data
    };
    console.log(options);
    return modalActions(options);
  })["catch"](function(error) {
    console.log(error);
    return error;
  });
};

getItemModalContent = function(itemId) {
  var address, modalActions;
  console.log(itemId);
  address = axios.get("/editItemModal/" + itemId);
  modalActions = function(options) {
    editItemModal = new Modal(options);
    return editItemModal.open();
  };
  return modalCruds(address, modalActions);
};

getAddItemModal = function() {
  var address, modalActions;
  address = axios.get("/addItemModal");
  modalActions = function(options) {
    addItemModal = new Modal(options);
    return addItemModal.open();
  };
  return modalCruds(address, modalActions);
};

postAddItemModal = function(event) {
  var address, data, modalActions;
  data = formToJSON(event.target.elements);
  console.log(data);
  address = axios.post('/item', data);
  modalActions = function() {
    return addItemModal.close();
  };
  return closeAndRefresh(event, address, modalActions);
};

getContextModalContent = function() {
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

putTodo = function(event) {
  var address, data, modalActions;
  data = formToJSON(event.target.elements);
  address = axios.put("/item", data);
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

closeAndRefresh = function(event, address, modalActions) {
  event.preventDefault();
  $('.fade-and-drop').addClass('.button-click');
  return address.then(function(result) {
    modalActions();
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
