/**
 * @author      Milan Kolcak <kolcakmilan@gmail.com>
 * @link        https://www.facebook.com/MilanKolcak
 * @link        https://plus.google.com/u/0/115293588588082222794
 * @created on	06.09.
 * @copyright   2013
 * @version     1.0.0
 */

/**
 * @description Plugin Collapsed
 * 
 * @param {jQuery} $
 * @param {hello} hello
 * @returns {Hello_Collapsed}
 */
;(function($, hello) 
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
	var $a_plugin = 'collapsed';
	
	/**
	 * @description ID pluginu pre opatovne volanie
	 * @type String
	 */
	var $a_id_plugin = $a_ns + hello.identifiers.ns_joiner + $a_plugin;

	/**
	 * 
	 * @param {jQuery/HTML} $p_el
	 * @param {mixed} $p_opts
	 * @returns {Hello_Collapsed}
	 */
	function Hello_Collapsed($p_el, $p_opts) 
	{
		var $private_defaults = 
		{
			collapsed: true,
			speed: 500,
			block: '> div:first',
			handler_change: '.collapsed',
			handler_show: null,
			handler_hide: null,
			handler_flag: 'expand',
			move: 'default'
		};
		
		var $opts = {
			offsetTop: 0
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
				if(this.opts.move !== "default")
				{
					var $dom = (this.opts.block !== false ? this.dom.find(this.opts.block) : this.dom);
					$opts.offsetTop = $dom.show().offset().top;
					$dom.hide();
				}
				
				if(this.opts.collapsed)
				{
					this.show({}, true);
				}
				else
				{
					this.hide({}, true);
				}
				
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
			 * @description Zobrazi objekt
			 * @param {event} $p_e
			 * @param {boolean} $p_fast
			 * @param {mix} $p_data
			 * @param {string} $p_block
			 * @returns {this}
			 */
			show: function($p_e, $p_fast, $p_data, $p_block)
			{
				var $v_opts = $.extend(this.opts, $p_data);
				var $dom = null;
				
				if($p_block !== undefined)
				{
					$dom = $this.dom.find($p_block);
					
					if(!$dom.is(':visible'))
					{
						fswitch($v_opts, $dom, $p_fast, true);
						return;
					}
				}
				
				fswitch($v_opts, ($dom === null ? ($v_opts.block !== false ? this.dom.find($v_opts.block) : this.dom) : $dom), $p_fast);
				
				return this;
			},

			/**
			 * @description Skryje objekt
			 * @param @param {event} $p_e
			 * @param {boolean} $p_fast
			 * @param {mix} $p_data
			 * @returns {this}
			 */
			hide: function($p_e, $p_fast, $p_data, $p_callback)
			{
				var $v_opts = $.extend(this.opts, $p_data);
				
				hide($p_fast, ($v_opts.block !== false ? this.dom.find($v_opts.block).filter(':visible') : this.dom), $v_opts, function()
				{
					if($p_callback && typeof($p_callback) === 'function')
					{
						$p_callback();
					}
				});
				
				return this;
			}
		});
		
		/****************************************************************\
		|************************ Private Methods ***********************|
		\****************************************************************/
				
		var fswitch = function($v_opts, $p_dom, $p_fast, $p_hide)
		{
			var $speed = ($p_fast !== undefined && $p_fast === true ? 0 : $v_opts.speed);

			var $default = function($p_dom)
			{
				if($p_hide === true)
				{
					$this.hide({}, $p_fast, $v_opts, function()
					{
						show($p_fast, $p_dom, $v_opts);
					});
					
					return;
				}
				
				if(!$p_dom.is(':visible'))
				{
					show($p_fast, $p_dom, $v_opts);
				}
			};

			var $animated = function($p_goto, $p_dom)
			{
				$("html, body").animate({scrollTop : $p_goto}, $speed, $default($p_dom));
			};
			
			switch($v_opts.move)
			{
				case "this":
					$animated($opts.offsetTop, $p_dom); return;
					break;

				case "top":
					$animated(0, $p_dom); return;
					break;

				case "default":
					$default($p_dom); return;
					break;
			}

			$animated($v_opts.move, $p_dom);
		}
		
		/**
		 * @description Skrytie definovaneho blocku
		 * @param {boolean} $p_fast
		 * @param {jQuery} $p_dom
		 * @param {mix} $p_opts
		 * @returns {$this}
		 */
		var hide = function($p_fast, $p_dom, $p_opts, $p_callback)
		{
			if($p_dom.is(':visible'))
			{
				if($p_fast !== undefined && $p_fast === true)
				{
					$this.dom.find($p_opts.handler_change).removeClass($p_opts.handler_flag);
					$p_dom.hide().done(function()
					{
						if($p_callback && typeof($p_callback) === 'function')
						{
							$p_callback();
						}						
					});
				}
				else
				{
					$p_dom.slideUp($p_opts.speed, function()
					{
						$this.dom.find($p_opts.handler_change).removeClass($p_opts.handler_flag);
						if($p_callback && typeof($p_callback) === 'function')
						{
							$p_callback();
						}
					});
				}
			}
			else
			{
				if($p_callback && typeof($p_callback) === 'function')
				{
					$p_callback();
				}
			}

			return $this;
		};
		
		/**
		 * @description Zobrazenie definovaneho blocku
		 * @param {boolean} $p_fast
		 * @param {jQuery} $p_dom
		 * @param {mix} $p_opts
		 * @returns {$this}
		 */
		var show = function($p_fast, $p_dom, $p_opts)
		{
			if($p_fast !== undefined && $p_fast === true)
			{
				$this.dom.find($p_opts.handler_change).addClass($p_opts.handler_flag);
				$p_dom.show();
			}
			else
			{
				$p_dom.slideDown($p_opts.speed, function()
				{
					$this.dom.find($p_opts.handler_change).addClass($p_opts.handler_flag);
				});
			}

			return $this;
		};
		
		/****************************************************************\
		|************************* Events Methods ***********************|
		\****************************************************************/
		
		/**
		 * @description Po kliknuti na handler zmeni stav objektu
		 */
		this.dom.find(this.opts.handler_change).on('click' + '.' + $a_id_plugin, function($p_e, $p_data) 
		{
			$this.dom.trigger(hello.identifiers.trigger_change, [$p_data]);
		});
		
		/**
		 * @description Po kliknuti zobrazi objekt
		 */
		this.dom.find(this.opts.handler_show).on('click' + '.' + $a_id_plugin, function($p_e, $p_data) 
		{
			$this.dom.trigger(hello.identifiers.trigger_show, [$p_data]);
		});
		
		/**
		 * @description Po kliknuti skryje objekt
		 */
		this.dom.find(this.opts.handler_hide).on('click' + '.' + $a_id_plugin, function($p_e, $p_data) 
		{
			$this.dom.trigger(hello.identifiers.trigger_hidden, [$p_data]);
		});
		
		/**
		 * @description Trigger na zmenu stavu objektu
		 */
		this.dom.on(hello.identifiers.trigger_change + '.' + $a_id_plugin, function($p_e, $p_data) 
		{
			var $dom = ($p_data !== undefined && $p_data.block !== undefined ? $this.dom.find($p_data.block) : ($this.opts.block !== false ? $this.dom.find($this.opts.block) : $this.dom));
			
			$this.dom.trigger(!$dom.is(':visible') ? hello.identifiers.trigger_show : hello.identifiers.trigger_hidden, [$p_data]);
		});
		
		/**
		 * @description Trigger na zobrazenie objektu
		 */
		this.dom.on(hello.identifiers.trigger_show + '.' + $a_id_plugin, function($p_e, $p_data) 
		{
			$this.show($p_e, false, ($p_data !== undefined && $p_data.data !== undefined ? $p_data.data : {}), ($p_data !== undefined && $p_data.block !== undefined ? $p_data.block : undefined));
		});
		
		/**
		 * @description Trigger na zobrazenie objektu
		 */
		this.dom.on(hello.identifiers.trigger_hidden + '.' + $a_id_plugin, function($p_e, $p_data) 
		{
			$this.hide($p_e, false, ($p_data !== undefined && $p_data.data !== undefined ? $p_data.data : {}));
		});
	}
	
	/**
	 * @description Zavolanie instancie nad objektom
	 * @param {mixed} $p_opts
	 * @returns {jQuery}
	 */
	$.fn.hello_collapsed = function($p_opts)
	{
        return this.each(function()
		{
            if (!$(this).data($a_id_plugin))
			{
                $(this).data($a_id_plugin, new Hello_Collapsed(this, $p_opts));
			}
        });
	};
})(jQuery, hello);