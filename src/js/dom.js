/*!
 * Studio Riehl -  v1.0.0 (https://github.com/slsriehl/todo-hbs-less#readme)
 * Copyright 2017-2017 Sarah Schieffer Riehl
 * Licensed under  ()
 */
var hideShow, hideShowSubmit, toggleDone, toggleRadios;

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
    if ($('*').hasClass('checked')) {
      $('*').removeClass('checked');
    }
    $(this).children('input').prop('checked', true);
    return $(this).addClass('checked');
  }
};

toggleDone = function(event) {
  if ($(this).parent('.done-check').hasClass('checked1')) {
    $(this).parent('.done-check').removeClass('checked1');
    $('input[name="done"]').prop('checked', false);
    return $(this).text('Not Done');
  } else {
    $(this).parent('.done-check').addClass('checked1');
    $('input[name="done"]').prop('checked', true);
    return $(this).text('Done');
  }
};
