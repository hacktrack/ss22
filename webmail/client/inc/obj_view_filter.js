_me = obj_view_filter.prototype;
function obj_view_filter(){};

/*
	States for SIP, phone and conference can be monitored by:
		dataSet.get('sip',['state'])	=	(string)	offline | online
		dataSet.get('sip',['activity'])	=	(string)	Calling | Phoning | Ringing | Joining | Conference
			Returns empty string when there is no activity.
*/


_me.__constructor = function(){
	var	me = this,
		aDisabled = {},
		i, type, anchor, aFilter, elm, sInitPage, sActiveFolder, sActiveFolderType, sType, tips, span, tip;

	this.__btncss = {};
	this.__aTypes = ['M','C','E','J','N','F','T','B', 'I', 'Y', 'X','W','K'];
	this._telemetry = 'full';

	var opt = {
		sip: !sPrimaryAccountGUEST && window.sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1,
		conference: !sPrimaryAccountGUEST && window.sPrimaryAccountCONFERENCE,
		alfresco:Alfresco && Alfresco.enabled(),
		quota: dataSet.get('accounts',[sPrimaryAccount,'MBOX_QUOTA']),
		extended: this._parent._name == 'frm_main'
	};

	var dgw = (sPrimaryAccountGW ? (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '') : 'cetfnj').split('');

	// Show allowed types only
	if (sPrimaryAccountGUEST) {
		dgw = 'mcetfnjb';
	}
	for (i in dgw) {
		aDisabled[dgw[i]] = true;
	}
	if (count(aDisabled) == this.__aTypes.length - 1) {
		aDisabled.gw = true;
	}
	if (!sPrimaryAccountCHAT) {
		aDisabled.i = true;
	}
	this._draw('obj_view_filter', 'main', opt); // render all first, hide disabled later
	for (type in aDisabled) {
		anchor = this._getAnchor(type.toUpperCase());
		addcss(anchor, 'hide');
	}

	//Load last filter
	aFilter = ((TeamChatAPI && TeamChatAPI.teamChatOnly() && 'I,Y') || Cookie.get(['filter_tree']));
	sInitPage = (sPrimaryAccountGUEST || (TeamChatAPI && TeamChatAPI.teamChatOnly())) ? '' : GWOthers.getItem('LAYOUT_SETTINGS', 'init_page');

	if (!aFilter){
		if (sInitPage === 'h' || sInitPage === 'i'){
			aFilter = 'M';
		}
		else
		if (sInitPage === 'r'){
			aFilter = 'M';

			sActiveFolder = Cookie.get(['last_folder']);
			if (sActiveFolder){
				sType = WMFolders.getType(Path.split(sActiveFolder));
				if (sType && sType !== 'X')
					aFilter = sType;
			}
		}
	}
	else
	if (Is.String(aFilter)){
		if (sInitPage == 'i' && aFilter.indexOf('M') < 0) {
			aFilter = 'M';
		}
		if ((aFilter = aFilter.split(','))) {
			for (i in aFilter) {
				if (elm = this._getAnchor(aFilter[i])) {
					addcss(elm, 'active');
				}
			}
		}
	}

	// Click to change folder
	this._getAnchor('buttons').onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			bInfo = false;

		if (elm.tagName == 'I'){
			elm = elm.parentNode;
			bInfo = true;
		}

		if (elm.tagName == 'SPAN'){
			var id = elm.id.substring(me._pathName.length+1);
			Cookie.set(['show_all_folders'], 0);
			gui.frm_main.bar.tree.folders.btn_all._active(false);
			me.__filter(id, bInfo, e.ctrlKey);
		}
	};

	//Extended version for frm_main sibling only
	if (opt.extended){

		this._listen('active_folder');
		this._listen('folders');

		// Right click to open default new item of that type
		this._getAnchor('buttons').oncontextmenu = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName == 'I')
				elm = elm.parentNode;

			if (elm.tagName == 'SPAN'){
				var sType = elm.id.substring(me._pathName.length+1);

				switch(sType){
					case 'F':
					case 'S':
					case 'H':
					case 'A':
					case 'B':
					case 'I':
					case 'W':
						break;
					case 'M':
						NewMessage.compose();
						break;
					default:
						gui.frm_main.hmenu1.__createNewGW(sType);
				}
			}

			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
			if (e.preventDefault) e.preventDefault();
			return false;
		};

		this._getAnchor('loader').onclick = function() {
			me._getEmails();
		};
		gui.tooltip._add(this._getAnchor('loader'), getLang('MAIN_MENU::UPDATE'), {x: '+48', y: '+35'});

		// AUTOUPDATE
		if (GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'autoupdate') > 0) {
			var iRefresh = parseInt(GWOthers.getItem('MAIL_SETTINGS_GENERAL', 'autoupdate_minutes'), 10);
			if (iRefresh > 0) {
				iRefresh *= 60000;
				var me = this;
				this.__interval = setInterval(function () {
					me._getEmails(1);
				}, iRefresh);
			}
		}

		//loading
		this._add_destructor('__destructor');
		gui.__loading_counter = 0;
		gui.__loading_obj = this;

		// Mouse over will display custom tooltip
		tips = {
			M: getLang('FOLDERS::MAILS'),
			E: getLang('FOLDERS::EVENTS'),
			C: getLang('FOLDERS::CONTACTS'),
			F: getLang('FOLDERS::FILES_DOCUMENTS'),
			T: getLang('FOLDERS::TASKS'),
			N: getLang('FOLDERS::NOTES'),
			I: getLang('FOLDER_TYPES::GROUPCHAT'),
			W: getLang('FOLDER_TYPES::CONFERENCES'),
			B: getLang('COMMON_FOLDERS::TRASH'),
			K: getLang('COMMON_FOLDERS::ALFRESCO')
		};
		span = this._getAnchor('buttons').getElementsByTagName('span');
		for(i = span.length; i;) {
			tip = tips[span[--i].id.substring(this._pathName.length+1)];
			tip && gui.tooltip._add(span[i],tip,{x: '+48',y: '+35'});
		}

		//Registr Drop
		if (gui.frm_main && gui.frm_main.dnd) {
			gui.frm_main.dnd.registr_drop(this,['item','folder','jabber','favorite']);
		}

		//Quota
		if (opt.quota){
			this._create('quota','obj_progress','quota','max white');
			this.quota.__update = function(sDName,sDPath){
				if (sDPath && sDPath[0]=='MBOX_USAGE'){
					var q = dataSet.get('main',['MBOX_QUOTA']),
						u = dataSet.get('main',['MBOX_USAGE']);

					this._range(q);
					this._value(u);
					this._title(roundTo(u / q * 100, 1) + '%');
				}
			};
			this.quota._listen('main');
			addcss(this._main,'quota');
		}

		//COMMUNICATION SHORTCUTS

		// SIP
		this.__eSip = this._getAnchor('sip');
		if (opt.sip && this.__eSip){
			this.__eSip.oncontextmenu = function (e){
				if (GWOthers.getItem('SIP','mode')=='integrate' && !gui.sipalert){

					var s = dataSet.get('sip',['state']),
						aMenu = [
							{title:'STATUS::ONLINE', css:'ico ico2 sip online'+ (s == 'offline'?'':' check'), arg:[me,'__sip',['online']]},
							{title:'STATUS::OFFLINE', css:'ico ico2 sip offline'+ (s == 'offline'?' check':''), arg:[me,'__sip',['offline']]}
						];

					var	pos = getSize(this);
					me.cmenu = gui._create('cmenu','obj_context','','sip');
					me.cmenu._fill(aMenu);
					me.cmenu._place(pos.x+pos.w, pos.y+(pos.h/2), 170);

					//active class
					me.cmenu.__deactive = function(){removecss(this,'active')}.bind(this);
					me.cmenu._add_destructor('__deactive');
					addcss(this, 'active');

					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();
					if (e.preventDefault) e.preventDefault();
					return false;
				}
			};

			this.__eSip.onclick = function (){

				switch(dataSet.get('sip',['activity'])){
					case 'Ringing':	// The phone is ringing
					case 'Calling':	// You are calling someone
						return;

					case 'Phoning':	// Already talking to somebody
						if (!gui.sipalert){
							var	cmenu = gui._create('sipalert','obj_call');
								cmenu._placeElement(this._main);
						} else
							gui.sipalert._destruct();

						return;
				}

				if (gui.dial){
					if (gui.dial._docked)
						gui.dial._undock();
					else
						gui.dial._destruct();
				}
				else
					gui._create('dial','frm_dial','','');
			};

			// Add tooltip for SIP phone button
			gui.tooltip._add(this.__eSip, getLang('SIP::SIP')+' ‒ '+getLang('STATUS::OFFLINE')); //,{x: '-40', y: '+36'}

			this.__btncss['sip'] = this.__eSip.className;
			this._listen('sip');
		}
	}
};

