<?php

class RSSAccount extends CacheAccount
{
	public $folderClassName;
	public $acc_type;

	public function __construct(&$user,$accountID){
		$this->folderClassName = 'RSSFolder';
		parent::__construct($user, $accountID, false, false, false, false, false,'RSS');
		$this->acc_type = 'rss';
	}

	public function createFolder($param)
	{
		$name = isset($param['name'])?$param['name']:false;
		$type = isset($param['type'])?$param['type']:'';
		$channel = isset($param['channel_url'])?$param['channel_url']:'';
		 		Folder::checkName($name);
		if($type!='R'){
			throw new Exc('folder_create',$name);
		}
		 		$folder = RSSFolder::create($this, $name, $channel);
		if($folder->channel){
			$folder->sync();
			$this->aSyncedFolders[$folder->folderID] = true;
		}
		$this->folders['main'][$name] = $folder;
	}

	 
	public function sync($force_gw = false, $folders = array())
	{
		$rss = RSS::instance($this);
		$folders = $rss->getChannels($this->accountID);
		parent::sync($force_gw, $folders);
		return true;
	}
	
	public function convertToIMAP(&$primaryAccount)
	{
		$rss = RSS::instance($this);
		$folders = $rss->getChannels($this->accountID);
		 		try{
			$primaryAccount->createFolder(array('name'=>'RSS','type'=>'M'));
		}catch(Exception $e){
			
		}
		if(is_array($folders) && !empty($folders)){
			foreach( $folders as $folder ){
				$param = array();
				$param['type'] = 'M';
				$param['name'] = 'RSS/'.$folder->name;
				$param['channels'][] = $folder->channel;
				try{
					$primaryAccount->createFolder($param);
				}catch(Exception $e){
					$param = array();
					$name = 'RSS/'.$folder->name;
					$param['channels'][] = $folder->channel;
					try{
						$fdr = $primaryAccount->getFolder($name);
						$fdr->edit($param);
					}catch(Exception $e){
						
					}
				}
			}
		}
		$rss->clear();
	}
}


?>
