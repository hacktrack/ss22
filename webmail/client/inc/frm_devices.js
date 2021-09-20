_me = frm_devices.prototype;
function frm_devices(){};

_me.__constructor = function(){
	var me = this;
	this._title('MAIN_MENU::DEVICES');
	this._size(630,400,true);

	this._create('grid','obj_datagrid2','main');
	this.grid._cookiesEnabled = false;
	this.grid.__preload = 1000;
	this.grid._default_columns = function(){
		return{
			REMOTEWIPE:{title:'',width:20,css:'ico state',type:'static'},
			DEVICE:{title:"DEVICES::DEVICE_MODEL",css:'ico model',width:160},
			DEVICETYPE:{title:"DEVICES::DEVICE_TYPE",width:130},
			PROTOCOLVERSION:{title:"DEVICES::PROTOCOL",width:70},
			REGISTERED:{title:"DEVICES::REGISTERED",width:110},
			LASTSYNC:{title:"DEVICES::LASTSYNC",width:110,arg:{sort:'asc'}}
			};
	};
	// Use devices dataset
	this.grid._listen_data('devices','',false);

	this.grid._prepareBody = function (aItems, sFolType){

		var aRow = {}, tmp = [], d1 = new IcewarpDate(), d2 = new IcewarpDate(), aResult = {};

		me.__devices = aItems;

		for(var id in aItems){

			if (aItems[id].LASTSYNC) {
				d1 = IcewarpDate.unix(aItems[id].LASTSYNC || 0);
			}
			if (aItems[id].REGISTERED) {
				d2 = IcewarpDate.unix(aItems[id].REGISTERED || 0);
			}

			aRow = {
				"id":id,
				"data":{
					'DEVICE':(aItems[id].FRIENDLY_NAME || aItems[id].MODEL || WMItems.__serverID(id)),
					'DEVICETYPE':(aItems[id].OS || aItems[id].DEVICETYPE),
					'PROTOCOLVERSION':aItems[id].PROTOCOLVERSION,
					'REGISTERED':aItems[id].REGISTERED && d2?d2.format('L LT'):'',
					'LASTSYNC':aItems[id].LASTSYNC && d1?[d1.format('L LT'),aItems[id].LASTSYNC]:''
				},
				css:'',
				arg:{'id':id}
			};

			//OS Icon
			var os = aItems[id].OS || aItems[id].DEVICETYPE || '';
			if (/android/ig.test(os))
				aRow.css = 'android ';
			else
			if (/(windows)|(wp)|(outlook)/ig.test(os))
				aRow.css = 'windows ';
			else
			if (/blackberry/ig.test(os))
				aRow.css = 'berry ';
			else
			if (/(ipad)|(ios)|(apple)/ig.test(os))
				aRow.css = 'apple ';

			//Wipe
			switch(aItems[id].REMOTEWIPE){
				case '1':
					aRow.css += 'wipe';
					aRow.data.REMOTEWIPE = ['','',getLang('DEVICES::WIPING')];
					break;

				case '-1':
					aRow.css += 'no_wipe';
					aRow.data.REMOTEWIPE = ['','',getLang('DEVICES::NOWIPE')];
					break;
			}

			tmp.push(aRow);
		}

		//sort
		if (this.__sortColumn == 'LASTSYNC')
			if (this.__sortType == '1')
				tmp.sort(function(a,b){
					return b.data.LASTSYNC[1] - a.data.LASTSYNC[1];
				});
			else
				tmp.sort(function(a,b){
					return a.data.LASTSYNC[1] - b.data.LASTSYNC[1];
				});


		for (var i in tmp)
			aResult[tmp[i].id] = tmp[i];

		return aResult;
	};

	this.grid._ondblclick = function(e,elm,arg,row,col){
		if (row)
			me.btn_detail._onclick();
	};

	this._create('btn_detail','obj_button','footer','settings noborder');
	this.btn_detail._value('POPUP_ITEMS::PROPERTIES');
	this.btn_detail._disabled(true);
	this.btn_detail._onclick = function(){
		var v = me.grid._value();
		for (var i in v)
			gui._create('device','frm_device','main','',v[i]);
	};

	this._create('btn_del','obj_button','footer','noborder color2 trash x_btn_right');
	this.btn_del._value('POPUP_ITEMS::DELETE');
	this.btn_del._disabled(true);
	this.btn_del._onclick = function(){
		var v = me.grid._value();
		if (v.length)
			gui._create('frm_confirm','frm_confirm', '', '', [me,'_action', [v,'delete']],
				'POPUP_ITEMS::DELETE','DEVICES::DELETE_CONFIRMATION'
			);
	};

    this.grid._onclick = function(){
		var v = this._value(),
			b = v.length<0,
			b1 = b,
			b2 = b;

		if (!b){
			var b1 = true,
			    b2 = true;

			for(var i in v)
				if (!b1 && !b2)
				    break;
				else
				if (me.__devices[v[i]])
					if (me.__devices[v[i]].REMOTEWIPE == '0')
				        b1 = false;
				    else
				    if (me.__devices[v[i]].REMOTEWIPE == '1')
				        b2 = false;
		}

		me.btn_detail._disabled(b);
		me.btn_del._disabled(b);
/*
		me.btn_wipe._disabled(b);
		me.btn_reset._disabled(b);
*/
	};

	this.grid._serverSort({aid:sPrimaryAccount,fid:'__@@DEVICES@@__'},'LASTSYNC','desc');
};

_me._action = function(v,sAction){
	if (sAction){
		this.btn_detail._disabled(true);
		this.btn_del._disabled(true);
/*
		this.btn_wipe._disabled(true);
		this.btn_reset._disabled(true);
*/

		if (sAction == 'delete')
            this.grid._value([]);

		WMItems.action({aid:sPrimaryAccount,fid:'__@@DEVICES@@__',iid:v},sAction,[this,'_refresh']);
	}
};

_me._refresh = function(){
	this.grid._serverSort({aid:sPrimaryAccount,fid:'__@@DEVICES@@__'},'','',[this.grid,'_onclick']);
};