_me._loading = function (b) {
	var elm = this._getAnchor('loader');
	if (elm)
		if (b > 0)
			addcss(elm, 'start');
		else
			removecss(elm, 'start');
};

_me._getEmails = function (bMain) {
	return this._parent && this._parent._getNew && this._parent._getNew(bMain);
};

_me.__openEvents = function (){
	// gui.frm_main.bar.tree.folders._setActive(sPrimaryAccount+'/__@@VIRTUAL@@__/__@@EVENTS@@__');
	gui.frm_main._selectView({aid:sPrimaryAccount,fid:'__@@VIRTUAL@@__/__@@EVENTS@@__'});
	//gui.frm_main.bar.tree.folders._fill();
};

_me.__hideQuota = function (){
	this.quota && this.quota._main.classList.add('hidden');
	return this;
};

_me.__hideUnread = function (){
	[].map.call(this._main.querySelectorAll('i'), function(element) {
		element.classList.add('absolute');
		element.classList.add('hidden');
	});
	return this;
};

// Called also from gui.frm_main.bar.tree.folders.btn_all
_me.__filter = function(id, bInfo, bCtrl){
	gui.frm_main.bar.tree.folders.inp_search._value('', true);
	gui.frm_main.bar.tree.folders.__filter = '';
	var oTree = gui.frm_main.bar.tree.folders,
		aActive = oTree._getActive(),
		bInfo = bInfo || false;

	// Temporary solution to ask user if upload should be cancelled
	// @todo: implement datagrid upload that does not fail when list view is changed (if list is destructed, upload should be saved correctly anyway)
	var args = arguments;
	var me = this;
	if(gui.frm_main.main && gui.frm_main.main._uploading) {
		gui._create('stop_upload','frm_confirm','','',[function(){
			gui.frm_main.main._uploading = false;
			me.__filter.apply(me,args);
		}],'ALERTS::ALERT','CONFIRMATION::STOPUPLOAD');
		return false;
	}

	if (id == 'A'){
		oTree._filter_folder();
	}
	else
	if (id == 'I'){
		oTree._filter_folder(['I','Y']);
	}
	else{
		//option 1: for one Type
		if (bCtrl && Is.Object(oTree._sFilterFolderType)){
			bInfo = false;

			if (id == 'M')
				oTree._sFilterFolderType['Q'] = oTree._sFilterFolderType['QL'] = oTree._sFilterFolderType['R'] = oTree._sFilterFolderType['M'] = oTree._sFilterFolderType['M']?false:true;
			else
				oTree._sFilterFolderType[id] = oTree._sFilterFolderType[id]?false:true;

			oTree._sFilterFolderType['G'] = (oTree._sFilterFolderType['C'] || oTree._sFilterFolderType['E'] || oTree._sFilterFolderType['J'] || oTree._sFilterFolderType['N'] || oTree._sFilterFolderType['F'] || oTree._sFilterFolderType['T'])?true:false;

			var bEmpty = true;
			for(var i in oTree._sFilterFolderType)
				if (oTree._sFilterFolderType[i]){
					bEmpty = false;
					break;
				}

			if (bEmpty){
				oTree._sFilterFolderType = {};
				addcss(this._getAnchor('A'),'active');
			}
		}
		else
		if (id == 'M')
			oTree._filter_folder(['M','R','QL','Q']);
		else
		if (id == 'E')
			oTree._filter_folder(['E']);
		else
		if (id == 'B')
			oTree._filter_folder(['B','G','QL','Q']);
		else
		if (id == 'W') {
			oTree._filter_folder(['W']);
			oTree._setActive([sPrimaryAccount + '/__@@VIRTUAL@@__/__@@MEETINGS@@__']);
		} else
			oTree._filter_folder([id]);
	}

	var bActive = false,
		aActiveFilters = [];

	for(var i in this.__aTypes)
	    if (oTree._sFilterFolderType[this.__aTypes[i]]){
			addcss(this._getAnchor(this.__aTypes[i]),'active');
			aActiveFilters.push(this.__aTypes[i]);
			bActive = true;
		}
		else
			removecss(this._getAnchor(this.__aTypes[i]),'active');

	//Jump __@@EVENTS@@__ -> Default Calendar
	if ((!oTree._sFilterFolderType['E'] || aActiveFilters.length>1) && sPrimaryAccount == aActive[0] && '__@@VIRTUAL@@__/__@@EVENTS@@__' == aActive[1]){
		gui.frm_main._selectView({aid:sPrimaryAccount,fid:Mapping.getDefaultFolderForGWType('E')},'',true);
		oTree._setActive(sPrimaryAccount+'/'+Mapping.getDefaultFolderForGWType('E'));
	}

	//Save to Cookie
	Cookie.set(['filter_tree'],aActiveFilters.join(','));

	if (!bActive){
		delete oTree._sFilterFolderType;
		oTree._fill();
	}
	else{

		//option 1: set default Folder for given Type if not already selected any with such Type
		oTree._fill();

		if ((oTree._sFilterFolderType['E'] && aActiveFilters.length==1) || (!bCtrl && (!aActive[0] || !aActive[1] || dataSet.get('folders', [aActive[0], aActive[1], 'TYPE']) != id)) || bInfo || (id == 'M' && dataSet.get('folders', [aActive[0], aActive[1], 'DEFAULT']) == 'H')) {

			if (id == 'M'){
				gui.frm_main._selectView({aid:sPrimaryAccount,fid:'INBOX'});
			}
			else
			if (id == 'W'){
				gui.frm_main._selectView({aid:sPrimaryAccount,fid:'__@@VIRTUAL@@__/__@@MEETINGS@@__'}); //, 'conference_view'
			}
			else{

				if (id == 'E'){
					if (dataSet.get('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__'])){
						this.__openEvents();
						return false;
					}
					//Create __@@EVENTS@@__ folder
					else
					if (Mapping.getDefaultFolderForGWType('E')){
						var folders = {};
							folders[Mapping.getDefaultFolderForGWType('E')] = true;

						WMFolders.add({'aid':sPrimaryAccount,'name':'__@@VIRTUAL@@__/__@@EVENTS@@__','type':'E','virtual':{folders:folders}},'folders','',[this,'__openEvents']);
						return false;
					}
				}

				if (id == 'B'){
					var trash = Path.split(GWOthers.get('DEFAULT_FOLDERS','storage')['VALUES']['trash']);
					if(dataSet.get('folders', trash)) {
						gui.frm_main._selectView({aid:sPrimaryAccount,fid:trash[1]});
					} else {
						gui.frm_main._selectView({aid:sPrimaryAccount,fid:'__@@GWTRASH@@__'});
					}
				}
				else
				if (id == 'I'){

					var aActive = Path.split(dataSet.get('active_folder'));
					if (WMFolders.getType(aActive) != 'I'){
						var last = Path.split(Cookie.get(['last','I']));
						if (last[0] == sPrimaryAccount && last[1] && WMFolders.getType([sPrimaryAccount, last[1]]) == 'I'){
							gui.frm_main._selectView({aid:sPrimaryAccount, fid:last[1]}, 'chat_view');
						}
						else{
							var f = dataSet.get('folders',[sPrimaryAccount]);
							var fid;
							for (var n in f) {
								if (f[n].TYPE == 'I') {
									fid = n;
									break;
								} else if (!fid && f[n].TYPE == 'Y') {
									fid = n;
								}
							}
							fid && gui.frm_main._selectView({aid:sPrimaryAccount,fid:fid}, 'chat_view');
						}
					}
				}
				else
				if (Mapping.getDefaultFolderForGWType(id) !== false && WMFolders.getType([sPrimaryAccount, Mapping.getDefaultFolderForGWType(id)]) == id){
					gui.frm_main._selectView({aid:sPrimaryAccount,fid:Mapping.getDefaultFolderForGWType(id)});
				}
			}
		}
	}

	//Focus Datagrid
	if (gui.frm_main && gui.frm_main.main && gui.frm_main.main.list){
		gui.frm_main.main.list._focus();
	}
};

