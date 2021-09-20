_me = obj_chat.prototype;
function obj_chat() {};

_me.__constructor = function () {
	//this._counter = 0;
	var me = this;

	this.__lastRcp = [];

	this._container = mkElement('div', {className: 'maxbox'});

	this._main.onclick = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (e.target.classList.contains('image-wrapper') || e.target.parentElement.classList.contains('image-wrapper')) {
			var image = gui._create('imgview', 'frm_imgview');
			var current = false;
			var target = e.target.nodeName === 'IMG' ? e.target : e.target.firstChild;
			var images = [].map.call(me._main.querySelectorAll('img.preview'), function (img) {
				if (target === img) {
					return current = {url: img.getAttribute('src')};
				}
				return {url: img.getAttribute('src')};
			});
			image._fill(images);
			image._value(images.indexOf(current));
			return;
		}

		if (elm.tagName == 'A') {
			if (elm.rel) {
				if (me._onclickdate)
					me._onclickdate(elm.rel);
			} else
			if (elm.href.toLowerCase().indexOf('mailto:') == 0) {
				NewMessage.compose({to: elm.href.substr(7)});
				return false;
			}
		} else
		if (me._onclickuser && elm.tagName == 'SPAN' && elm.getAttribute('rel'))
			me._onclickuser(elm.getAttribute('rel'));
	};

	this._main.oncontextmenu = function (e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'A')
			if (elm.href.toLowerCase().indexOf('mailto:') == 0) {
				me._context_link(e, elm.href.substr(7), elm.innerHTML);
				return false;
			}
	};

	this._main.appendChild(this._container);
	this._scrollbar(this._container, this._main);

	//Preloading history
	AttachEvent(this._container, 'onscroll', function () {
		me._history_scroll();
	});
};

_me._msgHeader = function (sBody) {
	if (typeof sBody === 'object') {
		switch (sBody.type) {
		case "image":
			return getLang('IM::SHARED_IMAGE');
		case "geoloc":
			return getLang('IM::SHARED_LOCATION');
		}
	}
	return '';
};

