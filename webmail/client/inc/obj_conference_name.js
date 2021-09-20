_me = obj_conference_name.prototype;

function obj_conference_name() {};

_me.__constructor = function () {

	this.__opt = {
		back_button: getLang('FORM_BUTTONS::BACK')
	};

	this._draw('obj_conference_name','cell');

	gui._obeyEvent('conference_window_closed', [function() {
		me._parent._view('home');
	}]);

	var password = this.password,
		name = this.name,
		label = this.label,
		btn_continue = this.btn_continue,
		aPassword = this._getAnchor('password'),
		me = this;

	btn_continue._onclick = function(){
		if (!name._checkError.length){
			btn_continue._disabled(true);
			me._create('loader', 'obj_loader', '');
			storage.library('wm_conference');
			wm_conference.create(function(conference) {
				me._parent._view('home', false, true);
				conference.join();
			}, {
				subject: name._value(),
				password: password._value()
			});
		}
	};

	name._restrict("\\S+");
	name._onerror = function(b){
		btn_continue._disabled(b);
	};
	name._onsubmit = btn_continue._onclick;

	label._onclick = function() {
		if(hascss(aPassword, 'hidden')) {
			storage.library('wordGen', 'wordGen');
			password._value(password._value() || (wordGen() + (Math.random() * 899999999 + 100000000)).slice(0, 10));
			label._value(getLang('CONFERENCE::REMOVE_PASSWORD'));
			removecss(aPassword, 'hidden');
			password.__eIN.select();
		} else {
			password._value('');
			label._value(getLang('CONFERENCE::SET_PASSWORD'));
			addcss(aPassword, 'hidden');
			name._focus();
		}
	};
};