_me.__sip = function(sStatus){
	if (sStatus == 'online'){
		if (gui.frm_main.sip)
			gui.frm_main.sip._login(function(ok){
				if(!ok)
					gui._create('alert', 'frm_alert', '', '', '', 'SIP::ERROR', 'SIP::REGISTRATION_FAILED');
			});
		else
		if (!gui.frm_main.sip)
			gui.frm_main._create('sip','obj_sip','','',function(ok){
				if(!ok)
					gui._create('alert', 'frm_alert', '', '', '', 'SIP::ERROR', 'SIP::REGISTRATION_FAILED');
			});
	}
	else
	if (gui.frm_main.sip) {
		if (gui.frm_main.sip.phone) {
			// End ongoing call
			if(gui.dial) {
				gui.frm_main.sip._hangup();
				gui.dial._destruct();
			}
			// Terminate any lingering calls
			gui.frm_main.sip.phone.terminate();
			// Unregister phone
			gui.frm_main.sip.phone.unregister();
		} else
			gui.frm_main.sip._destruct('sip','obj_sip'/*,'dock'*/);
	}
};

_me._recent = function(sAnchor, i){
	var elm = this._getAnchor(sAnchor);
	if (elm){

		elm = elm.getElementsByTagName('I');

		if (elm && (elm = elm[0])){
			if (i)
				elm.innerHTML = i;
			else
				elm.parentNode.removeChild(elm);
		}
		else
		if (i){
			elm = mkElement('I');
			elm.innerHTML = i;
			this._getAnchor(sAnchor).appendChild(elm);
		}
	}
};

