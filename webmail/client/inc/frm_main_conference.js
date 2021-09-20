_me = frm_main_conference.prototype;

function frm_main_conference() {};

_me.__constructor = function () {

	this.__opt = {
		full: dataSet.get('accounts',[sPrimaryAccount, 'MEETING_PROVIDER']) == 'jitsi'
	};

	gui.frm_main.title._add(getLang('CONFERENCE::TITLE'));

	if (this.__opt.full){
		addcss(this._main, 'full');
	}

	this._draw('frm_main_conference', 'main', {
		full:this.__opt.full
	});

	gui._obeyEvent('conference_started', [this, '_updateView']);
	gui._obeyEvent('conference_ended', [this, '_updateView']);

	this._updateView(true);
};

_me._updateView = function(bForce){
	//auto disobey
	if (!this || this._destructed)
		return false;

	if (dataSet.get('main', ['conference']))
		this._view('progress');
	else if (bForce || (this.__currentView === 'progress'))
		this._view('home');
};

_me._view = function(sView, aData, bDestructOld){

	if (this.__currentView === sView)
		return;

	var o;
	switch(sView){
		case 'name':
			o = this._create('name','obj_conference_name', 'view_pane');
			break;
		case 'schedule':
			o = this._create('schedule','obj_conference_schedule', 'view_pane');
			break;
		case 'progress':
			o = this._create('progress','obj_conference_progress', 'view_pane');
			break;

		default:
			o = this._create('home','obj_conference_home', 'view_pane');
	}

	this.__currentView = sView;

	if (o){

		//draw Back button
		var back = this._getAnchor('back');
		if (o.__opt && o.__opt.back_button){
			back.textContent = o.__opt.back_button;
			back.onclick = function(){
				this._view(o.__opt.back_action || 'home', null, true);
			}.bind(this);
			addcss(this._main, 'back');
		}
		else
			removecss(this._main, 'back');

		if (o.__destructTimer)
			clearTimeout(o.__destructTimer);

		if (this.__current){
			addcss(this.__current._main, 'flyout');

			removecss(o._main, 'flyout');
			addcss(o._main, 'flyin');

			if (bDestructOld || ['obj_conference_schedule', 'obj_conference_name'].indexOf(this.__current._type) == -1){
				this.__current.__destructTimer = setTimeout(function(){
					if (this && !this._destructed)
						this._destruct();
				}.bind(this.__current), 500);
			}
		}

		this.__current = o;
	}
};

_me._showsearch = function(aFolder,bFocus){

	this.__aid = aFolder.aid;
	this.__fid = aFolder.fid;

	if (this.__opt.full){
		this.tabs._onchange = function(sTab){
			//Set actual value
			if (sTab){
				if (this[sTab].list && this[sTab].list && this[sTab].list._search && GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1')
					gui.frm_main.search._value(gui.frm_main.search._value(), true);
				else
					gui.frm_main.search._deactivate();
			}
		};

		this.tabs.upcoming._onactive = function(){
			this.list.__options.search = 'afterend:now';
			this.list._serverSort(aFolder, false, {
				search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
			});
		};

		this.tabs.history._onactive = function(bFirst){

			if (bFirst){
				this._create('list', 'obj_list_conference','','history');
				this.list.__options.order = 'desc';
			}
			var journal = GWOthers.getItem('DEFAULT_FOLDERS', 'JOURNAL').split('/');
			this.list._serverSort({
				aid: journal[0],
				fid: journal[1]
			}, false, {
				search: GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1' ? gui.frm_main.search._value() : ''
			});
		};

		this.tabs._value('upcoming');

		gui.frm_main.search._onsearch = function(v){
			if (this.tabs){
				var tab = this.tabs[this.tabs._value()];

				//Search in main list
				if (tab.list && tab.list._search)
					tab.list._search(v);
			}
		}.bind(this);

		gui.frm_main.search._setFolder(aFolder);
		gui.frm_main.search._focus(bFocus);
	}
};

_me._serverSort = function(bForce){
	if (this.__opt.full){
		if (bForce)
			this.tabs._value(this.tabs._value());
		else
			this.tabs[this.tabs._value()].list._serverSort();
	}
};

_me._scheduleConference = function () {
	Item.openwindow([
		sPrimaryAccount,
		frm_main_conference.FOLDER
	], {
		conference: true
	});
};
