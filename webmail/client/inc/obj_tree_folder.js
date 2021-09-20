_me = obj_tree_folder.prototype;
function obj_tree_folder(){};

/**
 * @date: 6.7.2006 16:28:30
 **/

_me.__constructor = function(sFilterAccountId, sFilterFolderType, sFilterRights, bSkipVirtual)
{
	var me = this;

	if (sFilterAccountId)
		this._filter_account(sFilterAccountId);

	if (sFilterFolderType)
		this._filter_folder(sFilterFolderType);

	if (sFilterRights)
		this._filter_rights(sFilterRights);

	if (bSkipVirtual)
		this._sFilterVirtual = true;

	/* Prepare data & create dataset if doesn't exist */
	var aAccounts = {};
	if (!(aAccounts = dataSet.get('accounts'))){
		aAccounts = accounts.list();
		dataSet.add('accounts',null,aAccounts);
	}

	if (!dataSet.get('folders')){
		var aFolders = {};
		for (var sAccId in aAccounts) {
			aFolders[sAccId] = WMFolders.list({"aid": sAccId})[sAccId];
		}
		dataSet.add('folders', null, aFolders);
	}

	this._listen_data('folders');

	//Drag and Drop
	this._main.onmousedown = function(e){

		if (me.__dndtimer){
			window.clearTimeout(me.__dndtimer);
			delete me.__dndtimer;
		}

		//Edit mode
		if (me.rename) return;

		var e = e || window.event;
		if (e.button>1 || e.ctrlKey || !me.__initdrag) return;
		var elm = e.target || e.srcElement;

		if (elm == this) return;
		if (elm.tagName != 'LI')
			elm = Is.Child(elm,'LI');

		if (!elm || !elm.id) return;

		var tmp = (elm.id.substring(me._pathName.length+1)).split('/');

		//Account
		if (tmp.length<2) return true;	//Check type, (QL...)

		var id = [{aid:tmp.splice(0,1)[0],fid:tmp.join('/')}],
			sType = WMFolders.getType(id[0]),
			sDragType = 'folder';

		//Forbidden folders
		if (!sType || sType == 'A')
			return true;
		else
		if (id[0].aid == sPrimaryAccount && id[0].fid.indexOf('__@@VIRTUAL@@__/')==0)
			sDragType = 'virtual_folder';

		//fire the event :)
		var x = e.clientX, y = e.clientY;

		gui._obeyEvent('mouseup',[me,'__dndDispatch']);
		me.__dndtimer = setTimeout(function(){
			me.__initdrag(id,sType,x,y,sDragType);
		},500);

		if (e.stopPropagation) e.stopPropagation();
		e.cancelBubble = true;
		//if (e.preventDefault) e.preventDefault();
		//return false;
	};

	//Registr Drop
	this.___lastdragover = '';
	if (gui.frm_main && gui.frm_main.dnd)
		gui.frm_main.dnd.registr_drop(this,['item','folder']);
};

_me.__dndDispatch = function(){
	if (this.__dndtimer){
		window.clearTimeout(this.__dndtimer);
		delete this.__dndtimer;
	}
	return false; // for _disobeyEvent
};

_me._filter = function (aData){
	var aData2 = {},
		aOpen = [];

	for(var sDomain in aData){
		var aTmp = aData[sDomain],
			aKey = [],
			sName;

		for(var i in aTmp)
			aKey.push(i);
		aKey.sort();

		for(var sLast = '',i = aKey.length-1;i>=0;i--){

			if (aKey[i] == sLast)
				sLast = aKey[i].indexOf('/')>-1?aKey[i].substr(0,aKey[i].lastIndexOf('/')):aKey[i];
			else{
				if ((!aTmp[aKey[i]].NAME && aKey[i].toLowerCase().indexOf(this.__filter)>-1) ||	(aTmp[aKey[i]].NAME && aTmp[aKey[i]].NAME.toLowerCase().indexOf(this.__filter)>-1))
					sLast = aKey[i].indexOf('/')>-1?aKey[i].substr(0,aKey[i].lastIndexOf('/')):aKey[i];
				else{
					aKey.splice(i,1);
					continue;
				}
			}

			if ((sName = aTmp[aKey[i]].NAME?aTmp[aKey[i]].NAME:Path.basename(aKey[i])) && sName.toLowerCase().indexOf(this.__filter)>-1)
				aOpen.push(sDomain + (sLast?'/' + sLast:''));
		}

		if (aKey.length){
			aData2[sDomain] = {};
			for(var i in aTmp)
				if (inArray(aKey,i)>-1)
					aData2[sDomain][i] = aTmp[i];
		}
	}
	return {aData:aData2, aOpen:aOpen};
};

