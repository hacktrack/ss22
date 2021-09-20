<?php
 
class CacheAccount extends Account
{
	 	public $user;
	 	public $accountID;
	public $protocol;
	public $primary;
	public $folderClassName;

	 
	protected function __construct($user, $accountID, $server, $port, $username, $password, $primary, $protocol = 'IMAP', $properties = false)
	{
		 
		parent::__construct($server, $port, $username, $password, $properties);
		
		$this->user	  = $user;
		$this->accountID = $accountID;
		$this->primary = $primary;
		$this->protocol = strtoupper($protocol);
		
		$this->loadFolders($this->folderClassName);
	}
	 
	protected function loadFolders($class = 'IMAPFolder')
	{
		if(Folder::isRestrictedType('M') && ($class=='IMAPFolder' || $class=='LocalPOPFolder')){
			return true;
		}
		$cache = Cache::instance($this->user);
		$this->folders['main'] = $cache->getFolders($this, $class);
		if ($class=='LocalPOPFolder'){
			foreach($this->folders['main'] as $fdrID => $folder){
				if ($fdrID!=$folder->name){
					unset($this->folders['main'][$fdrID]);
					$this->folders['main'][$folder->folderID] = $folder;
				}
			}
		}
	}
	 
	protected function createFolder($param)
	{
		parent::createFolder($param);
	}
 
	public function sync($force_gw = false, $folders = array())
	{
		User::syncDefaultFolders();
		$cache = Cache::instance($this->user);
		$cache->transaction();
		 		$foldersID = $cache->getFoldersID($this->accountID);
		$backup = $foldersID;
		 
		
		@ksort($folders);
		 		$currentFolders = $this->folders['main'];

		if(is_array($folders) && !empty($folders)) foreach ($folders as $folder) {
			if(!$folder->delimiter){
				$folder->delimiter = '/';
			}
			if (isset($foldersID[$folder->name])) {
				$folderID = &$foldersID[$folder->name];
				$changes = array();
				if (isset($folder->rights) && $folder->rights && ($folder->rights != $folderID['rights'])){
					$changes['rights'] = $folder->rights;
				}
				if($folder->attributes && ($folder->attributes != $folderID['attributes'])) {
					$changes['attributes'] = $folder->attributes;
				}
				if(($folder->attributes & Folder::RIGHT_SUBSCRIBED) && !$folderID['subscription_type']) {
					$changes['subscription_type'] = 1;
				}
				if(!($folder->attributes & Folder::RIGHT_SUBSCRIBED) && $folderID['subscription_type']){
					$changes['subscription_type'] = 0;
				}				
				$parentFolderName = preg_replace(
					'/'.preg_quote($folder->delimiter, '/').'[^'.preg_quote($folder->delimiter, '/').']*$/',
					'',
					$folder->name
				);

				
				if($parentFolderName!=$folder->name){
					if (isset($backup[$parentFolderName])) {
						$parentFolderID = $backup[$parentFolderName]['folder_id'];
					} else {
						$parentFolderID = null;
					}
					if($parentFolderID && $parentFolderID!=$backup[$folder->name]['parent_folder_id']){
						$changes['parent_folder_id'] = $parentFolderID;
					}
				}
				
				if($changes){
					$cache->updateFolder(
							$folderID['folder_id'],
							$changes
					);
				}
				$folderID = $folderID['folder_id'];
				unset($foldersID[$folder->name]);
				unset($currentFolders[$folder->name]);
			} else {
				 				
				$parentFolderName = preg_replace(
					'/'.preg_quote($folder->delimiter, '/').'[^'.preg_quote($folder->delimiter, '/').']*$/',
					'',
					$folder->name
				);
				if (isset($backup[$parentFolderName])) {
					$parentFolderID = $backup[$parentFolderName]['folder_id'];
				} else {
					$parentFolderID = null;
				}
				$create = array(
						'account_id' => $this->accountID,
						'name' => $folder->name,
						'rights' => $folder->rights?$folder->rights:0,
						'attributes'=>$folder->attributes?$folder->attributes:0 
				);	
				if($parentFolderID){
					$create['parent_folder_id'] = $parentFolderID;
				}
				$folderID = $cache->createFolder($create);
			}
			if(!isset($this->folders['main'][$folder->name])){
				try{
					$class = $this->folderClassName;
					if(!$class){
						throw new Exc('folder_class_name_undefined');
					}
					$this->folders['main'][$folder->name] = new $class(
							$this, 
							$folderID, 
							$folder->name, 
							$folder->rights?$folder->rights:0, 
							false, 
							$folder->attributes?$folder->attributes:0
					);
				}catch(Exc $e){
				
				}
			}else{
				$this->folders['main'][$folder->name]->rights = $folder->rights ?? null;
				$this->folders['main'][$folder->name]->attributes = $folder->attributes;
				$this->folders['main'][$folder->name]->subscription_type = ($folder->attributes & Folder::RIGHT_SUBSCRIBED)?true:false;
			}
		}
		 		 		foreach ($foldersID as $folderName => $folderID) {
			$folderID = $folderID['folder_id'];
			try{
				$cache->deleteFolder($this->accountID, $folderID);
				unset($this->folders['main'][$folderName]);
			}catch(Exc $e){
				
			}
			 		}
		if(is_array($currentFolders) && !empty($currentFolders)){
		foreach($currentFolders as $folderName => $folder)
			unset($this->folders['main'][$folderName]);
		}
		$cache->commit();
		 		if($this->primary){
			log_buffer("CacheAccount::sync() line 178 User::syncDefaultFoldersStorage()","EXTENDED");
			$this->user->syncDefaultFoldersStorage();
		}
	}
	
	public function cleanUpCache()
	{
		$cache = Cache::instance($this->user);
		foreach($this->folders["main"] as $sFolderID => $oFolder) {
			$cache->deleteFolder($this->accountID,$oFolder->folderID);
		}
	}
		
	public function getDelayedFolderList()
	{
		$cache = Cache::instance($_SESSION['user']);
		$stmt = $cache->prepare('SELECT folder.name as name FROM item INNER JOIN folder on folder.folder_id = item.folder_id WHERE item.flag_update > 0 AND folder.account_id = :account_id GROUP BY folder.name');
		$stmt->execute(array(':account_id'=>$this->accountID));
		$result = array();
		while ($row = $stmt->fetch()) {
			$result[$row['name']] = $row['name'];
		}
		return $result;
	}
	
	public function getFolderById($id,$className = false)
	{
		$cache = Cache::instance($_SESSION['user']);
		return $cache->getFolderById($this,$className?$className:$this->folderClassName,$id);
	}
}

 

?>
