_me = obj_wysiwyg.prototype;
function obj_wysiwyg() {}

_me.__constructor = function (opt) {
	var me = this,
		lang = GWOthers.getItem('LAYOUT_SETTINGS', 'language') || 'en';

	this.__opt = opt || {};
	this.__aAvailableFontSizes = [10, 13, 16, 18, 24, 32];
	this.__sDefaultFontSize = 13;

	//1 is always, 2 is for startOffset: 0
	this.__allowTabElements = {
		'TD':1,
		'TH':1,
		'UL':1,
		'LI':2,
		'OL':2
	};

	if (lang !== 'en'){
		//supported languages
		var languages = {
			ar:'ar',bs:'bs',cs:'cs',da:'da',de:'de',el:'el',en:'en_gb',es:'es',et:'et',fa:'fa',fi:'fi',fr:'fr',he:'he',hr:'hr',hu:'hu',
			id:'id',it:'it',ja:'ja',ko:'ko',ku:'ku',me:'me',nb:'nb',nl:'nl',pl:'pl',pt:'pt_br',ro:'ro',ru:'ru',sk:'sk',
			sr:'sr',sv:'sv',th:'th',tr:'tr',uk:'uk',vi:'vi',cn:'zh_cn'
		};

		if (languages[lang])
			storage.library('languages/' + languages[lang], 'froala');
	}

	this._tableStyles = [{
		label: getLang('COMPOSE::DOTTED_BORDER'),
		class: 'fr-table-border-style-dotted',
		styles: [{
			selector: '.fr-table-border-style-dotted',
			style: { 'border-style': 'dotted!important' }
		}, {
			selector: '.fr-table-border-style-dotted td',
			style: { 'border': '1px dotted #000' }
		}]
	}, {
		label: getLang('COMPOSE::DASHED_BORDER'),
		class: 'fr-table-border-style-dashed',
		styles: [{
			selector: '.fr-table-border-style-dashed',
			style: { 'border-style': 'dashed!important' }
		}, {
			selector: '.fr-table-border-style-dashed td',
			style: { 'border': '1px dashed #000' }
		}]
	}, {
		label: getLang('COMPOSE::SOLID_BORDER'),
		class: 'fr-table-border-style-solid',
		styles: [{
			selector: '.fr-table-border-style-solid',
			style: { 'border-style': 'solid!important' }
		}, {
			selector: '.fr-table-border-style-solid td',
			style: { 'border': '1px solid #000' }
		}]
	}, {
		label: getLang('COMPOSE::COLLAPSED_BORDER'),
		class: 'fr-table-border-collapse-collapse',
		styles: [{
			selector: '.fr-table-border-collapse-collapse',
			style: { 'border-collapse': 'collapse' }
		}]
	}];
	this._tableCellStyles = [{
		label: getLang('COMPOSE::DOTTED_BORDER'),
		class: 'fr-table-cell-border-style-dotted',
		styles: [{
			selector: 'td.fr-table-cell-border-style-dotted',
			style: { 'border': '1px dotted #000' }
		}]
	}, {
		label: getLang('COMPOSE::DASHED_BORDER'),
		class: 'fr-table-cell-border-style-dashed',
		styles: [{
			selector: 'td.fr-table-cell-border-style-dashed',
			style: { 'border': '1px dashed #000' }
		}]
	}, {
		label: getLang('COMPOSE::SOLID_BORDER'),
		class: 'fr-table-cell-border-style-solid',
		styles: [{
			selector: 'td.fr-table-cell-border-style-solid',
			style: { 'border': '1px solid #000' }
		}]
	}];

	storage.library('textversion', 'textversion');
	storage.library('froala_editor.min', 'froala');
	storage.library('plugins/align.min', 'froala');
	storage.library('plugins/colors.min', 'froala');
	storage.library('plugins/draggable.min', 'froala');
	storage.library('plugins/entities.min', 'froala');
	storage.library('plugins/font_family.min', 'froala');
	storage.library('plugins/font_size.min', 'froala');
	storage.library('plugins/image.min', 'froala');
	storage.library('plugins/link.min', 'froala');
	storage.library('plugins/lists.min', 'froala');
	storage.library('plugins/paragraph_format.min', 'froala');
	storage.library('plugins/paragraph_style.min', 'froala');
	storage.library('plugins/table.min', 'froala');
	storage.library('plugins/word_paste.min', 'froala');

	if(!document.head.querySelector('#font-awesome')) {
		document.head.appendChild(function() {
			var style = document.createElement('link');
			style.setAttribute('id', 'font-awesome');
			style.setAttribute('rel', 'stylesheet');
			style.setAttribute('type', 'text/css');
			style.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css');
			return style;
		}());
	}

	msiebox(this._getAnchor('msiebox'));

	var scrollableContainer = this._getAnchor('frame');
	FroalaEditor.DefineIcon('imageSmall', {NAME: getLang('RICH::IMG_SMALL'), SVG_KEY: 'alignCenter'});
	FroalaEditor.RegisterCommand('imageSmall', {
		title: getLang('RICH::IMG_SMALL'),
		focus: true,
		undo: true,
		refreshAfterCallback: true,
		callback: function () {
			var activeImage = this.image.get()[0];
			activeImage.style.maxWidth = '';
			var w = activeImage.style.width,
				h = activeImage.style.height;

			w = !~w.indexOf('%') && parseFloat(w) || activeImage.naturalWidth,
			h = !~h.indexOf('%') && parseFloat(h) || activeImage.naturalHeight;

			if (w > 800) {
				activeImage.style.width = 800 + 'px';
				activeImage.style.height = 800 * (h / w) + 'px';
			} else if (h > 600) {
				activeImage.style.width = 600 * (w / h) + 'px';
				activeImage.style.height = 600 + 'px';
			} else if (w > 640) {
				activeImage.style.width = 640 + 'px';
				activeImage.style.height = 640 * (h / w) + 'px';
			} else if (h > 480) {
				activeImage.style.width = 480 * (w / h) + 'px';
				activeImage.style.height = 480 + 'px';
			}
			activeImage.click();
		}
	});

	FroalaEditor.DefineIcon('imageFit', {NAME: getLang('RICH::IMG_ADAPT'), SVG_KEY: 'fullscreen'});
	FroalaEditor.RegisterCommand('imageFit', {
		title: getLang('RICH::IMG_ADAPT'),
		focus: true,
		undo: true,
		refreshAfterCallback: true,
		callback: function () {
			var activeImage = this.image.get()[0];
			activeImage.style.width = '100%';
			activeImage.style.maxWidth = activeImage.naturalWidth + 'px';
			activeImage.style.height = '';
			activeImage.click();
		}
	});

	FroalaEditor.DefineIcon('imageOriginal', {NAME: getLang('RICH::IMG_ORIGINAL'), SVG_KEY: 'imageSize'});
	FroalaEditor.RegisterCommand('imageOriginal', {
		title: getLang('RICH::IMG_ORIGINAL'),
		focus: true,
		undo: true,
		refreshAfterCallback: true,
		callback: function () {
			var activeImage = this.image.get()[0];
			activeImage.style.width = activeImage.naturalWidth + 'px';
			activeImage.style.height = activeImage.naturalHeight + 'px';
			activeImage.style.maxWidth = '';
			activeImage.click();
		}
	});

	FroalaEditor.DefineIcon('imageEdit', {NAME: getLang('RICH::IMAGE'), SVG_KEY: 'insertImage'});
	FroalaEditor.RegisterCommand('imageEdit', {
		title: getLang('RICH::IMAGE'),
		focus: true,
		undo: true,
		refreshAfterCallback: true,
		callback: function () {
			this.popups.hideAll();
			me.__initpopup('I', false, {
				image: this.image.get()[0]
			});
		}
	});

	this._editor = new FroalaEditor(scrollableContainer, {
		enter: FroalaEditor.ENTER_DIV,
		scrollableContainer: scrollableContainer,
		useClasses: false,
		key: 'eHE5C-11E2C2H2D2B2A3D-17d1F1FOOLb2KOPQGe1CWCQVTDWXGcA5A4D4D3E4C2H3E3D1B3==',
		height: '100%',
		iframe: true,
		charCounterCount: false,
		toolbarButtons: [],
		spellcheck: true,
		language: lang,
		disableRightClick: false,
		//linkAutoPrefix: '', // disable auto-prefixing with http://
		pasteDeniedAttrs: [],
		pasteAllowedStyleProps: ['width', 'height'],
		imageEditButtons: ['imageSmall', 'imageFit', 'imageOriginal', '-', 'imageEdit', 'imageRemove', '-', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove'],
		linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
		linkInsertButtons: ['linkBack'],
		tableInsertHelper: false,
		tableEditButtons: ['tableRows', 'tableColumns', 'tableCells', 'tableStyle', '-', 'tableCellVerticalAlign', 'tableCellHorizontalAlign', 'tableCellBackground', 'tableCellStyle', '-', 'tableRemove'],
		tableStyles: this._tableStyles.reduce(function(acc, cur) {
			acc[cur.class] = cur.label;
			return acc;
		}, {}),
		tableCellStyles: this._tableCellStyles.reduce(function(acc, cur) {
			acc[cur.class] = cur.label;
			return acc;
		}, {}),
		iframeDefaultStyle: [].concat(me._tableStyles, me._tableCellStyles).map(function(style) {
			return style.styles.map(function(style) {
				return style.selector + '{' + Object.keys(style.style).map(function(prop) {
					return prop + ':' + style.style[prop];
				}).join(';') + '}';
			}).join('');
		}).join(''),
		iframeStyleFiles: ['font.css', 'froala_editor.css', 'froala_plugins_table.css', 'obj_rich_body.css'].map(function (file) {
			return 'client/skins/' + GWOthers.getItem('LAYOUT_SETTINGS', 'skin') + '/css/css.php?' + buildURL({skin: GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette: GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file: file}); }),
		//htmlUntouched: true,
		imagePaste: false,
		events: {
			initialized: function() {
				me.__initialized = true;
				setTimeout(function() {
					me.__nightMode();
				}, 200);
				me._editor.toolbar.hide();
			},
			'popups.show.image.edit': positionPopup('image.edit'),
			'popups.show.link.insert': positionPopup('link.insert'),
			'popups.show.link.edit': positionPopup('link.edit'),
			'popups.show.table.edit': positionPopup('table.edit'),
			'buttons.refresh': function() {
				return false;
			},
			'focus': function(e) {
				mouseEvn(e || {type: 'focus'});
			},
			'blur': function(e) {
				mouseEvn(e || {type: 'blur'});
			},
			'keyup': keyupEvn,
			'keydown': keydownEvn,
			'keypress': keypressEvn,
			'paste.before': pasteBeforeEvn,
			'paste.after': pasteAfterEvn,
			'dragover': dragoverEvn,
			'dragenter': dragenterEvn,
			'dragstart': dragstartEvn,
			'dragend': dragendEvn,
			'drop': dropEvn,
			'commands.after': function(e, editor, cmd) {
				~['bold', 'underline', 'italic', 'align', 'indent'].indexOf(cmd) && me.select._value('enabled');
			},
			'contentChanged': function() {
				clearTimeout(me.__contentChangedTimeout);
				me.__contentChangedTimeout = setTimeout(function() {
					// table width to px
					[].forEach.call(me.__doc.querySelectorAll('table, td'), function(el) {
						if(el.style.width.match(/%$/)) {
							if(el.tagName === 'TD') {
								if(parseFloat(el.style.width) > 100) {
									el.style.width = '100%';
								}
								return;
							}
							el.style.width = el.clientWidth + 'px';
							el.style.marginRight = null;
						}
					});
				}, 200);
			}
		}
	});

	this._add_destructor('__destruct');

	if (this.__opt.readonly)
		this._readonly(true);

	this.__eFrame = this._editor.$iframe[0];
	this.__doc = this._editor.iframe_document;
	var ep = me.__eFrame.contentWindow.Element.prototype;
	if(!ep.matches) {
		ep.matches = window.Element.prototype.matches;
	}
	if(!ep.closest) {
		ep.closest = window.Element.prototype.closest;
	}

	this.__eFrame.contentWindow && this.__eFrame.contentWindow.addEventListener('scroll', function() {
		var html = me._editor.$html[0];
		[].forEach.call(me._main.querySelectorAll('.fr-image-resizer, .fr-popup'), function(elm) {
			elm.style.marginTop = -html.scrollTop + 'px';
			elm.style.marginLeft = -html.scrollLeft + 'px';
		});
	});

	function positionPopup(id) {
		return function () {
			var popup = this.popups.get(id)[0];
			var focus = this.selection.element();
			var scrollTop = this.$html[0].scrollTop;
			var scrollLeft = this.$html[0].scrollLeft;
			var top = Math.max(20, focus.offsetTop + (focus.clientHeight - popup.clientHeight) / 2) - 40;
			var left = Math.max(20, focus.offsetLeft + (focus.clientWidth - popup.clientWidth) / 2);
			if(top < scrollTop) {
				top = scrollTop + 20;
			} else if (top + popup.clientHeight > this.$iframe[0].clientHeight) {
				top = this.$iframe[0].clientHeight - popup.clientHeight + scrollTop - 20;
			}
			if(left < scrollLeft) {
				left = scrollLeft + 20;
			} else if (left + popup.clientWidth > this.$iframe[0].clientWidth) {
				left = this.$iframe[0].clientWidth - popup.clientWidth + scrollLeft - 20;
			}
			popup.style.top = top + 'px';
			popup.style.left = left + 'px';
			popup.style.marginTop = -scrollTop + 'px';
			popup.style.marginLeft = -scrollLeft + 'px';
		};
	}

	// Create initial selection so that content can be pasted before clicking in window
	if (this.__doc.getSelection) {
		var s = this.__doc.getSelection();
		if (s && typeof s === "object" && s.selectAllChildren && s.collapseToStart) {
			if (this._MSIE)
				this.__doc.body.innerHTML = '';	// IE10 can't handle selections in empty body so let's add nothing
			try {
				s.selectAllChildren(this.__doc.body);
				s.collapseToStart();
			} catch(e) {

			}
		}
	}

	var head = this.__doc.querySelector('head');
	head.appendChild(mkElement('meta', {'http-equiv': 'x-dns-prefetch-control'}, this.__doc));
	head.insertBefore(mkElement('base', {href: document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port : '') + document.location.pathname}, this.__doc), head.firstChild);

	if (GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'html_message') != '0') {
		//Default Font
		var sBodyStyle = '';
		if (GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'font_family') != '0') {
			this.__font_family = GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'font_family');
			sBodyStyle = 'font-family: ' + this.__font_family + ';';
		}

		//Default Size
		var i = this.__aAvailableFontSizes.indexOf(parseInt(GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'font_size') || this.__sDefaultFontSize));
		this.__font_size = (-1 === i) ? this.__sDefaultFontSize : this.__aAvailableFontSizes[i];
		sBodyStyle += 'font-size: ' + this.__font_size + 'px;';

		this.__doc.body.setAttribute('style', sBodyStyle);

		// Default direction for document, undefined indicates auto direction
		this._rtl = GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'text_direction') === 'RTL';
		this.__doc.body.setAttribute('dir', this._rtl ? 'rtl' : 'ltr');
	}

	this.__doc.body.classList.add('fr-element');

	//// FONTS ////
	this.__fonts = {};
	var aFonts = {'0': getLang('SETTINGS::DEFAULT')};
	var aTmp = dataSet.get('storage', ['FONTS', 'ITEMS']);

	for (var i in aTmp) {
		if (aTmp[i].VALUES.FAMILY.VALUE) {
			aFonts[aTmp[i].VALUES.FAMILY.VALUE] = aTmp[i].VALUES.NAME.VALUE;
			this.__fonts[aTmp[i].VALUES.FAMILY.VALUE] = [aTmp[i].VALUES.NAME.VALUE, aTmp[i].VALUES.FAMILY.VALUE.toLowerCase().split(',')];
		}
	}

	this.font._fill(aFonts);
	this.font._onchange = function () {
		var val = this._value();
		if (val != 0) {
			me.__exec('fontFamily.apply', [val]);
		}
	};
	this.font._obeyEvent('show', [function (e, args) {
		[].forEach.call(args.owner.block._main.querySelectorAll('a'), function (a) {
			a.style.fontFamily = a.getAttribute('rel');
		});
	}]);

	if (GWOthers.getItem('RESTRICTIONS', 'disable_dropbox') != 0) {
		document.getElementById(this._pathName + '/dropbox').setAttribute('hidden', '');
	}

	// Allow bidirectional text with rtl/ltr switch
	if (GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'text_direction_switch') == 1)
		addcss(this._main, 'bidirectional');


	this._MSIE = currentBrowser().indexOf('MSIE') > -1;

	this.__oldFcolor = '#000000';
	this.__oldBcolor = '#FFFFFF';
	this.__oldCcolor = '#000000'; // table border color
	this.__disabled = false;

	this.__coded = false;
	this.__output_format = false; //Use font, size and direction container

	this.__currentStyle = {};

	this.__currentSelectionElements = [];

	this.__doc.onselectionchange = function () {
		me._saveRange();
	};

	function mouseEvn(e) {
		if(me.__opt.readonly) {
			return;
		}
		var e = e.originalEvent || e;

		if (e.type === 'click') {
			me.__checkMenu(e);
			me.cmenu && me.cmenu._destruct();
		}

		// Propagate focus event to main window
		if (e.type === 'blur') {
			removecss(me._main, 'focus');
		}
		if (e.type === 'focus') {
			addcss(me._main, 'focus');

			try {
				var evn = new FocusEvent('focus');
			} catch (e) {
				// Legacy creation of event for IE11
				var evn = document.createEvent('FocusEvent');
				evn.initFocusEvent('focus', false, true, window, 0, me._main);
			}
			me._main.dispatchEvent(evn);
		}

		//Send event to richarea object
		if (me['_on' + e.type])
			if (me['_on' + e.type](e) === false) {
				e.cancelBubble = true;
				e.preventDefault && e.preventDefault();
				e.stopPropagation && e.stopPropagation();
				return false;
			}

		//Send event to richtext document
		if (me.__editable() && me.__doc['on' + e.type])
			if (me.__doc['on' + e.type](e) === false)
				return false;

		if(e.type === 'mouseup' && e.target.tagName === 'TD') {
			return false;
		}

		//Fire event to the MAIN element
		if (e.initMouseEvent && e.type !== 'focus') {

			var pos = getSize(me.__eFrame);

			var evn = document.createEvent("MouseEvent");
			evn.initMouseEvent(e.type, true, true, window, 0,
					e.screenX, e.screenY, e.clientX + pos.x, e.clientY + pos.y,
					e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					0, null
					);

			me._main.dispatchEvent(evn);
		}
		// IE before version 9
		else
		if (document.createEventObject) {
			try {
				var evn = document.createEventObject(e);
				evn.button = 1;  // left click

				me._main.fireEvent('on' + e.type, evn);
			} catch (e) {
				gui._REQUEST_VARS.debug && console.log(this._name || false, r);
			}
		}
	}

	function pasteBeforeEvn(e) {
		var cd = (e.clipboardData || (e.originalEvent || {}).clipboardData || {});
		var items = (cd.types && cd.types.length && cd.types) || cd.items || (window.clipboardData || {}).files || [];
		if ([].some.call(items, function (item) {
			return item === 'text/html' || item.type === 'text/html';
		})) {
			me.select._value('enabled');
			me._editor.opts.enter = FroalaEditor.ENTER_P;
			return;
		}
		((e.clipboardData || window.clipboardData || {}).files || []).length && e.preventDefault();
		if (me._onpaste)
			return me._onpaste(e.originalEvent);
		return;
	}

	function pasteAfterEvn(e) {
		[].forEach.call(me.__doc.body.querySelectorAll('font'), function (font) {
			!font.innerText && font.parentNode.removeChild(font);
		});
		me._editor.opts.enter = FroalaEditor.ENTER_DIV;
	}

	function dropEvn(e) {
		var r, tmp, e = e.originalEvent;

		//Get data
		try {
			tmp = e.dataTransfer.getData("text/plain");
		}
		//MSIE fallback
		catch (err) {
			tmp = e.dataTransfer.getData("text");
		}

		//Standard
		if (me.__doc.caretPositionFromPoint) {
			var pos = me.__doc.caretPositionFromPoint(e.clientX, e.clientY);
			r = me.__doc.createRange();
			r.setStart(pos.offsetNode, pos.offset);
			r.collapse();
		} else
		//Webkit
		if (me.__doc.caretRangeFromPoint)
			r = me.__doc.caretRangeFromPoint(e.clientX, e.clientY);

		//Is it dragged image?
		if (tmp === me._pathName && me.__activeImage) {

			//Modern Browsers
			if (r) {
				me.__activeImage.box.parentNode.removeChild(me.__activeImage.box);
				r.insertNode(me.__activeImage.box);
			} else
			//MSIE
			if (me.__doc.body.createTextRange) {
				r = me.__doc.body.createTextRange();
				r.moveToPoint(e.clientX, e.clientY);

				var spanId = "temp_" + ("" + Math.random()).slice(2);
				r.pasteHTML('<span id="' + spanId + '">&nbsp;</span>');

				var span = me.__doc.getElementById(spanId);
				span.parentNode.replaceChild(me.__activeImage.box, span);
			}

			e.preventDefault();
			return false;
		}

		if(me._ondrop)
			return me._ondrop(e);

		return false;
	}

	function keypressEvn(e) {
		if(me.__activeImage && me.__activeImage.box) {
			var img = me.__activeImage.original;
			me.__img_removeEdit();

			var s = me._getSelection();
			if (s.rangeCount > 0)
				s.removeAllRanges();
			var range = me.__doc.createRange();
			range.selectNode(img);
			s.addRange(range);
		}
		if (me._onkeypress)
			me._onkeypress(e.originalEvent);
	}

	function keyupEvn(e){
		if(me.__activeImage && me.__activeImage.box) {
			var img = me.__activeImage.original;
			me.__img_removeEdit();

			var s = me._getSelection();
			if (s.rangeCount > 0)
				s.removeAllRanges();
			var range = me.__doc.createRange();
			range.selectNode(img);
			s.addRange(range);
		}
		e = e.originalEvent || e;
		me._saveRange();
		me.__checkMenu(e);

		if (me._onkeyup)
			return me._onkeyup(e);
	};

	function keydownEvn(e){

		if (e.keyCode == 116){
			e.cancelBubble = true;
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			return false;
		}

		if (me.onkeydown) {
			var result = me.onkeydown(e);
			if(result !== void 0) {
				return result;
			}
		}

		clearTimeout(me.__checkMenuTimeout);

		if(me.__activeImage && me.__activeImage.box) {
			var img = me.__activeImage.original;
			me.__img_removeEdit();

			var s = me._getSelection();
			if (s.rangeCount > 0)
				s.removeAllRanges();
			var range = me.__doc.createRange();
			range.selectNode(img);
			s.addRange(range);
		}
		switch(e.keyCode) {
			case 9:
				var r = me._getRange();

				//Do not catch TAB in selected elements
				if (r.startContainer && e.originalEvent){

					var tmp = r.startContainer;
					while(tmp.nodeType === 3){
						tmp = r.startContainer.parentElement || r.startContainer.parentNode;
					}
					var tag = tmp.tagName;

					switch(me.__allowTabElements[tag]){
						case 2:
							if (r.startOffset > 0)
								break;
						case 1:
							e.originalEvent.cancelBubble = true;
							return true;
					}
				}

				if (me.__tabIndex_dock) {
					if (e.originalEvent.shiftKey)
						me.__tabIndex_dock._tabIndexPrev(me);
					else
						me.__tabIndex_dock._tabIndexNext(me);
				}
				return false;

			case 13: // Enter
			case 46: // Del
				return true;
			case 27: // Esc
				if(me._onesc)
					me._onesc();
				if(e.preventDefault)
					e.preventDefault();
				return false;
		}

		if (me._onkeydown)
			return me._onkeydown(e);
	};

	function dragoverEvn(e) {
		e.originalEvent.preventDefault();
	}

	function dragenterEvn(e) {
		e.originalEvent.preventDefault();
	}

	function dragstartEvn(e) {
		gui.frm_main.__filedrag = false;
	}

	function dragendEvn(e) {
		gui.frm_main.__filedrag = true;
	}

	this.__doc.addEventListener('click', mouseEvn, false);
	this.__doc.addEventListener('mouseup', mouseEvn, false);
	this.__doc.addEventListener('mousedown', mouseEvn, false);
	this.__doc.addEventListener('mousemove', mouseEvn, false);

	this._getAnchor('header').onmousedown = function (e) {
		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (elm.tagName !== 'A')
			elm = elm.parentNode;
		if (elm.tagName !== 'A' || !elm.id)
			return false;

		var id = elm.id.substr(me._pathName.length);

		switch (id) {
			case '/undo':
			case '/redo':
				me.__exec('commands.' + id.replace('/', ''));
				me.__checkMenu();
				break;
			case '/spell':
				if (!me.__coded) {
					me.__spell();
				}
				break;
			case '/format':
				if (me._getAnchor('format_toolbar').classList.contains('hidden')) {
					me._showToolbar('format');
				} else {
					me._hideToolbars();
				}
				break;
			case '/insert':
				if (me._getAnchor('insert_toolbar')){
					if (me._getAnchor('insert_toolbar').classList.contains('hidden')) {
						me._showToolbar('insert');
					} else {
						me._hideToolbars();
					}
				}
				break;
			case '/removeFormat':
				if (!me.__disabled) {
					me.__exec('commands.clearFormatting');
				}
				break;
			case '/bold':
			case '/italic':
			case '/underline':
			case '/strikeThrough':
			case '/subscript':
			case '/superscript':
				if (!me.__disabled) {
					me.__exec('commands.' + id.replace('/', ''));
				}
				break;
			case '/direction':
				if (me.__disabled) {
					break;
				}
				// Get current cursor position
				var range = me._getRange();
				if (range) {
					range.collapse(true);
					elm = range.startContainer;
				} else
					elm = me.__doc.body;

				// Find text content container
				if (elm.nodeType == 3)
					elm = elm.parentElement || elm.parentNode;

				// Find first appropriate block style element
				var block = {p: true, h1: true, h2: true, h3: true, h4: true, h5: true, h6: true, div: true, ol: true, ul: true, table: true, body: true};
				if (me._MSIE && elm.nodeName == 'DIV' && elm.parentNode.nodeName == 'LI')
					elm = elm.parentNode; // IE wraps list elements in a div
				while (elm.parentNode && !block[elm.nodeName.toLowerCase()])
					elm = elm.parentNode;
				if (elm.nodeName == 'HTML')
					elm = me.__doc.body;

				// If applied to the body element change default direction
				if (elm.nodeName == 'BODY')
					me._rtl = !me._rtl;

				// Set text direction
				switch (elm.dir) {
					case 'ltr':
						elm.dir = 'rtl';
						break;
					case 'rtl':
						elm.dir = 'ltr';
						break;
					default:
						elm.dir = me._rtl ? 'ltr' : 'rtl';
				}

				break;
		}

		e.cancelBubble = true;
		if (e.stopPropagation)
			e.stopPropagation();
		if (e.preventDefault)
			e.preventDefault();
		return false;
	};

	this._getAnchor('header').onclick = function (e) {
		if (me.__disabled) {
			return false;
		}
		var e = e || window.event,
				elm = e.target || e.srcElement;

		if (elm.tagName !== 'A')
			elm = elm.parentNode;
		if (elm.tagName !== 'A' || !elm.id)
			return false;

		var id = elm.id.substr(me._pathName.length);

		if (!me.cmenu || me.cmenu._destructed) {

			var aCData = [];

			switch (id) {
				case '/image':
					me.__initpopup('I');
					break;
				case '/link':
					me.__initpopup('L');
					break;
				case '/hr':
					me.__exec('commands.insertHR');
					break;
				case '/dropbox':
					me.__dropboxHandler();
					break;
				case '/paste_text':
					me.__initpopup('P');
					break;
				case '/paragraph':
					if(me.__coded || me.__disabled) {
						break;
					}
					aCData.push(
						{title: 'RICH::PARAGRAPH', css: 'paragraph p' + (!me.__currentStyle.HEAD ? ' active' : ''), arg: [me, '_paragraphFormat', ['p']], disabled: me.__disabled},
						{text: getLang('RICH::HEADING') + ' 1', css: 'paragraph h1' + (me.__currentStyle.HEAD === 1 ? ' active' : ''), tag: 'h1', arg: [me, '_paragraphFormat', ['h1']], disabled: me.__disabled},
						{text: getLang('RICH::HEADING') + ' 2', css: 'paragraph h2' + (me.__currentStyle.HEAD === 2 ? ' active' : ''), tag: 'h2', arg: [me, '_paragraphFormat', ['h2']], disabled: me.__disabled},
						{text: getLang('RICH::HEADING') + ' 3', css: 'paragraph h3' + (me.__currentStyle.HEAD === 3 ? ' active' : ''), tag: 'h3', arg: [me, '_paragraphFormat', ['h3']], disabled: me.__disabled},
						{text: getLang('RICH::HEADING') + ' 4', css: 'paragraph h4' + (me.__currentStyle.HEAD === 4 ? ' active' : ''), tag: 'h4', arg: [me, '_paragraphFormat', ['h4']], disabled: me.__disabled},
						{text: getLang('RICH::HEADING') + ' 5', css: 'paragraph h5' + (me.__currentStyle.HEAD === 5 ? ' active' : ''), tag: 'h5', arg: [me, '_paragraphFormat', ['h5']], disabled: me.__disabled},
						{text: getLang('RICH::HEADING') + ' 6', css: 'paragraph h6' + (me.__currentStyle.HEAD === 6 ? ' active' : ''), tag: 'h6', arg: [me, '_paragraphFormat', ['h6']], disabled: me.__disabled}
					);
					break;
				case '/table':
					var label = mkElement('div', {textContent: getLang('RICH::CREATE_TABLE', [0, 0])});
					var trs = [];
					for(var i = 1; i <= 8; i++) {
						var tds = [];
						for(var j = 1; j <= 10; j++) {
							tds.push(mkElement('td', {
								'data-r': i,
								'data-c': j,
								onclick: function() {
									me.__closeInsertTooltip();
									me._insTable({
										border: 1,
										rows: +this.getAttribute('data-r'),
										columns: +this.getAttribute('data-c')
									});
								},
								onmouseover: function() {
									[].forEach.call(this.parentNode.parentNode.querySelectorAll('td'), function(td) {
										if(+td.getAttribute('data-r') <= +this.getAttribute('data-r') && +td.getAttribute('data-c') <= +this.getAttribute('data-c')) {
											td.classList.add('active');
										} else {
											td.classList.remove('active');
										}
									}, this);
									label.innerText = getLang('RICH::CREATE_TABLE', [this.getAttribute('data-c'), this.getAttribute('data-r')]);
								}
							}));
						}
						trs.push(mkElement('tr', {'data-r': i}, false, tds));
					}
					var tableElement = mkElement('table', {className: 'createTable'}, false, trs);
					aCData.push(
						{element: mkElement('div', {}, false, [label, tableElement])},
						{title: 'RICH::CUSTOM_TABLE', css: 'ico2 icotable', arg: [me, '__initpopup', ['T']], disabled: me.__disabled}
					);
					break;

				case '/align':
					if (me.__disabled) {
						break;
					}
					aCData.push(
						{title: 'RICH::LEFT', css: 'ico2 img icoleft', arg: [me, '__exec', ['align.apply', ['left']]]},
						{title: 'RICH::CENTER', css: 'ico2 img icocenter', arg: [me, '__exec', ['align.apply', ['center']]]},
						{title: 'RICH::RIGHT', css: 'ico2 img icoright', arg: [me, '__exec', ['align.apply', ['right']]]},
						{title: 'RICH::JUSTIFY', css: 'ico2 img icojustify', arg: [me, '__exec', ['align.apply', ['justify']]]}
					);
					break;

				case '/ordered':
					if (me.__disabled) {
						break;
					}
					aCData.push(
						{title: 'RICH::NUMBEREDLIST', css: 'ico2 img icoordered' + (me.__currentStyle.ORDERED ? ' active' : ''), arg: [me, '__exec', ['lists.format', ['OL']]]},
						{title: 'RICH::BULLETEDLIST', css: 'ico2 img icounordered' + (me.__currentStyle.UNORDERED ? ' active' : ''), arg: [me, '__exec', ['lists.format', ['UL']]]},
						{title: 'RICH::LEFTINDENT', css: 'ico2 img icooutdent', arg: [me, '__exec', ['commands.outdent']], keep: true},
						{title: 'RICH::RIGHTINDENT', css: 'ico2 img icoindent', arg: [me, '__exec', ['commands.indent']], keep: true}
					);
			}

			if (aCData.length) {
				e.cancelBubble = true;
				if (e.stopPropagation)
					e.stopPropagation();
				if (e.preventDefault)
					e.preventDefault();

				addcss(elm, 'active');

				me.cmenu = gui._create('cmenu', 'obj_context', '', 'obj_rich_menu');
				me.cmenu._onclose = function () {
					removecss(elm, 'active');
				};

				me.cmenu._fill(aCData);

				var pos = getSize(elm);
				me.cmenu._place(pos.x + pos.w / 2, pos.y + pos.h, '', 2);
			}
		}

		if (elm.href) {
			if (me._MSIE)
				me._focus(true);

			return false;
		}
	};

	me.size._obeyEvent('onchange', [function(e){
		var val = me.size._value();
		val && me.__exec('fontSize.apply', [val + 'px']);

	}]);

	me.size._obeyEvent('onkeyup', [function(e){
		var val = me.size._value();
		val && me.__exec('fontSize.apply', [val + 'px'], (e.which || e.keyCode) !== 13);
		me.size.block && me.size.block._destruct();
	}]);

	me._getAnchor('color').onclick = function (e) {
		me.__clickColor(e);
	};
	me._getAnchor('bgcolor').onclick = function (e) {
		me.__clickColor(e);
	};

	//Mode Select
	var last_select_value = this.select._value();
	this.select._obeyEvent('onchange', [function () {
		switch (me.select._value()) {
			case 'enabled':
				if (me.__coded)
					me.__code();

				try {
					me.__doc.body.dir = gui._rtl == undefined ? 'auto' : (gui._rtl ? 'rtl' : 'ltr');
				} catch (e) {
				}

				// Insert paragraph element for direction change
				if (gui._rtl && !me._value()) {
					me.__exec('format.apply', ["p"]);
					// Firefox inserts br element without reason, remove it
					if (me.__doc.body.firstChild && me.__doc.body.firstChild.nodeName === 'BR')
						me.__doc.body.removeChild(me.__doc.body.firstChild);
				}

				me._disable(false);
				if(last_select_value === 'code') {
					setTimeout(function() {
						me.__nightMode();
					}, 200);
				}
				break;

			case 'disabled':
				if (me.__coded)
					me.__code();

				try {
					me.__doc.body.dir = gui._rtl == undefined ? 'auto' : (gui._rtl ? 'rtl' : 'ltr');
				} catch (e) {
				}

				me._disable(true);
				if(last_select_value === 'code') {
					setTimeout(function() {
						me.__nightMode();
					}, 200);
				}
				break;

			case 'code':
				me.__nightMode();
				if (me.__spelled)
					me.select._value('enabled');
				else
					me.__code();
		}
		last_select_value = me.select._value();
	}]);

	this.__checkMenu();

	if (true === this._aTemplateData.disable_html) {
		this.select._value('disabled');
	}
};

