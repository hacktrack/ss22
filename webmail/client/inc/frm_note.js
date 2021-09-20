_me = frm_note.prototype;
function frm_note(){};

_me.__constructor = function() {
	var me = this;

	this._defaultSize(-1,-1,800,600);

	storage.library('purify.wrapper', 'purify');

	this._draw('frm_note', 'main');

	msiebox(this.maintab.tab1._getAnchor('msiebox'));

	//HTML Mode switcher
	this.maintab.tab1.NOTE_TEXT.select._fillLang({'enabled': "COMPOSE::HTML", 'disabled': "COMPOSE::TEXT", 'code':'RICH::CODE'});

	// Keyboard esc from rich text area to close window
	this.maintab.tab1.NOTE_TEXT._onesc = function() {
		me._close(true);
	};

	//Add DropZone
	this.maintab.tab2.X_ATTACHMENTS.file._dropzone(this.__eContainer);
	this.maintab.tab2.X_ATTACHMENTS._onuploadstart = function (){
		this._parent._active();
		me.x_btn_ok._disabled(true);
	};
	this.maintab.tab2.X_ATTACHMENTS._onuploadend = function(){
		me.x_btn_ok._disabled(false);
	};

	if(!WMFolders.getAccess([this._sAccountID, this._sFolderID, this._sItemID]).remove) {
		this.x_btn_delete && this.x_btn_delete._disabled(1);
	}

	// Refresh list and preview in case tags were changed
	this.maintab.tab1.EVNTYPE.input._onChange = function(){
		this.__refreshView = true;
	}.bind(this);

	setTimeout(function() {
		this.__initForm('NOTE::NOTE');
	}.bind(this), 5);
};

_me.__confirmed = function(){
	if (this.__autosaveid)
		Item.__delete([this._sAccountID, this._sFolderID, [this._sItemID]]);

	this._close();
};

_me.__print = function(aValues){

	if (aValues.NOTES)
		aValues.values.NOTE_TEXT = aValues.NOTES[0].values.NOTE_TEXT;

	aValues = aValues.values;

	if ('text/html' === aValues.EVNDESCFORMAT) {
		aValues.NOTE_TEXT = DOMPurify.sanitize(aValues.NOTE_TEXT);
	}

	if (!gui.print)
		gui._create('print','frm_print');

	gui.print._add('N', aValues);
};

_me.__loadItems = function() {

	var me = this,
		tab1 = this.maintab.tab1;

	if (gui._rtl || !this._aValues || !this._aValues.EVNDESCFORMAT || this._aValues.EVNDESCFORMAT.toLowerCase() != 'text/plain')
		tab1.NOTE_TEXT.select._value('enabled');
	else
		tab1.NOTE_TEXT.select._value('disabled');

	loadDataIntoForm(tab1,this._aValues);

	// Check file name for forbidden chars
	tab1.EVNTITLE._restrict(/\S+/);
	tab1.EVNTITLE._onerror = function(bError) {
		me.x_btn_ok._disabled(bError);
	};
	this.x_btn_ok._disabled(!tab1.EVNTITLE._validate());

	//Copy note name into window title
	tab1.EVNTITLE._onkeyup = function(){
		var sTitle = this._value();
		if (sTitle){
			if (sTitle.length>32)
			    sTitle = sTitle.substr(0,32)+'...';

			me._title(sTitle + (me._aValues.EVNFOLDER?' - '+me._aValues.EVNFOLDER:''),true);
		}
		else
			me._title(getLang('NOTE::NOTE') + (me._aValues.EVNFOLDER?' - '+me._aValues.EVNFOLDER:''),true);
	};
	tab1.EVNTITLE._onkeyup();

	//Fill NOTE_TEXT (because it is stored as addon)
	if (this._aValues)
		try{
			this.maintab.tab1.NOTE_TEXT._value(this._aValues.NOTES[0].values.NOTE_TEXT || '');
		}
		catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er);}



	// TAB4 (attachments)
	if (this.maintab.tab2)
	this.maintab.tab2._onactive = function (bFirstTime) {
		if (bFirstTime){
			if (me._aValues['ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['ATTACHMENTS'])
					out.push({
						'name': me._aValues['ATTACHMENTS'][i]['values']['ATTDESC'],
						'class': me._aValues['ATTACHMENTS'][i]['values']['ATTTYPE'],
						'id': i,
						'ticket': me._aValues['ATTACHMENTS'][i]['values']['TICKET'],
						'fullpath': me._aValues.fullpath,
						'size': me._aValues['ATTACHMENTS'][i]['values']['ATTSIZE']}
						);

				if (me._aValues.fullpath)
					this.X_ATTACHMENTS._value({'values': out});
				else
					this.X_ATTACHMENTS._value({'path': me._sAccountID+'/'+me._sFolderID+'/'+WMItems.__serverID(me._sItemID), 'values': out});
			}
			else
			if (me._aValues['PUSH_ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['PUSH_ATTACHMENTS'])
					out.push({
						'name': me._aValues['PUSH_ATTACHMENTS'][i]['title'],
						'id': me._aValues['PUSH_ATTACHMENTS'][i]['id'],
						'size': me._aValues['PUSH_ATTACHMENTS'][i]['size'],
						'class': me._aValues['PUSH_ATTACHMENTS'][i]['embedded'] ? 'item' : 'itemlink',
						'fullpath': me._aValues['PUSH_ATTACHMENTS'][i]['fullpath']
					});

				this.X_ATTACHMENTS._value({
					path:me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].substr(0,me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].lastIndexOf('/')),
					values:out
				});
			}
		}
	}

	if (me._aValues['PUSH_ATTACHMENTS'] && this.maintab.tab2)
		this.maintab.tab2._active();
};

_me.__saveItems = function(aValues) {
	var addon;
	if (this.maintab.tab2 && this.maintab.tab2.X_ATTACHMENTS && !Is.Empty(addon = this.maintab.tab2.X_ATTACHMENTS._value()))
		aValues['ATTACHMENTS'] = addon;

	//Save NOTE_TEXT (because it is stored as addon)
	aValues.values.EVNDESCFORMAT = this.maintab.tab1.NOTE_TEXT.select._value() == 'disabled'?'text/plain':'text/html';

	this.maintab.tab1.NOTE_TEXT.__output_format = aValues.values.EVNDESCFORMAT !== 'text/plain';

	aValues['NOTES'] = [{values:{NOTE_TEXT:this.maintab.tab1.NOTE_TEXT._value()}}];
	if (!aValues.values.EVNTITLE){
		if(aValues.values.NOTE_TEXT && aValues.values.NOTE_TEXT.removeTags()) {
			aValues.values.EVNTITLE = aValues.values.NOTE_TEXT.substr(0, 2048).removeTags().trim();
			if (aValues.values.EVNTITLE.length>128)
				aValues.values.EVNTITLE = aValues.values.EVNTITLE.substr(0, 128) + '...';
		} else {
			aValues.values.EVNTITLE = getLang('NOTE::NEW');
		}
	}

	delete aValues.values.NOTE_TEXT;
};
