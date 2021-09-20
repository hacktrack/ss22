function frm_wizard(){};

frm_wizard.prototype = {
    __constructor: function(){
        this._size(400,680,true);

		this._create('label','obj_label','header','ico');

		this.__views = {};
		this.__data = {};
		this.__view = null;

        this._create('scrollbar','obj_scrollbar')._scrollbar(this._getAnchor('main'));
	},

    _view: function(sView, arg){
        if (this.__views[sView]){

			//console.log(sView, frm_wizard.__views[sView], arg);

			this._main.setAttribute('slide', sView);

            this._create('main', this.__views[sView], '', '', {
                title:function(v){this.label._value(getLang(v))}.bind(this),
                buttons:function(v){this._buttons(v)}.bind(this),
                view:function(v, arg){this._view(v, arg)}.bind(this),
				data:this.__data,
				parent:this
            }, arg);
        }
        else
            console.warn(this._pathName,'undefined view');
	},

    _buttons: function(arr){
        this._clean('footer');

        for(var name in arr){
            var btn = this._create(name, arr[name].type || 'obj_button', 'footer', arr[name].css);

			if (arr[name].disabled)
				btn._disabled(true);

			if (arr[name].value)
                btn._value(arr[name].value);

            if (arr[name].onclick){
                btn._onclick = arr[name].onclick;
            }
            else
            if (name == 'btn_cancel'){
                btn._onclick = function(){
                    this._destruct();
                }.bind(this);
            }
        }
    },


	//Relaunch settings on exit
	//_onclose: function(){}
};