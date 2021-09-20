function wm_hello()
{
	this.xmlns='rpc';
}

wm_hello.inherit(wm_generic);
var _me = wm_hello.prototype;

/**
 * @brief   Gets informations from calendar (which times an user is FREE/BUSY).
 * @param[in]  ahelloInfo
 *    - email  Email of the user. 
 * @param[in]  sDataSet    Dataset name.
 * @param[in]  aDataPath   Array containing path ['folder','subfolder',...] dataset.folder.subfodler.
 * @return  Array containing these items:
 *    - TYPE      BUSY | TENTATIVE | FREE
 *    - START     Starting time in unix format.
 *    - FINISH    Final time in unix format.
 */  
_me.get = function(aHandler)
{
/*
*** IN ***
{iq}
<from>{julian date}</from>
<to>{julian date}</to>
<users>
<user>{email}</user>
<user>{email}</user>
...
</users>
{/iq}
*/
	var aRequest = {
		commandname:[{VALUE:'getdomainsinfolist'}],
		commandparams:[{
			filter:[{
				
					namemask:[{VALUE:'*'}]
				
			}],
			offset:[{VALUE:0}],
			count:[{VALUE:10}]
		}]
	};

	// prepare data for request
	if (!aHandler) {
		// synchronous
		return this.parse(this.create_iq(aRequest,false,false,false,'iq-id'));
	}
	else {
		// asynchronous
		//this.create_iq(aRequest,false);
		this.create_iq(aRequest,[this,'response',[aHandler]]);
		return true;
	}
}

/**
 * @brief   Callback function (from asynchronous call).
 * @param[in]  aData       Data returned from HTTP response.
 * @param[in]  sDataset    Dataset name.
 * @param[in]  aDataPath   Array containing path ['folder','subfolder',...] dataset.folder.subfodler.
 */ 
_me.response = function(aData,aHandler){

	var aXMLResponse = aData['Array'];
	var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];

	//if (aIQAttribute['TYPE'] != 'result') return;
	
	var out = aData;


	executeCallbackFunction(aHandler,out);
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

/*
<?xml version="1.0" encoding="utf-8" ?>
<iq type="result">
<query xmlns="webmail:iq:freebusy">
<user email="admin@icewarpdemo.com">
<item>
<type>BUSY</type>
<start>1203764400</start>
<finish>1203782400</finish>
</item>
<item>
<type>BUSY</type>
<start>1203850800</start>
<finish>1203868800</finish>
</item>
<item>
<type>BUSY</type>
<start>1203937200</start>
<finish>1203955200</finish>
</item>
<item>
.
.
.
</user>
</query>
</iq>
*/




   var aItems = aData['IQ'][0]['QUERY'][0]['ITEM'];
   
   $aResult = {};
   for (var nIndex in aItems) {
      $aResult[nIndex] = {};
      $aResult[nIndex]['TYPE'] = aItems[nIndex]['TYPE'][0]['VALUE'];
      $aResult[nIndex]['START'] = aItems[nIndex]['START'][0]['VALUE'];
      $aResult[nIndex]['FINISH'] = aItems[nIndex]['FINISH'][0]['VALUE'];
   }
   
   return $aResult;
}

//var freebusy = new wm_freebusy();
