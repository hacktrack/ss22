_me = frm_gw.prototype;
function frm_gw(){};

_me.__constructor = function(sAccountID, sFolderID, sItemID, aValues, aReccurenceValues, oResponse, bClone) {
	if (!Is.Defined(sAccountID) || !Is.Defined(sFolderID)){
		this._destruct();
		return;
	}

	var me = this;

	this._sAccountID = sAccountID;
	this._sFolderID = sFolderID;
	this._sItemID = Is.Defined(sItemID) ? sItemID : false;
	this._aReccurenceValues = aReccurenceValues;
	this._bClone = bClone || false;

	this.__refreshView = false; //Current view will be refreshed onClose

	//will be executed affter successfull save
	this.__oresponse = oResponse;

	if (Is.Object(aValues)){
		this._aValues = aValues;
	}
	// else
	// if (this._sItemID){

	// 	var aGet = {"aid": this._sAccountID, "fid": this._sFolderID, "iid": this._sItemID};
	// 	if (aReccurenceValues && Is.Defined(aReccurenceValues.EVNRCR_ID) && Is.Defined(aReccurenceValues.EVNSTARTDATE))
	// 		aGet.date = aReccurenceValues.EVNSTARTDATE;

	// 	this._aValues = WMItems.list(aGet);

	// 	if (this._aValues && this._aValues[this._sAccountID] && this._aValues[this._sAccountID][this._sFolderID]){
	// 		if (this._sFolderID == '@@mycard@@'){
    //             this._sItemID = '';

	// 			this._aValues = this._aValues[this._sAccountID][this._sFolderID];
	//             delete this._aValues['/'];
	//             delete this._aValues['$'];
	//             delete this._aValues['#'];
	//             delete this._aValues['@'];

	// 			for(var i in this._aValues)
	// 				if (Is.Object(this._aValues[i])){
	// 					this._sItemID = i;
	// 					break;
	// 				}

	// 			this._aValues = this._aValues[this._sItemID] || {};
	// 		}
	// 		else
	// 			this._aValues = this._aValues[this._sAccountID][this._sFolderID][this._sItemID];
	// 	}
	// 	else
	// 	if (this._sFolderID == '@@mycard@@'){
	// 		this._sItemID = '';
	// 		this._aValues = {LOCATIONS:[{values:{LCTEMAIL1:sPrimaryAccount,LCTTYPE:'H'}}]};
	// 	}
	// 	else
	// 		this._aValues = {};
	// }
	else
		this._aValues = {};

	this._id = [sAccountID, sFolderID];
	if (this._sItemID) this._id.push(sItemID);

	//this._repeating = Is.Object(aReccurenceValues) && Item.hasReccurence([sAccountID,sFolderID,sItemID], this._aValues['EVNRCR_ID']);
	this._repeating = Is.Object(aReccurenceValues) && this._aValues['EVNRCR_ID'] && this._aValues['EVNCLASS'] != 'O';


	//ReadOnly?
	if ((this._sFolderID == '@@mycard@@' && this._sAccountID == sPrimaryAccount && GWOthers.getItem('RESTRICTIONS', 'disable_vcardedit')>0) || (this._sItemID && !(WMFolders.getAccess({'aid':this._sAccountID,'fid':(this._aValues && this._aValues.EVNFOLDER?this._aValues.EVNFOLDER.replace(/\\/g,'/'):this._sFolderID)},'modify')) && (!this._aValues || !(this._aValues.EVNOWN_ID == sPrimaryAccountGWID || this._aValues.ITMOWN_ID == sPrimaryAccountGWID))))
		this.__readonly = true;

	// Automatic save of items if required, currently only notes
	if(this._type=='frm_note' && !this.__readonly && GWOthers.getItem('DOCUMENTS','autosave')==1 && GWOthers.getItem('DOCUMENTS','autosave_minutes')>0) {
		this.__autoSaveInterval = setInterval(function(){
			me.__storeItems(true);
		},60000*GWOthers.getItem('DOCUMENTS','autosave_minutes'));
		this._add_destructor('__end_autosave');
	}
};

