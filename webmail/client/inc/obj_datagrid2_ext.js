_me = obj_datagrid2_ext.prototype;
function obj_datagrid2_ext(){};

//////////// Drag & Drop ////////////////////

/**
 * start drag&drop action
 *
 * Note: selected data (rows) are in this.__valueData and also in global dataSet
 *
 * @param {string} id - selected ID; in this.__value there is an array of selected IDs
 * @param {number} x
 * @param {number} y
 */
_me.__initdrag = function(id, x, y) {
	//Check if ID is already in selection, if not make new one
	if (inArray(this.__value, id) < 0) {
		this._value([id]);
	}

	//prepare data
	var
		out = [], // used by gui.frm_main.dnd.create_drag()
		aHtml = [],
		f = this._getFolder(),
		sType = WMFolders.getType(f),
		aRights = WMFolders.getAccess(f),
		data, rowData, i, j, ds;

	for (i in this.__valueData) {
		data = this.__valueData[i];
		if (!data) {
			continue;
		}

		// update data from dataSet - e.g. when drag&drop currently renamed document
		rowData = data.data;
		ds = dataSet.get('items', [f.aid, f.fid, i]);
		for (j in ds) {
			rowData[j] = ds[j];
		}

		// prepare "out" array for drag&drop action (data)
		out.push(typeof data == 'object' && data.arg ? data.arg : {id: id});

		//prepare html for drag&drop (visualization)
		if (aHtml.length < 5) {
			// some description of types is at least in webmail/server/inc/webmailiqfolders.php
			switch(sType) {
				case 'Q':
				case 'M':
					aHtml.push('<tr><th>' + this.__getEscapedString(rowData.SUBJECT) + '</th><td>' + (rowData.DATE ? IcewarpDate.unix(rowData.DATE).format('L LT') : '') + '</td><td>&nbsp;' + (rowData.SIZE ? parseFileSize(rowData.SIZE) : '') + '</td></tr>');
					break;
				case 'J':
				case 'E':
					aHtml.push('<tr><th>' + this.__getEscapedString(rowData.EVNTITLE) + '</th><td>' + this.__getEscapedArrayString(rowData.EVENT_STARTDATE) +'</td><td>-</td><td>' + this.__getEscapedArrayString(rowData.EVENT_ENDDATE) + '</td></tr>');
					break;
				case 'N':
					aHtml.push('<tr><th>' + this.__getEscapedString(rowData.EVNTITLE) + '</th>');
					break;
				case 'T':
					aHtml.push('<tr><th>' + this.__getEscapedString(rowData.EVNTITLE) + '</th><td>' + this.__getEscapedArrayString(rowData.TASK_ENDDATE) + '</td></tr>');
					break;
				case 'C':
					aHtml.push('<tr><th>' + this.__getEscapedString(rowData.ITMCLASSIFYAS) + '</th><td>' + this.__getEscapedString(rowData.CONTACT_EMAIL) + '</td></tr>');
					break;
				case 'F':
					aHtml.push('<tr><th>' + this.__getEscapedString(rowData.EVNTITLE) + '</th><td>' + this.__getEscapedArrayString([rowData.EVNFILESIZE[0].replace(/<p.*p>/, '')]) + '</td></tr>');
					break;
				default:
					// empty
					break;
			}
		}
		else if (aHtml.length === 5) {
			aHtml.push('<tr><td colspan="10" style="text-align: left">…</td></tr>');
		}
	}

	//create Drag box
	if (aHtml.length > 0) {
		gui.frm_main.dnd.create_drag(
			'<table class="tbl_datagrid_' + sType + '">' + aHtml.join('') + '</table>',
			{type: this.__dragtype, value: out, select_all: this._select_all && !this._SQLsearch}, x, y, !aRights.remove
		);
	}
};

/**
 * returns html safe string from given string
 *
 * @param {string} value
 * @return {string} html safe string
 */
_me.__getEscapedString = function(value) {
	value = value && typeof value === 'string' ? value : '';
	return value.escapeHTML();
};

/**
 * returns html safe string from given array
 *
 * @param {array} array
 * @return {string} html safe string
 */
_me.__getEscapedArrayString = function(array) {
	var value = array && typeof array === 'object' && typeof array[0] === 'string' ? array[0] : '';
	return value.escapeHTML();
};


//////////// EVENTs ////////////////////


