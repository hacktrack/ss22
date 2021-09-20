<?php
 
class IMAPAccount extends CacheAccount
{
	public $folderClassName;
	public $acc_type;
	public $changed;
	public $primary;
	public $virtualAccount;
	public $acl;
	public $aSyncedFolders;

	 
	public function __construct($user, $accountID, $server, $port, $username, $password, $primary = false,$properties = false)
	{
		$this->folderClassName = 'IMAPFolder';
		$this->acc_type = 'imap';
		parent::__construct(
			$user,
			$accountID,
			$server,
			$port,
			$username,
			$password,
			$primary,
			'IMAP',
			$properties
		);
	}
	 
	public function createFolder($param)
	{
		$name = isset($param['name'])?$param['name']:false;
		$type = isset($param['type'])?$param['type']:false;
		$check = isset($param['check'])?$param['check']:false;
		$channels = isset($param['channels'])?$param['channels']:false;
		$createDual = isset($param['dual'])?$param['dual']:true;
		$attributes = isset($param['attributes'])?$param['attributes']:false;
		
		Folder::checkName($name);
		if($check){
			 			Account::createFolder($param);
		}
		 		$this->folders['main'][$name] = IMAPFolder::create($this, $name, $channels, $createDual, $attributes);
		return $this->folders['main'][$name];
	}

	public function deleteFolder($folderID,$deleteDual = true)
	{
		
		if(strtolower($folderID)==='inbox'){
			throw new Exc('folder_delete',$folderID);
		}
		
		 		 		if(Folder::isSharedRoot($folderID)){
			$imap = IMAP::instance($this);
			$imap->deleteMailbox($folderID);
			 			foreach($this->folders['main'] as $n => $fdr){
				if(strpos($n,$folderID)===0){
					unset($this->folders['main'][$n]);
				}
			}
			if($deleteDual && $this->gwAccount && $this->gwAccount->bLogged){
				$this->gwAccount->deleteFolder($folderID,false);
			}
		}else{
			parent::deleteFolder($folderID);
		}
	}
	 
	public function sync($force_gw = false, $folders = array())
	{
		if(!Folder::isRestrictedType('M')){
			$this->changed = array();
			try{
				$imap = IMAP::instance($this);
				if(empty($folders)){
					$folders = $imap->getMailboxes($this->accountID);
				}
				parent::sync($force_gw, $folders);
			}catch(Exc $e){
				if($e->wmcode == 'imap_open'){
					if($this->primary){
						$acc = new IceWarpAccount();
						if(!$acc->open($this->accountID)){
							@session_destroy();
							throw new Exc('session_no_user',$this->accountID);
						}
					}
				}
				if($e->wmcode == 'imap_authenticate'){
					throw new Exc('imap_authenticate',$this->accountID);
				}
				if($e->wmcode == 'account_does_not_exist'){
					if($this->primary){
						session_destroy();
					}
					throw new Exc('account_does_not_exist',$this->accountID);
				}
				 	
			}catch(Exception $e){
	
			}
		}
		if($this->gwAccount && $this->gwAccount->bLogged){
			try{
				$this->gwAccount->sync($force_gw);
			}catch(Exc $e){

			}
		}
		if($this->virtualAccount){
			$this->virtualAccount->sync();
		}
		return true;
	}

	public function setAcl($acl,$folder = '.',$bSetDual = true)
	{
		 		if($bSetDual && $this->gwAccount && $this->gwAccount->bLogged){
			try{
				$imap_acl = $this->getAcl(($folder == '.' || $folder == '')?'.':$folder);
				$gw_acl = $this->gwAccount->getAcl($folder);
			    Folder::checkACLConsistence($imap_acl,$gw_acl,$acl);
			}catch(Exc $e){
				 			}
		}
		try{
			$imap = IMAP::instance($this);
			 			unset($acl[$this->accountID]);
			if($folder == '.' || $folder == ''){
				$imap->setAcl('.',$acl,false);
			}else{
				$type = 'main';
				$oFolder = $this->getFolder($folder,$type,false,true);
				$imap->setAcl($folder,$acl,false);
			}
		}catch(Exc $e){
			 		}
		if($bSetDual && $this->gwAccount){
			$this->gwAccount->setAcl($acl,$folder,false);
		}
	}
	
	public function getAcl($folder = '.')
	{
		$imap = IMAP::instance($this);
		$folder = $imap->encode($folder);
		return $this->acl = $imap->getAcl($folder);
	}
	
