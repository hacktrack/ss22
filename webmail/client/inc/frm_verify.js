function frm_verify(){};

frm_verify.__app_links = {
	ios: 'https://itunes.apple.com/app/icewarp-authenticator/id1335635061',
	android: 'https://play.google.com/store/apps/details?id=com.icewarp.authenticator'
};

frm_verify.prototype = {
    __constructor: function(){
        this._title('VERIFICATION::TWOSTEP');

		this.__2FE = sPrimaryAccount2FE;
		this.__views = {
			//HOME
			'main':'frm_verify_main',
			//APP
			'app':'frm_verify_app',
			'auth':'frm_verify_app_auth',
			'manual':'frm_verify_app_manual',
			'auth_inp':'frm_verify_app_auth_inp',
			'success':'frm_verify_success',
			//SMS
			'sms':'frm_verify_sms',
			'sms_code':'frm_verify_sms_code',
			//RESET
			'code':'frm_verify_code'
		};

        if (sPrimaryAccount2FE)
            this._view('code'); //pass
        else
    		this._view('main');
	},

    _rsa: function(pass){
        var tmp = auth.hashid({"username":dataSet.get('accounts',[sPrimaryAccount,'USERNAME'])}),
            rsa = new RSAKey();

        rsa.setPublic(tmp.hash, '10001');

        return rsa.encrypt(buildURL({p:pass, t:tmp.time}));
	},

	_code: function(aHandler){
		mkElement('img', {src:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'two_factor_qr', 'fullpath':'', 'rand':unique_id()})});
		var frm = gui._create('code','frm_input','','frm_verify_code',[function(code){
			if (executeCallbackFunction(aHandler, code) !== false)
				frm._destruct();
		}], 'VERIFICATION::CODE','',getLang('VERIFICATION::APP_AUTH_CODE_PH'));
		frm.x_btn_ok._value('VERIFICATION::VERIFY');
	},

	_enable2FE: function(b){
		window.sPrimaryAccount2FE = b?1:0;
	},

	//Relaunch settings on exit
	_onclose: function(){
		if (this.__2FE != sPrimaryAccount2FE){
			WMAccounts.refresh({aid:sPrimaryAccount}, '','', [function(){
				if (gui.settings)
					gui._create('settings','frm_settings','','','account_settings','primary');
			}]);
		}
		return true;
	}
};