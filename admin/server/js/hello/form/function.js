/**
 * @author      Milan Kolcak <kolcakmilan@gmail.com>
 * @link        https://www.facebook.com/MilanKolcak
 * @link        https://plus.google.com/u/0/115293588588082222794
 * @created on	06.09.
 * @copyright   2013
 * @version     1.0.0
 */

/**
 * @description Globalne ovladacie prvky pre rozne akcie
 * 
 * @param {jQuery} $
 * @param {document} doc
 * @param {hello} hello
 * @param {window} win
 * @returns {Hello_Form}
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
	var $a_plugin = 'form';
	
	/**
	 * @description ID pluginu pre opatovne volanie
	 * @type String
	 */
	var $a_id_plugin = $a_ns + hello.identifiers.ns_joiner + $a_plugin;

	/**
	 * 
	 * @param {jQuery/HTML} $p_el
	 * @param {mixed} $p_opts
	 * @returns {Hello_Form}
	 */
	function Hello_Form($p_el, $p_opts) 
	{
		var $private_defaults = 
		{
			data: undefined
		};
		
		this.dom = ($p_el instanceof jQuery ? $p_el : $($p_el));
		this.opts = $.extend($private_defaults, $p_opts, this.dom.data($a_id_plugin + '-opts'));
		
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
				formatInput();
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
			 * @description Zmena stavu
			 * @param {jQuery} $p_obj
			 * @param {object} $p_data
			 */
			change_input: function($p_obj, $p_data)
			{
				change_input($p_obj, $p_data);
			},
			
			/**
			 * @description Zmena stavu
			 * @param {jQuery} $p_obj
			 * @param {object} $p_data
			 */
			change_select: function($p_obj, $p_data)
			{
				change_select($p_obj, $p_data);
			},
			
			reset: function()
			{
				this.dom[0].reset();
				$this.dom.find('select').each(function()
				{
					if($(this).data($a_id_plugin + '-formating'))
					{
						$(this).trigger('visual_change', [{actual:{value: $(this).val()}}]);
					}
				});
			}
		});
		
		/****************************************************************\
		|************************ Private Methods ***********************|
		\****************************************************************/
		
		/**
		 * @description Inputy
		 */
		var formatInput = function()
		{
			$this.dom.find('input, textarea, select').each(function()
			{
				var $opts = $(this).data($a_id_plugin + '-opts');
				if($opts !== undefined)
				{
					if($.isFunction($(this)[$opts.style]))
					{
						$(this).data($a_id_plugin + '-formating', $opts.style);
						$(this)[$opts.style].apply($(this), [$opts.opts]);
					}
				}
			});
		};
		
		/**
		 * @description Zmena stavu
		 * @param {jQuery} $p_obj
		 * @param {object} $p_data
		 */
		var change_input = function($p_obj, $p_data)
		{
			
		};
		
		/**
		 * @description Zmena stavu
		 * @param {jQuery} $p_obj
		 * @param {object} $p_data
		 */
		var change_select = function($p_obj, $p_data)
		{
			if($p_data.actual && $p_data.actual.value !== undefined)
			{
				$p_obj.find('option[value="' + $p_data.actual.value + '"]').prop('selected', true);
			}
		};
		
		/****************************************************************\
		|************************* Events Methods ***********************|
		\****************************************************************/
		
		/**
		 * @description Cavolanie akcie
		 * @param {event} $p_e
		 * @param {object} $p_data
		 */
		this.dom.find('input, textarea').on('visual_change' + '.' + $a_id_plugin, function($p_e, $p_data)
		{
			$this.change_input($(this), $p_data);
		});
		
		/**
		 * @description Cavolanie akcie
		 * @param {event} $p_e
		 * @param {object} $p_data
		 */
		this.dom.on(hello.identifiers.trigger_reset_form + '.' + $a_id_plugin, function($p_e, $p_data)
		{
			$this.reset();
		});
		
		/**
		 * @description Cavolanie akcie
		 * @param {event} $p_e
		 * @param {object} $p_data
		 */
		this.dom.find('select').on('visual_change' + '.' + $a_id_plugin, function($p_e, $p_data)
		{
			$this.change_select($(this), $p_data);
		});
	}
	
	/**
	 * @description Zavolanie instancie nad objektom
	 * @param {mixed} $p_opts
	 * @returns {jQuery}
	 */
	$.fn.hello_form = function($p_opts)
	{
        return this.each(function()
		{
            if (!$(this).data($a_id_plugin))
			{
                $(this).data($a_id_plugin, new Hello_Form(this, $p_opts));
			}
        });
	};
})(jQuery, document, hello, window);