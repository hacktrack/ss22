function frm_verify_app_manual(){};

frm_verify_app_manual.prototype = {
    __constructor:function(view, arg){
		this._create('loader', 'obj_loader');
		this.__view = view;

		storage.library('blowfish', 'crypto');

		var aData = {h:getLang('VERIFICATION::APP_AUTH_LBL',[getLang(arg=='ios'?'VERIFICATION::APP_BTN_IOS':'VERIFICATION::APP_BTN_ANDROID')])};
        this._draw('frm_verify_app_manual', 'main', aData);

        //INPUTS
        this.service._value(dataSet.get('main',['domain']));
        this.service._onclick = function(){ this._select() };
        this.key._onclick = function(){ this._select() };
        this.account._value(sPrimaryAccount);
        this.account._onclick = function(){ this._select() };

		this._init(view.data.code);
	},

	_init: function(code){
		var tmp = auth.hashid({"username":dataSet.get('accounts',[sPrimaryAccount,'USERNAME'])}),
			pass = SHA1(unique_id()),
			secure = buildURL({code:code || '', key:pass, t:tmp.time}),
			rsa = new RSAKey();

		rsa.setPublic(tmp.hash, '10001');

		WMAccounts.action({'TWO_FACTOR_KEY':rsa.encrypt(secure)}, 'manual_two_factor',[function(bOK, aData){

			var ciphertext;
			if (bOK && aData.TOTP_SECRET && (ciphertext = aData.TOTP_SECRET[0].VALUE)){

				var bf = new Blowfish(pass);
				this.key._value(bf.decrypt(bf.base64Decode(ciphertext)));

				this.loader && this.loader._destruct();
			}
			else{
				this.__view.parent._code([this, '_init']);
			}
		}.bind(this)]);
	}
};