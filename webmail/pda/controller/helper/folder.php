<?php
require_once ('inc/user.php');
require_once ('inc/webmailiqfolders.php');
slSystem::import('tools/php');
define('personalfoldersfile','folders.xml');

function fdrCompare($a,$b)
{
	return strcasecmp($a['localizedName'],$b['localizedName']);
}

 function fdrSort($a,$b){
	if($a['id']=='#/INBOX'){
		return -1;
	}
	if($b['id']=='#/INBOX'){
		return 1;
	}
	return strcasecmp($a['id'],$b['id']);
}
 function fdrSort2($a,$b){
	if($a=='INBOX'){
		return -1;
	}
	if($b=='INBOX'){
		return 1;
	}
	return strcasecmp($a['id'],$b['id']);
}
		
class slHelperFolder extends slHelper{
	
	public function check()
	{
		$language = slLanguage::instance();
		$this->mappedFolders['drafts'] = $this->getMappedFolderName( 'drafts', true );
		$this->mappedFolders['trash'] = $this->getMappedFolderName( 'trash', true );
		$this->mappedFolders['sent'] = $this->getMappedFolderName( 'sent', true );
	}
	
	public function get($param = false,$rType = R_ARRAY)
	{
		
	}
	
	public function getList($sDataID,$refresh = false)
	{
		$oUser = &$_SESSION['user'];
		 		$oAccount = $oUser->getAccount($_SESSION['EMAIL']);
		if($refresh){
			if($oAccount->isDelayed()){
				$delayedResult = $oAccount->syncDelayedFolders();
			}else{
				$delayedResult = true;
			}
			if($delayedResult){
				$oAccount->sync();
			}
		}
		$list = $oAccount->getFolders();
		 		$result = array();
		 		$root['id'] = '#';
		$root['name'] = $oAccount->description?$oAccount->description:($oAccount->fullname?$oAccount->fullname:$oAccount->accountID);
		 		$root['name'] = '<b>'.$root['name'].'</b>';
		$root['ico'] = 'ico_accounts.gif';
		$result[$root['id']] = $root;
		 		$spamqueue['id'] = $root['id'].'/SPAM_QUEUE';
		 		$spamqueue['name'] = 'Filters';
		$spamqueue['ico'] = 'folder_spam_queues.gif';
		$result[$spamqueue['id']] = $spamqueue;
		foreach($list as $id =>$folder){
			$oldID = $id;
			 			$id = $root['id'].'/'.$id;
			$result[$id] = $this->getInfo($folder->type,$oldID);
			 			foreach($folder as $prop=>$val){
				if(!is_object($val) && !is_array($val)){
					$result[$id][$prop] = $val;
				}
			}
			 			$result[$id]['folder'] = $oldID;
			 			$result[$id]['id'] = $id;
			 			$result[$id]['name'] = $folder->name;
			if(($pos = strrpos($folder->name,'/'))!==false){
				$result[$id]['name'] = substr($folder->name,$pos+1);
			}
			 			if($folder->type=='M'){
				$result[$id]['recent'] = $folder->countItems(Item::FLAG_SEEN, false);
			}
			$result[$id]['name'].= '('.
				($result[$id]['recent']?' <b>'.$result[$id]['recent'].'</b> / ':'').				$folder->countItems().	 				')';
			
		}

		uasort($result,'fdrSort');
		slSystem::import('tools/debug');
		slToolsDebug::message('<h1>DEBUG - Folders:</h1>');
		slToolsDebug::print_r($result);
		return $result;
	}
	

