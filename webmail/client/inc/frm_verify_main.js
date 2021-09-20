function frm_verify_main(){};

frm_verify_main.prototype = {
    __constructor:function(view){
        view.data = {};
        view.title('VERIFICATION::TWOSTEP');
        view.buttons({'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}});

        this._getAnchor('app').onclick = function(){
            WMAccounts.action({TWO_FACTOR_TYPE:0},'setup_two_factor', [response, ['app']]);
        }.bind(this);

        if (sPrimaryAccount2F<2){
            addcss(this._getAnchor('sms'), 'disabled');
            var elm = this._getAnchor('sms').querySelector('span.info');
            gui.tooltip._add(elm,getLang('VERIFICATION::SMS_DISABLED'), {hide:false, css:'dark pad'});
        }
        else{
            this._getAnchor('sms').onclick = function(){
				view.view('sms');
            }.bind(this);
        }

        function response (bOK, aData, sType){
            if (bOK){
                view.view(sType);
            }
            else{
                console.warn('Unable to activate two-factor' + sType);
            }
        }
    }
};