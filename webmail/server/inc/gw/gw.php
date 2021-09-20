<?php
require_once(SHAREDLIB_PATH.'system/observer.php');

class MerakGWAPI extends slObservable
{
	private $pass;

	 	public $user;
	public $sessid;
	public $groupsessid;
	public $grouplist;
	public $deviceID;

	public $sException;
	static private $ownerEmailCache;
	static public $aRightsToString = array(
		0=>'r',
		1=>'rwmd',
		2=>'rwmdo',
		3=>'rw',
		4=>'rwm',
		5=>'');
		
	const RIGHT_REAL_OWNER = 0x0001;
	const RIGHT_WRITE = 0x0002;
	const RIGHT_ADMIN = 0x0004;
	const RIGHT_DELETE = 0x0008;
	const RIGHT_MODIFY = 0x0010;
	const RIGHT_FOLDER_READ = 0x0020;
	const RIGHT_READ = 0x0040;
	const RIGHT_FOLDER_WRITE = 0x0080;
	const RIGHT_FOLDER_DELETE = 0x0100;
	const RIGHT_FOLDER_INVITE = 0x1000;
	const RIGHT_FOLDER_KICK = 0x2000;
	const RIGHT_FOLDER_EDIT_FOLDER = 0x4000;
	const RIGHT_FOLDER_EDIT_DOCUMENT = 0x8000;
	 	const RIGHT_BITS = 0x80000000;
	const FLAG_EXPAND_GUESTS = 0x02;

	public $identity;
	public $requestUID;
	public $logged_state;
	public $fid;
	public $gid;
	public $seconds;

	 	public function __construct($identity = 'com.icewarp.webclient')
	{
		if(isset($_SESSION['GW']['STATE'])){
			$this->state = $_SESSION['GW']['STATE'];
		}
		if(isset($_SESSION['GW']['DEVICE_ID'])){
			$this->deviceID = $_SESSION['GW']['DEVICE_ID'];
		}else{
			$this->deviceID = slSystem::uniqueID();
			$_SESSION['GW']['DEVICE_ID'] = $this->deviceID;
		}
		$this->identity = $identity;
	}

	const E_GLICENSE = 1;     	const E_RIGHTS = 2;       	const E_ACCESS = 3;       	const E_DB = 4;           	const E_PARAMETERS = 5;   	const E_GROUP = 6;        	const E_NOTFOUND = 7;     	const E_TOOBIG = 8;       	const E_VIRUS = 9;        	const E_TRANSACTION = 10;  	const E_DUPLICATE = 11;    	const E_LOCKED = 12;       	const E_FILE_ALREADY_EXISTS =13;  	const E_NO_VEVENT = 14;  	const E_UID_ALREADY_EXISTS =15;  	const E_GRPID_MISMATCH =16;  	const E_ITIP_OBSOLETE = 17;  	const E_FILEACCESS_LOCKED = 18;    	const E_FILEACCESS_ANOTHER_LOCKED = 19;    	const E_GUEST_ASSURE_FAILURE = 20;    	const E_GUEST_OWNERID_FAILURE = 21;   	const E_GUEST_GETEXPANDEDMEMBERS_FAILURE =22;    	const E_GUEST_SETRIGHTS_FAILURE = 23;     	const E_GUEST_SENDINVITATION_FAILURE = 24;   	const E_TEAMCHAT_ACCESSMODE = 25;   	const E_IMIP_FAILURE = 26;   	const E_DIRECTORY_ALREADY_EXISTS =27;  	const E_GUEST_EMAIL_INVALID = 28;   	const E_GUEST_EMAIL_DOESNOT_EXIST = 29;  	const E_REACTION_ERROR = 30;  	const E_FILECOPY_ERROR = 31;    	const E_TEMPFILE_NOTGIVEN = 32;    	const E_TEMPFILE_NOTEXISTS = 33;    	const E_ACCOUNT_SIZE = 34;       	const E_WEBDOCUMENTS_DISABLED = 35;       	const E_ATTACHMENT_BLOCKED_BY_FILTER = 36;  	const E_FILENAME_INVALID = 37;   
	public static $gwErrors = [
		self::E_GLICENSE => 'Server does not have the sufficient license',
		self::E_RIGHTS => 'User does not have rights to perform this action',
		self::E_ACCESS => 'User does not have access permissions to performs this action',
		self::E_DB => 'Database error or no result returned',
		self::E_PARAMETERS => 'No database record found',
		self::E_GROUP => 'Group not found',
		self::E_NOTFOUND => 'Not found',
		self::E_TOOBIG => 'Size too big',
		self::E_VIRUS => 'Virus',
		self::E_TRANSACTION => 'Transaction error',
		self::E_DUPLICATE => 'Duplicate data during import',
		self::E_LOCKED => 'Document is locked',
		self::E_FILE_ALREADY_EXISTS => 'Document with the same file name exists in the specified folder',
		self::E_NO_VEVENT => 'Attempto to add calendar object without VEVENT',
		self::E_UID_ALREADY_EXISTS => 'Event with the same UID exists in the specified folder',
		self::E_GRPID_MISMATCH => 'User data can\'t be restored because  old groupId does not match the current groupId',
		self::E_ITIP_OBSOLETE => 'ITIP\'s obsolete REQUEST and REPLY',
		self::E_FILEACCESS_LOCKED => 'file on filesystem could not be locked in given time',
		self::E_FILEACCESS_ANOTHER_LOCKED => 'this session attempted to lock a file while it had another file locked',
		self::E_GUEST_ASSURE_FAILURE => 'guest account cound not be created',
		self::E_GUEST_OWNERID_FAILURE => 'ownerid of the invited account could not be determined',
		self::E_GUEST_GETEXPANDEDMEMBERS_FAILURE => 'list of members of teamchat room could not be determined',
		self::E_GUEST_SETRIGHTS_FAILURE => 'rights for guest account for given room could not be set',
		self::E_GUEST_SENDINVITATION_FAILURE => 'invitation mail for the guest could not be send',
		self::E_TEAMCHAT_ACCESSMODE => 'active account has not teamchat enabled',
		self::E_IMIP_FAILURE => 'IMIP problem',
		self::E_DIRECTORY_ALREADY_EXISTS => 'Directory with the same file name exists',
		self::E_GUEST_EMAIL_INVALID => 'attempt to invite invalid email',
		self::E_GUEST_EMAIL_DOESNOT_EXIST => 'attempt to invite non existing local account',
		self::E_REACTION_ERROR => 'unspecified error in setting event reaction',
		self::E_FILECOPY_ERROR => 'temporary file could not be copied to the attachment location',
		self::E_TEMPFILE_NOTGIVEN => 'attempt to call GetAttachmentPath "UNLOCK" without calling GetAttachmentPath "Lock" first',
		self::E_TEMPFILE_NOTEXISTS => 'attempt to call GetAttachmentPath "UNLOCK" without saving something into tempfile',
		self::E_ACCOUNT_SIZE => 'account size limit reached',
		self::E_WEBDOCUMENTS_DISABLED => 'webdocument servervice is not enabled',
		self::E_ATTACHMENT_BLOCKED_BY_FILTER => 'Attachment extension filter is applied',
		self::E_FILENAME_INVALID => 'Invalid characters in file name',
	];

