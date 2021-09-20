<?php

class HipaaAccount extends Account
{
	public $folderClassName;
	public $acc_type;
	public $aSyncedFolders;

    public function __construct(&$user,$accountID,&$primaryAccount)
	{
		$this->folderClassName = 'HipaaFolder';
		$this->user = &$user;
		$this->accountID = $accountID;
		$this->acc_type = 'icewarp';
		$this->account = &$primaryAccount;
		 		$folder = new HipaaFolder($this, '__@@HIPAA@@__', '__@@HIPAA@@__');
		$this->aSyncedFolders['__@@HIPAA@@__'] = true;
		$this->folders['icewarp']['__@@HIPAA@@__'] = $folder;
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
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_MODIFY;
		$rights |= Folder::RIGHT_DELETE;
		$rights |= Folder::RIGHT_FOLDER_READ;
		return $rights;
	}
	public function getAcl($folder = false)
	{
		return false;
	}
}


?>