_me._readonly = function(readonly){
	if ((this.__opt.readonly = !!readonly)){
		this.__exec('edit.off');
		this._getAnchor('header').parentNode.style.display = 'none';
	}
	else{
		this.__exec('edit.on');
		this._getAnchor('header').parentNode.style.display = '';
	}
};

_me._showToolbar = function(type) {
	this._hideToolbars();

	switch(type) {
		case 'insert':
		case 'format':
			var disable_mailformat = +GWOthers.getItem('RESTRICTIONS', 'disable_mailformat');
			if ((isNaN(disable_mailformat) || disable_mailformat === 0) && true !== this._aTemplateData.disable_html) {
				if(!this.__firstFormatToolbarToggle) {
					this.__firstFormatToolbarToggle = true;
					this.select._value('enabled');
				}
			}
			break;
	}
	document.getElementById(this._pathName + '/' + type).classList.add('active');
	this._main.querySelector('.' + type + '_toolbar').classList.remove('hidden');
};

_me._hideToolbars = function() {
	[].forEach.call(this._main.querySelectorAll('.toolbar'), function(elm) {
		elm.classList.add('hidden');
	});
	['insert', 'format', 'emoji'].forEach(function(type) {
		var el = document.getElementById(this._pathName + '/' + type);
		el && el.classList.remove('active');
	}, this);

	if (this.emoji && !this.emoji._destructed)
		this.emoji._destruct();
};

