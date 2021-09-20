function NightMode(target_window) {
	function hexToRgbA(hex) {
		var c;
		if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			c = hex.substring(1).split('');
			if (c.length === 3) {
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = '0x' + c.join('');
			return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(', ') + ', 1)';
		}
		throw new Error('Bad Hex');
	};

	function rgbToHsl(input) {
		var r = input[0];
		var g = input[1];
		var b = input[2];
		var a = input[3];
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return a ? [h, s, l, a] : [h, s, l];
	};

	function hue2rgb(p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	function hslToRgb(h, s, l) {
		var r, g, b;

		if (s == 0) {
			r = g = b = l; // achromatic
		} else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	};

	function _NightMode(target_document) {
		this.colors = {
			aliceblue: "#f0f8ff",
			antiquewhite: "#faebd7",
			aqua: "#00ffff",
			aquamarine: "#7fffd4",
			azure: "#f0ffff",
			beige: "#f5f5dc",
			bisque: "#ffe4c4",
			black: "#000000",
			blanchedalmond: "#ffebcd",
			blue: "#0000ff",
			blueviolet: "#8a2be2",
			brown: "#a52a2a",
			burlywood: "#deb887",
			cadetblue: "#5f9ea0",
			chartreuse: "#7fff00",
			chocolate: "#d2691e",
			coral: "#ff7f50",
			cornflowerblue: "#6495ed",
			cornsilk: "#fff8dc",
			crimson: "#dc143c",
			cyan: "#00ffff",
			darkblue: "#00008b",
			darkcyan: "#008b8b",
			darkgoldenrod: "#b8860b",
			darkgray: "#a9a9a9",
			darkgreen: "#006400",
			darkgrey: "#a9a9a9",
			darkkhaki: "#bdb76b",
			darkmagenta: "#8b008b",
			darkolivegreen: "#556b2f",
			darkorange: "#ff8c00",
			darkorchid: "#9932cc",
			darkred: "#8b0000",
			darksalmon: "#e9967a",
			darkseagreen: "#8fbc8f",
			darkslateblue: "#483d8b",
			darkslategray: "#2f4f4f",
			darkslategrey: "#2f4f4f",
			darkturquoise: "#00ced1",
			darkviolet: "#9400d3",
			deeppink: "#ff1493",
			deepskyblue: "#00bfff",
			dimgray: "#696969",
			dimgrey: "#696969",
			dodgerblue: "#1e90ff",
			firebrick: "#b22222",
			floralwhite: "#fffaf0",
			forestgreen: "#228b22",
			fuchsia: "#ff00ff",
			gainsboro: "#dcdcdc",
			ghostwhite: "#f8f8ff",
			gold: "#ffd700",
			goldenrod: "#daa520",
			gray: "#808080",
			green: "#008000",
			greenyellow: "#adff2f",
			grey: "#808080",
			honeydew: "#f0fff0",
			hotpink: "#ff69b4",
			indianred: "#cd5c5c",
			indigo: "#4b0082",
			ivory: "#fffff0",
			khaki: "#f0e68c",
			lavender: "#e6e6fa",
			lavenderblush: "#fff0f5",
			lawngreen: "#7cfc00",
			lemonchiffon: "#fffacd",
			lightblue: "#add8e6",
			lightcoral: "#f08080",
			lightcyan: "#e0ffff",
			lightgoldenrodyellow: "#fafad2",
			lightgray: "#d3d3d3",
			lightgreen: "#90ee90",
			lightgrey: "#d3d3d3",
			lightpink: "#ffb6c1",
			lightsalmon: "#ffa07a",
			lightseagreen: "#20b2aa",
			lightskyblue: "#87cefa",
			lightslategray: "#778899",
			lightslategrey: "#778899",
			lightsteelblue: "#b0c4de",
			lightyellow: "#ffffe0",
			lime: "#00ff00",
			limegreen: "#32cd32",
			linen: "#faf0e6",
			magenta: "#ff00ff",
			maroon: "#800000",
			mediumaquamarine: "#66cdaa",
			mediumblue: "#0000cd",
			mediumorchid: "#ba55d3",
			mediumpurple: "#9370db",
			mediumseagreen: "#3cb371",
			mediumslateblue: "#7b68ee",
			mediumspringgreen: "#00fa9a",
			mediumturquoise: "#48d1cc",
			mediumvioletred: "#c71585",
			midnightblue: "#191970",
			mintcream: "#f5fffa",
			mistyrose: "#ffe4e1",
			moccasin: "#ffe4b5",
			navajowhite: "#ffdead",
			navy: "#000080",
			oldlace: "#fdf5e6",
			olive: "#808000",
			olivedrab: "#6b8e23",
			orange: "#ffa500",
			orangered: "#ff4500",
			orchid: "#da70d6",
			palegoldenrod: "#eee8aa",
			palegreen: "#98fb98",
			paleturquoise: "#afeeee",
			palevioletred: "#db7093",
			papayawhip: "#ffefd5",
			peachpuff: "#ffdab9",
			peru: "#cd853f",
			pink: "#ffc0cb",
			plum: "#dda0dd",
			powderblue: "#b0e0e6",
			purple: "#800080",
			rebeccapurple: "#663399",
			red: "#ff0000",
			rosybrown: "#bc8f8f",
			royalblue: "#4169e1",
			saddlebrown: "#8b4513",
			salmon: "#fa8072",
			sandybrown: "#f4a460",
			seagreen: "#2e8b57",
			seashell: "#fff5ee",
			sienna: "#a0522d",
			silver: "#c0c0c0",
			skyblue: "#87ceeb",
			slateblue: "#6a5acd",
			slategray: "#708090",
			slategrey: "#708090",
			snow: "#fffafa",
			springgreen: "#00ff7f",
			steelblue: "#4682b4",
			tan: "#d2b48c",
			teal: "#008080",
			thistle: "#d8bfd8",
			tomato: "#ff6347",
			turquoise: "#40e0d0",
			violet: "#ee82ee",
			wheat: "#f5deb3",
			white: "#ffffff",
			whitesmoke: "#f5f5f5",
			yellow: "#ffff00",
			yellowgreen: "#9acd32"
		};
		this.lightness = 0.12;
		this.target_document = target_document || document;
		this.selector_whitelist = [
			'.preview__card',
			'.preview__input',
			'.preview__input span',
			'.preview__input strong',
			'.preview__text p',
			'.preview__button span',
			'.preview__checkbox',
			'.preview__footer',
			'.preview__footer span',
			'.preview-icechat',
			'.preview-icechat p',
			'.preview-icechat__button',
			'.preview-icechat__button span',
			'.preview-icechat hr',
			'.modal'
		];
		this.rgba_regexp = /(rgba?)\((.*?)\)/g;
		this.rgba_match_regexp = /\d+\.?\d*/g;
		this.colors_regexp = new RegExp('\\b' + Object.keys(this.colors).join('\\b|\\b') + '\\b', 'gi');
		this.original_rules = {};
		this.original_dom_rules = {};
		this.original_dom_rules_counter = 0;

		function walkThruRules(stylesheets, callback, revert) {
			[].forEach.call(stylesheets, function (style) {
				if (revert) {
					style.ownerNode.classList.remove('parsed');
				}
				if (style.ownerNode.classList.contains('parsed')) {
					return;
				}
				try {
					[].forEach.call(style.cssRules || [], function (rule) {
						try {
							[].forEach.call(rule.style || [], function (prop) {
								callback(rule, prop);
							});
						} catch (e) {}
					});
				} catch (e) {}
				if (!revert) {
					style.ownerNode.classList.add('parsed');
				}
			});
		};

		function inverseDOMStyleProperties(revert) {
			var currentNode;
			var ni = this.target_document.createNodeIterator(this.target_document.documentElement, NodeFilter.SHOW_ELEMENT, function () {
					return NodeFilter.FILTER_ACCEPT;
				},
				false);
			var rgba_match_regexp = this.rgba_match_regexp;
			while (currentNode = ni.nextNode()) {
				[].forEach.call(currentNode.style, function (prop) {
					if (revert) {
						if (this.original_dom_rules[currentNode.id] && this.original_dom_rules[currentNode.id][prop]) {
							currentNode.style[prop] = this.original_dom_rules[currentNode.id][prop];
						}
					} else {
						var prop_value = currentNode.style.getPropertyValue(prop);
						prop_value = prop_value.replace(/#[A-Fa-f0-9]{3,6}/, function (hex) {
							return hexToRgbA(hex);
						}.bind(this));
						prop_value = prop_value.replace(this.colors_regexp, function (color) {
							return hexToRgbA(this.colors[color]);
						}.bind(this));
						if (~prop_value.indexOf('rgb')) {
							if (!currentNode.id) {
								currentNode.id = 'night_mode_' + this.original_dom_rules_counter++;
							}
							this.original_dom_rules[currentNode.id] = this.original_dom_rules[currentNode.id] || {};
							this.original_dom_rules[currentNode.id][prop] = prop_value;
							var value = prop_value.replace(this.rgba_regexp, function (match, g1, g2) {
								var hsl = rgbToHsl(g2.match(rgba_match_regexp));
								hsl[2] = (1 - hsl[2]) - (1 - 2 * hsl[2]) * this.lightness;
								rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
								return g1 + '(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + (hsl[3] ? ', ' + hsl[3] : '') + ')';
							}.bind(this));
							currentNode.style[prop] = value;
						}
					}
				}.bind(this));
			}
		};

		function inverseProperty(rule, prop) {
			var prop_value = rule.style.getPropertyValue(prop);
			var rgba_match_regexp = this.rgba_match_regexp;
			prop_value = prop_value.replace(/#[A-Fa-f0-9]{3,6}/, function (hex) {
				return hexToRgbA(hex);
			}.bind(this));
			prop_value = prop_value.replace(this.colors_regexp, function (color) {
				return hexToRgbA(this.colors[color]);
			}.bind(this));
			if (~prop_value.indexOf('rgb')) {
				if (~this.selector_whitelist.indexOf(rule.selectorText)) {
					return;
				}
				this.original_rules[rule.selectorText] = this.original_rules[rule.selectorText] || {};
				this.original_rules[rule.selectorText][prop] = prop_value;
				var value = prop_value.replace(this.rgba_regexp, function (match, g1, g2) {
					var rgb = g2.match(rgba_match_regexp);
					var hsl = rgbToHsl(rgb);
					hsl[2] = (1 - hsl[2]) - (1 - 2 * hsl[2]) * this.lightness;
					rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
					return g1 + '(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + (hsl[3] ? ', ' + hsl[3] : '') + ')';
				}.bind(this));
				rule.style.setProperty(prop, value, rule.style.getPropertyPriority(prop));
			}
		};

		this.activate = function (lightness, callback) {
			if (this.init && this.target_document.head.contains(this.init)) {
				callback && callback();
				return this;
			}

			// var link = this.target_document.body.getElementsByTagName('a')[0];
			// var link_color = link && this.target_document.defaultView.getComputedStyle(link).color;
			this.lightness = lightness || this.lightness;
			var retries = 200;
			this.retry_interval = setInterval(function () {
				walkThruRules(this.target_document.styleSheets, function (rule, prop) {
					inverseProperty.call(this, rule, prop);
				}.bind(this));
				if (!retries--) {
					clearInterval(this.retry_interval);
				}
			}.bind(this), 5);
			this.target_document.body.classList.add('night_mode');
			inverseDOMStyleProperties.call(this);
			[].forEach.call(this.target_document.querySelectorAll('iframe'), function (iframe) {
				try {
					NightMode(iframe.contentWindow).activate();
				} catch (e) {}
			});
			this.init = this.target_document.createElement('style');
			this.init.classList.add('parsed');
			// this.init.textContent = 'input, textarea { background-color: #000; color: #fff; }' + (link_color ? ('a:visited { color: ' + link_color + '; } a { color:' + link_color + '; }') : '');
			this.target_document.head.appendChild(this.init);

			callback && callback();
			return this;
		};

		this.reset = function (callback) {
			if (!this.init) {
				callback && callback();
				return this;
			}

			clearInterval(this.retry_interval);
			walkThruRules(this.target_document.styleSheets, function (rule, prop) {
				if (~rule.style.getPropertyValue(prop).indexOf('rgb')) {
					this.original_rules[rule.selectorText] && rule.style.setProperty(prop, this.original_rules[rule.selectorText][prop], rule.style.getPropertyPriority(prop));
				}
			}.bind(this), true);
			inverseDOMStyleProperties.call(this, true);
			this.init.parentNode.removeChild(this.init);
			this.original_rules = {};
			this.original_dom_rules = {};
			this.target_document.body.classList.remove('night_mode');
			[].forEach.call(this.target_document.querySelectorAll('iframe'), function (iframe) {
				try {
					NightMode(iframe.contentWindow).reset();
				} catch (e) {}
			});
			callback && callback();
			this.init = null;
			return this;
		};

		return this;
	};

	target_window = target_window || window;
	target_window.NM = target_window.NM || new _NightMode(target_window.document);
	return target_window.NM;
};
