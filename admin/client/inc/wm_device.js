function wm_device()
{
	this.xmlns='rpc';
}

wm_device.inherit(wm_generic);
var _me = wm_device.prototype;

_me.deleteAllDevices=function(who,filter,aHandler){
	var masks={
		namemask:[{VALUE:'*'}],
		status:[{VALUE:'0'}]
	};

	if(filter && filter.namemask){
		masks.namemask[0].VALUE=filter.namemask;
	}
	if(filter && filter.lastsyncmask){
		masks.lastsyncmask=[{VALUE:filter.lastsyncmask}];
	}
	if(filter && filter.statusmask){
		masks.statusmask=[{VALUE:filter.statusmask}];
	}
	
	var aRequest = {
		commandname:[{VALUE:'deletealldevices'}],
		commandparams:[{
			who:[{VALUE:who}],
			filter:[masks]
		}]
	};

	if(!aHandler[0]){aHandler=[aHandler];}
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	
	return true;
}

_me.deleteDevices=function(list,aHandler){

	log.log(list);
	var items=[];
	for(var i=0; i<list.length; i++)
	{
		items.push({VALUE:list[i].deviceid});
	}
	
	var aRequest = {
		commandname:[{VALUE:'deletedevices'}],
		commandparams:[{
			deviceslist:[{
				classname:[{VALUE:'tpropertystringlist'}],
				val:[{
					item:items
				}]
			}]
		}]
	};
	log.log(items);

	if(!aHandler[0]){aHandler=[aHandler];}
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	
	return true;
}

