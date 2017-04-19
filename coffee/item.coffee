
# Item/Task/Todo/To-Do front end CRUD operations - item.coffee

addItemModal = null
editItemModal = null

# determine if a cookie is present on the client on initial load
# and call for the login or the todos page accordingly
auth = (cookie) ->
	if cookie and cookie != 'undefined'
		# console.log 'auth fired'
		address = axios.get '/item'
		cruds event, address
	else
		getLogin null

# show todos and contexts
getTodos = (event) ->
	address = axios.get '/item'
	cruds event, address

# get add item modal
getAddTodoModal = ->
	address = axios.get "/addItemModal"
	modalActions = (options) ->
		addItemModal = new Modal options
		addItemModal.open()
	modalCruds address, modalActions

# get edit item modal
getEditTodoModal = (itemId) ->
	console.log itemId
	address = axios.get "/editItemModal/#{itemId}"
	modalActions = (options) ->
		editItemModal = new Modal options
		editItemModal.open()
	modalCruds address, modalActions

# post from add item modal
postNewTodo = (event) ->
	data = formToJSON event.target.elements
	console.log data
	address = axios.post '/item', data
	modalActions = ->
		addItemModal.close()
	closeAndRefresh event, address, modalActions

# put an edited todo
putTodo = (event) ->
	data = formToJSON event.target.elements
	address = axios.put "/item", data
	if !$('[name="ContextId"]').val()
		$('.original-check').prop 'checked', true
	modalActions =  ->
		editItemModal.close()
	closeAndRefresh event, address, modalActions

# delete a todo
deleteTodo = (event) ->
	data = $("[name='id']").val()
	address = axios.delete "/item/#{data}"
	modalActions = ->
		editItemModal.close()
	closeAndRefresh event, address, modalActions
