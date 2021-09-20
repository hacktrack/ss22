_me = obj_mailview.prototype;
function obj_mailview(){};

_me.__constructor = function(sDataSet,sDataPath,bCheckActive){
	var me = this;

	this._skipsaving = false;
	this._noupdate = false;

	this._checkActive = bCheckActive;

	// Browser detection
	this._MSIE = currentBrowser().indexOf('MSIE')>-1;

	this.__eHeader = this._getAnchor('header');
	this.__eSubject = this._getAnchor('subject');
	this.__eFrom = this._getAnchor('from');

	this.__FullHeaders = null;
	this.__HiddenImages = true;
	this.__TextBody = false;

	//Is Address Book available?
	var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');
	this.__ab_support = sPrimaryAccountGW>0 && (!dgw || dgw.indexOf('c')<0);

	//scrollbar
	this._scrollbar(this._getAnchor('block'),this._getAnchor('block').parentNode);

	//Skip images
	this.__imgarray = {};

	this.__eFrame = this._getAnchor('frame');
	this.__doc = this.__eFrame.contentDocument || this.__eFrame.contentWindow.document;

	this.__doc_base = document.getElementsByTagName('base');
	this.__doc_base = this.__doc_base[this.__doc_base.length-1].getAttribute('href');

	//Helping resize frame
	var eHelp = mkElement('iframe',{frameborder:0, marginheight:0, marginwidth:0, src:"", className:'helper', style: {height:'1px'}});
	this._main.appendChild(eHelp);
	eHelp.contentWindow.onresize = function (e){
		if (this.__width != eHelp.offsetWidth){
			this.__width = eHelp.offsetWidth;
			me.__resize && me.__resize(true);
		}
	};

	this._getAnchor('teamchat') && this._getAnchor('teamchat').addEventListener('click', function(e) {
		function __uploadhandler(aTo, aBuffer, sName, sDesc, aArg) {
			if (aBuffer && aBuffer.length){
				var d = new IcewarpDate(),
					aItemInfo = {values: {}, ATTACHMENTS: []};

				aItemInfo.values.EVNSHARETYPE = 'U';
				aItemInfo.values.EVNCLASS = 'F';
				aItemInfo.values.EVNSTARTDATE = d.format(IcewarpDate.JULIAN);
				aItemInfo.values.EVNSTARTTIME = d.hour()*60 + d.minute();

				if (aBuffer.length == 1){
					aItemInfo['values']['EVNRID'] = aItemInfo['values']['EVNLOCATION'] = aItemInfo['values']['EVNTITLE'] = sName || aBuffer[0].name;
					aItemInfo['values']['EVNCOMPLETE'] = aBuffer[0].size;

					if (Is.String(sDesc) && sDesc.length){
						aItemInfo['values']['EVNNOTE'] = sDesc;
						aItemInfo['values']['EVNDESCFORMAT'] = 'text/plain';
					}
				}

				for (var i = 0, j = aBuffer.length; i < j; i++) {
					aItemInfo['ATTACHMENTS'].push({values:aBuffer[i]});
				}

				//Sent to server
				WMItems.add(aTo, aItemInfo,'','','', [function(bOK, aData){
					if (bOK){
						gui.notifier._value({type: 'message_sent_tch', args: [dataSet.get('folders', aTo).NAME || dataSet.get('folders', aTo).RELATIVE_PATH || '']});
					} else {
						if(aData === 'item_create') {
							aData = 'ALERTS::FOLDER_INSUFFICIENT_RIGHTS';
						} else {
							aData = 'ERROR::' + aData;
						}
						gui.notifier._value({type: 'alert', args: {header: 'ALERTS::MESSAGE_NOT_SAVED', text: aData}});
					}
				}.bind(this)]);
			}
		};

		var f = dataSet.get('folders', [sPrimaryAccount]);
		for(var id in f){
			if (f[id].TYPE == 'I'){
				sFolder = id;
				break;
			}
		}

		if (sFolder) {
			gui._create('frm_select_folder', 'frm_select_folder', '', '', 'CHAT::SELECT', sPrimaryAccount, sFolder,
				[function(aid, fid) {
					var __upload_buffer = [];

					var data = dataSet.get('items', [me.__aid, me.__fid, me.__iid]);
					__upload_buffer.push({
						'class': 'item',
						'description': (data.SUBJECT || '').replace(/[<>:\/\\|?*""\[\]]/g, ''),
						'size': data.SIZE,
						'fullpath': me.__aid + '/' + me.__fid + '/' + me.__iid.replace(/^\*/, '')
					});

					if (__upload_buffer.length == 1) {
						gui._create('chat_upload', 'frm_chat_upload', '', '', __upload_buffer[0].description, '', {aid: aid, fid: fid}, [function (sName, sDesc, aArg) {
							__uploadhandler([aid, fid], __upload_buffer, sName, sDesc, aArg);
						}]);
					} else {
						__uploadhandler([aid, fid], __upload_buffer);
					}
				}], true, true, ['Y','I'], '', true
			);
		}
	});

	var html =	"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n"+
				"<html>\n<head>\n"+
				//'<link type="text/css" rel="stylesheet" href="'+ this.__doc_base + 'client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/css.php?'+ buildURL({skin:GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette:GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file:'obj_mailview_body.css'}) + '" />'+
				"\n</head>\n<body></body>\n</html>";

	this.__doc.open('text/html','replace');
	this.__doc.write(html);
	this.__doc.close();

	// Append Style Sheet (all browsers except MSIE)
	/*
	if (!this._MSIE){
		var link = this.__doc.createElement('link');
			link.setAttribute("type","text/css");
			link.setAttribute("rel","stylesheet");
			link.setAttribute("href","client/skins/default/css/obj_mailview_body.css");
			this.__doc.getElementsByTagName('head')[0].appendChild(link);
			link = null;
	}
	*/

	//Events
	// Drag & Drop
	if (window.FormData){
		this.__doc.addEventListener("dragstart", function(e){
			gui.frm_main.__filedrag = false;
		}, false);
		this.__doc.addEventListener("dragend", function(e){
			gui.frm_main.__filedrag = true;
		}, false);
	}

	//Skip Images
	this._getAnchor('skip').onclick = function (){
		if(!me.__HTMLBody){
			me.__showHTML();
			this.style.display = 'none';
		}
	};
	//Show Images
	this._getAnchor('show').onclick = function (){
		me.__showImages();
	};

	//Deferred email
	this._getAnchor('deferred').onclick = function (){
		OldMessage.delivery_report([me.__aid, me.__fid, me.__iid]);
	};


	this.__eHeader.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'A'){
			//Click on TAG
			if (hascss(elm,'tag')){
				if (gui.frm_main.search.search){
					gui.frm_main.search.search._value('tag:"' + elm.innerHTML + '"');
					if (gui.frm_main.search.search._onsubmit)
						gui.frm_main.search.search._onsubmit();
				}
			}
			else
			if (elm.rel){

				var aMail = MailAddress.splitEmailsAndNames(elm.rel);
				if (aMail && aMail[0]){

					//Certificate
					try{
						var aCert;
						if (me.__header_cert && me.__header_cert.values.TYPE.toLowerCase() == 'certificate' && (me.__header_cert.values.CERT.INFO[0].SUBJECT[0].EMAILADDRESS && me.__header_cert.values.CERT.INFO[0].SUBJECT[0].EMAILADDRESS[0].VALUE.toLowerCase() == aMail[0].email.toLowerCase()))
							aCert = [{values:{'class':'item','fullpath':me.__aid +'/'+ me.__fid +'/'+ WMItems.__serverID(me.__iid)}}];
					}
					catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

					elm && elm.classList && elm.classList.add('selected');
					var pos = getSize(elm),
						cmenu = gui._create('cmenu','obj_context_link','','',aMail[0].name,aMail[0].email,aCert,undefined,me._recipients);
					cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',2);

					cmenu.__remove_class = function() {
						elm && elm.classList && elm.classList.remove('selected');
					};
					cmenu._add_destructor('__remove_class');
				}


				if (e.preventDefault) e.preventDefault();
				e.cancelBubble=true;
				return false;
			}
		}
	};

	this.__eHeader.oncontextmenu = function(e){

		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'A' && hascss(elm,'address') && elm.rel)
			this.__eHeader.onclick(e);
		//NewMessage.compose({to:elm.rel});

		return false;
	}.bind(this);

	this._getAnchor('block').oncontextmenu = function(e, frame){

		var elm = e.target || e.srcElement;
		if(elm.tagName === 'A' || elm.tagName === 'IMG') {
			return;
		}
		//In case of selection skip js menu
		try{
				var s = (frame ? frame.contentDocument : document).getSelection(),
				r = s.getRangeAt(0);

			if ((s.focusNode.parentNode || s.focusNode.parentElement) === elm && r.startOffset < r.endOffset)
				return;
		}
		catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

		if (!dataSet.get('folders',[me.__aid,me.__fid,'RSS'])){
			var e = e || window.event,
				pos = frame ? getSize(frame) : {x: 0, y: 0},
				cmenu = gui._create('cmenu','obj_context','','mailview_menu');

			cmenu._fill([
				{config:{css:'large'}},
				{title:'ATTACHMENT::SHOW_HEADERS', arg:[me,'__showHeaders'], css:(me.__FullHeaders?'ico2 check':'ico')},
				{title:'ATTACHMENT::SHOW_TEXT', arg:[me,'__showText',[!me.__TextBody]], css:(me.__TextBody?'ico2 check':'ico')},
				{title:'POPUP_ITEMS::SOURCE', arg:[function(){OldMessage.source([me.__aid,me.__fid,me.__iid])}], css:'ico'},
				{title:'MAIN_MENU::PRINT', arg:[me,'_print'], css:('ico')},
				{title:'-'},
				{title:'MAIL_VIEW::SHOW_RAW', arg:[function(){

					//var w = window.open('./basic/index.html?'+ buildURL({'_l':'item', 'p0':'html', 'p1':'html', 'p2':'mail.view.html', 'p3':me.__aid, 'p4':me.__fid, 'p5':'M', 'p6':WMItems.__serverID(me.__iid), 'raw':1}) ,"_blank");
					var w = window.open('client/raw.html?'+ buildURL({'sid':dataSet.get('main',['sid']),'aid':me.__aid, 'fid':me.__fid, 'iid':WMItems.__serverID(me.__iid)}) ,"_blank");
					w.opener = w;
					w.focus();
					w = null;

				}], css:'ico'}
			]);
			cmenu._place(e.clientX + pos.x, e.clientY + pos.y);

			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
			return false;
		}
	};

	this.__eFrom.onclick = this.__eHeader.onclick;
	this.__eFrom.oncontextmenu = this.__eHeader.oncontextmenu;

	// predelat do dedice
	this._listen(sDataSet, sDataPath);

	// Update IM in header
	if (window.sPrimaryAccountIM && (GWOthers.getItem('RESTRICTIONS', 'disable_im') || 0)<1){
		dataSet.on('xmpp',['roster'], this.__updateAddress, this, false, true);
		this._add_destructor('__removeIMListener');
	}
};

_me.__removeIMListener = function(){
	dataSet.off('xmpp',['roster'], this.__updateAddress);
};

_me.__updateAddress = function(data){
	[].forEach.call(this.__eFrom.querySelectorAll('a.address'), function(elm){
		if (elm.rel){
			var user = MailAddress.splitEmailsAndNames(elm.rel);
			if (user && user[0] && user[0].email){
				elm.className = 'address' + (data[user[0].email]?' im_'+data[user[0].email].show:'');
			}
		}
	});
};