_me.__update = function(sDName){
	var f, n, r, rec, b = false, allFolders, groupwareTypes, searchedTypes, i, anchor, oTree, active;

	//Recent
	switch(sDName){
		case 'folders':

			//Mail
			this._recent('M', parseInt(dataSet.get('folders',[sPrimaryAccount,'INBOX','RECENT']) || 0,10));

			if (sPrimaryAccountCHAT) {
				f = dataSet.get('folders',[sPrimaryAccount]);
				for (n in f) {
					if (f[n].TYPE == 'I' && parseInt(f[n].RECENT)) {
						r = true;
					}
				}

				removecss(this._getAnchor('I'), 'hide');
				this._recent('I', r && ' ');
			}

			// Groupware folders - show/hide which are relevant: 'E'vents, 'C'ontacts, 'F'iles, 'T'asks, 'N'otes
			allFolders = dataSet.get('folders', [sPrimaryAccount]);
			groupwareTypes = ['E', 'C', 'F', 'T', 'N'];
			searchedTypes = {'E': false, 'C': false, 'F': false, 'T': false, 'N': false};
			for (i in allFolders) {
				if (i === '__@@VIRTUAL@@__/__@@EVENTS@@__') {
					continue;
				}
				if (groupwareTypes.indexOf(allFolders[i].TYPE) !== -1) {
					searchedTypes[allFolders[i].TYPE] = true;
				}
			}
			for (i in searchedTypes) {
				anchor = this._getAnchor(i);
				if (searchedTypes[i]) {
					removecss(anchor, 'hide');
				}
				else {
					addcss(anchor, 'hide');
				}
			}

			// IM and VOIP (webrtc) are done differently
			break;

		//Active Folder
		case 'active_folder':

			oTree = gui.frm_main.bar.tree.folders;

			if (oTree && !Is.Empty(oTree._sFilterFolderType)){
				active = dataSet.get('active_folder');
				if (active){
					active = Path.split(active);
					active[2] = 'TYPE';

					if (oTree._sFilterFolderType['E'] && active[1] != '__@@VIRTUAL@@__/__@@EVENTS@@__' && count(oTree._sFilterFolderType)==1){

						//*** JAKUB CHCE ABY TO FILTROVALO NA DANY TYP ***
						if (this._getAnchor('E'))
							removecss(this._getAnchor('E'),'active');

						Cookie.set(['filter_tree'],'');
						delete oTree._sFilterFolderType;
						oTree._fill();
					}
				}
			}
			break;

		case 'sip':

			if (this.__eSip){
				var ds = dataSet.get('sip'),
					aStatus = [ds.state];

				switch(ds.activity){
					case 'Ringing':
					case 'Phoning':
					case 'Calling':

						aStatus.push('activity');

						if (this.cmenu && !this.cmenu._destructed)
							this.cmenu._destruct();

						if (!gui.sipalert){
							var	cmenu = gui._create('sipalert','obj_call');
								cmenu._placeElement(this.__eSip);
						}

						break;
				}

				if (aStatus.length){
					this.__eSip.className = this.__btncss['sip'] + ' ' + aStatus.join(' ');
					gui.tooltip._title(this.__eSip, getLang('CONTACT::PHONE')+' ‒ '+getLang('STATUS::'+(ds.state&&ds.state.toUpperCase()||'OFFLINE')));
				}
			}
	}
};

