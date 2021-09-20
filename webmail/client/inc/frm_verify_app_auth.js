function frm_verify_app_auth(){};

frm_verify_app_auth.prototype = {
    __constructor:function(view, arg){
		this.__view = view;

        view.buttons({
            'btn_next':{value:'COMMON::NEXT', css:'color1', onclick:function(){
                view.view('auth_inp', arg);
            }},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
        });

        var aData = {
            h: getLang(arg=='ios'?'VERIFICATION::APP_AUTH_HIOS':'VERIFICATION::APP_AUTH_HANDROID'),
            l1: getLang('VERIFICATION::APP_AUTH_1', ['<span class="link">' + getLang(arg=='ios'?'VERIFICATION::APP_AUTH_1IOS':'VERIFICATION::APP_AUTH_1ANDROID') + '</span>']),
            l2: getLang('VERIFICATION::APP_AUTH_2',['<b>&quot;' + getLang('VERIFICATION::APP_AUTH_2ext') + '&quot;</b>']),
            l3: getLang('VERIFICATION::APP_AUTH_3',['<b>&quot;' + getLang('VERIFICATION::APP_AUTH_3ext') + '&quot;</b>']),
            reset:!!view.data.code
        };

        this._draw('frm_verify_app_auth', 'main', aData);

		this._main.querySelector('span.link').onclick = function(){
			var link = frm_verify.__app_links[arg];
			if (link)
				openItem(link, true, 'app');
		};

        if (view.data.code){
            view.parent._size(400,700,true);

            this.btn_reset._onclick = function(){
                this._reset(view.data.code);
            }.bind(this);
        }

        var qr = mkElement('img', {src:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'two_factor_qr', 'fullpath':view.data.code || '', 'rand':unique_id()})});
			qr.onerror = function(){
				if (view.data.code){
					gui._create('alert','frm_alert','','',false, 'VERIFICATION::TWOSTEP','LOGIN_SCREEN::ANTISPAM_CODE_ERROR');
					view.view('code', arg);
				}
				else{
					gui._create('alert','frm_alert','','',false, 'VERIFICATION::TWOSTEP','VERIFICATION::ERROR');
					view.view('main');
				}
			};
			qr.onload = function(){
				var link = this._getAnchor('manual');
				addcss(link,'link');
				link.onclick = function(){
					view.view('manual', arg);
				};
			}.bind(this);

        this._getAnchor('qr').appendChild(qr);
    },

    _reset: function(code){
        WMAccounts.action({'TWO_FACTOR_CODE':code}, 'reset_two_factor',[this, '_response']);
    },

    _response: function(bOK){
		if (bOK){
			this.__view.parent._enable2FE(false);
			this.__view.parent._close();
        }
		//Expired code
		else{
            //get new code
			this.__view.parent._code([this, '_reset']);

            //get new code
            // mkElement('img', {src:'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'two_factor_qr', 'fullpath':'', 'rand':unique_id()})});
            // var frm = gui._create('code','frm_input','','frm_verify_code',[function(code){
			// 	this._reset(code);
			// 	frm._destruct();
            // }.bind(this)], 'VERIFICATION::CODE','',getLang('VERIFICATION::APP_AUTH_CODE_PH'));
            // frm.x_btn_ok._value('VERIFICATION::VERIFY');
        }
    }
};