_me = frm_reauth.prototype;
function frm_reauth(){};

_me.__constructor = function(){

	this._title('CONFIRMATION::AUTHENTICATION');
	this._resizable(false);
	this._dockable(false);
	this._closable(false);
	this._modal(true);
	this._size(450,350,true);

	this._draw('frm_reauth','main');

	// Sign In button
	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder color1 ok');
	this.x_btn_ok._value('FORM_BUTTONS::SIGN_IN');
	this.x_btn_ok._onclick = function() {
		var p = this._parent,
			v = p.x_password._value();

		if (p.x_password._checkError.length === 0){

			p._create('loader','obj_loader');

			auth.reconnect(dataSet.get('main',['user']), v, [
				function(bOk){
					if (bOk)
						p._destruct();
					else{
						p.loader && p.loader._destruct();
						gui.notifier._value({type:'alert', args:{header:'CONFIRMATION::AUTHENTICATION',text:'ALERTS::PASSWORD_INCORRECT'}});
						p.x_password._setRange(0, v.length);
					}
				}
			]);
		}
	};

	//password inp
	this.x_password._onsubmit = function (){
		this._parent.x_btn_ok._onclick();
	};
	this.x_password._onerror = function(b){
		this._parent.x_btn_ok._disabled(b);
	};
	this.x_password._restrict(/.+/);

	// Cancel button, causes logout
	this._create('x_btn_cancel', 'obj_button', 'footer', 'noborder cancel color2 x_btn_right simple');
	this.x_btn_cancel._value('MAIN_MENU::LOGOUT');
	this.x_btn_cancel._onclick = function(){
		dataSet.add('main',['sid'],'');
		gui.frm_main.__logout();
	};

	this._size(450, Math.max((this.__eMain.scrollHeight || this.__eMain.clientHeight)+90, 350), true);
};
