_me = obj_conference_home.prototype;

function obj_conference_home() {};

_me.__constructor = function () {

	this.__opt = {
		schedule: dataSet.get('accounts',[sPrimaryAccount, 'MEETING_PROVIDER']) === 'jitsi'
	};

	this._draw('obj_conference_home','cell', {
		schedule:this.__opt.schedule
	});

	this.btn_start._onclick = function(){
		storage.library('wm_conference');
		if(dataSet.get('main', ['conference'])) {
			wm_conference.get(dataSet.get('main', ['conference'])).join();
			this._view('progress');
		} else {
			this._view('name');
		}
	}.bind(this._parent);

	if (this.btn_schedule)
		this.btn_schedule._onclick = function(){
			this._view('schedule');
		}.bind(this._parent);

};