_me._onchange = function(ids) {

	// Update top menu according to selected items
	if (gui.frm_main.hmenu3)
		gui.frm_main.hmenu3._contextRefill(ids);

	var aFolder = this._getFolder();
	gui.__exeEvent('itemSelected', [aFolder.aid, aFolder.fid].concat(ids.length?[ids]:[]));

	// Auto Preview Item
	if (this.__cursortimer){
		window.clearTimeout(this.__cursortimer);
		delete this.__cursortimer;
	}

	var v = this._value();
	if (v.length == 1){
		this.__cursortimer = window.setTimeout(function(){
			try{
				if (this.__value[0]){
					var data = this._aData[this.__value[0]];
					if (data){
						var arg = data.arg || {};

						if (this._onclick)
							this._onclick({type:'click',button:1},null,arg,this.__value[this.__value.length-1],null,[]);

						this.__exeEvent('onclick',null,{"arg":arg,"id":data.id,"owner":this});
					}
				}
			}catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er)}
		}.bind(this), GWOthers.getItem('LAYOUT_SETTINGS', 'PREVIEW_DELAY'));
	}
};

// Handle double click on items
_me._ondblclick = function(e,elm,arg){

	if (!elm){
		if (arg && arg['aid'] && arg['fid']){
			var aValues;
			switch(dataSet.get('folders',[arg['aid'],arg['fid'],'TYPE'])){
				case 'E':
				   	aValues = getActualEventTime();
				case 'C':
				case 'L':
				case 'T':
				case 'J':
				case 'F':
				case 'N':
					if (WMFolders.getAccess(arg,'write'))
						Item.createInFolder(arg['aid'],arg['fid'],aValues);
				break;
				case 'M':
					var aOpt = {alias:Item.getAliasFromPath(arg['aid'] +'/'+ arg['fid'])};
					if (arg['aid'] +'/'+ arg['fid'] == GWOthers.getItem('DEFAULT_FOLDERS','templates'))
						aOpt.template = true;

					NewMessage.compose(aOpt);
					break;

				case 'QL':
					gui._create('frm_blackwhite', 'frm_blackwhite', '', '', arg['aid'], arg['fid']);
			}
		}
		return;
	}

	var sType = dataSet.get('folders',[arg['aid'],arg['fid'],'TYPE']);
	if (sType == 'C' && dataSet.get('items',[arg['aid'],arg['fid'],arg['iid'],'ITMCLASS']) == 'L')
		sType = 'L';

	if (sType == 'G')
    	Item.recover([arg['aid'],arg['fid'],[arg['iid']]],true);
	else
	if (sType == 'M' || sType == 'Q') {

		if (GWOthers.getItem('DEFAULT_FOLDERS', 'drafts') == arg['aid']+'/'+arg['fid'])
			OldMessage.edit([arg['aid'], arg['fid'], arg['iid']]);
		else if(GWOthers.getItem('DEFAULT_FOLDERS', 'templates') == arg['aid']+'/'+arg['fid'])
			NewMessage.compose(new OldMessage([arg['aid'], arg['fid'], arg['iid']]));
		else{

			//Prev|Next
			var aSortInfo = clone(this.__filter);
				aSortInfo.offset = this.__limit[0];
				aSortInfo.limit = this.__limit[1];

			if (this.__small)
				aSortInfo.row = Math.ceil(parseInt(elm.parentNode.style.top || elm.style.top,10)/this._row_height)-this.__offset;
			else
				aSortInfo.row = Math.ceil(parseInt(elm.style.top,10)/this._row_height)-this.__offset;

			OldMessage.openwindow([arg['aid'], arg['fid'], arg['iid']], aSortInfo);
		}
	}
	else
	if (sType == 'F'){

			var sName = dataSet.get('items',[arg['aid'],arg['fid'],arg['iid'],'EVNTITLE']);
			var ext = Path.extension(sName).toLowerCase();

			//Open file when possible
			switch(ext){
			case 'txt':
			case 'htm':
			case 'html':
				Item.editFile([arg['aid'], arg['fid'], arg['iid']]);
				break;

			case 'pdf':
				if (GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') == 1 || currentBrowser().match(/^MSIE([6-9]|10)$/))
					Item.downloadFile([arg['aid'], arg['fid'], arg['iid']]);
				else
					Item.openPDF([arg['aid'], arg['fid'], arg['iid']]);
				break;

			case 'mp3':
				Item.playFile([arg['aid'], arg['fid'], arg['iid']]);
				break;

			default:
				// Open documents in browser or application if possible
				if (sName && Item.officeSupport(sName)){ //dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) === "true" &&
					var folder = dataSet.get('folders', [arg.aid, arg.fid.split('/')[0]]);
					Item.officeOpen(arg,[Item.downloadFile,[[arg['aid'], arg['fid'], arg['iid']]]],ext);
				}
				else
					Item.downloadFile([arg['aid'], arg['fid'], arg['iid']]);
			}
	}
	else
	if (sType != 'QL')
		Item.openwindow([arg['aid'],arg['fid'],arg['iid']],'','',sType);
};

// Handle right click context menu on item
_me._oncontext = function(e,elm,arg,sLineId,sColumn){
	var sType;

	//Klikly jsme na místo bez položek?
	if (!arg || !arg['iid']){
		var aItems = dataSet.get('items');

		for(var sAccId in aItems)
			for(var sFolId in aItems[sAccId])
			    break;

		var arg = {'aid':sAccId,'fid':sFolId};

		if ((sType = dataSet.get('folders',[arg['aid'],arg['fid'],'TYPE']))){
			gui._create("cmenu","obj_context_item",'','',this);
			gui.cmenu._fillGeneralMenu(sType,arg);
		}
		else
			return;
	}
	else
	if ((sType = dataSet.get('folders',[arg['aid'],arg['fid'],'TYPE']))){
		var aSelected = this._value(),
			bDisableOpen = false;

		if (sType == 'C' && dataSet.get('items',[arg['aid'],arg['fid'],arg['iid'],'ITMCLASS']) == 'L')
			sType = 'L';

		if (inArray(aSelected,arg['iid']) >= 0 && aSelected.length > 1)
			bDisableOpen = true;

		if (inArray(aSelected,arg['iid']) < 0){
			aSelected = [arg['iid']];
			this._value(aSelected);
		}

		arg.data = dataSet.get('items',[arg['aid'],arg['fid'],arg['iid']]);
		gui._create("cmenu","obj_context_item",'','',this)._fillMenu(sType,arg,aSelected,bDisableOpen,false,sColumn);
	}
	else
		return;

	gui.cmenu._place(e.clientX,e.clientY);
};

_me._onclick = function(e,elm,arg,line,column,aClickType)
{
	if (inArray(aClickType,'SHIFT') > -1 || inArray(aClickType,'CTRL') > -1)
		return;

	var sType = dataSet.get('folders',[arg['aid'],arg['fid'],'TYPE']);
	if (sType == 'C' && dataSet.get('items',[arg['aid'],arg['fid'],arg['iid'],'ITMCLASS']) == 'L')
		sType = 'L';

	var aAccess = WMFolders.getAccess(arg);

	if (column == 'DELETE' && aAccess.modify) {
		this.__deleteItems(arg,[arg['iid']]);
		return false;
	}

	switch (sType) {
		case 'T':
			if (column == 'CHECK') {
				if (aAccess.modify){
					var stat = 'M';
					if (dataSet.get('items',[arg['aid'],arg['fid'],arg['iid'],'EVNSTATUS'])=='M')
						stat = 'B';

					var me = this;
					dataSet.add('items', [arg['aid'], arg['fid'], arg['iid'], 'EVNSTATUS'], stat);
					WMItems.add([arg['aid'], arg['fid'], arg['iid']], {'values': {'EVNSTATUS': stat}},'','','',[function(){ if (me && !me.__destructed) me._serverSort();}]);
				}
				break;
			}

		case 'F':
			if (column == 'LOCK' && aAccess.modify) {
				var aRights = WMFolders.getRights(arg),
					lockID = dataSet.get('items',[arg['aid'],arg['fid'],arg['iid'],'EVNLOCKOWN_ID']);

				if (!lockID || lockID == sPrimaryAccountGWID || aRights.owner){
					dataSet.add('items', [arg['aid'], arg['fid'], arg['iid'], 'EVNLOCKOWN_ID'], (lockID?'':sPrimaryAccountGWID));
					Item.set_lock([arg['aid'],arg['fid'],arg['iid']], (lockID?false:true), true);
				}
				break;
			}

		case 'C':
		case 'L':
		case 'E':
		case 'J':
		case 'N':
		case 'G':

			//Execute Edit dialog on Enter
			if ((gui.frm_main && gui.frm_main.main && gui.frm_main.main.itemview) || (e.type == 'keydown' && e.keyCode == 13))
				Item.open([arg['aid'],arg['fid'],arg['iid']]);

			break;

		case 'Q':
		case 'M':
			if (column == 'COLOR' && aAccess.modify) {
				var id = [arg['aid'],arg['fid'],arg['iid']];
				var sColor = OldMessage.getColor(id);

				if (!sColor || sColor == Item.COLORS.COMPLETE || sColor == Item.COLORS.CLEAR) {
					storage.library('gw_others');
					var sDefaultColor = GWOthers.getItem('MAIL_SETTINGS_GENERAL','default_flag');

					OldMessage.setColor(id, sDefaultColor);
				}
				else
					OldMessage.setColor(id, Item.COLORS.COMPLETE);

				return false;
			}

			if (column === null && e.ctrlKey)
				OldMessage.openwindow([arg['aid'], arg['fid'], arg['iid']]);
			else{
				dataSet.add('active_items',[arg['aid'],arg['fid']],arg['iid']);

				if (gui.frm_main.main.mailview){
					OldMessage.open([arg['aid'], arg['fid'], arg['iid']], false, e instanceof Event);
				}
				else
				if (e.type == 'keydown' && e.keyCode == 13){

					//Prev|Next
					var aSortInfo,elm,
						column = column || this.__sortColumn;

					if (Is.Defined(column) && (elm = this.__getElement([line,column]))){
						aSortInfo = clone(this.__filter);
						aSortInfo.row = Math.ceil(parseInt(elm.style.top,10)/this._row_height)-this.__offset;
					}

					OldMessage.openwindow([arg['aid'], arg['fid'], arg['iid']], aSortInfo);
				}
			}

			break;
	}
};

_me._onkeydown = function(e){
	// nacte vybrane radky
	var value = this._value();
	if (Is.Empty(value)) return;

	//ziska sFolId a sAccId
	var aFolder = this._getFolder(),
		sAccId = aFolder.aid,
		sFolId = aFolder.fid,
		sType = dataSet.get('folders',[sAccId,sFolId,'TYPE']);

	//numbers as Flags
	if ((e.keyCode>95 && e.keyCode<106) || (e.keyCode==107 || e.keyCode==109)){
		var color;
		if (e.keyCode==107)
			color = 'COMPLETE';
		else
		if (e.keyCode==109)
			color = 'CLEAR';
		else{
			if (sType == 'M')
				var colors = ['RED','BLUE','GREEN','ORANGE','PURPLE','YELLOW'];
			else
			if (sType == 'N')
				var colors = ['BLUE','GREEN','RED','','GREY','YELLOW'];
			else
				var colors = ['RED','BLUE','GREEN','GREY','ORANGE','CYAN','BROWN','PURPLE','LIGHT_BLUE','YELLOW'];

			if(!(color = colors[e.keyCode-96])) return;
		}

		for(var i in value)
			if (sType == 'M')
				OldMessage.setColor([sAccId,sFolId,value[i]], Item.COLORS[color]);
			else
			if (WMFolders.getAccess({aid:sAccId,fid:sFolId},'modify'))
				Item.setColor([sAccId,sFolId,value[i]], Item.COLORS[color]);
	}
	else
	if (!e.ctrlKey)
	switch(e.keyCode){
	case 82:
		//r - Reply or Reply All
	    if (sType=='M') {
			OldMessage.reply([sAccId,sFolId,value[0]],e.shiftKey);
			e.preventDefault();
		}
		break;
	case 70:
		//f - Forward or FW as attachment
	    if (sType=='M')
			OldMessage.forward([sAccId,sFolId,value[0]],e.shiftKey);
		break;
	case 78: //n - New
	    if (sType=='M'){
			var aOpt = {alias:Item.getAliasFromPath(sAccId +'/'+ sFolId)};
			if (sAccId +'/'+ sFolId == GWOthers.getItem('DEFAULT_FOLDERS','templates'))
				aOpt.template = true;

			NewMessage.compose(aOpt);
		}
	    break;
	case 67: //c - Copy
		Item.copy([sAccId,sFolId,value]);
	    break;
	case 77: //m - Move
 		if (sType!='M' && !WMFolders.getAccess({aid:sAccId,fid:sFolId},'remove')) break;
		Item.move([sAccId,sFolId,value]);
	    break;
	case 69: //e - Read
	    if (sType=='M')
			for(var i in value)
				OldMessage.markAsRead([sAccId,sFolId,value]);
		break;
	case 85: //u - Unread
	    if (sType=='M')
			for(var i in value)
				OldMessage.markAsUnread([sAccId,sFolId,value]);
	    break;
	case 46: //delete
        this.__deleteItems(aFolder,value,e.shiftKey);
	}
};

_me.__deleteItems = function(aFolder,value,shiftKey,oRepeating){

		var sType = WMFolders.getType(aFolder);
		if (sType!='Q' && sType!='QL' && !WMFolders.getAccess(aFolder,'remove')){
			gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::DELETE_ITEM'}});
			return;
		}
		if (sType === 'G' && dataSet.get('main',['keep_deleted_items_force_expiration'])) {
			return;
		}

		var pos = 0, v = clone(value), act = v.pop(), tmp = [], b;

		for(var i in this._aData){
			b = false;
			for(j in v){
				if (v[j] == i){
				    b = true;
				    break;
				}
			}

			if (!b){
				if (act == i)
				    pos = tmp.length;

				tmp.push(i);
			}
		}

		tmp.splice(pos,1);

		var iNext;
		if (typeof tmp[pos] == 'undefined'){
			if (pos>0)
                iNext = tmp[--pos];
		    else
		    if (typeof tmp[pos+1] == 'undefined')
                iNext = tmp[pos];
		    else
                iNext = tmp[++pos];
		}
		else
            iNext = tmp[pos];

        Item.remove([aFolder.aid,aFolder.fid,value],shiftKey,oRepeating,this,iNext);
};
