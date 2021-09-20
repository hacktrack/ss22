_me = frm_notify.prototype;
function frm_notify(){};

_me.__constructor = function(ids) {

	this.__id = ids;

	this._title('NOTIFY::TITLE');	
	this._defaultSize(-1,-1,600,400);
	this._draw('frm_notify','main');

	// Height fix
	msiebox(this._getAnchor('msiebox'));

	this.btn_copy._onclick = function(){
		if (this._parent.add_address && !this._parent.add_address._destructed)
			this._parent.add_address._focus();
		else
			this._parent.add_address = gui._create('add_address', 'frm_addaddress', '', '', [this._parent, '__onPopupClose'], {'copy': "ADDRESS_BOOK::SELECTED_ADDRESSES"}, {'copy': this._parent.inp_copy._value()}, 'copy', true);
	};	

	this.comment._placeholder(getLang('NOTIFY::COMMENT'));

	// OK
	this.x_btn_ok._onclick = function(){
		var aItemInfo = {
			aid:this._parent.__id[0],
			fid:this._parent.__id[1],
			iid:this._parent.__id[2],
			values:{
				all:this._parent.ch_all._value()?'1':'0',
				copy_to:this._parent.inp_copy._value(),
				comment:this._parent.comment._value()
			}
		};

		this._parent.__hide();
		WMItems.action(aItemInfo,'notify',[this._parent,'__notified']);
	};

	this.inp_copy._onchange = this.ch_all._onchange = function(){
		this._parent.__test();
	};
};

_me.__test = function(){
	this.x_btn_ok._disabled(!this.ch_all._value() && !this.inp_copy._value());
};

_me.__onPopupClose = function(bOK, aAddresses){
	if (bOK && aAddresses['copy'])
		this.inp_copy._value(aAddresses['copy'].join(', '));
};

_me.__notified = function(aResponse,aError){
	if (aResponse == false){
		this.__show();
	}
	else{
 		if (gui.notifier)
			gui.notifier._value({type: 'message_sent'});

		this._destruct();
	}
};