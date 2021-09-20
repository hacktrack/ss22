_me = obj_list_load_im.prototype;
function obj_list_load_im(){};

_me.__constructor = function(){
	storage.library('obj_highlight');

	this.__options = {
		autoscroll:true
	};

	this._row2 = obj_list_load.prototype._row.bind(this);
	this.__aRequestData.fetchnew = false;

	this._getAnchor('loading').innerHTML = getLang('CHAT::LOADING');

	this._onclick = function(e){
		var elm = e.target;
		if (elm.tagName == 'A' && elm.protocol === 'mailto:'){
			e.preventDefault();
			NewMessage.compose({to:elm.pathname});
			return false;
		}
	};

	this._oncontext = function(e){
		var elm = e.target;
		if (elm.tagName == 'A' && elm.protocol === 'mailto:'){
			e.preventDefault();
			e.stopPropagation();

			var pos = getSize(elm),
				cmenu = gui._create('cmenu', 'obj_context_link','','','', elm.pathname);
				cmenu._place(pos.x+pos.w,pos.y+(pos.h/2));

			return false;
		}
	};
};

_me._fill = function(aData, bSkipTodayLabel, bTop){
	if (aData && aData.length){
		this.__loading = 1;
		this._response(aData, !bTop, !bTop);
	}
};

_me._response = function(aData, bUpdate, bScroll, bSkipTime){

	var bScrollDown = false,
		scroll = false;

	//Scroll to bottom?
	if (bScroll){
		var elm, n = this.__body.childNodes;
		if (n.length && (elm = n[n.length-1])){
			if (elm.offsetTop<this.__body.scrollTop + this.__body.clientHeight)
				bScrollDown = true;
			else
			if (this.__body.scrollTop+this.__body.scrollHeight == this.__body.clientHeight)
				bScrollDown = true;
		}
		else
			bScrollDown = true;
	}
	else
	if (!bUpdate)
		scroll = [this.__body.scrollTop, this.__body.scrollHeight];

	var last, date;

	for (var iid in aData){

		this.__aData[iid] = {data:aData[iid]};
		date = IcewarpDate.unix(aData[iid].date);

		//separator
		var sep = CalendarFormatting.normal(date),
			bToday = date.isToday();

		if (bUpdate){
			if (this.__sep2.sep != sep){
				this.__sep2 = {sep:sep, today:bToday};
				obj_list_load.prototype._separator.call(this, '<span>'+ this.__sep2.sep +'</span>', this.__sep2.today?'today':'');
			}
		}
		else
		if (this.__sep1.sep != sep){
			if (this.__sep1.sep)
				this._separator('<span>'+ this.__sep1.sep +'</span>', this.__sep1.today?'today':'', false, true);

			this.__sep1 = {sep:sep, today:bToday};

			if (!this.__sep2.sep)
				this.__sep2 = {sep:sep, today:bToday};
		}

		var row = false,
			bGroup = false;

		if (bUpdate){

			row = this._row2('', bToday?'today':'', iid);

			//Grouping Update
			if (this.__sep2.row && this.__sep2.row.group && this.__sep2.row.email == aData[iid].from && ['system','notice'].indexOf(aData[iid].type)<0 && this.__sep2.row.time>date.unix() - 300)
				addcss(row.elm, 'group');

		}
		else{
			row = this._row('', bToday?'today':'', iid);

			//Grouping History
			if (this.__sep1.row && this.__sep1.row.group && this.__sep1.row.email == aData[iid].from /*&& ['system','notice'].indexOf(aData[iid].type)<0*/ && this.__sep1.row.time<date.unix() + 300)
				addcss(this.__sep1.row.elm, 'group');
		}

		if (row){

			try{

				switch(aData[iid].type){
				case 'system':
					var tmp = {
						time: date.format('LT'),
						fulltime: date.format('L LT'),
						body: this.__encode_body(aData[iid].body)
					};

					row.elm.innerHTML = template.tmp('obj_list_load_im_system', tmp);
					break;

				case 'notice':
					var tmp = {
						from:this._translateUser(aData[iid].from),
						time: date.format('LT'),
						fulltime: date.format('L LT'),
						body: this.__encode_body(aData[iid].body)
					};

					row.elm.innerHTML = template.tmp('obj_list_load_im_notice', tmp);
					break;

				default:

					var tmp = {
						me:aData[iid].reply,
						avatar:getAvatarURL(aData[iid].from),
						from:this._translateUser(aData[iid].from),
						time: date.format('LT'),
						fulltime: date.format('L LT')
					};

					if (Is.Object(aData[iid].body)){
						switch (aData[iid]['body'].type){
						case "file":
							this._create('item', 'obj_list_load_im_file', row.anchor, '', aData[iid], tmp);
							break;

						case "geoloc":
							var key = GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key') || '';
							if(key) {
								tmp.addon = true;
								tmp.addon_body = mkElement('iframe', {frameborder: 0, src: './client/gmaps.html?obj=gui.map&scale_controll=0&' + buildURL({lat:aData[iid]['body'].geoloc.LAT[0].VALUE, lon:aData[iid]['body'].geoloc.LON[0].VALUE, key: key})}).outerHTML + '<p class="overlay"></p>';
								row.elm.innerHTML = template.tmp('obj_list_load_im_message', tmp);

								row.elm.querySelector('iframe + p.overlay').onclick = function(){
									this.parentNode.removeChild(this);
								};
							} else {
								tmp.body = this.__encode_body(getLang('IM::GEO_KEY_MISSING')) + '<br><a target="_blank" href="https://www.google.com/maps/place/'+encodeURIComponent(aData[iid]['body'].geoloc.LAT[0].VALUE+','+aData[iid]['body'].geoloc.LON[0].VALUE)+'">' + getLang('IM::OPEN_IN_GOOGLE_MAPS') + '</a>';
								row.elm.innerHTML = template.tmp('obj_list_load_im_message', tmp);
							}
							break;
						}
					}
					else{

						// Conference link transformation
						var m;
						if (~aData[iid]['body'].indexOf('/conference/') && Is.Array(m = aData[iid]['body'].match(wm_conference.linkRegExp))){
							 	tmp.body = Smiles.replaceSmiles(aData[iid].body.escapeHTML()).replace(wm_conference.linkRegExp, '<a onclick="wm_conference.get(\'' + m[2] + '_' + m[1] + '\').join(); return false;">' + m[0] + '</a>');
							 	this._create('item', 'obj_list_load_im_conference', row.anchor, '', aData[iid], tmp, m[2] + '_' + m[1]);
						}
						else{
							tmp.body = obj_highlight._highlight(this.__encode_body(aData[iid].body));



							row.elm.innerHTML = template.tmp('obj_list_load_im_message', tmp);
							bGroup = true;
						}
					}
				}

			}
			catch(r){
				if (this.__aData[iid] && (!this.__aData[iid].obj || !this.__aData[iid].obj._destructed))
					throw r;
				return;
			}

			this.__aData[iid].anchor = row.anchor;

			if (bUpdate)
				this.__sep2.row = {elm: row.elm, email: aData[iid].from, time: date.unix(), group: bGroup};
			else{
				this.__sep1.row = {elm: row.elm, email: aData[iid].from, time: date.unix(), group: bGroup};

				if (!this.__sep2.row)
					this.__sep2.row = clone(this.__sep1.row);
			}

			last = row;
		}

		if (this.__options.autoscroll){
			if (bScrollDown)
				this._scroll(0);
			else
			if (scroll)
				this.__body.scrollTop = scroll[0] + this.__body.scrollHeight - scroll[1];
		}

	}

	if (!bUpdate){

		if (this.__anim_last && this.__anim_last.parentNode)
			this.__anim_last.parentNode.removeChild(this.__anim_last);

		if (this.__sep1.sep){
			this.__anim_last = this._separator('<span>'+ this.__sep1.sep +'</span>', this.__sep1.today?'today':'', true).elm;
			addcss(this.__anim_last,'last');
			this._main.appendChild(this.__anim_last);
		}
	}

	if (this.__sep1.sep && !this.__anim && last && this.__sep1.elm !== last.elm){
		this.__anim = this._separator('<span>'+ this.__sep1.sep +'</span>', this.__sep1.today?'today':'', true).elm;
		this._main.appendChild(this.__anim);
	}

	if (this.__body.style.visibility == 'hidden')
		this.__body.style.visibility = 'visible';

	if (!bSkipTime)
		this.__loading = 0;

	this._fetch();
};