_me.__dropboxHandler = function () {
	if (!(GWOthers.getItem('EXTERNAL_SETTINGS', 'dropbox_app_key') || '').length) {
		gui.notifier._value({type: 'alert', args: {header: 'DROPBOX::ERRORALERT', text: 'DROPBOX::MISSINGKEY'}});
	} else if (typeof Dropbox === "undefined") {
		gui.notifier._value({type: 'alert', args: {header: 'DROPBOX::ERRORALERT', text: 'DROPBOX::UNAVAILABLE'}});
	} else {
		var me = this;
		Dropbox.choose({linkType: 'preview', success: function (files) {
			var links = [];
			for (var i in files)
				links.push('<a href="' + files[i].link.escapeXML(true) + '">' + files[i].name.escapeXML() + '</a>');
			me.__exec('html.insert', [links.join(', ')], false, function() {
				me.__exec('undo.saveStep');
			});
		}});
	}
};

_me.__nightMode = function (bResize) {
	if (GWOthers.getItem('LAYOUT_SETTINGS', 'night_mode') == 1) {

		//IW Spellchecker is not compatible with Night Mode
		var spell = this._getAnchor('header').querySelector('.icospell');
		if (spell){
			spell.parentNode.parentNode.removeChild(spell.parentNode.nextElementSibling);
			spell.parentNode.parentNode.removeChild(spell.parentNode);
		}

		storage.library('night_mode');
		NightMode(this.__eFrame.contentWindow).activate();
	}
};

