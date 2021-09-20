function wm_tools()
{
  this.xmlns='tools';
}

wm_tools.inherit(wm_generic);
var _me = wm_tools.prototype;

/**
 * @brief:   Check whatever city exists

<iq sid="wm-4d6f6fcc38e4b466164233">
<query xmlns="webmail:iq:tools">
<tools>
<weather>
<item><city>Zhorny</city></item>
<item><city>Praha</city></item>
<item><city>asd</city></item>
</weather>
</tools>
</query>
</iq>
*/
_me.weather = function(aItemInfo,aHandler){
	var aRequest = {'TOOLS':[{'WEATHER':[{'ITEM':[]}]}]};
	for(var i in aItemInfo)
		aRequest.TOOLS[0].WEATHER[0].ITEM.push({CITY:[{VALUE:aItemInfo[i]}]});

	// asynchronous
	this.create_iq(aRequest,[this,'response',['weather',aHandler]]);
};

/* Quota */
_me.quota = function(aItemInfo,aHandler){
	var aRequest = {'TOOLS':[{'QUOTA':[{'ITEM':[]}]}]};
	for(var i in aItemInfo)
		aRequest.TOOLS[0].QUOTA[0].ITEM.push({ACCOUNT:[{VALUE:aItemInfo[i]}]});

	// asynchronous
	this.create_iq(aRequest,[this,'response',['quota',aHandler]]);
};

/**
 * @brief:   Gets contact included in DistributionList.

<iq sid="wm-4d3817d79edb5478357024" format="xml">
	<query xmlns="webmail:iq:tools">
		<tools>
			<distrib>
				<item>
					<account uid="admin@merakdemo.com">
						<folder uid="a/b">
							<name>Testik</name>
						</folder>
					</account>
				</item>
			</distrib>
		</tools>
	</query>
</iq>

 */

_me.distrib = function(sListName,aHandler){
	if (!sListName || !sListName.name || !aHandler) return;

	if (!sListName.aid && !sListName.fid){
		var aDistribList = MailAddress.findDistribList({'to': sListName.name}),
			aid='',
			fid='';

		for(aid in aDistribList.distrib)
		    for(fid in aDistribList.distrib[aid])
		    	sListName.name = aDistribList.distrib[aid][fid].to[0];

		if (aid && fid){
			sListName.aid = aid;
			sListName.fid = fid;
		}
		else
		    return;
	}

	var aRequest = {'TOOLS':[{
		'DISTRIB':[{
			'ITEM':[{
				'ACCOUNT':[{
					'ATTRIBUTES':{'UID':sListName.aid},
					'FOLDER':[{
						'ATTRIBUTES':{'UID':sListName.fid},
						'NAME':[{'VALUE':sListName.name}]
					}]
				}]
			}]
		}]
	}]};

	// asynchronous
	this.create_iq(aRequest,[this,'response',['distrib',aHandler]]);
};

_me.personality = function(aInfo,aHandler){
	if (aInfo.email){
		var aRequest = {'TOOLS':[{
			'PERSONALITY':[{
				'NAME':[{'VALUE':aInfo.name}],
				'EMAIL':[{'VALUE':aInfo.email}],
				'ISDELEGATE':[{'VALUE':aInfo.isdelegate}]
			}]
		}]};

		// asynchronous
		this.create_iq(aRequest,[this,'response',['personality',aHandler]],'','set');
	}
};

_me.telemetry = function(aData,aHandler){
	if (aData){
		var tmp, a, aRequest = {'TOOLS':[{'TELEMETRY':[{CLICK:[]}]}]};

		for (var i in aData)
			if (aData[i]){
				tmp = parseURL(i);

				a = {COUNT:[{'VALUE':aData[i]}]};
				a.ELEMENT = [{'VALUE':tmp.id}];
				delete tmp.id;

				for (var k in tmp)
					if (tmp[k])
						a[k.toUpperCase()] = [{'VALUE':tmp[k]}];

				aRequest.TOOLS[0].TELEMETRY[0].CLICK.push(a);
			}

		// asynchronous
		this.create_iq(aRequest,[this,'response',['telemetry',aHandler]],'','set');
	}
};

/**
 * @brief   Gets informations from calendar (which times an user is FREE/BUSY).
 */
