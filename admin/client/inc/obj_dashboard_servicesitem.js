_me = obj_dashboard_servicesitem.prototype;
function obj_dashboard_servicesitem(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	me.__hide={};
	this.__deny = {};
	me._load();
	me.__status=false;

	/* set onbefore destruct listener */
	this._add_destructor('__onbeforedestruct');
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){
	// clear refresher
	if(this.__interval){
		clearInterval(this.__interval);
	}
}
/** */

_me._load = function()
{
	var that=this;
	var me=this;
	var parent=this._parent;

	me._draw('obj_dashboard_servicesitem', '', {}/*{items:items,info:info}*/);
	me._main.setAttribute('iw-flex-cell','');

	me._setActions(false);
}

_me._setActions=function(status){

	try
	{
		var me=this;
		var actions=[];

		this.__status=status;

		if(status && !me.__hide.statistics){
			actions.push({
				name:'statistics',
				icon:false,
				onclick:function(b,id){me._handleAction(id); return false;},
				value:"dashboard::statistics"
			});
		}

		if(status && !me.__hide.restart){
			actions.push({
				name:'restart',
				icon:false,
				onclick:function(b,id){me._handleAction(id); return false;},
				value:"dashboard::restart"
			});
		}

		if(status && !me.__hide.stop){
			actions.push({
				name:'stop',
				icon:false,
				onclick:function(b,id){me._handleAction(id); return false;},
				value:"dashboard::stop",
				type:"color-error"
			});
		}

		if(!status && !me.__hide.start){
			actions.push({
				name:'start',
				icon:false,
				onclick:function(b,id){me._handleAction(id); return false;},
				value:"dashboard::start",
				type:"color-success"
			});
		}
		if(me.actions){
			me.actions._fill(actions);
		}
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._hide=function(aHide){
	if(aHide){this.__hide=aHide};
	return this.__hide;
}

_me._deny=function(aDeny){
	if(aDeny){this.__deny=aDeny};
	return this.__deny;
}

_me._label= function(string){
	this._getAnchor('label').innerHTML=helper.htmlspecialchars(getLang(string));
}

_me._updateStatus=function(status){
	this._refresh({status:status,uptime:0});
	this._parent._updateStatus();
}

_me._setUptime=function(time){
	if(this.__doNotRefreshUptime){return false;}
	this.__intervalUptime=time;
}

_me._refresh=function(data){
	var me=this;
	
	/* connections */
	if(typeof data.connections != 'undefined'){
		var sConnections=data.connections.toString();
		me._getAnchor('connections').innerHTML=helper.htmlspecialchars(sConnections);
	}
	/** */
	
	/* data */
	if(typeof data.data != 'undefined'){
		var sData=helper.bytes2hr(data.data.toString(),false,[
				getLang('generic::size_b'),
				getLang('generic::size_kb'),
				getLang('generic::size_mb'),
				getLang('generic::size_gb'),
				getLang('generic::size_tb'),
				getLang('generic::size_pb')
			]
		);
		me._getAnchor('data').innerHTML=helper.htmlspecialchars(sData);
	}
	/** */
	
	/* uptime */
	if(typeof data.uptime != 'undefined'){
		if(me.__doNotRefreshUptime){return false;}
		var sUptime=data.uptime.toTime(getLang('datetime::days').split(';'));
			me._getAnchor('uptime').innerHTML=sUptime;
			
			if(me.__interval){clearInterval(me.__interval);}
			
			if(data.uptime!=0){
				me.__intervalUptime=data.uptime;
				me.__interval=setInterval(function(){
					me.__intervalUptime++;
					
					var sUptime=me.__intervalUptime.toTime(getLang('datetime::days').split(';'));
					me._getAnchor('uptime').innerHTML=sUptime;
				},1000);
			}else{
				me._getAnchor('uptime').innerHTML="00:00:00";
				me.__intervalUptime=0;
			}
	}
	/* */
	
	/* status */
	if(typeof data.status != 'undefined'){
		me._setActions(data.status);
		if(data.status){
			addcss(me._getAnchor('status'),'status-on');
			removecss(me._getAnchor('status'),'status-off');
		}else{
			addcss(me._getAnchor('status'),'status-off');
			removecss(me._getAnchor('status'),'status-on');
		}
	}
	/* */
}

_me._translateValue=function(name,value){
	try
	{
		var types={
			data:{
				// 1 - B, 2 - kB, 3 - MB
				memorypeak:1,
				memorysize:1,
				serverdatatotal:2,
				serverdatain:2,
				serverdataout:2,
				clientdatatotal:2,
				clientdatain:2,
				clientdataout:2
			},
			time:{
				uptime:true
			}
		};

		var type=false;
		for(var key in types){
			if(types[key][name]){
				type=key;
				break;
			}
		}

		if(type){
			switch(type){
				case 'data':
					var labels=[];
					if(types[type][name]<=1){
						labels.push(getLang('generic::size_b'));
					}
					if(types[type][name]<=2){
						labels.push(getLang('generic::size_kb'));
					}
					if(types[type][name]<=3){
						labels.push(getLang('generic::size_mb'));
					}

					labels.push(getLang('generic::size_gb'));
					labels.push(getLang('generic::size_tb'));
					labels.push(getLang('generic::size_pb'));

					return helper.bytes2hr(value,false,labels);
				break;
				case 'time':
					return value.toTime(getLang('datetime::days').split(';'));
				break;
			}
		}
	}
	catch(e)
	{
		log.error(e);
	}
	return value;
}

_me._showStatistics=function(stats){
	try
	{
		var prepared=[];
		for(var key in stats){
			prepared.push({
				name:getLang('service_statistics::'+key),
				value:this._translateValue(key,stats[key])
			});
		}
		log.log(['servicesitem-showstatistics',prepared]);

		var popup=gui._create('popup','obj_popup');
		popup._init({
			fixed:false,
			iwattr:{
				height:'full',
				width:'medium'
			},
			name:'statistics',
			heading:{
				value:getLang('dashboard::statistics')+' - '+getLang('dashboard::'+this._name)
			}
		});

		popup.main._draw('obj_dashboard_servicestats','main_content',{items:prepared});
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._handleAction = function(id){
	var me=this;

	if(this.__deny[id]) {
		gui.message.error(this.__deny[id]);
		return false;
	}

	switch(id){
		case 'statistics':
			try
			{
				log.log(['servicesitem-handleaction','statistics']);
				com.server.serviceStatistics(me._name,function(stats){
					log.log(['servicesitem-action-statistics',stats]);
					me._showStatistics(stats);
				});
			}
			catch(e)
			{
				log.error(e);
			}
		break;
		case 'settings':
			log.log(['servicesitem-handleaction','settings']);
		break;
		case 'restart':
			log.log(['servicesitem-handleaction','restart']);
			me._updateStatus(false);
			me.__doNotRefreshUptime=true;	// do not refresh running time
			com.server.restartService(this._name,function(response){
				me.__doNotRefreshUptime=false;	// refresh running time
				log.log(['servicesitem-handleaction-callback',response]);
				try
				{
					if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1'){
						me._updateStatus(true);
					}else{
						gui.message.error(getLang("error::service_restart_unsuccessful"));
					}
				}
				catch(e)
				{
					gui.message.error(getLang("error::service_restart_unsuccessful"));
				}
			});
		break;
		case 'stop':
			log.log(['servicesitem-handleaction','stop']);
			com.server.stopService(this._name,function(response){
				log.log(['servicesitem-handleaction-callback',response]);
				try
				{
					if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1'){
						me._updateStatus(false);
					}else{
						gui.message.error(getLang("error::service_stop_unsuccessful"));
					}
				}
				catch(e)
				{
					gui.message.error(getLang("error::service_stop_unsuccessful"));
				}
			});
		break;
		case 'start':
			log.log(['servicesitem-handleaction','start']);
			com.server.startService(this._name,function(response){
				log.log(['servicesitem-handleaction-callback',response]);
				try
				{
					if(response.Array.IQ[0].QUERY[0].RESULT[0].VALUE=='1'){
						me._updateStatus(true);
					}else{
						gui.message.error(getLang("error::service_start_unsuccessful"));
					}
				}
				catch(e)
				{
					log.error(['dashboard_servicesitem-service_start_unsuccessful',e]);
					gui.message.error(getLang("error::service_start_unsuccessful"));
				}
			});
		break;
	}
}
