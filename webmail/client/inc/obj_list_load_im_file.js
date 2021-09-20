_me = obj_list_load_im_file.prototype;
function obj_list_load_im_file(){};

_me.__constructor = function(aData, aTmpData) {

	var tmp = mkElement('A',{href:aData['body'].url}),
		sFileName = aData['body'].url,
		sUrl = aData['body'].url,
		doc = false;

	if (tmp.pathname){
		sFileName = Path.basename(tmp.pathname).urlDecode();
		if (tmp.pathname.indexOf('/teamchatapi/') == 0 || tmp.pathname.indexOf('teamchatapi/') == 0)
			sUrl += '&thumbnail=1&waittime=10000';
	}
	tmp = null;

	aTmpData.desc = aData['body'].desc || sFileName || '';

	this._draw('obj_list_load_im_file', 'main', aTmpData);

	switch(Path.extension(sFileName)){
		default:
			if (Item.officeSupport(sFileName))
				doc = true;

		case 'ico':
		case 'jpg':
		case 'jpeg':
		case 'gif':
		case 'png':

			addcss(this._getAnchor('image').parentNode, 'ico');
			addcss(this._getAnchor('image'), 'ico_' + Path.extension(sFileName));

			var img = new Image();

			img.onload = function(){

				if (!this || this._destructed)
					return;

				var bScroll = false,
					bSafari = false,
					h = this._main.offsetHeight;

				if (this._parent._scroll){
					var pos1 = getSize(this._parent.__body),
						pos2 = getSize(this._main);

					if ((bScroll = (pos1.y + pos1.h >= pos2.y + pos2.h)))
						bSafari = window.navigator && window.navigator.browser && window.navigator.browser.application && window.navigator.browser.application.toLowerCase() == 'safari';
				}

				removecss(this._getAnchor('image').parentNode, 'ico');
				removecss(this._getAnchor('image'), 'ico_' + Path.extension(sFileName));

				if (!this.__preview){
					this.__preview = mkElement('img');
					this._getAnchor('image').appendChild(this.__preview);
					addcss(this._getAnchor('image'),'preview');
					if (doc)
						addcss(this._getAnchor('image'),'doc');
				}

				if (bScroll && bSafari)
					this.__preview.onload = function(){
						try{
							if (!this._destructed && this._main.offsetHeight - h != 0)
								this._parent._scrollBy(Math.abs(this._main.offsetHeight - h));
						}
						catch(r){gui._REQUEST_VARS.debug && console.log(this._name || false, r);}
					}.bind(this);

				this.__preview.src = img.src;

				if (bScroll && !bSafari && this._main.offsetHeight - h != 0)
				  	this._parent._scrollBy(Math.abs(this._main.offsetHeight - h));

			}.bind(this);

			img.onerror = function(){
				if(!this._getAnchor('image')) {
					return;
				}
			}.bind(this);

			img.src = sUrl;
	}

	this.btn_download._onclick = function(){
		downloadItem(aData['body'].url, true);
	};

	if (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == '1' && (Item.officeSupport(sFileName) || Path.extension(sFileName) === 'pdf')) {
		this._create('btn_open','obj_button',{target:'btn', first:true},'color1');
		this.btn_open._value('POPUP_ITEMS::OPEN');
		this.btn_open._onclick = function(){
			if (Path.extension(sFileName) === 'pdf') {
				if(currentBrowser().match(/^MSIE([6-9]|10)$/)) {
					this.btn_download._onclick();
				} else {
					gui._create('pdf','frm_pdf')._load(aData['body'].url, sFileName);
				}
			}
			else
			if (Item.officeSupport(sFileName)){
				var parsed = parseURL(aData['body'].url) || {};
				Item.officeOpen(parsed.id ? {iid: parsed.id, ticket: parsed.ticket} : {url:aData['body'].url, ticket: parsed.ticket},[downloadItem,[aData['body'].url,true]], Path.extension(sFileName), parsed.id || 'view');
			}
		}.bind(this);
	}

	this._getAnchor('image').onclick = function(){
		if (this.__preview && Path.extension(sFileName) === 'pdf') {
			if (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == '1' || currentBrowser().match(/^MSIE([6-9]|10)$/))
				this.btn_download._onclick();
			else
				gui._create('pdf','frm_pdf')._load(aData['body'].url, sFileName);
		}
		else
		if (Item.officeSupport(sFileName)){
			var parsed = parseURL(aData['body'].url) || {};
			Item.officeOpen(parsed.id ? {iid: parsed.id, ticket: parsed.ticket} : {url:aData['body'].url, ticket: parsed.ticket},[downloadItem,[aData['body'].url,true]], Path.extension(sFileName), parsed.id || 'view');
		}
		else
		if (this.__preview && !Item.editSupport(sFileName)){
			var img = gui._create('imgview','frm_imgview');
				img._fill([{url:aData['body'].url,title:sFileName}]);
				img._value(0);
		}
		else
			this.btn_download._onclick();

	}.bind(this);
};
