function frm_verify_sms(){};

frm_verify_sms.prototype = {
    __constructor:function(view){
        this.__eCode = null;
		this.__aData = view.data;
		this.__aData.country = '';
		this.__aData.phone = '';

		view.title('VERIFICATION::SMS');
        view.buttons({
            'btn_next':{value:'COMMON::NEXT', css:'color1', disabled: true, onclick:function(){
				WMAccounts.action({TWO_FACTOR_TYPE:1, TWO_FACTOR_PHONE: view.data.country.toString() + view.data.phone.toString()}, 'setup_two_factor', [
					function(bOK){
						bOK && view.view('sms_code');
					}
				]);
            }},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
        });

        //Country Code Select
        storage.library('codes', 'codes');
        var aData = [[getLang('VERIFICATION::COUNTRY_PH'), 0]];
        for (var i = 0, j = country_calling_codes.length; i<j; i++){
            aData.push([country_calling_codes[i].name, country_calling_codes[i].callingCode]);
        }

        this.country._fill(aData);
        this.country._value(0);

        this.country._onchange = function(){
            this._showCode(this.country._getDataValue());
        }.bind(this);

        this.phone._onchange = function(){
            view.data.phone = this.phone._value();

            //Next btn check
            view.parent.btn_next._disabled(!view.data.phone);
        }.bind(this);

    },
    _showCode: function(code){
        if (code){
            addcss(this.phone._main, 'show_code');

            if (!this.__eCode){
                this.__eCode = mkElement('div',{class:'code'});
                this.__eCode.onclick = function(){
                    this.country._value(0);
                }.bind(this);

                this.phone._main.insertBefore(this.__eCode, this.phone._main.firstChild);
            }

            this.__eCode.innerHTML = '+' + code;
            this.__aData.country = code;
        }
        else{
            removecss(this.phone._main, 'show_code');
            this.__aData.country = '';
        }
    }
};