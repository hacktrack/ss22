<?php
 
 class GroupWareAccount extends Account
 {
	public $gwAPI;	 	public $sGWSessionID;	 	public $bLogged;	 	public $foldersLoaded;   	public $acl;
 	public $account;
 	public $GWSessionID;

	 
	public function __construct($username, $password, &$account)
	{
		 		$this->gwAPI = new MerakGWAPI('com.icewarp.webclient');
		$this->gwAPI->attach($this);
		 		$this->account = &$account;
		 		$this->gwAPI->user = $username;
		$this->gwAPI->setPassword($password);
		 		if (!$this->gwAPI->Login()) 
		{
			log_buffer('Groupware initialization failed', 'ERROR');
			$this->bLogged = false;
			return false;
		}	else{
			$this->bLogged = true;
			if(empty($this->account->folders['gw'])){
				$this->foldersLoaded = false;
			}
		}
		$this->folderClassName = 'GroupWareFolder';
	}
	
	 
	private function reloadGWAPI()
	{
		 		if(isset($_SESSION['GW'])){
			unset($_SESSION['GW']);
		}
		 
		if (!$this->gwAPI->Login())
			return false;

		$this->bLogged = true;
		unset($this->sGWSessionID);
		$this->foldersLoaded = false;
		return true;
	}
	
	public function isConnected()
	{
		 		if (!$this->gwAPI->IsConnected()){
			if (!$this->reloadGWAPI()){
				return false;
			}
		}
		return true;
	}
	
	public function loadFolders()
	{
		$this->foldersLoaded = true;
		$this->account->folders["gw"] = array();
		 		if (!$this->sGWSessionID = $this->gwAPI->OpenGroup("*")){ 
				return array();
		}
		 		if (!$aFolders = $this->gwAPI->GetFolders($this->sGWSessionID)){ 
				throw new Exc('folder_get_list',$this->sGWSessionID);
		}
		$publicGroupRights = [];
		 		foreach ($aFolders as $folder){
			$sRights = '';
			 			if(
				isset($folder['FDRTYPE']) 
				&& Folder::isRestrictedType($folder['FDRTYPE'])
				&& !$_SESSION['TCONLY']
			){
				continue;
			}
			$sName = $folder["FDR_ID"];
			 			try{
				$pom = $_SESSION['LOGS'];
				$_SESSION['LOGS'] = false;
				if ($folder['FDR_DEFAULT'] == '1') {
					$sRights = Folder::FULL_RIGHTS;
				} else {
				 					if ($_SESSION['GROUPCHAT_SUPPORT'] || $folder['FDRTYPE'] == 'P') {
						if ($folder['FDRTYPE'] == 'Y') {
						$this->gwAPI->OpenFolder($folder['FDR_ID']);
							$sRights = $this->gwAPI->getMyRights($sName, $folder);
					}
					 						if ($folder['FDRTYPE'] == 'P') {
							$sRights = $this->gwAPI->GetGroupRights($this->gwAPI->gid, $folder['FDR_ID']);
						$publicGroupRights[$folder['FDR_ID']] = $sRights;
					}
					} else {
						$sRights = $this->gwAPI->getMyRights($sName, $folder);
				}
					if (empty($sRights) && isset($publicGroupRights[$folder['GRPOWNER']])) {
					$sRights = $publicGroupRights[$folder['GRPOWNER']];
				}

				$sRights = GroupWareFolder::decodeRights($sRights);
				}
				$_SESSION['LOGS'] = $pom;
			}catch(Exc $e){
				$sRights = '';
				$_SESSION['LOGS'] = $pom;
			}
			$sName = MerakGWAPI::decode($folder["FDR_ID"]);
			 			if (($pos = strpos($sName,"/"))!==false){
				$sParentFolderName = substr($sName,0,$pos);
				 				if (!isset($this->account->folders["gw"][$sParentFolderName])
				&& !isset($this->account->folders["main"][$sParentFolderName])){
					$rights = 0;
					$rights = $rights |=Folder::RIGHT_READ;
					$rights = $rights |=Folder::RIGHT_FOLDER_READ;
					$rights = $rights |=Folder::RIGHT_FOLDER_DELETE;
					$rights = $rights |=Folder::RIGHT_ADMIN;
					$this->account->folders["gw"][$sParentFolderName] = new GroupWareFolder($this,$sParentFolderName,'A',$rights,false);
				}
			}

			$this->account->folders["gw"][$sName] = new GroupWareFolder(
				$this,
				$folder['FDR_ID'],
				$folder['FDRTYPE'],
				$sRights,
				$folder['FDR_DEFAULT'],
				$folder['FDRGAL'],
				$folder['FDRDISPLAY'],
				$folder['GRPLINKFOLDER'],
				$folder['FDRGROUPCHATUNREAD'],
				$folder['GRPOWNER'],
				$folder['GRPRELATIVEFOLDER'],
				$folder['FDRGROUPCHATSUBSCRIBED'],
				$folder['FDRGROUPCHATLASTREADID'],
				$folder['FDR_LASTACTIVITY'],
				$folder['FDRSUBTYPE'],
				$folder['FDRGROUPCHATNOTIFY']
			);
		}
		$_SESSION['refreshed'] = true;
	}
	
	 	
	public function getFolders($refresh = true)
	{
		
		if(!$this->isConnected()){
			return array();
		}
		if(!$this->foldersLoaded){
			$this->loadFolders();
		}
		return $this->account->folders['gw'];
	}
	

	
	 
	public function &getFolder($name, &$type = '', $logError = true, $allowDualHiddenFolder = false)
	{
		if(!$this->isConnected()){
			return false;
		}
		if(strtoupper($name) == '@@GAL@@'){
			return $this->getGalFolder();
		}
		if(strtoupper($name) == '@@MYCARD@@'){
			return $this->getMyCardFolder();
		}
		 		$type="gw"; 
		 		if(!$this->foldersLoaded){
			$this->loadFolders();
		}
		 		$name = MerakGWAPI::decode($name);
		if (!isset($this->account->folders["gw"][$name]))
			throw new Exc('folder_does_not_exist', $name, true, $logError);  		
		try{
			$pom = $_SESSION['LOGS'];
			$_SESSION['LOGS'] = false;
			$sRights = $this->gwAPI->getMyRights($name);
			$sRights = GroupWareFolder::decodeRights($sRights);
			$_SESSION['LOGS'] = $pom;
		}catch(Exc $e){
			$sRights = '';
			$_SESSION['LOGS'] = $pom;
		}
		
		$this->account->folders["gw"][$name]->rights = $sRights;

		 		return $this->account->folders["gw"][$name];
	}
	
	public function getGalFolder()
	{
		$name = '@@GAL@@';
		$info = $this->gwAPI->OpenFolder($name);
		return new GroupWareFolder(
			$this,
			$name,
			'C'
		);
	}
	
	public function getMyCardFolder()
	{
		$name = '@@mycard@@';
		$info = $this->gwAPI->OpenFolder($name);
		return new GroupWareFolder(
			$this,
			$name,
			'C'
		);
	}
	 
	public function createFolder($param,$createDual = true)
	{
		$folder = isset($param['name'])?$param['name']:false;
		$type = isset($param['type'])?$param['type']:false;
		$virtual = isset($param['virtual'])?$param['virtual']:false;
		$private = $param['private'];
		Folder::checkName($folder);
		 		$folder = GroupWareFolder::create($this,$folder,$type,$createDual,$private);
		$parent = $folder->name;
		while ($parent!=''){
			if(iconv_strrpos($parent, '/', 'utf-8')===false){
				$parent = '';
			}
			$parent = iconv_substr($parent,0,iconv_strrpos($parent,'/','utf-8'));
			try{
				$oParent = $folder->account->getFolder($parent);
				$folder->subscription_type = $oParent->subscription_type;
			}catch(Exc $e){

			}
		}
		return $folder;
	}

	public function deleteFolder($folderID,$deleteDual = true)
	{
		if(Folder::isSharedRoot($folderID)){
			 			if (!$this->gwAPI->FunctionCall
				(
					"DeleteFolder",
					$this->sGWSessionID,
					MerakGWAPI::encode($folderID)
				)
			){
				throw new Exc('folder_delete',$folderID);
			}
			 			if(is_array($this->account->folders['gw'] ))
			foreach($this->account->folders['gw'] as $n => $fdr){
				if(strpos($n,$folderID)===0){
					unset($this->account->folders['gw'][$n]);
					unset($_SESSION['GW'][$this->account->accountID]['folders'][MerakGWAPI::encode($n)]);
				}
			}
			if($deleteDual && $this->account){
				$this->account->deleteFolder($folderID,false);
			}
		}else{
			parent::deleteFolder($folderID);
		}
	}
	 
	public function subscribe($aAccounts)
	{
		foreach($aAccounts as $sAccountID){
			$this->gwAPI->subscribeAccount($sAccountID);
		}
		 		 
		 	}
	
	 
	public function unsubscribe($aAccounts)
	{
		foreach($aAccounts as $sAccountID){
			$this->gwAPI->unsubscribeAccount($sAccountID);
		}
		 		 
		 	}
	
	public function subscribeFolder($folder)
	{
		return GroupWareFolder::create($this,MerakGWAPI::encode($folder),"",false);
	}
	
	public function unsubscribeFolder($folder)
	{
		$this->gwAPI->unsubscribeFolder($folder);
		 		 		 
		 	}
	
	public function getMyRights($folder)
	{
		return GroupWareFolder::decodeRights($this->gwAPI->getMyRights($folder));
	}
	
	public function getAcl($folder = '', $expand_guests = false)
	{
		return $this->acl = $this->gwAPI->getAcl($folder,$expand_guests);
	}
	
	public function setAcl($acl,$folder = '',$bSetDual = true)
	{
		 		if($bSetDual && $this->account){
			$gw_acl = $this->getAcl($folder,true);
			$imap_acl = $this->account->getAcl(($folder == '.' || $folder == '')?'.':$folder);
			Folder::checkACLConsistence($gw_acl,$imap_acl,$acl);
		}

		if($folder == '.' || $folder == ''){
			$this->gwAPI->setAcl('',$acl);
		}else{
			$type = 'gw';
			$this->account->getFolder($folder,$type);
			$this->gwAPI->setAcl($folder,$acl);
		}
		if($bSetDual && $this->account){
			$this->account->setAcl($acl,$folder,false);
		}
	}

	public function inheritAcl($sName,$bInheritDual = true)
	{
		$acl['@'] = false;
		$this->setAcl($acl,$sName,false);
		 		if($bInheritDual && $this->account){
			if(isset($this->account->folders['main'][$sName])){
				$this->account->inheritAcl($sName,false);
			}
		}
		$acl = $this->getAcl($sName);
		return $acl;
	}
	
	
	public function isInheritedACL($sName, $acl = array())
	{
		@$someUserRights = reset($acl);
		if(Folder::RIGHT_INHERITED & $someUserRights){
			return true;
		}else{
			return false;
		}
	}

	
	 
	public function logout()
	{
		if ($this->gwAPI->IsConnected()) $this->gwAPI->Logout();
	}
	public function sync($force_gw = false, $folders = array())
	{
		$this->getFolders();
		if($oUser = &$_SESSION['user']){
			log_buffer("GroupWareAccount::sync() line 396 User::syncDefaultFoldersStorage()","EXTENDED");
			$oUser->syncDefaultFoldersStorage();
		}
	}
	
	 
	
	public function update(slObservable &$observable)
	{
		$this->loadFolders();
	}
	
	public function setGroupTimezone($timezone)
	{
		$this->gwAPI->setGroupTimezone($timezone);
	}

	public function sendFolderLimitNotification($folderID,$sComment)
	{

		if (!$this->sGWSessionID){
			$this->GWSessionID = $this->gwAPI->OpenGroup("*");
		}

		return $this->gwAPI->FunctionCall('FolderLimitNotification',$this->sGWSessionID, IceWarpGWAPI::encode($folderID), $sComment);
	}
	
}
?>
