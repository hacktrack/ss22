/**
 * @author      Milan Kolcak <kolcakmilan@gmail.com>
 * @link        https://www.facebook.com/MilanKolcak
 * @link        https://plus.google.com/u/0/115293588588082222794
 * @created on	06.09.
 * @copyright   2013
 * @version     1.0.0
 */

/**
 * @description Ajax
 * 
 * @param {jQuery} $
 * @param {hello} hello
 * @returns {Hello_Ajax}
 */
;(function($, doc, hello, win) 
{
	"use strict";

	/**
	 * @description Namespace pluginu
	 * @type String
	 */
	var $a_ns = hello.identifiers.namespace;
	
	/**
	 * @description Meno pluginu
	 * @type String
	 */
	var $a_plugin = 'ajax';
	
	/**
	 * @description ID pluginu pre opatovne volanie
	 * @type String
	 */
	var $a_id_plugin = $a_ns + hello.identifiers.ns_joiner + $a_plugin;

	/**
	 * 
	 * @param {jQuery/HTML} $p_el
	 * @param {mixed} $p_opts
	 * @returns {Hello_Ajax}
	 */
	function Hello_Ajax($p_el, $p_opts) 
	{
		var $private_defaults = 
		{
			handler: undefined
		};
		
		this.dom = ($p_el instanceof jQuery ? $p_el : $($p_el));
		this.opts = $.extend($private_defaults, $p_opts, this.dom.data($a_id_plugin + '-opts'));
		
		this.running = false;
		
		var $this = this;
		
		/****************************************************************\
		|************************ Public Methods ************************|
		\****************************************************************/
		$.extend(this, 
		{
			/**
			 * @description Plugin construktor
			 * @returns {this}
			 */
			__construct: function()
			{
				this.dom.attr('noValidate', true);
				return this;
			},
					
			/**
			 * @description Plugin destructor
			 */	
			__destruct: function()
			{
				this.dom.off('.' + $a_id_plugin);
				this.dom.find('*').off('.' + $a_id_plugin);
				this.dom.removeData($a_id_plugin);
				this.dom = null;
			},

			/**
			 * @description Zavolanie akcie
			 */
			form: function($p_e)
			{
				if(!this.running)
				{
					this.running = true;
					form($p_e);
				}
			}
		});
		
		/****************************************************************\
		|************************ Private Methods ***********************|
		\****************************************************************/
		var form = function($p_e)
		{
			if(validate($p_e))
			{
				if($this.dom.hasClass('_no-ajax'))
				{
					$this.dom.submit();
				}
				else
				{
					postAjax('post', $this.dom.attr('action'), $this.dom.serialize(), $p_e);
				}
			}
			else
			{
				$this.running = false;
			}
		};
		
		var validate = function($p_e)
		{
			var $return = true;

			$(doc).trigger('click.form_validate');
			
			$this.dom.find('*[data-nette-rules]').each(function()
			{
				var $input = $(this);
				
				if($input.data('key') !== undefined)
				{
					$input.val($(this).data('key'));
				}
				
				$.each(nette_parseJSON($input.data('netteRules')), function()
				{
					switch(this.op)
					{
						case ':filled':
							if(isStringEmpty($input.val().trim()) || $input.is("[type='checkbox']:not(:checked)"))
							{
								$return = false;
								showError($input, $p_e.target, this.msg);
							}
							break;
							
						case ':minLength':
							if($input.val().trim().length < this.arg)
							{
								$return = false;
								showError($input, $p_e.target, this.msg);
							}
							break;
					}
					
					if(!$return)
					{
						return false;
					}
				});
				
				if(!$return)
				{
					return false;
				}
			});
			
			return $return;
		};
		
		var showError = function($p_input, $p_target, $p_msg)
		{
			/*
			<div class="errorBubble _form-error" style="top: 71px; left: 302.5px; display: none;">
				<span class="arr_t"></span>
				<div class="inside">validate error</div>
			</div>
			*/

			var $error = $('<div>', {class:'errorBubble _form-error'}).append($('<span>', {class:'arr_t'})).css({top: $p_input.position().top + $p_input.outerHeight() + 10, left: $p_input.position().left});
			var $content = $('<div>', {class:'inside'}).html($p_msg);

			$p_input.parent().append($error.append($content));
			
			$(doc).on('click.form_validate' , function($p_e)
			{
				if(!$($p_e.target).is($error.find('*')) && $p_e.target !== $p_target)
				{
					$error.fadeOut(100, function()
					{
						$(this).remove();
					});
					$(this).off('click.form_validate');
				}
			});
		};
		
		var postAjax = function($p_type , $p_url, $p_data, $p_e)
		{
			$.ajax({
				type: $p_type,
				url: $p_url,
				data: $p_data,
				cache: false,
				context: this,
				async: true,
				beforeSend: function()
				{
					$this.running = true;
					$this.dom.trigger(hello.identifiers.trigger_ajax_before, arguments);
					$('body,input').css('cursor', 'wait');
				},
				success: function(data)
				{
					if(data.redirect)
					{
						win.location.href = data.redirect;
						return false;
					}
					
					if(data.snippets !== undefined)
					{
						$.each(data.snippets,function($sid, $shtml)
						{
							$(doc).trigger(hello.identifiers.trigger_actived_content, $('#' + $sid).html($shtml));
						});
					}
					
					if(data.code !== undefined)
					{
						if(data.code === 200)
						{
							$this.dom.trigger(hello.identifiers.trigger_ajax_success, arguments);
						}
						else if(data.code === 300) //server validacia
						{
							$.each(data.error, function($name, $msg)
							{
								showError($this.dom.find('*[name=' + $name + ']'), $p_e, (isArray($msg)? $msg[0] : $msg));
							});
						}
						else
						{
							$this.dom.trigger(hello.identifiers.trigger_ajax_error_app, arguments);
						}
					}
				},
				error: function()
				{
					$this.dom.trigger(hello.identifiers.trigger_ajax_error_server, arguments);
				},
				complete: function()
				{
					$this.running = false;
					$('body,input').css('cursor', 'default');
					$this.dom.trigger(hello.identifiers.trigger_ajax_complete, arguments);
				}
			});
		};
		
		/****************************************************************\
		|************************* Events Methods ***********************|
		\****************************************************************/
		
		if(this.dom.prop('tagName').toLowerCase() === 'form')
		{
			/**
			 * @description Zavolanie akcie
			 * @param {event} $p_e
			 */
			this.dom.on('submit.' + $a_id_plugin, function($p_e)
			{
				$p_e.preventDefault();

				$this.form($p_e);
			});
		}
		
		if(this.opts.handler !== undefined)
		{
			/**
			 * @description Zavolanie akcie
			 * @param {event} $p_e
			 * @param {object} $p_data
			 */
			$('*').find(this.opts.handler).on('click.' + $a_id_plugin, function($p_e, $p_data)
			{
				console.log('handler nepodporovany')
				console.log($this.dom)
			});
		}
	}
	
	/**
	 * @description Zavolanie instancie nad objektom
	 * @param {mixed} $p_opts
	 * @returns {jQuery}
	 */
	$.fn.hello_ajax = function($p_opts)
	{
        return this.each(function()
		{
            if (!$(this).data($a_id_plugin))
			{
                $(this).data($a_id_plugin, new Hello_Ajax(this, $p_opts));
			}
        });
	};
})(jQuery, document, hello, window);