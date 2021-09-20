function frm_verify_sms_code(){};

frm_verify_sms_code.prototype = {
    __constructor:function(view){
		var me = this;
		view.title('VERIFICATION::SMS');
        view.buttons({
            'btn_verify':{value:'VERIFICATION::VERIFY', css:'color1', disabled:true, onclick:function(){

				this._disabled(true);
				me._create('loader','obj_loader')._value(getLang('VERIFICATION::VERIFYING'));

                var pass = view.parent._rsa(view.data.pass);

                WMAccounts.action({two_factor_code:view.data.code, password:pass},'confirm_two_factor', [response]);

            }},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
        });

        var aData = {
            label:getLang('VERIFICATION::SMS_CODE_LBL', ['<b>'+ (view.data.country?'+'+ view.data.country +' ':'') + view.data.phone +'</b>']),
            pwd_lbl: getLang('VERIFICATION::APP_AUTH_PASS', ['<span class="account">' + sPrimaryAccount + '</span>'])
		};

        this._draw('frm_verify_sms_code','main',aData);

        function check(){
            view.parent.btn_verify._disabled(!(view.data.pass && view.data.code && view.data.code.length == 6));
        };

		this.code._maxlength(6);
		this.code._restrict(/^\d{6}$/g);
        this.code._onerror = function(b){
            view.data.code = b?'':this._value();
            check();
		};

        this.pass._onchange = function(){
            view.data.pass = this._value();
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