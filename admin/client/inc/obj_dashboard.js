_me = obj_dashboard.prototype;
function obj_dashboard(){};

/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	me.__otherBoxes=[];
	me.__number_of_labels=0;
	me.__refreshServicesTimeout_seconds=5;

	storage.library('wm_server');

	me.__groups={};
	me.__groups.mail_services={
		status:false,
		label:"dashboard::mail_services",
		items:{
			smtp:{
				label:"dashboard::smtp"
			},
			imap:{
				label:"dashboard::imap"
			},
			pop3:{
				label:"dashboard::pop3"
			}
		}
	};

	me.__groups.web_services={
		status:false,
		label:"dashboard::web_services",
		items:{
			control:{
				label:"dashboard::control",
				hide:{restart:true}
			},
			ftp:{
				label:"dashboard::ftp",
				hide:{restart:true}
			},
			socks:{
				label:"dashboard::socks",
				hide:{connections:true,data:true,restart:true,statistics:true},
			}
		}
	};

	me.__groups.supportive_services={
		status:false,
		label:"dashboard::supportive_services",
		items:{
			minger:{
				label:"dashboard::minger",
				hide:{connections:true,data:true,restart:true,statistics:true},
			},
			ldap:{
				label:"dashboard::ldap",
				hide:{connections:true,data:true,restart:true,statistics:true},
			},
			snmp:{
				label:"dashboard::snmp",
				hide:{connections:true,data:true,restart:true,statistics:true},
			}
		}
	};

	me.__groups.communication={
		status:false,
		label:"dashboard::communication",
		items:{
			im:{
				label:"dashboard::im"
			},
			sip:{
				label:"dashboard::voip",
			},
			sms:{
				label:"dashboard::sms",
				hide:{connections:true,data:true,restart:true,statistics:true},
			},
			meeting:{
				label:"dashboard::meeting",
				hide:{connections:true,data:true,statistics:true},
			}
		}
	};

	me.__groups.collaboration={
		status:false,
		label:"dashboard::collaboration",
		items:{
			calendar:{
				label:"dashboard::calendar"
			},
			syncpush:{
				label:"dashboard::groupware_notification",
				hide:{connections:true,data:true,restart:true,statistics:true},
			},
			webclient:{
				label:"dashboard::webclient",
				hide:{connections:true,data:true,restart:true,statistics:true},
			},
			caldav:{
				label:"dashboard::webdav",
				hide:{connections:true,data:true,restart:true,statistics:true},
			},
			teamchat:{
				label:"dashboard::teamchat",
				hide:{connections:true,statistics:true},
			}
		}
	};

	me.__groups.security={
		status:false,
		label:"dashboard::security",
		items:{
			antivirus:{
				label:"dashboard::antivirus",
				hide:{connections:true,data:true,statistics:true},
			},
			antispam:{
				label:"dashboard::antispam",
				hide:{connections:true,data:true,statistics:true},
			}
		}
	};

	me.__groups.mobility={
		status:false,
		label:"dashboard::mobility",
		items:{
			activesync:{
				label:"dashboard::activesync",
				hide:{connections:true,data:true,restart:true,statistics:true},
			}/*,
			syncml:{
				label:"dashboard::syncml",
				hide:{connections:true,data:true,restart:true,statistics:true},
			}*/
		}
	};

	/* set onbefore destruct listener */
	this._add_destructor('__onbeforedestruct');
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){
	// clear refresher
	if(this._realtime){
		clearTimeout(this._realtime);
	}
	if(this.__refreshServicesInterval){
		clearTimeout(this.__refreshServicesInterval);
	}
	// destruct all boxes created by dashboard
	for(var i=0; i<this.__otherBoxes.length; i++){
		this.__otherBoxes[i]._destruct();
	}
}
/** */

_me.__onclick = function(e){
	log.log('clicked',e);
};

_me._onSearch=function(string){
	dataSet.add('dashboard-filter',['search'],string);
}

_me._updateGroupsData=function(items){
	try
	{
		for(var gkey in this.__groups){
			for(var ikey in this.__groups[gkey].items){
				if(!this.__groups[gkey].items[ikey].data){
					this.__groups[gkey].items[ikey].data={
						connections:0,
						data:0,
						status:false,
						type:0,
						uptime:0
					};
				}

				if(items[ikey]){
					this.__groups[gkey].items[ikey].data=items[ikey];
					if(this.__groups[gkey].items[ikey].hide)
					{
						if(this.__groups[gkey].items[ikey].hide.connections){
							delete this.__groups[gkey].items[ikey].data.connections;
						}
						if(this.__groups[gkey].items[ikey].hide.data){
							delete this.__groups[gkey].items[ikey].data.data;
						}
					}
				}else{
					log.error("Item ["+ikey+"] is not defined");
				}
			}
		}
	}
	catch(e)
	{
		log.error(e);
	}
}