_me._filter_account = function (sFilterAccountId){
	this.sFilterAccountId = sFilterAccountId;
};
_me._filter_folder = function (sFilterFolderType){
	this._sFilterFolderType = {};

	if (typeof sFilterFolderType == 'object')
	    for(var i in sFilterFolderType)
	    	this._sFilterFolderType[sFilterFolderType[i]] = true;
    else
    if (sFilterFolderType)
    	this._sFilterFolderType[sFilterFolderType] = true;

    //filter css for icons
	if (Is.Empty(this._sFilterFolderType))
		removecss(this._main,'filter');
	else
		addcss(this._main,'filter');
};

// Do not show public folders
_me._filter_public = function(bFilterPublic) {
	this._bFilterPublic = !!bFilterPublic;
};

_me._filter_rights = function (sFilterRights){
	this._sFilterRights = [];

	if (sFilterRights)
		this._sFilterRights = sFilterRights.split('');
};

_me._filter_rights_or = function (sFilterRightsOr){
	this._sFilterRightsOr = [];

	if (sFilterRightsOr)
		this._sFilterRightsOr = sFilterRightsOr.split('');
};

_me._listen_cookie = function(sCookieName)
{
	this._treeCookie = sCookieName;

	var aCookieValue = Cookie.get([sCookieName]);
	if (!Is.Array(aCookieValue) || !aCookieValue.length)
	    aCookieValue = [sPrimaryAccount];

	this._value(aCookieValue);
};

/**
 * Drag & Drop
 **/
_me.__initdrag = function(id,sType,x,y,sDragType){

	//disable drag if rename state
	if (this.rename)
		return false;

	if ((!sDragType || sDragType == 'folder') && WMFolders.getType(id[0]) == 'Y')
		return false;

	//prepare data
	var aName = id[0].fid.split('/'),
		sBody = '<div class="drag_folder drag_folder_'+sType+'">'+ aName[aName.length-1] +'</div>';

	//create Drag box
	gui.frm_main.dnd.create_drag(sBody, {type:sDragType || 'folder',value:id}, x, y);
};

_me.__mousewheel = function(e){
	this.__eBody.scrollTop += e.delta*20;
};

_me._active_dropzone = function(v){

	this.__aDragFolders = [];

	if(v){

		//Opened Nodes
		var val = {} ,tmp = this._value();
		for (var i in tmp)
			val[tmp[i]] = 1;

		//Opened Nodes by Search
		if (this.__filter && this.__filterOpen)
			for (var i in this.__filterOpen)
				val[this.__filterOpen[i]] = 1;

		switch(v['type']){
		case 'item':

			var itmtype = WMFolders.getType(v.value[0]);

			var getTargets = function (data, out){
				out = out || [];
				if (typeof data != 'object') return out;

				var i, sPath, bActive;
				for(i in data){

					bActive = false;
					sPath = data[i].arg.aid+(data[i].arg.fid?'/'+data[i].arg.fid:'');

					if (data[i].arg){
						if ((itmtype == 'M' || itmtype == 'P') && data[i].arg.ftype == 'QL' && (data[i].arg.aid != v.value[0].aid || data[i].arg.fid != v.value[0].fid))
							bActive = true;
						else
	 					if ((itmtype == 'M' || itmtype == 'P' || data[i].arg.ftype != 'M') && WMFolders.getAccess({aid:data[i].arg.aid,fid:data[i].arg.fid},'write') && (data[i].arg.fid != v.value[0].fid || data[i].arg.aid != v.value[0].aid))
							bActive = true;
					}

					out.push([sPath, bActive]);
					if (data[i].nodes && val[sPath])
						getTargets(data[i].nodes, out);
				}
				return out;
			};

			this.__aDragFolders = getTargets(this.__aFillData);
			break;

		case 'folder':

			var sType = WMFolders.getType(v.value[0]);

			if (!this.__aFillData[v.value[0].aid] || !this.__aFillData[v.value[0].aid].nodes ||	!WMFolders.getRights(v.value[0],'remove') || sType == 'QL' || sType == 'I' || sType == 'Y')
				break;

			var getTargets = function (data, out){

                if (typeof data != 'object') return out;

                var i, sPath, bActive;
				for(i in data){

					bActive = false;
                	sPath = data[i].arg.aid+'/'+data[i].arg.fid;

					if (data[i].arg.ftype != 'QL'){

						if ((data[i].arg.ftype != 'X' || data[i].arg['public']) && v.value[0].aid+'/'+v.value[0].fid != sPath && WMFolders.getAccess({aid:v.value[0].aid,fid:data[i].arg.fid},'write'))
							bActive = true;

						out.push([sPath, bActive]);

						if (data[i].nodes && val[sPath])
							getTargets(data[i].nodes, out);
					}
				}

                return out;
			};

			this.__aDragFolders = getTargets(this.__aFillData[v.value[0].aid].nodes, [[v.value[0].aid,true]]);
			break;

		default:
			return;
		}

		addcss(this._main,'active_drop');
		this.__objPos = getSize(this.__eBody);
	}
	else{
		removecss(this._main,'active_drop');
		this._ondragout();
	}
};