	public function getInfo($type,$id)
	{
		switch($type){
			case 'M':
				 				if(
					($id == $this->mappedFolders['drafts'])
				||	($this->mappedFolders['drafts'] == false && strtolower($id)=='drafts')
				){
					$info['subtype'] = 'drafts';
					$info['ico'] = 'folder_inbox.gif';
					$info['page'] = 'grid.mail.drafts';
				}else if(
					($id == $this->mappedFolders['trash'])
				||	($this->mappedFolders['trash'] == false && strtolower($id)=='trash')
				){
					$info['subtype'] = 'trash';
					$info['ico'] = 'folder_trash.gif';
					$info['page'] = 'grid.mail';
				}else if(
					($id == $this->mappedFolders['sent'])
				||	($this->mappedFolders['sent'] == false && strtolower($id)=='sent')
				){
					$info['subtype'] = 'sent';
					$info['ico'] = 'folder_sent.gif';
					$info['page'] = 'grid.mail';
				}else if(
					($id == $this->mappedFolders['spam'])
				||	($this->mappedFolders['spam'] == false && strtolower($id)=='spam')
				){
					$info['subtype'] = 'spam';
					$info['ico'] = 'folder_spam.gif';
					$info['page'] = 'grid.mail';
				}else if(strtolower($id)=='inbox'){
					$info['subtype'] = 'inbox';
					$info['ico'] = 'folder_inbox.gif';
					$info['page'] = 'grid.mail';
				}else{
					$info['subtype'] = 'common';
					$info['ico'] = 'folder_normal.gif';
					$info['page'] = 'grid.mail';
				}
			break;
			case 'C':
				$info['ico'] = 'folder_contacts.gif';
				$info['page'] = 'grid.contact';
				break;
			case 'E':
				$info['ico'] = 'folder_events.gif';
				$info['page'] = 'grid.event';
				$ico = 'folder_events.gif';
				break;
			case 'T':
				$info['ico'] = 'folder_tasks.gif';
				$info['page'] = 'grid.event';
				$ico = 'folder_task.gif';
				break;
			case 'J':
				$info['ico'] = 'folder_journal.gif';
				$info['page'] = 'grid.event';
				$ico = 'folder_journal.gif';
				break;
			case 'N':
				$info['ico'] = 'folder_notes.gif';
				$info['page'] = 'grid.event';
				$ico = 'folder_notes.gif';
				break;
			case 'F':
				$info['ico'] = 'folder_files.gif';
				$info['page'] = 'grid.file';
				$ico = 'folder_files.gif';
				break;
			case 'Q':
				$info['ico'] = 'folder_spam_quarantine.gif';
				$info['page'] = 'grid.quarantine';
				$ico = 'folder_spam_quarantine.gif';
				break;
			case 'QL':
				switch(strtolower($id)){
					 					case 'spam_queue/blacklist':
						$info['ico'] = 'folder_spam_black.gif';
						$info['page'] = 'grid.blacklist';
					break;
					case 'spam_queue/whitelist':
						$info['ico'] = 'folder_spam_white.gif';
						$info['page'] = 'grid.whitelist';
					break;
				}
				break;
			default:
				$info['ico'] = 'folder_normal.gif';
				$info['page'] = 'grid.mail';
				$ico = 'folder_normal.gif';
			break;
		}
		return $info;
	}
	
	 	 	 	public function getTagByType($type)
	{
		$trans = array(
			'M'=>'mail',
			'E'=>'events',
			'C'=>'contacts',
			'T'=>'tasks',
			'N'=>'notes',
			'J'=>'journal',
			'F'=>'files'
		);
		return $trans[$type];
	}
	
	public function addPersonalFolder(&$folders,$uid,$label = false)
	{
		if(!$label){
			$label = basename($uid);
		}
		$folders[$uid]['label'] = $label;
	}
	
	public function deletePersonalFolder(&$folders,$uid)
	{
		unset($folders[$uid]);
	}
	
