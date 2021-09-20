<?php
class VirtualHandler
{
	private static $instance;

	public $account;
	public $docFile;
	public $virtualDoc;

	 
	public static function instance($account) 
	{
		$index = $account->accountID;
		if (!isset(self::$instance[$index])) {
			$class = __CLASS__;
			self::$instance[$index] = new $class($account);
		}

		return self::$instance[$index];
	}
	
	private function __construct($account)
	{
		$this->account = $account;
		$this->docFile = virtualfile;
	}
	
	public function loadFromXML($filename)
	{
		slSystem::import('tools/dom');
		$exist = file_exists($filename);
		try{
			$this->virtualDoc = slToolsDOM::open($filename,true);
			if($exist){
				$virtualNode = $this->virtualDoc->getNode('/virtual');
			}else{
				throw new Exc();
			}
		}catch(Exc $e){
			if($exist){
				$loaderState = libxml_disable_entity_loader(false);
				$loaderState = $loaderState?'true':'false';
				log_buffer("Virtual settings file corrupted[entity_loader:".$loaderState."]:".$filename,"EXTENDED");
				throw new Exc('virtual_file_corrupted');
			}else{
				$this->virtualDoc =  new slToolsDOM($filename);
				$virtualNode = new DOMElement('virtual');
				$this->virtualDoc->appendChild($virtualNode);
			}
		}
		return $virtualNode;
	}
	
	public function createFolder($sName,$type,$folders = false,$primaryFolder = false,$search = false,$sync = false,$sharetype = false)
	{
		
		$virtualNode = $this->loadFromXML($_SESSION['USERDIR'].SETTINGS_FOLDER . $this->docFile);
		$sName = $this->encode($sName);
	
		if($nodes = $this->virtualDoc->query("/virtual/folder[@name='".$sName."']")){
			if($nodes->length>0){
				throw new Exc('folder_already_exists',$sName);
			}
		}
		 
		$folderNode = $virtualNode->appendChild(new DOMElement('folder'));
		$folderNode->setAttribute('name', $sName );
		if($primaryFolder){
			$folderNode->setAttribute('primary', $primaryFolder );
		}
		$folderNode->setAttribute('type', $type );
		if($search){
			$folderNode->setAttribute('search', $search );
		}
		if($sync){
			$folderNode->setAttribute('sync',"true");
		}
		if($sharetype){
			$folderNode->setAttribute('sharetype',$sharetype);
		}
		if($folders){
			$contentNode = $folderNode->appendChild(new DOMElement('content'));
			foreach($folders as $folder){
				$contentFolder = $contentNode->appendChild(new DOMElement('folder'));
				$contentFolder->nodeValue = slToolsPHP::htmlspecialchars($folder);
			}
		}
		$this->virtualDoc->save();
	}

	public function editFolder($sOldName, $sName, $folders = false, $primaryFolder = false,$search = false,$sync = false, $sharetype = false)
	{
		$this->loadFromXML($_SESSION['USERDIR'].SETTINGS_FOLDER . $this->docFile);
		 		$nodes = $this->virtualDoc->query("/virtual/folder[@name='".$this->encode($sOldName)."']");
		if($nodes){
			foreach($nodes as $channelNode){
				$result = $channelNode;
			}
		}
		if(!$result){
			throw new Exc('folder_does_not_exist',$sOldName);
		}
		 		if($sName){
			Folder::checkName($sOldName);
			Folder::checkRename($sOldName,$sName);
			$sOldName = $this->encode($sOldName);
			$sName = $this->encode($sName);
			$result->setAttribute('name',$sName);
			 			$domFolders = $this->virtualDoc->query("/virtual/folder");
			if($domFolders){
				foreach($domFolders as $channelNode){
					if($sFolder = $channelNode->getAttribute('name')){
						if(strpos($sFolder,$sOldName.'/')!==false){
							$name = preg_replace("#$sOldName#",$sName,$sFolder,1);
							$channelNode->setAttribute('name',$name);
						}
					}
				}
			}
		}
		if($search!==false){
			$result->setAttribute('search',$search);
		}
		if($sync!==false){
			$result->setAttribute('sync',$sync);
		}
		if($sharetype!==false){
			$result->setAttribute('sharetype',$sharetype);
		}
		 		if(is_array($folders)){
			if($contentNode = $this->virtualDoc->getNode('content',$result)){
				$result->removeChild($contentNode);
			}
			$contentNode = $result->appendChild(new DOMElement('content'));
			foreach($folders as $folder){
				$contentFolder = $contentNode->appendChild(new DOMElement('folder'));
				$contentFolder->nodeValue = slToolsPHP::htmlspecialchars($folder);
			}
		}
		 		if($primaryFolder){
			$result->setAttribute('primary',$primaryFolder);
		}
		$this->virtualDoc->save();
	}

	public function deleteFolder($sName)
	{
		$virtualNode = $this->loadFromXML($_SESSION['USERDIR'].SETTINGS_FOLDER . $this->docFile);
		$sName=$this->encode($sName);
		     
		$oDOMFolders = $this->virtualDoc->query("/virtual/folder");
		if($oDOMFolders){
			foreach($oDOMFolders as $channelNode){
				$sFolderName = $channelNode->getAttribute("name");
				if(strpos($sFolderName,$sName.'/')!==false || $sFolderName == $sName){
					$channelNode->parentNode->removeChild($channelNode);
					$result = true;
				}
			}
		}
		$this->virtualDoc->save();
		return $result;
	}
	public function getFolders($refresh = true)
	{
        $aFolders = [];
		$restrictedFolders = array('SPAM_QUEUE/Blacklist','SPAM_QUEUE/Whitelist','Quarantine');
		$this->loadFromXML($_SESSION['USERDIR'].SETTINGS_FOLDER . $this->docFile);
		$oUser = &$_SESSION['user'];
		if (!is_object($this->virtualDoc)) {
			return array();
		}
		$deleteFolders = array();
		$query = $this->virtualDoc->query('/virtual/folder');
		if($query){
			foreach ($query as $folderNode){
				$deleteFolder = false;
				$folder = new stdClass();
				$folder->name = self::decode($folderNode->getAttribute('name'));
				$folder->type = $folderNode->getAttribute('type');
				$folder->primary = $folderNode->getAttribute('primary');
				$folder->search = $folderNode->getAttribute('search');
				$folder->sync = $folderNode->getAttribute('sync')?true:false;
				$folder->sharetype = $folderNode->getAttribute('sharetype');
				$folders = $this->virtualDoc->query('content/folder',$folderNode);
				if(!empty($folders)){
					$folder->folders = array();
					foreach($folders as $contentFolder){
						if(in_array($contentFolder->nodeValue,$restrictedFolders)){
							$deleteFolder = true;
							$deleteFolders[$folder->name] = $folder->name;
						}
						$folder->folders[] = $contentFolder->nodeValue;
					}
				}
				$folder->rights = Folder::DEFAULT_RIGHTS;
				if(!$deleteFolder){
					$aFolders[] = $folder;
				}
			}
		}
		if (!empty($deleteFolders)) foreach($deleteFolders as $folder){
			$this->deleteFolder($folder);
		}
		return $aFolders;
	}
	
	public function getAcl()
	{
		
	}
	
	public function setAcl()
	{
		
	}
	
	public function getMyRights()
	{
		
	}
	
	public function encode($name){
		return  str_ireplace('__@@VIRTUAL@@__/','',$name);
	}
	
	public static function decode($name)
	{
		if(strpos($name,'__@@VIRTUAL@@__/')===false){
			$name = '__@@VIRTUAL@@__/'.$name;
		}
		return $name;
	}
	
}
?>