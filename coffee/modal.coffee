
	#define constructor
Modal = (optionsObj) =>

	#global element references
	closeButton: null
	modal: null
	overlay: null

	#define option defaults
	defaults =
		className: 'fade-and-drop'
		closeButton: true
		content: ""
		maxWidth: 1000
		minWidth: 400
		overlay: true

	# #create options by extending defaults with passed in arguments
	options: extendDefaults(defaults, optionsObj)

#public methods
	close: ->
		@.modal.parentNode.removeChild @.modal
		@.overlay.parentNode.removeChild @.overlay
		# _ = @
		# @.modal.className = @.modal.className.replace " modal-is-open", ""
		# @.overlay.className = @.overlay.className.replace " modal-is-open", ""
		# @.modal.addEventListener(@.transitionSelect, ->
		# 	_.modal.parentNode.removeChild _.modal
		# )
		# @.overlay.addEventListener(@.transitionSelect, ->
		# 	_.overlay.parentNode.removeChild _.overlay
		# )

	open: ->
		console.log @.options
		@.buildOut.call(@)
		@.initializeEvents.call(@)
		window.getComputedStyle(@.modal).height
		@.modal.className = "#{@.modal.className}  #{if @.modal.offsetHeight > window.innerHeight then 'modal-is-open anchored' else 'modal-is-open'}"
		@.overlay.className = "#{@.overlay.className} modal-is-open" if @.options.overlay


	buildOut: ->

		# docFrag = document.createDocumentFragment()

		@.modal = document.createElement "div"
		@.modal.className = "project-modal #{@.options.className}"
		@.modal.style.minWidth = "#{@.options.minWidth} px"
		@.modal.style.maxWidth = "#{@.options.maxWidth} px"

		#if close button option is true, add a close button
		if @.options.closeButton
			@.closeButton = document.createElement "button"
			@.closeButton.className = "project-close close-button"
			@.closeButton.innerHTML = "<i class='fa fa-times'></i>"
			@.modal.appendChild @.closeButton

		if @.options.overlay
			@.overlay = document.createElement "div"
			@.overlay.className = "project-overlay #{@.options.className}"
			document.body.appendChild @.overlay

		#create content area and append to modal
		contentHolder = document.createElement "div"
		contentHolder.className = "project-content"
		contentHolder.innerHTML = @.options.content
		@.modal.appendChild contentHolder

		#append modal to document fragment
		# docFrag.appendChild @.modal

		document.body.appendChild @.modal

	initializeEvents: ->
		if @.closeButton
			@.closeButton.addEventListener 'click', @.close.bind(@)

		if @.overlay
			@.overlay.addEventListener 'click', @.close.bind(@)

	transitionSelect: ->
		el = document.createElement "div"
		return "webkitTransitionEnd" if el.style.WebkitTransition
		return "oTransitionEnd" if el.style.OTransition

extendDefaults = (sourceOptions, passedOptions) ->
	sourceCopy = sourceOptions
	for own property of passedOptions
		sourceCopy[property] = passedOptions[property]
	return sourceCopy

editItemModal = null
editContextModal = null
renameContextModal = null
changeContextModal = null
deleteContextModal = null
#define content for the editItemModal options
#by getting server-side hbs template
#then instantiate modal and open

modalCruds = (address, modalActions) ->
	address
	.then (data) ->
		console.log data
		options =
			content: data.data
		console.log options
		modalActions(options)
	.catch (error) ->
		console.log error
		return error

getItemModalContent = (itemId) ->
	console.log itemId
	address = axios.get "/editItemModal/#{itemId}"
	modalActions = (options) ->
		editItemModal = new Modal options
		editItemModal.open()
	modalCruds address, modalActions

getContextModalContent = ->
	address = axios.get "/editContextModal"
	modalActions = (options) ->
		editContextModal = new Modal options
		editContextModal.open()
	modalCruds address, modalActions

getRenameContext = ->
	address = axios.get "/renameContext"
	modalActions = (options) ->
		renameContextModal = new Modal options
		editContextModal.close()
		renameContextModal.open()
	modalCruds address, modalActions

getChangeContext = ->
	address = axios.get "/changeContext"
	modalActions = (options) ->
		changeContextModal = new Modal options
		editContextModal.close()
		changeContextModal.open()
	modalCruds address, modalActions

getDeleteContext = ->
	address = axios.get "/deleteContext"
	modalActions = (options) ->
		deleteContextModal = new Modal options
		editContextModal.close()
		deleteContextModal.open()
	modalCruds address, modalActions

putTodo = (event) ->
	data = formToJSON event.target.elements
	address = axios.put "/item", data
	modalActions =  ->
		editItemModal.close()
	closeAndRefresh event, address, modalActions

deleteTodo = (event) ->
	data = $("[name='id']").val()
	address = axios.delete "/item/#{data}"
	modalActions = ->
		editItemModal.close()
	closeAndRefresh event, address, modalActions

# post new contexts from modal with submit handler
postContexts = (event) ->
	data = formToJSON event.target.elements
	address = axios.post '/context', data
	modalActions = ->
		editContextModal.close()
	closeAndRefresh event, address, modalActions


putRenameContext = (event) ->
	data = formToJSON event.target.elements
	address = axios.put '/renameContext', data
	modalActions = ->
		renameContextModal.close()
	closeAndRefresh event, address, modalActions

putChangeContext = (event) ->
	data = formToJSON event.target.elements
	address = axios.put '/changeContext', data
	modalActions = ->
		changeContextModal.close()
	closeAndRefresh event, address, modalActions

deleteContext = (event) ->
	data = $("[name='contextToDelete']:checked").val()
	address = axios.delete "/deleteContext/#{data}"
	modalActions = ->
		deleteContextModal.close()
	closeAndRefresh event, address, modalActions

closeAndRefresh = (event, address, modalActions) ->
	event.preventDefault()
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
