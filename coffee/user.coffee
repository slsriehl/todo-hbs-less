
# User front-end CRUD operations - user.coffee

settingsModal = null

# load signup page from login page with click handler
getSignup = (event) ->
	address = axios.get '/user/signup'
	cruds event, address

# load login page from signup page with click handler
getLogin = (event) ->
	address = axios.get '/user/login'
	cruds event, address

# load settings page from any logged in page with click handler
getSettings = ->
	address = axios.get '/user'
	modalActions = (options) ->
		settingsModal = new Modal options
		settingsModal.open()
	modalCruds address, modalActions

# signup from signup page with submit handler
postSignup = (event) ->
	hideShowSubmit()
	data = formToJSON event.target.elements
	console.log data
	address = axios.post '/user/signup', data
	cruds event, address

# login from login page with submit handler
postLogin = (event) ->
	hideShowSubmit()
	data = formToJSON event.target.elements
	address = axios.post '/user/login', data
	cruds event, address

# change email or password from settings page with submit handler
putSettings = (event) ->
	hideShowSubmit()
	$('.hide-show').parent().find('[name="newPassword"]').attr 'type','password'
	data = formToJSON event.target.elements
	console.log data
	address = axios.put '/user', data
	modalActions = ->
		settingsModal.close()
	closeAndRefresh event, address, modalActions

# logout from any logged in page with click handler
logout = (event) ->
	address = axios.delete '/user/logout'
	cruds event, address

# delete account from settings page with click handler
deleteAccount = (event) ->
	password = $('[name="password"]').val()
	console.log password
	address = axios.delete '/user', {headers: {'password': password}}
	cruds event, address
