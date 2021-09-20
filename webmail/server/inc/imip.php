<?php
 define('INVM_OWNER',0x001);
define('INVM_ATTENDEE',0x002);
 define('INVL_ID',0x001);
define('INVL_VERSIT',0x002);
 
   
class iMIP
{
	static $instance;    
	public $oAccount;
	public $folderInfo;
	public $sFID;

	               
	private function __construct(&$oAccount)
	{
		$this->oAccount = &$oAccount;
		if($oAccount->acc_type=='virtual'){
			$this->oAccount = &$oAccount->account->gwAccount;
			$this->virtualAccount = &$oAccount;
		}
	}

 
	          
	public static function load($oAccount)
	{
		if(!isset(self::$instance[$oAccount->accountID])){
			self::$instance[$oAccount->accountID] = new iMIP($oAccount);
		}
		return self::$instance[$oAccount->accountID];
	}

	          
	public function createInvitation($sFolder,$sEvnID,$bAttendeeInit = false,$sAction = 'REQUEST', $datestamp = '',$sExceptionID = '')
	{
		 		$this->initAttendees($sFolder,$sExceptionID?$sExceptionID:$sEvnID,$datestamp);

		$sData = $this->processVCalendar($sFolder,$sEvnID,'',$sAction, $datestamp);

		$oInvitation = new Invitation($this,INVM_OWNER,$sData,$sFolder);    
		return $oInvitation;
	}

          
	public function loadInvitationID($sFolder,$sEvnID)
	{
		$oInvitation = new Invitation($this,INVL_ID,'',$sFolder,$sEvnID);  
		$oInvitation->mLoad = INVL_ID;
		return $oInvitation;
	}

         
	public function loadInvitation($sData)
	{
		$oInvitation =  new Invitation($this,INVM_ATTENDEE,$sData); 
		$oInvitation->mLoad = INVL_VERSIT;  
		return $oInvitation; 
	}

       
	public function convertVersit($sVersit,$sFormat = 'XML;FILTER=ATTACH', &$attachments = array())
	{
		if(!$sVersit){
			throw new Exc('imip_versit_empty');
		}
		if(!$xResult = $this->oAccount->gwAPI->FunctionCall(
			"ConvertVersit",
			$this->oAccount->gwAPI->sessid,
			$sVersit,
			$sFormat
		)){
			if ($this->oAccount->gwAPI->isConnected()) {
				throw new Exc('imip_versit_convert', $xResult);
			} else {
				throw new Exc('imip_no_gw_service');
			}
		}
		if(stripos($sFormat,'XML') !== false){
			$oXML = slToolsXML::loadString($xResult);
			if($oXML->VEVENT->ATTACH){
				$attachments = array();
				foreach($oXML->VEVENT->ATTACH as $attachment){
					$att = array();
					$att['name'] = strval($attachment['X-FILENAME'] ?? $attachment['X-ORACLE-FILENAME'] ?? $attachment['FILENAME']);
					$att['type'] = strval($attachment['FMTTYPE'] ?? $attachment['VALUE']);
					$att['part_id'] = 'IMIP'.strval($attachment['IW_ATTACH_ID']);
					$att['size'] = strval($attachment['IW_ATTACH_SIZE']);
					$attachments[] = $att;
				}
			}
		}
		
		return $xResult;
	}

       
	public function createAttachment($sVersit,$sName='',$sMethod='REQUEST')
	{
		$oUser = &$this->oAccount->account->user;
		 		$sFolderID = "vCalendar";
		$sItemID = date('Y-m-d-') .Tools::my_uniqid();
		$oUser->addStringAttachment(
			$sVersit,
			($sName?$sName:'Invitation') .' - '. ($oUser->countAttachments($sFolderID) + 1) . imipext,
			'text/calendar',
			$sFolderID,
			$sItemID,
			$sMethod
		);
		$aAttachment['fullpath'] = $sFolderID.'/'.$sItemID;
		$aAttachment['classname'] = 'file';
		$aAttachment['versit'] = $sVersit;
		return $aAttachment;
	}

           
	public function processVCalendar($sFolder='',$sEvnID='',$sData='',$sType = 'REQUEST',$datestamp = '')
	{
		
		switch($sFolder){
			case 'group':
				$sSID = $this->oAccount->gwAPI->OpenGroup();
			break;
			default:
				if(!$sFolder){
					throw new Exc('imip_missing_folder');
				}
				$sSID = $this->openAccess($sFolder);
			break;
		}
		$result = $this->oAccount->gwAPI->FunctionCall("ProcessVCalendar",$sSID,$sEvnID,$sData,$sType.($datestamp?'&EXPDATE='.$datestamp:''));
		if(!$result){
			$error = $this->oAccount->gwAPI->FunctionCall("GetLastError",$sSID);
			switch($error){
				case 3:
					throw new Exc('imip_no_access_permissions');
				case 17:
					throw new Exc('imip_obsolete');
					break; 
			}
		}
		return $result;
	}

 
           
