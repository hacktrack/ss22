<?php

class VirtualAccount extends Account
{
	public $folderClassName;
	public $acc_type;
	public $acl;
	public $gwAPI;
	public $account;

    public function __construct(&$user, $accountID, &$account)
	{
		$this->folderClassName = 'VirtualFolder';
		$this->acc_type = 'virtual';
		$this->account = &$account;
		$this->folders = &$this->account->folders['virtual'];
		$this->gwAPI = &$account->gwAccount->gwAPI;
	}
	
	public function createFolder($param)
	{
		if($_SESSION['DISABLE_VIRTUAL'] && $param['name']!='__@@VIRTUAL@@__/__@@EVENTS@@__'){
			throw new Exc('disable_virtual');
		}
		$name = isset($param['name'])?$param['name']:false;
		$type = isset($param['virtual']['type'])?$param['virtual']['type']:'';
		$sharetype = isset($param['virtual']['sharetype'])?$param['virtual']['sharetype']:false;
		$folders = isset($param['virtual']['folders'])?$param['virtual']['folders']:array();
		$primaryFolder = isset($param['virtual']['primary'])?$param['virtual']['primary']:reset(array_keys($folders));
		$search = isset($param['virtual']['search'])?$param['virtual']['search']:false;
		if(isset($this->folders[$name])){
			throw new Exc('folder_already_exists');
		}

		 		Folder::checkName($name);
		if(!$type){
			throw new Exc('folder_create','Missing type for:'.$name);
		}
		 		$folder = VirtualFolder::create($this, $name, $type,false, $folders, $primaryFolder, $search,false, $sharetype);
		$this->folders[$name] = $folder;
		return $folder;
	}
	
	public function getFolders($refresh = true)
	{
		$virtual = VirtualHandler::instance($this->account);
		$folders = $virtual->getFolders($refresh);
        $result = [];
		if($folders){
			foreach($folders as $folder){
				 				if(Folder::isRestrictedType($folder->type)){
					continue;
				}
				 				if($_SESSION['DISABLE_VIRTUAL'] && $folder->name!='__@@VIRTUAL@@__/__@@EVENTS@@__'){
					continue;
				}
				 				if(!$this->account->gwAccount->bLogged && isset(User::$gwFolders[$folder->type])){
					continue;
				}
				$fdr = new VirtualFolder(
					$this,
					$folder->name,
					$folder->type,
					$folder->folders,
					$folder->primary,
					$folder->search,
					$folder->sync,
					false,
					$folder->sharetype
				);
				$result[$folder->name] = $fdr;
			}
		}
		return $result;
	}
	public function &getFolder($name, &$type = '', $logError = true, $allowDualHiddenFolder = false)
	{
		if(isset($_SESSION['DISABLE_VIRTUAL']) && $_SESSION['DISABLE_VIRTUAL'] && $name!='__@@VIRTUAL@@__/__@@EVENTS@@__'){
			throw new Exc('disable_virtual');
		}
		if(!isset($this->folders[$name]) || !is_array($this->folders)){
			$this->folders = $this->getFolders();
		}
		if(!isset($this->folders[$name])){
			 			if(is_array($this->folders)){
				foreach($this->folders as $virtualName => $virtualFolder){
					if(!$virtualFolder->isEmpty()){
						foreach($virtualFolder->folders as $realName => $realFolder){
							if($realName == $name){
								return $realFolder;
							}
						}
					}
				}
			}
			if($folder = $this->account->getFolder($name)){
				return $folder;
			}
			throw new Exc('folder_invalid_id',$name,false,$logError);
		}
		if(Folder::isRestrictedType($this->folders[$name]->contentType)){
			throw new Exc('folder_type_restricted',$this->folders[$name]->contentType);
		}
		return $this->folders[$name];
	}
	public function getMyRights($folder)
	{
		return $this->folders[$folder]->getMyRights();
	}

	public function deleteFolder($folderID)
	{
		 		$virtual = VirtualHandler::instance($this->account);
		return $virtual->deleteFolder($folderID);
	}

	public function setAcl($acl,$folder = '',$bSetDual = true)
	{
		return array($this->account->accountID=>Folder::DEFAULT_RIGHTS);
	}
	public function getAcl($folder = '')
	{
		$fdr = $this->getFolder($folder);
		return $this->acl = $fdr->getAcl();
	}
	
	public function inheritAcl($sName,$bInheritDual = true)
	{
		$acl = $this->getAcl($sName);
		if($acl) foreach($acl as $email=>$right){
			if($email!='anyone'){
				$this->gwAPI->removeAcl($sName,$email);
			}
		}
		$this->gwAPI->removeAcl($sName,'anyone');
		$acl = $this->getAcl($sName);
		 		if($bInheritDual && $this->account){
			$this->account->inheritAcl($sName,false);
		}
		return $acl;
	}

	public function sync($force_gw = false, $folders = array())
	{
        $result = [];
		$this->account->folders['virtual'] = $this->getFolders();
		if(is_array($this->account->folders['virtual'])){
			foreach($this->account->folders['virtual'] as $key=> $folder){
				if($_SESSION['DISABLE_VIRTUAL'] && $folder->name!=='__@@VIRTUAL@@__/__@@EVENTS@@__'){
					continue;
				}
				$folder->rights = $folder->getMyRights();
				if($folder->sync){
					$aToSyncFolders = $folder->sync();
					if(is_array($aToSyncFolders) && !empty($aToSyncFolders)){
						foreach($aToSyncFolders as $type=> $fdrs){
							foreach($fdrs as $fdr_id => $fdr){
								$result[$type][$fdr_id] = $fdr;
							}
						}
					}
				}
			}
            foreach($result as $type=> $fdrs){
                foreach($fdrs as $fdr_id => $fdr){
                    try{
                        if(get_class($fdr)=='IMAPFolder'){
                            if(!$fdr->syncDelayedActions()){
                                return false;
                            }
                        }
                        $fdr->sync();
                    }catch(Exc $e){}
                }
            }
		}
		return true;
	}
}


?>