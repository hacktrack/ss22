_me = frm_timezone.prototype;
function frm_timezone(){};

_me.__constructor = function(aHandler) {
	var me = this;
	this._dockable(false);
	this._resizable(false);
	this._closable(false);
	this._size(430,290,true);
	this._title('SETTINGS::TIMEZONE');

	this._draw ('frm_timezone','main');
	this.tz._value(GWOthers.getItem('CALENDAR_SETTINGS', 'timezone'));

	this.x_btn_ok._onclick = function() {

		Cookie.set(['tzoffset'],(new IcewarpDate()).utcOffset() - (60 * new IcewarpDate().getMoment().isDST()));

		dataSet.add('tmp_storage','',dataSet.get('storage','',true));
		GWOthers.set('CALENDAR_SETTINGS',{timezone:me.tz._value()},'storage');
		if (WMStorage.set({'resources':dataSet.get('storage')},'storage','',[me,'__saveItemsHandler']) == 2){
			dataSet.remove('tmp_storage');
			me.x_btn_cancel._onclick();
		}
	};

	this.x_btn_cancel._onclick = function() {
		me._destruct();
		executeCallbackFunction(aHandler);
	};
};

_me.__saveItemsHandler = function(bOK)
{
	//Přijal server náš dotaz?
	if (!bOK)
		dataSet.add('storage','',dataSet.get('tmp_storage'));

	dataSet.remove('tmp_storage');
	this.x_btn_cancel._onclick();
};