_me.__dragscroll = function(){
	if (this.__objPos){
		var delta;
		if (((delta = gui.__Y - this.__objPos.y)<51 && (delta -= 50)) || ((delta = gui.__Y - this.__objPos.y - this.__objPos.h)>-51 && (delta += 50)))
			this.__eBody.scrollTop += Math.floor(delta/10);
	}
};

_me._ondragover = function(v){
	var me = this;

	//obey scroll
	if (!this.__dragON){
		this.__dragON = true;

		gui._obeyEvent('mousewheel',[this,'__mousewheel']);

		this.__dragscrollloop = window.setInterval(function(){
			if (me.__objPos){
				var delta;
				if (((delta = gui.__Y - me.__objPos.y)<51 && (delta -= 50)) || ((delta = gui.__Y - me.__objPos.y - me.__objPos.h)>-51 && (delta += 50)))
					me.__eBody.scrollTop += Math.floor(delta/4);
			}
		},100);
	}

	var a,size,elm,bOK = false, bFound = false;

	if (this.__aDragFolders){
		for (var i=0;i<this.__aDragFolders.length;i++){

			if (!(elm = document.getElementById(this._pathName+'/'+this.__aDragFolders[i][0])))
	      		continue;

			size = getSize(elm);

			if (v.y>=size.y && v.y<=size.y+elm.firstChild.offsetHeight){

				bOK = this.__aDragFolders[i][1];

				if ((a = elm.firstChild.getElementsByTagName('B')[0])){

					bFound = true;

			        if (!this.___lastdragover || this.___lastdragover[1] != this.__aDragFolders[i][0]){

						if (this.___lastdragover)
							removecss(this.___lastdragover[0],'dragover');

						addcss(a,'dragover');
						this.___lastdragover = [a,this.__aDragFolders[i][0]];

						//Kill Auto-Open
						if (this.__dragopentimer)
							if (this.__dragopentimer[1] != this.__aDragFolders[i][0]){
								window.clearTimeout(this.__dragopentimer[0]);
								this.__dragopentimer = '';
							}
							else
								break;

						if (hascss(elm,'plus')){
							this.__dragopentimer = [
								window.setTimeout(function(){
									if (me.__dragopentimer){
										me._open(me.__dragopentimer[1]);
										me._active_dropzone(v);
									}
								},800),
								me.__aDragFolders[i][0]
							];
						}
			        }
				}

				break;
			}
			/*
			else
			if (size.y+25>v.y)
				break;
			*/
		}

		if (!bFound && this.___lastdragover){
			removecss(this.___lastdragover[0],'dragover');
			this.___lastdragover = '';
		}
	}

	a = null;
	elm = null;

	return bOK;
};