_me._paragraphFormat = function (tag) {
	this.__exec('format.removeStyle', ['font-size']);
	this.__exec('paragraphFormat.apply', [tag]);
};

_me._placeholder = function (placeholder) {
	this._editor.opts.placeholderText = getLang(placeholder || '');
	setTimeout(function() {
		this.__exec('placeholder.refresh', [], true);
	}.bind(this), 5);
};

_me.__editable = function (b) {
	if (Is.Defined(b)) {
		this.__exec('edit.' + (b ? 'on' : 'off'), null, true);
	} else {
		return this.__doc.body.contentEditable === 'true';
	}
};

_me.__checkMenu = function(e) {
	clearTimeout(this.__checkMenuTimeout);
	var me = this;
	this.__checkMenuTimeout = setTimeout(function() {
		me.__checkMenuHandler(e);
	}, 150);
};

_me._parentElementTag = function(el, parentTagNames) {
	while(el.tagName !== 'BODY') {
		if(~parentTagNames.indexOf(el.tagName)) {
			return el;
		}
		el = el.parentNode;
	}
};

_me.__checkMenuHandler = function(e) {
	if (this._destructed || this.__coded || (e && (e.which || e.keyCode) === 13))
		return;

	// Parse HTML
	var buffer = {}, buffers = [], elms, r;

	r = this._getRange();

	this.__currentSelectionElements = [];
	if(r) {
		if (r.startContainer === r.endContainer) {
			if ('BODY' === r.startContainer.nodeName) {
				this.__currentSelectionElements.push(r.startContainer);
			} else {
				this.__currentSelectionElements.push(r.startContainer.parentNode);
			}
		} else {
			this.__traverseSelection(r.startContainer, r.endContainer);
		}
	}

	elms = this.__currentSelectionElements;

	for (var i in elms) {
		if(!elms[i]) {
			continue;
		}
		if (r.startContainer !== r.endContainer) {
			buffer = {};
		}

		//Bold
		if (!buffer.BOLD)
			buffer.BOLD = this.__testStyle(elms[i], 'font-weight', 'bold') || this._parentElementTag(elms[i], ['B', 'STRONG']);
		if (!buffer.ITALIC)
			buffer.ITALIC = this.__testStyle(elms[i], 'font-style', 'italic') || this._parentElementTag(elms[i], ['I', 'EM']);
		if (!buffer.UNDERLINE)
			buffer.UNDERLINE = this._parentElementTag(elms[i], ['U']);

		if (!buffer.STRIKETHROUGH)
			buffer.STRIKETHROUGH = this._parentElementTag(elms[i], ['STRIKE', 'S']);

		if (!buffer.SUBSCRIPT)
			buffer.SUBSCRIPT = this._parentElementTag(elms[i], ['SUB']);

		if (!buffer.SUPERSCRIPT)
			buffer.SUPERSCRIPT = this._parentElementTag(elms[i], ['SUP']);

		//Align
		if (!buffer.LEFT && !buffer.RIGHT && !buffer.CENTER && !buffer.JUSTIFY) {
			buffer.LEFT = this.__testStyle(elms[i], 'text-align', 'left');
			if (!buffer.LEFT) {
				buffer.RIGHT = this.__testStyle(elms[i], 'text-align', 'right');
				if (!buffer.RIGHT) {
					buffer.CENTER = this.__testStyle(elms[i], 'text-align', 'center');
					if (!buffer.CENTER) {
						buffer.JUSTIFY = this.__testStyle(elms[i], 'text-align', 'justify');

						var tmp = elms[i].getAttribute('align');
						if (tmp)
							buffer[tmp.toUpperCase()] = true;
					}
				}
			}
		}

		//Lists
		if (!buffer.UNORDERED)
			buffer.UNORDERED = this._parentElementTag(elms[i], ['UL']);
		if (!buffer.ORDERED)
			buffer.ORDERED = this._parentElementTag(elms[i], ['OL']);

		//Headings
		var elm = elms[i];
		while(!buffer.HEAD && elm.tagName !== 'BODY') {
			var match = elm.tagName.match(/^H(\d)$/);
			if(match && match[1]) {
				buffer.HEAD = +match[1];
			}
			elm = elm.parentNode;
		}

		//Indent
		if (!buffer.INDENT) {
			var tmp = getStyle(elms[i], 'margin-left');
			buffer.INDENT = (tmp && tmp != 0 && tmp != '0px');
		}

		//Font
		if (!buffer.FAMILY)
			buffer.FAMILY = getStyle(elms[i], 'font-family') || elms[i].getAttribute('face') || this.__font_family;

		if (elms[i].getAttribute('size'))
			buffer.SIZE = {1: '10', 2: '13', 3: '16', 4: '18', 5: '24', 6: '32'}[elms[i].getAttribute('size')];
		else {
			var tmp = getStyle(elms[i], 'font-size');
			if (tmp || this.__font_size)
				buffer.SIZE = parseInt(tmp || this.__font_size, 10);
		}

		buffer.color = getStyle(elms[i], 'color', this.__doc);
		if(buffer.color) {
			this.__oldFcolor = buffer.color;
		}
		buffer.bgcolor = getStyle(elms[i], 'background-color', this.__doc);
		if(buffer.bgcolor) {
			this.__oldBcolor = buffer.bgcolor;
		}

		buffers.push(buffer);
	}

	buffer = this.__mergeStyles(buffers);

	var f = '0';
	if (buffer.FAMILY) {
		var aFamily = buffer.FAMILY.toLowerCase().str_replace('"', '').split(','),
				iTmp1, iTmp2 = -1;

		for (var ifn in aFamily)
			for (var sfn in this.__fonts)
				if ((iTmp1 = inArray(this.__fonts[sfn][1], aFamily[ifn])) > -1 && (iTmp2 < 0 || iTmp1 < iTmp2)) {
					iTmp2 = iTmp1;
					f = sfn;
				}
	}
	buffer.FONT = f;
	this.font._value(buffer.FONT, true);
	this.size._value(buffer.SIZE, true);

	//Set menu
	var tmp = document.getElementById(this._pathName + '/bold');
	if (buffer.BOLD)
		addcss(tmp, 'active');
	else
		removecss(tmp, 'active');

	tmp = document.getElementById(this._pathName + '/italic');
	if (buffer.ITALIC)
		addcss(tmp, 'active');
	else
		removecss(tmp, 'active');

	tmp = document.getElementById(this._pathName + '/underline');
	if (buffer.UNDERLINE)
		addcss(tmp, 'active');
	else
		removecss(tmp, 'active');

	tmp = document.getElementById(this._pathName + '/strikeThrough');
	if (buffer.STRIKETHROUGH)
		addcss(tmp, 'active');
	else
		removecss(tmp, 'active');

	tmp = document.getElementById(this._pathName + '/subscript');
	if (buffer.SUBSCRIPT)
		addcss(tmp, 'active');
	else
		removecss(tmp, 'active');

	tmp = document.getElementById(this._pathName + '/superscript');
	if (buffer.SUPERSCRIPT)
		addcss(tmp, 'active');
	else
		removecss(tmp, 'active');

	if ((tmp = document.getElementById(this._pathName + '/font')))
		tmp.innerHTML = this.__fonts[buffer.FONT] ? this.__fonts[buffer.FONT][0].escapeHTML() : getLang('RICH::FONT');

	tmp = document.getElementById(this._pathName + '/align');
	if (buffer.JUSTIFY)
		tmp.className = 'ico icojustify';
	else
	if (buffer.CENTER)
		tmp.className = 'ico icocenter';
	else
	if (buffer.RIGHT)
		tmp.className = 'ico icoright';
	else
		tmp.className = 'ico icoleft';


	tmp = document.getElementById(this._pathName + '/ordered');
	if (buffer.UNORDERED)
		tmp.className = 'ico icounordered';
	else
		tmp.className = 'ico icoordered';

	this._getAnchor('color').getElementsByTagName('SPAN')[0].style.backgroundColor = buffer.color;
	this._getAnchor('bgcolor').getElementsByTagName('SPAN')[0].style.backgroundColor = buffer.bgcolor;

	this.__currentStyle = buffer;

	tmp = document.getElementById(this._pathName + '/undo');
	if (this.__exec('undo.canDo', [], true))
		removecss(tmp, 'disabled');
	else
		addcss(tmp, 'disabled');

	tmp = document.getElementById(this._pathName + '/redo');
	if (this.__exec('undo.canRedo', [], true))
		removecss(tmp, 'disabled');
	else
		addcss(tmp, 'disabled');
};

