


createCookie = (name, value, days) ->
	if(days)
		date = new Date()
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
		expires = "; expires=#{date.toGMTString()}"
	else
		expires = ''
	document.cookie = "#{name}=#{value}#{expires}; path=/"

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

formToJSON = (elements) ->
	[].reduce.call(elements, (data, element) ->
		data[element.name] = element.value
		return data
	, {})

auth = (cookie) ->
	if cookie and cookie != 'undefined'
		console.log 'auth fired'
		axios.get("/auth/#{cookie}")
		.then (result) ->
			console.log result
			$('body').html result.data
		.catch (error) ->
			console.log error
	else
		getLogin null

getDelete = (event, getDeleteTo) ->
	event.preventDefault() if event
	getDeleteTo
	.then (result) ->
		console.log result
		$('body').html result.data
	.catch (error) ->
		console.log error

postPut = (event, postPutTo) ->
	event.preventDefault()
	postPutTo
	.then (result) ->
		console.log result
		$('body').html result.data
		createCookie('do-it', result.headers.cookie, 3)
	.catch (error) ->
		console.log error

getSignup = (event) ->
	address = axios.get '/user/signup'
	getDelete(event, address)

getLogin = (event) ->
	address = axios.get '/user/login'
	getDelete(event, address)

getSettings = (event) ->
	cookie = readCookie('do-it')
	address = axios.get "/user/#{cookie}"
	getDelete(event, address)

postSignup = (event) ->
	# if $('[name="email"]').val() != $('[name="emailConf"]').val()
	# 	$('[name="emailConf"]')[0].setCustomValidity 'Emails must match'
	# else if $('[name="password"]').val() != $('[name="passwordConf"]').val()
	# 	$('[name="passwordConf"]')[0].setCustomValidity 'Passwords must match'
	# else
	# 	$('[name="emailConf"]')[0].setCustomValidity ''
	# 	$('[name="passwordConf"]')[0].setCustomValidity ''
	data = formToJSON event.target.elements
	console.log data
	address = axios.post('/user/signup', data)
	postPut(event, address)

postLogin = (event) ->
	data = formToJSON event.target.elements
	address = axios.post('/user/login', data)
	postPut(event, address)

putSettings = (event) ->
	data = formToJSON event.target.elements
	data.cookie = readCookie 'do-it'
	console.log data
	address = axios.put('/user', data)
	postPut(event, address);

logout = (event) ->
	address = axios.delete '/user/logout'
	getDelete(event, address)

deleteAccount = (event) ->
	data =
		password: $('#password').val()
		cookie: readCookie 'do-it'
	console.log data
	address = axios.put("/user/delete", data)
	getDelete(event, address)

# $(document).on('click', '#sign-up', getSignup)
# $(document).on('click', '#log-in', getLogin)
# $(document).on('click', '#settings', getSettings)
# $(document).on('submit', '#signup-form', postSignup)
# $(document).on('submit', '#login-form', postLogin)
# $(document).on('submit', '#change-form', putSettings)
# $(document).on('click', '#log-out', logout)
$(document).ready(() ->
	$('#sign-up').click getSignup
	$('#log-in').click getLogin
	$('#settings').click getSettings
	$('#signup-form').submit postSignup
	$('#login-form').submit postLogin
	$('#change-form').submit putSettings
	$('#log-out').click logout
	$('#delete-account').click deleteAccount

	console.log $('#intro').text().trim()
	auth readCookie 'do-it' if $('#intro').text().trim() == 'Welcome to the do-It task management application'

)
