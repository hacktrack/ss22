function frm_verify_code(){};

frm_verify_code.prototype = {
    __constructor:function(view, arg){

        view.title('VERIFICATION::TWOSTEP');

        view.buttons({
            'btn_next':{value:'COMMON::NEXT', css:'color1', onclick:function(){
                view.view('auth');
            }},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
        });

		this.code._maxlength(6);
		this.code._restrict(/^\d{6}$/g);
		this.code._onerror = function(b){
			view.data.code = b?'':this._value();
            view.parent.btn_next._disabled(b);
		};

		this.code._onsubmit = function(){
			if (!view.parent.btn_next._disabled())
				view.parent.btn_next._onclick();
		};

		view.parent.btn_next._disabled(true);

		//Ask for SMS
		var img = new Image();
			img.src = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']), 'class':'two_factor_qr', 'fullpath':'', 'rand':unique_id()});
    }
};