_me._ondragout = function(v){

	//disobey scroll
	gui._disobeyEvent('mousewheel',[this,'__mousewheel']);
	this.__dragON = false;

	if (this.__dragscrollloop){
		window.clearInterval(this.__dragscrollloop);
		this.__dragscrollloop = '';
	}

	if (this.__dragopentimer){
		window.clearTimeout(this.__dragopentimer[0]);
		this.__dragopentimer = '';
	}

	if (this.___lastdragover){
		removecss(this.___lastdragover[0],'dragover');
		this.___lastdragover = '';
	}
};

_me._ondrop = function(v){

	//disobey scroll
	gui._disobeyEvent('mousewheel',[this,'__mousewheel']);
	this.__dragON = false;

	var size,elm,id = '';
	for (var i=0;i<this.__aDragFolders.length;i++){
		if (!this.__aDragFolders[i][1] || !(elm = document.getElementById(this._pathName+'/'+this.__aDragFolders[i][0])))
			continue;

		size = getSize(elm);

		if (v.y>=size.y && v.y<=size.y + elm.firstChild.offsetHeight){
			id = this.__aDragFolders[i][0];
			break;
		}
	}

	if (!id) return false;

	var pos = id.indexOf('/'),
		fol = '',
		acc = id;

	if (pos>-1){
		fol = id.substr(pos+1);
		acc = id.substr(0,pos);
	}

	switch(v.type){
	case 'folder':
/*
		var aActive = this._getActive();
		if (aActive[0] == v.value[0].aid && aActive[1] == v.value[0].fid)
			this._invalidateActive();
*/
		//Drag & Drop doesnt work with popups because of event handlers.
		gui.frm_main.dnd.remove_drag(true);

		if (fol && dataSet.get('folders',[v.value[0].aid, v.value[0].fid,'DEFAULT'])){
			gui._create('move','frm_confirm','','',[function(){
				//WMFolders.add({'aid':v.value[0].aid,'fid':v.value[0].fid,'name':(fol?fol + '/':'') + Path.basename(v.value[0].fid)},'folders');
				storage.library('obj_context_folder');
				obj_context_folder.__moveFolder(v.value[0].aid, v.value[0].fid, (fol?fol + '/':'') + Path.basename(v.value[0].fid));

			}], 'POPUP_FOLDERS::MOVE_FOLDER', 'POPUP_FOLDERS::MOVE_DEFAULT');
		}
		else{
			//WMFolders.add({'aid':v.value[0].aid,'fid':v.value[0].fid,'name':(fol?fol + '/':'') + Path.basename(v.value[0].fid)},'folders');
			storage.library('obj_context_folder');
			obj_context_folder.__moveFolder(v.value[0].aid, v.value[0].fid, (fol?fol + '/':'') + Path.basename(v.value[0].fid));
		}

		break;

	case 'item':
		//Drag & Drop doesnt work with popups because of event handlers.
		gui.frm_main.dnd.remove_drag(true);
		if (!fol) return;
        Item.__convertToFolder(acc,fol,v);
	}
};

_me.__getGroup = function (group) {
	return Object.keys(dataSet.get('folders', [sPrimaryAccount])).filter(function (folder) {
		return ~folder.indexOf(group);
	}).map(function(folder){
		return dataSet.get('folders', [sPrimaryAccount, folder]);
	});
};

