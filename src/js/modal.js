/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var Modal, extendDefaults,
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