	public function setPassword($password)
	{
		$this->pass = slToolsCrypt::encryptSymmetric($password);
	}

	public function getPassword()
	{
		return slToolsCrypt::decryptSymmetric($this->pass);
	}

	 
	public static function getGwErrorMessage($code) : string
	{
		$code = intval($code);
		return self::$gwErrors[$code] ?? '';
	}

	 
	public static function getGwError($code) : ? string
	{
		$code = intval($code);
		try{
			$reflector = new ReflectionClass(get_called_class());
			$constants = $reflector->getConstants();
			foreach ($constants as $constant => $value) {
				if($value == $code && strpos($constant, 'E_') !== false) return $constant;
			}
		}catch (ReflectionException $e){}
		return null;
	}

	 
	public function FunctionCall($funcname, $param1 = "", $param2 = "", $param3 = "", $param4 = "", $param5 = ""){
		$result = false;
		try{
			$result = icewarp_calendarfunctioncall($funcname, $param1, $param2, $param3, $param4, $param5);
			if($result==-3){
				throw new Exc('groupware_db_connection');
			}
		}catch(CIWPipeException $pipeException){
			 		}catch(CIWPipeTimeoutException $timeoutException){
			 			throw new Exc('groupware_timeout',$timeoutException->getMessage());
		}catch(Exception $e){
		}
		return $result;
	}

	static public function CreateParamLine($array){
		if(!is_array($array)) return '';
		$result = '';
		foreach($array as $k => $v) {
			if(!is_array($v)){
				$result .= $k. "=" . rawurlencode($v) ."&";
			}
		}
		return $result;
	}

	 
	static public function CreateParamLineStrictLength($array, array $strictLengths = []){
		if(!is_array($array)) return '';
		if(empty($strictLengths)) return self::CreateParamLine($array);
		$result = '';
		foreach($array as $k => $v) {
			$value = rawurlencode($v);
			if(key_exists($k, $strictLengths)){
				$value = iconv_substr($value,0,$strictLengths[$k], 'utf-8');
			}
			if(!is_array($v)){
				$result .= $k. "=" . $value ."&";
			}
		}
		return $result;
	}

	static public function ParseParamLine($line){
		$result = array();
		
		if (!$line) return array();

		@$lines = explode("\r\n", $line);

		 		$fields = explode("&", strtoupper(trim($lines[0])));
		unset($lines[0]);

		 		if(is_array($lines) && !empty($lines)) foreach ($lines as $row){
		    $row = trim($row);
		    if (!$row) continue;
		    $arow = explode("&", $row);
            $item = array();
		    foreach ($fields as $k => $field){
			    if($field) $item[$field] = rawurldecode($arow[$k]);
		    }
		    $result[] = $item;
		}

		return $result;
	}
	
	static public function CreateURLLine($array)
	{
		return self::CreateParamLine($array);
	}
	public static function ParseURLLine($line)
	{
		$result = array();
		$fields = Tools::explode_j("&", trim($line));
		foreach($fields as $field){
			$itm = explode('=',$field);
			$result[$itm[0]] = rawurldecode($itm[1]);
		}
		return $result;
	}