_me.__prepare_data = function(aData)
{
	var aResult = {},
		aFrame,aSplitFolder,aParcSplitFolder,sFolder,sFolderType,
		sTotal,bRecent,iCount,sIconClass,sMainClass,sLiClass,bDisabled,aAccounts = {},aAccounts_tmp = dataSet.get('accounts',null, true),group=0;


	for(var i in aData)
		if (!aAccounts_tmp[i])
			aAccounts_tmp[i] = {};

	//SORT
	var srt = [];
	for(var i in aAccounts_tmp)
		if (i!=sPrimaryAccount)
			srt.push(i);

	srt = srt.sort();

	if (!this.sFilterAccountId || this.sFilterAccountId == sPrimaryAccount)
		aAccounts[sPrimaryAccount] = aAccounts_tmp[sPrimaryAccount];

	for(var i = 0;i<srt.length;i++)
		aAccounts[srt[i]] = aAccounts_tmp[srt[i]];
	aAccounts_tmp = null;

	//get common folders
	storage.library('wm_folders');
	var sSpamPath = dataSet.get('main',['spam_path']),
		sArchivePath = dataSet.get('main',['archive_path']),
		aDFolders = GWOthers.get('DEFAULT_FOLDERS','storage')['VALUES'],
		aCalendars = false,
		aActive = this._getActive();

	if (aActive[0] == sPrimaryAccount && aActive[1] == '__@@VIRTUAL@@__/__@@EVENTS@@__'){
		aCalendars = dataSet.get('folders',[aActive[0],aActive[1],'VIRTUAL','FOLDERS'],true) || {};
		for (var i in aCalendars) {
			aCalendars[i] = [aCalendars[i],getCalendarColor(i)];
			if (aCalendars[i][0]){
				this.__currentVirtualFolder = i;

				//Always show primary calendar folder
				var id, a = i.split("/");
				do{
					a.pop();
					if ((id = a.join("/")))
						this._open(sPrimaryAccount + '/' + id, 'minus');
				}
				while(a.length>0);
			}
		}
	}

	//Procházíme jednotlivé accounts
	for(var sAccId in aAccounts)
	{
		//ACCOUNT filter
		if (this.sFilterAccountId && sAccId != this.sFilterAccountId)
			continue;

		if (aAccounts[sAccId]['DESCRIPTION'])
			aResult[sAccId] = {"nodes":{},"arg":{"aid":sAccId},"text":aAccounts[sAccId]['DESCRIPTION']};
		else
			aResult[sAccId] = {"nodes":{},"arg":{"aid":sAccId}};

		if (sAccId == sPrimaryAccount){
			aResult[sAccId].text = dataSet.get('main',['fullname']);
			aResult[sAccId].ico = 'ico_home';
		}



		//Procházíme jednotlivé folders
		var sLastPublic = '';
		for(var sFolId in aData[sAccId]){
			//VIRTUAL filter
			if ((aCalendars || this._sFilterVirtual) && sAccId == sPrimaryAccount && sFolId.indexOf('__@@VIRTUAL@@__/') == 0)
				continue;

			//__@@EVENTS@@__ filter
			if (sAccId == sPrimaryAccount && sFolId == '__@@VIRTUAL@@__/__@@EVENTS@@__')
				continue;

			if(this._bFilterPublic) {
				if(aData[sAccId][sFolId]['PUBLIC']) {
					sLastPublic = sFolId;
					continue;
				}
				else if(sLastPublic && sFolId.indexOf(sLastPublic)===0) {
					continue;
				}
			}

			//TYPE filter
			if (this._sFilterFolderType){
				if (aData[sAccId][sFolId]['TYPE'] == 'M' && aData[sAccId][sFolId]['RSS'] && !this._sFilterFolderType['R'])
					continue;
				else if (this._sFilterFolderType['B'] && aData[sAccId][sFolId]['TYPE'] == 'M' && aData[sAccId][sFolId]['DEFAULT']=='H'){

				}else if (!this._sFilterFolderType[aData[sAccId][sFolId]['TYPE']]){
					continue;
				}
			}
			//Hide Group Chat folders in all filters except Y
			if ((aData[sAccId][sFolId]['TYPE'] == 'Y' ||  aData[sAccId][sFolId]['TYPE'] == 'I') && this._sFilterFolderType && !this._sFilterFolderType['Y'])
				continue;

			//RIGHTS filter (regExp.test() doesnt work properly in loop)
			if (this._sFilterRights){
				var bSkip = false,
					sRights = Cookie.get(['rights',sAccId,sFolId]).join('');

				if (sRights.length){
					for (var r in this._sFilterRights)
						if (sRights.indexOf(this._sFilterRights[r])<0){
							bSkip = true;
							break;
						}

					if (bSkip)
						continue;
				}
			}

			if (this._sFilterRightsOr){
				var bSkip = true,
					sRights = Cookie.get(['rights',sAccId,sFolId]).join('');

				for (var r in this._sFilterRightsOr)
					if (sRights.indexOf(this._sFilterRightsOr[r])>-1){
						bSkip = false;
						break;
					}

				if (bSkip)
					continue;
			}

			aSplitFolder = sFolId.split("/");
			aParcSplitFolder = [];
			aFrame = aResult[sAccId]["nodes"];

			//Procházíme cestu folderu
			for(var i in aSplitFolder)
			{
				aParcSplitFolder.push(aSplitFolder[i]);
				sFolder = aParcSplitFolder.join('/');
				sMainClass = '';
				sLiClass = '';
				group = 0;

				//Nemáme uzel ještě nastavený
				if (typeof aFrame[aSplitFolder[i]] != 'object' || (aFrame[aSplitFolder[i]].arg && aFrame[aSplitFolder[i]].arg.disabled)){

					//Máme uzel definovaný ve vstupních datech
					if (aData[sAccId][sFolder] && (sFolderType = aData[sAccId][sFolder]['TYPE'])){
						if (sFolderType === 'I' && (!aData[sAccId][sFolder].SYNC || aData[sAccId][sFolder].SYNC === '0')) {
							continue;
						}

						//hide all groupchat parent folders
						if (this._sFilterFolderType && this._sFilterFolderType['Y'] && this._sFilterFolderType['I'] && count(this._sFilterFolderType) == 2) {
							if (!this._sFilterFolderType[sFolderType])
								sLiClass = 'skip';

							//Rename root Groupchat folder
							if (aData[sAccId][sFolder]['TYPE'] == 'Y') {

								//Do not rename artificial Y folders (Private Rooms)
								if (aData[sAccId][sFolder]['OWNER'])
									aData[sAccId][sFolder]['NAME'] = aSplitFolder[i - 1];

								group = this.__getGroup(aSplitFolder[i - 1]).filter(function(folder){
									return folder.TYPE === 'I';
								}).reduce(function (previous, current) {
									return previous + (current.RECENT || 0)*1;
								}, 0);
								sLiClass = 'menu';
							}
						}

						if (aData[sAccId][sFolder]['TYPE'] === 'X' && dataSet.get('active_folder',['TYPE']) === 'I') {
							group = this.__getGroup(sFolder).filter(function (folder) {
								return folder.TYPE === 'I';
							}).reduce(function (previous, current) {
								return previous + (current.RECENT || 0) * 1;
							}, 0);
						}

						bDisabled = (sFolder != sFolId) || sFolderType == 'VA' || sFolderType == 'Y';
						bRecent = aData[sAccId][sFolder]['RECENT'] > 0 ? true : false;
						sTotal = bRecent ? '&#8234;' + aData[sAccId][sFolder]['RECENT'] : '';
						iCount = +(aData[sAccId][sFolder]['COUNT'] || 0);
						sMainClass = bRecent ? 'recent' : '';
						bRecent && (sLiClass+=' unread ');

						if (sFolderType == 'G')
							sIconClass = 'ico_gwtrash';
						else
						switch (sAccId + '/' + sFolId){
							case (sAccId+'/INBOX') : sIconClass = 'ico_inbox'; break;
							case aDFolders.trash: sIconClass = 'ico_trash'; break;
							case aDFolders.sent: sIconClass = 'ico_sent'; break;
							case aDFolders.drafts: sIconClass = 'ico_drafts'; break;

							case sSpamPath: sIconClass = 'ico_spam'; break;
							case sArchivePath: sIconClass = 'ico_archive'; break;

							case (sAccId+'/Quarantine') : sIconClass = 'ico_quarantine'; break;
							case (sAccId+'/SPAM_QUEUE/Blacklist') :	sIconClass = 'ico_black'; break;
							case (sAccId+'/SPAM_QUEUE/Whitelist') : sIconClass = 'ico_white'; break;
							default:
								if (aData[sAccId][sFolder].RSS)
									sIconClass = 'ico_r';
								else
								if ((sFolderType=='M' || sFolderType=='X') && sFolId.indexOf(sPrimaryAccountSPREFIX)==0 && sFolId.indexOf('@')>0 && sFolId.indexOf('/')<0)
									sIconClass = 'ico_a';
								else
								if (aData[sAccId][sFolder].PUBLIC)
									sIconClass = 'ico_shared';
								else{

									sIconClass = sFolderType?'ico_' + sFolderType.toLowerCase():'';
									//icons also for folders inside Archive  && sFolId.indexOf(sArchivePath) == 0
									if (sArchivePath && (sAccId +'/'+sFolId).indexOf(sArchivePath+'/')==0){
										switch (sAccId + '/' + (sAccId+'/'+sFolId).replace(sArchivePath+'/','')){
                                            case sAccId+'/Inbox': sIconClass = 'ico_inbox'; break;
											case aDFolders.trash: sIconClass = 'ico_trash'; break;
											case aDFolders.sent: sIconClass = 'ico_sent'; break;
											case aDFolders.drafts: sIconClass = 'ico_drafts'; break;
										}
                                    }
                                    else
									switch(sAccId + '/' + sFolId){
										case aDFolders.contacts:
										case aDFolders.events:
										case aDFolders.notes:
										case aDFolders.journal:
										case aDFolders.files:
											sMainClass+=' default';
									}

									if (sFolderType == 'E' && aCalendars){
										sIconClass = 'color';
										sTotal = '';

										if (aCalendars[sFolId]){
											sLiClass = aCalendars[sFolId][0]?'active':'';
											sIconClass += ' checked' + (aCalendars[sFolId][1]?' '+aCalendars[sFolId][1]:'');
										}
									}
  								}
						}

						if (sFolder != sFolId){
							sIconClass += ' ico_x';
							var folder_dataset = dataSet.get('folders', [sAccId, sFolder]) || {};
							var write = ~(folder_dataset.RIGHTS || '').indexOf('k');
							if(folder_dataset.TYPE === 'Y') {
								write = write || ~(dataSet.get('folders', [sAccId, sFolder.replace('/TeamChat', ''), 'RIGHTS']) || '').indexOf('k');
							}
							if (!write) {
								sIconClass += ' no-write ';
							}
						}

						//copy nodes, order can be messed up because of Default folders
						aFrame[aSplitFolder[i]] = {"nodes": (aFrame[aSplitFolder[i]] && aFrame[aSplitFolder[i]].nodes ? aFrame[aSplitFolder[i]].nodes : {}), "arg": {"aid": sAccId, "fid": sFolder, "ftype": sFolderType, "disabled": bDisabled, "public": aData[sAccId][sFolId].PUBLIC, "spam": aData[sAccId][sFolId].SPAM === 'true'}, "title2": iCount || sTotal, "ico": sIconClass, "itmclass": sMainClass, "liclass": sLiClass, group: group};

						if (aData[sAccId][sFolder]['NAME'])
							aFrame[aSplitFolder[i]]['text'] = aData[sAccId][sFolder]['NAME'];
					}
					else
					if (sFolder == 'SPAM_QUEUE')
						aFrame[aSplitFolder[i]] = {"nodes":(aFrame[aSplitFolder[i]] && aFrame[aSplitFolder[i]].nodes?aFrame[aSplitFolder[i]].nodes:{}),"arg":{"aid":sAccId,"fid":sFolder,"ftype":"X","disabled":"true"},"title":'COMMON_FOLDERS::SPAM_QUEUE',"title2":'',"itmclass":sMainClass,"ico":'ico_spamqueue'};
					else
					if (sFolder == '__@@VIRTUAL@@__')
						aFrame[aSplitFolder[i]] = {"nodes":(aFrame[aSplitFolder[i]] && aFrame[aSplitFolder[i]].nodes?aFrame[aSplitFolder[i]].nodes:{}),"arg":{"aid":sAccId,"fid":sFolder,"ftype":"X"},"title":'COMMON_FOLDERS::VIRTUAL-FOLDERS',"title2":'',"itmclass":sMainClass,"ico":'ico_virtual'};
					else
						aFrame[aSplitFolder[i]] = {"nodes":(aFrame[aSplitFolder[i]] && aFrame[aSplitFolder[i]].nodes?aFrame[aSplitFolder[i]].nodes:{}),"arg":{"aid":sAccId,"fid":sFolder,"ftype":"X","disabled":"true"},"title2":'',"itmclass":sMainClass,"ico":'ico_x'};
				}
				else
				// folder has been marked as disabled, because it was added as a parent of another folder
				// now - when this folder should really be added, disabled flag should be removed
				if (sFolder == sFolId && aData[sAccId][sFolder])
					aFrame[aSplitFolder[i]]["arg"]["disabled"] = false;

				aFrame = aFrame[aSplitFolder[i]]["nodes"];
			}
		}

		if (this._sFilterFolderType && Is.Empty(aResult[sAccId]['nodes']) && sAccId != sPrimaryAccount) delete aResult[sAccId];
	}

//console.warn(aResult);

	return aResult;
};