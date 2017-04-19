
# table of contents - index.coffee
	# cookies
	# formToJSON function family to convert form input to JSON
	# high-level CRUD operation functions

# ++++++ COOKIES ++++++

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

# ++++++ formToJSON family ++++++

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

# ++++++ high level CRUD operations ++++++

# CRUD operations for non-modal views
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


# CRUD operations to get modal content
modalCruds = (address, modalActions) ->
	address
	.then (data) ->
		console.log data
		options =
			content: data.data
		console.log options
		modalActions options
	.catch (error) ->
		console.log error
		return error

# CRUD operations that submit modal forms and close the modal
closeAndRefresh = (event, address, modalActions) ->
	event.preventDefault()
	$('.fade-and-drop').addClass('.button-click');
	address
	.then (result) ->
		modalActions()
		console.log result
		$('#content').html result.data
		if result.headers.cookie
			createCookie 'do-it', result.headers.cookie, 3
	.catch (error) ->
		console.log error
		return error
