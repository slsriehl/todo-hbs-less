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
  $(document).off('click', '#add-todo-menu').on('click', '#add-todo-menu', getAddTodoModal);
  $(document).off('submit', '#add-context').on('submit', '#add-context', postContexts);
  $(document).off('submit', '#add-todo').on('submit', '#add-todo', postNewTodo);
  $(document).off('click', '.context-radio').on('click', '.context-radio', toggleRadios);
  $(document).off('click', '.done-label').on('click', '.done-label', toggleDone);
  $(document).off('click', '.edit-item').on('click', '.edit-item', function() {
    return getEditTodoModal(this.id);
  });
  $(document).off('click', '#edit-contexts').on('click', '#edit-contexts', getEditContextModal);
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
