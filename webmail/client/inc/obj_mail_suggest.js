_me = obj_mail_suggest.prototype;
function obj_mail_suggest(){};

/**
 * @brief: CONSTRUCTOR
 * @date : 29.1.2013
 **/
_me.__constructor = function(){
	var me = this;

	this.__activeFirst = true;

	this._min = 1;
	this._limit = 15;
	this._folder;

	this.__hints = [];

	//Scrollbar
	this.__block = this._getAnchor('container');
	this._scrollbar(this.__block, this._main);

	//Registr Drop
	if (gui.frm_main && gui.frm_main.dnd){
		//Drag and Drop
		this.__etag.onmousedown = function(e){

			if (me.__dndtimer){
				window.clearTimeout(me.__dndtimer);
				delete me.__dndtimer;
			}

			var e = e || window.event;
			if (e.button>1 || e.ctrlKey || !me.__initdrag) return;
			var elm = e.target || e.srcElement;

			if (elm == this || elm.tagName == 'INPUT') return;
			if (elm.tagName != 'SPAN')
				elm = Is.Child(elm,'SPAN');

			//fire the event :)
			if (elm) {
				var x = e.clientX, y = e.clientY;

				gui._obeyEvent('mouseup',[me,'__dndDispatch']);
				me.__dndtimer = setTimeout(function(){
					me.__initdrag(elm, x, y);
				},500);

				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
				return false;
			}
		};

		this._placeholder(getLang('POPUP_ITEMS::ENTER_EMAIL_ADDRESS'));

		gui.frm_main.dnd.registr_drop(this,['rcp','jabber','item']);
	}
};

