
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
		_ = @
		@.modal.className = @.modal.className.replace " modal-is-open", ""
		@.overlay.className = @.overlay.className.replace " modal-is-open", ""
		@.modal.addEventListener(@.transitionSelect, ->
			_.modal.parentNode.removeChild _.modal
		)
		@.overlay.addEventListener(@.transitionSelect, ->
			_.overlay.parentNode.removeChild _.overlay if _.overlay.parentNode
		)

	open: ->
		console.log @.options
		@.buildOut.call(@)
		@.initializeEvents.call(@)
		window.getComputedStyle(@.modal).height
		@.modal.className = "#{@.modal.className}  #{if @.modal.offsetHeight > window.innerHeight then 'modal-is-open anchored' else 'modal-is-open'}"
		@.overlay.className = "#{@.overlay.className} modal-is-open" if @.options.overlay


	buildOut: ->

		docFrag = document.createDocumentFragment()

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
			docFrag.appendChild @.overlay

		#create content area and append to modal
		contentHolder = document.createElement "div"
		contentHolder.className = "project-content"
		contentHolder.innerHTML = @.options.content
		@.modal.appendChild contentHolder

		#append modal to document fragment
		docFrag.appendChild @.modal

		document.body.appendChild docFrag

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

#define content for the editItemModal options
#by getting server-side hbs template
#then instantiate modal and open
getModalContent = (itemId) ->
	cookie = readCookie('do-it')
	console.log itemId
	axios.get "/editItemModal/#{itemId}", {headers: {'clientcookie': cookie}}
	.then (data) ->
		console.log data
		options =
			content: data.data
		console.log options
		editItemModal = new Modal options
		editItemModal.open()
	.catch (error) ->
		console.log error
		return error