/* Drag and Drop */
_me._active_dropzone = function(v){
	//if (v && Is.Empty(this.__trgets)){
	if (v){

		if (v.type == 'item'){

			//Access Right for REMOVE Item
			var sLockID = dataSet.get('items',[v.value[0].aid, v.value[0].fid, v.value[0].iid,'EVNLOCKOWN_ID']),
				bDelete = (!sLockID || sLockID == sPrimaryAccountGWID) && WMFolders.getAccess({aid:v.value[0].aid, fid:v.value[0].fid}, 'remove');

			this.__trgets = {};

			var itmtype = WMFolders.getType(v.value[0]),
				aspan = this._getAnchor('buttons').getElementsByTagName('SPAN'),
				stype;

			if (itmtype != 'QL')
				for (var i = aspan.length-1; i>-1; i--){
					stype = aspan[i].id.substr(this._pathName.length+1);

					if (stype!= 'A' && (stype!= 'B' || bDelete))
						this.__trgets[stype] = getSize(aspan[i]);
				}
		}
		else
			this.__trgets = {'B':getSize(this._getAnchor('B'))};

		if (this.__trgets['B'])
			addcss(this._getAnchor('B'),'delete');
	}
	else
		removecss(this._getAnchor('B'),'delete');
};

_me._ondragover = function(v){
	var out = '';
	if (v.y){
		var itmtype = WMFolders.getType(v.value[0]);

		for(var i in this.__trgets){
			if (itmtype!=i && this.__trgets[i].y<v.y && this.__trgets[i].y+this.__trgets[i].h>v.y){
				out = i;
				addcss(this._getAnchor(i),'hover');
			}
			else
				removecss(this._getAnchor(i),'hover');
		}
	}

	this.__lastDrop = out;

	return out?true:false;
};