	 	public function Login($relog = false)
	{ 
		if (!isset($this->user)) {
		 $this->sException = 'No user';
		 return false;
		}
		if (!isset($this->pass)) {
		 $this->sException = 'No pass';
		 return false;
		}

		if(!$relog && $this->IsConnected()){
			return $this->sessid;
		}else{
			$this->gid = false;
			$this->fid = false;
			unset($_SESSION['GW']);
		}
		$this->sessid = $this->FunctionCall("loginuser", $this->user, $this->getPassword(), $_SERVER['SERVER_NAME'],'||'.$_SERVER['REMOTE_ADDR']);
		if($this->sessid == -2){
			throw new Exc('groupware_upgrade_task');
		}
		if($this->sessid == -3){
			log_buffer("GroupWare ~ Database Connection down","EXTENDED");
			return false;
		}
		if($this->sessid == -4){
			throw new Exc('groupware_upgrade_task');
		}
		if(!$this->sessid){
			$account = createobject('account');
			if (!$account->Open($this->user)){
				throw new Exc('account_does_not_exist',$this->user);
			}
			if(!$account->AuthenticateUser($this->user,$this->getPassword(),$_SERVER['REMOTE_ADDR'])){
				throw new Exc('groupware_authenticate',$this->user);
			}
		}
		if($this->identity){
			$this->FunctionCall("Introduce",$this->sessid,$this->identity,$this->deviceID);
		}
		
		return $this->sessid;
	}

	public function Logout(){
		$this->FunctionCall("logoutuser", $this->sessid);
		$this->sessid = null;
		$this->grouplist = null;

	}

	public function IsConnected(){
		 		if ($_SESSION['REQUEST_UID']==$this->requestUID && $_SESSION['REQUEST_UID']!=''){
			return $this->logged_state;
		}
		if ($this->sessid){
			$folder_update = $this->FunctionCall("getfolderupdate", $this->sessid);
			
			if($folder_update==0){
				$this->Login(true);
			}
			if($folder_update < 0){
				$this->setState(array('folder_update'=>0));
				$this->requestUID = $_SESSION['REQUEST_UID'];
				if($folder_update==-3){
					log_buffer("GroupWare ~ Database Connection down","EXTENDED");
					$this->logged_state = false;
					return false;
				}
				if($folder_update==-3){
					log_buffer("GroupWare ~ Upgrade task is running","EXTENDED");
					$this->logged_state = false;
					return false;
				}
			}
			$this->logged_state = true;
			$this->setState(array('folder_update'=>$folder_update));
			$this->requestUID = $_SESSION['REQUEST_UID'];
			return true;
		}

		$this->logged_state = false;
		return false;
	}

	 	public function OpenGroup($groupid="*")
	{
		if(!$this->gid){
			$this->gid = $this->FunctionCall("opengroup", $this->sessid,$groupid);
		}
		return $this->gid;
	}

	public function CloseGroup($groupsessid)
	{
		if(!$this->gid){
			throw new Exc('call_open_group_first');
		}
		$result = $this->FunctionCall("closegroup", $groupsessid);
		$this->gid = null;
		return $result;
	}

	public function OpenFolder($folder, $autoSubscribe = false)
	{
		if(!$this->gid){
			throw new Exc('call_open_group_first');
		}
		$folder = MerakGWAPI::encode($folder);
		$pointer = &$_SESSION['GW'][$this->user]['folders'][$folder];
		if(!isset($pointer)){
			$this->fid = $pointer['fid'] = $this->FunctionCall("openfolder", $this->gid, $folder, $autoSubscribe);
			if(substr($folder,0,8)!='@@ALL@@#'){
				$pointer['rights'] = $this->FunctionCall('GetGroupAccessRights',$this->fid,'1');
			}else{
				$pointer['rights'] = GroupWareFolder::encodeRights(Folder::rightsToBitValue('rtlkx'));
			}
			 			if(!$pointer['rights']){
				$pointer['rights'] = 1;
			}
		}
		return $pointer;
	}
	
	public function getMyRights($folder)
	{
		$folder = MerakGWAPI::encode($folder);
		$rights = $_SESSION['GW'][$this->user]['folders'][$folder]['rights'];
		if(!$rights){
			throw new Exc('call_open_folder_first');
		}
		
		return $rights;
	}
	
	public function setRight($folder,$rights,$email = 'anyone')
	{
		$folder = MerakGWAPI::encode($folder);
		if(!$this->gid){
			throw new Exc('call_open_group_first');
		}

		$gwrights = GroupWareFolder::encodeRights($rights);
			
		 		if(!$this->gid && ($folder!='' && $folder!='.')){
			throw new Exc('call_open_folder_first');
		}
		if($rights & Folder::RIGHT_REMOVE){
			$result = $this->removeAcl($folder,$email);
		}else{
			$result = $this->FunctionCall('AddFolderRight',$this->gid,$folder,$email,$gwrights);
			if(strtolower($email)==strtolower($_SESSION['EMAIL'])){
				$_SESSION['GW'][$this->user]['folders'][$folder]['rights'] = $gwrights;
			}
			if(!$result){
				throw new Exc('groupware_setacl','Cannot set Acl:'.$folder.' id:'.$email.' rights:'.$gwrights);
			}
		}
		return $result;
	}
	
