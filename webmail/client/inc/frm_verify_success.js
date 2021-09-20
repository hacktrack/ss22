function frm_verify_success(){};

frm_verify_success.prototype = {
    __constructor:function(view, arg){

		view.parent._enable2FE(true);

        view.buttons({
            'btn_next':{value:'COMMON::DONE', css:'color1', onclick:function(){
                view.parent._destruct();
            }}
        });

        var aData = {
            lbl: getLang('VERIFICATION::SUCCESS', ['<span class="bold">' + sPrimaryAccount + '</span>'])
        };

        this._draw('frm_verify_success', 'main', aData);
    }
};