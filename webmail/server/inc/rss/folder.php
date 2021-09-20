<?php

class RSSFolder extends CacheFolder
{
	public $itemClassName;
	public $type;
	public $channelName;
	public $channel;

	public function __construct(&$account, $folderID, $name,$rights = Folder::DEFAULT_RIGHTS, $sync = false,$attributes = 0)
	{
		parent::__construct(
			$account, 
			$folderID, 
			$name, 
			$rights, 
			$sync, 
			$attributes
		);
		$this->itemClassName = 'RSSItem';
		$this->type = 'R';
		$this->channel = $this->getChannelURL($name,$this->channelName);
	}
	
	 
	public static function create(&$account, $name, $param = '', $createDual = true)
	{
		$channel = $param;
		 		$rss = RSS::instance($account);
		$rss->createFolder($name, $account->accountID, $channel);
		 		$folderID = parent::create($account, $name, Folder::DEFAULT_RIGHTS);
		return new RSSFolder($account, $folderID, $name);
	}
	
	 
	public function getChannelURL($name,&$sChannelName)
	{
		 		$rss = RSS::instance($this->account);
		return $rss->getChannelURL($name,$sChannelName);
	}

	public function markItems($flag, $oItems = false)
	{
		parent::markItems($flag, $oItems);
	}
	
	public function unmarkItems($flag, $oItems = false)
	{
		parent::unmarkItems($flag, $oItems);
	}
	 	public function edit($parameters)
	{
		$sName = $parameters['name']?$parameters['name']:false;
		$sChannel = $parameters['channel']?$parameters['channel']:false;
		$sSubscribed = $parameters['subscription']?$parameters['subscription']:false;
		$account = &$this->account;
		$rss = RSS::instance($account);
		if($sChannel && $this->channel!=$sChannel){
			$bChangeChannel = true;
			parent::deleteItems();
			$this->account->aSyncedFolders[$this->folderID] = false;
		}
		$rss->editFolder($this->name,$sName,$sChannel,$bChangeChannel);
		if($sName){
			$this->name = $sName;
		}
		if($sChannel){
			$this->channel = $sChannel;
		}
		$this->account->aSyncedFolders[$this->name] = $sSubscribed;
		if(!$sName){
			$sName = $this->name;  
		}
		
		parent::rename($sName);
		return true;
	}

	public function delete($subfolders = 0)
	{
		$account = &$this->account;
		$rss = RSS::instance($account);
		$rss->deleteFolder($this->name);
		parent::delete();
		unset($_SESSION['user']->aAccounts[$account->accountID]->folders["main"][$this->name]);
		 		if(count($account->folders['main'])==0){
			slSystem::import('tools/icewarp');
			@slToolsIcewarp::iw_delete($_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile);
			unset($_SESSION['user']->aAccounts[$account->accountID]);
		}
		return true;
	}

	public function deleteItems($oItems = false, $delayed = false)
	{
		if(!$oItems){
			$oItems = $this->getItems(); 
		}
		foreach($oItems as $oItem){
			$oItem->delete();
		}
		return true;
	}
	

	 
	public function sync()
	{
		if($this->channel){
			$account = $this->account;
			 			$rss = RSS::instance($account);
			$aItemsID = $rss->getItemsID($this);
			 			parent::syncItems($this->itemClassName,$aItemsID,$this);
		}
	}

	public function setNotify($bValue){}

	public function setChannels($mailbox, $channels, $encoded = false){}
}

?>
