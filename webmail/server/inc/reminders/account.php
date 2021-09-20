<?php

class RemindersAccount extends Account
{
	public $folderClassName;
	public $acc_type;
	public $aSyncedFolders;

    public function __construct(&$user,$accountID,&$primaryAccount)
	{
		$this->folderClassName = 'RemindersFolder';
		$this->user = &$user;
		$this->accountID = $accountID;
		$this->acc_type = 'reminders';
		$this->account = &$primaryAccount;
		 		$folder = new RemindersFolder($primaryAccount, '__@@REMINDERS@@__', '__@@REMINDERS@@__');
		$this->aSyncedFolders['__@@REMINDERS@@__'] = true;
		$this->folders['main']['__@@REMINDERS@@__'] = $folder;
	}

	public function createFolder($param)
	{
		return;
	}

	 
	public function sync($force_gw = false, $folders = array())
	{
	}
	
	public function getMyRights()
	{
		return $this->folders['main']['__@@REMINDERS@@__']->defaultRights;
	}
	public function getAcl($folder = false)
	{
		return false;
	}
	public function getFolders($refresh = false)
	{
		return $this->folders['main'];
	}
}


?>