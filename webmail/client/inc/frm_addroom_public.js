function frm_addroom_public(){};

frm_addroom_public.prototype = {
    __constructor:function(view){

		view.title('CHAT::ADD_ROOM_PUBLIC_CAPTION');

		view.buttons({
            'btn_next':{value:'FORM_BUTTONS::CREATE', css:'color1', disabled: true, onclick:function(){
				view.parent._final({
					type:'public',
					name:this.name._value().trim(),
					group:this.group._getDataValue()
				});
            }.bind(this)},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
		});

		var groups = view.parent._getGroups(),
			select = 0;

		// preselect group
		if (view.data.fid){
			for (i = groups.length;i--;){
				if (groups[i][1] === view.data.fid){
					select = i;
					break;
				}
			}
		}

		this.group._fill(groups);
		this.group._value(select);

		this.name._restrict('![/\\\\:\?\"\<\>\|\~]+','','^.{1,255}$');
		this.name._onerror = function(b){
			view.parent.btn_next._disabled(b);
		};
		this.name._onsubmit = function(){
			if (this.__check())
				view.parent.btn_next._onclick();
		};
	}
};