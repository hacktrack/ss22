function wm_certificates()
{
	this.xmlns='rpc';
}
wm_certificates.inherit(wm_generic);
var _me = wm_certificates.prototype;

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>getservercertificatelist</commandname>
  <commandparams/>
</query>
</iq>

*/
_me.server=function(aHandler){
	try
	{
		var aRequest = {
			commandname:[{VALUE:'getservercertificatelist'}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		
		var fc=[function(data){
			var prepared={items:[]};
			
			try
			{
				if(data.Array.IQ[0].QUERY[0].RESULT[0].ITEM)
				{
					for(var i=0; i<data.Array.IQ[0].QUERY[0].RESULT[0].ITEM.length; i++){
						var inner={};
						var tmp;
						// Retrieve values and put into object
						for(var inr in data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i]){
							if(tmp = data.Array.IQ[0].QUERY[0].RESULT[0].ITEM[i][inr][0]){
								inr = inr.toLowerCase();
								// Simple values
								if(tmp.VALUE) {
									inner[inr] = tmp.VALUE;
								} else {
									// IPs and domains list in array
									if(inr=='ipaddress' || inr=='hostname') {
										inner[inr] = [];
										if(tmp.ITEM) {
											for(var j=tmp.ITEM.length; j--;) {
												inner[inr].unshift(tmp.ITEM[j].VALUE);
											}
										}
									// Error and pick out failed domains if any
									} else if(inr=='error') {
										inner.error = {
											lasterror: parseInt(tmp.LASTERROR[0].VALUE) || 0,
											lastattempt: tmp.LASTATTEMPT[0].VALUE,
											faileddomains: []
										};
										if(tmp.FAILEDDOMAINS && tmp.FAILEDDOMAINS[0].ITEM) {
											for(var j=tmp.FAILEDDOMAINS[0].ITEM.length; j--;) {
												inner.error.faileddomains.unshift({
													domainname: tmp.FAILEDDOMAINS[0].ITEM[j].DOMAINNAME[0].VALUE,
													resultcode: tmp.FAILEDDOMAINS[0].ITEM[j].RESULTCODE[0].VALUE
												});
											}
										}

									// Other complex add as object properties
									} else {
										inner[inr] = {};
										var j = '';
										for(j in tmp) {
											inner[inr][j.toLowerCase()] = tmp[j][0].VALUE || '';
										}
										// If object was empty set value to empty
										if(!j) {
											inner[inr] = '';
										}
									}
								}
							}
						}
						// Parse values for appropriate type
						if(inner.isdefault){
							inner.isdefault = inner.isdefault=='1';
						}
						if(inner.iscsr){
							inner.iscsr = inner.iscsr=='1';
						}
						if(inner.status) {
							inner.status = parseInt(inner.status);
						}

						prepared.items.push(inner);
					}
				}
			}
			catch(e){
				log.error(['certificates-getlist','Invalid response',data]);
			}

			aHandler[0](prepared.items);
		}];
		
		this.create_iq(aRequest,[this,'__response',[fc]]);
	}
	catch(e)
	{
		log.error(['certificates-getlist',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>addservercertificate</commandname>
  <commandparams>
    <ipaddress>stringval</ipaddress>
    <certificate>stringval</certificate>
    <setasdefault>enumval</setasdefault>
  </commandparams>
</query>
</iq>

*/
_me.add=function(certificate,aHandler){
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'addservercertificate'}],
			commandparams:[{
				certificate:[{VALUE:certificate}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		
		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]]);
	}
	catch(e)
	{
		log.error(['certificates-add',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>editservercertificate</commandname>
  <commandparams>
    <id>stringval</id>
    <certificate>stringval</certificate>
  </commandparams>
</query>
</iq>
*/

_me.edit=function(id,certificate,aHandler){
	var me=this;

	try
	{
		var aRequest = {
			commandname:[{VALUE:'editservercertificate'}],
			commandparams:[{
				id:[{VALUE:id}],
				certificate:[{VALUE:certificate}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		
		this.create_iq(aRequest,[this,'__response',[me._autoIdHandler(aHandler)]],false,'set');
	}
	catch(e)
	{
		log.error(['certificates-edit',e]);
	}
	
	return true;
}


_me.setasdefault=function(id,aHandler){
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'setdefaultservercertificate'}],
			commandparams:[{
				id:[{VALUE:id}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}

		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]],false,'set');
	}
	catch(e)
	{
		log.error(['certificates-setdefault',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>reissueservercertificate</commandname>
  <commandparams>
    <id>stringval</id>
    <certificate>
      <bits>intval</bits>
      <validfordays>intval</validfordays>
      <country>stringval</country>
      <state>stringval</state>
      <city>stringval</city>
      <organization>stringval</organization>
      <organizationunit>stringval</organizationunit>
      <email>stringval</email>
      <fcommonnames>
        <item>item 1</item>
        <item>item2</item>
      </fcommonnames>
      <createcsr>enumval</createcsr>
      <doletsencrypt>enumval</doletsencrypt>
    </certificate>
    <reuse>enumval</reuse>
  </commandparams>
</query>
</iq>
*/

// Create and reissue requests
_me.create=function(issuer,domains,options,aHandler){
	var me=this;

	try
	{
		var aRequest = {
			commandname:[{VALUE:options.reissue?'reissueservercertificate':'createservercertificate'}],
			commandparams:[{
				certificate:[{
					fcommonnames: [{item: []}]
				}]
			}]
		};

		// Add issuer information
		for(var i in issuer){
			aRequest.commandparams[0].certificate[0][i] = [{VALUE: issuer[i]}];
		}

		// Add options
		if(options.reissue) {
			aRequest.commandparams[0].id = [{VALUE: options.reissue}]
			delete options.reissue;
		}
		if(options.reuse) {
			aRequest.commandparams[0].reuse = [{VALUE: 1}]
			delete options.reuse;
		}
		for(var i in options){
			aRequest.commandparams[0].certificate[0][i] = [{VALUE: options[i]}];
		}

		// Add domains
		if(domains.length) {
			for(var i=domains.length; i--;){
				aRequest.commandparams[0].certificate[0].fcommonnames[0].item.unshift({VALUE: domains[i]});
			}
		} else {
			aRequest.commandparams[0].certificate[0].fcommonnames[0] = {};
		}

		if(!aHandler[0]){aHandler=[aHandler];}

		this.create_iq(aRequest,[this,'__response',[me._autoIdHandler(aHandler)]],false,'set');
	}
	catch(e)
	{
		log.error(['certificates-create',e]);
	}
	
	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>editservercertificate</commandname>
  <commandparams>
    <id>stringval</id>
    <ipaddress>
      <item>item 1</item>
      <item>item2</item>
    </ipaddress>
  </commandparams>
</query>
</iq>
*/

// Create and reissue requests
_me.editips=function(id,ips,aHandler){
	var me=this;

	try
	{
		var aRequest = {
			commandname:[{VALUE:'editservercertificate'}],
			commandparams:[{
				id:[{VALUE:id}],
				ipaddress: [{item: []}]
			}]
		};

		// Add ips
		if(ips.length) {
			for(var i=ips.length; i--;){
				aRequest.commandparams[0].ipaddress[0].item.unshift({VALUE: ips[i]});
			}
		} else {
			aRequest.commandparams[0].ipaddress[0] = {};
		}

		if(!aHandler[0]){aHandler=[aHandler];}

		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]],false,'set');
	}
	catch(e)
	{
		log.error(['certificates-editips',e]);
	}

	return true;
}

/*
<iq sid="sidval">
<query xmlns="admin:iq:rpc">
  <commandname>exportservercertificate</commandname>
  <commandparams>
    <id>stringval</id>
  </commandparams>
</query>
</iq>
*/
_me.export=function(id,aHandler){
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'exportservercertificate'}],
			commandparams:[{
				id:[{VALUE:id}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}

		var fc=[function(data){
			try
			{
				var file = data.Array.IQ[0].QUERY[0].RESULT[0].VALUE
				if(file)
				{
					file = me._unpackxmlfile(file);
					me._downloadfile(file.content,'signreq.csr','application/pkcs10');
				}
			}
			catch(e){
				log.error(['certificates-export','Invalid response',data]);
			}

			aHandler[0](true);
		}];

		this.create_iq(aRequest,[this,'__response',[fc]]);
	}
	catch(e)
	{
		log.error(['certificates-export',e]);
	}
	
	return true;
}



_me.delete=function(id,aHandler){
	var me=this;
	
	try
	{
		var aRequest = {
			commandname:[{VALUE:'deleteservercertificate'}],
			commandparams:[{
				id:[{VALUE:id}]
			}]
		};
	
		if(!aHandler[0]){aHandler=[aHandler];}
		
		this.create_iq(aRequest,[this,'__response',[me._autoBooleanHandler(aHandler)]],false,'set');
	}
	catch(e)
	{
		log.error(['certificates-delete',e]);
	}
	
	return true;
}


_me.__response = function(aData, aHandler){
	executeCallbackFunction(aHandler, aData);
};


/////////////////////////////////
if(!com){var com={};}
com.certificates = new wm_certificates();