_me._updateGroups=function(){
	var me=this;
	/* LOAD GROUPS */
	for(var key in me.__groups){
		if(!me._box_services[key]){
			me.__groups[key].object=me._box_services._create(key,'obj_dashboard_servicesgroup','groups');
		}
		me.__groups[key].object._label(me.__groups[key].label);
		for(var key2 in me.__groups[key].items){
			// load items in group
			//if(!me.__groups[key].object[key2]){
				me.__groups[key].object._addItem(key2,me.__groups[key].items[key2]);
			//}
		}
	}
	/** */
}

_me._updateTrafficData=function(items){

	var data=items;

	log.log(['dashboard-updatetrafficdata',data]);

	var web=0;
	log.log(['dashboard-_updateTrafficData',items]);
	if(data.control && data.control.connections){
		web=data.control.connections;
		web_max=data.control.maxconnections;
	}

	var smtp_restart=0;
	if(data.smtp && data.smtp.uptime){
		smtp_restart=data.smtp.uptime;
	}
	var period_value = ' / ' + smtp_restart.toTime(getLang('datetime::days').split(';'), true, {
		lessthanday:true
	});

	var smtp=0;
	if(data.smtp && data.smtp.connections){
		smtp=data.smtp.connections;
	}
	var smtp_max=0;
	if(data.smtp && data.smtp.maxconnections){
		smtp_max=data.smtp.maxconnections;
	}

	var mail=0;
	if(data.pop3 && data.pop3.connections){
		mail+=data.pop3.connections;
	}
	if(data.imap && data.imap.connections){
		mail+=data.imap.connections;
	}

	var mail_max=0;
	if(data.pop3 && data.pop3.maxconnections){
		mail_max+=data.pop3.maxconnections;
	}
	if(data.imap && data.imap.maxconnections){
		mail_max+=data.imap.maxconnections;
	}

	log.log(['dashboard-updatetrafficdata',web,mail,smtp]);

	this._getAnchor('traffic_web').innerHTML=web + '/' + web_max;
	this._getAnchor('traffic_mail').innerHTML=mail + '/' + mail_max;
	this._getAnchor('traffic_smtp').innerHTML=smtp + '/' + smtp_max;
	if(gui.frm_main.topbar) {
		var send_period = gui.frm_main.topbar._getAnchor('mail_sent_period');
		send_period && (send_period.textContent = period_value);
		var received_period = gui.frm_main.topbar._getAnchor('mail_received_period');
		received_period && (received_period.textContent = period_value);
	}
}

_me._refreshServices=function(){
	var me=this;
	com.server.services(function(items){

		try
		{
			/** Use data */
			me._updateGroupsData(items);
			me._updateTrafficData(items);
			me._updateGroups();
			/** */
		}
		catch(e)
		{
			log.error(e);
		}
	});
}

_me._hash_handler = function(e,aData)
{
	var me=this;

	log.log('Dashboard should be loaded');

	if (gui._globalInfo.admintype!=USER_ADMIN && gui._globalInfo.admintype!=USER_WEB){
		location.hash="";
		return true;
	}

	/* define boxes */
	var box_chart=me._parent;
		box_chart._init({
			name:'dashboard',
			heading:{
				value:getLang('dashboard::current_traffic')
			}
		});
	var box_services=gui.frm_main._create('thebox','frm_box','main_box');
		me._box_services=box_services;
		me.__otherBoxes.push(box_services);
		box_services._init({
			name:'dashboard_services',
			heading:{
				value:getLang('dashboard::services_statuses')
			}
		});
		addcss(box_services._getAnchor('main_content'),'no-padding');
	/* */

	/* draw */
	me._draw('obj_dashboard', '', {});
	box_services._draw('obj_dashboard_services', 'main_content', {});

	gui.frm_main._initTopbar('dashboard');

	// services
	var servicesAllowed={
		smtp:true,
		pop3:true,
		control:true,
		im:true,
		calendar:true,
		imap:true,
		ftp:true
	};
	var servicesList=com.server.__servicesList;
	var servicesListDropdown={};
	for(var i=0; i<servicesList.length; i++){
		if(servicesAllowed[servicesList[i]]){
			servicesListDropdown['*'+i]=getLang('dashboard::'+servicesList[i]);

		}
	}
	me.dropdown_action._fill(servicesListDropdown);
	me.dropdown_time_period._fill({
		realtime:getLang("dashboard::realtime"),
		hour:getLang('dashboard::hour'),
		day:getLang('dashboard::day'),
		month:getLang('dashboard::month')
	});
	me.dropdown_category._fill({
		'*0':getLang('dashboard::server_data'),
		'*1':getLang('dashboard::client_data'),
		'*2':getLang('dashboard::connections'),
		'*3':getLang('dashboard::received'),
		'*4':getLang('dashboard::sent')
	});
	/* */

	/** ON methods */
	me.button_cancel._onclick=function(){
		me.dropdown_action._value(2,true);
		me.dropdown_time_period._value('realtime',true);
		me.dropdown_category._value(0,true);
		me._stopRealtime();
		me._updateChart();
	}
	me.dropdown_category._onchange=me.dropdown_time_period._onchange=me.dropdown_action._onchange=function(){
		log.log('dashboard-chartparameters-changed');
		if(me._realtime_action){
			delete me._realtime_action;
		}
		me._stopRealtime();
		me._updateChart();
	}
	/** */

	/* DEFAULT */
	me.button_cancel._onclick();
	/* */

	/** Load service data from server and set timeout */
	me._refreshServices();
	me.__refreshServicesInterval=setInterval(function(){if(me){me._refreshServices();}},me.__refreshServicesTimeout_seconds*1000);
	/** */

	com.properties.get('c_gw_connectionstring',function(p){
		var v = p.value.split(';');

		if(v[5]==3) {
			me.__groups.collaboration.items.teamchat.deny = {start: getLang("DASHBOARD::SQLITE")};
		}

	});
}