	public function removeAcl($folder,$email)
	{
		$folder = MerakGWAPI::encode($folder);
		return $this->FunctionCall('DeleteFolderRight',$this->gid,$folder,$email);
	}
	public function setAcl($folder,$aList)
	{
		$result = true;
		if(!is_array($aList))
			return false;
		try{
			if($folder!='' && $folder!='.'){
				$this->OpenFolder($folder);
			}
		}catch(Exc $e){
		}
		foreach($aList as $email => $right){
			$r = $this->setRight($folder,$right,$email);
			$result = $result && $r;
		}

		return $result;
	}

	public function getAcl($folder, $expand_guests = false)
	{
		if(!$this->gid){
			throw new Exc('call_open_group_first');
		}
		$folder = MerakGWAPI::encode($folder);
		$flags = $expand_guests?self::FLAG_EXPAND_GUESTS:0;
		$sList = $this->FunctionCall('GetFolderRightList',$this->gid,$folder,'',$flags);
		$aList = $this->ParseParamLine($sList);
	
		$someUser = reset($aList);
		$someUserACLRoot = $someUser['FRT_FOLDER'];
		if($someUserACLRoot && MerakGWAPI::encode($someUserACLRoot)==MerakGWAPI::encode($folder)){
			$inherited = false;
		}else{
			$inherited = true;
		}
		$result = array();
		if($aList){
			foreach($aList as $right){
				$rights = GroupWareFolder::decodeRights($right['FRTRIGHT']);
				if($inherited){
					$rights |= Folder::RIGHT_INHERITED;
				}
				$result[$right['FRTEMAIL']] = $rights;
			}
		}			
		return $result;
	}


	public function CloseFolder($fid)
	{
		$efid = self::encode($fid);
		$folder = $_SESSION['GW'][$this->user]['folders'][$efid];
		$folderid = $folder['fid'];
		unset($_SESSION['GW'][$this->user]['folders'][$efid]);
		$this->fid = null;
		return $this->FunctionCall('closefolder',$folderid);
	}
	

	public function subscribeAccount($sAccountID)
	{
		if(!$this->FunctionCall(
				'AddFolder',
				$this->gid,
				MerakGWAPI::encode($_SESSION['SHARED_PREFIX'].$sAccountID)
			)
		){
			throw new Exc('subscribe_acccount_gw',$sAccountID);
		}
	}
	
	public function unsubscribeAccount($sAccountID)
	{
		if(!$this->FunctionCall(
				'Unsubscribe',
				$this->gid,
				MerakGWAPI::encode($_SESSION['SHARED_PREFIX'].$sAccountID)
			)
		){
			throw new Exc('unsubscribe_acccount_gw',$sAccountID);
		}
		return true;
	}
	
	public function unsubscribeFolder($sFolder)
	{
		if(!$this->FunctionCall(
				'Unsubscribe',
				$this->gid,
				MerakGWAPI::encode($sFolder)
		)){
			throw new Exc('unsubscribe_folder_gw',$sFolder);
		}
		return true;
	}

	public function GetFolders($groupsessid)
	{
		return $this->ParseParamLine(
			$this->FunctionCall(
				"getfolderlist", 
				$groupsessid, 
				"FdrGAL,FdrDisplay,Fdr_LastActivity,'' As FdrGroupChatUnread,0 as FdrGroupChatSubscribed,'' as FdrGroupChatLastReadId,'' as FdrGroupChatNotify"
			)
		);
	}

	public function GetFolderListWithSize($groupsessid)
	{
		return $this->ParseParamLine(
			$this->FunctionCall(
				"getfolderlistwithsize", 
				$groupsessid
			)
		);
	}
	
	public function getItems(& $aFilterTag , &$folder)
	{

		if($folder->type=='V'){
			$fdr = $this->getFdr($folder);
			if($fdr->getType()=='C'
			   && stripos($aFilterTag['tag'],'itmfolder')===false){
				$aFilterTag['tag'].=',itmfolder';
			}
			if($fdr->getType()!='C'
			   && stripos($aFilterTag['tag'],'evnfolder')===false){
				$aFilterTag['tag'].=',evnfolder';
			}

			$items = $fdr->getItems( $aFilterTag );

			
			foreach($items as $key => $item){
				$itemFdrID = $item->item['EVNFOLDER']?$item->item['EVNFOLDER']:$item->item['ITMFOLDER'];
				$gwType = 'gw';
				try{
					unset($items[$key]->folder);
					$fdr =  $folder->account->getFolder(MerakGWAPI::decode($itemFdrID),$gwType);
					$items[$key]->folder = $fdr;
				}catch(Exc $e){
					 				}
			}
			return $items;
		}else{
			$items = $folder->getItems( $aFilterTag );
		}
		return $items;
	}
	