//Dynamic text analyse
_me.__testStyle = function (elm, attr, styleValue) {
	var style = getStyle(elm, attr, this.__doc);
	var font = getStyle(elm, 'font', this.__doc);

	if (style || font)
		return (style.toLowerCase() == styleValue || font.toLowerCase().indexOf(styleValue.toLowerCase()) != -1) ? true : false;
	else
		return false;
};

////////////////// NEW //////////////////

_me._getSelection = function(){
	return window.getSelection ? this.__eFrame.contentWindow && this.__eFrame.contentWindow.getSelection() : this.__doc.selection;
};

_me._getRange = function(){
	var s = this._getSelection();
	if(!s || s.rangeCount === 0) { return }
	return (s.rangeCount > 0) ? s.getRangeAt(0) : s.createRange();
};

_me._selectRange = function(rng,s){
	if (window.getSelection) {
		s.removeAllRanges();
		s.addRange(rng);
	}
	else
		rng.select();
};

_me._saveRange = function() {
	if (this._MSIE) {
		this.__savedRange = this._getRange();
		this.__savedSel = this._getSelection();
	}
};

_me._restoreRange = function(){
	if (this.__savedRange)
		this._selectRange(this.__savedRange,this.__savedSel);
};

_me.__exec = function (cmd, args, bSkipFocus, callback) {
	if(!this.__initialized) {
		return setTimeout(this.__exec.bind(this, cmd, args, bSkipFocus, callback), 5);
	}

	var result, fn = this._editor;
	try {
		if(!bSkipFocus) {
			this._restoreRange();
		}

		cmd = cmd.split('.');
		while(cmd.length) {
			fn = fn[cmd.shift()];
		}
		result = fn.apply(this._editor, args);
		if(!bSkipFocus) {
			this._focus(true);
			this.__checkMenu();
		}
	} catch(e) {
		console.warn(this._name, '__exec', cmd, e);
	}
	callback && callback();
	return result;
};

////////////////////////////////////////////////////////////////////////

_me.__code = function () {
	if (this.__coded) {
		this._disable(0, 'code');

		var v = '';
		if (this.__coded.parentNode) {
			v = this.__coded.value;
			this.__coded.parentNode.removeChild(this.__coded);
		}
		this.__coded = false;

		this._value(v);

		this._getAnchor('frame').style.display = '';
	} else {
		this._disable(1, 'code');

		this.__img_removeEdit();

		var txt = this.__doc.body.innerHTML.replace(/\r/gm, '').replace(/\n/gm, "\r\n");

		this._getAnchor('frame').style.display = 'none';

		var me = this;
		this.__coded = mkElement('textarea', {dir: "auto"});
		this.__coded.onblur = function (e) {
			var e = e || window.event;
			if (me['_on' + e.type] && !me['_on' + e.type](e)) {
				e.cancelBubble = true;
				try {
					e.preventDefault();
				} catch (r) {
					gui._REQUEST_VARS.debug && console.log(this._name || false, r);
				}
				try {
					e.stopPropagation();
				} catch (r) {
					gui._REQUEST_VARS.debug && console.log(this._name || false, r);
				}
				return false;
			}
		};

		this._getAnchor('msiebox').firstElementChild.appendChild(this.__coded);
		this.__coded.value = txt;
	}
};

_me.__getSpellLang = function () {
	storage.library('gw_others');
	return GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'spellchecker');
};

_me.__spell_uncheck = function (elm, doc) {

	if (elm && elm.tagName == 'SPAN'){
		elm = [elm];
	}
	else{
		elm = elm || this.__doc.body;
		elm = elm.querySelectorAll('span[fr-iw-spell]');
	}

	var doc = doc || this.__doc;
	for (var i = elm.length; i--;){
		elm[i].parentNode.replaceChild(doc.createTextNode(elm[i].innerHTML), elm[i]);
	}
};