	private function initAttendees($sFolder,$sEvnID,$datestamp)
	{
		if ($datestamp){
			return true;
		}
		 		if(!$oFolder = &$this->oAccount->getFolder($sFolder)){
			throw new Exc('folder_invalid_id',$sFolder);
		}
		 		if(!$oItem = $oFolder->getItem($sEvnID)){
			throw new Exc('item_invalid_id',$sEvnID);
		}
		 		$oAttendees = $oItem->aAddons['contact'];
		$aAttendees = $oAttendees->getData();
		 		$aData = array();
		if($aAttendees) foreach($aAttendees as $aAttendee){
			$aData['CNTRSVP'] = 1;
			$aData['CNTSTATUS'] = 'B';
			$oAttendees->edit($aData,$aAttendee['CNT_ID']);  
		}
		return true;
	}

             
	public function openAccess($sFolder)
	{
		$oAccount = &$this->oAccount;
		$sFolder = MerakGWAPI::encode($sFolder);
		 		$oAccount->gwAPI->Login();
		 		if (!$oAccount->sGWSessionID = $oAccount->gwAPI->OpenGroup('*')){
			throw new Exc('group_open');
		}
		$this->folderInfo = $oAccount->gwAPI->OpenFolder($sFolder);
		@$this->sFID = $oAccount->folder->sFID = $this->folderInfo['fid'];
		if(!$this->sFID){
			throw new Exc('folder_open');
		}
		$oAccount->folder->rights = $this->folderInfo['rights'];
		$oAccount->folder->rightsUpdated = true;
		return $this->sFID;
	}
	
	public function iMIP_Email($oItem,$sAction = 'invite',$aAttachment = array(),$aAttachmentID = false,$sSingleAttendee = false,$sAttendeeEmail = false,$sOwnerEmail = false)
	{
		$oAccount = (strtolower($oItem->wmclass) == 'gw')?$oItem->folder->account->account:$oItem->folder->account;
		if (!$aAttachment){
			 			$oInvitation = $oItem->createInvitation(true);
			 			$aAttachment = $oItem->createInvitationAttachment($oInvitation);
		}
		
		$sFolder = $sAction=='cancel'?$oItem->folder->name:'group';
		$sID = $sAction=='cancel'?$oItem->item['EVN_ID']:'';
		if($sAttendeeEmail){
			$emailSuffix = '='.urlencode($sAttendeeEmail);
		}else{
			$emailSuffix = '';
		}
		if($sOwnerEmail){
			$owner=($emailSuffix?'':'=').'&owneremail='.urlencode($sOwnerEmail);
		}else{
			$owner = '';
		}
		$this->processVCalendar($sFolder,'',$aAttachment['versit'],'SEND_ITIP'.$emailSuffix.$owner);
	}
	
	static private function getIMIPTag($xml)
	{
		if ($xml->VEVENT) {
			return $xml->VEVENT;
		}
		if ($xml->VTODO) {
			return $xml->VTODO;
		}
		if ($xml->VJOURNAL) {
			return $xml->VJOURNAL;
		}
	}

}

 
class Invitation
{
	public $cMode;
	public $sEvnId;
	public $mLoad;
	public $sEvnID;
	public $sFolder;
	public $oIMIP;
	public $sInvitation;

	               
	public function __construct(
		$oIMIP,
		$cMode,
		$sData = '',
		$sFolder = '',
		$sEvnID = '')
	{
		$this->cMode = $cMode;
		$this->oIMIP = &$oIMIP;
		$this->sInvitation = $sData;
		$this->sFolder = $sFolder;
		$this->sEvnID = $sEvnID;
	}

	public function setFolder($sFolder)
	{
		$this->sFolder = $sFolder;
	}

	public function setEvent($sEvnId)
	{
		$this->sEvnId = $sEvnId;
	}

	public function accept($sFolder,$owner = false,$messageFile = false,$messageFrom = '')
	{
		$suffix = $this->createVCalendarSuffix($owner,$messageFile,$messageFrom);
		switch($this->mLoad){
			 			case INVL_VERSIT:
				$sResult = $this->oIMIP->processVCalendar($sFolder,'',$this->sInvitation,'REPLY=ACCEPTED'.$suffix);  			break;
			 			case INVL_ID:
				$sResult = $this->oIMIP->processVCalendar($this->sFolder,$this->sEvnID,'','REPLY=ACCEPTED'.$suffix);  			break;
		}
		if($sResult=='@@UNKNOWN_ATTENDEE@@'){
			throw new Exc('imip_unknown_attendee');
		}
		return $sResult;
	}

