formToJSON = (elements) ->
	[].reduce.call(elements, (data, element) ->
		data[element.name] = element.value
		return data
	, {})

handleSignupSubmit = (event) ->
	event.preventDefault()
	data = formToJSON event.target.elements
	console.log data
	axios.post('/user/signup', data, {headers: {'Accept': 'text/html'}})
	.then (result) ->
		console.log result
	.catch (error) ->
		console.log error
	return false

$('#signup-form').submit handleSignupSubmit
