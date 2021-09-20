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
 * @param {hello} hello
 * @returns {Hello_Special_Scroll}
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
	var $a_plugin = 'special_scroll';
	
	/**
	 * @description ID pluginu pre opatovne volanie
	 * @type String
	 */
	var $a_id_plugin = $a_ns + hello.identifiers.ns_joiner + $a_plugin;

	/**
	 * 
	 * @param {jQuery/HTML} $p_el
	 * @param {mixed} $p_opts
	 * @returns {Hello_Special_Scroll}
	 */
	function Hello_Special_Scroll($p_el, $p_opts) 
	{
		var $private_defaults = 
		{
			start: 'body',
			gotop: '._go-top',
			showmajor: '._show-major',
			majorhidden: true
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
				this.dom.hide();
				this.scroll();
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
			
			scroll: function()
			{
				showElement(actualScrollPosition(),actionElementPosition(this.opts.start));
			}
		});
		
		/****************************************************************\
		|************************ Private Methods ***********************|
		\****************************************************************/
		var actualScrollPosition = function()
		{
			return $(win).scrollTop();
		};
		
		var actionElementPosition = function($ident)
		{
			var $el = $($ident);
			if ($el.offset()) {
				return ($el.offset().top);
			}
		};
		
		var showElement = function($s_position, $action_position)
		{
			if($s_position > $action_position)
			{
				if(!$this.dom.is(":visible"))
				{
					$this.dom.show();
					if($this.opts.majorhidden === false)
					{
						$this.dom.find('._major').show();
					}
					$this.dom.find('._action-btn').fadeIn(300);
				}
			}
			else
			{
				if($this.dom.is(":visible"))
				{
					$this.dom.hide();
					$this.dom.find('._major').hide();
					$this.dom.find('._action-btn').hide();
				}
			}
		};
		
		/****************************************************************\
		|************************* Events Methods ***********************|
		\****************************************************************/
		
		/**
		 * @description Cavolanie akcie
		 * @param {event} $p_e
		 */
		$(win).on('scroll' + '.' + $a_id_plugin, function($p_e)
		{
			$this.scroll();
		});
		
		$this.dom.find($this.opts.gotop).on('click' + '.' + $a_id_plugin, function($p_e)
		{
			$('body,html').animate({scrollTop:0}, 150);
		});
		
		$this.dom.find($this.opts.showmajor).on('click' + '.' + $a_id_plugin, function($p_e)
		{
			var $toggle = $this.dom.find('._major');
			
			if(!$toggle.is(":visible"))
			{
				$toggle.slideDown(150);
			}
			else
			{
				$toggle.slideUp(150);
			}
		});
	}
	
	/**
	 * @description Zavolanie instancie nad objektom
	 * @param {mixed} $p_opts
	 * @returns {jQuery}
	 */
	$.fn.hello_special_scroll = function($p_opts)
	{
        return this.each(function()
		{
            if (!$(this).data($a_id_plugin))
			{
                $(this).data($a_id_plugin, new Hello_Special_Scroll(this, $p_opts));
			}
        });
	};
})(jQuery, document, hello, window);