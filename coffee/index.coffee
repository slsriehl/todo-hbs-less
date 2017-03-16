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

getLoginSignup = (event, pathTo) ->
	axios.get(pathTo)
	.then (result) ->
		console.log result
		$('body').html result.data
	.catch (error) ->
		console.log error

postLoginSignup = (event, postTo) ->
	data = formToJSON event.target.elements
	console.log data
	axios.post(postTo, data)
	.then (result) ->
		console.log result
		$('body').html result.data
		createCookie('do-it', result.headers.cookie, 3)
	.catch (error) ->
		console.log error
	return false

getSignup = (event) ->
	address = '/user/signup'
	getLoginSignup(event, address)

getLogin = (event) ->
	address = '/user/login'
	getLoginSignup(event, address)

postSignup = (event) ->
	address = '/user/signup'
	postLoginSignup(event, address)

postLogin = (event) ->
	address = '/user/login'
	postLoginSignup(event, address)

logout = (event) ->
	axios.delete('/user/logout')
	.then (result) ->
		console.log result
		$('body').html result.data
	.catch (error) ->
		console.log error

$(document).on('click', '#sign-up', getSignup)
$(document).on('click', '#log-in', getLogin)
$(document).on('submit', '#signup-form', postSignup)
$(document).on('submit', '#login-form', postLogin)
$(document).on('click', '#log-out', logout)
