<?php

class SharedAccountAccount extends CacheAccount
{
	public $folderClassName;
	public $acc_type;
	public $account;

    public function __construct(&$user,$accountID,&$primaryAccount){
		$this->folderClassName = 'SharedAccountFolder';
		parent::__construct($user, $accountID, false, false, false, false, false,'Shared');
		$this->acc_type = 'shared';
		$this->account = &$primaryAccount;
	}

	public function createFolder($param)
	{
		$name = isset($param['name'])?$param['name']:false;
		$type = isset($param['type'])?$param['type']:'S';

		 		Folder::checkName($name);
		if($type!='SL'){
			throw new Exc('folder_create',$name);
		}
		 		$folder = SharedAccountFolder::create($this, $name);
		$folder->sync();
		$this->aSyncedFolders[$folder->folderID] = true;
		$this->folders['main'][$name] = $folder;
		return $this->folders['main'][$name];
	}

	 
	public function sync($force_gw = false, $folders = array())
	{
		$shared = SharedAccounts::instance($this->account);
		if(!$folders){
			$folders = $shared->getFolders();
		}
		parent::sync($force_gw, $folders);
		return true;
	}
	public function getMyRights()
	{
		return $this->folders['main']['__@@SHARED@@__']->defaultRights;
	}
	public function getAcl($folder = false)
	{
		return false;
	}
	
	public function getFolders($refresh = true)
	{
		return $this->folders['main'];
	}
}


?>