	public function setPersonalFolders(&$folders,$type)
	{
		slSystem::import('tools/xml');
		slSystem::import('tools/xml');
		$user = $_SESSION['user'];
		$userdir = User::getDir();
		$file = $userdir.personalfoldersfile;
		$xml = slToolsXML::loadFile($file);
		if($xml && $xml->folders){
			$tagName = $this->getTagByType($type);
			if($xml->folders->$tagName){
				unset($xml->folders->$tagName);
				$xml->folders->$tagName = new SimpleXMLElement('<'.$tagName.'></'.$tagName.'>');
				foreach($folders as $folder => $fdr){
					
					$elm = $xml->folders->$tagName->addChild('folder',$folder);
					$elm->addAttribute('label',$fdr['label']);
				}
			}
		}
		return $xml->asXML($file);
	}
	
	public function getPersonalFolders($type)
	{
		slSystem::import('tools/xml');
		$nonExistingFolders = array();
		$user = $_SESSION['user'];
		$account = $user->getAccount($_SESSION['EMAIL']);
		$userdir = User::getDir();
		$file = $userdir.personalfoldersfile;
		if(!is_dir($userdir)){
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($userdir,0777,true);
		}
		if(!is_file($file)){
			slSystem::import('tools/icewarp');
			slToolsIcewarp::iw_file_put_contents($file,'<personal><folders><mail></mail></folders></personal>');
		}
		$xml = slToolsXML::loadFile($file);
		if( $xml && $xml->folders ){
			$tagName = $this->getTagByType($type);
			if($xml->folders->$tagName){
				foreach($xml->folders->$tagName->folder as $tag => $value){
					$val = strval($value);
					if($val!=='inbox'){
						try{
							$fdr = $account->getFolder($val);
							$folders[$val] = $this->getInfo($type,$val);
							$folders[$val]['label'] = strval($value["label"]);
						}catch(Exception $e){
							$nonExistingFolders[] = $val;
						}
					}
				}
			}
		}
		if(!empty($nonExistingFolders)){
			$this->setPersonalFolders( $folders, $type );
		}
		$oLanguage = slLanguage::instance();
		$label = $oLanguage->get('common_folders','inbox');
		
		if($folders){
			uasort($folders,'fdrSort2');
		}else{
			$folders = array();
		}
		$fdr = $account->getFolder('INBOX');
		$inboxUnread = $fdr->countItems(Item::FLAG_SEEN, false);
		$folders = array(
			'INBOX'=>array(
				'label'=>$label,
				'ico'=>'folder_inbox.gif',
				'subtype'=>'inbox',
				'page'=>'grid.mail',
				'id'=>'INBOX',
				'unread'=>$inboxUnread
			)
		) + $folders;
		print_r($folders);die();
		return $folders;
	}
	
	public function localizeFolder($sName)
	{
		$oLanguage = slLanguage::instance();
		if(strtolower($sName)=='inbox'){
			$sIndex = $sName;
			$aIndex = explode('/',$sIndex,2);
			if (is_array($aIndex)) {
				$sIndex = strtolower($aIndex[0]);
			} else {
				$sIndex = strtolower($sIndex);
			}
			if($oLanguage->get('common_folders',$sIndex)) {
				$sName = $oLanguage->get('common_folders',$sIndex);
				if ($aIndex[1]) {
					$sName.='/'.$aIndex[1];
				}
			}
			if(strpos($sName,'__@@VIRTUAL@@__/')===0){
				$sName = str_replace('__@@VIRTUAL@@__/','',$sName);
			}
		}
		if(strtolower($sName)=='contacts' || strtolower($sName)=='__@@addressbook@@__'){
			return $oLanguage->get('form_buttons','address_book');
		}
		return $sName;
	}
	
	public function getMappedFolderName($sType,$stripAccount = false)
	{
		 
		$fdrs = slToolsPHP::array_merge(User::$gwFolders,User::$mailFolders);
		$fdrs = array_flip($fdrs);
		$folder = User::getDefaultFolder($fdrs[$sType]);
		$folder = $stripAccount?$folder:$_SESSION['EMAIL'].'/'.$folder;
		$folder = $folder?$folder:false;
		return $folder;
	}

