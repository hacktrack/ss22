/**
 * @author      Milan Kolcak <kolcakmilan@gmail.com>
 * @link        https://www.facebook.com/MilanKolcak
 * @link        https://plus.google.com/u/0/115293588588082222794
 * @created on	05.09.
 * @copyright   2013
 * @version     1.0.0
 */

/**
 * @param {type} $str
 * @returns {boolean}
 */
function isStringEmpty($str)
{
	return (((!$str || /^\s*$/.test($str)) || (!$str || 0 === $str.length)) ? true : false);
}

function isArrayEmpty($array)
{
	return ($array.length === 0 ? true : false);
}

function isArray($var)
{
	return (Object.prototype.toString.call($var) === '[object Array]' ? true : false);
}

if (!String.prototype.format)
{
	String.prototype.format = function() {
		var formatted = this;
		for (arg in arguments) {
			formatted = formatted.replace("{" + arg + "}", arguments[arg]);
		}
		return formatted;
	};
}

/**
 * 
 * @param {mixed} $args
 * @returns {undefined}
 */
function h_log($args)
{
	if(window.consolestop === undefined)
	{
		if(!$('body').hasClass('__debug'))
		{
			if (!window.console)
			{
				window.console = {};
			}

			var methods = ["log", "debug", "warn", "info"];
			for (var i = 0; i < methods.length; i++)
			{
				window.console[methods[i]] = function() {};
			}
			window.consolestop = true;
		}
		else
		{
			window.consolestop = false;
		}
	}

	console.log(arguments);
}

nette_parseJSON = function(s) {
	s = s || '[]';
	if (s.substr(0, 3) === '{op') {
		return eval('[' + s + ']'); // backward compatibility
	}
	return window.JSON && window.JSON.parse ? JSON.parse(s) : eval(s);
};

function str_replace(search, replace, subject, count) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Gabriel Paderni
	// +   improved by: Philip Peterson
	// +   improved by: Simon Willison (http://simonwillison.net)
	// +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// +   bugfixed by: Anton Ongson
	// +      input by: Onno Marsman
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +    tweaked by: Onno Marsman
	// +      input by: Brett Zamir (http://brett-zamir.me)
	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   input by: Oleg Eremeev
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// +   bugfixed by: Oleg Eremeev
	// %          note 1: The count parameter must be passed as a string in order
	// %          note 1:  to find a global variable in which the result will be given
	// *     example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
	// *     returns 1: 'Kevin.van.Zonneveld'
	// *     example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
	// *     returns 2: 'hemmo, mars'
	var i = 0,
			j = 0,
			temp = '',
			repl = '',
			sl = 0,
			fl = 0,
			f = [].concat(search),
			r = [].concat(replace),
			s = subject,
			ra = Object.prototype.toString.call(r) === '[object Array]',
			sa = Object.prototype.toString.call(s) === '[object Array]';
	s = [].concat(s);
	if (count) {
		this.window[count] = 0;
	}

	for (i = 0, sl = s.length; i < sl; i++) {
		if (s[i] === '') {
			continue;
		}
		for (j = 0, fl = f.length; j < fl; j++) {
			temp = s[i] + '';
			repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
			s[i] = (temp).split(f[j]).join(repl);
			if (count && s[i] !== temp) {
				this.window[count] += (temp.length - s[i].length) / f[j].length;
			}
		}
	}
	return sa ? s : s[0];
}

/**
 * 
 * @param {string} $string
 * @returns {array<mixed>}
 */
function getArgsFromString($string)
{
	var $return = [];

	if (!isStringEmpty($string))
	{
		try
		{
			$return = [JSON.parse($string)];
		}
		catch (err)
		{
			$return = $string.split(hello.identifiers.init_value_separator);
		}
	}

	return $return;
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.ltrim = function() {
	return this.replace(/^\s+/, '');
};

String.prototype.rtrim = function() {
	return this.replace(/\s+$/, '');
};

String.prototype.fulltrim = function() {
	return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
};

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d === undefined ? "." : d, 
    t = t === undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function in_array($needle, $haystack)
{
	var $key = '';

	for ($key in $haystack)
	{
		if ($haystack[$key] === $needle)
		{
			return true;
		}
	}

	return false;
}

function storage_supported() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}


(function($, hello, win, doc)
{
	"use strict";

	$.fn.equals = function($p_compareTo)
	{
		if (!$p_compareTo || this.length !== $p_compareTo.length)
		{
			return false;
		}

		for (var i = 0; i < this.length; ++i)
		{
			if (this[i] !== $p_compareTo[i])
			{
				return false;
			}
		}

		return true;
	};

	$.fn.isOnScreen = function()
	{
		var jwin = $(win);

		var viewport =
				{
					top: jwin.scrollTop(),
					left: jwin.scrollLeft()
				};
		viewport.right = viewport.left + jwin.width();
		viewport.bottom = viewport.top + jwin.height();

		var bounds = this.offset();
		bounds.right = bounds.left + this.outerWidth();
		bounds.bottom = bounds.top + this.outerHeight();

		return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

	};

	hello.scrollEvent = function($p_enable)
	{
		var $keys = [37, 38, 39, 40];

		var preventDefault = function(e)
		{
			e = e || win.event;
			if (e.preventDefault)
			{
				e.preventDefault();
			}

			e.returnValue = false;
		};

		var keydown = function(e)
		{
			for (var i = $keys.length; i--; )
			{
				if (e.keyCode === $keys[i])
				{
					preventDefault(e);
					return;
				}
			}
		};

		var wheel = function(e)
		{
			preventDefault(e);
		};

		var disable_scroll = function()
		{
			if (win.addEventListener)
			{
				win.addEventListener('DOMMouseScroll', wheel, false);
			}

			win.onmousewheel = doc.onmousewheel = wheel;
			doc.onkeydown = keydown;
		};

		var enable_scroll = function()
		{
			if (win.removeEventListener)
			{
				win.removeEventListener('DOMMouseScroll', wheel, false);
			}
			win.onmousewheel = doc.onmousewheel = doc.onkeydown = null;
		};

		if ($p_enable !== undefined && $p_enable === false)
		{
			disable_scroll();
		}
		else
		{
			enable_scroll();
		}
	};
})(jQuery, hello, window, document);