	 	public function decline($owner = false, $reason = false, $datestamp = '')
	{
		$suffix = $owner?'&ownerEmail='.urlencode($owner):'';
		$suffix .= $reason?'&DeclineReason='.urlencode($reason):'';
		$suffix .= $datestamp?'&EXPDATE='.$datestamp:'';
		
		switch($this->mLoad){
			 			case INVL_VERSIT:
				$sResult = $this->oIMIP->processVCalendar('group','',$this->sInvitation,'REPLY=DECLINED'.$suffix);  			break;
			 			case INVL_ID:
				$sResult = $this->oIMIP->processVCalendar($this->sFolder,$this->sEvnID,'','REPLY=DECLINED'.$suffix);  			break;
		}
		if($sResult=='@@UNKNOWN_ATTENDEE@@'){
			throw new Exc('imip_unknown_attendee');
		}
		return $sResult;
	}
	
	public function tentative($owner = false,$messageFile = false,$messageFrom = '')
	{
		$suffix = $this->createVCalendarSuffix($owner,$messageFile,$messageFrom);		
		
		switch($this->mLoad){
			 			case INVL_VERSIT:
				$sResult = $this->oIMIP->processVCalendar('group','',$this->sInvitation,'REPLY=TENTATIVE'.$suffix);  			break;
			 			case INVL_ID:
				$sResult = $this->oIMIP->processVCalendar($this->sFolder,$this->sEvnID,'','REPLY=TENTATIVE'.$suffix);  			break;
		}
		return $sResult;
	}
	
	public function propose($owner = false,$messageFile = false,$messageFrom = '', $gwparams = '')
	{
		$suffix = $this->createVCalendarSuffix($owner,$messageFile,$messageFrom);		
		if ($gwparams){
			$suffix.= '&gwparams='.urlencode($gwparams);
		}
		
		 		switch($this->mLoad){
			 			case INVL_VERSIT:
				$sResult = $this->oIMIP->processVCalendar('group','',$this->sInvitation,'REPLY=PROPOSE'.$suffix);  			break;
			 			case INVL_ID:
				$sResult = $this->oIMIP->processVCalendar($this->sFolder,$this->sEvnID,'','REPLY=PROPOSE'.$suffix);  			break;
		}

		return $sResult;
	}
	
	 	public function declineCounter($email,$owner = false, $reason  = '')
	{
		$suffix = $owner?'&ownerEmail='.urlencode($owner):'';
		$suffix .= $reason?'&DeclineReason='.urlencode($reason):'';
		
		switch($this->mLoad){
			 			case INVL_VERSIT:
				$sResult = $this->oIMIP->processVCalendar('group','',$this->sInvitation,'DECLINECOUNTER='.urlencode($email).$suffix);  			break;
			 			case INVL_ID:
				 			break;
		}
		return $sResult;
	}
		 	public function acceptCounter($sFolder,$owner = false,$messageFile = false,$messageFrom = '')
	{
		$suffix = $this->createVCalendarSuffix($owner,$messageFile,$messageFrom);
		switch($this->mLoad){
			 			case INVL_VERSIT:
				$sResult = $this->oIMIP->processVCalendar('group','',$this->sInvitation,'='.$suffix);  			break;
			 			case INVL_ID:
				 			break;
		}
		return $sResult;
	}


	 	 	public function cancel($aAttendeeID=array(), $datestamp = false)
	{
		if ($aAttendeeID){
			foreach($aAttendeeID as $key => $val){
				$aAttendeeID[$key] = urlencode($val);
			}
			$sAttendeeID = implode(",",$aAttendeeID);
		}
		$sResult = $this->oIMIP->processVCalendar($this->sFolder,$this->sEvnID,$this->sInvitation,'CANCEL='.$sAttendeeID.($datestamp?('&EXPDATE='.$datestamp):''));
		return $sResult;
	}

	public function process($owner = false)
	{
		$suffix = $owner?'=&ownerEmail='.urlencode($owner):'';
		$sResult = $this->oIMIP->processVCalendar('group','',$this->sInvitation,$suffix);
		return $sResult;
	}

	private function createVCalendarSuffix($owner,$messageFile,$messageFrom)
	{
		$urlParams = array();
		if($owner){
			$urlParams['ownerEmail'] = $owner;
		}
		if($messageFile){
			$urlParams['versitParams'] = ';CIDFILE='.$messageFile;
		}
		if($messageFrom){
			$urlParams['mailFrom'] = $messageFrom;
		}
		$url = Tools::createURL($urlParams);
		$suffix = $url?'&'.$url:'';
		return $suffix;
	}
}

?>
