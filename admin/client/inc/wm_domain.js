function wm_domain()
{
	this.xmlns='rpc';
}

wm_domain.inherit(wm_generic);
var _me = wm_domain.prototype;

_me.getAPI=function(perPage,page,mask,cb,clear,domain){
	com.console.getAPI(perPage,page,mask,cb,clear,'domain',domain);
}

_me.rulesInfoList=function(domain,itemsPerPage,page,aHandler,eHandler){
	var aRequest = {
		commandname:[{VALUE:'getrulesinfolist'}],
		commandparams:[{
			who:[{VALUE:domain}],
			offset:[{VALUE:(itemsPerPage*page)}],
			count:[{VALUE:(itemsPerPage)}]
		}]
	};

	if(!aHandler[0]){aHandler=[aHandler];}

	var h=[function(data){
		var processed=[];
		var max=0;
		try
		{
			if(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT && data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE){
				max=parseInt(data.Array.IQ[0].QUERY[0].RESULT[0].OVERALLCOUNT[0].VALUE);
			}
			var items=data.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
			if(items){
				for(var i=0; i<items.length; i++){
					processed.push({
						action:parseInt(items[i].ACTIONTYPE[0].VALUE),
						active:(items[i].ACTIVE[0].VALUE=='1'?true:false),
						condition:items[i].CONDITION[0],
						id:parseInt(items[i].RULEID[0].VALUE),
						title:items[i].TITLE[0].VALUE
					});
				}
			}
		}
		catch(e)
		{
			log.error([e,data]);
		}
		aHandler[0]({items:processed,overallcount:max});
	}];

	h=[this.__attachErrorHandler(h[0],eHandler)];

	this.create_iq(aRequest,[this,'__response',[h]]);
	return true;
}


_me.createDomain = function(domain,aHandler){
	this.executeCommand(
		this.createCommand(
			'CreateDomain',{
				domainstr: domain
			}
		),
		aHandler
	);
}