	public function getItem( $itemID, &$folder,$bAddons = WITH_ADDONS,$ctz = 0,$instanceDate = 0, $fields = '*', &$part_id = '')
	{
		
		if($folder->type=='V'){

			$fdr = $this->getFdr($folder);
			
			$item = $fdr->getItem( $itemID,$bAddons ,$ctz, $instanceDate, $fields, $part_id );
			$itemFdrID = $item->item['EVNFOLDER']?$item->item['EVNFOLDER']:$item->item['ITMFOLDER'];
			$gwType = 'gw';
			$itemFolder = &$folder->account->account->getFolder(MerakGWAPI::decode($itemFdrID),$gwType);
			unset($item->folder);
			$item->folder = &$itemFolder;
			return $item;
		}else{
			$item = $folder->getItem($itemID,$bAddons ,$ctz, $instanceDate );
		}
		return $item;
	}
	
	public function countItems(&$folder, $flags = 0, $positive = true,$filter = "",$search = false,$fields = ''){
		if($folder->type=='V'){

			$fdr = $this->getFdr($folder);
		}else{
			$fdr = $folder;
		}
		return $fdr->countItems( 
			$flags, 
			$positive,
			$filter ,
			$search,
			$fields
		);
	}
	
	
	public function moveItems($oFrom, $oTo,$oItems = false)
	{	
	}
	
	public function moveItem($oFrom,$oTo,$oItem)
	{
	}
	
	public function copyItems($oFrom, $oTo,$oItems = false)
	{
	}
	
	public function copyItem($oFrom,$oTo,$oItem)
	{
	}
	
	public function openAccess(&$folder)
	{
		if($folder->type=='V'){
			$fdr = $this->getFdr($folder);
			return $fdr->openAccess();
		}else{
			return $folder->openAccess();
		}
	}
	
	public function getContactList(&$folder,$private = false,$format = false)
	{
		if($folder->type=='V'){

			$fdr = $this->getFdr($folder);
			$items = $fdr->getContactList( $private, $format );
			foreach($items as $item){
				unset($item->folder);
				$item->folder = &$folder;
			}
			return $items;
		}else{
			$items = $folder->getContactList( $private, $format );
		}
		return $items;
	}
	
	public function GetGroups($groupview=""){
		if (!$this->sessid){
		 $this->sException = 'Call login first';
		 return false;
		}

		if(is_array($this->grouplist)) return $this->grouplist;

		return $this->grouplist = $this->ParseParamLine($this->FunctionCall("getgrouplist", $this->sessid,$groupview));
	}

	public function GetGroupSessid($groupid="*"){
		return $this->OpenGroup($groupid);
	}

	public function GetGroupRights($groupsessid, $folder = ''){
		return $this->FunctionCall("GetGroupAccessRights",$groupsessid, $folder);
	}

	public function TZClearCache()
	{
		unset($this->seconds);
	}
	public function TZGetSeconds($ctz,$inout = 'in')
	{
		if(!$this->seconds){
			
			$stz = $_SESSION['TIMEZONE'];
			$ctz = $ctz * 60;
			$seconds = $stz - $ctz;
			if ($inout == 'out'){
				$this->seconds = (-1)*$seconds;
			}else{
				$this->seconds = $seconds;
			}
		}

		return $this->seconds;
	}

	public function TZShift(&$date,&$time,$ctz,$inout = 'in')
	{
		$seconds = $this->TZGetSeconds($ctz,$inout);
		if ($seconds && $date && isset($time) && intval($time)!=-1){
			$unix = self::calendar2unixTime($date,$time);
			$unix+= $seconds;
			$time = self::unix2calendarTime($unix);
			$date = self::unix2calendarDate($unix);
			return true;
		}
		return false;
	}
	