_me._onclose = function (b) {
	if (b && (this._userEdited() || this.__autosaveid)){
		gui._create('frm_confirm','frm_confirm', '','', [this, '__confirmed'], 'CONFIRMATION::ARE_YOU_SURE','CONFIRMATION::ALL_CHANGES_WILL_BE_LOST');
		return false;
	}

	if (this.__refreshView){
		this._refreshListAndPreview();
	}

	return true;
};

	_me.__confirmed = function(){
		this._close();
	};

_me.__end_autosave = function() {
	if (this.__autoSaveInterval)
		clearInterval(this.__autoSaveInterval);
};

// return stringified form data
_me.__stringifyForm = function(){
	var aValues = {'values':{}};
	storeDataFromForm(this, aValues['values']);

	aValues.values[this._type == 'frm_contact' || this._type == 'frm_distrib'?'ITMSHARETYPE':'EVNSHARETYPE'] = this.X_ITMSHARETYPE._value();

	this.__saveItems(aValues);

	return JSON.stringify(aValues);
};

_me.__initForm = function(sTitle) {
	this._title(sTitle);

	this.__loadItems();
	this.__createFooter();

	// Save initial form content
	if (!this._bClone && !this._aValues.PUSH_ATTACHMENTS && (this._sItemID || Is.Empty(this._aValues)))
		this.__currentSaveState = this.__stringifyForm();
};

// Detect changes from initial state
_me._userEdited = function() {
	return (this.__currentSaveState || '').replace(/\xA0|&nbsp;/g, ' ') != (this.__stringifyForm() || '').replace(/\xA0|&nbsp;/g, ' ');
};


// Virtual function
_me.__saveItems = function(aValues) {};

// Virtual function
_me.__loadItems = function(aValues) {};

