
# DOM operations excluding modal - dom.coffee

# show/hide passwords
hideShow = (event) ->
	console.log 'hide show fired'
	if $(@).hasClass 'show'
		$('.hide-show span').text 'Hide'
		$('[name="password"]').attr 'type', 'text'
		$('[name="newPassword"]').attr 'type', 'text'
		$('.hide-show span').removeClass 'show'
	else
		$('.hide-show span').text 'Show'
		$('[name="password"]').attr 'type', 'password'
		$('[name="newPassword"]').attr 'type', 'password'
		$('.hide-show span').addClass 'show'

# change the password fields back to password input type on submit
hideShowSubmit = ->
	$('.hide-show span').text('Show').addClass 'show'
	$('.hide-show').parent().find('[name="password"]').attr 'type','password'

# toggle radio buttons by clicking the div around their labels
toggleRadios = (event) ->
	if $(@).hasClass 'checked'
		$(@).children('input').prop 'checked', false
		$(@).removeClass 'checked'
	else
		$('*').removeClass 'checked' if $('*').hasClass 'checked'
		$(@).children('input').prop 'checked', true
		$(@).addClass 'checked'

#apply the proper label to the doneness toggle switch on toggle
toggleDone = (event) ->
	if $(@).parent('.done-check').hasClass 'checked1'
		$(@).parent('.done-check').removeClass 'checked1'
		$('input[name="done"]').prop 'checked', false
		$(@).text 'Not Done'
	else
		$(@).parent('.done-check').addClass 'checked1'
		$('input[name="done"]').prop 'checked', true
		$(@).text 'Done'