_me.__prepare = function(bResize){
	if(GWOthers.getItem('LAYOUT_SETTINGS', 'night_mode') == 1) {
		storage.library('night_mode');
		NightMode(this.__eFrame.contentWindow).activate(false, function() {
			this._main.style.visibility = 'visible';
		}.bind(this));
	}
	this.__resize(bResize);
};

_me.__resize = function(bResize){
	var h = 0, div = this.__doc.getElementsByTagName('div');

	this._getAnchor('message') && (this._getAnchor('message').style.width = '100%');

	if (div && (div = div[0])){
		this._getAnchor('message') && (this._getAnchor('message').style.width = this._main.clientWidth<div.scrollWidth?(div.scrollWidth) + 'px':'100%');

		//count height
		div.style.height = 0;
		if (div.scrollHeight)
			h = div.scrollHeight;
		else{
			div.style.height = 'auto';
			h = (Math.max(div.offsetHeight, div.scrollHeight));
		}
	}

	this.__eFrame.style.height = h + 'px';

	//Hack for absolutely possitioned emails
	if (this.__doc.body.scrollHeight>h){
		h = this.__doc.body.scrollHeight;
		this.__eFrame.style.height = h + 'px';
	}
};

//mailto context menu
_me._context_link = function(e, sName, sMail){
	var pos = getSize(this.__eFrame);
	var c = gui._create('cmenu','obj_context_link','','',sName,sMail);
	c._place(pos.x + e.clientX,pos.y + e.clientY);
	c = null;

	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	if (e.preventDefault) e.preventDefault();
	return false;
};

_me.__parseHeader = function(sEmails, bFull){
	var out = gui._rtl ? '<bdi>' : '', stat,
		emails = MailAddress.splitEmailsAndNames(sEmails.unescapeXML()),
		bIM = gui.frm_main && gui.frm_main.im && gui.frm_main.im._is_active();

	for(var i in emails)
		out += '<a class="address'+ (bIM && (stat = gui.frm_main.im._inRoster(emails[i].email))?' im_'+stat.escapeXML(true):'') +(emails[i].email == sPrimaryAccount?' primary':'')+'" rel="'+ MailAddress.createEmail(emails[i].name,emails[i].email).escapeXML(true) +'" title="'+ getLang('ITEMVIEW::MESSAGE_TO',[emails[i].email.escapeXML(true)]) +'">'+ (bFull?MailAddress.createEmail(emails[i].name,emails[i].email, true):(emails[i].name || emails[i].email)).escapeXML() +'</a> ';

	return gui._rtl ? out + '</bdi>' : out;
};

_me.__avatar = function(sEmail){

	if (sEmail && sPrimaryAccountGW){

		var me = this,
			sURL = getAvatarURL(sEmail),
			img = new Image();

		img.onload = function(){
			if(!me._getAnchor('avatar')) {
				return;
			}
			var elm = mkElement('b');
			me._getAnchor('avatar').innerHTML = '';
			me._getAnchor('avatar').appendChild(elm);

			if (elm){
				if (this.height>10 && this.width>10){

					if (currentBrowser() == 'MSIE7'){

						var img = mkElement('img',{src:sURL});
						if (this.width>this.height){
							var r = this.height/elm.clientHeight;
							img.style.height = '100%';

							if ((this.width/r)>elm.clientWidth)
								img.style.right = (((this.width/r)-elm.clientWidth)/2) + 'px';
						}
						else{
							var r = this.width/elm.clientWidth;
							img.style.width = '100%';

							if ((this.height/r)>elm.clientHeight)
								this.style.bottom = (((this.height/r)-elm.clientHeight)/2) + 'px';
						}

						elm.appendChild(img);
						elm.style.backgroundImage = 'none';
					}
					else
						elm.style.backgroundImage = 'url("'+ sURL +'")';

					elm.style.backgroundColor = '#FFFFFF';
				}
				else{
					elm.style.backgroundImage = '';
					elm.style.backgroundColor = '';
				}
			}
		};

		img.src = sURL;
	}
	else
		this._getAnchor('avatar').innerHTML = '<b></b>';
};

_me._header = function(aData){

	// clear attach
	if (this.attach)
		this.attach._destruct();

	// clear header
	var child;
	while(child = this.__eHeader.lastChild)
		this.__eHeader.removeChild(child);

	// for (var i = this.__eHeader.childNodes.length-1;i>=0;i--)
	// 	this.__eHeader.removeChild(this.__eHeader.childNodes[i]);

	var scr = this._getAnchor('pre');
	scr.innerHTML =	'';
	scr.style.display = '';

	if (!aData){
		removecss(this._getAnchor('container'),'show');
		return;
	}

	var tr,th,td,aData2 = [],bHeader = false;

	// Order and Langs
	if (aData['COLOR']){
		this._getAnchor('date').className = 'th date ' + aData['COLOR'];
		delete aData['COLOR'];
	}

	if (aData['DATE']){
		this._getAnchor('date').innerHTML = IcewarpDate.unix(aData['DATE']).format('dd L LT');
		delete aData['DATE'];
	}
	else
		this._getAnchor('date').innerHTML = '';

	if (aData['TO']){
		var tmp = MailAddress.splitEmailsAndNames(aData['TO'].replace(/&gt;/gi,">").replace(/&lt;/gi,"<").replace(/&quot;/gi,'"'));
		if (tmp.length > 1 || (tmp[0] && tmp[0].email != sPrimaryAccount))
			aData2[getLang('DATAGRID_ITEMS_VIEW::TO')] = this.__parseHeader(aData['TO']);
		delete aData['TO'];
	}
	if (aData['CC']){
		aData2[getLang('DATAGRID_ITEMS_VIEW::CC')] = this.__parseHeader(aData['CC']);
		delete aData['CC'];
	}
	if (aData['BCC']){
		aData2[getLang('DATAGRID_ITEMS_VIEW::BCC')] = this.__parseHeader(aData['BCC']);
		delete aData['BCC'];
	}
	if (aData['TAGS']){
		var arr = aData['TAGS'].split(','), tmp = '', aTags = dataSet.get('tags');
		for (var sTag in arr)
			if ((arr[sTag] = arr[sTag].trim()))
				tmp += '<a class="tag"' + (aTags[arr[sTag]] && aTags[arr[sTag]].TAGCOLOR?' style="background-color: '+ aTags[arr[sTag]].TAGCOLOR +'; color: '+ aTags[arr[sTag]].TEXTCOLOR +'"':'')+'>'+ arr[sTag] +'</a>';

		aData2[getLang('DATAGRID_ITEMS_VIEW::ITMCATEGORY')] = tmp;
		delete aData['TAGS'];
	}

	// Do not show reply-path header
	if(aData['REPLY_FULLPATH'])
		delete aData['REPLY_FULLPATH'];

	if (aData['ATTACHMENTS']){
		aData2['ATTACHMENTS'] = aData['ATTACHMENTS'];
		delete aData['ATTACHMENTS'];
		delete aData['SMART_ATTACH'];
	}

	aData2 = arrConcat(aData2,aData);

	// create header
	for (var i in aData2){

		if (!bHeader){
			bHeader = true;
			addcss(this._getAnchor('container'),'show');
		}

		tr = mkElement('tr');
		this.__eHeader.appendChild(tr);

		if (i == 'ATTACHMENTS'){

			td = mkElement('td', {id:this._pathName + '#attach'});
			td.style.width = "100%";
			td.colSpan = 2;
			tr.appendChild(td);

			this._create('attach','obj_attach_mailview','attach');
			this.attach._aid = this.__aid;
			this.attach._fid = this.__fid;
			this.attach._iid = this.__iid;

			var urlAll = '';
			for (var j in aData2['ATTACHMENTS'])
				if (aData2['ATTACHMENTS'][j]['values'].SMART){
					if (aData2['ATTACHMENTS'][j]['values'].ALL){
						urlAll = aData2['ATTACHMENTS'][j]['values'].URL;
						break;
					}
				}

			var out,aOut = [];
			for (var j in aData2['ATTACHMENTS'])
				if (!aData2['ATTACHMENTS'][j]['values'].ALL){
					out = {"name":aData2['ATTACHMENTS'][j]['values'].NAME,"cert":aData2['ATTACHMENTS'][j]['values'].CERT,"size":aData2['ATTACHMENTS'][j]['values'].SIZE,"id":j,"type":aData2['ATTACHMENTS'][j]['values'].TYPE};
					if (aData2['ATTACHMENTS'][j]['values'].SMART){
						out.allurl = urlAll;
						out.url = aData2['ATTACHMENTS'][j]['values'].URL;
					}
					aOut.push(out);
				}

			this.attach._value({'attachments':aOut});
		}
		else
		if (i == 'ALL_HEADERS'){

			td = mkElement('td');
			td.style.width = "100%";
			td.className = 'obj_mailview_allheaders';
			td.colSpan = 2;
			tr.appendChild(td);

			scr.innerHTML = this._MSIE?aData2[i].replace(/\n/gm,'<br>'):aData2[i];
			scr.style.display = 'block';
		}
		else{

			th = mkElement('th',{'className':'th minw'});
			th.style.width= "0.1%";
			td = mkElement('td');
			td.style.width= "99.9%";
			tr.appendChild(th);
			tr.appendChild(td);

			if (aData2[i].length>600)
				td.innerHTML = '<div class="scroll_header">'+aData2[i]+'</div>';
			else
				td.innerHTML = aData2[i];
			th.innerHTML = i + ':';
		}

		tr = null; th = null; td = null;
	}

	if (!bHeader)
		removecss(this._getAnchor('container'),'show');

	if (dataSet.get('folders', [this.__aid, this.__fid]).TYPE === 'I' || !sPrimaryAccountCHAT) {
		var ta = this._getAnchor('teamchat');
		ta  && ta.parentNode.removeChild(ta);
	}
};