	public function TZShiftUnix(&$unixtime,$ctz,$inout = 'in',$debug = false)
	{
		$date = $this->unix2calendarDate($unixtime);
		$time = $this->unix2calendarTime($unixtime);
		if($this->TZShift($date,$time,$ctz,$inout)){
			$unixtime = $this->calendar2unixTime($date,$time);
		}
	}
	   public function TimeZone(&$aItem,$inout = 'in',$forceCTZ = false,$isRecurrent = false,$process = false)
  {
    $aItem = @array_change_key_case($aItem,CASE_UPPER);
	if($process){
     	if($aItem['EVNTIMEFORMAT']=='Z' || $isRecurrent){
		if(!$forceCTZ){
			
			$tzid = $aItem['_TZID'];
			
			if($inout=='out'){
				$source = '';
				$dest = $tzid;
			}else{
				$source = $tzid;
				$dest = '';
			}
			
			if ($aItem['EVNSTARTDATE'] && isset($aItem['EVNSTARTTIME']) && intval($aItem['EVNSTARTTIME'])!=-1){
				$iso8601 = self::calendar2iso8601($aItem['EVNSTARTDATE'],$aItem['EVNSTARTTIME'],true);
				$iso8601 = $this->FunctionCall("GetTZIDTime",$iso8601,$source,$dest);
				$aItem['EVNSTARTTIME'] = self::iso86012calendartime($iso8601);
				$aItem['EVNSTARTDATE'] = self::iso86012calendardate($iso8601);
			}
			if ($aItem['EVNENDDATE'] && isset($aItem['EVNENDTIME']) && intval($aItem['EVNENDTIME'])!=-1){
				$iso8601 = self::calendar2iso8601($aItem['EVNENDDATE'],$aItem['EVNENDTIME']);
				$iso8601 = $this->FunctionCall("GetTZIDTime",$iso8601,$source,$dest);
				$aItem['EVNENDTIME'] = self::iso86012calendartime($iso8601);
				$aItem['EVNENDDATE'] = self::iso86012calendardate($iso8601);
			}
			unset($aItem['TZID']);
			unset($aItem['CTZ']);
		}
	}else if ($aItem['EVNTIMEFORMAT']=='F'){
		
	}else{
	    if ($aItem['CNT_ID']) return;
	
	    if (!isset($this->seconds)){
	      $stz = $_SESSION['TIMEZONE'];
	
	     if(isset($aItem['CTZ'])){
	        $ctz = $aItem['CTZ'];
	        $ctz = $ctz * 60;
	      }else{
	        return;
	      }
	      $this->seconds = $stz - $ctz;
	    }
	    unset($aItem['CTZ']);
	
	    if ($inout == 'out') $seconds = (-1)*$this->seconds;
	    else $seconds = $this->seconds;
	    if ($aItem['EVNSTARTDATE'] && isset($aItem['EVNSTARTTIME']) && intval($aItem['EVNSTARTTIME'])!=-1){
	      $unix = self::calendar2unixTime($aItem['EVNSTARTDATE'],$aItem['EVNSTARTTIME']);
	      $unix+= $seconds;
	      $aItem['EVNSTARTTIME'] = self::unix2calendarTime($unix);
	      $aItem['EVNSTARTDATE'] = self::unix2calendarDate($unix);
	
	    }
	    
	    if ($aItem['EVNENDDATE'] && isset($aItem['EVNENDTIME']) && intval($aItem['EVNENDTIME'])!=-1){
	      $unix = self::calendar2unixTime($aItem['EVNENDDATE'],$aItem['EVNENDTIME']);
	      $unix+= $seconds;
	
	      $aItem['EVNENDTIME'] = self::unix2calendarTime($unix);
	      $aItem['EVNENDDATE'] = self::unix2calendarDate($unix);
	    }
	}
	}
	unset($aItem['TZID']);
	unset($aItem['CTZ']);
  }
  
  	public static function calendar2iso8601($calendardate,$calendartime,$test = false)
  	{
		$g = jdtogregorian($calendardate);
		$g = explode('/',$g);
		$minutes = $calendartime;
		
		$hours = $minutes/60;
		 		
		if(strpos($hours,'.')!==false){
			$hours = (int) substr($hours,0,strpos($hours,'.'));
		}else if(strpos($hours,',')!==false){
			$hours = (int) substr($hours,0,strpos($hours,','));
		}
		
		
		
		 		
		if($hours){
			$minutes = $minutes % ($hours*60);
		}

		$iso8601 = $g[2].''.str_pad($g[0],2,'0',STR_PAD_LEFT).''.str_pad($g[1],2,'0',STR_PAD_LEFT).'T'.
		str_pad($hours,2,'0',STR_PAD_LEFT).''.str_pad($minutes,2,'0',STR_PAD_LEFT).'00';

  		return $iso8601;
	  }
  	
  	public static function iso86012calendartime($iso8601)
  	{
  		preg_match('/([0-9]{4})-?([0-9]{2})-?([0-9]{2})T([0-9]{2}):?([0-9]{2}):?([0-9]{2})/si',$iso8601,$matches);
  		return $matches[4] * 60 + $matches[5];
  	}
  	
	  public static function iso86012calendardate($iso8601)
  	{
  		preg_match('/([0-9]{4})-?([0-9]{2})-?([0-9]{2})T([0-9]{2}):?([0-9]{2}):?([0-9]{2})/si',$iso8601,$matches);
  		return GregorianToJD($matches[2], $matches[3], $matches[1]);
  	}
  	
  	
	 	public static function unix2calendarDate($unixDate)
	{
	 $arr = getdate(intval($unixDate));
	 return GregorianToJD($arr["mon"], $arr["mday"], $arr["year"]);
	}
	public static function unix2calendarTime($unixDate) 
	{
		$arr = getdate($unixDate);
  		return $arr["hours"] * 60 + $arr["minutes"];
	}
	public static function calendar2unixTime($calendarDate, $calendarTime) 
	{
    $date = JDToGregorian($calendarDate);
		preg_match("/([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/s", $date, $regs);
		$month = $regs[1];
		$day = $regs[2];
		$year = $regs[3];
		if (intval($calendarTime) === -1) {
			$hour = 0;
			$min = 0;
			$noTime = true;
		} else {
			$hour = floor($calendarTime / 60);
			$min = $calendarTime % 60;
			$noTime = false;
		}
		
		$result = mktime($hour, $min, 0, $month, $day, $year);
		
		 		if ($result === false || $result === -1)
			$result = '';

		return $result;
	}
	 	static public function filterToAttributes($aFilterTag)
	{
		$attributes = array();
		if($aFilterTag['orderby']){
			if($_SESSION['COLLATE_ENABLE']){
				$aFilterTag['orderby'] = Tools::collateOrderBy($aFilterTag['orderby']);
			}
			 			if(preg_match_all('/(?P<field>(?!DESC|ASC)[^,]*)\\s(?P<direction>DESC|ASC),?\\s?/i', $aFilterTag['orderby'], $matches, PREG_PATTERN_ORDER)){
				$aFilterTag['orderby'] = implode(', ', $matches['field']) . ' ' . current($matches['direction']);
			}
			$attributes[] = 'order='.icewarp_sanitize_db_sql($aFilterTag['orderby'],false,true,'groupware');
		}
		if($aFilterTag['groupBy'] ?? false){
			$attributes[] = 'groupBy='.icewarp_sanitize_db_sql($aFilterTag['groupBy'], false, true, 'groupware');
		}
		if($aFilterTag['offset']){
			$attributes[] = 'position='.intval($aFilterTag['offset']);
		}
		if($aFilterTag['limit']){
			$attributes[] = 'limit='.intval($aFilterTag['limit']);
		}
		if($aFilterTag['tags'] ?? false){
			$attributes[] = 'tags';
		}
		$sAttributes = implode($attributes, '; ');
		return $sAttributes;
	}
	
