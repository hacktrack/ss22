_me = obj_actions.prototype;
function obj_actions(){};

_me.__constructor = function() {
	var me = this;

    this._draw('obj_actions','main',{
		disable_fw:GWOthers.getItem('RESTRICTIONS', 'disable_forwarder')>0,
		disable_ab:sPrimaryAccountGW<1 || (GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('c')>-1
	});

	this.check_accept_delete._onchange = function() { me.__enableControl('accept_delete', this._value()); };
	this.check_forward_to._onchange = function() {
		me.__enableControl('forward_to', this._value());
		me.check_forward_as_attachment._disabled(!this._value());
	};
	this.check_move_to._onchange = function() { me.__enableControl('move_to', this._value()); };
	this.check_copy_to._onchange = function() { me.__enableControl('copy_to', this._value()); };
	this.check_send_message._onchange = function() { me.__enableControl('send_message', this._value()); };
	this.check_edit_header._onchange = function() { me.__enableControl('edit_header', this._value()); };
	this.check_message_priority._onchange = function() { me.__enableControl('message_priority', this._value()); };

	this.check_message_flags._onchange = function() {
		me.message_flag1._disabled(!this._value());
		me.message_flag2._disabled(!this._value());
		me.message_flag3._disabled(!this._value());
		if (this._value()) {
			if (![].concat(me.message_flag1._value(), me.message_flag2._value(), me.message_flag3._value()).length) {
				me.message_flag1._value([0]);
			}
		}
		me.message_flag_custom._disabled(!this._value());
	};

	this.btn_forward._onclick = function(e){

		if (me.x_add_address && !me.x_add_address.__destructed)
			me.x_add_address._destruct();

		var aTabsNames = {'forward': "FILTERS::FORWARD_TO"},
			aTabsValues = {'forward': me.forward_to._value()};

		me.x_add_address = gui._create('add_address', 'frm_addaddress', '', '', [function(bOK, aValues){

			if (bOK)
				me.forward_to._value(aValues.forward.join(';'));

		}], aTabsNames, aTabsValues, 'forward', true, false, true);
		me.x_add_address._modal(true);
	};

	this.check_message_flags._onchange();

    this.message_flag1._fill(['Flagged','Seen','NonJunk','Junk']);
    this.message_flag2._fill(['Label1','Label2','Label3']);
	this.message_flag3._fill(['Label4','Label5','Label6']);
};

_me.__load = function(aValues) {
	var sAcceptDelete;
	if (this.__getTagValue(aValues, 'ACCEPT') == '1')
		sAcceptDelete = 'ACCEPT';
	else
	if (this.__getTagValue(aValues, 'REJECT') == '1')
		sAcceptDelete = 'REJECT';
	else
	if (this.__getTagValue(aValues, 'DELETE') == '1')
		sAcceptDelete = 'DELETE';
	else
	switch ((this.__getTagValue(aValues, 'MARKSPAM') || 0).toString()) {
		case '1': sAcceptDelete = 'MARKSPAM'; break;
		case '2': sAcceptDelete = 'QUARANTINE'; break;
		default: sAcceptDelete = undefined; break;
	}

	var sTag;

	this.__enableControlAndSet('accept_delete', sAcceptDelete);

	this.__enableControl('stop_processing', this.__getTagValue(aValues, 'STOP') == '1');
	this.__enableControlAndSet('forward_to', this.__getTagValue(aValues, 'FORWARD'));
	this.check_forward_as_attachment._disabled(!this.__getTagValue(aValues, 'FORWARD'));
	this.__enableControl('forward_as_attachment', this.__getTagValue(aValues, 'FORWARDASATTACHMENT') == '1');

	sTag = this.__getTagValue(aValues, 'MOVETOFOLDER');
	if (sTag) sTag = sPrimaryAccount+'/'+((sTag == 'Inbox') ? 'INBOX' : sTag);
	this.__enableControlAndSet('move_to', sTag);
	sTag = this.__getTagValue(aValues, 'COPYTOFOLDER');
	if (sTag) sTag = sPrimaryAccount+'/'+((sTag == 'Inbox') ? 'INBOX' : sTag);
	this.__enableControlAndSet('copy_to', sTag);

	this.__enableControl('encrypt', this.__getTagValue(aValues, 'ENCRYPT') == '1');
	this.__enableControlAndSet('message_priority', (this.__getTagValue(aValues, 'PRIORITY') != '0') ? this.__getTagValue(aValues, 'PRIORITY') : undefined);

	if ((this.__getTagValue(aValues, 'FLAGS') || '0') != '0'){
        var flag = this.__getTagValue(aValues, 'FLAGS');

		var arr  = [];//new Array(4);
		if (flag & 1) arr.push(0);
		if (flag & 2) arr.push(1);
		if (flag & 8) arr.push(2);
		if (flag & 4) arr.push(3);
		this.message_flag1._value(arr);

        var arr  = [];
		if (flag & 16) arr.push(0);
		if (flag & 32) arr.push(1);
		if (flag & 64) arr.push(2);
		this.message_flag2._value(arr);

        var arr  = [];
		if (flag & 128) arr.push(0);
		if (flag & 256) arr.push(1);
		if (flag & 512) arr.push(2);
		this.message_flag3._value(arr);

		this.message_flag_custom._value(this.__getTagValue(aValues, 'CUSTOMFLAGS'));

		this.check_message_flags._value(1);
	}
	else{
		this.message_flag1._disabled(true);
		this.message_flag2._disabled(true);
		this.message_flag3._disabled(true);
		this.message_flag_custom._disabled(true);

		this.message_flag3._value(0);
	}

	this.__enableControlAndSet('send_message', Is.Defined(aValues['SENDMESSAGE']) ? aValues['SENDMESSAGE'][0] : undefined);

	this.__enableControlAndSet('edit_header', Is.Defined(aValues['HEADER']) ? aValues['HEADER'][0]['VAL'][0]['VALUE'] : undefined);
};

_me.__save = function(aValues) {
	this.__setTagValue(aValues, 'ACCEPT', '0');
	this.__setTagValue(aValues, 'REJECT', '0');
	this.__setTagValue(aValues, 'DELETE', '0');
	this.__setTagValue(aValues, 'MARKSPAM', '0');

	if (this.check_accept_delete._value()) {
		switch (this.accept_delete._value()) {
			case 'MARKSPAM': this.__setTagValue(aValues, 'MARKSPAM', '1'); break;
			case 'QUARANTINE': this.__setTagValue(aValues, 'MARKSPAM', '2'); break;
			default: this.__setTagValue(aValues, this.accept_delete._value(), '1'); break;
		}
	}
	this.__setTagValue(aValues, 'STOP', (this.check_stop_processing._value()) ? '1' : '0');

	if (this.check_forward_to._value() && this.forward_to._value()) {
		//server use ; delimiter
		this.__setTagValue(aValues, 'FORWARD', MailAddress.splitEmails(this.forward_to._value()).join(';'));
		this.__setTagValue(aValues, 'FORWARDASATTACHMENT', this.check_forward_as_attachment._checked());
	} else {
		delete aValues['FORWARD'];
		delete aValues['FORWARDASATTACHMENT'];
	}
	if (this.check_move_to._value()) {
		sTag = Path.split(this.move_to._value())[1];
		this.__setTagValue(aValues, 'MOVETOFOLDER', (sTag != 'INBOX') ? sTag : 'Inbox');
	} else {
		delete aValues['MOVETOFOLDER'];
	}
	if (this.check_copy_to._value()) {
		sTag = Path.split(this.copy_to._value())[1];
		this.__setTagValue(aValues, 'COPYTOFOLDER', (sTag != 'INBOX') ? sTag : 'Inbox');
	} else {
		delete aValues['COPYTOFOLDER'];
	}

	this.__setTagValue(aValues, 'ENCRYPT', (this.check_encrypt._value()) ? '1' : '0');

	//SEND MESSAGE
	if (this.check_send_message._value())
		aValues['SENDMESSAGE'] = [this.send_message._value()];
	else
		delete aValues['SENDMESSAGE'];

	//EDIT HEADER
	if (this.check_edit_header._value())
		aValues['HEADER'] = [{'VAL':[{'VALUE':this.edit_header._value()}]}];
	else
		delete aValues['HEADER'];



	this.__setTagValue(aValues, 'PRIORITY', (this.check_message_priority._value()) ? this.message_priority._value() : '0');


	//FLAGS
	var arr,iFlags = 0;
	if (this.check_message_flags._value()){

		this.__setTagValue(aValues, 'CUSTOMFLAGS', this.message_flag_custom._value());

		arr  = this.message_flag1._value();
		for(var i in arr){
			switch(arr[i].toString()){
			case '0': iFlags |= 1; break;
			case '1': iFlags |= 2; break;
			case '2': iFlags |= 8; break;
			case '3': iFlags |= 4; break;
			}
		}

		arr  = this.message_flag2._value();
		for(var i in arr){
			switch(arr[i].toString()){
			case '0': iFlags |= 16; break;
			case '1': iFlags |= 32; break;
			case '2': iFlags |= 64; break;
			}
		}

		arr  = this.message_flag3._value();
		for(var i in arr){
			switch(arr[i].toString()){
			case '0': iFlags |= 128; break;
			case '1': iFlags |= 256; break;
			case '2': iFlags |= 512; break;
			}
		}
	} else {
		delete aValues['CUSTOMFLAGS'];
	}
	this.__setTagValue(aValues, 'FLAGS', iFlags);
};

_me.__enableControl = function(sName, b) {
	this['check_'+sName]._value(b);

	if (Is.Defined(this[sName])){
		this[sName]._disabled(!b);

		if (sName == 'forward_to')
			this.btn_forward._disabled(!b);
	}
};

_me.__enableControlAndSet = function(sName, sValue) {
	var b = (sValue != undefined && sValue) ? true : false;

	this.__enableControl(sName, b);
	if (b) this[sName]._value(sValue);
};

_me.__getTagValue = function(aValues, sName) {
	if (Is.Defined(aValues[sName])) {
		return aValues[sName][0]['VALUE'];
	} else {
		return undefined;
	}
};

_me.__setTagValue = function(aValues, sName, sValue) {
	if (Is.Defined(aValues[sName])) {
		aValues[sName][0]['VALUE'] = sValue;
	} else {
		aValues[sName] = [{'VALUE': sValue}];
	}
};

_me._value = function(aValues) {
	if (Is.Defined(aValues)) {
		this.__aValues = aValues;
		this.__load(aValues);
	} else {
		this.__save(this.__aValues);
		return this.__aValues;
	}
};