_me._add = function (sFrom, sTo, sBody, bReply, date, bGroup) {

	var toDay, out = '', sTo = sTo || '';
	if (!date) {
		toDay = date = new IcewarpDate();
	} else {
		toDay = new IcewarpDate();
		toDay.hour(0).minute(0).second(0);
	}

	//prepare body
	if (this.__lastRcp[0] != sFrom + '/' + sTo || this.__lastRcp[0] == sFrom + '/' + sTo && this.__lastRcp[0] != bGroup || (this.__lastRcp[1] && date.unix() - this.__lastRcp[1].unix() > 300))
		out += '<div><span class="obj_chat_date">' + (date < toDay ? date.format('L LT') : date.format('isoTime')) + '</span> <span class="obj_chat_from ' + this._styleuser(sFrom) + '" rel="' + sFrom.entityify() + '">' + this._translateUser(sFrom).escapeHTML() + '</span> ' +this._msgHeader(sBody)+ (sTo ? ' <span class="obj_chat_to ' + this._styleuser(sTo) + '" rel="' + sTo.entityify() + '">' + this._translateUser(sTo).escapeHTML() + '</span>' : '') + '</div>';

	// Conference link transformation
	var m;
	if(typeof sBody === 'object'){
		switch(sBody.type){
		case "image":
			out += '<div class="obj_chat_body"><div class="image-wrapper"><img class="preview" src="'+sBody.url+'"></div><a href="'+sBody.url+'" target="_blank">Download</a></div>';
			break;
		case "geoloc":
			out += '<div class="obj_chat_body"><iframe frameborder="0" style="border:0"src="./client/gmaps.html?obj=gui.map&scale_controll=0&lat='+sBody.geoloc.LAT[0].VALUE+'&lon='+sBody.geoloc.LON[0].VALUE+'&key='+(GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key') || '')+'"></iframe></div>';
			break;
		}
	}else if (~sBody.indexOf('/conference/') && (m = sBody.match(wm_conference.linkRegExp)))
		out += '<div class="obj_chat_body">' + this._smiles(sBody).replace(wm_conference.linkRegExp, '<span onclick="wm_conference.get(\'' + m[2] + '_' + m[1] + '\').join()">' + m[0] + '</span>') + '</div>';
	// Normal chat output
	else
		out += '<div class="obj_chat_body">' + this._smiles_links(sBody) + '</div>';

	var elm = mkElement('div', {className: 'obj_chat_row' + (GWOthers.getItem('IM', 'block_chat') > 0 ? '' : ' obj_chat_row_inline') + (bReply ? ' obj_chat_reply' : ''), innerHTML: out});
	this._container.appendChild(elm);

	this.__lastRcp = [sFrom + '/' + sTo, date, bGroup];
	this._scroll();
};

_me._history = function (b) {
	if (b) {

		this.__history = true;

		if (this.__helm && this.__helm.parentNode)
			this.__helm.parentNode.removeChild(this.__helm);

		this.__helm = mkElement('div', {className: 'history'});
		this.__helm.innerHTML = getLang('IM::LOAD_HISTORY');

		var me = this;
		this.__helm.onclick = function () {
			if (me._onhistory && me.__history) {
				me._onhistory(me);
				me.__history = false;
				//me._history(false);
			}
		};

		this._container.insertBefore(this.__helm, this._container.firstChild || null);

		addcss(this._main, 'history');
	} else {
		this.__history = false;
		removecss(this._main, 'history');
	}
};
_me._history_scroll = function (b) {
	if (this._onhistory && this.__history) {

		if (this.__helm && this._container.scrollTop < 50) {
			this.__helm.style.opacity = 0.8 * (1 - (this._container.scrollTop / 50));
			this.__helm.style.marginTop = (25 - (this._container.scrollTop / 2)) + 'px';
		}

		if (this._container.scrollTop == 0) {
			this._onhistory(this);
			this.__history = false;
		}
	}
};

_me._smiles = function (sBody) {
	return Smiles.replaceSmiles(sBody.entityify());
};

_me._smiles_links = function(sBody){
	if (sBody){
		var hla = sBody.highlight_links_array(),
			sBody = Smiles.replaceSmiles(hla.string.entityify());

		return sBody.replace(new RegExp(hla.replace, 'g'), function(s, id){
			return hla.array[id];
		});
	}
};

_me._context_link = function (e, sMail, sName) {
	var c = gui._create('context', 'obj_context_link', '', '', sName, sMail);
	c._place(e.clientX, e.clientY);
	c = null;
};

_me._system = function (sStatus) {
	var date = new IcewarpDate(),
		elm = mkElement('div', {className: 'obj_chat_system'});
	elm.innerHTML = '<span class="obj_chat_date" title="' + date.toString() + '">' + date.format('isoTime') + '</span> <span class="obj_chat_info">' + sStatus + ' </span>';

	this._container.appendChild(elm);
	this.__lastRcp = [];
	this._scroll();
};

_me._notice = function (sFrom, sStatus) {
	var date = new IcewarpDate(),
		elm = mkElement('div', {className: 'obj_chat_status'});
	elm.innerHTML = '<span class="obj_chat_date" title="' + date.toString() + '">' + date.format('isoTime') + '</span> <span class="obj_chat_from">' + this._translateUser(sFrom) + '</span> - <span class="obj_chat_info">' + sStatus.escapeHTML() + ' </span>';

	this._container.appendChild(elm);
	this.__lastRcp = [];
	this._scroll();
};

_me._clear = function () {
	this._container.innerHTML = '';
};

_me._scroll = function () {
	var n;
	if ((n = this._container.scrollHeight - this._container.clientHeight) > 0)
		this._container.scrollTop = n;
};

/** XMPP **/
_me._fill = function (aData, bSkipTodayLabel, bTop) {
	if (!bTop){
		this._clear();}

	var str = '',
		sName,
		bBloc = GWOthers.getItem('IM', 'block_chat') > 0,
		//aRoster = dataSet.get('xmpp',['roster']),
		toDay = new IcewarpDate();
	toDay.hour(0).minute(0).second(0);

	var prev, sdate;
	for (var i in aData) {

		sName = this._translateUser(aData[i]['from']);

		//check date, add divider if date is not same
		sdate = aData[i]['date'].year() + '' + aData[i]['date'].month() + '' + aData[i]['date'].date();
		if (prev != sdate) {
			str += '<div class="obj_chat_split">' + aData[i]['date'].format("L") + '</div>';
			this.__lastRcp = [];
		}

		str += '<div class="obj_chat_row' + (bBloc ? '' : ' obj_chat_row_inline') + /*' obj_chat_'+(this._counter%2)+*/(aData[i]['reply'] ? ' obj_chat_reply' : '') + '">';

		if (this.__lastRcp[0] != sName || (this.__lastRcp[1] && aData[i]['date'].unix() - this.__lastRcp[1].unix() > 600)) {
			this.__lastRcp = [sName, aData[i]['date']];
			str += '<div><span class="obj_chat_date" title="' + aData[i]['date'].format("L LT") + '">' +
					(this._onclickdate ? '<a rel="' + aData[i]['sec'] + '" title="' + getLang('IM::SHOW_AFTER', [aData[i]['date'].format("L LT")]) + '">' + (aData[i]['date'] < toDay ? aData[i]['date'].format('L LT') : aData[i]['date'].format('isoTime')) + '</a>' : (aData[i]['date'] < toDay ? aData[i]['date'].format('L LT') : aData[i]['date'].format('isoTime'))) +
					'</span> <span class="obj_chat_from">' + sName.escapeHTML() + ' </span>'+this._msgHeader(aData[i]['body'])+'</div>';
		}

		// Conference link transformation
		var m;
		if (typeof aData[i]['body'] === 'object') {
			switch (aData[i]['body'].type) {
			case "image":
				str += '<div class="obj_chat_body"><div class="image-wrapper"><img class="preview" src="' + aData[i]['body'].url + '"></div></div><a href="'+aData[i]['body'].url+'" target="_blank">Download</a></div>';
				break;
			case "geoloc":
				str += '<div class="obj_chat_body"><iframe frameborder="0" style="border:0"src="./client/gmaps.html?obj=gui.map&scale_controll=0&lat='+aData[i]['body'].geoloc.LAT[0].VALUE+'&lon='+aData[i]['body'].geoloc.LON[0].VALUE+'&key='+(GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key') || '')+'"></iframe></div></div>';
				break;
			}
		} else if (~aData[i]['body'].indexOf('/conference/') && (m = aData[i]['body'].match(wm_conference.linkRegExp)))
			str += '<div class="obj_chat_body">' + this._smiles(aData[i]['body']).replace(wm_conference.linkRegExp, '<span onclick="wm_conference.get(\'' + m[2] + '_' + m[1] + '\').join()">' + m[0] + '</span>') + '</div></div>';
		// Normal chat output
		else{
			str += '<div class="obj_chat_body">' + (aData[i]['body'] ? this._smiles_links(aData[i]['body']) : '') + '</div></div>';}

		prev = sdate;
	}
	// Add label for today as divider if last conversation is older
	if (!bSkipTodayLabel && sdate < toDay.year() + '' + toDay.month() + '' + toDay.date()){
		str += '<div class="obj_chat_split">' + toDay.format('L') + '</div>';}

	var elm = mkElement('div', {innerHTML: str});

	if (bTop){
		this._container.insertBefore(elm, this._container.firstChild || null);
	}else {
		this._container.appendChild(elm);
		this._scroll();
	}
};

_me._translateUser = function (sUser) {
	return dataSet.get('xmpp', ['roster', sUser, 'name']) || sUser;
};

/** Conference **/
_me._styleuser = function (sUser) {
	return '';
};