	public function getMappedFolder($sType,$autoCreate = false)
	{
		$oUser = &$_SESSION['user'];
		$sDefaultFolder = $this->getMappedFolderName( $sType );
		if($sDefaultFolder){
			$aDefaultFolderInfo = explode('/',$sDefaultFolder,2);
			$sAccount = $aDefaultFolderInfo[0];
			$oAccount = $oUser->getAccount($sAccount);
			$sFolder = $aDefaultFolderInfo[1];
			if($sType =='contacts'){
				$sFolder = '__@@ADDRESSBOOK@@__';
				$ftype = 'gw';
			}else{
				$ftpye = 'main';
			}
			if($autoCreate){
				$oFolder = $oAccount->getFolderWithAutoCreate($sFolder,$ftype);
			}else{
				try{
					$oFolder = $oAccount->getFolder($sFolder,$ftype);
					return $oFolder;
				}catch(Exc $e){
					return false;
				}
			}
		}else{
			 			$sAccount = $_SESSION['EMAIL'];
			$oAccount = $oUser->getAccount($sAccount);
			$language = slLanguage::instance();
			$sFolder = strtolower($sType);
			$sFolder = $language->get('common_folders',strtolower($sType));
			try{
				$oFolder = $oAccount->getFolder($sFolder);
			}catch(Exception $e){
				if($autoCreate){
					$oFolder = $oAccount->getFolderWithAutoCreate($sFolder);
				}else{
					return false;
				}
			}
		}
		return $oFolder;
	}
	
	public function getSimpleList()
	{
		 		$aMapped = array('drafts','trash','sent');
		$request = slRequest::instance();
		$selected = $request->get('all._s.id');
		if(!$selected){
			$selected = 'INBOX';
		}
		$oAccount = $_SESSION['user']->getAccount( $_SESSION['EMAIL'] );
		 		try {
			$oInbox = $oAccount->getFolder('INBOX');
		}catch (Exception $e){
			$oAccount->sync();
			$oAccount->syncFolders();
			$oInbox = $oAccount->getFolder('INBOX');
		}
		if(!$oInbox->localizedName){
			$oInbox->localizedName = self::localizeFolder($oInbox->name);
			$oInbox->id = $oInbox->name;
		}
		$aPreffered[] = $oInbox;
	
		 		foreach($aMapped as $sFolder){
			if($oMappedFolder = self::getMappedFolder($sFolder)){
				$aFolders[] = $oMappedFolder;
			}
		}
		 		try{
		 			$contacts = $this->getMappedFolder('contacts');
			$contacts->localizedName = self::localizeFolder($contacts->name);
			$aFolders[] = $contacts;
		}catch(Exc $e){
			 		}
		
		 		foreach($aFolders as $oFolder){
			$oFolder->id = rawurlencode($oFolder->name);
			if(!$oFolder->localizedName){
				$oFolder->localizedName = self::localizeFolder($oFolder->name);
			}
			$aOther[] = $oFolder;
		}
		 		$aFdrPreffered = WebmailIqFolders::cnvFolders($aPreffered,true);
		$aFdrOther = WebmailIqFolders::cnvFolders($aOther,true);
		 		uasort($aFdrPreffered,"fdrCompare");
		uasort($aFdrOther,"fdrCompare");
		if ($aFdrOther) {
			$aFdr['num'] = slToolsPHP::array_merge($aFdrPreffered,$aFdrOther); 
		}else{
			$aFdr['num'] = $aFdrOther;
		}
		foreach($aFdr['num'] as $key => $fdr){
			$info = $this->getInfo($fdr['type'],$fdr['name']);
			if($fdr['id'] == $selected){
				$aFdr['num'][$key]['selected'] = true;
			}else{
				$aFdr['num'][$key]['selected'] = false;
			}
			foreach($info as $ik =>$iv){
				$aFdr['num'][$key][$ik] = $iv;
			}
		}
		return $aFdr;
	}
	

	
}

?>
