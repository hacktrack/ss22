_me = frm_device.prototype;
function frm_device(){};

_me.__constructor = function(sItemID){

	this.__sItemID = sItemID;//'*androidc1198210559x';

	this._title('DEVICES::OPTIONS');
	this._size(500,440,true);

	//create loader
	this._create('loader','obj_loader');

	// Buttons
	this.x_btn_ok._disabled(true);

	// this._create('x_btn_wipe', 'obj_button', 'footer','big noborder cancel color2 x_btn_right');
	// this.x_btn_wipe._disabled(true);
	// this.x_btn_wipe._value('DEVICES::WIPE');

	//GET
	if (Is.Defined(this.__sItemID))
		WMItems.list({aid:sPrimaryAccount,fid:'__@@DEVICES@@__',iid:this.__sItemID},'','','',[this,'__init']);
};
_me.__init = function(aData){
	//parse data
	try{
		var aData = aData[sPrimaryAccount]['__@@DEVICES@@__'][this.__sItemID],
			aXML = XMLTools.Str2Arr(aData.SETTINGS_XML).SETTINGS[0];
	}
	catch(r){
		this._destruct();
	}

	//Check function
	var check = function (){
		tab0['mailfolders']._disabled(tab0['groupware']._value() == 2);
		tab0['archive']._disabled(tab0['groupware']._value() != 2 && tab0['mailfolders']._value() != 1);
		tab0['publicfolders']._disabled(tab0['groupware']._value() == 0 && tab0['mailfolders']._value() != 1);
		tab0['sharedfolders']._disabled(tab0['publicfolders']._disabled());

		//tab1['mailfilter']._disabled(aXML.MAILS[0].FILTER[0].VALUE == 2);
		tab1['mailinterval']._disabled(tab1['mailfilter']._value() < 1);
		tab1['calendarinterval']._disabled(tab1['calendarfilter']._value() == 0);
		tab1['taskssync']._disabled(tab1['tasksasevents']._value() != 1);
		tab1['taskssynctype']._disabled(tab1['taskssync']._disabled() || tab0['groupware']._value() == 0);
		//tab1['calendarfilter']._disabled(aXML.EVENTS[0].FILTER[0].VALUE == 2);
		tab1['notessync']._disabled(tab1['notesaseventsortasks']._value() == 0 || tab1['tasksasevents']._value() == 1);
		tab1['notessynctype']._disabled(tab1['notesaseventsortasks']._value() == 0 || /*tab1['notessync']._value() == 2 ||*/ tab0['groupware']._value() == 0);

		//Limit Mail age filter to Max mail age filter set by provision
		if (tab1['mailfilter']._checked() && aXML.MAILS[0].MAXINTERVAL[0].VALUE>0)
			if (tab1['mailinterval']._value() == 0 || aXML.MAILS[0].MAXINTERVAL[0].VALUE < tab1['mailinterval']._value())
					tab1['mailinterval']._value(aXML.MAILS[0].MAXINTERVAL[0].VALUE);

		//Limit Event age filter to Max event age filter set by provision
		if (tab1['calendarfilter']._checked() && aXML.EVENTS[0].MAXINTERVAL[0].VALUE>0)
			if (tab1['calendarinterval']._value() == 0 || aXML.EVENTS[0].MAXINTERVAL[0].VALUE < tab1['calendarinterval']._value())
					tab1['calendarinterval']._value(aXML.EVENTS[0].MAXINTERVAL[0].VALUE);

		//Force Merge to default folder
		if (tab0['groupware']._value() == 0) {
			if (tab1['tasksasevents']._checked())
				tab1['taskssynctype']._value(1,true);

			if (tab1['notesaseventsortasks']._checked())
				tab1['notessynctype']._value(1,true);
		}

		//Force Notes As Events
		if (tab1['tasksasevents']._value() == 1 && tab1['notesaseventsortasks']._value() == 1 && tab1['notessync']._value() == 2)
			tab1['notessync']._value(1);
	};

	this._title(getLang('DEVICES::OPTIONS') + ' - ' + (aData.FRIENDLY_NAME || aData.MODEL || WMItems.__serverID(this.__sItemID)) ,true);

	// destruct loader
	this.loader._destruct();

	//create form
	this._draw('frm_device','main');

	//folders
	var tab0 = this.maintab.folders;
		tab0['groupware']._value(aXML.FOLDERS[0].GROUPWARE[0].VALUE);
		tab0['groupware']._onchange = check;
		tab0['mailfolders']._value(aXML.FOLDERS[0].MAIL[0].VALUE);
		tab0['mailfolders']._onchange = check;
		tab0['archive']._value(aXML.FOLDERS[0].ARCHIVE[0].VALUE);
		tab0['publicfolders']._value(aXML.FOLDERS[0].PUBLIC[0].VALUE);
		tab0['sharedfolders']._value(aXML.FOLDERS[0].SHARED[0].VALUE);

	//synchronize
	var tab1 = this.maintab.sync;
		tab1['mailfilter']._value(aXML.MAILS[0].ENABLED[0].VALUE);
		tab1['mailfilter']._onchange = check;
		tab1['mailinterval']._value(aXML.MAILS[0].INTERVAL[0].VALUE);

		tab1['calendarfilter']._value(aXML.EVENTS[0].ENABLED[0].VALUE);
		tab1['calendarfilter']._onchange = check;
		tab1['calendarinterval']._value(aXML.EVENTS[0].INTERVAL[0].VALUE);

		tab1['tasksasevents']._value(aXML.TASKS[0].ENABLED[0].VALUE);
		tab1['tasksasevents']._onchange = check;
		tab1['taskssynctype']._value(aXML.TASKS[0].MERGE[0].VALUE);
		tab1['taskssynctype']._onchange = check;
		tab1['taskssync']._value(aXML.TASKS[0].INCOMPLETE[0].VALUE);

		tab1['notesaseventsortasks']._value(aXML.NOTES[0].ENABLED[0].VALUE);
		tab1['notesaseventsortasks']._onchange = check;
		tab1['notessync']._value(aXML.NOTES[0].ENABLED[0].VALUE == '0'?'1':aXML.NOTES[0].ENABLED[0].VALUE);
		tab1['notessync']._onchange = check;
		tab1['notessynctype']._value(aXML.NOTES[0].MERGE[0].VALUE);
		tab1['notessynctype']._onchange = check;

	//device
	var tab2 = this.maintab.device;
		tab2.friendly_name._value(aData.FRIENDLY_NAME || '');

	check();

	var me = this;

	//activate buttons
	this.x_btn_ok._onclick = function() {

		me.__hide();

		var tmp,
			aOut = {
				SETTINGS:[{
					FOLDERS:[{}],
					MAILS:[{}],
					EVENTS:[{}],
					TASKS:[{}],
					NOTES:[{}]
				}]
			};

		//Folders
		tmp = aOut.SETTINGS[0].FOLDERS[0];
		tmp.groupware = [{VALUE:tab0['groupware']._value()}];
		tmp.MAIL = [{VALUE:tab0['mailfolders']._value()}];
		tmp.ARCHIVE = [{VALUE:tab0['archive']._value()?1:0}];
		tmp.PUBLIC = [{VALUE:tab0['publicfolders']._value()?1:0}];
		tmp.SHARED = [{VALUE:tab0['sharedfolders']._value()?1:0}];

		//Synchronize
		tmp = aOut.SETTINGS[0].MAILS[0];
		tmp.ENABLED = [{VALUE:tab1['mailfilter']._value()?1:0}];
		tmp.INTERVAL = [{VALUE:tab1['mailinterval']._value()}];

		tmp = aOut.SETTINGS[0].EVENTS[0];
		tmp.ENABLED = [{VALUE:tab1['calendarfilter']._value()?1:0}];
		tmp.INTERVAL = [{VALUE:tab1['calendarinterval']._value()}];

		tmp = aOut.SETTINGS[0].TASKS[0];
		tmp.ENABLED = [{VALUE:tab1['tasksasevents']._value()?1:0}];
		tmp.MERGE = [{VALUE:tab1['taskssynctype']._value()}];
		tmp.INCOMPLETE = [{VALUE:tab1['taskssync']._value()}];

		tmp = aOut.SETTINGS[0].NOTES[0];
		tmp.ENABLED = [{VALUE:tab1['notesaseventsortasks']._value()?tab1['notessync']._value():0}];
		tmp.MERGE = [{VALUE:tab1['notessynctype']._value()}];

		WMItems.action({aid:sPrimaryAccount, fid:'__@@DEVICES@@__', iid:me.__sItemID,values:{SETTINGS_XML:XMLTools.Arr2Str(aOut),FRIENDLY_NAME:tab2.friendly_name._value()}},'edit',[me,'__saveHandler']);
	};
	this.x_btn_ok._disabled(false);


	if (aData.REMOTEWIPE != '-1'){
		if (aData.REMOTEWIPE == '1')
			tab2.x_btn_wipe._value('DEVICES::RESET');

		if ((GWOthers.getItem('RESTRICTIONS','disable_wipe') || 0) < 1){
			tab2.x_btn_wipe._onclick = function() {
				if (aData.REMOTEWIPE == '1')
					me.__action(me.__sItemID,'resetwipe');
				else
					gui._create('frm_confirm','frm_confirm', '', '', [me,'__action', [me.__sItemID,'setwipe']],'DEVICES::WIPE','DEVICES::WIPE_CONFIRMATION');
			};
			tab2.x_btn_wipe._disabled(false);
		}
	}
};

_me.__saveHandler = function(bOK){
	if (bOK === true){
		this.__response(true);

 		if (gui.notifier)
			gui.notifier._value({type: 'item_saved'});
	}
	else
		this.__show();
};

_me.__action = function(v, sAction){
	this.__hide();
	WMItems.action({aid:sPrimaryAccount,fid:'__@@DEVICES@@__',iid:v},sAction,[this,'__response']);
};
_me.__response = function(bOK){
	if (bOK === true){
		//Refresh devices
		if (gui.devices && gui.devices._refresh)
			gui.devices._refresh();

		this._destruct();
	}
	//Some Error...
	else{
		this.__show();
	}
};