_me._ondragout = function(v){
	for(var i in this.__trgets)
		removecss(this._getAnchor(i),'hover');
};

_me._ondrop = function(v){
	if (this.__lastDrop){
		if (this.__lastDrop == 'B'){
			switch(v.type){
				case 'folder':
					var val = v.value[0];
					if (val){
						if (WMFolders.getRights(val,'remove') && !dataSet.get('folders',[val.aid,val.fid,'DEFAULT'])){
							storage.library('obj_context_folder');

							if (v.ctrl)
								window.obj_context_folder.__deleteFolder(val.aid,val.fid);
							else
								window.obj_context_folder.prototype._onclick(null,null,null,{method:'delete_folder',aid:val.aid,fid:val.fid});
						}
						else
							gui.notifier._value({type: 'alert', args: {header: '', text: 'CONTEXT_FOLDER::CANTDELETE'}});
					}
					break;

				case 'item':
					var ids = [];
					for (var i in v.value){
						if (Is.Defined(ids[0])){
							if (ids[0] == v.value[i].aid && ids[1] == v.value[i].fid)
								ids[2].push(v.value[i].iid);
						 }
						 else
						 	ids = [v.value[i].aid,v.value[i].fid,[v.value[i].iid]];
					}

					if (ids.length)
						Item.remove(ids,v.ctrl);

					break;

				case 'jabber':
					if (v.value && gui.frm_main.im && gui.frm_main.im._is_active()){
						if (v.ctrl)
							gui.frm_main.im._removeUsr(v.value);
						else
						if (v.value.length>1)
							gui.frm_main.im._oncontext('','','',{method:'user_remove'});
						else
							gui.frm_main.im._oncontext('','','',{method:'user_remove',id:v.value});
					}
					break;

				case 'favorite':
					if (v.value && v.value[0].aid && v.value[0].fid && gui.frm_main.bar.fav)
						gui.frm_main.bar.fav.__remove('','','',v.value[0]);
			}
		}
		else
		if (v.type == 'item')
			Item.__convertToFolder(sPrimaryAccount, this.__lastDrop == 'M'?'INBOX':Mapping.getDefaultFolderForGWType(this.__lastDrop), v);
	}
};