_me.__createFooter = function() {

	var me = this;

	//Share button
	if (this._sItemID && !sPrimaryAccountGUEST){

		this._create('x_btn_share', 'obj_button', 'footer', 'color1 simple x_btn_right' + (this._type === 'frm_file' ? ' select' : ''));
		this.x_btn_share._value('MAIN_MENU::SHARE');

		if (!sPrimaryAccountGUEST || me._aValues.TICKET){
			this.x_btn_share._onclick = function(e) {
				if(me._type !== 'frm_file') {
					return Item.sendAsEmail([me._sAccountID, me._sFolderID, [me._sItemID]]);
				}

				if (!this.__cmenu || this.__cmenu._destructed){
					var pos = getSize(this.__eIN),
						aMenu = [];

					if (!sPrimaryAccountGUEST)
						aMenu.push({title:'POPUP_ITEMS::SEND_AS_EMAIL', 'arg': [Item.sendAsEmail, [[me._sAccountID, me._sFolderID, [me._sItemID]]]]});

					if (me._aValues.TICKET)
						aMenu.push({title:'ITEM::PUBLIC', 'arg':[me,'_publicURL']});

					this.__cmenu = gui._create('cmenu','obj_context'),
					this.__cmenu._fill(aMenu);
					this.__cmenu._place(pos.x+pos.w/2,pos.y,'',3);

					if (e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;
					return false;
				}
			};
		}
		else
			this.x_btn_share._disabled(true);
	}

	//Print button
	if (this._type != 'frm_distrib' && this._type != 'frm_file'){

		this._create('x_btn_print', 'obj_button', 'footer','noborder transparent ico img print simple x_btn_right');
		this.x_btn_print._title('MAIN_MENU::PRINT');
		this.x_btn_print._onclick = function() {
			if (me.__print)
				me.__print(me.__readItems());
		};
	}

	//Private checkbox
	this._create('X_ITMSHARETYPE', 'obj_sharing', 'footer','toright');

	if (this._sItemID){
		this._create('x_btn_delete', 'obj_button', 'footer','noborder transparent ico img trash simple x_btn_right');
		this.x_btn_delete._title('MAIN_MENU::DELETE');

		this.x_btn_delete._onclick = function(){
			if (me._repeating)
				gui._create('frm_confirm','frm_confirm_repeating','','', [function(state){

					Item.__removeWithRepeating(state, [me._sAccountID, me._sFolderID, [me._sItemID]], me._aReccurenceValues);
					me._destruct();

					if (me.__oresponse)
						executeCallbackFunction(me.__oresponse, false);

				}],'REPEATING_CONFIRM::TITLE_DELETE','REPEATING_CONFIRM::TEXT_DELETE');
			else {
				var frm = gui._create('frm_confirm','frm_confirm', '', '', [function(){
					Item.__delete([me._sAccountID, me._sFolderID, [me._sItemID]]);
					me._destruct();

					if (me.__oresponse)
						executeCallbackFunction(me.__oresponse, false);

				}],'CONFIRMATION::DELETE_ITEM_CONFIRMATION','CONFIRMATION::DELETE_ITEM');
				frm._size(400, 180);
				frm.obj_label.__eIN.innerHTML += '<br>' + getLang('CONFIRMATION::DELETE_ITEM_TRASH');
			}
		};
	}


	if (this.__readonly){
		//Disable Buttons
		this.x_btn_ok._disabled(1);

		//Document Revisions
		if (this.x_btn_revision)
			this.x_btn_revision._disabled(1);

		if (this.x_btn_delete)
			this.x_btn_delete._disabled(1);
	}
	else{
		// This function is triggered when 'OK' button is pressed
		this.x_btn_ok._onclick = function() {

			if (this._disabled()) return;

			this._disabled(true);

			//Document revisions
			if (me._type == 'frm_file' && me._sItemID && !Is.Empty(me.X_ATTACHMENTS._value()) && GWOthers.getItem('GW_MYGROUP', 'ownautorevisionmode') != '1')
				me.__revision = true;

			if(me.__onBeforeSave)
				me.__onBeforeSave();
			// Perform save
			if (me.__storeItems())
				me.__hide();
			else
				this._disabled(false);
		};

		// Cancel button will remove autosaved item
		this.x_btn_cancel._onclick = function(e) {
			if (me.__autosaveid && GWOthers.getItem('DOCUMENTS','autosave') == 1)
				Item.__delete([me._sAccountID, me._sFolderID, [me._sItemID]]);

			me._close(true, e);
		};
	}

	this.__sharetype();
};

_me.__sharetype = function(){
	if (this.X_ITMSHARETYPE){
		if (this.__readonly){
			this.X_ITMSHARETYPE._disabled(true);
		}
		else
		if (WMFolders.getType([this._sAccountID,this._sFolderID]) == 'I'){
			this.X_ITMSHARETYPE._disabled(true);
			this.X_ITMSHARETYPE._value('U');
			this._aValues['EVNSHARETYPE'] = 'U';
			return;
		}
		else{
			//Disable share for non-owner
			this.X_ITMSHARETYPE._disabled(this._sItemID && (this._aValues.EVNOWN_ID || this._aValues.ITMOWN_ID) !== sPrimaryAccountGWID && !WMFolders.getRights({
				aid: this._sAccountID,
				fid: this._sFolderID
			}, 'owner'));
		}

		if (this._aValues['ITM_ID']){
			if (this._aValues['ITMSHARETYPE'] == 'P')
				this.X_ITMSHARETYPE.__privateValue = 'P';

			this.X_ITMSHARETYPE._value(this._aValues['ITMSHARETYPE']);
		}
		else
		if (this._aValues['EVN_ID']){
			if (this._aValues['EVNSHARETYPE'] == 'P')
				this.X_ITMSHARETYPE.__privateValue = 'P';

			this.X_ITMSHARETYPE._value(this._aValues['EVNSHARETYPE']);
		}
		else{
			var types = {
				frm_contact:'contact_sharing',
				frm_distrib:'contact_sharing',
				frm_journal:'journal_sharing',
				frm_note:'note_sharing',
				frm_file:'file_sharing',
				frm_task:'task_sharing'
			};
			types[Mapping.getFormNameByGWType('E')] = 'event_sharing';

			this.X_ITMSHARETYPE._value(GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS',types[this._type]));
		}
	}
};

_me._publicURL = function(){
	this._sItemID && Item.collaborate([this._sAccountID, this._sFolderID, [this._sItemID]]);
};

_me.__readItems = function(bFilter){
	var aValues = {'values':{}};

	for(var i in this._aValues)
		if (typeof this._aValues[i] != 'object')
			aValues.values[i] = this._aValues[i];

	storeDataFromForm(this, aValues['values']);

	if (bFilter){
		for(var key in aValues.values){
			if(!!~this.__filterOut.indexOf(key.toLowerCase())){
				delete aValues.values[key];
			}
		}
	}

	//store sharetype
	aValues.values[this._type == 'frm_contact' || this._type == 'frm_distrib'?'ITMSHARETYPE':'EVNSHARETYPE'] = this.X_ITMSHARETYPE._value();

	this.__saveItems(aValues);

	return aValues;
};
_me.__filterOut = [
	'startdate',
	'starttime',
	'timezone',
	'enddate',
	'endtime',
	'durationdays',
	'durationtime',
	'allday',
	'tzlink'
];

_me.__storeItems = function (bAuto){
	var me = this;

	if (this._userEdited() || (!bAuto && this._aValues.PUSH_ATTACHMENTS)){

		//PREPARE DATE
		var aValues = {'values':{}};
		storeDataFromForm(this, aValues['values']);
		for(var key in aValues.values){
			if(!!~this.__filterOut.indexOf(key.toLowerCase())){
				delete aValues.values[key];
			}
		}

		//store sharetype
		aValues.values[this._type == 'frm_contact' || this._type == 'frm_distrib'?'ITMSHARETYPE':'EVNSHARETYPE'] = this.X_ITMSHARETYPE._value();

		//Group Chat
		if (this._aValues.EVNCLASS)
			aValues.values.EVNCLASS = this._aValues.EVNCLASS;
		if (this._aValues.EVNCOMEVNID)
			aValues.values.EVNCOMEVNID = this._aValues.EVNCOMEVNID;

		// if (this._aValues.SKIP_INVITATION)
		// 	aValues.values.SKIP_INVITATION = this._aValues.SKIP_INVITATION;

		// Parse and add values specific to GW type
		this.__saveItems(aValues);

		// For edited calendar events let user decide if participants (if any) should be informed of changes
		var not_me_attendees = [];
		if(this._aValues.CONTACTS) {
			for(var i in this._aValues.CONTACTS) {
				if(this._aValues.CONTACTS[i].CNTEMAIL !== sPrimaryAccount) {
					not_me_attendees.push(this._aValues.CONTACTS[i]);
				}
			}
		}
		if (!bAuto && this._type == Mapping.getFormNameByGWType('E') && this._sItemID && not_me_attendees.length) {

			// Always notify others when repeated event or removed participants
			if (this._repeating || this._notify_attendees) {
				gui._create('frm_confirm','frm_confirm', '', '', [function(){
					WMItems.add(me._id, aValues, '', '','',[me,'_listFolder']);
					me.__hide();
				}],'CONFIRMATION::INFORM_ATTENDEES','CONFIRMATION::NOTIFY_OR_DISCARD');
				return false;
			}

			// For other changes let user decide if others should be informed
			gui._create('frm_confirm','frm_confirm', '', '', [function(){
				WMItems.add(me._id, aValues, '', '','',[me,'_listFolder']);
			}],'CONFIRMATION::INFORM_ATTENDEES','CONFIRMATION::SEND_EVENT_UPDATE');
			gui.frm_confirm.x_btn_cancel._value('CONFIRMATION::SUPPRESS_EVENT_UPDATE');
			gui.frm_confirm.x_btn_cancel._onclick = function() {
				aValues.values  = aValues.values || {};
				aValues.values['SKIP_INVITATION'] = 1;
				WMItems.add(me._id, aValues, '', '','',[me,'_listFolder']);
				gui.frm_confirm._destruct();
			};

			return true;
		}

		// Send server request to save item
		if (!Is.Empty(aValues))
			return WMItems.add(this._id, aValues, '', '','',[this,this._type === 'frm_file' ? '_openFileAndListFolder' : '_listFolder',[bAuto]],bAuto);
		else
			this.__currentSaveState = this.__stringifyForm();
	}
	else
	if (!bAuto){

		//Call response for already Autosaved item (do not work for FILE)
		if (this.__autosaveid){
			this._listFolder(true,{},false);
		}
		else
			this._close();
	}
};

_me._listFolder = function (bOk,oData,bAuto){
	if (!bOk){
		switch(oData) {
			case 'item_create':
				var me = this;

				var frm = gui._create('create_default', 'frm_confirm', '', '', [
					function() {
						me._id[1] = me._sFolderID = Mapping.getDefaultFolderForGWType(WMFolders.getType([me._sAccountID, me._sFolderID]));
						me._id[0] = me._sAccountID = sPrimaryAccount;
						me.x_btn_ok._onclick();
					}
				], 'ALERTS::FOLDER_INSUFFICIENT_RIGHTS', 'ERROR::ITEM_CREATE');

				frm.x_btn_cancel._onclick = function () {
					frm._destruct();
					me.__stored = true;
					me._close();
				};
				break;
		}
		this.__show();
		this.x_btn_ok._disabled(false);
		return;
	}

	if (!this._destructed){
		this.__currentSaveState = this.__stringifyForm();

		//Item was not stored but error was handled
		if (bOk == 2){
			this.__stored = true;
			this._close();
			return;
		}

		// Automatic saving when enabled
		if(bAuto && oData.id) {
			if(this._id.length==2) {
				this._sItemID = oData.id;
				this._id.push(oData.id);
				this.__autosaveid = true;
			}
			return;
		}
	}

	var aPath = Path.split(dataSet.get('active_folder'));
	if (gui.frm_main.main && aPath[0] == this._sAccountID && aPath[1] == this._sFolderID){
		this._refreshListAndPreview();
	}

	this.__stored = true;
	this._close();

	if (gui.notifier)
		gui.notifier._value({type: 'item_saved', args: [this._sAccountID, this._sFolderID, this._sItemID]});

	if (this.__oresponse)
		executeCallbackFunction(this.__oresponse,bOk,oData);

	//Document Revision
	if (this.__revision)
		gui._create('revision', 'frm_revision','','',{aid:this._sAccountID,fid:this._sFolderID,iid:this._sItemID},true);

	//Notification
	if (gui.socket){
		var f = dataSet.get('folders',[this._sAccountID, this._sFolderID]);
		if (f){

			var aOut = {
				'ACTION': this._sItemID?'edit':'add',
				'TYPE':'item',
				'ITEM': oData.id,
				'FOLDER':f.RELATIVE_PATH,
				'FOLDER-TYPE':f.TYPE,
				'EMAIL':sPrimaryAccount,
				'NAME':dataSet.get('main',['fullname']) || dataSet.get('main', ['user']),
				'ITEM-TYPE': this._aValues.EVNCLASS || f.TYPE,
				'owner': this._pathName
			};

			gui.socket.api._notify(aOut);
		}
	}

	return false;
};

_me._refreshListAndPreview = function() {

	Item.__refreshView([this._sAccountID,this._sFolderID, this._sItemID], !!this._sItemID || this.__refreshView);

	/*
	// Refresh List
	var aView = Cookie.get(['views',this._sAccountID,this._sFolderID]);
	try{
		switch(aView.view){
			case 'list':
			case 'list_view':
			case 'list_wide':
				if (gui.frm_main.main.list)
					gui.frm_main.main.list._serverSort({aid:this._sAccountID,fid:this._sFolderID},aView['sort']['column'],aView['sort']['type']);
			break;

			case 'day_view':
			case 'week_view':
			case 'workweek_view':
			case 'month_view':
				if (gui.frm_main.main._serverSort)
					gui.frm_main.main._serverSort();
		}
	}
	catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

	// Refresh Preview
	if (this._sItemID && gui.frm_main.main.itemview && dataSet.get('preview',[this._sAccountID,this._sFolderID,this._sItemID])){
		dataSet.remove('preview','',true);
		Item.open([this._sAccountID,this._sFolderID,this._sItemID]);
	}
	*/
};
