function frm_addroom_private(){};

frm_addroom_private.prototype = {
    __constructor:function(view){
		this.__aData = view.data;

		view.title('CHAT::ADD_ROOM_PRIVATE_CAPTION');

		view.buttons({
            'btn_next':{value:'FORM_BUTTONS::CREATE', css:'color1', disabled: true, onclick:function(){
				view.parent._final({
					type:'private',
					name:this.name._value().trim(),
					members:this.members._value()
				});
            }.bind(this)},
            'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}
		});

		this.members.btn_members._onclick = function(){
			this.add_address = gui._create('add_address', 'frm_addaddress', '', '', [this, '_onPopupClose'], {members:'CHAT::MEMBERS'}, {members:this.members._value()}, 'members', true, false, true);
			this.add_address._modal(true);
		}.bind(this);

		this.name._restrict('![/\\\\:\?\"\<\>\|\~]+','','^.{1,255}$');
		this.name._onerror = function(b){
			view.parent.btn_next._disabled(b);
		};
		this.name._onsubmit = function(){
			if (this.__check())
				view.parent.btn_next._onclick();
		};
	},
	_onPopupClose:function(bOK, aAddresses){
		bOK && this.members._value(aAddresses['members'].join(', '));
		delete this.add_address;
	}
};