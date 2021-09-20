function frm_verify_app_auth_inp(){};

frm_verify_app_auth_inp.prototype = {
    __constructor:function(view, arg){
		var me = this;

		//view.title('VERIFICATION::APP');
        view.buttons({
            'btn_verify':{value:'verification::verify', css:'color1', disabled:true, onclick:function(){

				this._disabled(true);
				me._create('loader','obj_loader')._value(getLang('VERIFICATION::VERIFYING'));

                // encrypt password
                // var tmp = auth.hashid({"username":dataSet.get('accounts',[sPrimaryAccount,'USERNAME'])}),
                //     rsa = new RSAKey();
                //     rsa.setPublic(tmp.hash, '10001');

                // var pass = rsa.encrypt(buildURL({p:view.data.app_pass, t:tmp.time}));

                var pass = view.parent._rsa(view.data.app_pass);

				WMAccounts.action({two_factor_code:view.data.app_code, password:pass},'confirm_two_factor', [response]);

            }},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
        });

        var aData = {
            h: getLang(arg=='ios'?'VERIFICATION::APP_AUTH_HIOS':'VERIFICATION::APP_AUTH_HANDROID'),
            pwd_lbl: getLang('VERIFICATION::APP_AUTH_PASS', ['<span class="account">' + sPrimaryAccount + '</span>'])
        };

        this._draw('frm_verify_app_auth_inp', 'main', aData);

        function check(){
            view.parent.btn_verify._disabled(!(view.data.app_pass && view.data.app_code && view.data.app_code.length == 6));
        };

		this.code._maxlength(6);
		this.code._restrict(/^\d{6}$/g);
		this.code._onerror = function(b){
			view.data.app_code = b?'':this._value();
            check();
        };

        this.pass._onchange = function(){
            view.data.app_pass = this._value();
            check();
		};

		this.pass._onsubmit = this.code._onsubmit = function (){
			check();
			if (!view.parent.btn_verify._disabled())
				view.parent.btn_verify._onclick();
		};

        function response (bOK, aData){
            if (bOK){
				view.view('success');
            }
            else{
				me.loader._destruct();
				view.parent.btn_verify._disabled(false);
				me.code._select();

				gui.notifier._value({type: 'alert', args: {text: 'VERIFICATION::ERROR'}});
            }
        };
    }
};