_me.setSoftWipe=function(deviceid,aHandler){
	try
	{
		var aRequest = {
			commandname:[{VALUE:'setdevicewipe'}],
			commandparams:[{
				deviceid:[{VALUE:deviceid}],
				wipetype:[{VALUE:1}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['setSoftWipe',e]);
	}
	
	return true;
};

_me.setHardWipe=function(deviceid,aHandler){
	try
	{
		var aRequest = {
			commandname:[{VALUE:'setdevicewipe'}],
			commandparams:[{
				deviceid:[{VALUE:deviceid}],
				wipetype:[{VALUE:0}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['setHardWipe',e]);
	}
	
	return true;
};

_me.setAllStatus=function(who,filter,status,aHandler){
	var masks={
		namemask:[{VALUE:'*'}],
		status:[{VALUE:'0'}]
	};

	if(filter && filter.namemask){
		masks.namemask[0].VALUE=filter.namemask;
	}
	if(filter && filter.lastsyncmask){
		masks.lastsyncmask=[{VALUE:filter.lastsyncmask}];
	}
	if(filter && filter.statusmask){
		masks.statusmask=[{VALUE:filter.statusmask}];
	}
	
	var aRequest = {
		commandname:[{VALUE:'setalldevicesstatus'}],
		commandparams:[{
			who:[{VALUE:who}],
			filter:[masks],
			statustype:[{VALUE:(status||status=="1"||status==1?'1':'0')}]
		}]
	};

	if(!aHandler[0]){aHandler=[aHandler];}
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	
	return true;
};

_me.setStatus=function(deviceid,status,aHandler){
	try
	{
		if(!aHandler[0]){aHandler=[aHandler];}
		
		if(typeof deviceid!='object'){
		deviceid=[deviceid];
		}
		if(typeof status!='object'){
			status=[status];
		}
		
		for(var i=0; i<deviceid.length; i++)
		{
			var aRequest = {
				commandname:[{VALUE:'setdevicestatus'}],
				commandparams:[{
					deviceid:[{VALUE:deviceid[i]}],
					statustype:[{VALUE:(status[i]?'1':'0')}]
				}]
			};
		
			this.create_iq(aRequest,[this,'__response',[aHandler]]);
		}
	}
	catch(e)
	{
		log.error(['setProperty',e]);
	}
	
	return true;
};

_me.setData = function(device,items,aHandler)
{
	var aRequest = {
		commandname:[{VALUE:'setdeviceproperties'}],
		commandparams:[{
			deviceid:[{VALUE:device}],
			propertyvaluelist:[{
				item:items
			}],
		}]
	};

	log.log(items);

	if(!aHandler[0]){aHandler=[aHandler];}
	
	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.setProperty=function(deviceid,property,value,aHandler){
	var items=[];

	if(typeof property!='object'){
		property=[property];
	}
	if(typeof value!='object'){
		value=[value];
	}

	try
	{
		var items=[];
		for(var i=0; i<property.length; i++){
			items.push({
				apiproperty:[{propname:[{VALUE:property[i]}]}],
				propertyval:[{
					classname:[{VALUE:'tpropertystring'}],
					val:[{VALUE:value[i]}]
				}],
			});
		}
		
		var aRequest = {
			commandname:[{VALUE:'setdeviceproperties'}],
			commandparams:[{
				deviceid:[{VALUE:deviceid}],
				propertyvaluelist:[{
					item:items
				}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['setProperty',e]);
	}
	
	return true;
}

_me.deviceInfo=function(deviceid,aHandler){
	var items=[];

	try
	{
		var list=[
			'Device_Account',
			'Device_ID',
			'Device_Name',
			'Device_Type',
			'Device_Registered',
			'Device_Status',
			'Device_OS',
			'Device_Model',
			'Device_LastSync',
			'Device_Protocol',
			'Device_RemoteWipe'
		];
		
		var items=[];
		for(var i=0; i<list.length; i++){
			items.push({propname:[{VALUE:list[i]}]});
		}
		
		var aRequest = {
			commandname:[{VALUE:'getdeviceproperties'}],
			commandparams:[{
				deviceid:[{VALUE:deviceid}],
				devicepropertylist:[{
					item:items
				}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['device list',e]);
	}
	
	return true;
}

_me.deviceSynchronization=function(deviceid,aHandler){
	var items=[];

	try
	{
		var list=[
			'Device_Account',
			'Device_ID',
			'Device_Name',
			'Device_SyncMail',
			'Device_SyncMailPast',
			'Device_SyncMailPastMax',
			'Device_SyncCal',
			'Device_SyncCalPast',
			'Device_SyncCalPastMax',
			'Device_SyncTaskAs',
			'Device_SyncTaskAsValue',
			'Device_SyncTaskAsType',
			'Device_SyncNotesAs',
			'Device_SyncNotesAsValue',
			'Device_SyncNotesAsType',
			'Device_SyncGroupwareFolders',
			'Device_SyncMailFolders',
			'Device_SyncSharedFolders',
			'Device_SyncArchiveFolders',
			'Device_SyncPublicFolders'
		];
		
		var items=[];
		for(var i=0; i<list.length; i++){
			items.push({propname:[{VALUE:list[i]}]});
		}
		
		var aRequest = {
			commandname:[{VALUE:'getdeviceproperties'}],
			commandparams:[{
				deviceid:[{VALUE:deviceid}],
				devicepropertylist:[{
					item:items
				}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['device list',e]);
	}
	
	return true;
}

_me.deviceList=function(who,itemsPerPage,page,namemask,lastsyncmask,statusmask,aHandler){
	if(!who){who='';}
	
	try
	{
		var masks={
			namemask:[{VALUE:'*'}],
			status:[{VALUE:'0'}]
		};
		
		if(namemask){
			masks.namemask=[{VALUE:namemask}];
		}
		if(lastsyncmask){
			masks.lastsync=[{VALUE:lastsyncmask}];
		}
		if(statusmask){
			masks.status=[{VALUE:statusmask}];
		}
		
		var aRequest = {
			commandname:[{VALUE:'getdevicesinfolist'}],
			commandparams:[{
				who:[{VALUE:who}],
				filter:[masks],
				offset:[{VALUE:(itemsPerPage*page)}],
				count:[{VALUE:itemsPerPage}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['device list',e]);
	}
	
	return true;
}

_me.__response = function(aData,aHandler){
	var out = aData;

	executeCallbackFunction(aHandler,out);
};

if(!com){var com={};}
com.device = new wm_device();
