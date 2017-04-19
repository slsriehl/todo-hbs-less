
# Context front-end CRUD operations - context.coffee

editContextModal = null
renameContextModal = null
changeContextModal = null
deleteContextModal = null

# get the edit context modal with click handler
getEditContextModal = ->
	address = axios.get "/editContextModal"
	modalActions = (options) ->
		editContextModal = new Modal options
		editContextModal.open()
	modalCruds address, modalActions

# get the rename context modal with click handler
getRenameContext = ->
	address = axios.get "/renameContext"
	modalActions = (options) ->
		renameContextModal = new Modal options
		editContextModal.close()
		renameContextModal.open()
	modalCruds address, modalActions

# get the change context modal with click handler
getChangeContext = ->
	address = axios.get "/changeContext"
	modalActions = (options) ->
		changeContextModal = new Modal options
		editContextModal.close()
		changeContextModal.open()
	modalCruds address, modalActions

# get the delete context modal with click handler
getDeleteContext = ->
	address = axios.get "/deleteContext"
	modalActions = (options) ->
		deleteContextModal = new Modal options
		editContextModal.close()
		deleteContextModal.open()
	modalCruds address, modalActions

# post new contexts from modal with submit handler
postContexts = (event) ->
	data = formToJSON event.target.elements
	address = axios.post '/context', data
	modalActions = ->
		editContextModal.close()
	closeAndRefresh event, address, modalActions

# rename contexts from modal with submit handler
putRenameContext = (event) ->
	data = formToJSON event.target.elements
	address = axios.put '/renameContext', data
	modalActions = ->
		renameContextModal.close()
	closeAndRefresh event, address, modalActions

# change contexts from modal with submit handler
putChangeContext = (event) ->
	data = formToJSON event.target.elements
	address = axios.put '/changeContext', data
	modalActions = ->
		changeContextModal.close()
	closeAndRefresh event, address, modalActions

# delete contexts from modal with submit handler
deleteContext = (event) ->
	data = $("[name='contextToDelete']:checked").val()
	address = axios.delete "/deleteContext/#{data}"
	modalActions = ->
		deleteContextModal.close()
	closeAndRefresh event, address, modalActions