	 	static public function encode($folder)
	{
		$folder = str_replace('/','\\',$folder);
		return $folder;
	}
	
	 	static public function decode($folder)
	{
		$folder = str_replace('\\','/',$folder);
		return $folder;
	}
	
	static public function getFolderOwner(&$folder, &$groupchatowner = '',&$hasPublicRoot = false)
	{
		$hasPublicRoot = false;
		$groupchatowner = '';
		$folder_name = MerakGWAPI::decode($folder->name);
		$shared_prefix = MerakGWAPI::decode($_SESSION['SHARED_PREFIX']);
		if(iconv_strpos($folder_name,$shared_prefix,0,'utf-8')===0){
			$folder_name = MerakGWAPI::decode($folder->name);
			$shared_prefix = MerakGWAPI::decode($_SESSION['SHARED_PREFIX']);
			$folder_length = iconv_strlen($folder_name,'utf-8');
			$shared_length = iconv_strlen($shared_prefix,'utf-8');
			$owner = iconv_substr($folder_name,$shared_length,$folder_length-$shared_length+1,'utf-8');
			$owner = iconv_substr($owner,0,iconv_strpos($owner,'/',0,'utf-8'),'utf-8');
		}else{
			if($folder->getType()=='M'){
				$owner = $_SESSION['EMAIL'];
				 				$parent = $folder->name;
				while ($parent!=''){
					if(iconv_strrpos($parent, '/', 'utf-8')===false){
						$parent = '';
					}
					$parent = iconv_substr($parent,0,iconv_strrpos($parent,'/','utf-8'));
					try{
						$oParent = $folder->account->getFolder($parent);
						if($oParent->type=='X' && $oParent->groupOwner){
							$owner = $oParent->groupOwner;
							$hasPublicRoot = true;
						}
					}catch(Exc $e){}
				}
			}else{
				$owner = $folder->groupOwner;
				if(empty($owner)){
					$owner = $folder->account->gwAPI->FunctionCall("GetGroupOwnerEmail", $folder->account->sGWSessionID, true);
					if($folder->getType()=='I'){
						$fid = $folder->openAccess();
						$groupchatowner = $folder->account->gwAPI->FunctionCall("GetGroupOwnerEmail", $fid, true);
					}
				}
			}
		}
		return $owner;
	}
	
	static public function getOwnerFullAddress($email, $groupchatowneremail = '')
	{
		if(!isset(self::$ownerEmailCache[$groupchatowneremail?$groupchatowneremail:$email])){
			$account = createobject("account");
			if($account->Open($email)){
				$fullname = $account->getProperty("u_name");
			}
			self::$ownerEmailCache[$groupchatowneremail?$groupchatowneremail:$email] = ($fullname?('"'.addslashes($fullname).'" '):'').('<'.($groupchatowneremail?$groupchatowneremail:$email)).'>';
		}
		return self::$ownerEmailCache[$groupchatowneremail?$groupchatowneremail:$email];
	}
	
	public function setGroupTimezone($timezone)
	{
		$this->FunctionCall("UpdateOwnerInfo",$this->sessid,'OwnTZID='.$timezone,'use_tzid=1');
	}
	
	public function setState($state)
	{
		$_SESSION['GW']['STATE'] = $state;
		parent::setState($state);
	}
	
	public function getState()
	{
		return $this->state;
	}
	
