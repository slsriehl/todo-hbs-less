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
	a = cookies.split(';')
	for i in a
		b = a[i].split('=')
		if b[0] == " #{cookieName}"
			c = JSON.parse(b[1])
	return c

formToJSON = (elements) ->
	[].reduce.call(elements, (data, element) ->
		data[element.name] = element.value
		return data
	, {})

handleSubmit = (event, postTo) ->
	event.preventDefault()
	data = formToJSON event.target.elements
	console.log data
	axios.post(postTo, data)
	.then (result) ->
		console.log result
		$('html').html(result.data)
		# document.write result.data
		createCookie('do-it', result.headers.cookie, 3)
	.catch (error) ->
		console.log error
	return false

handleSignupSubmit = (event) ->
	address = '/user/signup'
	handleSubmit(event, address)

handleLoginSubmit = (event) ->
	address = '/user/login'
	handleSubmit(event, address)

logout = (event) ->
	axios.delete('/user/logout')
	.then (result) ->
		console.log result
		$('html').html(result.data)
		# document.write result.data
	.catch (error) ->
		console.log error

$(document).on('click', '#log-out', logout)

$(document).ready(() ->
	$('#signup-form').submit handleSignupSubmit
	$('#login-form').submit handleLoginSubmit

)