_me._frame = function(v){
	var me = this;
	if (typeof v != 'undefined'){

		if(GWOthers.getItem('LAYOUT_SETTINGS', 'night_mode') == 1) {
			this._main.style.visibility = 'hidden';
		}
		//remove img preview
		this.__showImages(true);

		//fix html content if broken
		var tmp = mkElement('div');
		tmp.innerHTML = v;

		[].forEach.call(tmp.querySelectorAll('img'), function(img) {
			if(~img.src.indexOf('http:/')) {
				img.src = '/teamchatapi/http.download?token=' + sPrimaryAccountTeamchatToken + '&url=' + encodeURIComponent(img.src);
			}
			if(img.style.height.indexOf('%')) {
				img.style.height = 'auto';
			}
		});

		[].forEach.call(tmp.querySelectorAll('table, div'), function(el) {
			el.getAttribute('style') && el.setAttribute('style', el.getAttribute('style').replace(/\s*height:\s*100%\s*(!important)?;?/gi, 'height: auto;'));
			el.getAttribute('height') && el.setAttribute('height', 'auto');
		});

		// window.onload will fire before images are fully loaded/displayed in Chrome, thus also onload on images
		if(navigator.userAgent.indexOf('WebKit')!=-1) {
			var img = tmp.getElementsByTagName('img');
			for(var i = img.length-1; i>=0; i--)
				if(img[i].nodeName=='IMG')
					img[i].addEventListener('load',function(e){me.__resize && me.__resize()},false);
		}

		//Using write because of onload method
		var html =	"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n"+
						"<html>\n<head>\n"+
						'<link type="text/css" rel="stylesheet" iw-skip="true" href="'+ this.__doc_base + 'client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/css.php?'+ buildURL({skin:GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette:GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file:'font.css'}) +'" />\n'+
						'<link type="text/css" rel="stylesheet" iw-skip="true" href="'+ this.__doc_base + 'client/skins/'+ GWOthers.getItem('LAYOUT_SETTINGS', 'skin') +'/css/css.php?'+ buildURL({skin:GWOthers.getItem('LAYOUT_SETTINGS', 'skin'), palette:GWOthers.getItem('LAYOUT_SETTINGS', 'skin_style'), file:'obj_mailview_body.css'}) +'" />\n'+
						'<meta http-equiv="x-dns-prefetch-control" content="off" />\n'+
						'<base href="'+this.__doc_base+'" />\n'+
						"</head>\n"+
						'<body id=\"iw_webmail_msg_body\" onload="window.parent.'+ this._pathName + '.__prepare();" style="visibility: hidden"><div style="height: auto!important;">'+ tmp.innerHTML +"</div></body>\n</html>"; // overflow: hidden
		tmp = null;

		this.__doc.open('text/html','replace');
		this.__doc.write(html);
		this.__doc.close();

		this.__doc.body.scrollTop = 0;

		//// Document Events Forwarding
		function mouseEvn(e){
			var e = e || me.__eFrame.contentWindow.event,
				pos = getSize(me.__eFrame);

				// dispatch for IE
			if (document.createEventObject){
				var evt = document.createEventObject();
				evt.clientX = e.clientX + pos.x;
				evt.clientY = e.clientY + pos.y;

				return me.__eFrame.fireEvent('on'+e.type,evt)?true:false;
			}
			// dispatch for firefox + others
			else{
				var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent (e.type, true, true, window, 0, 0, 0, e.clientX + pos.x , e.clientY + pos.y, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);

				return me.__eFrame.dispatchEvent(evt);
			}
		};

		this.__doc.onmousemove = mouseEvn;
		this.__doc.onmousedown = mouseEvn;
		this.__doc.onmouseup = mouseEvn;
		this.__doc.onclick = mouseEvn;
		//this.__doc.oncontextmenu = mouseEvn;

		this.__doc.addEventListener('click', function(event) {
			var tmp;

			if (event.target.tagName === 'A' && (tmp = event.target.href.match(wm_conference.linkRegExp))) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				wm_conference.get(tmp[2] + '@' + tmp[1]).join();
			}
		});

		this.__doc.oncontextmenu = function(e){
			return me._getAnchor('block').oncontextmenu(e, me.__eFrame);
		};

		this.__doc.onmouseover = mouseEvn;

		//this.__doc.onfocus = mouseEvn;
		//this.__doc.onblur = mouseEvn;

		AttachEvent(this.__doc, "onmousewheel", function(e){
			var elm = me._getAnchor('block'),
				deltaX = e.deltaX,
				deltaY = e.deltaY;

				//Invert axis for blocks with horizontal scrollbar only
			if (!deltaX && deltaY && elm.scrollHeight<=elm.clientHeight){
				deltaX = deltaY;
				deltaY = 0;
			}

			me.__sbar_wheel(elm, deltaX, deltaY);
		});

		AttachEvent(this.__doc, "onkeydown", function(e){

			//check for input
			var elm = e.target || e.srcElement;
			if (elm.tagName == 'INPUT' || elm.tagName == 'TEXTAREA')
				return;

			if (me._onkeypress)
				me._onkeypress(e);

			//Scrolling
			var jump = [0,0];
			switch(e.keyCode){
				//HOME
			case 36:
				me._getAnchor('block').scrollTop = 0;
				return;
				//END
			case 35:
				me._getAnchor('block').scrollTop = me._getAnchor('block').scrollHeight;
				return;

				//top
			case 38:
				jump = [-28,0];
				break;
				//bottom
			case 40:
				jump = [28,0];
				break;
				//left
			case 37:
				jump = [0,-28];
				break;
				//right
			case 39:
				jump = [0,28];
				break;

				//PgUp
			case 33:
				jump = [(me._getAnchor('block').clientHeight*-1),0];
				break;
				//PgDn
			case 34:
				jump = [me._getAnchor('block').clientHeight,0];
				break;

			default:
				return;
			}

			if (jump[0])
				me._getAnchor('block').scrollTop += jump[0];

			if (jump[1])
				me._getAnchor('block').scrollLeft += jump[1];
		});

		AttachEvent(this.__doc, "oncopy", function(e){

			var se = this.getSelection(),
				fn = se[se.focusOffset>se.anchorOffset?'focusNode':'anchorNode'];

			if (fn && fn.textContent){
				var tx = fn.textContent;

				if (tx.match(/\($/g) && fn.nextElementSibling && fn.nextElementSibling.tagName == 'A' && fn.nextElementSibling.protocol == 'mailto:'){
					var name = tx.replace(/(^([^:.]+)\:)|\($/g,''),
						mail = fn.nextElementSibling.href.substring(fn.nextElementSibling.protocol.length);

					if (mail){
						var div = mkElement('div', {
							text: MailAddress.createEmail(name, mail),
							style:{
								position:'fixed',
								left:'-99999px'
							}
						}, this);

						this.body.appendChild(div);
						se.selectAllChildren(div);

						window.setTimeout(function () {
							if (div.parentNode)
								this.removeChild(div);
						}.bind(this.body), 100);
					}
				}
			}
		});

		//raw resize
		this.__resize();
	}
	else{
		try{
			if (currentBrowser() != 'Mozilla')
				this.__doc.getElementsByTagName('body')[0].innerHTML;
			else
				return this.__doc.getElementsByTagName('div')[0].innerHTML;
		}
		catch(e){
			return '';
		}
	}
};

_me.__update = function(sName,aPath)
{
	var aMails = dataSet.get(sName);

	//header links update
	if (sName == 'xmpp'){

		var tmp,
			links = this.__eHeader.getElementsByTagName('A');

			// one user
		if (aPath && aPath[0] == 'roster' && aPath[1] && aPath[2] == 'show'){
			for(var i = links.length-1; i>-1; i--)
				if (links[i].rel && (tmp = MailAddress.splitEmailsAndNames(links[i].rel)) && (tmp = tmp[0]))
					if (tmp.email.toLowerCase() == aPath[1])
						links[i].className = 'address im_' + gui.frm_main.im._inRoster(aPath[1]) + (hascss(links[i], 'primary')?' primary':'');
			// else
			// if (tmp.email.toLowerCase() == sPrimaryAccount)
			// 	links[i].className = 'address im_' + gui.frm_main.im._status();
		}
		// IM goes offline
		else
		if (!gui.frm_main.im._is_active())
			for(var i = links.length-1; i>-1; i--)
				if (links[i].rel && hascss(links[i],'address'))
					links[i].className = 'address' + (hascss(links[i], 'primary')?' primary':'');
	}
	else
	if (!aMails){
		addcss(this._getAnchor('message'),'empty');
		this._value();
	}
	else {

		//Get Item info
		for(var sAccId in aMails){
			for(var sFolId in aMails[sAccId]){
				delete aMails[sAccId][sFolId]['#'];
				delete aMails[sAccId][sFolId]['/'];
				delete aMails[sAccId][sFolId]['$'];
				delete aMails[sAccId][sFolId]['@'];

				for(var sItId in aMails[sAccId][sFolId])
					break;

				break;
			}
			break;
		}

		//Check if not already active
		if ((!('HTML' in aMails[sAccId][sFolId][sItId]) && typeof (aMails[sAccId][sFolId][sItId].CLEAN_HTML || aMails[sAccId][sFolId][sItId].TEXT || aMails[sAccId][sFolId][sItId].MESSAGE_ID) == 'undefined') || /*(WMFolders.getType([sAccId,sFolId]) != 'M' && WMFolders.getType([sAccId,sFolId]) != 'Q') ||*/ (this._checkActive && sItId.indexOf('|')<0 && (dataSet.get('active_items', [sAccId, sFolId]) && dataSet.get('active_items',[sAccId,sFolId]) != sItId)))
			return;

		//new mail?
		if (this.__aid != sAccId || this.__fid != sFolId || this.__iid != sItId){
			//scroll to top
			var eblock = this._getAnchor('block');
			if (eblock){
				eblock.scrollTop = 0;
				eblock = null;
			}
		}

		//disable full headers
		if (this.__FullHeaders && (this.__FullHeaders.aid != sAccId || this.__FullHeaders.fid != sFolId || this.__FullHeaders.iid != sItId))
			this.__FullHeaders = '';

		aMails = clone(aMails[sAccId][sFolId][sItId]);

		// Save all recipients of the email for later access
		this._recipients = MailAddress.splitEmailsAndNames(aMails.FROM);
		this._recipients = this._recipients.concat(
			MailAddress.splitEmailsAndNames(aMails.TO),
			MailAddress.splitEmailsAndNames(aMails.CC)
		);

		delete aMails.aid;
		delete aMails.fid;
		delete aMails.FLAGS;
		//delete aMails.STATIC_FLAGS;
		delete aMails.HAS_ATTACHMENT;
		delete aMails.HAS_EMBEDDED_ATTACHMENT;

		//delete aMails.SMIME_STATUS;
		delete aMails.PRIORITY;
		delete aMails.CONFIRM_ADDR;
		delete aMails.REPLY_TO;
		delete aMails.SIZE;

		delete aMails.MESSAGE_ID;
		delete aMails.REFERENCES;
		delete aMails.IN_REPLY_TO;

		delete aMails.TEAMCHAT;
		delete aMails.TEAMCHAT_COMMENT;

		aMails.AID = sAccId;
		aMails.FID = sFolId;
		aMails.IID = sItId;

		removecss(this._getAnchor('message'),'empty');

		this._value(aMails);
	}
};

_me.__showImages = function(bHide) {

	this.__HiddenImages = bHide;

	var me = this;

	if (bHide){

		//Remove
		var elm = document.getElementById(this._pathName+'/frame_images');
		if (elm)
			elm.parentNode.removeChild(elm);
		removecss(this._main,'images');

		if (Is.Empty(this.__aImages))
			removecss(this._main,'preview');
		else
			addcss(this._main,'preview');
	}
	else
	{
		var sURL,
			sFullPath = this.__aid+'/'+this.__fid+'/'+ WMItems.__serverID(this.__iid);

			//Remove Label
		removecss(this._main,'preview');
		if (this.preview)
			this.preview._destruct();

		//Add Image row
		addcss(this._main,'images');
		var etmp = mkElement('div', {id:this._pathName+'/frame_images',className:'obj_mailview_images'}),
			etmp2= mkElement('p', {className: 'maxbox relative'});

		etmp2.onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'IMG'){

				var imgs = this.getElementsByTagName('img'),
					out = [], v = 0;

				for (var i = imgs.length-1; i>=0; i--)
					if (imgs[i].src && imgs[i].src == elm.src){
						v = i;
						break;
					}

				var ratio = window.retina || window.devicePixelRatio || 1;

				for (var i in me.__aImages)
					if (me.__aImages[i].url.indexOf('http://') == 0 || me.__aImages[i].url.indexOf('https://') == 0)
						out.push(me.__aImages[i]);
					else
						out.push({title:me.__aImages[i].title, url:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':sFullPath+'/'+me.__aImages[i].url,'resize':1,'width':screen.availWidth * ratio,'height':screen.availHeight * ratio})});

				if (out.length){
					var img = gui._create('imgview','frm_imgview');
					img._fill(out);
					img._value(v);
				}
			}
		};

		if (this.attach)
			etmp2.oncontextmenu = function(e){
				var e = e || window.event,
					elm = e.target || e.srcElement;

				if (elm.tagName == 'IMG' && Is.Defined(elm.getAttribute('rel'))){

					var att = me.__aImages[elm.getAttribute('rel')];

					if (att){
						var	cmenu = gui._create("cmenu","obj_context"),
							aMenu = [{"title":'ATTACHMENT::SAVE', 'arg':[downloadItem, [buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':sFullPath+'/'+att.url})]]}],
							pos = getSize(elm);

						if (sPrimaryAccountGW>0){
							var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');
							if (!dgw || dgw.indexOf('f')<0)
								aMenu.push({"title":'ATTACHMENT::SAVE_TO_FOLDER','arg':[me.attach,'_saveFolder',[[{'name':elm.title,'size':0,'fullpath':sFullPath+'/'+att.url}]]]});
						}

						cmenu._fill(aMenu);
						cmenu._place(pos.x+(pos.w/2),pos.y,'',3);
					}
				}

				return false;
			};

		for (var i in this.__aImages) {
			if (this.__aImages[i].url.indexOf('http://') == 0 || this.__aImages[i].url.indexOf('https://') == 0)
				sURL = this.__aImages[i].url;
			else
				sURL = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':sFullPath+'/'+this.__aImages[i].url,'resize':1,'width':100,'height':100,crop:'50%'});

			etmp2.appendChild(mkElement('img',{'src':sURL,'title':this.__aImages[i].title, 'rel':i}));
		}


		etmp.appendChild(etmp2);
		this._main.appendChild(etmp);

		this._scrollbar(etmp2,etmp2.parentNode);
	}
};

_me.__showText = function (b){
	//get info from dataset
	var aMails = dataSet.get(this._listener,this._listenerPath);
	if (!aMails) return;

	for(var sAccId in aMails)
		for(var sFolId in aMails[sAccId]){
			delete aMails[sAccId][sFolId]['#'];
			delete aMails[sAccId][sFolId]['/'];
			delete aMails[sAccId][sFolId]['$'];
			delete aMails[sAccId][sFolId]['@'];

			for(var sItId in aMails[sAccId][sFolId]);
		}

	this.__TextBody = b;

	//ico
	/*
		var tmp = this._getAnchor('buttons').getElementsByTagName('A')[2];
		if (this.__TextBody){
		    addcss(tmp,'active');
		    tmp.title = getLang('ATTACHMENT::SHOW_HTML');
		}
		else{
			removecss(tmp,'active');
			tmp.title = getLang('ATTACHMENT::SHOW_TEXT');
		}
*/
	//get short headers
	WMItems.list({"aid": sAccId, "fid": sFolId, "iid": sItId, "values": this.__TextBody?OldMessage.__TEXTMAIL_VALUES:OldMessage.__FULLMAIL_VALUES},this._listener,this._listenerPath);
};

_me.__showHTML = function (b){
	//get info from dataset
	var aMails = dataSet.get(this._listener,this._listenerPath);
	if (!aMails) return;

	this.__HTMLBody = true;

	for(var sAccId in aMails)
		for(var sFolId in aMails[sAccId]){
			delete aMails[sAccId][sFolId]['#'];
			delete aMails[sAccId][sFolId]['/'];
			delete aMails[sAccId][sFolId]['$'];
			delete aMails[sAccId][sFolId]['@'];

			for(var sItId in aMails[sAccId][sFolId]);
		}

		//get short headers
	WMItems.list({"aid": sAccId, "fid": sFolId, "iid": sItId, "values": OldMessage.__FULLMAIL_VALUES_DANGER},this._listener,this._listenerPath);
};

_me.__showHeaders = function (aHandler){
	//get info from dataset
	var aMails = dataSet.get(this._listener,this._listenerPath);
	if (!aMails) return;

	for(var sAccId in aMails)
		for(var sFolId in aMails[sAccId]){
			delete aMails[sAccId][sFolId]['#'];
			delete aMails[sAccId][sFolId]['/'];
			delete aMails[sAccId][sFolId]['$'];
			delete aMails[sAccId][sFolId]['@'];

			for(var sItId in aMails[sAccId][sFolId]);
		}

	//Back to normal view
	if (this.__FullHeaders && this.__FullHeaders.aid == sAccId && this.__FullHeaders.fid == sFolId && this.__FullHeaders.iid == sItId){

		//get short headers
		WMItems.list({"aid": sAccId, "fid": sFolId, "iid": sItId, "values": this.__TextBody?OldMessage.__TEXTMAIL_VALUES:(this.__HTMLBody?OldMessage.__FULLMAIL_VALUES_DANGER:OldMessage.__FULLMAIL_VALUES)},this._listener,this._listenerPath,'',aHandler);
		this.__FullHeaders = '';
		return;
	}

	//Load All headers
	var MAILINFO_VALUES = [	'FROM', 'SUBJECT', 'ALL_HEADERS', this.__TextBody?'TEXT':(this.__HTMLBody?'HTML':'CLEAN_HTML'), 'DATE', 'ATTACHMENTS', 'FLAGS', 'HAS_ATTACHMENT', 'PRIORITY',
		'STATIC_FLAGS', 'SMIME_STATUS', 'CONFIRM_ADDR'];

	// Async list item (refresh mailview) and refresh folders (folder tree)
	WMItems.list({"aid": sAccId, "fid": sFolId, "iid": sItId, "values": MAILINFO_VALUES},this._listener,this._listenerPath);

	this.__FullHeaders = {"aid": sAccId, "fid": sFolId, "iid": sItId};
};

_me._print = function(){
	if (!this.__aid || !this.__fid || !this.__iid || !this.__doc) return false;

	if (this.__header_cert || (Is.Array(this.__aImages) && this.__aImages.length)){
		if (this.print_opt)
			this.print_opt._destruct();

		this.print_opt = gui._create('print_opt', 'frm_mail_print','','',[this, '__print'], {cert_info:this.__header_cert?true:false, images:this.__aImages.length>0});
	}
	else
		this.__print();
};

_me.__print = function(aOpt){

	if (this.__FullHeaders){
		this.__showHeaders([this,'__print']);
		return false;
	}

	//Options
	if (Is.Object(aOpt)){
		window[aOpt.images?'addcss':'removecss'](this.__doc.body, 'print_images');
		window[aOpt.cert_info?'addcss':'removecss'](this.__doc.body, 'print_cert');
	}

	//PRINT
	this.__eFrame.contentWindow.focus();
	var NM = NightMode(this.__eFrame.contentWindow);
	if(NM.init) {
		NM.reset(function() {
			if (this.__doc.queryCommandSupported('print'))
				this.__doc.execCommand('print', false, null);
			else
				this.__eFrame.contentWindow.print();
			NM.activate();
		}.bind(this));
	} else {
		if (this.__doc.queryCommandSupported('print'))
			this.__doc.execCommand('print', false, null);
		else
			this.__eFrame.contentWindow.print();
	}
};

_me._value = function(aData){
	try{
		var me = this;

		if(me.x_freebusy) {
			me.x_freebusy._destruct();
		}

		this._getAnchor('smart').style.display = 'none';
		this._getAnchor('serror').style.display = 'none';
		this._getAnchor('deferred').style.display = 'none';
		this._getAnchor('skip').style.display = 'none';
		this._getAnchor('player').style.display ='none';

		// Remove old objects
		var	obj = this._getChildObjects();
		for(var i in obj)
			if (obj[i]._name.indexOf('X_') == 0)
				obj[i]._destruct();

		if (!aData){

			this.__aid = '';
			this.__fid = '';
			this.__iid = '';

			this.__FullHeaders = null;
			this.__HiddenImages = true;
			this.__TextBody = false;

			this.__eSubject.innerHTML = '';
			this.__eFrom.innerHTML = '';
			this._getAnchor('date').innerHTML = '';
			this._getAnchor('avatar').innerHTML = '';

			this.__aImages = [];

			this._frame('');
			this._header();

			return;
		}

		// HTML has higher priority than TEXT
		if (aData['HTML'] || aData['CLEAN_HTML']){
			delete aData['TEXT'];
			this.__TextBody = false;
			this.__HTMLBody = aData['HTML']?true:false;
		}
		else
		if (aData['TEXT'])
			this.__TextBody = true;

		if (!aData.ALL_HEADERS)
			this.__FullHeaders = null;

		var aHeaders = {},
			sBody = '',
			sStyles;

		var aIMIP = [];

		this.__aImages = [];

		//Remove old sMIME
		removecss(this.__eSubject);
		this.__header_cert = '';
		this.__header_base = '';
		this.__header_html = false;

		//Prefill aData
		aData = Object.assign({
			SUBJECT:null,
			FROM: null
		}, aData);

		//Attachments
		if (aData['ATTACHMENTS']){
			for(var n in aData['ATTACHMENTS'])
				if (aData['ATTACHMENTS'][n]['values'] && aData['ATTACHMENTS'][n]['values']['NAME'])
					switch(Path.extension(aData['ATTACHMENTS'][n]['values']['NAME'])){
					case "jpg":
					case "bmp":
					case "jpeg":
					case "gif":
					case "png":
						this.__aImages.push({title:aData['ATTACHMENTS'][n]['values']['NAME'], url:aData['ATTACHMENTS'][n]['values']['URL'] || n});
						break;

					default:

						if (aData['ATTACHMENTS'][n]['values']['TYPE'])
							if (aData['ATTACHMENTS'][n]['values']['TYPE'].indexOf('image') == 0)
								switch(aData['ATTACHMENTS'][n]['values']['TYPE'].toLowerCase()){
								case 'image/png':
								case 'image/jpeg':
								case 'image/gif':
								case 'image/tif':
								case 'image/bmp':
									this.__aImages.push({title:aData['ATTACHMENTS'][n]['values']['NAME'], url:aData['ATTACHMENTS'][n]['values']['URL'] || n});
								}
							else
							if (aData['ATTACHMENTS'][n]['values']['TYPE'].toLowerCase() == 'text/calendar' && aData['ATTACHMENTS'][n]['values']['IMIP'] && WMFolders.getType({aid:aData.AID, fid:aData.FID}) === 'M'){
								try{
									var arr = XMLTools.Str2Arr(aData['ATTACHMENTS'][n]['values']['IMIP']);
									arr.VCALENDAR[0].PARTID = [{VALUE:n}];
									aIMIP.push(arr);
								}
								catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

								delete aData['ATTACHMENTS'][n];
							}
					}

			aHeaders['ATTACHMENTS'] = aData['ATTACHMENTS'];
		}

		//Certificates
		if (aData['CERTIFICATE'])
			try{
				aData['CERTIFICATE'] = XMLTools.Str2Arr(aData['CERTIFICATE']);

				//Add to attachment
				if (!aHeaders['ATTACHMENTS'])
                	aHeaders['ATTACHMENTS'] = {};

				aHeaders['ATTACHMENTS'].CERT = this.__header_cert = {values:{TYPE:'certificate',CERT:aData['CERTIFICATE'],NAME:getLang('MAIL_VIEW::CERTIFICATE')}};

				if (!aData.FROM || (me.__header_cert.values.CERT.INFO[0].SUBJECT[0].EMAILADDRESS && MailAddress.splitEmailsAndNames(aData.FROM)[0].email.toLowerCase() != aData['CERTIFICATE'].INFO[0].SUBJECT[0].EMAILADDRESS[0].VALUE.toLowerCase()))
					aData.SMIME_STATUS = 10;
			}
			catch(r){
				aData.SMIME_STATUS = 2;
			}

		//Avatar
		var sAvatarOrigin = '';
		if (Is.String((sAvatarOrigin = aData['FROM'] || aData['TO']))){
			sAvatarOrigin = MailAddress.splitEmailsAndNames(sAvatarOrigin);

			if (!Is.Empty(sAvatarOrigin) && (sAvatarOrigin = sAvatarOrigin[0].email))
				this.__avatar(sAvatarOrigin);
			else
				this.__avatar();

			this._getAnchor('avatar').onclick = function(e){
				var e = e || window.event,
					elm = e.target || e.srcElement;

				if (elm.tagName == 'B' || elm.tagName == 'IMG'){

		            var aMail = MailAddress.splitEmailsAndNames(aData['FROM'] || aData['TO']);
		            if (aMail && aMail[0]){

						//Certificate
						try{
							var aCert;
							if (me.__header_cert && me.__header_cert.values.TYPE.toLowerCase() == 'certificate' && (me.__header_cert.values.CERT.INFO[0].SUBJECT[0].EMAILADDRESS && me.__header_cert.values.CERT.INFO[0].SUBJECT[0].EMAILADDRESS[0].VALUE.toLowerCase() == aMail[0].email.toLowerCase()))
								aCert = [{values:{'class':'item','fullpath':me.__aid +'/'+ me.__fid +'/'+ WMItems.__serverID(me.__iid)}}];
						}
						catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

						var pos = getSize(elm),
							cmenu = gui._create('cmenu','obj_context_link','','',aMail[0].name,aMail[0].email,aCert);
						cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',2);

						e.cancelBubble = true;
						if (e.stopPropagation) e.stopPropagation();
						if (e.preventDefault) e.preventDefault();

						return false;
					}
				}
			};
		}
		else{
			this.__avatar();
			this._getAnchor('avatar').onclick = null;
		}

		//Other
		for (var i in aData){
			switch(i){
			case 'STATIC_FLAGS':
				this.__header_html = (aData.STATIC_FLAGS & 1) ? true : false;
				break;
			case 'BASE_URL':
       				if (aData['BASE_URL'].indexOf('file://')===0)
					delete aData['BASE_URL'];
				else{
	                    if (!(/\/$/gi.test(aData['BASE_URL'])))
						this.__header_base = aData['BASE_URL'] + '/';
					else
						this.__header_base = aData['BASE_URL'];

					if (!(/^((http)|(https))\:/gi.test(this.__header_base)))
						this.__header_base = 'http://' + this.__header_base;
				}

				break;
			case 'SUBJECT':
				if (Is.String(aData[i]))
					this.__eSubject.innerHTML = (aData[i].length>256?aData[i].substring(0,256)+'...':aData[i]).entityify();
				else
					this.__eSubject.innerHTML = getLang('MAIL_VIEW::NOSUBJECT');
				break;

			case 'FROM':
				if (Is.String(aData[i])){
					if (Is.String(aData.SENDER))
						this.__eFrom.innerHTML = this.__parseHeader(aData.SENDER) + '<span class="behalf">' + getLang('MAIL_VIEW::SENDER') + '</span>' + this.__parseHeader(aData[i]);
					else
						this.__eFrom.innerHTML = this.__parseHeader(aData[i],!dataSet.get('folders',[aData['AID'],aData['FID'],'RSS']));
				}
				else
					this.__eFrom.innerHTML = '';
				break;

			case 'CLEAN_HTML':
				if(!aIMIP.length) {
					this._getAnchor('skip').style.display = 'block';
				}
			case 'HTML':
				if (aData[i]) {
					aData[i] = aData[i].replace(/<!--\[if(.*?)\]>[\w\W]*?\[endif\]-->/g, function(match, conditions) {
						var result = conditions.trim().replace(/\(*([^|&)]*)\)*([|&]*)/g, function(match, condition, andOr) {
							return condition ? (+!!~condition.indexOf('!')).toString() + andOr + andOr : '';
						});
						return eval(result) ? match : '';
					}); // strip conditional comments (<!--[if mso|IE] --> <!--[endif]-->)
					var matches = aData[i].match(/<style[\w\W]*?<\/style>/g);
					sBody = DOMPurify.sanitize(aData[i]);
					sStyles = matches && matches.join('');
				}
				break;
			case 'TEXT':
				if (aData[i]) sBody = aData[i].entityify().wrap();
				break;

			case 'AID':
				this.__aid = aData[i];
				break;

			case 'FID':
				this.__fid = aData[i];
				break;

			case 'IID':
				this.__iid = aData[i];
				break;

			case 'SENDER':
			case 'CERTIFICATE':
				break;

			case 'SMART_ATTACH':
				this._getAnchor('smart').style.display = 'block';
				break;

			case 'DEFERRED_DELIVERY':
				if (GWOthers.getItem('DEFAULT_FOLDERS','sent') == aData.AID +'/'+ aData.FID){
					var d = new IcewarpDate(aData.DEFERRED_DELIVERY),
					elm = this._getAnchor('deferred');
					elm.innerHTML = getLang('MAIL_VIEW::DEFERRED',[d.format('dd L LT')]);
					elm.style.display = 'block';
				}
				break;

			case 'SMIME_STATUS':

				switch(parseInt(aData.SMIME_STATUS)){
				case 3: addcss(this.__eSubject,'smime'); break;
				case 4: addcss(this.__eSubject,'sign'); break;
				case 5: addcss(this.__eSubject,'ssmime'); break;

				case 2:
				case 6:
				case 7:
				case 10:
					addcss(this.__eSubject,'serror');
					var elm = this._getAnchor('serror');
					elm.innerHTML = getLang('MAIL_VIEW::' + ({2:'SERROR',6:'EXPIRED',7:'EXPIRED',10:'SVERIFY'}[parseInt(aData.SMIME_STATUS)]));
					elm.style.display = 'block';
					break;
				}

				break;

			case 'LIST_UNSUBSCRIBE_POST':
				break;
			case 'LIST_UNSUBSCRIBE':
				var list = MailAddress.splitEmailsAndNames(aData.LIST_UNSUBSCRIBE);
				list.forEach(function(adr){
					if (adr.email.toLowerCase().indexOf('mailto:') === 0){

						var	tmp = mkElement('a', {href:adr.email});

						if (tmp.pathname){

							var elm = mkElement('span',{text:getLang('MAIL_VIEW::UNSUBSCRIBE'), className:'unsubscribe'}),
								web = tmp.pathname.split('@')[1];
								web = web?web.escapeHTML():'';

							elm.onclick = function(){

								gui._create('unsubscribe','frm_confirm','','frm_alert',[function(){

									if (!hascss(this, 'disabled')){
										var msg = new NewMessage();
										msg.sTo = tmp.pathname;

										//parse other params
										if (tmp.search)
											msg.sSubject = parseURL(tmp.search).subject;

										addcss(this, 'disabled');

										msg.send(false, [function(bOK){
											if (bOK){
												gui.notifier && gui.notifier._value({type: 'alert', args: {header: 'MAIL_VIEW::UNSUBSCRIBE', text_plain: getLang('MAIL_VIEW::UNSUBSCRIBED',[web])}});
												elm.parentElement && elm.parentElement.removeChild(elm);
											}
											else{
												removecss(elm, 'disabled');
											}
										}]);
									}

								}.bind(this)],'MAIL_VIEW::UNSUBSCRIBE', 'CONFIRMATION::UNSUBSCRIBE_LIST', [web]);

							};

							me._getAnchor('from').appendChild(elm);
							list = [];
							return false;
						}
					}
				});

				list.forEach(function(adr){
					if (Is.URL(adr.email)){
						var host = mkElement('a', {href:adr.email}).hostname,
							elm = mkElement('span',{text:getLang('MAIL_VIEW::UNSUBSCRIBE'), className:'unsubscribe'});

						elm.onclick = function(){
							gui._create('unsubscribe','frm_confirm','','frm_alert',[function(){
								window.open(adr.email);
							}.bind(this)],'MAIL_VIEW::UNSUBSCRIBE', 'CONFIRMATION::UNSUBSCRIBE_LIST', [host]);
						};

						me._getAnchor('from').appendChild(elm);
						return false;
					}
				});

				break;

			case 'COLOR':
				aHeaders[i] = 'bg_' + ({'1':'red','2':'blue','3':'green','4':'gray','5':'orange','6':'cyan','7':'brown','8':'purple','9':'light_blue','A':'yellow','Y':'complete','Z':'none'}[aData[i]] || 'none');
				break;

			case 'TO':
				if (aData['TO'] == '"Undisclosed Recipients" <>')
					break;

				// headers
			default	:
				if (Is.String(aData[i]) && i.indexOf('X_')<0) aHeaders[i] = aData[i].entityify();
			}
		}

		// Transform Conference id to clickable button
		if (aData.X_ICEWARP_CONFERENCE) {
			sBody = template.tmp('obj_mailview_conference', {conference:aData.X_ICEWARP_CONFERENCE.split('@')[0]}) + sBody;
		}

		// Transform VoiceMail to mp3 player
		if (aData.X_ICEWARP_VOICEMAIL && aData.ATTACHMENTS) {

			for (var atid in aData.ATTACHMENTS)
				if (aData.ATTACHMENTS[atid].values && aData.ATTACHMENTS[atid].values.TYPE == 'audio/mpeg'){
					this._getAnchor('player').style.display = 'block';
					var p = this._create('X_player','obj_player','player');
					p._value([{
						src: 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath': this.__aid+'/'+this.__fid+'/'+ WMItems.__serverID(this.__iid) + '/' + atid}),
						title: aData.ATTACHMENTS[atid].values.NAME
					}]);

					break;
				}

		}

		// FOLDER SUBSCRIBE 1
		if (aData.X_ICEWARP_SERVER_REQUEST && (!aData.X_ICEWARP_SERVER_REQUEST.METHOD || aData.X_ICEWARP_SERVER_REQUEST.METHOD[0].VALUE != 'invite')){

			var aRights = aData.X_ICEWARP_SERVER_REQUEST.RIGHTS && aData.X_ICEWARP_SERVER_REQUEST.RIGHTS[0].VALUE?aData.X_ICEWARP_SERVER_REQUEST.RIGHTS[0].VALUE.split(""):[],
				tmpi = [], tmpf = [],
				aTplData = {
					'user':aData.X_ICEWARP_SERVER_REQUEST.USER[0].VALUE,
					'author':aData.X_ICEWARP_SERVER_REQUEST.AUTHOR?aData.X_ICEWARP_SERVER_REQUEST.AUTHOR[0].VALUE:'',
					'folder':aData.X_ICEWARP_SERVER_REQUEST.DISPLAYNAME ? aData.X_ICEWARP_SERVER_REQUEST.DISPLAYNAME[0].VALUE : aData.X_ICEWARP_SERVER_REQUEST.FOLDER[0].VALUE,
					'btn_folder':true,
					'btn_account':true
				};

			for(var r in aRights)
				switch(aRights[r]){
				case 'r': tmpi.push(getLang('SETTINGS::READ')); break;
				case 'i': tmpi.push(getLang('SETTINGS::WRITE')); break;
				case 'w': tmpi.push(getLang('SETTINGS::MODIFY')); break;
				case 't': tmpi.push(getLang('SETTINGS::DELETE')); break;

				case 'a': tmpf.push(getLang('SETTINGS::OWNER')); break;
				case 'l': tmpf.push(getLang('SETTINGS::READ')); break;
				case 'k': tmpf.push(getLang('SETTINGS::WRITE')); break;
				case 'x': tmpf.push(getLang('SETTINGS::DELETE')); break;
				}

			if (tmpi.length)
				aTplData.items = tmpi.join(', ');

			if (tmpf.length)
				aTplData.folders = tmpf.join(', ');

			if (aTplData.folder == '*')
				aTplData.summary = getLang('MAIL_VIEW::ACCOUNT_ACCESS',[aTplData.author || aTplData.user]);
			else
				aTplData.summary = getLang('MAIL_VIEW::ACCESS',[aTplData.folder,aTplData.author || aTplData.user]);

			if (aData.AID == sPrimaryAccount){
				//Account
				var sSType = '';
				if (aTplData.folder == '*'){
					var tmp_fol = dataSet.get('folders', [sPrimaryAccount, sPrimaryAccountSPREFIX + aTplData.user]);
					if (tmp_fol){
						if (tmp_fol.SUBSCRIPTION_TYPE)
							sSType = tmp_fol.SUBSCRIPTION_TYPE;

						if (tmp_fol.SHARED)
							aTplData.btn_account = false;
					}

					aTplData.btn_folder = false;
				}
				//Folder
				else
				if (aTplData.folder)
					sSType = dataSet.get('folders', [sPrimaryAccount, sPrimaryAccountSPREFIX + aTplData.user +'/'+ aTplData.folder, 'SUBSCRIPTION_TYPE']);

				if (sSType){
					aTplData.btn_folder = false;
					if (sSType == 'account')
						aTplData.btn_account = false;
				}
			}
			else{
				aTplData.btn_folder = false;
				aTplData.btn_account = false;
			}

			sBody = template.tmp('obj_mailview_subscribe',aTplData);
		}
		else
		/** iMip 1 **/
		if (aIMIP.length>0){
			var atmp, aData;
			for(var i in aIMIP){

				if (!aIMIP[i] || !aIMIP[i].VCALENDAR || !aIMIP[i].VCALENDAR[0])
					continue;

				aTplData = {};

				if (aIMIP[i].VCALENDAR[0]['X-SERVER-NONEDITABLE'])
					aTplData.groupchat = true;

				if (aIMIP[i].VCALENDAR[0].METHOD)
					aTplData.imip_method = aIMIP[i].VCALENDAR[0].METHOD[0].VALUE.toUpperCase();

				atmp = aIMIP[i].VCALENDAR[0];
				if (atmp.VEVENT){

					var out='', t1 = 0, t2;
					//select last vevent
					for (var j in atmp.VEVENT){
						if (atmp.VEVENT[j]['LAST-MODIFIED'] && atmp.VEVENT[j]['LAST-MODIFIED'][0].VALUE){
							t2 = new IcewarpDate(atmp.VEVENT[j]['LAST-MODIFIED'][0].VALUE).unix();

							if (t1<t2 || (t1 == t2 && atmp.VEVENT[j]['RECURRENCE-ID'])){
								t1 = t2;
								out = atmp.VEVENT[j];
							}
						}
					}

					atmp = out || atmp.VEVENT[0];
					aTplData.imip_type = 'VEVENT';

					if (aTplData.imip_method != 'COUNTER')
						aTplData.timecontrols = 'true';
				}
				else
				if (atmp.VTODO){
					atmp = atmp.VTODO[0];
					aTplData.imip_type = 'VTODO';
				}
				else
				if (atmp.VJOURNAL){
					atmp = atmp.VJOURNAL[0];
					aTplData.imip_type = 'VJOURNAL';

					if (aTplData.imip_method != 'COUNTER')
						aTplData.timecontrols = 'true';
				}
				else
					continue;

				aTplData.pid = aIMIP[i].VCALENDAR[0].PARTID[0].VALUE;
				aTplData.summary = atmp.SUMMARY && atmp.SUMMARY[0] && atmp.SUMMARY[0].VALUE?atmp.SUMMARY[0].VALUE.entityify():'- - -';

				if (atmp.LOCATION && atmp.LOCATION[0] && atmp.LOCATION[0].VALUE)
					aTplData.location = atmp.LOCATION[0].VALUE.entityify();

				if (atmp.DTSTART){

					var a = IcewarpDate.julian(atmp.DTSTART[0].ATTRIBUTES['X-CTZDATE'], Math.max(atmp.DTSTART[0].ATTRIBUTES['X-CTZTIME'],0)),
						aa = atmp.DTSTART[0].ATTRIBUTES['X-ORIGINALDATE'] && IcewarpDate.julian(atmp.DTSTART[0].ATTRIBUTES['X-ORIGINALDATE'], Math.max(atmp.DTSTART[0].ATTRIBUTES['X-ORIGINALTIME'],0)),
						time = ~atmp.DTSTART[0].VALUE.indexOf('T');

					aTplData.date = '<strong>'+ a.format('dddd') +'</strong>, '+ a.format('L' + (time ? ' LT' : ''));
					if (aa) {
						aTplData.original_date = '<strong>'+ aa.format('dddd') +'</strong>, '+ aa.format('L' + (time ? ' LT' : ''));
					}

					if (atmp.DTEND || atmp.DTDUE){

						var end = atmp.DTEND || atmp.DTDUE,
							time = ~end[0].VALUE.indexOf('T'),
							b = IcewarpDate.julian(end[0].ATTRIBUTES['X-CTZDATE'], Math.max(end[0].ATTRIBUTES['X-CTZTIME'], 0)),
							bb = end[0].ATTRIBUTES['X-ORIGINALDATE'] && IcewarpDate.julian(end[0].ATTRIBUTES['X-ORIGINALDATE'], Math.max(end[0].ATTRIBUTES['X-ORIGINALTIME'], 0));

							if (aTplData.imip_type === "VEVENT" && !time) {
								a.date(a.date() - 1);
								b.date(b.date() - 1);
								aa && aa.date(aa.date() - 1);
								bb && bb.date(bb.date() - 1);
							}

							if (a.isSame(b, 'day')){
								if (+a != +b)
									aTplData.date += ' - ' + b.format('LT');
							}
							else {
								aTplData.date += ' - ' + b.format('L' + (time ? ' LT' : ''));
							}

							if(aa && bb) {
								if (aa.isSame(bb, 'day')){
									if (+aa != +bb)
										aTplData.original_date += ' - ' + bb.format('LT');
								}
								else {
									aTplData.original_date += ' - ' + bb.format('L' + (time ? ' LT' : ''));
								}
							}
					}

					//With
					if (atmp.ATTENDEE){

						//Owner
						if (atmp.ORGANIZER && atmp.ORGANIZER[0].ATTRIBUTES && atmp.ORGANIZER[0].ATTRIBUTES.CN) {
							aTplData.organiser = atmp.ORGANIZER[0].VALUE;
							aTplData.attendee = '<a href="'+ aTplData.organiser.escapeHTML()+'">' + atmp.ORGANIZER[0].ATTRIBUTES.CN.escapeHTML() + '</a>';
							if (aTplData.organiser.indexOf('mailto:')===0)
								aTplData.organiser = aTplData.organiser.substr(7);
						}
						else
							aTplData.attendee = '';

						//Attendees
						for (var atd in atmp.ATTENDEE)
							if (atmp.ATTENDEE[atd].ATTRIBUTES && atmp.ATTENDEE[atd].ATTRIBUTES.ROLE != 'NON-PARTICIPANT' && (!atmp.ORGANIZER || atmp.ATTENDEE[atd].VALUE != atmp.ORGANIZER[0].VALUE))
								aTplData.attendee += (aTplData.attendee?', ':'') + '<a href="'+ atmp.ATTENDEE[atd].VALUE.escapeHTML()+'">' + (atmp.ATTENDEE[atd].ATTRIBUTES.CN || atmp.ATTENDEE[atd].VALUE.replace(/^mailto\:/gi,'')).escapeHTML() + '</a>';
					}

					//Tags
					if (atmp.CATEGORIES && atmp.CATEGORIES[0].VALUE){
						aTplData.tags = [];
						var arr = atmp.CATEGORIES[0].VALUE.split(','), aTags = dataSet.get('tags');
						for (var sTag in arr)
							if ((arr[sTag] = arr[sTag].trim()))
								aTplData.tags.push({TAGNAME:arr[sTag],TAGCOLOR:(aTags[arr[sTag]] && aTags[arr[sTag]].TAGCOLOR?aTags[arr[sTag]].TAGCOLOR:'')});
					}

					//Recurrence
					if (atmp.RRULE) {
						aTplData.rcr = true;
						var recur = new iMipRecurrence(atmp.RRULE[0].VALUE,a,time,b);
						aTplData.date = recur.toString();
					}
					else
					//Occurrence
					if (atmp['RECURRENCE-ID'])
						aTplData.ocr = true;

					if (atmp['X-ALT-DESC'] && atmp['X-ALT-DESC'][0] && atmp['X-ALT-DESC'][0].VALUE) {
						if(atmp['X-ALT-DESC'][0].ATTRIBUTES && atmp['X-ALT-DESC'][0].ATTRIBUTES.FMTTYPE === 'text/html') {
							aTplData.description = DOMPurify.sanitize(atmp['X-ALT-DESC'][0].VALUE);
						} else {
							aTplData.description = atmp['X-ALT-DESC'][0].VALUE.escapeHTML();
						}
					} else if (atmp.DESCRIPTION && atmp.DESCRIPTION[0] && atmp.DESCRIPTION[0].VALUE) {
						//aTplData.description = atmp.DESCRIPTION[0].VALUE.entityify().wrap();
						aTplData.description = atmp.DESCRIPTION[0].VALUE.escapeHTML().highlight_links();
					}

					if(aTplData.description) {
						aTplData.description = aTplData.description.trim().replace(/\n\s*\n/g, '\n').replace(/\n/g, '<br>');
					}

					if (atmp.COMMENT && atmp.COMMENT[0] && atmp.COMMENT[0].VALUE)
						//aTplData.comment = atmp.COMMENT[0].VALUE.entityify().wrap();
						aTplData.comment = atmp.COMMENT[0].VALUE.escapeHTML().highlight_links();
				}

				//DISABLE BUTTONS
				aTplData.disabled = !WMFolders.getAccess([this.__aid, this.__fid]).write || !aTplData.imip_method || !~['REQUEST', 'COUNTER', 'DECLINECOUNTER', 'PUBLISH'].indexOf(aTplData.imip_method);
				aTplData.import_only = aTplData.imip_method === 'PUBLISH';
				aTplData.organiser = aTplData.organiser==sPrimaryAccount;
				aTplData.canceled = aTplData.imip_method === 'CANCEL';
				sBody = template.tmp('obj_mailview_imip',aTplData);
			}
		}

		var date = dataSet.get('items',[this.__aid,this.__fid,this.__iid,'DATE']);
		if (date){
			var oDate = IcewarpDate.unix(date);
		}

		//add target to links
		//sBody = sBody.replace(/\<[aA]\b/gm,'<a target="_blank" ');

		/* Put Email header together as html */
		sBody_data = '<div class="iw_webmail_msg_header">'+
		'<h1>'+ (aData['SUBJECT']?aData['SUBJECT'].escapeHTML():'') +'</h1>'+
		'<table>'+
		'<tr><th width="0%" nowrap>'+getLang('DATAGRID_ITEMS_VIEW::FROM')+':&nbsp;</th><td width="100%">'+ (aData['FROM']?aData['FROM'].escapeXML():'') +'</td>'+(oDate?'<td width="0%" valign="top" nowrap>'+(oDate?oDate.format('L LT'):'')+'</td>':'')+'</tr>'+
		(aData['TO']?'<tr><th width="0%" nowrap>'+ getLang('DATAGRID_ITEMS_VIEW::TO') +':&nbsp;</th><td width="100%" colspan="2">'+ aData['TO'].escapeXML() +'</td></tr>':'')+
		(aData['CC']?'<tr><th width="0%" nowrap>'+ getLang('DATAGRID_ITEMS_VIEW::CC') +':&nbsp;</th><td width="100%" colspan="2">'+ aData['CC'].escapeXML() +'</td></tr>':'')+
		(aData['BCC']?'<tr><th width="0%" nowrap>'+ getLang('DATAGRID_ITEMS_VIEW::BCC') +':&nbsp;</th><td width="100%" colspan="2">'+ aData['BCC'].escapeXML() +'</td></tr>':'');

		if (aData['ATTACHMENTS']){
			sBody_data += '<tr><th width="0%" nowrap>'+getLang('DATAGRID_ITEMS_VIEW::ATTACHMENTS')+':&nbsp;</th><td colspan="2">';
			for (var j in aData['ATTACHMENTS']) {
				var att = aData['ATTACHMENTS'][j]['values'];
				if (att.NAME)
					sBody_data += att.NAME.escapeXML() + (att.SIZE?' ('+ parseFileSize(att.SIZE) +')':'') + '; ';
			}
			sBody_data += '</td></tr>';
		}

		sBody_data += '</table></div>';

		// Add Email body
		if (sBody)
			if (this.__TextBody)
				sBody_data += '<div style="font-family: Lucida Console,Courier New,Courier,Monospace;">' + sBody + '</div>';
			else
			if (this.__header_html)
				sBody_data += sBody;
			else
				sBody_data += '<div>' + sBody + '</div>';


		if (this.__header_cert){

			var aOut = {purposes:{}, data:this.__header_cert.values.CERT.INFO[0]};

			aOut.from =	IcewarpDate.utct(aOut.data.VALIDFROM[0].VALUE).format('L LT');
			aOut.to = IcewarpDate.utct(aOut.data.VALIDTO[0].VALUE).format('L LT');

			if (aOut.data.PURPOSES && aOut.data.PURPOSES[0] && aOut.data.PURPOSES[0].ITEM)
				for (var i in aOut.data.PURPOSES[0].ITEM)
					if (aOut.data.PURPOSES[0].ITEM[i].VAR1 && aOut.data.PURPOSES[0].ITEM[i].VAR1[0] && aOut.data.PURPOSES[0].ITEM[i].VAR1[0].VALUE == '1' &&
						aOut.data.PURPOSES[0].ITEM[i].VAR3 && aOut.data.PURPOSES[0].ITEM[i].VAR3[0] && aOut.data.PURPOSES[0].ITEM[i].VAR3[0].VALUE)
						switch(aOut.data.PURPOSES[0].ITEM[i].VAR3[0].VALUE){
						case 'sslclient':
							aOut.purposes.SSL = true;
							break;
						case 'smimeencrypt':
						case 'smimesign':
							aOut.purposes.SMIME = true;
							break;
						}

			sBody_data += '<div class="iw_webmail_msg_cert">' + template.tmp('frm_certificate', aOut) + '</div>';
		}

		if (!Is.Empty(this.__aImages)){

			sBody_data += '<div class="iw_webmail_msg_images">';

			var sFullPath = this.__aid+'/'+this.__fid+'/'+ WMItems.__serverID(this.__iid);

			for (var i in this.__aImages)
				sBody_data += '<img src="'+(this.__aImages[i].url.indexOf('http://') == 0 || this.__aImages[i].url.indexOf('https://') == 0?this.__aImages[i].url:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':sFullPath+'/'+this.__aImages[i].url}))+'" />';

			sBody_data += '</div>';
		}

		if (sStyles) {
			sBody_data += sStyles;
		}

		this._frame(sBody_data);

		if (sBody){

			//hide reply headers
			[].forEach.call(this.__doc.querySelectorAll('span[iw-to="'+sPrimaryAccount+'"]'), function(elm){
				elm.style.display = 'none';
			});

			//parse links
			var r = /^((http)|(https)|(ftp))\:/gi,
				h =  new RegExp("^"+ this.__doc_base.quoteMeta(),"gi"),
				a = [].concat([].slice.apply(this.__doc.getElementsByTagName('a')), [].slice.apply(this.__doc.getElementsByTagName('area')));

			// var	tmp = this.__doc.getElementsByTagName('a');
			// for (var i = 0; i<tmp.length; i++)
			//     a.push(tmp[i]);

			// var	tmp = this.__doc.getElementsByTagName('area');
			// for (var i = 0; i<tmp.length; i++)
			// 	a.push(tmp[i]);

			this.__anchors = {};
			for (var i = 0; i<a.length; i++)
				try{
					if (a[i].getAttribute('href')){

						a[i].setAttribute('target','_blank');

						//Anchor
						if (a[i].getAttribute('href').indexOf('#') == 0 || a[i].href.indexOf(document.location.href+'#')==0 || (this.__doc_base && a[i].href.indexOf(this.__doc_base+'#')==0)){
							a[i].removeAttribute('target');
							a[i].onclick = function(e){

								var anchor = me.__anchors[this.hash] || me.__anchors[unescape(this.hash)];
								if (Is.Defined(anchor)){
									var elm;
									if (elm = this.ownerDocument.getElementById('wm_anchor_' + anchor))
										try{
											var pos1 = getSize(elm, this.ownerDocument),
												pos2 = getSize(me.__eFrame),
												pos3 = getSize(me._main);

											me._getAnchor('block').scrollTop += pos1.y + pos2.y - pos3.y;
										}
										catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

									return false;
  								}

  								if (this.getAttribute('href').indexOf('#') == 0)
  									return false;
							};
						}
						//Mailto
						else
						if (a[i].href.toLowerCase().indexOf('mailto:') == 0){
							a[i].onclick = function(){
								var out = {to:this.href.substr(7)};
								if (out.to && out.to.indexOf('?')>-1){
									out.subject = parseURL(out.to).subject;
									out.body = parseURL(out.to).body;
									out.to = out.to.substring(0,out.to.indexOf('?'));
								}
								NewMessage.compose(out);
								return false;
							};

							a[i].oncontextmenu = function(e){
								var p, e = e || me.__eFrame.contentWindow.event,
									sMail = this.href.substr(7),
									sName = this.innerHTML;

								if ((p = sMail.indexOf('?'))>-1)
								    sMail = sMail.substr(0,p);

								if (sName.indexOf('@')>-1){
									//probably whole EMAIL
									if (sName.indexOf('&lt;')>-1){
										var aMail = MailAddress.splitEmailsAndNames(sName.unescapeHTML());
							            if (aMail && aMail[0] && aMail[0].name && aMail[0].email){
							            	sName = aMail[0].name;
							            	sMail = aMail[0].email;
							            }
							            else
                                        	sName = '';
									}
									else
										sName = '';
								}

								me._context_link(e, sName, sMail);
								return false;
							};
						}
						//Link
						else{
							if (this.__header_base)
								a[i].href = a[i].href.replace(h,this.__header_base);

							if (!Is.URL(a[i].href) && currentBrowser().indexOf('MSIE') == 0)
       							a[i].onmousedown = function(e){
									window.open(this.href);
									return false;
								};
						}
					}
					else
					if (a[i].name){
						this.__anchors['#' + a[i].name] = i;
						a[i].id = 'wm_anchor_' + i;
						a[i].removeAttribute('href');
					}
					else{
						a[i].removeAttribute('href');
						a[i].onclick = function(){return false};
					}
				}
				catch(r){
					a[i].removeAttribute('href');
					a[i].onclick = function(){return false};
				}

			//change URLs for links and img
			if (this.__header_base){
				var a = this.__doc.getElementsByTagName('link');
				for (var i = 2; i<a.length; i++)
					if (!a[i].getAttribute('iw-skip'))
						a[i].href = a[i].href.replace(h,this.__header_base);
			}

			/** FOLDER SUBSCRIBE 2 - oziveni tlacitek **/
			if (aData.X_ICEWARP_SERVER_TEAMCHAT_NOTIFICATIONS){


				var data = aData.X_ICEWARP_SERVER_TEAMCHAT_NOTIFICATIONS || {};


				if(!data.SERVER_ID || data.SERVER_ID[0].VALUE !== dataSet.get('main',['server_id']) || ((data.USER || [])[0] || {}).VALUE !== sPrimaryAccount) {
					[].forEach.call(this.__doc.querySelectorAll('.iw-hidden'), function(elm) {
						elm.classList.remove('iw-hidden');
					});
				}
				var elms = this.__doc.querySelectorAll('.btn-primary');
				[].forEach.call(elms, function(elm) {
					elm.addEventListener('click', function(e) {
						var roomID = data.ROOM_ID[0].VALUE.replace(/\\/g, '/');
						if(!dataSet.get('folders', [sPrimaryAccount, roomID])) {
							return;
						}

						e.preventDefault();
						e.stopPropagation();
						e.stopImmediatePropagation();

						data.POST_ID && data.POST_ID[0] && data.POST_ID[0].VALUE && dataSet.add('teamchat', ['forced_last_read_id'], data.POST_ID[0].VALUE.replace('*', ''));

						Cookie.set(['filter_tree'], 'I,Y');
						gui.frm_main.filter.__filter('I');

						var folders = gui.frm_main.bar.tree.folders;
							folders._setActive(sPrimaryAccount + '/' + roomID);
							folders._handleNode({
								aid: sPrimaryAccount,
								fid: roomID
							});
							folders._filter_folder(['I', 'Y']);
							folders._fill();
					});

				});

			} else if (aData.X_ICEWARP_SERVER_REQUEST){
            	if (aData.X_ICEWARP_SERVER_REQUEST.METHOD && aData.X_ICEWARP_SERVER_REQUEST.METHOD[0].VALUE == 'invite'){
            		if (aData.X_ICEWARP_SERVER_REQUEST.SERVER_ID && aData.X_ICEWARP_SERVER_REQUEST.SERVER_ID[0].VALUE == dataSet.get('main',['server_id']) && aData.X_ICEWARP_SERVER_REQUEST.USER && aData.X_ICEWARP_SERVER_REQUEST.FOLDER){

						var elms = this.__doc.querySelectorAll('.btn-primary');
						[].forEach.call(elms, function(elm) {

							var aF = dataSet.get('folders',[sPrimaryAccount]),
								srp = Path.slash(aData.X_ICEWARP_SERVER_REQUEST.FOLDER[0].VALUE),
								onclick = function(){
									if (dataSet.get('folders',[sPrimaryAccount, fid])){
										//gui.frm_main.bar.tree.folders._setActive(sPrimaryAccount +'/' + fid);
										//gui.frm_main.bar.tree.folders._handleNode({aid:sPrimaryAccount, fid:fid});

										//should be used...
										gui.frm_main._selectView({'aid':sPrimaryAccount,'fid':fid});
										gui.frm_main.filter.__filter('I');

										return false;
									}
									gui.notifier._value({type: 'teamchat_not_exists', args: [srp]});

									return false;
								};

							for (var fid in aF){
								if (aF[fid].TYPE == "I" && aF[fid].RELATIVE_PATH == srp){

									elm.onclick = onclick;

									break;
								}
							}
							elm.onclick = elm.onclick || function(){
								accounts.refresh({'aid':sPrimaryAccount},'folders','',[function() {
									for (var fid in aF){
										if (aF[fid].TYPE == "I" && aF[fid].RELATIVE_PATH == srp){
											return onclick();
										}
									}
									gui.notifier._value({type: 'teamchat_not_exists', args: [srp]});
								}]);
								return false;
							};
						});
					}

            	}
            	else{
					var elm = this.__doc.getElementsByTagName('form');
					if (elm && (elm = elm[0])){
						if ((elm = elm.getElementsByTagName('input'))){
							for(var i = elm.length-1; i>=0; i--)
								if (elm[i].type == 'button'){

									//Subscribe Account
									if (elm[i].name == 'account'){
										/*
										var tmp_fol = dataSet.get('folders',[sPrimaryAccount,sPrimaryAccountSPREFIX + aData.X_ICEWARP_SERVER_REQUEST.USER[0].VALUE]);
										if (tmp_fol && tmp_fol.SHARED)
											elm[i].disabled = true;
										else
										{
										*/
										elm[i].onclick = function(e){
											this.disabled = true;
											var aAccountInfo = {
												aid:sPrimaryAccount,
												subscription:[aData.X_ICEWARP_SERVER_REQUEST.USER[0].VALUE]
											};

											WMAccounts.subscribe(aAccountInfo,[this,'__disable']);
										};

										elm[i].__disable = function(aResponse){
											try{
												if (aResponse.IQ[0].ERROR){
													gui.notifier._value({type: 'alert', args: {header: '', text: 'ERROR::SUBSCRIBE_ERROR', args: [aResponse.IQ[0].ERROR[0].VALUE]}});
													this.disabled = false;
													return;
												}
												else{
													gui.notifier._value({type: 'account_subscribed', args: [aData.X_ICEWARP_SERVER_REQUEST.USER[0].VALUE]});

													//Remove Email
													if (me.__aid && me.__fid && me.__iid){
					                                        Item.remove([me.__aid,me.__fid,[me.__iid]],true);

														if (me._parent._type == 'frm_mail')
															me._parent._destruct();
													}
												}
											}
											catch(r){
												this.disabled = false;
											}

											//Refresh
											accounts.refresh({'aid':sPrimaryAccount},'folders');
										};
										//}
									}
									//Subscribe Folder
									else
									if (elm[i].name == 'subscribe'){

										/*
										var tmp_fol = dataSet.get('folders',[sPrimaryAccount,sPrimaryAccountSPREFIX + aData.X_ICEWARP_SERVER_REQUEST.USER[0].VALUE + (aData.X_ICEWARP_SERVER_REQUEST.FOLDER[0].VALUE == '*'?'':'/' + aData.X_ICEWARP_SERVER_REQUEST.FOLDER[0].VALUE)]);
										if ((tmp_fol && tmp_fol['TYPE']) || aData.X_ICEWARP_SERVER_REQUEST.FOLDER[0].VALUE == '*')
											elm[i].disabled = true;
										else
										{
										*/
										elm[i].__disable = function(bOK,aResponse,sType,sAccount,sFolder){
											try{
												if (bOK){
													gui.notifier._value({type: (!sFolder || sFolder == '*'?'ACCOUNT':'FOLDER') + '_' + (sType=='subscribe'?'SUBSCRIBED':'UNSUBSCRIBED'), args: [sAccount,sFolder]});

													//Remove Email
													if (bOK && me.__aid && me.__fid && me.__iid){
														Item.remove([me.__aid,me.__fid,[me.__iid]],true);

														if (me._parent._type == 'frm_mail')
															me._parent._destruct();
													}
												}
												else{
													gui.notifier._value({type: 'alert', args: {header: '', text: 'MAIL_VIEW::ERROR', args: [sAccount,sFolder]}});
													this.disabled = false;
													return;
												}
											}
											catch(r){
												this.disabled = false;
											}

											//Refresh
											accounts.refresh({'aid':sPrimaryAccount},'folders');
										};

										elm[i].onclick = function(e){
											if (me.__aid && me.__fid && me.__iid){
												this.disabled = true;
												WMItems.action({aid:me.__aid,fid:me.__fid,iid:me.__iid},this.name,[this,'__disable',[this.name,aData.X_ICEWARP_SERVER_REQUEST.USER[0].VALUE,aData.X_ICEWARP_SERVER_REQUEST.FOLDER[0].VALUE]]);
											}
										};

										//}

									}
								}
						}
					}
				}
			}
			else
			/** iMIP 2 - oziveni tlacitek **/
			if (aIMIP.length>0 && atmp && (atmp.DTSTART || atmp['PERCENT-COMPLETE'])){
				aItem = {aid:this.__aid, fid:this.__fid, iid:this.__iid};

				if (atmp.DTSTART) {
					this._create('x_freebusy', 'obj_freebusy', 'block', '');
					var freebusy_helper = mkElement('div', {
						className: 'freebusy_helper'
					});
					this.x_freebusy._main.insertAdjacentElement('beforebegin', freebusy_helper);
					this.x_freebusy._obeyEvent('ondestruct', [function() {
						freebusy_helper.parentElement.removeChild(freebusy_helper);
					}]);

					this.x_freebusy._init({
						evnid: atmp.UID[0].VALUE,
						users: [sPrimaryAccount],
					});

					this.x_freebusy._readonly(true);

					this.x_freebusy._obeyEvent('oncollision', [function(_, args) {
						if(args.arg) {
							freebusy_helper.classList.add('collision');
							if(aTplData.imip_method === 'COUNTER' || aTplData.imip_method === 'REPLY') {
								freebusy_helper.innerHTML = getLang('MAIL_VIEW::FREEBUSY_BUSY');
							} else {
								freebusy_helper.innerHTML = getLang('MAIL_VIEW::FREEBUSY_BUSY_PROPOSE', ['<a>' + getLang('MAIL_VIEW::PROPOSE') + '</a>']);
								freebusy_helper.querySelector('a').onclick = function() {
									var button = me.__doc.getElementsByTagName('form')[0].querySelector('input[name=propose]');
									button.onclick.call(button);
								};
							}
						} else {
							freebusy_helper.innerHTML = getLang('MAIL_VIEW::FREEBUSY_FREE');
							freebusy_helper.classList.remove('collision');
						}
					}]);

					this.x_freebusy._value({
						startdate: +atmp.DTSTART[0].ATTRIBUTES['X-CTZDATE'],
						starttime: Math.max(atmp.DTSTART[0].ATTRIBUTES['X-CTZTIME'],0),
						enddate: +(atmp.DTEND || atmp.DTDUE)[0].ATTRIBUTES['X-CTZDATE'],
						endtime: Math.max((atmp.DTEND || atmp.DTDUE)[0].ATTRIBUTES['X-CTZTIME'], 0),
						title: atmp.SUMMARY?atmp.SUMMARY[0].VALUE:'',
						tzid: GWOthers.getItem('CALENDAR_SETTINGS', 'timezone')
					});
				}

				for(var i in aIMIP){
					if ((frm = this.__doc.getElementsByTagName('form')))
						for (var i=0;i<frm.length;i++){
							elm = frm[i].getElementsByTagName('input');

							for (var j=0;j<elm.length;j++){
								if (elm[j].type != 'button') continue;

								if (me.__aid != sPrimaryAccount)
									elm[j].disabled = true;
								else{
									elm[j].__disable = function(bOK, bObsolete, aItem, bRemove){

										//Remove Email after action
										if (((bOK && bRemove) || bObsolete) && aItem && aItem.aid && aItem.fid && aItem.iid){
											Item.remove([aItem.aid,aItem.fid,[aItem.iid]],true);
											me.x_freebusy && me.x_freebusy._destruct();

											if (me._parent._type == 'frm_mail')
												me._parent._destruct();

											//Show Info...
											if (!bObsolete)
												gui.notifier._value({type: 'event_'+({accept: "accepted",tentative:"unsure",decline:"declined",propose:'proposed'})[this.name]});
										}
										else{
											var inp = this.form.querySelectorAll('input[type=button]');
											for(var i = inp.length;i--;)
												inp[i].disabled = bOK && inp[i] == this;
										}
									};


									elm[j].__imipID = i;
									elm[j].onclick = function(e){

										aItem.partid = this.form.partid.value;
										aItem.imip_type = this.form.imip_type.value;

										var name = this.name + (this.form.imip_method.value == 'COUNTER'?'_counter':''),
											self = this;

										this.disabled = true;

										switch(this.name){
										case 'decline':

											var frm = gui._create('decline','frm_text','','frm_ok_cancel', [
												function(s){
													aItem.reason = s;
													WMItems.imip(aItem, name, [self,'__disable',[aItem, true]]);
												}],
											'EVENT::REASON');

											frm._onclose = function(){
												self.disabled = false;
												return true;
											};

											frm.x_btn_ok._value('FORM_BUTTONS::DECLINE');
											break;

										case 'propose':
											// var frm = gui._create('propose','frm_propose','','', aItem, aIMIP[this.__imipID], [self,'__disable',[aItem, true]]);
											WMItems.action({
												aid: me.__aid,
												fid: me.__fid,
												iid: me.__iid + '|' + aItem.partid,
												attrs: {
													delete: 1
												}
											}, 'importattachment', [function(bOK, xResponse) {
												var aValues = WMItems.parse(xResponse);
												for (var aid in aValues)
													for (var fid in aValues[aid]) {
														delete aValues[aid][fid]['/'];
														delete aValues[aid][fid]['#'];
														delete aValues[aid][fid]['$'];
														delete aValues[aid][fid]['@'];
														for (var iid in aValues[aid][fid]) {
															aValues = aValues[aid][fid][iid];

															Item.openwindow([aid, fid, iid], aValues, null, 'E', { propose: true },[
																function(frm){
																	frm._onclose = function(){
																		self.disabled = false;
																		return true;
																	};

																	frm.x_btn_ok._onclick = function(){
																		if(frm._userEdited()) {
																			aItem.gwparams = frm.X_TIMEINTERVAL._value();
																			WMItems.imip(aItem, 'propose', [self,'__disable',[aItem, true]]);
																		}
																		frm._destruct();
																	};
																	frm.x_btn_ok._disabled(false);
																}
															]);

														}
													}
												self.__disable(bOK, aItem, true);
												}]);
											break;

										case 'tentative':
											WMItems.imip(aItem, name, [this,'__disable',[aItem, false]]);
											break;

										default:
											WMItems.imip(aItem, name, [this,'__disable',[aItem, true]]);
										}

									};
								}
							}
						}
				}
			}
		}
		/*
		else
			this._frame('');
*/

		this._header(aHeaders);

		//show images
		if (!Is.Empty(this.__aImages)){
			storage.library('gw_others');
			if (parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL','auto_show_images')) == 1)
				this.__showImages();
			else
				this.__showImages(true);
		}
		else
			this.__showImages(true);

		/*
		else
		if (this.btn_show)
			this.btn_show._destruct();
		*/
	}
	catch(r){
		if (console)
			console.log(r);
	}

};