_me._limiter=function(type,length,every,callback){
	var me=this;

	log.log(['dashboard-limiter',me._main.offsetWidth,type,length,every]);

	if(!me['__'+type+'_labelcounter']){me['__'+type+'_labelcounter']=0;}
	if(!me['__'+type+'_iterationcounter']){me['__'+type+'_iterationcounter']=0;}

	if(
		Math.abs(
			(me['__'+type+'_iterationcounter'] /
				(length-1)
			) -
			(
				(
					me['__'+type+'_labelcounter'] /
					(every-1)
				)
			)
		)
		<=
		0.5/(length-1)
	){
		me['__'+type+'_labelcounter']++;
	}else{
		if(callback){callback();}
	}

	me.distancecounter++;
	me['__'+type+'_iterationcounter']++;
	if(me['__'+type+'_iterationcounter']==length){me['__'+type+'_iterationcounter']=0;me['__'+type+'_labelcounter']=0;}
}

_me._updateChart=function(noanimation){
	try
	{
		var me=this;
		me._noanimation=noanimation;

		var service=(this._realtime_action?this._realtime_action:me.dropdown_action._value());
		var period=(this._realtime?'realtime':me.dropdown_time_period._value());
		var type=me.dropdown_category._value();
		this._realtime_action=service;

		if(period=='realtime'){
			if(type!='2'){
				me.dropdown_category._value(2); // set category to "connections"
				return false;
			}
			me._startRealtime();
		}

		com.server.trafficCharts(service,type,period,function(res){
		try
		{
			var onlyInteger=false;	// do not show only rounded numbers by default
			var labels=[];
			var data=[];
			for(var i=0; i<res.length; i++){
				labels.push(helper.date('d.m.Y H:i:s',res[i].time));
				data.push(res[i].value);
				if(!onlyInteger && Math.floor(res[i].value)>=1){
					onlyInteger=true;
				}
			}
			/** CREATE CHART */

			if(!me._chart)
			{
				// options
				var responsiveOptions =[];
				/*
				var responsiveOptions = [
				['(min-width: 1000px)', {
					axisX: {
						labelInterpolationFnc: function(value, index) {
							return index % 6 === 0 ? 'X' + value : null;
						}
					}
				}]
				];
				*/
				//

				me.__labels=labels;
				me._chart = new Chartist.Line('.js-dashboard-current_traffic-graph', {
					labels: labels,
					series: [
						{
							name: 'data',
							data: data
						}
					]
				}, {
					series:{
						data:{
							lineSmooth: Chartist.Interpolation.none(), // .step()
							showArea: true
						}
					},
					height: 300,
					fullWidth: true,
					chartPadding: {
						right: 40
					},
					axisX: {
						showGrid: false,
						labelInterpolationFnc: function(value, index) {

							// ommit first label
							if(index==0){return null;}

							var margin=10; // in px
							var max_width=me._main.offsetWidth;
							var label_width=100; // in px
							var labels_count=me.__labels.length;

							var every=Math.ceil(labels_count/(max_width/(label_width+2*margin)));
							if(every<=0){return value;}
							return index % every === 0 ? value : null;
						}
					},
					axisY: {
						scaleMinSpace: 30,
						onlyInteger: onlyInteger
					}
				},responsiveOptions);

				/* ANIMATION */
				var last=[];
				if(me._last){last=me._last};
				me._last=last;
				var delay=2000;
				me._chart.on('draw', function(data) {
					var from=false;
					var from_x=false;
					var from_y=false;
					var opacity_from=0;

					if(data.type==='point'){
						// comment to enable points
						data.element.animate({
							opacity: {
								begin: 0,
								dur: delay,
								from: 0,
								to: 0
							}
						});
						return false;
						//
					}

					if(data.type === 'label' && data.axis.units.pos === 'x') {
						data.element.attr({
							x: data.x - data.width / 2 - 50
						});

						if(me.__number_of_labels==0){
							var span=data.element._node[(data.element._node.childNodes?'childNodes':'children')][0];

							log.info(['X-dashboard',span]);

							if(span.style){
								span._width=span.offsetWidth;
								span.style.width='auto';
								span.style.position='absolute';
							}
							log.info(['dashboard-updatechart-data',data,me.__number_of_labels,data.element._node,span.offsetWidth]);
							me.__number_of_labels=Math.floor(me._main.offsetWidth/span.offsetWidth*0.5);
							if(span.style){
								span.style.position='';
								span.style.width=span._width+'px';
							}
						}
						/*
						me._limiter(data.type,labels.length,me.__number_of_labels,function(){
							data.element.animate({
								opacity: {
									begin: 0,
									dur: delay,
									from: 0,
									to: 0
								}
							});
						});
						*/

					} else if(data.type === 'label' && data.axis.units.pos === 'y') {

						if(!(data.element._node[(data.element._node.childNodes?'childNodes':'children')][0].style)){
							// I'm sorry, but IE
						}else{
							data.element.attr({
								y: data.y + data.height / 2
							});
						}
					}
					if(data.type==='point' && me._noanimation){
						// uncomment to enable points
						/*
						me._limiter(data.type,labels.length,me.__number_of_labels,function(){
							data.element.animate({
								opacity: {
									begin: 0,
									dur: delay,
									from: 0,
									to: 0
								}
							});
						});
						*/
					}

					if(me._noanimation){return false;}

					if(data.type==='line' || data.type==='area'){
						if(last[data.type+'_'+data.seriesIndex]){
							from=last[data.type+'_'+data.seriesIndex];
						}
						else{
							from=data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify();
						}
						last[data.type+'_'+data.seriesIndex]=data.path.clone().stringify();
					}else if(data.type==='point'){
						if(last[data.type+'_'+data.seriesIndex+'_'+data.index]){
							from_y=last[data.type+'_'+data.seriesIndex+'_'+data.index].y;

							opacity_from=1;
						}
						else{
							from_y=data.y;
							from_x=data.x;
						}
						last[data.type+'_'+data.seriesIndex+'_'+data.index]={x:data.x,y:data.y};
					}

					if(data.type === 'line' || data.type === 'area') {
						data.element.animate({
							d: {
								begin: 0,
								dur: delay,
								from: from,
								to: data.path.clone().stringify(),
								easing: Chartist.Svg.Easing.easeOutQuint
							}
						});
					}else if(data.type === 'point') {

						var limiter=true;
						me._limiter(data.type,labels.length,me.__number_of_labels,function(){
							limiter=false;
						});

						data.element.animate({
							y1: {
								begin: 0,
								dur: delay,
								from: from_y,
								to: data.y,
								easing: Chartist.Svg.Easing.easeOutQuint
							},
							y2: {
								begin: 0,
								dur: delay,
								from: from_y,
								to: data.y,
								easing: Chartist.Svg.Easing.easeOutQuint
							},
							opacity: {
								begin: Math.floor(delay/2),
								dur: delay,
								from: opacity_from,
								to: (limiter?1:0)
							}
						});
					}
				});
				/* */

				//me._chart=chart;
			}
			/** UPDATE CHART */
			else
			{
				try
				{
					me.__labels=labels;
					var data={
						labels: labels,
						series: [
							{
								name: 'data',
								data: data
							}
						]
					};
					log.log(data);
					me._chart.update(data,{
						//showArea: showArea_status,
						//showPoint: showPoint_status
						axisY: {
							onlyInteger: onlyInteger
						}
					},true);
				}
				catch(e){}
			}
		}
		catch(e)
		{
			log.log(['dashboard-catch2',e]);
		}
		});
	}
	catch(e)
	{
		log.log(['dashboard-catch',e]);
	}
}

_me._startRealtime=function(){
	var me=this;
	if(!this._realtime)
	{
		this.dropdown_category._readonly(true);	// disable category selection
		this._realtime=setInterval(function(){
			me._updateChart(true);
		},5000);
	}
}

_me._stopRealtime=function(){
	this.dropdown_category._readonly(false);	// enable category selection
	if(this._realtime){
		clearInterval(this._realtime);
		if(this._realtime){delete this._realtime;}
	}
}
