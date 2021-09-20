_me = frm_editor.prototype;
function frm_editor(){};

_me.__constructor = function(){

	this._title('FILE::FILE');
	this._defaultSize(-1,-1,600,400);

	//BUTTONS
	this.x_btn_ok._disabled(true);
	this.x_btn_ok._value('FORM_BUTTONS::SAVE');
	this.x_btn_ok._onclick = function() {
		this._disabled(true);
		this._parent._onsave();
	};

	//this.x_btn_cancel._disabled(true);
	this.x_btn_cancel._onclick = function() {
		if (this._parent._onclose(true))
			this._parent._destruct();
	};

    // Create 'Print' button
	this._create('x_btn_print', 'obj_button', 'footer', 'ico img print noborder transparent simple x_btn_right');
	this.x_btn_print._disabled(true);
	this.x_btn_print._title('MAIN_MENU::PRINT');
	this.x_btn_print._onclick = function() {
		gui.printer._print(this._parent.inp._value(), this._parent.inp._type == 'obj_text');
	};

};

_me._loadContent = function(filename, content) {
	this._title(filename, true);

	switch(Path.extension(filename).toLowerCase()){
		case 'txt':
			this._create('inp','obj_text','main','obj_text100 noborder');
			break;

		case 'htm':
		case 'html':
			this._create('inp','obj_wysiwyg');
			this.inp.__insert_image = true;
			break;

		default:
			this._destruct();
			return;
	}

	this.inp._value(content, void 0, void 0, function () {
		this.__inpdata = this.inp._value();
	}.bind(this));

	this.inp._readonly(true);

	this.x_btn_ok._disabled(false);
	this.x_btn_ok._value('FORM_BUTTONS::CLOSE');
	this.x_btn_ok._onclick = function() {
		this._destruct();
	}.bind(this);

	this.x_btn_cancel._destruct();

	this.x_btn_print._disabled(false);
};

_me._load = function(id){
	if (Is.Array(id)){
		this.__id = id;

		//Preloader
		this._create('preloader','obj_loader');
		this.preloader._value('Loading');

		//Get Item
		WMItems.list({"aid": id[0], "fid": id[1], "iid": id[2], "values":['DATA','EVNTITLE','EVNLOCKOWN_ID']},'','','',[this,'__response']);
	}
};

_me.__response = function(aData){
	var me = this;

	if (aData && (aData = aData[this.__id[0]]) &&  (aData = aData[this.__id[1]]) && (aData = aData[this.__id[2]]) && aData.EVNTITLE){

		//Remove Preloder
		if (this.preloader)
			this.preloader._destruct();

		this.__aData = aData;

		//Decide Item Type
		switch(Path.extension(aData.EVNTITLE).toLowerCase()){
		case 'txt':
			this._create('inp','obj_text','main','obj_text100 noborder');
			break;

		case 'htm':
		case 'html':
			this._create('inp','obj_wysiwyg');
			this.inp.__insert_image = true;
			break;

		default:
			this._destruct();
			return;
		}

		//lock file if unlocked
		if (!aData.EVNLOCKOWN_ID)
			Item.set_lock(this.__id, true, true, [this,'__unlock_on_destruct']);

		//Fill Values
		this._title(aData.EVNTITLE, true);

		this.inp._value(aData.DATA || '', void 0, void 0, function () {
			this.__inpdata = this.__currentSaveState = this.inp._value();
		}.bind(this));

		if (aData.EVNLOCKOWN_ID && aData.EVNLOCKOWN_ID !== sPrimaryAccountGWID){
			this.__readonly(true);
		}
		else{
			this.x_btn_ok._disabled(false);

			// Initiate autosave
			if(!this.__autoSaveInterval && GWOthers.getItem('DOCUMENTS','autosave')==1 && GWOthers.getItem('DOCUMENTS','autosave_minutes')>0) {
				this.__autoSaveInterval = setInterval(function(){
					me._onsave(true);
				},60000*GWOthers.getItem('DOCUMENTS','autosave_minutes'));
				this._add_destructor('__end_autosave');
			}
		}

		//INPUT
		this.inp._focus();

		this.x_btn_print._disabled(false);
	}
	else
		this._destruct();
};

