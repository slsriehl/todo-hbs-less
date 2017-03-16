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

handleSignupSubmit = (event) ->
	event.preventDefault()
	data = formToJSON event.target.elements
	console.log data
	axios.post('/user/signup', data)
	.then (result) ->
		console.log result
		document.write result.data
		value = result.headers.cookie
		console.log value
		createCookie('do-it', value, 3)
	.catch (error) ->
		console.log error
	return false

$(document).ready(() ->
	$('#signup-form').submit handleSignupSubmit
)