_me._system = function (sStatus) {

	var aData = [
		{
			body: sStatus,
			date: new IcewarpDate(),
			type: 'system'
		}
	];

	this._response(aData, true, true, true);
};
_me._notice = function (sFrom, sBody){

	var aData = [
		{
			from: sFrom,
			body: sBody,
			date: (new IcewarpDate()).unix(),
			type: 'notice'
		}
	];

	this._response(aData, true, true, true);
};
_me._add = function(sFrom, sTo, sBody, bReply, date){

	var aData = [
		{
			from: sTo || sFrom,
			body: sBody,
			reply: bReply,
			date: date
		}
	];

	this._response(aData, true, true, true);
};

/////////////////////

_me._translateUser = function (sUser) {

	if (sUser == sPrimaryAccount)
		return dataSet.get('main',['fullname']) || dataSet.get('main',['user']);

	return dataSet.get('xmpp', ['roster', sUser, 'name']) || sUser;
};

_me.__encode_body = function(sBody, bShortUrl){

	if (sBody){

		//block hljs & mentions
		var aOut = [],
			aBody = sBody.split('```');
		if (aBody.length<3)
			aBody = [sBody];

		//search for inline hljs outside hl-blocks
		aBody.forEach(function(s, i){
			if (i%2 == 0){
				// var a = s.split(/(?<!`)`(?!`)/g);
				// if (a.length>2){
				// 	aOut = aOut.concat(a);
				// 	return;
				// }

				var a = s.split('`');
				if (a.length>2){
					a.forEach(function(v,j,a){
						var l = aOut.length;
						if (j && l%2 && (a[j]=='' || (j-1 && a[j-1]=='') || typeof a[j+1] == 'undefined')) //(a[j+1]=='' && a.length>j+2) ||
							aOut[l-1].value += '`'+v;
						else
							aOut.push({
								value: v,
								wrapper: j%2 && '`'
							});
					});
					return;
				}
			}

			aOut.push({
				value: s,
				wrapper: i%2 && '```'
			});
		});

		return aOut.map(function(v, i){
			//Decorate only odd entries
			if (i%2 == 0){
				//Smiles
				var hla = v.value.highlight_links_array(bShortUrl),
					str =  GWOthers.getItem('CHAT','smiles') == '1' ? Smiles.replaceSmiles(hla.string.escapeHTML()) : hla.string.escapeHTML();

				var sOut = str.replace(new RegExp(hla.replace, 'g'), function(s, id){
					return hla.array[id];
				});

				//links, icons
				return sOut;
			}

			//untouched, hljs output
			if(v.wrapper) {
				v.value = v.wrapper + v.value + v.wrapper;
			}
			return v.value;

		}).join('');

	}

	return '';
};