_me.__readonly = function(b){
	if (b){
		//disable inputs
		this.x_btn_ok._disabled(true);
		this.inp._readonly(true);

		//bind notifier
		gui.socket && gui.socket.api._obeyEvent('onnotify', [this, '__notify']);
		this._add_destructor('__socket_destructor');

		//show info panel
		this._draw('frm_editor_info', 'header', {
			unlock:true,
			name:getLang('DOCUMENT::NAME_IS_EDITING_THIS_DOCUMENT', [dataSet.get('xmpp', ['roster', this.__aData.EVNLOCKOWN_EMAIL, 'name']) || this.__aData.EVNLOCKOWN_EMAIL]),
			src:getAvatarURL(this.__aData.EVNLOCKOWN_EMAIL)
		});

		this._getAnchor('header').querySelector('div.button').onclick = function(){
			this.__unlock_request();
		}.bind(this);

		this.__onCreateChild(null,null,'header');
	}
	else{
		//show refresh-info panel
		this._draw('frm_editor_info', 'header');
		this._getAnchor('header').querySelector('div.button').onclick = function(){
			this._destruct();
			gui._create(this._name, 'frm_editor')._load(this.__id);
		}.bind(this);
	}
};

	_me.__notify = function(aData){

		if ((aData.ACTION !== 'unlock') || this._destructed)
			return;

		var aFolder = dataSet.get('folders',[this.__id[0],this.__id[1]]),
			rp = Path.slash(aData.FOLDER);

		if ((aFolder.RELATIVE_PATH === rp || this.__id[1] === rp) && aData.ITEM === WMItems.__serverID(this.__id[2]))
			this.__readonly(false);
	};

	_me.__socket_destructor = function(){
		gui.socket && gui.socket.api._disobeyEvent('onnotify', [this, '__notify']);
	};

	_me.__unlock_request = function () {
		TeamChatAPI.requestUnlock (this.__id[1], this.__aData.EVNTITLE, this.__aData.EVNLOCKOWN_EMAIL);
	};


_me.__end_autosave = function() {
	if(this.__autoSaveInterval) {
		clearInterval(this.__autoSaveInterval);
	}
};

_me.__unlock_on_destruct = function() {
	this._add_destructor('__unlock');
};

_me.__unlock = function(){
	Item.set_lock(this.__id, false, true);
};

_me._onsave = function(bAuto){
	if (this.__id){
		// Hide editor if it's not autosave
		if(!bAuto)
			this.__hide();

		this.__inpdata = this.inp._value();

		// Skip autosave if there is no change
		if(bAuto && this.__inpdata==this.__currentSaveState)
			return false;
		else
			this.__currentSaveState = this.__inpdata;

		// Save document
		WMItems.add(this.__id,{values:{DATA:this.__inpdata}},'','','',[this,'__saved',[bAuto]],bAuto);
	}
};

_me.__saved = function(bOK, aData, bAuto){
	// If autosaved no more action
	if(bAuto)
		return false;

	// Close window and update view if successfully saved
	if (bOK){

		var aItems = dataSet.get('items');
		for(var sAccId in aItems)
			for(var sFolId in aItems[sAccId])
				break;

		if (sAccId == this.__id[0] && sFolId == this.__id[1]) {
			try{
				Item.__refreshView(this.__id,true);
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}
		}

		this._destruct();

		if (gui.notifier)
			gui.notifier._value({type: 'item_saved'});

		//Revisions
		if (this.__id && WMFolders.getType(this.__id) == 'F' && GWOthers.getItem('GW_MYGROUP', 'ownautorevisionmode') != '1')
			gui._create('revision', 'frm_revision','','',{aid:this.__id[0],fid:this.__id[1],iid:this.__id[2]},true);
	}
	else{
		this.__show();

		this.x_btn_ok._disabled(false);
		this.x_btn_ok._focus();
	}
};

_me._onclose = function(bHandle){
	if (!this.x_btn_ok._disabled() && bHandle && this.inp && this.__inpdata!=this.inp._value()){

		if (this.cdialog && !this.cdialog._destructed)
			this.cdialog._focus();
		else{
			var me = this;

			me.cdialog = gui._create('frm_confirm','frm_confirm_threestates', '','', [function(bOK){ if (bOK) me._onsave(); else me._destruct(); }], 'CONFIRMATION::SAVE','CONFIRMATION::SAVE_FILE', '','CONFIRMATION::SAVE','FORM_BUTTONS::CANCEL','CONFIRMATION::DISCARD');
			addcss(me.cdialog.x_btn_ok._main,'color1');

			me.cdialog.x_btn_cancel._onclick = function() {
				this._parent._destruct();
				me.inp._focus();
			};

			addcss(me.cdialog.x_btn_cancel2._main,'trash color2 x_btn_right');
			me.cdialog.x_btn_cancel2._onclick = function() {
				me._destruct();
			};
		}

		return false;
	}
	else
		return true;
};

_me._onfocus = function(){
	if (this.inp)
		this.inp._focus();
};