	public function getMyRights($folder)
	{
		$imap = IMAP::instance($this);
		$folder = $imap->encode($folder);
		return IMAPFolder::decodeRights($imap->getMyRights($folder));
	}
	

	public function inheritAcl($sName,$bInheritDual = true)
	{
		$acl['@'] = false;
		$this->setAcl($acl,$sName,false);
		 		if($bInheritDual && $this->gwAccount && $this->gwAccount->bLogged){
			if(isset($this->folders['gw'][$sName])){
				$this->gwAccount->inheritAcl($sName,false);
			}
		}
		$acl = $this->getAcl($sName);
		return $acl;
	}
	
	public function isInheritedACL($sName, $acl = false)
	{
		if($acl===false){
			$acl = $this->getAcl( $sName );
		}
		@$someUserRights = reset($acl);
		if($someUserRights & Folder::RIGHT_INHERITED){
			return true;
		}else{
			return false;
		}
	}
	
	public function test()
	{
		$imap = IMAP::instance($this);
		$mAccount = new IceWarpAccount();
		$result = $mAccount->AuthenticateUserHash($this->username, $this->getPassword(), $_SERVER['SERVER_NAME'],'||'.$_SERVER['REMOTE_ADDR'],$_SESSION['LOGGING_TYPE']);
		if($result && $mAccount->EmailAddress!=rtrim($this->accountID,'_TEST')){
			$result = false;
		};
		return true;
	}
	 
	public function subscribe($aAccounts)
	{
		$imap = IMAP::instance($this);
		foreach($aAccounts as $sAccountID){
			if($imap->subscribeAccount($sAccountID)===false){
				throw new Exc('subscribe_acccount_imap',$sAccountID);
			}
		}
	}
	
	 
	public function unsubscribe($aAccounts)
	{
		$imap = IMAP::instance($this);
		foreach($aAccounts as $sAccountID){
			if($imap->unsubscribeAccount($sAccountID)===false){
				throw new Exc('unsubscribe_acccount_imap',$sAccountID);
			}
		}
	}
	
	public function subscribeFolder($folder)
	{
		$folder = str_replace("\\",'/',$folder);
		$param['name'] = $folder;
		$param['dual'] = false;
		return $this->createFolder($param);
	}
	
	public function unsubscribeFolder($folder)
	{
		$folder = str_replace("\\",'/',$folder);
		$imap = IMAP::instance($this);
		return $imap->unsubscribeFolder($folder);
		 		 		 	}
	
	public function update(slObservable &$imap)
	{
		$state = $imap->getState();
		if(is_array($state)) foreach($state as $mailbox => $mailboxState){
			if(isset($this->folders['main'][$mailbox])){
				$oFolder = &$this->folders['main'][$mailbox];
				$oFolder->updateState($mailboxState);
				 			}
		}
	}
	
	public function syncDelayedFolders()
	{
		$result = true;
		 		$delayedFolders = $this->getDelayedFolderList();
		foreach($this->folders["main"] as $oFolder){
			if(isset($delayedFolders[$oFolder->name])){
				log_buffer("IMAPAccount::syncDelayedFolders()->".$oFolder->name." SYNC DELAYED START ","EXTENDED");
				$result = $result && $oFolder->syncDelayedActions();
				log_buffer("IMAPAccount::syncDelayedFolders()->".$oFolder->name." SYNC DELAYED END ","EXTENDED");
				
			}
		}
		return $result;
	}
	
	public function syncFolders()
	{
		 		$this->aSyncedFolders = array();
		if(!$this->syncDelayedFolders()){
			log_buffer("IMAPAccount::syncDelayedFolders() RETURNED FALSE ","EXTENDED");
			
			return false;
		}

		 		foreach($this->folders["main"] as $key => $oFolder){
			if ($oFolder->sync || strtolower($oFolder->name) == 'inbox' || ($oFolder->isDefault && $oFolder->defaultType == 'D')){
				log_buffer("IMAPAccount::syncFolders()->".$oFolder->name." AUTO SYNC START ","EXTENDED");
				$oFolder->sync();
				log_buffer("IMAPAccount::syncFolders()->".$oFolder->name." AUTO SYNC END ","EXTENDED");
			}
		}
	}
	
	public function isDelayed()
	{
		if($_SESSION['DISABLE_DELAY']){
			return false;
		}else{
			return true;
		}
	}
}
?>