_me.timezone = function(aTimeInfo,aHandler)
{
/*
*** IN ***
{iq}
 <query xmlns="webmail:iq:tools">
 <tools>
 <timezone>
 <source type="ctz">120</source>
 <dest type="tzid">America/Argentina/Catamarca</dest>
 <times>
 <item uid="0"><date>2455373</date><time>510</time></item>
 <item uid="1"><date>2455373</date><time>630</time></item>
 </times>
 </timezone>
 </tools>
 </query>
{/iq}
*/
	// prepare data for request
	var ctz = new IcewarpDate().utcOffset(),
		aRequest = {TOOLS:[{TIMEZONE:[{
			SOURCE:[{ATTRIBUTES:{TYPE:aTimeInfo.from?'tzid':'ctz'},VALUE:aTimeInfo.from || ctz}],
		    DEST:[{ATTRIBUTES:{TYPE:aTimeInfo.to?'tzid':'ctz'},VALUE:aTimeInfo.to || ctz}],
		    TIMES:[{ITEM:[]}]
		}]}]};

	for(var i in aTimeInfo.times)
        aRequest.TOOLS[0].TIMEZONE[0].TIMES[0].ITEM.push({ATTRIBUTES:{UID:i},
			DATE:[{VALUE:aTimeInfo.times[i].date}],
            TIME:[{VALUE:aTimeInfo.times[i].time}]
		});

	if (aHandler)
		// asynchronous
		this.create_iq(aRequest,[this,'response',['timezone',aHandler]]);
	else
		// synchronous
		return this.parse(this.create_iq(aRequest));

	return true;
};
/*
<query xmlns="webmail:iq:tools">
<tools>
<delivery_report>
<message>
<item uid="0">
<message_id>&lt;49948601d955bd0ad3ad5952d2087f55@icewarpdemo.com&gt;</message_id>
<unix_time>1279280534</unix_time>
</item>
</message>
</delivery_report>
</tools>
</query>
*/

_me.delivery_report = function(aItemInfo,aHandler){
	var	aRequest = {TOOLS:[{DELIVERY_REPORT:[{
			MESSAGE:[{
				ITEM:[{
					MESSAGE_ID:[{VALUE:aItemInfo.id}],
					UNIX_TIME:[{VALUE:aItemInfo.date}]
					//,ATTRIBUTES:{"UID":'0'}
				}]
			}]
		}]}]};

	// asynchronous
	if (aHandler)
		this.create_iq(aRequest,[this,'response',['delivery_report',aHandler]]);
};


/*
<iq sid="wm-575683f73a174923438930" type="get" format="xml">
<query xmlns="webmail:iq:tools">
	<tools>
		<cancel_delivery>
			<message>
				<item>
					<message_id>&lt;beef9219924f8b84b08e62be708dbd23@icewarpdemo.com&gt;</message_id>
					<unix_time>1465288612</unix_time>
				</item>
			</message>
		</cancel_delivery>
	</tools>
</query></iq>
*/

// Cancel delayed sending
_me.revoke_sent = function(aItemInfo,aHandler) {
	var	aRequest = {TOOLS:[{CANCEL_DELIVERY:[{
			MESSAGE:[{
				ITEM:[{
					MESSAGE_ID:[{VALUE:aItemInfo.id}],
					UNIX_TIME:[{VALUE:aItemInfo.date}]
				}]
			}]
		}]}]};

	// asynchronous
	if (aHandler)
		this.create_iq(aRequest,[this,'response',['cancel_delivery',aHandler]],undefined,'set');
};

_me.ticket = function(aItemInfo,sRights,aHandler){

	var	aRequest = {
		TOOLS:[{
			TICKET:[{
				ACCOUNT:[{
						ATTRIBUTES:{UID:aItemInfo['aid']},
						FOLDER:[{
							ATTRIBUTES:{UID:aItemInfo['fid']},
							ITEM:[{
								ATTRIBUTES:{UID:WMItems.__serverID(aItemInfo['iid'])},
								RIGHTS:[{VALUE:(sRights || 'rl')}]
							}]
						}]
					}]
				}]
			}]
		};

	if (aItemInfo['attid'])
		aRequest.TOOLS[0].TICKET[0].ACCOUNT[0].FOLDER[0].ITEM[0].ATTACHMENT = [{ATTRIBUTES:{UID:aItemInfo['attid']}}];

	// asynchronous
	if (aHandler)
		this.create_iq(aRequest,[this,'response',['ticket',aHandler]]);
};

/**
 * @brief   Callback function (from asynchronous call).
 * @param[in]  aData       Data returned from HTTP response.
 * @param[in]  sDataset    Dataset name.
 * @param[in]  aDataPath   Array containing path ['folder','subfolder',...] dataset.folder.subfodler.
 */
