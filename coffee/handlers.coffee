$(document).ready () ->
	# redirect to login or todos based on cookie presence
	console.log $('#intro').text().trim()
	auth readCookie 'do-it' if $('#intro').text().trim() == 'Welcome to the do-It task management application'

#most pages
	$(document).off('click', '#go-to-dos').on 'click', '#go-to-dos', getTodos
	$(document).off('click', '#log-out').on 'click', '#log-out', logout
	$(document).off('click', '.hide-show span').on 'click', '.hide-show span', hideShow

#from to-dos page
	$(document).off('submit', '#add-context').on 'submit', '#add-context', postContexts
	$(document).off('submit', '#add-todo').on 'submit', '#add-todo', postItems
	$(document).off('click', '.context-radio').on 'click', '.context-radio', toggleRadios
	$(document).off('click', '.edit-item').on 'click', '.edit-item', -> getItemModalContent this.id
	$(document).off('click', '#edit-contexts').on 'click', '#edit-contexts', getContextModalContent
	$(document).off('submit', '#edit-todo').on 'submit', '#edit-todo', putTodo
	$(document).off('click', '#delete-todo').on 'click', '#delete-todo', deleteTodo

#login, signup, settings
	$(document).off('click', '#log-in').on 'click', '#log-in', getLogin
	$(document).off('submit', '#login-form').on 'submit', '#login-form', postLogin
	$(document).off('click', '#sign-up').on 'click', '#sign-up', getSignup
	$(document).off('submit', '#signup-form').on 'submit', '#signup-form', postSignup
	$(document).off('click', '#settings').on 'click', '#settings', getSettings
	$(document).off('submit', '#change-form').on 'submit', '#change-form', putSettings
	$(document).off('click', '#delete-account').on 'click', '#delete-account', deleteAccount

#contexts
	$(document).off('click', '#rename-context').on 'click', '#rename-context', getRenameContext
	$(document).off('click', '#change-context').on 'click', '#change-context', getChangeContext
	$(document).off('click', '#delete-context').on 'click', '#delete-context', getDeleteContext

	$(document).off('submit', '#context-rename').on 'submit', '#context-rename', putRenameContext
	$(document).off('submit', '#context-change').on 'submit', '#context-change', putChangeContext
	$(document).off('submit', '#context-delete').on 'submit', '#context-delete', deleteContext
