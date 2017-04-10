$(document).ready () ->
	# redirect to login or todos based on cookie presence
	console.log $('#intro').text().trim()
	auth readCookie 'do-it' if $('#intro').text().trim() == 'Welcome to the do-It task management application'

#most pages
	$(document).on 'click', '#go-to-dos', getTodos
	$(document).on 'click', '#log-out', logout
	$(document).on 'click', '.hide-show span', hideShow

#from to-dos page
	$(document).on 'submit', '#add-context', postContexts
	$(document).on 'submit', '#add-todo', postItems
	$(document).on 'click', '.context-radio', toggleRadios
	$(document).on 'click', '.edit-item', -> getModalContent this.id
	$(document).on 'submit', '#edit-todo', editTodoSubmit
	$(document).on 'click', '#delete-todo', deleteTodo

#login, signup, settings
	$(document).on 'click', '#log-in', getLogin
	$(document).on 'submit', '#login-form', postLogin
	$(document).on 'click', '#sign-up', getSignup
	$(document).on 'submit', '#signup-form', postSignup
	$(document).on 'click', '#settings', getSettings
	$(document).on 'submit', '#change-form', putSettings
	$(document).on 'click', '#delete-account', deleteAccount
