

# create a cookie sent from the server
createCookie = (name, value, days) ->
	if(days)
		date = new Date()
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
		expires = "; expires=#{date.toGMTString()}"
	else
		expires = ''
	document.cookie = "#{name}=#{value}#{expires}; path=/"

# read a cookie stored on the client
readCookie = (cookieName) ->
	cookies = " #{document.cookie}"
	a = cookies.split ';'
	console.log a
	for n, i in a
		b = a[i].split '='
		console.log b
		if b[0] == " #{cookieName}"
			console.log b[1]
			return b[1]
	return null

# convert the input in the form inputs into a json object
formToJSON = (elements) ->
	[].reduce.call(elements, (data, element) ->
		data[element.name] = element.value
		return data
	, {})

# the root of all axios calls in the front end script
cruds = (event, getDeleteTo) ->
	event.preventDefault() if event
	getDeleteTo
	.then (result) ->
		console.log result
		$('#content').html result.data
		if result.headers.cookie
			createCookie 'do-it', result.headers.cookie, 3
	.catch (error) ->
		console.log error

# determine if a cookie is present on the client on initial load
# and call for the login or the todos page accordingly
auth = (cookie) ->
	if cookie and cookie != 'undefined'
		console.log 'auth fired'
		address = axios.post '/item/read', {cookie: cookie}
		cruds event, address
	else
		getLogin null

# load signup page from login page with click handler
getSignup = (event) ->
	address = axios.get '/user/signup'
	cruds event, address

# load login page from signup page with click handler
getLogin = (event) ->
	address = axios.get '/user/login'
	cruds event, address

# load settings page from any logged in page with click handler
getSettings = (event) ->
	cookie = readCookie('do-it')
	address = axios.get "/user/#{cookie}"
	cruds event, address

# signup from signup page with submit handler
postSignup = (event) ->
	data = formToJSON event.target.elements
	console.log data
	address = axios.post '/user/signup', data
	cruds event, address

# login from login page with submit handler
postLogin = (event) ->
	data = formToJSON event.target.elements
	address = axios.post '/user/login', data
	cruds event, address

# change email or password from settings page with submit handler
putSettings = (event) ->
	data = formToJSON event.target.elements
	data.cookie = readCookie 'do-it'
	console.log data
	address = axios.put '/user', data
	cruds event, address

# logout from any logged in page with click handler
logout = (event) ->
	address = axios.delete '/user/logout'
	cruds event, address

# delete account from settings page with click handler
deleteAccount = (event) ->
	data =
		password: $('#password').val()
		cookie: readCookie 'do-it'
	console.log data
	address = axios.put '/user/delete', data
	cruds event, address

# post new contexts from todos page with submit handler
postContexts = (event) ->
	data = formToJSON event.target.elements
	console.log data
	address = axios.post '/context', data
	cruds event, address

getTodos = (event) ->
	address = axios.get '/context'
	cruds event, address


# $(document).click '#log-out', logout
#$(document).click '#sign-up', getSignup

$(document).ready(() ->
	# redirect to login or todos based on cookie presence
	console.log $('#intro').text().trim()
	auth readCookie 'do-it' if $('#intro').text().trim() == 'Welcome to the do-It task management application'

	# users get and submit handlers
	# $('#sign-up').click getSignup
	# $('#log-in').click getLogin
	# $('#settings').click getSettings
	# $('#signup-form').submit postSignup
	# $('#login-form').submit postLogin
	# $('#change-form').submit putSettings
	# $('#log-out').click logout
	# $('#delete-account').click deleteAccount

	# context submit handler
	# $('#add-context').submit postContexts
	# $('#go-to-dos').click getTodos
)