_me.response = function(aData,sType,aHandler){
	var aXMLResponse = aData['Array'];
	var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	if (aIQAttribute['TYPE'] == 'result')
		executeCallbackFunction(aHandler, this.parse(aXMLResponse) || true);
	else
		executeCallbackFunction(aHandler, false);
};
/**
 * @brief   Process data obtained from HTTP response and return them
 * in cultivated form.
 * @param[in]  aData   ['Array'] item from datas passed to callback function response()
 *    or returned from create_iq().
 * @see  response()
 * @see  create_iq()
 */
_me.parse = function(aData)
{
	if(!aData['IQ'][0]['QUERY'][0].TOOLS) return '';

	var aResult = {},
		aItems = aData['IQ'][0]['QUERY'][0]['TOOLS'][0];

	if (aItems.QUOTA){
		aItems = aItems.QUOTA[0].ITEM;
		for(var i in aItems)
			aResult[aItems[i].ATTRIBUTES.UID] = {quota:aItems[i].QUOTA[0].VALUE,size:aItems[i].SIZE[0].VALUE};
	}
	else
    if (aItems.WEATHER){

/*
*** OUT ***

<?xml version="1.0" encoding="utf-8" ?>
<iq sid="wm-55914de075b76434728681" gwsid="b458dc5ba94ad8a4e88c3484b61777fa-a3e5e45bca962fafc127ae1e7c844691" type="result">
<query xmlns="webmail:iq:tools">
<tools>
<weather>
<item uid="EN.62707.7.99999">
<holiday_id>EN.62707.7.99999</holiday_id>
<city>Toronto, IL, USA (EN)</city>
</item>
<item uid="EN.00000.1.71265">
<holiday_id>EN.00000.1.71265</holiday_id>
<city>Toronto, ON, Canada (EN)</city>
</item>
</weather>
</tools>
</query>
</iq>

*/
		aItems = aItems.WEATHER[0].ITEM;
		for(var i in aItems)
			aResult[aItems[i].ATTRIBUTES.UID] = {city:aItems[i].CITY[0].VALUE};
	}
	else
	if (aItems.TIMEZONE){
/*
 <?xml version="1.0" encoding="utf-8" ?>
 <query xmlns="webmail:iq:tools">
 <tools>
 <timezone>
 <time>
 <item uid="0">
 <time>210</time>
 <date>2455373</date>
 </item>
 <item uid="1">
 <time>330</time>
 <date>2455373</date>
 </item>
 </time>
 </timezone>
 </tools>
 </query>
*/
		aItems = aItems.TIMEZONE[0].TIME[0].ITEM;
		for(var i in aItems)
        	aResult[aItems[i].ATTRIBUTES.UID] = {date:parseInt(aItems[i].DATE[0].VALUE,10),time:parseInt(aItems[i].TIME[0].VALUE,10)};
	}
	else
	if (aItems.DELIVERY_REPORT){
		aResult = [];
		aItems = aItems.DELIVERY_REPORT[0].MESSAGE[0].ITEM[0].REPORT[0].RECIPIENTS[0].RECIPIENT;
		for(var i in aItems)
        	aResult.push({
				'email':aItems[i].EMAIL[0].VALUE,
				'status':aItems[i].STATUS[0].VALUE,
				'error':aItems[i].ERROR?aItems[i].ERROR[0].VALUE:'',
                'time':aItems[i].TIME[0].VALUE
			});
	}
	else
	if (aItems.DISTRIB){
		var aResult = [],
			aItem = aItems.DISTRIB[0].ITEM[0].CONTACTS[0].ITEM;

		for(var i in aItem)
			aResult.push({name:aItem[i].NAME?aItem[i].NAME[0].VALUE:'',email:aItem[i].EMAIL?aItem[i].EMAIL[0].VALUE:''});
	}
	else
	if (aItems.TICKET)
		aResult = aItems.TICKET[0].VALUE;
	else
	if (aItems.SIGNATURE) {
		aResult = aItems.SIGNATURE[0].ITEM[0].VALUE;
	}
	else
	if (aItems.PERSONALITY) {
		for(var i in aItems.PERSONALITY[0])
			if (aItems.PERSONALITY[0][i][0] && aItems.PERSONALITY[0][i][0].VALUE)
				aResult[i] = aItems.PERSONALITY[0][i][0].VALUE;
	}

	return aResult;
};

_me.signature_preview = function(sSignature,aHandler){
	var	aRequest = {'TOOLS':[{'SIGNATURE':[{'ITEM':[{VALUE: sSignature}]}]}]};

	this.create_iq(aRequest,[this,'response',['signature',aHandler]]);
};