<?php
 
class WebmailIqFreeBusy extends XMLRequestInterface {

	public $oDOMUsers;
	public $oDOMQuery;
	public $oDOMDoc;
	public $sAccountID;
	public $sEvnID;
	public $sFrom;
	public $sTo;
	public $sCTZ;
	public $sTZID;
	public $oGroupWareAPI;

	 
	public function __construct(& $oDOMQuery, & $oDOMDoc, & $attrs)
	{
		$this->oDOMQuery = &$oDOMQuery;
		$this->oDOMDoc = &$oDOMDoc;
		$this->aAttrs = &$attrs;
		$this->loadUser();
		$this->checkInputXML();
		$this->exeInputXML();
	}

	 
	private function checkInputXML()
	{
		 		$this->oGroupWareAPI = new MerakGWAPI('com.icewarp.webclient');
		if (!$this->oDOMUsers = $this->oDOMDoc->getNode("freebusy:users",$this->oDOMQuery)) {
			throw new Exc('freebusy_missing_tag','user');
		}
		if (!$this->sFrom = $this->oDOMDoc->getNodeValue("freebusy:from",$this->oDOMQuery)) {
			$this->sFrom = $this->oGroupWareAPI->unix2calendarDate(time());
		}
		if (!$this->sTo= $this->oDOMDoc->getNodeValue("freebusy:to",$this->oDOMQuery)) {
			$this->sTo = $this->sFrom + 30;
		}
		if (!$this->sCTZ = $this->oDOMDoc->getNodeValue("freebusy:ctz",$this->oDOMQuery)) {
			$this->sCTZ = 0;
		}
		if (!$this->sEvnID= $this->oDOMDoc->getNodeValue("freebusy:evn_id",$this->oDOMQuery)) {
			$this->sEvnID = false;
		}
		if (!$this->sTZID = $this->oDOMDoc->getNodeValue("freebusy:tzid",$this->oDOMQuery)) {
			$this->sTZID = false;
		}else{
			$this->sCTZ = 0;
		}
		
		if(!$this->sAccountID = $this->oDOMDoc->getNodeValue("freebusy:account",$this->oDOMQuery)) {
			throw new Exc('freebusy_missing_tag','account');
		}
	}

	 
	private function exeInputXML()
	{
		$oUser = &$_SESSION['user'];
		switch($this->aAttrs["type"]) {
			case "get":
				$this->sTemplateFile = 'webmailiqfreebusy_get';
				$i = 0;
				 				User::closeSession();
				 				foreach($this->oDOMDoc->query('/iq/freebusy:query/freebusy:users/freebusy:user') as $item){
					$sEmail = strval($item->nodeValue);
					$isOwner = $item->getAttribute('owner');
					 					$oAccount = $oUser->getAccount($this->sAccountID);
					if($isOwner){
						$where = ';WHERE='.urlencode('EVN_ID != \''.$this->sEvnID.'\'' . ' AND (EvnUID != \''.$this->sEvnID.'\' OR EvnUID IS NULL)');
					 
					}else{
						$where = '';
					}
					$sVersit = $this->oGroupWareAPI->FunctionCall("GetServerVFreeBusy",
						$oAccount->gwAccount->sGWSessionID,
						$sEmail,
						$this->sFrom . '-' . $this->sTo,
						'XML'.$where
					);
					 
					if(!$sVersit) {
						$oFolder = $oAccount->getFolder('__@@ADDRESSBOOK@@__');
						$aFilter['tag'] = 'itminternetfreebusy,lctemail1,lctemail2,lctemail3';
						$aFilter['sql'] = "(itminternetfreebusy IS NOT NULL AND (lctemail1 = '".$sEmail."' OR lctemail2 = '".$sEmail."' OR lctemail3 = '".$sEmail."'))";
						$oItems = $oFolder->getItems($aFilter);
						$oItem = reset($oItems);
						$sAddress = $oItem->item['ITMINTERNETFREEBUSY'];
						 
						$sVersit = @file_get_contents($sAddress);
						$sVersit = $oAccount->gwAccount->gwAPI->FunctionCall('ConvertVersit', $oAccount->gwAccount->sGWSessionID, $sVersit, 'XML');
					}
					if(@simplexml_load_string($sVersit) !== false){
						$data = $this->parseVersitXML($sVersit,$sEmail);
					}else{
						$data = $this->parseVersitObject($sVersit, $sEmail);
					}
					if($sVersit){
						 						$this->aData['users']['num'][$i] = $data;
						$this->aData['users']['num'][$i++]['userid'] = $sEmail;
					}else{
						$data = array();
						$aItem = array();
						$aItem["type"] = 'UNKNOWN';
						$aItem["user"] = $sEmail;
						$aItem["startdate"] = $this->sFrom;
						$aItem["starttime"] = 0;
						$aItem["enddate"] = $this->sTo;
						$aItem["endtime"] = 1440;
						$aItem["uid"] = sha1(serialize($aItem));
						$data["items"]["num"][] = $aItem;
						$this->aData['users']['num'][$i] = $data;
						$this->aData['users']['num'][$i++]['userid'] = $sEmail;
					}
				}
				User::restoreSession();
			break;
		}
	}
	 
