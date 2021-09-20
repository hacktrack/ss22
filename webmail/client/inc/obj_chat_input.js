_me = obj_chat_input.prototype;
function obj_chat_input() {};

/*
 _onsubmit
 */
_me.__constructor = function (arg) {

	var me = this;

	storage.library('purify.wrapper', 'purify');

	this.__options = arg || {};
	this.__options.giphy_enabled = Giphy.enable_keyboard;

	if (this.__options.handlers)
		addcss(this._main, 'add');

	this._draw("obj_chat_input",'main',arg);

	this.input.__maxHeight = this.__options.height || 300;

	this.input._onpaste = function (e) {
		var items = (e.clipboardData || (e.originalEvent || {}).clipboardData || {}).items || (window.clipboardData || {}).files || [];

		for (var i = 0; i < items.length; i++) {
			if (items[i].getAsFile && items[i].type.indexOf('image') === 0) {
				var file = items[i].getAsFile();
				try {
					file = new File([file], 'clipboard-' + new IcewarpDate() + '.png', {
						type: items[i].type
					});
				} catch(e) {}

				if (me._onpasteimage)
					me._onpasteimage([file]);

				me.__exeEvent('pasteimage',null,{"files":[file],"owner":this});
				e.preventDefault && e.preventDefault();
			}
		}
	};

	this.input._onkeydown = function (e) {

		//SEND KEY
		if (!this.suggest)
			if (e.keyCode == 13 && ((GWOthers.getItem('IM', 'enter_send') > 0 && !e.shiftKey) || e.ctrlKey)) {

				e.cancelBubble = true;

				if (e.preventDefault)
					e.preventDefault();
				if (e.stopPropagation)
					e.stopPropagation();

				var v = this._value().trim();

				if (me.__submit)
					me.__submit(v);

				return false;

			}
			else
			if (e.keyCode == 8 && me.__private && this._getCartPos() == 0) {
				me._private();
			}
			else
			if (e.keyCode == 27){

				if (me.preview)
					me.preview._destruct();
				else
				if (me._onclose)
					me._onclose(e);

				return false;
			}

		if (me._onkeydown)
			me._onkeydown(e);
	};

	//get urls
	var etmp = mkElement('div');
	this.input._onkeyup = function(){

		if (me.__options.parseurl && me.__smartcheck)
			window.clearTimeout(me.__smartcheck);

		if (me._destructed)
			return;

		//save state
		if (me.__options.memory && me.__options.memory.set){
			executeCallbackFunction(me.__options.memory.set, this._value());
		}

		if (me.__options.parseurl){
			me.__smartcheck = window.setTimeout(function(){

				if (me && !me._destructed && me.input){
					var s = me.input._value(),
						elm;

					etmp.innerHTML = DOMPurify.sanitize(s.highlight_links());



					if ((elm = etmp.getElementsByTagName('A')) && (elm = elm[0]) && elm.href && !~elm.href.indexOf('mailto:')){

						//strip hash, doesn't work on server
						var sHref = elm.href.split('#').shift();
						if (me.__lastURL != sHref && (me.__lastURL = sHref)){
							gui.socket.api._linkpreview(sHref,[function(aData){
								if (aData.ATTRIBUTES.ID){
									me.__lastURLID = aData.ATTRIBUTES.ID;
									me.__lastURL = sHref;

									me.__urlloading(true);
								}
							}]);
						}
						else{
							me.__urlloading(false);
							return;
						}
					}
					else{
						me.__urlloading(false);
						return;
					}

					delete me.__lastURL;
					delete me.__lastURLID;

					me.__urlloading(false);
					if (me.preview)
						me.preview._destruct();
				}

			},1500);
		}
	};

	this.label._onclick = function () {
		me._private();
	};

	if (this.__options.handlers)
		this.add._onclick = function (e) {
			if (!this.cmenu || this.cmenu._destructed) {

				e.cancelBubble = true;
				if (e.stopPropagation)
					e.stopPropagation();

				var aMenu = [];

				if (me.__options.handlers){
					if (me.__options.handlers['word'] || me.__options.handlers['excel'] || me.__options.handlers['ppoint'] || me.__options.handlers['note']) {
						aMenu.push({'title': 'CHAT::CREATE_NEW_DOCUMENT', css: 'ico2 file', nodes: [
								me.__options.handlers['word'] ? {'title': 'main_menu::new_word', 'arg': {'method': 'word'}, css: 'ico2 word'} : false,
								me.__options.handlers['excel'] ? {'title': 'main_menu::new_excel', 'arg': {'method': 'excel'}, css: 'ico2 excel'} : false,
								me.__options.handlers['ppoint'] ? {'title': 'main_menu::new_ppoint', 'arg': {'method': 'ppoint'}, css: 'ico2 ppoint'} : false,
								me.__options.handlers['note'] ? {'title': 'main_menu::new_note', 'arg': {'method': 'note'}, css: 'ico2 note'} : false
						].filter(Boolean)});
					}

					if (me.__options.handlers['attach']) {
						aMenu.push({'title': 'CHAT::SHARE_FILE_OR_DOCUMENT', 'arg': {'method': 'attach'}, css: 'ico2 attach'});
					}

					if (me.__options.handlers['code']) {
						aMenu.push({'title': 'INSERT_CODE::TITLE', 'arg': {'method': 'code'}, css: 'ico2 code'});
					}

					if (me.__options.handlers['conference']) {
						aMenu.push({'title': 'CHAT::NEW_CONFERENCE', 'arg': {'method': 'conference'}, css: 'ico2 conference', disabled: !sPrimaryAccountCONFERENCE});
					}

					if (me.__options.handlers['event'])
						aMenu.push({'title': 'IM::NEW_EVENT', 'arg': {'method': 'event'}, css: 'ico2 event'});

					if (me.__options.handlers['email'])
						aMenu.push({'title': 'CHAT::NEW_EMAIL', 'arg': {'method': 'email'}, css: 'ico2 email'});

					if (me.__options.handlers['geo'])
						aMenu.push({'title': 'IM::GEO', 'arg': {'method': 'geo'}, css: 'ico2 geo', disabled: !("geolocation" in navigator) || !GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key')});

				}
				else
					return;

				addcss(this._main, 'color1');

				var pos = getSize(this._main);
				this.cmenu = gui._create("cmenu", "obj_context", '', 'obj_chat_input_add', this);
				this.cmenu._fill(aMenu);
				this.cmenu._place(pos.x + pos.w / 2, pos.y, null, 3);

				var btn = this;
				this.cmenu._obeyEvent('destructed', [function () {
						removecss(btn._main, 'color1');
					}]);

				//var me = this;
				this.cmenu._onclick = function (e, elm, id, arg) {
					if (arg.method && me.__options.handlers && me.__options.handlers[arg.method])
						executeCallbackFunction(me.__options.handlers[arg.method]);
					else
						executeCallbackFunction(arg);
				};
			}
		};

	if (this.__options.smiles_enabled) {
		this.smile._onclick = function (e) {
			if (!gui.smile || gui.smile._destructed) {
				var oText = this._parent.input,
					aPos = getSize(this._main);
					this.smilebox = gui._create('smile', 'frm_smilebox','','',[function(smile){

						var iPos = oText._getCartPos();

						var text = (iPos>0?(oText._value().charAt(iPos-1) === ' '?'':' '):'') + smile.name + (oText._value().charAt(iPos) === ' '?'':' ');

						oText._value(oText._value().substr(0, iPos) + text + oText._value().substr(iPos));
						oText._setRange(iPos + text.length);

						if (me.__options.memory && me.__options.memory.set){
							executeCallbackFunction(me.__options.memory.set, oText._value());
						}

					}], aPos.x + aPos.w, aPos.y);

				e.cancelBubble = true;
				if (e.stopPropagation) e.stopPropagation();
				if (e.preventDefault) e.preventDefault();
				return false;
			}
			else
				gui.smile._destruct();
		};
	}
	if (this.__options.giphy_enabled) {
		this.giphy._onclick = function (e) {
			if (!gui.giphy || gui.giphy._destructed) {
				Giphy.trending('R', function (error, data) {
					var aPos = getSize(this._main),
						giphy = gui._create('giphy', 'obj_block_ext_uni', '', 'giphy_keyboard');

					giphy._place(aPos.x + aPos.w - 342, aPos.y - 403, 350, 400);
					giphy._main.innerHTML = '<div><input type="text" placeholder="Search query" id="giphy-keyboard-search"></div>\
				<div id="giphy-search-result"></div>';
					var timer = false;
					document.getElementById('giphy-keyboard-search').addEventListener('keyup', function () {
						if (timer) {
							clearTimeout(timer);
						}
						setTimeout(function () {
							Giphy.search(this.value, 'en', 'R', function (err, data) {
								var response = document.getElementById('giphy-search-result');
								while (response.firstChild) {
									response.removeChild(response.firstChild);
								}
								data.forEach(function (item) {
									var gif = document.createElement('span');
									gif.style.backgroundImage = 'url("' + item.images.fixed_width_small_still.url + '")';
									gif.style.display = 'inline-block';
									gif.classList.add('gif-item');
									gif.addEventListener('mouseenter', function () {
										this.style.backgroundImage = 'url("' + item.images.fixed_width_small.url + '")';
									});
									gif.addEventListener('mouseleave', function () {
										this.style.backgroundImage = 'url("' + item.images.fixed_width_small_still.url + '")';
									});
									gif.addEventListener('click', function () {
										Giphy.sendToTC(item.images.downsized.url, item.id, me._parent);
									});
									document.getElementById('giphy-search-result').appendChild(gif);
								});
							}, this);
						}.bind(this), 300);
					});
					data.forEach(function (item) {
						var gif = document.createElement('span');
						gif.style.backgroundImage = 'url("' + item.images.fixed_width_small_still.url + '")';
						gif.style.display = 'inline-block';
						gif.classList.add('gif-item');
						gif.addEventListener('mouseenter', function () {
							this.style.backgroundImage = 'url("' + item.images.fixed_width_small.url + '")';
						});
						gif.addEventListener('mouseleave', function () {
							this.style.backgroundImage = 'url("' + item.images.fixed_width_small_still.url + '")';
						});
						gif.addEventListener('click', function () {
							Giphy.sendToTC(item.images.downsized.url, item.id, me._parent);
						});
						document.getElementById('giphy-search-result').appendChild(gif);
					});
				}, this);


				e.cancelBubble = true;
				if (e.stopPropagation) e.stopPropagation();
				if (e.preventDefault) e.preventDefault();
				return false;
			}
			else
				gui.giphy._destruct();
		};
	}

	//subscribe url
	if (this.__options.parseurl)
		gui.socket.api._obeyEvent('onurlinfo', [function(aData){

			if (this._destructed)
				return false;

			if (this.__lastURL && Is.Object(aData) && aData.URL && this.__lastURL == aData.URL[0].VALUE)
				this.__urlpreview(aData);
			else
				this.__urlloading(false);

		}.bind(this)]);
};

_me._disabled = function (b) {
	if (Is.Defined(b)) {

		b ? addcss(this._main, 'disabled') : removecss(this._main, 'disabled');

		this.input._disabled(b);
		this.smile && this.smile._disabled(b);
		this.add._disabled(b);
	}
	else
		return this.input._disabled();

};

_me.__submit = function(v){

	if (this._onsubmit){

		var arg = {}, aM = this.input._mention();
		if (this.preview && !this.preview._destructed)
			arg = this.preview._value();

		if (!Is.Empty(aM))
			arg.mentions = aM;

		if (this._onsubmit(v, arg, this.__private) == false)
			return;

		if (this.input){
			this.input._value('');
			this.input._mention('');
		}

		delete this.__lastURL;
		delete this.__lastURLID;

		this.__urlloading(false);

		if (this.preview)
			this.preview._destruct();
	}

};

_me._private = function (name, email) {
	var tmp_escape = this.label._escape;
	if (email && email != sPrimaryAccount) {
		this.__private = {name: name, email: email};
		this.label._escape = true;
		this.label._value(name || email);
		this.label._escape = tmp_escape;
		this.label._disabled(false);
	} else {
		delete this.__private;
		this.label._disabled(true);
		this.label._value('');
	}

	this._focus();
};

_me._folder = function(aFolder){
	if (aFolder){
		this.input.__folder = aFolder;
		this.__lastURL = false;
		window.clearTimeout(this.__smartcheck);
		this.preview && this.preview._destruct();

		if (this.__options.memory && this.__options.memory.get){
			this.input._value(executeCallbackFunction(this.__options.memory.get));
			var placeholder = this.input.__eIN.getAttribute('placeholder');
			this.input.__eIN.setAttribute('placeholder', '');
			this.input.__eIN.setAttribute('placeholder', placeholder);
		}

		this.input._onkeyup();
	}
	else
		return this.input.__folder || {};
};

_me._value = function (v) {
	return this.input._value(v);
};

_me._focus = function () {
	return this.input._focus();
};
_me._hasFocus = function(){
	return this.input._hasFocus();
};

/* Preview part */
_me.__onDestroyChild = function(sName){
	if (sName == 'preview')
		removecss(this._main, 'preview', 'loading');
};
_me.__urlloading = function(b){
	b?addcss(this._main, 'loading'):removecss(this._main, 'loading');
};
_me.__urlpreview = function(aData){
	this._create('preview', 'obj_urlpreview','preview','', aData);
	this.preview._onclose = function(){
		this._focus();
	}.bind(this);

	removecss(this._main, 'loading');
	addcss(this._main, 'preview');
};
