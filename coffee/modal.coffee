
#create an immediately invoked functional expression
(->
	#define constructor
	@.Modal = ->
		#global element references
		@.closeButton = null
		@.modal = null
		@.overlay = null

		#determine proper transition prefix
		@.transitionEnd = transitionSelect()

		#define option defaults
		defaults =
			className: 'fade-and-drop'
			closeButton: true
			content: ""
			maxWidth: 1000
			minWidth: 400
			overlay: true

		#create options by extending defaults with passed in arguments
		if arguments[0] and typeof arguments[0] === "object"
			@.options = extendDefaults defaults, arguments[0]

	#public methods
	Modal.prototype.close = ->
		_ = @
		@.modal.className = @.modal.className.replace " modal-is-open", ""
		@.overlay.className = @.overlay.className.replace " modal-is-open", ""
		@.modal.addEventListener(@.transitionEnd, ->
			_.modal.parentNode.removeChild _.modal
		)
		@.overlay.addEventListener(@.transitionEnd, ->
			_.overlay.parentNode.removeChild _.overlay if _.overlay.parentNode
		)

	Modal.prototype.open = ->
		buildOut.call @
		initializeEvents.call @
		window.getComputedStyle(@.modal).height
		@.modal.className = "#{@.modal.className}  #{if @.modal.offsetHeight > window.innerHeight then 'modal-is-open anchored' else 'modal-is-open'}"
		@.overlay.className = "#{@.overlay.className} modal-is-open"

	#private methods
	buildOut = ->
		if typeof @.options.content === "string"
			content = @.options.content
		else
			content = @.options.content.innerHTML

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
			@.modal.appendChild(@.closeButton)

		if @.options.overlay
			@.overlay = document.createElement "div"
			@.overlay.className = "project-overlay #{@.options.className}"
			docFrag.appendChild(@.overlay)

		#create content area and append to modal
		contentHolder = document.createElement "div"
		contentHolder.className = "project-content"
		contentHolder.innerHTML = content
		@.modal.appendChild contentHolder

		#append modal to document fragment
		docFrag.appendChild(@.modal)

		document.body.appendChild docFrag

		extendDefaults = (source, properties) ->
			for property in properties
				if properties.hasOwnProperty property
					source[property] = properties[property]
			return source

		initializeEvents = ->
			if @.closeButton
				@.closeButton.addEventListener 'click', @.close.bind(@)

			if @.overlay
				@.overlay.addEventListener 'click', @.close.bind(@)

		transitionSelect = ->
			el = document.createElement "div"
			return "webkitTransitionEnd" if el.style.WebkitTransition
			return "oTransitionEnd" if el.style.OTransition
()
)
