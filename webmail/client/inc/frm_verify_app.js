function frm_verify_app(){};

frm_verify_app.prototype = {
    __constructor:function(view){
        var next = 'ios',
            me = this;

        view.title('VERIFICATION::APP');
        view.buttons({
            'btn_next':{value:'COMMON::NEXT', css:'color1', onclick:function(){
                view.view('auth', next);
            }},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
        });

        function toggle (e){

			next = this.getAttribute('rel');

            [].forEach.call(me._main.querySelectorAll('.radio'), function(elm){
				if (elm.getAttribute('rel') == next)
                    addcss(elm, 'active');
                else
                    removecss(elm, 'active');
            });
        }

        [].forEach.call(this._main.querySelectorAll('.radio'), function(elm){
            elm.onclick = toggle;
        });
    }
};