	private function parseVersitObject($sVersit,$sEmail)
	{
		$aLines = explode("\r\n",$sVersit);
		 		foreach ($aLines as $sLine){
			$aLine = explode(":",$sLine);
			$aLineType = explode(";",$aLine[0]);
			if ($aLineType[0] != "FREEBUSY") continue;
			$aBusyType = explode("=",$aLineType[1]);
			$sBusyType = $aBusyType[1];
			$aItem["type"] = $sBusyType;
			$aItem["user"] = $sEmail;
			$this->processFreeBusy($aLine[1],$aItem);
			$aItems["items"]["num"][] = $aItem;
		}
		return $aItems;
	}

	 
	protected function getIcalTimestamp($string, $inclTime = true)
	{
		$dateTime = DateTime::createFromFormat('Ymd' . ($inclTime ? '\THis+' : ''), $string);
		if(!$dateTime instanceof DateTime) return 0;
		return $dateTime->getTimestamp();
	}

	 
	protected function fillItemWithTimes(& $aItem, $start, $end)
	{
		$aItem["start"] = $start;
		$aItem["finish"] = $end;
		$aItem["startdate"] = $this->oGroupWareAPI->unix2calendarDate($start);
		$aItem["starttime"] = $this->oGroupWareAPI->unix2calendarTime($start);
		$aItem["enddate"] = $this->oGroupWareAPI->unix2calendarDate($end);
		$aItem["endtime"] = $this->oGroupWareAPI->unix2calendarTime($end);
	}

	 
	protected function processFreeBusy($busyTime, & $aItem)
	{
		$aTime = explode('/',$busyTime);
		if($this->sCTZ || ($this->sCTZ==0 && $this->sTZID==false)){
			$this->fillItemWithTimes($aItem, $this->getIcalTimestamp($aTime[0]), $this->getIcalTimestamp($aTime[1]));
		}
		if($this->sTZID){
			$from8601 = $this->oGroupWareAPI->FunctionCall("GetTZIDTime", $aTime[0], '', $this->sTZID);
			$to8601 = $this->oGroupWareAPI->FunctionCall("GetTZIDTime", $aTime[1], '', $this->sTZID);
			$this->fillItemWithTimes($aItem, $this->getIcalTimestamp($from8601), $this->getIcalTimestamp($to8601));
		}
	}

	 
	protected function parseVersitXML($sXML,$sEmail)
	{
		$aItems = array();
		@$xml = simplexml_load_string($sXML);
		if($xml->VFREEBUSY->FREEBUSY) {
			foreach($xml->VFREEBUSY->FREEBUSY as $busyTime){
				$aItem = array();
				$aItem['type'] = $busyTime['FBTYPE'] ? strval($busyTime['FBTYPE']) : 'BUSY';
				$aItem['summary'] = '';
				if($busyTime['X-SUMMARY']){
					$aItem['summary'] = strval($busyTime['X-SUMMARY']);
				}
				$aItem['user'] = $sEmail;
				$this->processFreeBusy($busyTime, $aItem);
				$aItem['uid'] = sha1(serialize($aItem));
				$aItem['evnuid'] = strval($busyTime['X-UID']);
				$aItems["items"]["num"][$aItem['uid']] = $aItem;
			}
		}
		return $aItems;
	}
}
?>
