/**
 * @author      Milan Kolcak <kolcakmilan@gmail.com>
 * @link        https://www.facebook.com/MilanKolcak
 * @link        https://plus.google.com/u/0/115293588588082222794
 * @created on	08.09.
 * @copyright   2013
 * @version     1.2.1
 */

/**
 * @description Iniciator Hello Core
 * 
 * @param {jQuery} $
 * @param {document} doc
 * @param {window} win
 * @returns {Hello_Core}
 */
;(function($, doc, win, hello) 
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
	var $a_plugin = 'core';
	
	/**
	 * @description ID pluginu pre opatovne volanie
	 * @type String
	 */
	var $a_id_plugin = $a_ns + hello.identifiers.ns_joiner + $a_plugin;

	/**
	 * 
	 * @param {jQuery/HTML} $p_el
	 * @param {mixed} $p_opts
	 * @returns {Hello_Core}
	 */
	function Hello_Core($p_el, $p_opts) 
	{
		var $private_defaults = {};
		this.dom = ($p_el instanceof jQuery ? $p_el : $($p_el));
		this.opts = $.extend($private_defaults, $p_opts, this.dom.data($a_id_plugin + '-opts'));
		
		var $this = this;
		
		win.hello_engine = {};
		
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
				h_log('Init: %s', $a_id_plugin);
				this.autoLoad(this.dom);
				
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
			 * @description Vyhladanie a inicializacia pluginov nad objektom
			 * @param {html/jQeury} $p_dom
			 */
			autoLoad: function($p_dom)
			{
				var $for_init = [];
				
				if($p_dom instanceof jQuery)
				{
					$p_dom = $($p_dom);
				}

				$p_dom.find('[data-' + hello.identifiers.init_data + ']').addBack('[data-' + hello.identifiers.init_data + ']').each(function() 
				{
					var $action = $(this).data(hello.identifiers.init_data);
					
					if(!isStringEmpty($action))
					{
						var $init = $(this);

						$.each($action.split(hello.identifiers.plugin_separator), function(index, $value)
						{
							if(!isStringEmpty($value))
							{
								var $method = $value.split(hello.identifiers.init_args_separator);
								var $exelist = $method[0].split(hello.identifiers.ns_separator);
								var $function = ($exelist.length > 1 ? ($exelist[0] + hello.identifiers.ns_joiner + $exelist[1]) : $exelist[0]);
								var $status = load($init, $function, getArgsFromString($method[1]));
								
								if($status === true)
								{
									$for_init.push([$function, $init]);
								}
							}
						});
					}
				});
				
				var $total = $for_init.length;
				$.each($for_init, function($index, $inited)
				{
					callConstrunctor($inited);
					
					if ($index === $total - 1)
					{
						anchorEvent();
					}
				});
			}
		});
		
		/****************************************************************\
		|************************ Private Methods ***********************|
		\****************************************************************/
		
		/**
		 * @description Zavola constructor u pluginu
		 * @param {jQuery} $p_dom
		 * @param {string} $p_function
		 * @param {mixed} $p_args
		 * @returns {boolean}
		 */
		var callConstrunctor = function($p_plugin)
		{
			if($.isFunction($p_plugin[1].data($p_plugin[0])[hello.identifiers.plugin_constructor]))
			{
				$p_plugin[1].data($p_plugin[0])[hello.identifiers.plugin_constructor]();
				
				return true;
			}
			return false;
		};
		
		/**
		 * @description Zavola funkciu nad objektom ak existuje
		 * @param {jQuery} $p_dom
		 * @param {string} $p_function
		 * @param {mixed} $p_args
		 * @returns {boolean}
		 */
		var call = function($p_dom, $p_function, $p_args)
		{
			if($.isFunction($p_dom[$p_function]))
			{
				$p_dom[$p_function].apply($p_dom, $p_args);
				
				return true;
			}
			return false;
		};
		
		/**
		 * @description Vola potrebne pluginy a odfiltruje neexistujuce
		 * @param {jQuery} $p_dom
		 * @param {string} $p_function
		 * @param {mixed} $p_args
		 * @return {boolean}
		 */
		var load = function($p_dom, $p_function, $p_args)
		{
			var $status;
			
			$.each([$p_dom,win], function($index, $obj)
			{
				$status = call($obj, $p_function, $p_args);
				
				if($status === true)
				{
					h_log('Loading: %s', $p_function);
					return false;
				}
			});
			
			if($status === false)
			{
				h_log('Constructor cant load: %s', $p_function);
				return false;
			}
			
			return true;
		};
		
		var anchorEvent = function()
		{
			var $anchor = win.location.hash.substring(1);
			if(!isStringEmpty($anchor))
			{
				var $def = $anchor.split(':');
				var $trigger = ($def[1] !== undefined ? hello.identifiers['trigger_' + $def[1]] : 'click');
				setTimeout(function()
				{
					$this.dom.find('#' + $def[0].replace('t_', '')).trigger($trigger);
				}, 500);
			}
		};
		
		/****************************************************************\
		|************************* Events Methods ***********************|
		\****************************************************************/
		$this.dom.on(hello.identifiers.trigger_actived_content, function($p_event, $p_data) 
		{
			$this.autoLoad($(this));
		});
	}
	
	/**
	 * @description Zavolanie instancie nad objektom
	 * @param {mixed} $p_opts
	 * @returns {jQuery}
	 */
	$.fn.hello_core = function($p_opts)
	{
        return this.each(function()
		{
            if (!$(this).data($a_id_plugin))
			{
                $(this).data($a_id_plugin, new Hello_Core(this, $p_opts).__construct());
			}
        });
	};
	
    $.fn.disableSelection = function()
	{
		/**
		 * :not(' + hello.identifiers.document_disable_ignor  + ')'
		 */
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
	
	/**
	 * @description Autoinicializacia Hello Core
	 */
	$(doc).ready(function()
	{
		$(this).hello_core();
		if(hello.identifiers.document_disable_select === true)
		{
			$(this).disableSelection();
		}
	});
})(jQuery, document, window, hello);
