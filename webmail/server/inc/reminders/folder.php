<?php

class RemindersFolder extends Folder
{
	public $defaultRights;
	public $folderID;
	public $itemClassName;
	public $type;
	public $account;
	public $count;
	public $folders;

    public function __construct(&$account,$folderID, $name)
	{
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_FOLDER_READ;
		$this->defaultRights = $rights;
		$this->rights = $rights;
		$this->account = &$account;
		$this->folderID = $folderID;
		$this->name = $name;
		$this->itemClassName = 'RemindersItem';
		$this->type = 'D';
	}
	public static function create(&$account, $name, $param ='', $createDual = true)
	{
		return;
	}
	 
	public function getItem($itemID, $cache = array())
	{
		$reminders = Reminders::instance($this->account);
		$item = $reminders->getItem($itemID);
		return $item;
	}
	
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		$reminders = Reminders::instance($this->account);
		$items = $reminders->getItems($this,$aFilterTag);
		$this->count = count($items);
		return $items;
	}
	
	public function countItems($flags = 0, $positive = true, $filter = "", $search = false)
	{
		if($flags & 32){
			return 0;
		}
		return $this->count;
	}



	public function edit($parameters)
	{
		throw new Exc('not_supported');
	}

	public function delete()
	{
		throw new Exc('not_supported');
	}

	public function deleteItems($oItems = false)
	{
		throw new Exc('not_supported');
	}
	
	public function copyItems(&$oFolder,$oItems = false)
	{
		throw new Exc('not_supported');
	}
	
	public function moveItems(&$oFolder,$oItems = false)
	{
		throw new Exc('not_supported');
	}
	

	 
	public function sync()
	{
	}
	
	public function getMyRights()
	{
		return $this->folders['main']['__@@REMINDERS@@__']->defaultRights;
	}
	public function getAcl()
	{
		return array($_SESSION['EMAIL']=>$this->folders['main']['__@@REMINDERS@@__']->defaultRights);
	}
	
	public function rename($param)
	{
		throw new Exc('not_supported');
	}


    public function setDefault($type, $updateSettings = true){}

    public function setSubscription($state){}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}
}

?>