function obj_chat_toolbar(){};

obj_chat_toolbar.prototype = {
    __constructor:function(){

		this.__aFolder = {};

		//Notification switch
		if (GWOthers.getItem('CHAT','visual_notify')>'0' || GWOthers.getItem('CHAT','sound_notify')>'0'){
			this._create('notify','obj_checkbox','notify','switch right')._title('CHAT::NOTIFY_SW');
		}

		//// LABEL ////
		this._create('label', 'obj_label', 'room')._escape = true;
		this.label._onchange = function(){
			if (this._value().length){
				if (this.__eIN.scrollWidth){
					this._main.style.minWidth = Math.min(150, this.__eIN.scrollWidth + 1) + 'px';
					return;
				}

				setTimeout(function(){
					if (this && !this._destruced)
						this._onchange();
				}.bind(this), 500);
			}
			else{
				this._main.style.minWidth = 0;
			}
		};

		//// STATUS ////
		this._create('status', 'obj_room_status', 'room');

		//// MENU ////
		this._create('menu', 'obj_hmenu', 'menu');
		this.menu._fillMe = function(id){
			var tab,tabs = [
				{
					title: 'CHAT::ROOM',
					arg: 'room'
				},
				{
					title: 'CHAT::FILES',
					arg: 'files'
				},
				{
					title: 'CHAT::EVENTS',
					arg: 'events'
				},
				{
					title: 'CHAT::MEMBERS',
					arg: 'members'
				}
			];

			tabs.map(function(v){
				if (v.arg == id){
					tab = v;
					v.css = "active";
				}
				return v;
			});

			this._fill([].concat(
				tabs,
				[{
					title: tab.title,
					arg: tab.arg,
					css: 'obj_context short',
					nodes:tabs.map(function(v){
						var o = clone(v);
						o.css = "ico2";
						if (o.arg == id){
							o.css += " check";
						}
						return o;
					})
				}]
			), 'static');
		};
		this.menu._fillMe('room');

		this.menu._onclick = function(e, elm, id, arg){
			this.tabs._value(arg);
		}.bind(this._parent);

		this._parent.tabs._obeyEvent('onchange', [function(e, arg){
			if (this && !this._destruced && arg.value)
				this._fillMe(arg.value);
			else
				return false;
		}.bind(this.menu)]);

		//// BUTTONS ////
		this._create('buttons', 'obj_hmenu', 'buttons', 'buttons');
		this.buttons._fillMe = function(){

			var id = Cookie.get(['folders', this.__aFolder.aid, this.__aFolder.fid, 'tab']);

			if (Is.Empty(this.buttons.__aData)){
				var aFill = [
					{
						text:'',
						tooltip: 'CHAT::PINS',
						arg: 'pins',
						css: 'ico2 img pins local'
					},
					{
						text:'',
						tooltip: 'CHAT::MY_MENTIONS',
						arg: 'mentions',
						css: 'ico2 img mentions'
					}
				];

				if (id){
					aFill[id == 'mentions' ? 1 : 0].css += ' active';
				}

				this.buttons._fill(aFill, 'static');
			}
			else
			{
				[].forEach.call(this.buttons._main.querySelectorAll('li.ico2'), function(eli){
					if (id && hascss(eli, id))
						addcss(eli, 'active');
					else
						removecss(eli, 'active');
				});
			}

		}.bind(this);

		this.buttons._onclick = function(e, elm, id, arg){
			var v = this.panel._value();
			if (v == arg || (arg == 'pins' && v == 'local'))
				this.panel[arg].__deactive();
			else
				this.panel._value(arg);

		}.bind(this._parent);

		this._add_destructor('__destructor');
	},

	_setFolder:function(aFolder){

		if (this.__aFolder.fid && this.__aFolder.fid != aFolder.fid){
			this.__destructor();
		}

		this.__aFolder = aFolder;

		//Update window title & label
		var sTitle = dataSet.get('folders', [aFolder.aid, aFolder.fid, 'NAME']) || Path.basename(aFolder.fid);
		gui.frm_main._title(sTitle);
		this.label._value(sTitle);

		//Notification switch
		if (this.notify){
			this.notify._onchange = function(){
				dataSet.add('folders', [aFolder.aid, aFolder.fid, 'NOTIFY'], this._value() ? 1 : 0, true);
				WMFolders.action({
					aid: aFolder.aid,
					fid: aFolder.fid,
					xmlarray: {
						NOTIFY: [{
							VALUE: this._value() ? 1 : 0
						}]
					}
				}, 'folders', '', 'edit');
			};

			var value = +dataSet.get('folders', [aFolder.aid, aFolder.fid, 'NOTIFY']) > 0;
			this.notify._value(value, true);
		}

		//Status
		this.status._setFolder(aFolder);

		//Buttons
		dataSet.on('cookies', ['folders', aFolder.aid, aFolder.fid, 'tab'], this.__onTabUpdate, this, true);
	},

	__onTabUpdate:function(){
		if (this && this.buttons && !this.buttons._destruced)
			this.buttons._fillMe();
	},

	__destructor:function(){
		if (this.__aFolder.fid)
			dataSet.off('cookies', ['folders', this.__aFolder.aid, this.__aFolder.fid, 'tab'], this.__onTabUpdate);
	}
};