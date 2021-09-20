/**
 * @author      Milan Kolcak <kolcakmilan@gmail.com>
 * @link        https://www.facebook.com/MilanKolcak
 * @link        https://plus.google.com/u/0/115293588588082222794
 * @created on	18.10.
 * @copyright   2013
 * @version     1.0.0
 */

;(function($, doc, hello) 
{
	$('form._success-fade-form').on(hello.identifiers.trigger_ajax_success, function()
	{
		var $this = $(this);
		var $block = $this.closest('._container');
		
		var revert = function()
		{
			$this.trigger(hello.identifiers.trigger_reset_form);
			
			$block.find('._success').fadeOut(function()
			{
				$this.fadeIn();
			});
		};

		var close = function() {
			$(".pop-close").trigger('click');
			setTimeout(function()
			{
				revert();

			}, 1000);
		};
		
		$this.fadeOut(function() 
		{
			$block.find('._success').fadeIn(function()
			{
				setTimeout(function()
				{
					if($block.find('._success').hasClass('_close'))
					{
						close();
					}else {
						revert();
					}

				}, 2000);
			});
		});
	});
	
	$('FORM._reg1-form').on(hello.identifiers.trigger_ajax_success, function()
	{
		$(this).closest('.carrousel-wrap').trigger('nextstep');
	});
	
	$('FORM._p-reg2-form').on(hello.identifiers.trigger_ajax_success, function($e, $data)
	{
		$('#public-reg-accordion').animate({opacity: 0},200, function()
		{
			$('#vncWindow').addClass('act').append($data.html).find('._rdp-box').trigger('spawn');
		});
	});
})(jQuery, document, hello);