	public function saveItems(&$folder,$oItems = false)
	{
		
		slSystem::import('tools/icewarp');
		if(!$folder->sFID){
			$folder->sFID = $folder->openAccess();
		}
		$count = array();
		$names = array(
				'C'=>'contacts',
				'E'=>'events',
				'T'=>'tasks',
				'N'=>'notes',
				'J'=>'journals',
				'F'=>'files'
		);
		$data = '';
		$type = $folder->getType();

		$name = ($folder->type=='V')?(str_replace('__@@EVENTS@@__','Search',$folder->name)):$folder->name;
		switch($type){
			 			case 'C':
				 			case 'E':
			case 'T':
			case 'N':
				break;
				 			case 'J':
			case 'F':
				$fname = basename($name).'_'.time().'.zip';
				$fileDir = User::getTempDir().uniqid('zip_').'/';
				$filename = $fileDir.uniqid('zip_').'.zip';
				$tempDir = $fileDir.'files'.'/';
				 				try{
					$zip = new slToolsZIP();
					$zip->setTempDir($tempDir);
					$zip->open($filename, ZIPCREATE);
				
				}catch(Exception $e){
					exit("cannot open <$filename>");
				}
				
				break;
		}
		if($oItems){
			$all = false;
			foreach($oItems as $item) {
				$count[$type]++;
				switch($type){
					case 'C':
						 						$versit = $item->getVersitObject();
						$data.=$versit;
						break;
					case 'F':
						 						$attachments = $item->aAddons['attachment']->getData();
						@$attachment = reset($attachments);
						$attachment['name'] = $attachment['ATTDESC']?$attachment['ATTDESC']:urldecode($attachment['name']);
						$name = Tools::fixAttachmentName($attachment);
						$ifile = $item->getAttachmentDataFile($attachment['ATTNAME']);
						$zip->addFile(
								$ifile,
								$name
						);
						break;
					case 'E':
					case 'T':
					case 'N':
						$event_ids[] = $item->itemID;
						break;
					case 'J':
						 						$ifilename = date('YmdGis');
						$versit = $item->getVersitObject();
						$name=$item->item['EVNTITLE']?$item->item['EVNTITLE']:$names[$type].'_'.$count[$type];
						$name.=VCALENDAR_EXT;
						$zip->addFromString($name,$versit);
						break;
					default:
						throw new Exc('save_items_folder_type_unsupported',$name);
					break;
				}
			}
		} else{
			$all = true;
			switch($type){
				case 'C':
				case 'E':
				case 'T':
				case 'N':
				case 'J':
					$data = $this->FunctionCall(
					'GetItemObject',
					$folder->sFID,
					'',
					'',
					';ITEMLIST'
					);
					break;
				case 'F':
					$filter = array();
					$oItems = $folder->getItems($filter);
					
					if($oItems){
						foreach($oItems as $item){
							$item->getAddons();
							 							$attachments = $item->aAddons['attachment']->getData();
							@$attachment = reset($attachments);
							$ifile = $item->getAttachmentDataFile($attachment['ATTNAME']);
							$zip->addFile(
									$ifile,
									$attachment['ATTDESC']?$attachment['ATTDESC']:$attachment['ATTNAME']
							);
						}
					}
					break;
				default:
					throw new Exc('save_items_folder_type_unsupported',$name);
				break;
			}
		
		}
		switch($type){
			 			case 'C':
				$filename = $_SESSION['user']->getUploadDir('zip').
				'/'.urlencode(basename($name)).'_'.
				time().
				VCARD_EXT;
				slToolsIcewarp::iw_file_put_contents($filename,$data);
				$fname = basename($name).'_'.date('Y-m-d').VCARD_EXT;
				$contentType = 'text/x-vcard';
				break;
				 			case 'E':
			case 'T':
			case 'N':
				$filename = $_SESSION['user']->getUploadDir('zip').
				'/'.$names[$type].
				time().
				VCALENDAR_EXT;
				if($all){
					slToolsIcewarp::iw_file_put_contents($filename,$data);
				}else{
					$ids = join(';',$event_ids);
					$events = $this->FunctionCall(
							'GetVCalendars',
							$folder->sFID,
							$ids,
							'',
							';ITEMLIST;EMBEDATT'
					);
					slToolsIcewarp::iw_file_put_contents($filename,$events);
				}
		
				$fname = basename($name).'_'.date('Y-m-d').VCALENDAR_EXT;
				$contentType = 'text/x-vcalendar';
				break;
				 			case 'J':
				if($all){
					slToolsIcewarp::iw_file_put_contents($filename,$data);
					$fname = basename($name).'_'.date('Y-m-d').VCALENDAR_EXT;
					$contentType = 'text/x-vcalendar';
				}
			case 'F':
				$zip->close();
				$contentType = 'application/zip';
				break;
		}
		
		 		$folderID = date('Y-m-d-') . Tools::my_uniqid();
		$itemID = Tools::my_uniqid();
		$_SESSION['user']->addFileAttachment(
				$filename,
				$fname,
				$contentType,
				$folderID,
				$itemID
		);
		return array(
				'fullpath'=>$folderID.'/'.$itemID,
				'class'=>'file',
				'file'=>$filename,
				'name'=>$fname,
				'type'=>$contentType
		);	
	}
	public function getFdr(&$folder)
	{
		if($folder->isEmpty()){
			switch($folder->sharetype){
				case 'personal':
					$sFID = '@@PERSONAL@@#'.$folder->getType();
					break;
				case 'public':
					$sFID = '@@PUBLIC@@#'.$folder->getType();
					break;
				case 'all':
				default:
					$sFID = '@@ALL@@#'.$folder->getType();
					break;
			}
			
			$fdr = new GroupWareFolder(
					$folder->account->account->gwAccount,
					$sFID,
					$folder->contentType
			);
		}else{
			foreach($folder->folders as $containFolder){
				$ids[] = $containFolder->folderID;
			}
			$sFID = join( CRLF, $ids );
			$fdr = new GroupWareFolder(
					$folder->account->account->gwAccount,
					$sFID,
					$folder->contentType
			);
			$fdr->autoSubscribe = $folder->autoSubscribe;
	
		}
	
		$fdr->folderID = $sFID;
		return $fdr;
	}
	
}

class IceWarpGWAPI extends MerakGWAPI{}

?>
