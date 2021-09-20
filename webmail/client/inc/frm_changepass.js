_me = frm_changepass.prototype;
function frm_changepass(){};

_me.__constructor = function(aHandler, bExpirePass){

	this.__aHandler = aHandler;

	this._draw('frm_changepass','main', {expire:bExpirePass, policy:GWOthers.getItem('PASSWORD_POLICY', 'enable')});

	if (bExpirePass){
		this._size(450, 300+this.obj_label._main.offsetHeight, true);
		this._closable(false);
	}
	else
		this._size(450, 262, true);

	this._title('SIGN_UP::PASSWORD_CHANGE');
	this._resizable(false);
	this._dockable(false);
	this._modal(true);

	var me = this;

	// Create 'OK' button
	this._create('btn_ok', 'obj_button', 'footer', 'noborder ok color1');
	this.btn_ok._value('FORM_BUTTONS::OK');
	this.btn_ok._onclick = function(){
		var old_pwd = this._parent.x_old_password._value(),
			new_pwd = this._parent.x_new_password._value();

		if (!old_pwd || !new_pwd || this._parent.x_new_password_conf._value() != new_pwd)
			return;

		var aAccounts = dataSet.get('accounts');

		// encrypt password
		var tmp = auth.hashid({"username":aAccounts[sPrimaryAccount].USERNAME}),
			rsa = new RSAKey();
			rsa.setPublic(tmp.hash, '10001');

		accounts.add({
			aid:sPrimaryAccount,
			OLDPASSWORD:rsa.encrypt(buildURL({p:old_pwd,t:tmp.time})),
			PASSWORD:rsa.encrypt(buildURL({p:new_pwd,t:tmp.time}))
			},'','',[me,'__saveHandler']);
	};


	this.btn_ok.__check = function(){
		me.btn_ok._disabled(!(me.x_old_password._value() && me.x_new_password._value() && me.x_new_password._value()==me.x_new_password_conf._value() && me.x_new_password._value()!=me.x_old_password._value()));
	};

	this.x_old_password._onkeyup = this.btn_ok.__check;
	this.x_new_password._onkeyup = this.btn_ok.__check;
	this.x_new_password_conf._onkeyup = this.btn_ok.__check;
	this.btn_ok.__check();

	this.x_new_password._restrict([this,'__passcheck']);
	this.x_new_password_conf._restrict([this,'__passcheck2']);

	if (this.x_policy)
		this.x_policy._onclick = function () {
			gui._create('alert','frm_alert','','keepleft',[function(){
			try{
                me.x_new_password._setRange(0,me.x_new_password._value().length);
				me.x_new_password_conf._value('');
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
			}],'SETTINGS::PASSWORD_POLICY','',me._policyString());
		};
};

_me.__passcheck = function(){

	var sOld = this.x_old_password._value(),
		sNew = this.x_new_password._value();

	this.btn_ok.__check();

	if (sNew.length && sOld == sNew){
		this.x_info._value(getLang('ALERTS::NEW_PASSWORD_MATCH'));
		return false;
	}

	this.x_info._value('');
	this.x_new_password_conf.__check();
	return true;
};

_me.__passcheck2 = function(){

	var sNew = this.x_new_password._value(),
		sCon = this.x_new_password_conf._value();

	this.btn_ok.__check();

	if (sNew != sCon){
		if (!this.x_info._value())
			this.x_info._value(getLang('ALERTS::INVALID_CPASSWORD'));

		return false;
	}

	if (!this.x_new_password._checkError.length)
		this.x_info._value('');

	return true;
};

_me.__saveHandler = function(sError,sValue){

	var me = this;

	switch(sError || ''){
	case '':
		this._destruct();
		if (gui.notifier)
			gui.notifier._value({type: 'password_changed'});

		if (this.__aHandler)
			executeCallbackFunction(this.__aHandler);

		break;

	case 'account_old_password':
	case 'account_bad_password':
		gui._create('alert','frm_alert','','',[function(){
			try{
				me.x_old_password._setRange(0,me.x_old_password._value().length);
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
		}],'','',getLang('ALERTS::INVALID_PASSWORD'));
		break;

	case 'account_password_policy':
		gui._create('alert','frm_alert','','keepleft',[function(){
			try{
				me.x_new_password._setRange(0,me.x_new_password._value().length);
				me.x_new_password_conf._value('');
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
		}],'ALERTS::PASSWORD_POLICY','',this._policyString());
		break;

	case 'account_save_1':
	case 'account_save_7':
		gui._create('alert','frm_alert','','keepleft',[function(){
			try{
				me.x_new_password._setRange(0,me.x_new_password._value().length);
				me.x_new_password_conf._value('');
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
		}],'','ALERTS::ACCOUNT_PASS_FAILURE');
		break;

	case 'account_save_9':
		gui._create('alert','frm_alert','','keepleft',[function(){
			try{
				me.x_new_password._setRange(0,me.x_new_password._value().length);
				me.x_new_password_conf._value('');
			}
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}
		}],'','',getLang('ALERTS::ACCOUNT_PASS_FAILURE')+'<ul><li>'+getLang('POLICY::LATIN')+'</li><li>'+getLang('POLICY::DIACRITICS')+'</li></ul>');
		break;

	default:
		gui.notifier._value({type: 'alert', args: {header: '', text: sError + (sValue?': '+sValue:'')}});
	}
};

_me._policyString = function(){
	var s,str = '<ul>',
		aResource = dataSet.get('storage',['PASSWORD_POLICY','ITEMS',0,'VALUES']);

	for(var i in aResource)
		if(aResource[i].VALUE>0 && (s = getLang('POLICY::'+i,[aResource[i].VALUE],2)))
			str += '<li>'+ s +'</li>';

	str += '<li>'+getLang('POLICY::LATIN')+'</li>';
	str += '<li>'+getLang('POLICY::DIACRITICS')+'</li>';

	str += '</ul>';

	return getLang('ALERTS::PASSWORD_REQUIREMENTS')+str;
};