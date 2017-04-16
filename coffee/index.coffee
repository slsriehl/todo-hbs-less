

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
	

# validate the fields sent to form to JSON so they're excluded if blank
isValidElement = (element) ->
	return element.name and element.value

# check if a checkbox is checked and include in formToJSON
isValidValue = (element) ->
	return (!['checkbox', 'radio'].includes(element.type) or element.checked)

# convert the input in the form inputs into a json object
formToJSON = (elements) ->
	[].reduce.call(elements, (data, element) ->
		if isValidElement(element) and isValidValue(element)
			data[element.name] = element.value
		return data
	, {})

# the root of all axios calls in the front end script
cruds = (event, address) ->
	event.preventDefault() if event
	address
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
		# console.log 'auth fired'
		address = axios.get '/item'
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

# show todos and contexts
getTodos = (event) ->
	address = axios.get '/item'
	cruds event, address

# show/hide passwords
hideShow = (event) ->
	console.log 'hide show fired'
	if $(this).hasClass 'show'
		$('.hide-show span').text 'Hide'
		$('[name="password"]').attr 'type', 'text'
		$('[name="newPassword"]').attr 'type', 'text'
		$('.hide-show span').removeClass 'show'
	else
		$('.hide-show span').text 'Show'
		$('[name="password"]').attr 'type', 'password'
		$('[name="newPassword"]').attr 'type', 'password'
		$('.hide-show span').addClass 'show'

# change the password fields back to password input type on submit
hideShowSubmit = ->
	$('.hide-show span').text('Show').addClass 'show'
	$('.hide-show').parent().find('[name="password"]').attr 'type','password'

# toggle radio buttons by clicking the div around their labels
toggleRadios = (event) ->
	if $(this).hasClass 'checked'
		$(this).children('input').prop 'checked', false
		$(this).removeClass 'checked'
	else
		$('*').removeClass 'checked' if $('*').hasClass 'checked'
		$(this).children('input').prop 'checked', true
		$(this).addClass 'checked'

#apply the proper label to the doneness toggle switch on toggle
toggleDone = (event) ->
	if $(this).parent('.done-check').hasClass 'checked1'
		$(this).parent('.done-check').removeClass 'checked1'
		$('input[name="done"]').prop 'checked', false
		$(this).text 'Not Done'
	else
		$(this).parent('.done-check').addClass 'checked1'
		$('input[name="done"]').prop 'checked', true
		$(this).text 'Done'
