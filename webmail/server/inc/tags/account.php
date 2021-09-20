<?php

class TagsAccount extends Account
{
	public $folderClassName;
	public $acc_type;
	public $aSyncedFolders;

    public function __construct(&$user,$accountID,&$primaryAccount)
	{
		$this->folderClassName = 'TagsFolder';
		$this->acc_type = 'tags';
		$this->account = &$primaryAccount;
		 		$folder = new TagsFolder($primaryAccount, '__@@TAGS@@__');
		$this->aSyncedFolders['__@@TAGS@@__'] = true;
		$this->folders['main']['__@@TAGS@@__'] = $folder;
	}

	public function createFolder($param)
	{
		return;
	}
	
	public function getFolders($refresh = false)
	{
		return $this->folders['main'];
	}
	 
	public function sync($force_gw = false, $folders = array())
	{
		return true;
	}
	public function getMyRights()
	{
		return $this->folders['main']['__@@TAGS@@__']->defaultRights;
	}
	public function getAcl($folder = false)
	{
		return false;
	}
}


?>