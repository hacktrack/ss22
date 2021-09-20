_me = frm_add_folder.prototype;
function frm_add_folder(){};

/**
 * @brief   Form for adding folder.
 * Form has three input objects:
 *    - text input for name of the folder (folder must
 *    match this regular expr. /^ *[a-zA-Z0-9#\.\_\-]+[ a-zA-Z0-9#\.\_\-]*$/).
 *    - select box for folder type specification (mail, contact, event, journal, note, task).
 *    - folder three.
 * 'OK' button is active only if the name of the folder match the regular expr. above.
 *
 * @param[in]  sAccountID  [string] Only folders from this account will be listed because of
 * moving folders between accounts is disabled.
 * @param[in]  sFolderID   [string] Optional. Forder with this ID will be preselected.
 *
 * @see  objects/frm_add_folder.xml
 * @see  inc/frm_add_folder.js
 */
_me.__constructor = function(sAccountID, sFolderID, aHandler, bOneAccount){
	this._modal(true);

	var me = this;

	if (!Is.Defined(sAccountID)) return;

	this._title('FORM_FOLDERS::CREATE_NEW_FOLDER');
	this._size(300,500,true);

	// Create formular from template
	this._draw('frm_add_folder', 'main');
	this.input_name._restrict('![/\\\\:\?\"\<\>\|\~]+','','^.{1,255}$');

	this.x_btn_ok._disabled(true);
	this.x_btn_ok._tabIndex();
	this.x_btn_cancel._tabIndex();

	function test (){
		var isError = !me.input_name.__check();
		me.x_btn_ok._disabled(isError);
	};

	this.select_type._onchange = function(){
		test();
	};
	this.input_name._onerror = function(){
		test();
	};
	this.input_name._onsubmit = function(){
		test();
		if (!me.x_btn_ok._disabled())
			me.x_btn_ok._onclick();
	};

	// If current is virtual events, check which last used
	if (sFolderID == '__@@VIRTUAL@@__/__@@EVENTS@@__'){
		var aCalendars = dataSet.get('folders',[sPrimaryAccount,'__@@VIRTUAL@@__/__@@EVENTS@@__','VIRTUAL','FOLDERS'],true) || {};
		for (var i in aCalendars) {
			if (aCalendars[i][0]){
				sFolderID = i;
				break;
			}
		}
	}

	this.tree_folder._filter_rights('kl');

	// Set type of the items to be filetered
	if (bOneAccount) {
		this.tree_folder.sFilterAccountId = sAccountID;
	}

	this.tree_folder._fill();

	// Preselect combo with parent type as default
	var sDefaultType = 'M';
	if (sFolderID && (sDefaultType = WMFolders.getType([sAccountID,sFolderID])) && WMFolders.getRights([sAccountID, sFolderID],'write')){
		if (sDefaultType == 'Y' || sDefaultType == 'I'){
			this.tree_folder._disabled(true);

			if (sDefaultType == 'I')
				sFolderID = Path.basedir(sFolderID);
			else
				sDefaultType = 'I';
		}
		else
		if (sDefaultType == 'M' && dataSet.get('folders',[sAccountID,sFolderID,'RSS']))
			sDefaultType = 'R';
	}
	else
	if (gui.frm_main.bar.tree.folders){

		sFolderID = '';	//pre-select primary account

		var aFilter = gui.frm_main.bar.tree.folders._sFilterFolderType || [];
		if (aFilter['E'])
			sDefaultType = 'E';
		else
		if (aFilter['C'])
			sDefaultType = 'C';
		else
		if (aFilter['F'])
			sDefaultType = 'F';
		else
		if (aFilter['T'])
			sDefaultType = 'T';
		else
		if (aFilter['N'])
			sDefaultType = 'N';
	}

 	// Preselect folder
	if (!this.tree_folder._setActive(sAccountID + (sFolderID?'/'+sFolderID : '')))
		this.tree_folder._setActive(sAccountID);

	//Fill TYPE option
	if (sDefaultType == 'Y' || sDefaultType == 'I'){ //this.select_type._disabled()
		this.select_type._fill({
			IU:getLang('CHAT::ROOM_PUBLIC'),
			IP:getLang('CHAT::ROOM_PRIVATE')
		});
		this.select_type._value('IU');
	}
	else{

		var aFill = {M:getLang('FOLDER_TYPES::MAIL')},
			Typ = 'M';

		if (sPrimaryAccountGW>0){
			var dgw = GWOthers.getItem('RESTRICTIONS', 'disable_gw_types');

			if(!dgw || dgw.indexOf('c')<0){
				aFill.C = getLang('FOLDER_TYPES::CONTACT');
				Typ = Typ || 'C';
			}
			if(!dgw || dgw.indexOf('e')<0){
				aFill.E = getLang('FOLDER_TYPES::EVENT');
				Typ = Typ || 'E';
			}
			if(!dgw || dgw.indexOf('j')<0){
				aFill.J = getLang('FOLDER_TYPES::JOURNAL');
				Typ = Typ || 'J';
			}
			if(!dgw || dgw.indexOf('n')<0){
				aFill.N = getLang('FOLDER_TYPES::NOTE');
				Typ = Typ || 'N';
			}
			if(!dgw || dgw.indexOf('t')<0){
				aFill.T = getLang('FOLDER_TYPES::TASK');
				Typ = Typ || 'T';
			}
			if(!dgw || dgw.indexOf('f')<0){
				aFill.F = getLang('FOLDER_TYPES::FILE');
				Typ = Typ || 'F';
			}
			if(!dgw || dgw.indexOf('r')<0){
				aFill.R = getLang('FOLDER_TYPES::RSS');
				Typ = Typ || 'R';
			}
		}

		this.select_type._fill(aFill);
		this.select_type._value(sDefaultType && "MRCEJNTF".indexOf(sDefaultType)>-1?sDefaultType:Typ);
	}

	// This function is triggered when 'OK' button is pressed
	this.x_btn_ok._onclick = function() {

		var aPath = Path.split(me.tree_folder.__activeNode),
			sAccountName = aPath[0],
			sFolderName = aPath[1],
			aFolders = dataSet.get('folders',[sAccountName]);

		test();
		if (this._disabled())
			return false;

		if (sFolderName && !aFolders[sFolderName]){
			// me.tree_folder.__activeNode = '';
			gui.notifier._value({type: 'alert', args: {header: '', text: 'FORM_FOLDERS::CREATE_ERROR'}});
			return;
		}

		sFolderName = ((sFolderName) ? sFolderName+'/' : '') + me.input_name._value().trim();

		//Serch for already existing folder
		var bFound = false;
		for(var f in aFolders)
		    if (f.toLowerCase() == sFolderName.toLowerCase()){
		    	bFound = true;
		    	break;
		    }

		if (sFolderName && !bFound){
			var sFolderType = me.select_type._value(),
				bPrivate = 0;

			if (sFolderType == 'R'){
				var frm = gui._create('add_rss','frm_change_channel','','',sAccountName,sFolderName);
					frm._modal(true);

				me._destruct();

				return;
			}
			else
			if (sFolderType == 'IU')
				sFolderType	= 'I';
			else
			if (sFolderType == 'IP'){
				sFolderType	= 'I';
				bPrivate = 1;
			}

			me.__hide();

			WMFolders.add({'name':sFolderName,'type':sFolderType,'aid':sAccountName, 'private':bPrivate},'folders','',[
				//success
				function(){
					if (aHandler){
						var arg = [].slice.call(arguments);
							arg.unshift(aHandler);

						executeCallbackFunction.apply(null, arg);
					}
					me._destruct();
				}
			],[
				//error
				function(){
					gui.notifier._value({type: 'alert', args: {header: '', text: 'FORM_FOLDERS::CREATE_ERROR'}});
					me.__show();
				}
			]);
		}
		else
			gui._create('alert', 'frm_alert', '', '', [function () {
				if (me.input_name) me.input_name._setRange(0, me.input_name._value().length);
			}], '', 'ALERTS::FOLDER_EXIST', [Path.basename(sFolderName).escapeHTML()]);
	};
};