_me.setData = function(domain,items,aHandler)
{
	var aRequest = {
		commandname:[{VALUE:'setdomainproperties'}],
		commandparams:[{
			domainstr:[{VALUE:domain}],
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

_me.deviceList=function(who,itemsPerPage,page,namemask,lastsyncmask,statusmask,aHandler){
	var items=[];
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

_me.list = function(itemsPerPage,page,namemask,typemask,aHandler,eHandler)
{
	aHandler=[this.__attachErrorHandler(aHandler[0],eHandler)];

	var masks={
		namemask:[{VALUE:'*'}]
	};
	if(namemask){
		masks.namemask[0].VALUE=namemask;
	}
	if(typemask){
		masks.typemask=[{VALUE:typemask}];
	}

	var aRequest = {
		commandname:[{VALUE:'getdomainsinfolist'}],
		commandparams:[{
			filter:[masks],
			offset:[{VALUE:(itemsPerPage*page)}],
			count:[{VALUE:itemsPerPage}]
		}]
	};

	if(!aHandler[0]){aHandler=[aHandler];}

	this.create_iq(aRequest,[this,'__response',[aHandler]]);
	return true;
}

_me.rights=function(domain,list,aHandler){

	var items=[];

	try
	{
		for(var i=0; i<list.length; i++){
			items.push({propname:[{VALUE:list[i]}]});
		}

		var aRequest = {
			commandname:[{VALUE:'getmydomainrigths'}],
			commandparams:[{
				domainstr:[{VALUE:domain}],
				domainpropertylist:[{
					item:items
				}]
			}]
		};

		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['domain-rights',e]);
	}

	return true;
}

// Move user accounts from one domain to another
_me.moveAccounts = function(domain,list,aHandler) {

	var query = this.createCommand('moveaccounttodomain',{
		destdomain: domain,
		accountlist: {
			classname: 'TPropertyStringList',
			val: list
		}
	});

	this.executeCommand(query,aHandler);
}

// Delete user accounts from a domain
_me.deleteAccounts=function(domain,list,aHandler,eHandler){

	var items=[];

	try
	{
		for(var i=0; i<list.length; i++){
			items.push({VALUE:list[i].id});
		}

		var aRequest = {
			commandname:[{VALUE:'deleteaccounts'}],
			commandparams:[{
				domainstr:[{VALUE:domain}],
				accountlist:[{
					classname:[{VALUE:'tpropertystringlist'}],
					val:[{
						item:items
					}]
				}]
			}]
		};

		if(!aHandler[0]){aHandler=[aHandler];}

		if(eHandler){
			var rh=aHandler;
			aHandler=[function(data){
				try
				{
					if(data.Array.IQ[0].QUERY[0].ERROR){
						eHandler(data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);
					}else{
						rh[0](data);
					}
				}
				catch(e)
				{
					log.error(['wmdomain-deleteaccounts',e]);
				}
			}];
		}

		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['domain-deleteaccounts',e]);
	}

	return true;
}

_me.deleteAllAccounts=function(domain,filter,aHandler){
	var masks={
		namemask:[{VALUE:'*'}]
	};
	if(filter && filter.namemask){
		masks.namemask[0].VALUE=filter.namemask;
	}
	if(filter && filter.typemask){
		masks.typemask=[{VALUE:filter.typemask}];
	}

	try
	{
		var aRequest = {
			commandname:[{VALUE:'deleteallaccounts'}],
			commandparams:[{
				domainstr:[{VALUE:domain}],
				filter:[masks]
			}]
		};

		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[aHandler]]);
	}
	catch(e)
	{
		log.error(['delete accounts',e]);
	}

	return true;
}

_me.deleteDomain=function(domain,aHandler){
	try
	{
		var aRequest = {
			commandname:[{VALUE:'deletedomain'}],
			commandparams:[{
				domainstr:[{VALUE:domain}]
			}]
		};

		this.create_iq(aRequest,[this,'__response',[this._autoBooleanHandler(aHandler)]],false,'set');
	}
	catch(e)
	{
		log.error(['delete domain',e]);
	}

	return true;
}

_me.__response = function(aData,aHandler){
	var out = aData;

	executeCallbackFunction(aHandler,out);
};

_me.features=function(domain,cb){
	var cb=cb;
	com.console.item(function(result){
		log.log(result);
		var ret={};

		try
		{
			var items=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
		}
		catch(e)
		{
			log.error(['e:invalid-data',e]);
			return false;
		}

		try
		{
			for(var i=0; i<items.length; i++)
			{
				var propname=items[i].APIPROPERTY[0].PROPNAME[0].VALUE;
				var propval={};
				var bval=false;
				if(items[i].PROPERTYVAL && items[i].PROPERTYVAL[0]){
					propval=items[i].PROPERTYVAL[0];
					if(propval.VAL && propval.VAL[0] && propval.VAL[0].VALUE){
						bval=(propval.VAL[0].VALUE=="1" || propval.VAL[0].VALUE=="true"?true:false);
					}
				}

				try
				{
					log.log(propname.toLowerCase());

					switch(propname.toLowerCase())
					{
						case 'd_archive':
							n='archive';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_archivesupport':
							n='archive';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_im':
							n='im';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_imsupport':
							n='im';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_teamchat':
							n='teamchat';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_teamchatsupport':
							n='teamchat';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_webdocuments':
							n='webdocuments';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_webdocumentssupport':
							n='webdocuments';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_ftp':
							n='ftp';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_ftpsupport':
							n='ftp';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_sms':
							n='sms';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_smssupport':
							n='sms';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_avscan':
							n='avscan';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_avsupport':
							n='avscan';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_antispam':
							n='as';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_assupport':
							n='as';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_challengeresponse':
							n='quarantine';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_quarantinesupport':
							n='quarantine';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						case 'd_activesync':
							n='activesync';
							if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
							ret[n].value=bval;
						break;
						case 'd_eassupport':
							n='activesync';
							if(!ret[n]){ret[n]={editable:bval,value:0};}
							ret[n].editable=bval;
						break;
						// case 'd_syncml':
						// 	n='syncml';
						// 	if(!ret[n]){ret[n]={editable:false,value:0,source:items[i]};}
						// 	ret[n].value=bval;
						// break;
						// case 'd_syncmlsupport':
						// 	n='syncml';
						// 	if(!ret[n]){ret[n]={editable:bval,value:0};}
						// 	ret[n].editable=bval;
						// break;
					}
				}
				catch(e)
				{
					log.error(e);
				}
			}
		}
		catch(e)
		{
			log.error(e);
			return false;
		}
		cb(ret);
	}).domain([
		"d_archive",
		"d_archivesupport",
		"d_im",
		"d_imsupport",
		"d_teamchat",
		"d_teamchatsupport",
		"d_webdocuments",
		"d_webdocumentssupport",
		"d_sip",
		"d_sipsupport",
		"d_ftp",
		"d_ftpsupport",
		"d_sms",
		"d_smssupport",
		"d_avscan",
		"d_avsupport",
		"d_antispam",
		"d_assupport",
		"d_challengeresponse",
		"d_quarantinesupport",
		"d_calendar",
		"d_gwsupport",
		"d_webdav",
		"d_webdavsupport",
		"d_meeting",
		"d_meetingsupport",
		"d_activesync",
		"d_eassupport",
		// "d_syncml",
		// "d_syncmlsupport",
	],domain);
}

/*
_me.limits=function(domain,aHandler){
	com.console.item(aHandler).domain([
		'd_volumelimit',
		'd_accountnumber',
		'd_diskquota',
		'd_disablelogin',
		'd_usermb',
		'd_expires',
		'd_expireson_date',
		'd_notifyexpire',
		'd_notifybeforeexpires',
		'd_deleteexpired',

		'd_usermailbox',
		'd_usermsg',
		'd_numberlimit',
		'd_usernumber',
		'd_spamdeleteolder'
	],domain);
	return true;
}
*/
/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>getdomaininformations</commandname>
  <commandparams>
    <domainstr>stringval</domainstr>
  </commandparams>
</query>
</iq>
*/
_me.dns=function(domain,aHandler){
	var me=this;
	try
	{
		var aRequest = {
			commandname:[{VALUE:'getdomaininformations'}],
			commandparams:[{
				domainstr:[{VALUE:domain}],
			}]
		};

		var fc=this._preprocessResponse(function(response){
			var ret={
				records:[],
				general:{}
			};

			try
			{
				if(response.Array.IQ[0].QUERY[0].RESULT[0]){

					ret.records=me._parseSingleItems(response.Array.IQ[0].QUERY[0].RESULT[0].DNS[0].RECORDS[0].ITEM);
					ret.general=me._parseSingleItems(response.Array.IQ[0].QUERY[0].RESULT[0].GENERAL[0]);

					//record	0=rsMX , 1=rsAutodiscover , 2=rsAutodiscover_srv , 3=rsWebdav , 4=rsSIP , 5=rsXMPP , 6=rsIschedule , 7=rsRDNS , 8=rsSPF , 9=rsDKIM
					//type	0=rtMX , 1=rtA , 2=rtSRV , 3=rtPTR , 4=rtTXT

					log.log(['domain-dns-x',ret]);

					for(var i=0; i<ret.records.length; i++){
						ret.records[i].rows=[];
						if(ret.records[i].value && ret.records[i].value[0].VAL[0].ITEM){
							ret.records[i].rows=me._parseSingleItems(ret.records[i].value[0].VAL[0].ITEM,true);
							for(var ii=0; ii<ret.records[i].rows.length; ii++){
								ret.records[i].rows[ii]=ret.records[i].rows[ii].value;
							}
						}
						if(!ret.records[i].rows[0]){
							ret.records[i].value=false;
							ret.records[i].rows=false;
						}

						ret.records[i].service=[
							'mx',
							'autodiscover',
							'autodiscover_srv',
							'webdav',
							'sip',
							'xmpp',
							'ischedule',
							'rdns',
							'spf',
							'dkim'
						][ret.records[i].recordservice];

						ret.records[i].type=[
							'MX',
							'A',
							'SRV',
							'PTR',
							'TXT'
						][ret.records[i].recordtype];
					}

					log.log(['domain-dns',ret]);

					return ret;
				}
			}
			catch(e)
			{
				log.error(['domain-dns',e]);
			}
			return false;
		},aHandler);

		if(!aHandler[0]){aHandler=[aHandler];}
		this.create_iq(aRequest,[this,'__response',[fc]]);
	}
	catch(e)
	{
		log.error(['delete accounts',e]);
	}
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>renamedomain</commandname>
  <commandparams>
    <oldname>stringval</oldname>
    <newname>stringval</newname>
  </commandparams>
</query>
</iq>
*/
_me.rename=function(domain,name,aHandler){
	var aRequest = {
		commandname:[{VALUE:'renamedomain'}],
		commandparams:[{
			oldname:[{VALUE:domain}],
			newname:[{VALUE:name}]
		}]
	};

	if(!aHandler[0]){aHandler=[aHandler];}

	this.create_iq(aRequest,[this,'__response',[this._autoBooleanHandler(aHandler)]]);
	return true;
}

if(!com){var com={};}
com.domain = new wm_domain();