_me._onexpand = function(elm){
	if (elm){
		var elm = elm,
			v = elm.getAttribute('val'),
			me = this;

		//remove []
		v = v.substr(1,v.length-2);

		gui._create('expand','frm_confirm','','frm_alert noblur', [function(){

			if (elm && v){

				var id = v;
				if(v.indexOf('::')) {
					id = v.split('::')[0];
				}
				if(~['I', 'Y'].indexOf(dataSet.get('folders', [sPrimaryAccount, id, 'TYPE']))) {
					WMItems.list({
						aid: sPrimaryAccount,
						fid: '__@@GROUP@@__/' + id
					},'','','',[function(response) {
						response = ((response || {})[sPrimaryAccount] || {})['__@@GROUP@@__/' + id];
						if(!response) {
							return gui.notifier._value({type: 'alert', args: {header: 'ALERTS::NOT_FOUND', text: 'CONFIRMATION::DL_NOT_FOUND'}});
						}
						for(var i in response) {
							if(!i.indexOf('*')) {
								var a = me._decode(MailAddress.createEmail(response[i].FRTNAME, response[i].FRTEMAIL));
								for (var i in a){
									me._addTag(a[i], elm);
									elm = '';
								}
							}
						}
					}]);
				} else {
					var fid = '__@@ADDRESSBOOK@@__';

					//DL with path
					if (v.indexOf('::')>1){
						var tmp = v.split('::');
						fid = tmp[0];
						v = tmp[1];
					}

					WMItems.list({"aid": sPrimaryAccount, "fid": fid,
						filter:{search:'classify:"'+ v.replace(/"/g,'\\"') +'"'},
						values:['ITMCLASS']
					}, '', '', '', [function(aData){

						if (aData && (aData = aData[sPrimaryAccount]) && (aData = aData[fid])){

							//Search
							for(var iid in aData)
								if (iid.charAt(0) == '*')
									if (aData[iid].ITMCLASS == 'L'){

										//Load Item
										WMItems.list({"aid": sPrimaryAccount, "fid": fid, iid:iid},'','','',[
											function(aData){
												if (aData && (aData = aData[sPrimaryAccount]) && (aData = aData[fid]) && (aData = aData[iid]) && (aData = aData.LOCATIONS))
													for(var lid in aData)
														if (aData[lid].values && aData[lid].values.LCTEMAIL1){
															var a = me._decode(MailAddress.createEmail(aData[lid].values.LCTDESCRIPTION, aData[lid].values.LCTEMAIL1));
															for (var i in a){
																me._addTag(a[i], elm);
																elm = '';
															}
														}
											}
										]);

										return;
									}
						}

						//Not found
						gui.notifier._value({type: 'alert', args: {header: 'ALERTS::NOT_FOUND', text: 'CONFIRMATION::DL_NOT_FOUND'}});

					}]);
				}

			}

		}], 'ALERTS::ALERT', 'CONFIRMATION::EXPAND');

	}
};

//decode input content
_me._decode = function(v){

	var aIN = MailAddress.splitEmailsAndNames(v),
		rx = new RegExp("^([a-z0-9\\'\\!\\#\\$\\%\\&\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~\\*][\\.]?)+",'gim');
	aOut = [];

	for (var i in aIN)

	//Name & Email
		if (aIN[i].name && aIN[i].email)
			aOut.push({tag:MailAddress.createEmail(aIN[i].name, aIN[i].email), label:MailAddress.createEmail(aIN[i].name, aIN[i].email, true)});
		else
		//Email only
		if (aIN[i].email){
			if (!Is.Email(aIN[i].email)){

				//Distrib
				if (aIN[i].email.indexOf('[') === 0 && aIN[i].email.indexOf(']') === aIN[i].email.length - 1) {
					aOut.push({tag: aIN[i].email, label: ((aIN[i].email.match(/\[.*::(.*)\]/) || [])[1]) || false, expand: true});
					continue;
				}

				if (aIN[i].email.indexOf('@')<0){
					//Some spaces
					if (aIN[i].email.indexOf(' ') >- 1){
						var a = v.split(' ');
						if (a.length>1){
							aOut = aOut.concat(this._decode(a.join(',')));
							continue;
						}
					}
					//local name
					else
					if (rx.test(aIN[i].email)){
						aOut.push({tag:aIN[i].email});
						continue;
					}
				}

				//wrong
				aOut.push({tag:aIN[i].email,err:1});
			}
			//Email only
			else
				aOut.push({tag:aIN[i].email});
		}

	return aOut;
};

//OK Inherited
_me._qdata = function(v){

	var cart = this._getCartPos(),
		end = false, word = [0,0];

	for (var i=0, l=v.length; i<l; i++){
		switch(v.charAt(i)){
		case ',':
			if (cart<=i)
				end = true;
			else
				word = [i+1,i+1];

			break;

		default:
            	word[1] = i+1;
		}

		if (end) break;
	}

	v = v.substring(word[0],word[1]);
	this.__last_pos = [word[0],word[1],v];
	return v;
};

//OK (inherited)
_me._qvalue = function(v){
	if (Is.Object(v))
		v = v.value;

	if (typeof v != 'undefined'){
		var inp = this._getFocusedInput();
		if (inp){

			var old = inp._value();
			this._qdata(old);
			inp._value(old.substr(0,this.__last_pos[0]) + v + old.substr(this.__last_pos[1]));

			//Add New Imidietly
			if (inp._name == 'plus')
				this.__inpBlur('',{owner:inp});
		}
	}
};

//OK
_me._query = function(v){
	if (v.indexOf('[')==0){
		var tmp = v;
		if (!(v = v.replace(/[\[\]]+/g,'')))
		    return;

   		this.__last_qdata = {email:tmp};

		v = v.quoteSQL();
		var aFilter = {
			search: 'class:L AND classify:'+v,
			sort:'ITMCLASSIFYAS',
			limit: this._limit
		};
	}
	else{
		//4. naparsovat adresu
		var aParsed = MailAddress.splitEmailsAndNames(v)[0];

		if (!aParsed.name)
			aParsed.name = aParsed.email;

		this.__last_qdata = aParsed;
		var aFilter = {
			search:	'has:email AND ('+ (GWOthers.getItem('MAIL_SETTINGS_GENERAL','search_primary') == 1?'email1':'email') +':"'+aParsed.email.replace(/"/g,'\\"') +
					'" OR classify:"'+aParsed.name.replace(/"/g,'\\"') +
					'" OR title:"'+aParsed.name.replace(/"/g,'\\"') +
					'" OR name:"'+aParsed.name.replace(/"/g,'\\"') + '")',
			sort: 'ITMCLASSIFYAS,ITMFIRSTNAME,ITMSURNAME,LCTEMAIL1,LCTEMAIL2,LCTEMAIL3',
			limit: this._limit,
			groupbyemail: GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'GROUP_CONTACTS_BY_EMAIL') == '1'
		};
	}

	if (!sPrimaryAccountGW || (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('c')>-1)
		this._parse(v,[]);
	else{

		// if (+GWOthers.getItem('RESTRICTIONS', 'disable_group_sharing'))
		// 	aFilter.search += ' AND flags:0';

		WMItems.list({'aid':sPrimaryAccount,'fid':(GWOthers.getItem('RESTRICTIONS','gal_suggest') == 1?"__@@ADDRESSBOOK@@__":Mapping.getDefaultFolderForGWType('C')),'values':['ITMTITLE','ITMCLASS','ITMCLASSIFYAS','ITMFIRSTNAME','ITMMIDDLENAME','ITMSURNAME','ITMSUFFIX','LCTEMAIL1','LCTEMAIL2','LCTEMAIL3','LCTTYPE'],'filter':aFilter},'','','',[this,'_parse',[v]]);
	}
};

// OK
_me._parse = function(sWord,aValues){

	if (!aValues || this._input_value() != sWord){
		this.__show();
		this.__sLastRequestString = '';
		return;
	}

	//Get last used emails from Cookie
	var rcp,emails = [], name, email;
	if ((rcp = Cookie.get(['suggest_address']))){
		emails = MailAddress.splitEmailsAndNames(rcp);

		name = this.__last_qdata.name?this.__last_qdata.name.toLowerCase():'';
		email = this.__last_qdata.email?this.__last_qdata.email.toLowerCase():'';

		for (var i = emails.length-1;i>=0;i--)
			if (!((email && emails[i].email.toLowerCase().indexOf(email)>-1) || (name && emails[i].name.toLowerCase().indexOf(name)>-1)))
				emails.splice(i,1);
	}

	//Prepare Query data
	if (!Is.Empty(aValues)){

		for(var aid in aValues)
			for (var fid in aValues[aid]);

		if (aid && fid && (aValues = aValues[aid][fid])){

			delete aValues['/'];
			delete aValues['#'];
			delete aValues['$'];
			delete aValues['@'];

			var found;
			for(var i in aValues){

				if (aValues[i].ITMCLASS == 'L'){
					email = ['['+aValues[i].ITMCLASSIFYAS+']'];
					name  = '';
				}
				else
				if (!aValues[i].LCTEMAIL1 && !aValues[i].LCTEMAIL2 && !aValues[i].LCTEMAIL3)
					    continue;
				else{
					name  = aValues[i].ITMCLASSIFYAS || ((aValues[i].ITMFIRSTNAME || '') + (aValues[i].ITMSURNAME?' '+aValues[i].ITMSURNAME:''));
					email = [];
					if (aValues[i].LCTEMAIL1)
						    email.push(aValues[i].LCTEMAIL1);

					if (GWOthers.getItem('MAIL_SETTINGS_GENERAL','search_primary') != 1){
						if (aValues[i].LCTEMAIL2)
							    email.push(aValues[i].LCTEMAIL2);

						if (aValues[i].LCTEMAIL3)
							    email.push(aValues[i].LCTEMAIL3);
					}

				}

				for(var j in email){
					found = false;

					for (var k in emails)
						if (emails[k].email.toLowerCase() == email[j].toLowerCase() || (aValues[i].ITMCLASS=='L' && ('['+emails[k].email.toLowerCase()+']') == email[j].toLowerCase())){
							if (name && !emails[k].name)
								emails[k].name = name;

							found = true;
						}

					if (!found)
						emails.push({name:name,email:email[j]});
				}
			}
		}
	}

	//Concat Query and Cookie Data
	var sc = function (a,b){
		var x = (a.name || '')+a.email.replace(/[\[\]]/g,'');
		var y = (b.name || '')+b.email.replace(/[\[\]]/g,'');
		if (x>y)
			return 1;
		else
		if (x<y)
			return -1;
		else
			return 0;
	};

	emails = emails.sort(sc);

	//Create output string
	var out = [],
		MSIE = currentBrowser() == 'MSIE7';

	for(var i in emails){
		name  = emails[i].name;
		email = emails[i].email;

		if ((name && this.__last_qdata.name != name) || (email && this.__last_qdata.email != email)){
			if (email.indexOf('[')===0)
				out.push(MSIE?email:{value:email, css:'avatar'});
			else
				out.push(MSIE?MailAddress.createEmail(name,email):{value:MailAddress.createEmail(name,email), text:MailAddress.createEmail(name,email, true), css:'avatar', prefix:'<span class="avatar" style="background-image:url(\''+getAvatarURL(email)+'\')"></span>'});
		}
	}

	if (out.length)
		this.__show(out);
	else
		this.__hide();

	this.__sLastRequestString = sWord;
	this.__sLastSuggest = sWord;
};


/**
 * Drag & Drop
 **/

_me.__dndDispatch = function(){
	if (this.__dndtimer){
		window.clearTimeout(this.__dndtimer);
		delete this.__dndtimer;
	}
	return false; // for _disobeyEvent
};

_me.__initdrag = function(elm,x,y){

	//disable drag if rename state
	if (this.edit || !elm.parentNode) return false;

	//prepare data
	var sBody = '<div class="drag_rcp">'+ elm.getAttribute('val').escapeHTML() +'</div>';

	this.__dragged = elm;
	addcss(elm,'drag');

	//create Drag box
	gui.frm_main.dnd.create_drag(sBody, {type:'rcp', obj:this, value:elm}, x, y);
};

_me._active_dropzone = function(v){

	this.__aDragTargets = [];

	if (v){

		//Filter all Items except Contacts
		if (v.type == 'item' && WMFolders.getType(v.value[0]) != 'C')
			return false;

		this.__objPos = getSize(this._main);

		var a = this.__etag.getElementsByTagName('SPAN');
		for(var i = a.length-1;i>=0;i--)
			if (a[i] != v.value)
				this.__aDragTargets.push([a[i],getSize(a[i])]);
	}
	else
	if (this.__dragged && this.__dragged.parentNode){
		removecss(this.__dragged,'drag');
		removecss(this._main,'dragover');
		this.__dragged = null;
	}
};

_me._ondragover = function(v){
	addcss(this._main,'dragover');
};

_me._ondragout = function(v){
	removecss(this._main,'dragover');
};

_me._ondrop = function(v){
	if (v.value && v.target !== v.obj){
		var a = [];
		switch(v.type){
		case 'item':

			if (v.value){
				var aID = [];
				for(var i = 0; i<v.value.length; i++)
					aID.push(WMItems.__serverID(v.value[i].iid));

				if (aID.length){
					var me = this;

					WMItems.list({
						aid:v.value[0].aid,
						fid:v.value[0].fid,
						filter:{search:'items:('+ aID.join(' OR ') +')'},
						values:['ITMCLASSIFYAS','LCTEMAIL1','LCTEMAIL2','LCTEMAIL3','ITMCLASS']
					},'','','',[
						function(itm){
							if (me._addTag && itm && (itm = itm[v.value[0].aid]) && (itm = itm[v.value[0].fid]))
								for(var i in itm)
									if (Is.Object(itm[i]))
										if (itm[i].ITMCLASS == 'L'){

											//Build Distrib Name
											var sPrefix = '',
												sName = itm[i].ITMCLASSIFYAS;

											if (itm[i].aid != sPrimaryAccount || sName.indexOf('::') >= 0)
												sPrefix = itm[i].aid + '::' + itm[i].fid + '::';
											else
											if (itm[i].fid != Mapping.getDefaultFolderForGWType('C') && itm[i].fid != "__@@ADDRESSBOOK@@__")
												sPrefix = itm[i].fid + '::';

											me._addTag({tag:'['+ sPrefix + sName +']'});
										}
										else
										if (itm[i].LCTEMAIL1 || itm[i].LCTEMAIL2 || itm[i].LCTEMAIL3)
											me._addTag({tag:MailAddress.createEmail(itm[i].ITMCLASSIFYAS, (itm[i].LCTEMAIL1 || itm[i].LCTEMAIL2 || itm[i].LCTEMAIL3))});
						}]);
				}
			}

			return;

		case 'jabber':
			for (var tmp, i = 0; i<v.value.length; i++){
				tmp = dataSet.get('xmpp', ['roster',v.value[i],'name']);
				tmp = MailAddress.createEmail(tmp && tmp != v.value[i]?tmp:'', v.value[i]);
				if (tmp)
					a.push({tag:tmp});
			}
			break;

		case 'rcp':
			a = this._decode(v.value.getAttribute('val'));
		}

		if (a.length)
			for (var i = 0; i<a.length; i++)
				this._addTag(a[i]);
	}
};

_me._ondragstart = function(v){
	if (v.value.parentNode)
		addcss(v.value,'dragged');
};

_me._ondragend = function(v){
	if (v.value.parentNode)
		if (v.target && v.target !== this)
			v.value.parentNode.removeChild(v.value);
		else
			removecss(v.value,'dragged');
};

_me._collapsedValue = function(v){
	var dv = this._decode(v);
	if (dv.length>this.__collapse_limit)
		this._value(v, true);
	else
		this._value(v);
};
