/**
 * @author Lukas Skywalker <lukas.paiskr@icewarp.com>
 */
if (typeof jQuery === "undefined") { throw new Error("Apps's JavaScript requires jQuery") }
var tooltip = function() {
	var template = '<div class="tooltip top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
	var _createTemplate = function(text){
		return '<div class="tooltip top show" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+text+'</div></div>';
	};
	return {
		init: function() {
			$('.tooltip-feature').hover(
				function() {
					if($(this).css('position') == 'absolute')
						$(this).css('position','absolute').prepend(_createTemplate($(this).data('content')));
					else
						$(this).css('position','relative').prepend(_createTemplate($(this).data('content')));

				},
				function() {
					$(this).find('.tooltip').remove();
				}
			);
			$('.tooltip-feature:not(.sprite-purchase-icon-red-circle)').on('click', function(e){
				e.preventDefault();
				if($(this).find('.tooltip').length > 0){
					$(this).find('.tooltip').remove();
				}else {
					$(this).prepend(_createTemplate($(this).data('content')));
				}
			});
		}
	};
}();
$.fn.pressEnter = function(fn) {

	return this.each(function() {
		$(this).bind('enterPress', fn);
		$(this).keyup(function(e){
			if(e.keyCode == 13)
			{
				$(this).trigger("enterPress");
			}
		})
	});
};
$(function(){
	tooltip.init();
	$('input.enter-save ').pressEnter(function(){
		$('#save_and_continue').trigger('click');
	});
	$('input.enter-save-form ').pressEnter(function(e){
		e.preventDefault();
		$('#save_form_continue').trigger('click');
	});
	$('input.enter-reload-form ').pressEnter(function(e){
		e.preventDefault();
		$(this).trigger('change');
	});
	$('#save_and_continue').click(function(e) {
		e.preventDefault();
		var formID = $(this).data('form-id');
		$('.' + formID).submit();
	});
	$('#back').click(function(e) {
		e.preventDefault();
		var link = $(this).data('link');
		window.location.href = link;
	});

});
function initDnsForm(){
	$( "#frm-editDnsForm-editDnsForm" ).submit(function( event ) {
		event.preventDefault();

		var posting = $.post($('#frm-editDnsForm-editDnsForm').attr('action'),$('#frm-editDnsForm-editDnsForm').serialize());
		posting.done(function( data ) {
			if(data.status == true)
				alert('File with DNS settings was sent to your mail box.');

		});
	});
}