_me.__spell = function () {

	// Disable spellchecker
	if (this.__spelled) {
		if (this.__spelled == 2)
			return;
		else
			this.__spelled = 2;

		this.__spell_uncheck();

		this._onclick = null;

		this.__spelled = false;
		this._disable(this.__disable_status);
		removecss(document.getElementById(this._pathName + '/spell'), 'active');

		this.__doc.body.setAttribute('spellcheck','true');
		return;
	}

	var checklang = this.__getSpellLang();
	if (!checklang)
		return;

	this.__doc.body.setAttribute('spellcheck','false');

	this.__spellwords = [];
	this.__spelled = 2;

	// Enable spellchecker
	this.__disable_status = this.__disabled;

	var arr = [],
		str = this._value(null, false, true);

	//prepare text for Aspell
	var sOld = str.removeTags(' ').unescapeHTML();
	//var sOld = createTextVersion(str).unescapeHTML();
	sOld = sOld.replace(/([\.,…„;\&\:\"\`“”\[\]\{\}\(\)\~—\=\_\!¿\?\|\\/\<\ \>]+)/gm, ' ');

	storage.library('wm_spellchecker');
	var iqspell = new wm_spellchecker(),
		aStr = iqspell.get({type: 'check', lang: checklang, input: sOld});

	if (Is.Empty(aStr)) {
		this.__spelled = false;
		return;
	}

	var tmp = '', istart = 0, iend = 0, ilen = str.length, arr = [],
		tmpIndex, tmpString, tmpLength,
		regexp = /^([\.,…„\:\"\'\`‘“”’\[\]\{\}\(\)\~\s\=\_\!¿\?\<\>\|\\/]+)$/g;

	while (true) {

		iend = str.indexOf('<', istart);

		if (iend < 0)
			iend = ilen;
		else
		if (iend == 0) {
			istart = str.indexOf('>');
			if (istart < 0)
				break;
			istart++;
			continue;
		}

		tmp = str.substring(istart, iend);

		//nahradit
		if (tmp.trim()) {
			for (var j in aStr) {

				tmpLength = aStr[j].length;

				while (true) {
					tmpIndex = tmp.indexOf(aStr[j], tmpIndex);
					if (tmpIndex < 0)
						break;

					tmpString = '';
					if (tmpIndex > 0)
						tmpString += tmp.charAt(tmpIndex - 1);

					if (tmpIndex + tmpLength < (iend - istart))
						tmpString += tmp.charAt(tmpIndex + tmpLength);

					if (tmpString.length == 0 || tmpString.match(regexp))
						arr.push([istart + tmpIndex, tmpLength, aStr[j]]);

					tmpIndex += tmpLength;
				}
			}
		}

		if (iend == ilen)
			break;

		istart = str.indexOf('>', iend);
		istart = istart > 0 ? istart + 1 : iend;
	} //while end

	if (count(arr)) {

		function sortarr(a, b) {
			return a[0] - b[0];
		}
		arr.sort(sortarr);

		var subcount = 0,
			sublen = '<span fr-iw-spell="true"></span>'.length;

		for (var i in arr) {
			str = str.substring(0, arr[i][0] + subcount) + '<span fr-iw-spell="true">' + str.substr(arr[i][0] + subcount, arr[i][1]) + '</span>' + str.substring(arr[i][0] + arr[i][1] + subcount);
			subcount += sublen;
		}

		this._disable(true);

		//DISABLE RICHAREA
		addcss(document.getElementById(this._pathName + '/spell'), 'active');

		var me = this;
		this._onclick = function (e) {

			var e = e || me.__doc.parentWindow.event,
					elm = e.target || e.srcElement;

			// Skip if click not on faulty word or if not left clicking
			if (!(elm.tagName === 'SPAN' && elm.hasAttribute('fr-iw-spell')) || e.button != 0 && document.documentMode != 8)
				return true;

			var aMenu = [],
					plain = elm.innerHTML.removeTags();

			if (elm.id) {
				aMenu.push({text: me.__spellwords[elm.id].entityify(), arg: [me, '__swapword', [elm, me.__spellwords[elm.id]], true]});
				if (me.__spellwords[elm.id] != plain)
					aMenu.push({text: plain.entityify(), arg: [me, '__swapword', [elm, elm.innerHTML]]});
			} else {
				elm.id = me.__spellwords.length;
				me.__spellwords[elm.id] = plain;
				aMenu.push({text: plain.entityify(), arg: [me, '__swapword', [elm, elm.innerHTML]]});
			}

			try {
				var aSuggest = iqspell.get({type: 'suggest', lang: checklang, input: me.__spellwords[elm.id]});
				aSuggest = aSuggest[aSuggest[0]];

				if (!Is.Empty(aSuggest))
					aMenu.push({"title": '-'});

				var j = 0;
				for (var i in aSuggest) {
					if (j > 15)
						break;
					aMenu.push({text: aSuggest[i].entityify(), arg: [me, '__swapword', [elm, aSuggest[i], true]]});
					j++;
				}
			} catch (er) {
				gui._REQUEST_VARS.debug && console.log(this._name || false, er);
			}

			me.spell = gui._create('spellcheck', 'obj_context');
			me.spell._fill(aMenu);

			var pos1 = getSize(me.__eFrame);
			var pos2 = getSize(elm, me.__doc);

			me.spell._place(pos1.x + pos2.x + (pos2.w / 2), pos1.y + pos2.y + pos2.h, '', 1);

			return false;
		};

		this.__spelled = true;
		this._value(str, true);
	} else{
		this.__spelled = false;
		this.__doc.body.setAttribute('spellcheck','true');
	}
};

_me.__swapword = function (elm, str, ok) {
	if (elm) {
		elm.innerHTML = str;
		elm.setAttribute('fr-iw-spell', ok?'false':'true');
	}
};

_me.__closeInsertTooltip = function() {
	var elm = document.getElementById(this._pathName + '/insert');
		elm && elm.classList.remove('active');
		elm = this._getAnchor('insert_toolbar');
		elm && this._getAnchor('insert_toolbar').classList.add('hidden');
};

_me.__initpopup = function (type, skipDestruct, options) {
	var me = this;

	if (this.popup && !skipDestruct)
		this.popup._destruct();

	if (gui.focus)
		gui.focus._suppress = true;

	var popup = gui._create('rich_popup', 'obj_popup_tab', '', 'noblur obj_rich_popup obj_rich_popup_' + type);
	popup._size(300, 200, true);
	popup._modal(true);
	popup._resizable(false);
	popup._dockable(false);

	if (!skipDestruct)
		this.popup = popup;

	// Create 'OK' button
	popup._create('btn_ok', 'obj_button', 'footer', 'ok noborder color1')._value('FORM_BUTTONS::OK');

	// Create 'CANCEL' button
	popup._create('btn_cancel', 'obj_button', 'footer', 'cancel noborder')._value('FORM_BUTTONS::CANCEL');
	popup.btn_cancel._onclick = function () {
		this._parent._destruct();
		if (gui.focus)
			gui.focus._suppress = false;
	};

	switch (type) {
		case 'P':
			popup._size(450, 250, true);
			popup._title('RICH::PASTEW');
			popup._draw('obj_rich_paste', 'main');
			popup.btn_ok._onclick = function () {
				me.__closeInsertTooltip();
				me.__exec('html.insert', [this._parent.input._value().entityify().replace(/\n/g, '<br>\n').replace(/\t/g, '    ').replace(/\s{2}/gm, ' &nbsp;').replace(/\n/g, ''), true], false, function() {
					me.__exec('undo.saveStep');
				});
				this._parent._destruct();
				if (gui.focus)
					gui.focus._suppress = false;
			};
			break;
		case 'T':
			popup._size(520, 245, true);
			popup._title('RICH::TABLE');
			popup._draw('obj_rich_table', 'main');
			popup._border_color = '000000';
			popup._getAnchor('color_picker').onclick = function (e) {
				me.__clickColor(e);
			};
			popup._getAnchor('color_picker').getElementsByTagName('SPAN')[0].style.backgroundColor = this.__oldCcolor;
			popup.btn_ok._onclick = function () {
				me.__closeInsertTooltip();
				me._insTable({"padding": (!this._parent.padding._checkError || !this._parent.padding._checkError.length ? this._parent.padding._value() : 0),
					"spacing": (!this._parent.spacing._checkError || !this._parent.spacing._checkError.length ? this._parent.spacing._value() : 0),
					"border": this._parent.border._value(),
					"color": me.__oldCcolor.replace('#', ''),
					"columns": (!this._parent.columns._checkError || !this._parent.columns._checkError.length ? this._parent.columns._value() : 4),
					"rows": (!this._parent.rows._checkError || !this._parent.rows._checkError.length ? this._parent.rows._value() : 4)});

				this._parent._destruct();
				if (gui.focus)
					gui.focus._suppress = false;
			};
			break;

		case 'I':
			var screenshot = this.__oUpload && document.addEventListener;
			options = options || {};
			popup._size(550, options.image ? 245 : (455 - (screenshot ? 0 : 130)), true);
			popup._title('RICH::IMAGE');
			popup._draw('obj_rich_image', 'main', options.image ? {image: options.image} : {
				upload: this.__oUpload ? true : false,
				screenshot: screenshot,
				insert_image: (GWOthers.getItem('RESTRICTIONS', 'disable_attach_item') || 0) < 1});

			if(options.image) {
				popup.alt._value(options.image.getAttribute('alt'));
				popup.border._value(options.image.getAttribute('border'));
				popup.spacing._value(options.image.getAttribute('hspace'));
				var match;
				['width', 'height'].forEach(function(m) {
					if(match = options.image.style[m].match(/^([\d\.]+)(px|%)?$/)) {
						popup[m]._value(match[1]);
						popup[m + '_unit']._value({px: 0, '%': 1}[match[2] || 'px']);
					}
				});
			}
			var guest = sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly());

			if(popup.radio) {
				var aFill = {url: 'RICH::URL'};
				if (popup.internal && !guest)
					aFill.internal = 'RICH::INTERNAL';
				if (this.__oUpload)
					aFill.uploaded = 'RICH::UPLOADED';

				popup.radio._fill(aFill);
				popup.radio._value(this.__oUpload ? 'uploaded' : 'url');
			}

			if(popup.url) {
				popup.url._onfocus = function () {
					this._parent.radio._value('url');
				};
			}

			if (popup.internal) {
				popup.internal._onfocus = function () {
					this._parent.radio._value('internal');
				};

				popup.add_item._onclick = function () {
					//Documents folder is default
					var sFolder = Mapping.getDefaultFolderForGWType('F');
					if (!dataSet.get('folders', [sPrimaryAccount, sFolder]))
						sFolder = '';

					gui._create('insert_item', 'frm_insert_item', '', '', [me, function (aItems) {
							var aItemsInfo = {aid: aItems[0].aid, fid: aItems[0].fid, iid: aItems[0].id, values: []};
							WMItems.list(aItemsInfo, '', '', '', [function (aData) {
									var attachements = aData[aItems[0].aid][aItems[0].fid][aItems[0].id].ATTACHMENTS;
									var attachement = false;
									for (var i in attachements) {
										if (attachements[i].values.ATTDESC === aItems[0]['title']) {
											attachement = i;
											break;
										}
									}
									var out = {
										'name': aItems[0]['title'],
										'attachement': attachement,
										'id': aItems[0]['id'],
										'size': aItems[0]['size'],
										'class': aItems[0]['type'] || (aItems[0]['embedded'] ? 'item' : 'itemlink'),
										'fullpath': aItems[0]['fullpath']
									};

									if (this.__oUpload && this.__oUpload.__idtable) {
										this.__oUpload.__idtable.push(out);
										popup._listImages();
									} else
										popup._listImages([out]);
									popup.radio._value('internal');
								}]);
						}], sPrimaryAccount, sFolder, void 0, void 0, void 0, ['F','X','I'],'F');
				};
			}

			if (guest){
				popup.internal._main.parentNode.parentNode.setAttribute('hidden', '');
			}

			if (this.__oUpload && popup.upload) {
				popup.upload.file._main.className += ' ico';
				//check canvas
				//check clipboardData
				if (document.addEventListener) {

					//DOM hack
					popup.__eCatcher = mkElement('div', {contenteditable: 'true', style: {position: 'absolute', top: '-10px', left: '-10px', width: '1px', height: '1px', overflow: 'hidden'}});
					popup.__eCatcher.addEventListener('DOMSubtreeModified', function () {
						//image
						if (!this.__skip && this.children.length == 1 && this.firstElementChild.src) {
							var img = new Image();
							img.onload = function () {
								var c = mkElement('canvas', {width: this.width, height: this.height}),
										ctx = c.getContext("2d");
								ctx.drawImage(this, 0, 0);

								//Webkit/Mozilla
								if (c.toBlob)
									c.toBlob(function (blob) {
										blob.name = 'screenshot.png';
										popup.upload.__ondropfile([blob]);
									}, "image/png");
								//MSIE 10+
								else {

									var image = c.toDataURL();
									image = image.replace(/^data:[\w\;\/]*,/g, '');

									// Convert from base64 to an ArrayBuffer
									var byteString = atob(image),
											buffer = new ArrayBuffer(byteString.length),
											intArray = new Uint8Array(buffer);

									for (var i = 0; i < byteString.length; i++)
										intArray[i] = byteString.charCodeAt(i);

									// Use the native blob constructor
									var blob = new Blob([buffer], {type: "image/png"});
									blob.name = 'screenshot.png';

									popup.upload.__ondropfile([blob]);

								}
							};
							img.src = this.firstElementChild.src;
						}

						//cleanup
						setTimeout(function () {
							if (me && popup && popup.__eCatcher)
								popup.__eCatcher.innerHTML = '';
						}, 20);

					}, false);
					popup._getAnchor('main').appendChild(popup.__eCatcher);

					popup.__keydown = function (e) {
						if (e.keyCode == 86 && (e.ctrlKey || e.metaKey) && me && popup) {
							var elm = e.target || e.srcElement;
							if (!elm || elm.tagName != 'INPUT' || elm.readOnly)
								popup.__eCatcher.focus();
						}
					};
					gui._obeyEvent('keydown', [popup.__keydown]);

					//HTML5
					popup.__paste = function (e) {
						if (!me || !popup || !popup.upload)
							return false;

						if (e.clipboardData) {
							var items = e.clipboardData.items;
							if (items)
								for (var i = 0; i < items.length; i++)
									if (items[i].type.indexOf("image") > -1) {

										popup.__eCatcher.__skip = true;

										var blob = items[i].getAsFile();
										blob.name = items[i].name || 'screenshot.' + items[i].type.split('/')[1];

										popup.upload.__ondropfile([blob]);
									}
						}
					};

					gui._obeyEvent('paste', [popup.__paste]);

					//Dispatch events
					popup.__dispatch = function () {
						gui._disobeyEvent('keydown', [popup.__keydown]);
						gui._disobeyEvent('paste', [popup.__paste]);
					};
					popup._add_destructor('__dispatch');
				}

				//Upload Image
				popup.upload._setFileTypes('*.jpg;*.jpeg;*.gif;*.png', getLang('UPLOAD::IMAGES'));
				popup.upload._setFolder(this.__oUpload.file._getFolder());
				popup.upload._onuploadend = function (aAttach) {

					//synchronize folder
					if (me.__oUpload.file._getFolder() != this._getFolder())
						me.__oUpload.file._setFolder(this._getFolder());

					//Add attachment into parent Upload
					for (var i in aAttach) {
						aAttach[i].removed = true;
						aAttach[i].fullpath = aAttach[i].folder + '/' + aAttach[i].id;
						me.__oUpload._add(aAttach[i]);
					}

					//List Attachments
					this._parent._listImages();
					this._parent.radio._value('uploaded');

					//Preview
					var att = aAttach[aAttach.length - 1];
					if (att) {
						var img = new Image();
						img.onload = function () {
							//Preview
							var p = popup._getAnchor('canvas');
							if (p)
								p.getContext("2d").drawImage(this, 0, 0, p.width, p.height);
						};
						img.src = 'server/download.php?' + buildURL({'sid': dataSet.get('main', ['sid']), 'class': 'file', 'fullpath': att.fullpath});
					}

				};
				popup.upload._onuploadstart = function () {
					this._parent.uploaded._focus();
				};

				popup.uploaded._onfocus = function () {
					this._parent.radio._value('uploaded');
				};
			}

			popup.internal && (popup._listImages = function (out) {
				//fill
				var att = out || (me.__oUpload ? me.__oUpload.list.__idtable : {});
				if (att.length) {
					var rx = /\.(jpe?g|png|gif)$/i,
							aUploadFill = {},
							aItemFill = {},
							a = '', f = '';

					for (var i in att)
						if (att[i].name.match(rx))
							if (att[i]['class'] && att[i]['class'] == 'item') {
								a = att[i].fullpath + '/' + encodeURIComponent(att[i].attachement || att[i].name);
								aItemFill[a] = att[i].name;
							} else {
								f = (att[i].fullpath || (att[i].folder + '/' + att[i].id)) + '|file';
								aUploadFill[f] = att[i].name;
							}

					if (popup.uploaded) {
						popup.uploaded._fill(aUploadFill);
						popup.uploaded._value(f);
					}
					popup.internal._fill(aItemFill);
					popup.internal._value(a);
				}
			})();

			popup.btn_ok._onclick = function () {
				me.__closeInsertTooltip();

				var src = '',
					border = this._parent.border._value(),
					spacing = parseInt(this._parent.spacing._value(), 10),
					width = parseFloat(this._parent.width._value()),
					height = parseFloat(this._parent.height._value());

				if (options.image) {
					src = options.image.getAttribute('src');
					width = width ? width + ['px', '%'][this._parent.width_unit._value()] : (options.image.style.width || options.image.parentNode.style.width);
					height = height ? height + ['px', '%'][this._parent.height_unit._value()] : (options.image.style.height || options.image.parentNode.style.height);
				} else {

					if (width)
						width =  width + ['px', '%'][this._parent.width_unit._value()];
					if (height)
						height = height + ['px', '%'][this._parent.height_unit._value()];

					switch (this._parent.radio._value()) {
						case 'url':
							var v = this._parent.url._value();
							if (v && v !== 'http://')
								src = encodeURI(v.trim());
							else {
								this._parent.url._focus();
								return;
							}
							break;
						case 'internal':
							var aFullPath = this._parent.internal._value();
							if (aFullPath)
								src = 'server/download.php?' + buildURL({'sid': dataSet.get('main', ['sid']), 'class': 'attachment'}) + '&fullpath=' + aFullPath;
							else {
								this._parent.internal._focus();
								return;
							}
							break;
						case 'uploaded':
							var aFullPath = this._parent.uploaded._value().split('|');
							if (aFullPath.length === 2)
								src = 'server/download.php?' + buildURL({'sid': dataSet.get('main', ['sid']), 'class': aFullPath[1], 'fullpath': aFullPath[0]});
							else {
								this._parent.uploaded._focus();
								return;
							}
							break;
					}
				}

				var opt = {
					id:'img-' + unique_id(),
					src:src,
					alt:this._parent.alt._value(),
					style:[]
				};

				if (border){
					opt.border = border;
				}

				if (spacing){
					opt.hspace = spacing;
					opt.vspace = spacing;
				}

				//set FIT
				if (!width && !height){
					opt.style.push('max-width: 100%; height: auto; width: auto;');
				}
				else{
					if (width){
						opt.style.push('width: ' + width);
					}
					if (height){
						opt.style.push('height: ' + height);
					}
				}
				opt.style = opt.style.join('; ');

				var img = mkElement('img', opt);
				img.setAttribute('style', opt.style);

				var original;
				if(options.image) {
					original = options.image;
				}
				me.__img_removeEdit();
				if(original) {
					var range = me.__doc.createRange();
					var selection = me.__doc.defaultView.getSelection();
					var index = [].slice.call(original.parentNode.children).indexOf(original);
					range.setStart(original.parentNode, index);
					range.setEnd(original.parentNode, index + 1);
					selection.removeAllRanges();
					selection.addRange(range);
					original.parentNode.removeChild(original);
				}
				me.__exec('html.insert', [img.outerHTML, true], false, function() {
					me.__exec('undo.saveStep');
				});

				this._parent._destruct();
				if (gui.focus)
					gui.focus._suppress = false;
			};

			break;
		case 'L':

			//read previous link value
			this._restoreRange(); //For MSIE
			var s = this._getSelection(),
					surl = '',
					slabel = '',
					sstyle = '',
					r, a;

			if(s && s.getRangeAt && s.rangeCount) {
				r = s.getRangeAt(0);
			}

			try {
				a = s.anchorNode && this._parentElementTag(s.anchorNode, ['A']);
				if (s && s.anchorNode && a) {
					surl = a.getAttribute('href');
					slabel = a.textContent;
					sstyle = a.getAttribute('style');
				}
				else
				if (r){

					// if (r.startContainer !== r.endContainer){
					// 	slabel = r.startContainer.textContent.substring(r.startOffset) + r.endContainer.textContent.substring(0,r.endOffset);
					// }
					// else{
					// 	slabel = s.anchorNode.parentNode.textContent;
					// 	if (r.startOffset !== r.endOffset){
					// 		slabel = slabel.substring(r.startOffset,r.endOffset);
					// 	}
					// }

					//Trim trailing whitespace from selection & value
					slabel = s.toString();
					var oTrim = /\s+$/g.exec(slabel);
					if (oTrim && oTrim.index>0){
						r.setEnd(r.endContainer, r.endOffset + oTrim.index - slabel.length);
						slabel = s.toString();
					}
				}
			} catch (r) {
				gui._REQUEST_VARS.debug && console.log(this._name || false, r);
			}

			popup._size(400, 186, true);
			popup._title('RICH::ADDLINK');
			popup._draw('obj_rich_link', 'main');

			if(a) {
				popup._create('btn_remove', 'obj_button', 'footer', 'simple color2 x_btn_right');
				popup.btn_remove._value('FORM_BUTTONS::REMOVE');
				popup.btn_remove._onclick = function() {
					me.__closeInsertTooltip();
					me.__exec('link.remove');
					popup._destruct();
				};
			}

			popup.input._value(surl);
			popup.label._value(slabel);
			if(!popup.input._value()) {
				popup.input._focus();
			}

			popup.label.__eIN.addEventListener('change', function (e) {
				if(!e.target.value.indexOf('http') && !popup.input._value()) {
					popup.input._value(e.target.value);
				}
			});

			popup.input._onsubmit = function () {
				this._parent.btn_ok._onclick();
			};

			popup.label._onsubmit = function () {
				this._parent.btn_ok._onclick();
			};

			popup.input._onkeyup = function () {
				if(!slabel) {
					popup.label._value(this._value());
				}
			};

			popup.label._onkeyup = function () {
				slabel = this._value();
			};

			popup.btn_ok._onclick = function () {
				me.__closeInsertTooltip();

				me._restoreRange(); //For MSIE

				var v = this._parent.input._value().trim();

				//Extend selection to parent anchor
				if (a) {

					if (s.isCollapsed) {

						if (s.rangeCount > 0)
							s.removeAllRanges();

						var range = document.createRange();
						range.selectNode(a);
						s.addRange(range);
					}

					//Remove old link
					me.__exec('link.remove');
				}

				//Add new link
				if (v) {

					var a = mkElement('A', {href:v});

					//register new protocol
					var sProtocol = a.protocol.slice(0,-1);
					if (!~FroalaEditor.LinkProtocols.indexOf(sProtocol))
						FroalaEditor.LinkProtocols.push(sProtocol);

					me.__exec('link.insert', [v, slabel || v || '', {'target': '_blank', 'rel': 'nofollow', style: sstyle || ''}]);
				}
				popup._destruct();
				if (gui.focus)
					gui.focus._suppress = false;
			};

			break;

		case 'B':
		case 'F':
		case 'C':
			popup._title('RICH::' + (type === 'C' ? 'BORDERCOLOR' : (type === 'B' ? 'BGCOLOR' : 'COLOR')));
			popup._size(384, 300, true);
			popup._create('color_picker', 'obj_colorpicker');
			var v = this['__old' + type + 'color'];
			if(v === 'transparent') {
				v = '#000000';
			}
			if(~v.indexOf('#')) {
				popup.color_picker._value(v);
			} else {
				v = v.match(/(\d{1,3}).*?(\d{1,3}).*?(\d{1,3})/);
				popup.color_picker._rgb_value([v[1], v[2], v[3]]);
			}
			popup.btn_ok._onclick = function () {
				me[type === 'C' ? '_setBorderColor' : (type === 'B' ? '_setBColor' : '_setFColor')](popup.color_picker._value());
				this._parent._destruct();
				if (gui.focus)
					gui.focus._suppress = false;
			};

			popup._create('btn_cancel2', 'obj_button', 'footer', 'cancel noborder color2 x_btn_right')._value('FORM_BUTTONS::REMOVE');
			popup.btn_cancel2._onclick = function () {
				me[type === 'C' ? '_setBorderColor' : (type === 'B' ? '_setBColor' : '_setFColor')](false);
				this._parent._destruct();
				if (gui.focus)
					gui.focus._suppress = false;
			};
			break;
	}

};

// Note, this method returns the Window object, not an element...
_me._getFocusElement = function () {
	return this.__eFrame.contentWindow;
};

_me._focus = function (bNow, bTop) {

	if (!this.__eFrame.offsetParent || this.__eFrame.offsetParent.tagName === 'BODY')
		return false;

	var elm = this.__doc.getElementsByTagName("body")[0];
	// Set focus (cursor) to rich text area
	setTimeout(function () {
		elm.focus();
	}, 0);
	// If requested, set cursor to top of text area
	if (bTop) {
		try {
			var sel = this.__eFrame.contentWindow.getSelection();
		} catch (e) {
			var sel = this.__doc.selection.createRange();
		}
		if (sel && elm)
			sel.collapse(elm, 0);
	}

	return true;
};

_me._disable = function (b, css) {
	this.font._disabled(b);
	this.size._disabled(b);

	if (this._getAnchor('insert_toolbar'))
		[].forEach.call(this._getAnchor('insert_toolbar').querySelectorAll('span a:not(.icopastew)'), function(a) {
			a.classList[b ? 'add' : 'remove']('disabled');
		});

	if (b) {
		if (this.__spelled && this.__spelled !== 2)
			this.__disable_status = true;

		if (this.__coded && !css)
			this.__code();

		this.__disabled = true;

		addcss(this._main, 'disabled', css);
	} else {
		if (this.__spelled && this.__spelled !== 2)
			this.__disable_status = false;
		else {
			this.__disabled = false;

			removecss(this._main, 'disabled', css);
		}
	}
};

_me._value = function (v, bSkipSpell, bForceHTML, callback) {
	var aStyles = [], dir = GWOthers.getItem('MAIL_SETTINGS_DEFAULT', 'text_direction') || "ltr";

	if (Is.String(v)) {

		if (!bSkipSpell && this.__spelled)
			this.__spell();

		removecss(this.__doc.body, 'placeholder');

		//Sanitize
		v = v.replace(/<!--\[if[\w\W]*?\[endif\]-->/g, ''); // strip conditional comments
		v = v.replace(/<style[\w\W]*?<\/style>/g, function(match) { // cut styles
			aStyles.push(match);
			return '';
		});
		v = v.replace(/(style="[^"]*?:)\n([^"]*?")/g, '$1$2'); // fix multiline inline styles
		v = DOMPurify.sanitize(v);

		v = v.replace(/<br\s*\/?>\s+/g, '<br>');

		//link security fix
		//v = NewMessage.linkFix(v);

		if (this.__coded)
			this.__coded.value = v;
		else {
			if(this.__disabled && !this.__spelled) {
				v = v.replace(/\n/g, '<br>');
			}

			this.__exec('html.set', [v], true, function() {
				aStyles.length && this.__doc.body.insertAdjacentHTML('beforeend', aStyles.join('')); // paste styles
				if (this.__doc.onfocus)
					this.__doc.onfocus();
				callback && callback();
			}.bind(this));
		}
	} else {
		var sBody = '';
		if (this.__coded)
			sBody = this.__coded.value;
		else {

			this.__img_removeEdit();

			dir = this.__doc.body.getAttribute('dir') || dir;

			[].concat(this._tableStyles, this._tableCellStyles).forEach(function(style) {
				style.styles.forEach(function(style) {
					[].forEach.call(this.__doc.body.querySelectorAll(style.selector), function(el) {
						for(var i in style.style) {
							el.style.setProperty(i, style.style[i]);
						}
					});
				}, this);
			}, this);

			//sBody = this.__exec('html.get', [], true); // causes "Error: A security problem occurred." on some links
			sBody = this.__doc.body.innerHTML;

			if (!bSkipSpell && this.__spelled) {
				var tmp = mkElement('div');
					tmp.innerHTML = sBody;

				this.__spell_uncheck(tmp, document);
				sBody = tmp.innerHTML;

				if (this.__disable_status && !bForceHTML) {
					sBody = createTextVersion(sBody);
				}
			}
			else
			if (this.__disabled && !bForceHTML) {
				sBody = createTextVersion(sBody);
			}
		}

		//safari uses <div><br></div> instead of <br>
		var xtmp = mkElement('div', {innerHTML: DOMPurify.sanitize(sBody)});
		// if (currentBrowser() == 'Safari') {
		// 	var arr = xtmp.getElementsByTagName('BR');
		// 	for (var i = arr.length - 1; i > - 1; i--)
		// 		if (arr[i].parentNode.tagName == 'DIV' && arr[i].parentNode.childNodes.length == 1 && arr[i].parentNode.previousSibling && arr[i].parentNode.previousSibling.tagName == 'DIV')
		// 			arr[i].parentNode.parentNode.replaceChild(arr[i], arr[i].parentNode);
		// }
		// else
		// //IE uses <p> instead of <div>
		// if (this._MSIE) {
		// 	var arr = xtmp.getElementsByTagName('P');
		// 	for (var i = arr.length - 1; i > - 1; i--)
		// 		arr[i].parentNode.replaceChild(mkElement('div', {innerHTML: arr[i].innerHTML, className: arr[i].className, style: arr[i].style}), arr[i]);
		// }

		//It has to go tru DIV to set proper charset (froala doesn't support charset in iframe mode)
		sBody = xtmp.innerHTML;

		//Default Body style
		if (this.__output_format) {
			if (xtmp.firstElementChild && xtmp.firstElementChild.className !== 'iw_mail') {
				var sBodyStyle = '';
				if (this.__font_family)
					sBodyStyle = 'font-family: ' + this.__font_family + ';';

				if (this.__font_size)
					sBodyStyle += 'font-size: ' + this.__font_size + 'px;';

				sBody = '<div class="iw_mail" dir="' + dir.toLowerCase() + '"' + (sBodyStyle ? ' style="' + sBodyStyle + '"' : '') + '>' + sBody + '</div>';
			}
		}

		xtmp = null;

		return sBody.trim();
	}
};

_me._insAdjacentHTML = function(elm){
	if (elm){
		elm.insertAdjacentHTML.apply(elm, [].slice.call(arguments,1));
		this._editor.size.syncIframe();
	}
};

_me._insTable = function (aData) {
	var me = this,
	html = '<span>&nbsp;</span><table style="width:' + (aData.columns * 30) + 'px; border: ' + aData.border + 'px #' + (aData.color || '000000') + '"' + (aData.padding ? ' cellpadding="' + aData.padding + '"' : '') + (aData.spacing ? ' cellspacing="' + aData.spacing + '"' : '') + '>';
	for (var i = 0; i < aData.rows; i++) {
		html += '<tr>';
		for (var j = 0; j < aData.columns; j++)
			html += '<td></td>';
		html += '</tr>';
	}
	html += '</table><span>&nbsp;</span>';

	this.__exec('html.insert', [html, true], false, function() {
		me.__exec('undo.saveStep');
	});
};

_me.__clickColor = function (e) {
	var e = e || window.event,
			elm = e.target || e.srcElement;

	if (elm.tagName === 'A') {
		var id = elm.id.substr(elm.id.indexOf('#'));
		this.__initpopup(id === '#color_picker' ? 'C' : (id === '#color' ? 'F' : 'B'), true);
	}
};

_me._setFColor = function (color) {
	if(color) {
		var selection = this._getSelection();
		if(selection && selection.focusNode && selection.focusNode.nodeType === 3 && selection.focusNode.parentNode.nodeName === 'A') {
			selection.focusNode.parentNode.style.color = color;
		} else {
			this.__exec('format.applyStyle', ['color', color]);
		}
	} else {
		this.__exec('format.removeStyle', ['color']);
	}
};

_me._setBColor = function (color) {
	if(color) {
		this.__exec('colors.background', [color]);
	} else {
		this.__exec('format.removeStyle', ['background-color']);
	}
};

_me._setBorderColor = function (color) {
	gui.rich_popup._getAnchor('color_picker').getElementsByTagName('SPAN')[0].style.backgroundColor = this.__oldCcolor = color;
};

///////////////////// EDIT IMAGE ///////////////////////

_me.__img_removeEdit = function (bRemove) {
	var out;
	if (this.__activeImage) {
		if (this.__activeImage.box && this.__activeImage.box.parentNode)
			if (bRemove)
				this.__activeImage.box.parentNode.removeChild(this.__activeImage.box);
			else {
				this.__img_applyEdit();
				this.__activeImage.box.parentNode.replaceChild(this.__activeImage.original, this.__activeImage.box);

				out = this.__activeImage.original;
			}

		delete this.__activeImage;
	}

	this.__editable(true);

	return out;
};

_me.__img_applyEdit = function () {
	var elm = this.__activeImage.original;

	if (this.__activeImage && elm) {

		//Adaptive
		switch(this.__activeImage.mode){
			case 'adopt':
				elm.style.maxWidth = '100%';
				elm.style.width = 'auto';
				elm.style.height = 'auto';
				break;

			case 'native':
				elm.style.maxWidth = '';
				elm.style.width = 'auto';
				elm.style.height = 'auto';
				break;

			//Size
			default:
				elm.style.maxWidth = '';
				elm.style.width = this.__activeImage.w + 'px';
				elm.style.height = this.__activeImage.h + 'px';

				if (this.__activeImage.abs) {
					elm.style.top = this.__activeImage.abs.t + 'px';
					elm.style.left = this.__activeImage.abs.l + 'px';
				}
		}
	}
};

_me.__img_dispatch = function () {
	gui._disobeyEvent('mousemove', [this, '__img_resize']);
	gui._disobeyEvent('mousemove', [this, '__img_move']);
	return false;
};
_me.__img_move = function (e, info, arg) {
	if (arg.abs) {
		//X
		this.__activeImage.abs.l = arg.abs.l + gui.__X - arg.x;
		this.__activeImage.box.style.left = this.__activeImage.abs.l + 'px';

		//Y
		this.__activeImage.abs.t = arg.abs.t + gui.__Y - arg.y;
		this.__activeImage.box.style.top = this.__activeImage.abs.t + 'px';
	}
};
_me.__img_resize = function (e, info, arg) {
	if (this.__activeImage) {
		var c = arg.h / arg.w,
				abs = 0;

		switch (arg['type']) {
			case 't':
				this.__activeImage.h = arg.h - (e.clientY - arg.y);
				abs = 3;
				break;
			case 'b':
				this.__activeImage.h = arg.h + e.clientY - arg.y;
				break;
			case 'lm':
				this.__activeImage.w = arg.w - (e.clientX - arg.x);
				abs = 3;
				break;
			case 'rm':
				this.__activeImage.w = arg.w + e.clientX - arg.x;
				break;

			case 'lt':
				if (arg.x - e.clientX < arg.y - e.clientY) {
					this.__activeImage.h = arg.h - (e.clientY - arg.y);
					this.__activeImage.w = this.__activeImage.h / c;
				} else {
					this.__activeImage.w = arg.w - (e.clientX - arg.x);
					this.__activeImage.h = this.__activeImage.w * c;
				}
				abs = 3;
				break;
			case 'rt':
				if (e.clientX - arg.x > arg.y - e.clientY) {
					this.__activeImage.h = arg.h - (e.clientY - arg.y);
					this.__activeImage.w = this.__activeImage.h / c;
				} else {
					this.__activeImage.w = arg.w + e.clientX - arg.x;
					this.__activeImage.h = this.__activeImage.w * c;
				}
				abs = 1;
				break;
			case 'lb':
				if (arg.x - e.clientX > e.clientY - arg.y) {
					this.__activeImage.h = arg.h + (e.clientY - arg.y);
					this.__activeImage.w = this.__activeImage.h / c;
				} else {
					this.__activeImage.w = arg.w - (e.clientX - arg.x);
					this.__activeImage.h = this.__activeImage.w * c;
				}
				abs = 2;
				break;
			case 'rb':
				if (e.clientX - arg.x > e.clientY - arg.y) {
					this.__activeImage.h = arg.h + e.clientY - arg.y;
					this.__activeImage.w = this.__activeImage.h / c;
				} else {
					this.__activeImage.w = arg.w + e.clientX - arg.x;
					this.__activeImage.h = this.__activeImage.w * c;
				}
				break;
		}

		this.__activeImage.box.style.width = this.__activeImage.w + 'px';
		this.__activeImage.box.style.height = this.__activeImage.h + 'px';

		if (abs && arg.abs) {
			if (abs & 1) {
				this.__activeImage.abs.t = arg.abs.t + arg.h - this.__activeImage.h;
				this.__activeImage.box.style.top = this.__activeImage.abs.t + 'px';
			}
			if (abs & 2) {
				this.__activeImage.abs.l = arg.abs.l + arg.w - this.__activeImage.w;
				this.__activeImage.box.style.left = this.__activeImage.abs.l + 'px';
			}
		}
	}

};

/**
 * Traverses html nodes from given start node to end node and saves all tree leaves (text node parents) of the traversed tree section to this.__currentSelectionElements
 *
 * @param {Node} currentNode - Traversal of html tree begins with this node
 * @param {Node} endNode     - Traversal ends at this node
 * @param {Node} [fromChild] - In case we traverse up to parent provide from which child node
 *
 * @returns {undefined}
 */
_me.__traverseSelection = function (currentNode, endNode, fromChild) {
	// We are at tree leaf (text node) - we know parent node of text node or BR node which holds information about the style of the text
	// Add this parent node to stack of selected nodes
	if ((Node.TEXT_NODE === currentNode.nodeType && '' !== currentNode.nodeValue.trim()) || 'BR' === currentNode.nodeName) {
		this.__currentSelectionElements.push(currentNode.parentNode);
	}

	// In case end node of selection was reached stop traversing
	// In case the end node has some children, they must be added to stack (and when we return from children, don't traverse them again - fromChild param)
	if (currentNode === endNode && (0 === currentNode.childNodes.length || fromChild)) {
		return;
	}

	// Current node has children - traverse them
	// In case we already return from children, don't traverse them again - fromChild param
	if (currentNode.childNodes.length > 0 && !fromChild) {
		this.__traverseSelection(currentNode.firstChild, endNode);
		return;
	}

	// Current node has next sibling - traverse it
	if (currentNode.nextSibling) {
		this.__traverseSelection(currentNode.nextSibling, endNode);
		return;
	}

	// Current node has no next sibling or children so return back to parent and provide "fromChild" param to tell next cycle to not traverse children again
	this.__traverseSelection(currentNode.parentNode, endNode, currentNode);
};

/**
 * Accepts multiple sets of styles (font, weight, decoration ...) and create result set where only styles which are common for given sets are present.
 *
 * @param {Array} styles - Set of styles for particular element
 *
 * @returns {Object} Result set
 */
_me.__mergeStyles = function (styles) {
	var	result = {},
		i,
		property;

	if (styles.length > 0) {
		result = styles[0];
	}

	for (i = 1; i < styles.length; i++) {
		for (property in styles[i]) {
			if (styles[i][property] !== styles[0][property]) {
				result[property] = undefined;
			}
		}
	}

	return result;
};

_me._emoji = function(){

	if (this.__emoji) return;
	this.__emoji = true;

	var tmp = mkElement('A', {
		className: 'ico icosmile',
		title: getLang('SMILES::SMILES'),
		id: this._pathName + '/emoji'
	});

	var me = this;

	tmp.addEventListener('click', function (e) {
		if(this.classList.contains('active')) {
			me._hideToolbars();
		} else {
			me._showToolbar('emoji');

			// Create Smileys
			me._create('emoji', 'obj_smilebox', 'emoji_toolbar', '', [
				function (smile) {
					var src = 'client/skins/default/images/smiles/' + smile.sprite + '/' + smile.smiley + '.png';
					var html = '<img class="smiley" src="' + src + '" alt="' + smile.name + '" width="20" height="20" style="height: 1.2em; width: 1.2em">';
					me.__exec('html.insert', [html, true], true, function() {
						me.__exec('undo.saveStep');
					});
				}
			]);
		}

		e.cancelBubble = true;
		if (e.stopPropagation)
			e.stopPropagation();
		if (e.preventDefault)
			e.preventDefault();
		return false;
	});

	this._getAnchor('additional').appendChild(tmp);
};

_me.__destruct = function() {
	try{
		// this._editor.destroy();
		// this._editor = null;
	}
	catch(r){
		gui._REQUEST_VARS.debug && console.log(this._name, 'destroy', r);
	}
};
