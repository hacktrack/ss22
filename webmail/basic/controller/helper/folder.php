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
	return strcasecmp($a['label'],$b['label']);
}

class slHelperFolder extends slHelper{
	static $personalFolders;

	public function check()
	{
		$this->mappedFolders['drafts'] = $this->getMappedFolderName( 'drafts', true );
		$this->mappedFolders['trash'] = $this->getMappedFolderName( 'trash', true );
		$this->mappedFolders['sent'] = $this->getMappedFolderName( 'sent', true );
		$this->mappedFolders['inbox'] = 'INBOX';
		if($_SESSION['user']){
			$this->mappedFolders['contacts_personal'] = $_SESSION['user']->getDefaultFolder('C');
			$this->mappedFolders['contacts'] = '__@@ADDRESSBOOK@@__';
			$this->mappedFolders['events'] = $_SESSION['user']->getDefaultFolder('E');
			$this->mappedFolders['tasks'] = $_SESSION['user']->getDefaultFolder('T');
			$this->mappedFolders['notes'] = $_SESSION['user']->getDefaultFolder('N');
			$this->mappedFolders['journal'] = $_SESSION['user']->getDefaultFolder('J');
			$this->mappedFolders['files'] = $_SESSION['user']->getDefaultFolder('F');
		}
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
			$oAccount->syncFolders();
		}
		$list = $oAccount->getFolders(false);
		
		 		
		 		$result = array();
		 		$root['id'] = '#';
		$root['name'] = $oAccount->description?$oAccount->description:($oAccount->fullname?$oAccount->fullname:$oAccount->accountID);
		$root['ico'] = 'ico_accounts.gif';
		$root['strong']=true;
		$result[$root['id']] = $root;
		 		$spamqueue['id'] = $root['id'].'/SPAM_QUEUE';
		 		$spamqueue['name'] = 'Filters';
		$spamqueue['ico'] = 'folder_spam_queues.gif';
		$result[$spamqueue['id']] = $spamqueue;
		foreach($list as $id =>$folder){
			$oldID = $id;
			$id = $root['id'].'/'.$id;
			$result[$id] = $this->getFolder($oldID,false,$folder);
		}
		
		 		
		uasort($result,'fdrSort');
		slSystem::import('tools/debug');
		slToolsDebug::message('<h1>DEBUG - Folders:</h1>');
		slToolsDebug::print_r($result);

		return $result;
	}
	
	public function getFolder($id,$detail = false,$folder = false)
	{
		$root['id'] = '#';
		if($folder===false){
			$oUser = &$_SESSION['user'];
			$oAccount = $oUser->getAccount($_SESSION['EMAIL']);
			$folder = $oAccount->getFolder($id);
		}
		
		 
		
		$oldID = $id;
		 		$id = $root['id'].'/'.$id;
		
		$public=false;
		if (isset($folder->public) && $folder->public==1)
		{
			$public=true;
		}
		
		$result = $this->getInfo($folder->getType(),$oldID,$public);

		if ($folder->isDefault())
		{
			$result['isDefault']=1;
		}
		
		 		foreach($folder as $prop=>$val){
			if(!is_object($val) && !is_array($val)){
				$result[$prop] = $val;
			}
		}
		 		$result['folder'] = $oldID;
		 		$result['id'] = $id;
		 		$result['name'] = $folder->name;
		$result['wmtype'] = $folder->type;
		if(($pos = strrpos($folder->name,'/'))!==false){
			$result['name'] = substr($folder->name,$pos+1);
		}
		if($result['name']=='INBOX'){
			$language = slLanguage::instance();
			$result['name'] = $language->get('common_folders','inbox');
		}

		 		if($folder->getType()=='M'){
			$result['recent'] = $folder->countItems(Item::FLAG_SEEN, false);
		}
		if($detail){
			$result['rights'] = Folder::rightsToString($folder->getMyRights());
		}
		
		 		
		return $result;
	}
	
	public function getDetail($sDataID,$id)
	{
		$oldID = $id;
		$root['id'] = '#';
		$id = $root['id'].'/'.$id;
		$result[$id] = $this->getFolder($oldID,true);
		return $result;
	}


	public function getInfo($type,$id,$public=false)
	{
		 		switch($type){
			case 'M':
				 				if($public)
				{
					$info['subtype'] = 'public';
					$info['ico'] = 'folder_public.gif';
					$info['page'] = 'mail.main';
				}else if(
					($id == $this->mappedFolders['drafts'])
				||	($this->mappedFolders['drafts'] == false && strtolower($id)=='drafts')
				){
					$info['subtype'] = 'drafts';
					$info['ico'] = 'folder_drafts.gif';
					$info['page'] = 'mail.drafts';
				}else if(
					($id == $this->mappedFolders['trash'])
				||	($this->mappedFolders['trash'] == false && strtolower($id)=='trash')
				){
					$info['subtype'] = 'trash';
					$info['ico'] = 'folder_trash.gif';
					$info['page'] = 'mail.main';
				}else if(
					($id == $this->mappedFolders['sent'])
				||	($this->mappedFolders['sent'] == false && strtolower($id)=='sent')
				){
					$info['subtype'] = 'sent';
					$info['ico'] = 'folder_sent.gif';
					$info['page'] = 'mail.main';
				}else if(
					($id == $this->mappedFolders['spam'])
				||	($this->mappedFolders['spam'] == false && strtolower($id)=='spam')
				){
					$info['subtype'] = 'spam';
					$info['ico'] = 'folder_spam.gif';
					$info['page'] = 'mail.main';
				}else if(strtolower($id)=='inbox'){
					$info['subtype'] = 'inbox';
					$info['ico'] = 'folder_inbox.gif';
					$info['page'] = 'mail.main';
				}else{
					$info['subtype'] = 'common';
					$info['ico'] = 'folder_normal.gif';
					$info['page'] = 'mail.main';
				}
			break;
			case 'HIPAA':
				$info['subtype'] = 'common';
				$info['ico'] = 'folder_normal.gif';
				$info['page'] = 'hipaa.main';
				break;
			case 'X':
			case 'S':
				$info['subtype'] = 'public';
				$info['ico'] = 'folder_public.gif';
				$info['page'] = 'mail.main';
			break;
			case 'C':

				$info['ico'] = 'folder_contacts.gif';
				$info['page'] = 'contact.main';
				break;
			case 'E':
				$info['ico'] = 'folder_events.gif';
				$info['page'] = 'event.main';
				$ico = 'folder_events.gif';
				break;
			case 'T':
				$info['ico'] = 'folder_tasks.gif';
				$info['page'] = 'tasks.main';
				$ico = 'folder_task.gif';
				break;
			case 'J':
				$info['ico'] = 'folder_journal.gif';
				$info['page'] = 'journal.main';
				$ico = 'folder_journal.gif';
				break;
			case 'N':
				$info['ico'] = 'folder_notes.gif';
				$info['page'] = 'notes.main';
				$ico = 'folder_notes.gif';
				break;
			case 'F':
				$info['ico'] = 'folder_files.gif';
				$info['page'] = 'file.main';
				$ico = 'folder_files.gif';
				break;
			case 'Q':
				$info['ico'] = 'folder_spam_quarantine.gif';
				$info['page'] = 'quarantine.main';
				$ico = 'folder_spam_quarantine.gif';
				break;
			case 'QL':
				switch(strtolower($id)){
					 					case 'spam_queue/blacklist':
						$info['ico'] = 'folder_spam_black.gif';
						$info['page'] = 'quarantine.bwlist';
					break;
					case 'spam_queue/whitelist':
						$info['ico'] = 'folder_spam_white.gif';
						$info['page'] = 'quarantine.bwlist';
					break;
				}
				break;
			default:
				$info['ico'] = 'folder_normal.gif';
				$info['page'] = 'mail.main';
				$ico = 'folder_normal.gif';
			break;
		}
		$info['type'] = $type;
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
			}
			$xml->folders->$tagName = new SimpleXMLElement('<'.$tagName.'></'.$tagName.'>');
			if (is_array($folders)){
				foreach($folders as $folder => $fdr){
					if(!in_array($folder,$this->mappedFolders) || ($type=='C' && $folder!='__@@ADDRESSBOOK@@__')){
						$elm = $xml->folders->$tagName->addChild('folder',slToolsPHP::htmlspecialchars($folder));
						$elm->addAttribute('label',$fdr['label']);
					}
				}
			}
		}
		return $xml->asXML($file);
	}

	public function getPersonalFolders($type)
	{
		try{
		if(!isset(self::$personalFolders[$type])){
			if($type!='Q' && $type!='QL'){
				slSystem::import('tools/xml');
				$nonExistingFolders = array();
				$user = $_SESSION['user'];
				if(!is_object($user)){
					return;
				}
				$account = $user->getAccount($_SESSION['EMAIL']);
				$userdir = User::getDir();
				$file = $userdir.personalfoldersfile;
				if(!is_dir($userdir)){
					slSystem::import('tools/filesystem');
					slToolsFilesystem::mkdir_r($userdir,0777,true);
				}
				if(!is_file($file)){
					$forbidden = array();
					slSystem::import('tools/icewarp');
					slToolsIcewarp::iw_file_put_contents($file,'<personal><folders><mail></mail></folders></personal>');
					$init_folders = $account->getFolders();
					if(is_array($init_folders) && !empty($init_folders)){
						foreach($init_folders as $init_folder){
							if($init_folder->shared || $init_folder->archive){
								$forbidden[] = $init_folder->name.'/';
							}
						}
					}
					if(is_array($init_folders) && !empty($init_folders)){
						foreach($init_folders as $init_folder){
							 							if(strpos($init_folder->name,'~')!==0 && !$folder->archive){
								if($forbidden) foreach($forbidden as $pub){
									if(substr($init_folder->name,0,strlen($pub))==$pub){
										$skip = true;
									}
								}
								if(!$skip){
									$foldersByType[$init_folder->getType()][] = $init_folder;
								}
							}
						}
						$types = array('M','C','E','T','N','F');
						$set = false;
						foreach($types as $typ){
							$this->fillFolders($foldersByType,$typ);
						}
					}
				}
				$xml = slToolsXML::loadFile($file);
				if( $xml && $xml->folders ){
					$tagName = $this->getTagByType($type);
					if($xml->folders->$tagName){
						foreach($xml->folders->$tagName->folder as $tag => $value){
							$val = strval($value);
							if(!in_array($val,$this->mappedFolders) || ($type=='C' && $folder!='__@@ADDRESSBOOK@@__')){
								try{
									$fdr = $account->getFolder($val);
									$folders[$val] = $this->getInfo($type,$val);
									$folders[$val]['label'] = strval($value["label"]);
									$folders[$val]['id'] = $val;
									$folders[$val]['is_default'] = $fdr->isDefault();
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
				$inboxLabel = $oLanguage->get('common_folders','inbox');
				$draftsLabel = $oLanguage->get('common_folders','drafts');
				if(!$draftsLabel){
					$draftsLabel = '{lang::common_folders::drafts}';
				}
				$sentLabel = $oLanguage->get('common_folders','sent');
				if(!$sentLabel){
					$sentLabel = '{lang::common_folders::sent}';
				}
				$trashLabel = $oLanguage->get('common_folders','trash');
				if(!$trashLabel){
					$trashLabel = '{lang::common_folders::trash}';
				}
				if($folders){
					uasort($folders,'fdrSort2');
				}else{
					$folders = array();
				}
			}
			switch($type){
				case 'M':
					$fdr = $account->getFolder('INBOX');
					$inboxUnread = $fdr->countItems(Item::FLAG_SEEN, false);
					$prefered = array(
						'INBOX'=>array(
							'label'=>$inboxLabel,
							'ico'=>'folder_inbox.gif',
							'subtype'=>'inbox',
							'page'=>'mail.main',
							'id'=>'INBOX',
							'type'=>$type,
							'is_default'=>1,
							'rights'=>'riwtlka',
							'recent'=>$inboxUnread
						)
					);
					$typ = 'main';
					try{
						$fdr = $account->getFolder($this->mappedFolders['drafts'],$typ,false);
						$prefered[$this->mappedFolders['drafts']]=array(
							'label'=>$this->mappedFolders['drafts'],							'ico'=>'folder_drafts.gif',
							'subtype'=>'drafts',
							'page'=>'mail.drafts',
							'id'=>$this->mappedFolders['drafts'],
							'type'=>$type,
							'is_default'=>1,
							 						);
						
					}catch(Exception $e){
	
					}
					try{
						$fdr = $account->getFolder($this->mappedFolders['sent'],$typ,false);
						$prefered[$this->mappedFolders['sent']]=array(
							'label'=>$this->mappedFolders['sent'],							'ico'=>'folder_sent.gif',
							'subtype'=>'sent',
							'page'=>'mail.main',
							'id'=>$this->mappedFolders['sent'],
							'type'=>$type,
							'is_default'=>1,
							 						);
					}catch(Exception $e){
	
					}
					try{
						$fdr = $account->getFolder($this->mappedFolders['trash'],$typ,false);
						$prefered[$this->mappedFolders['trash']]=array(
							'label'=>$this->mappedFolders['trash'],							'ico'=>'folder_trash.gif',
							'subtype'=>'trash',
							'page'=>'mail.main',
							'id'=>$this->mappedFolders['trash'],
							'type'=>$type,
							'is_default'=>1,
							 						);
					}catch(Exception $e){
	
					}
					
					try{
						$fdr = $account->getFolder($_SESSION['SPAM_FOLDER_NAME']);
						$prefered[$_SESSION['SPAM_FOLDER_NAME']]=array(
								'label'=>$_SESSION['SPAM_FOLDER_NAME'],								'ico'=>'folder.gif',
								'subtype'=>'spam',
								'page'=>'mail.main',
								'id'=>$_SESSION['SPAM_FOLDER_NAME'],
								'type'=>$type,
								'is_default'=>1,
								 						);
					}catch(Exception $e){
					
					}
				break;
				case 'C':
				case 'E':
				case 'T':
				case 'N':
				case 'J':
				case 'F':
					$typ = 'gw';
					$tag = $this->getTagByType($type);
					$info = $this->getInfo($type,$this->mappedFolders[$tag]);
					try{
						$fdr = $account->getFolder($this->mappedFolders[$tag],$typ,false);
						$label = $this->mappedFolders[$tag]=='__@@ADDRESSBOOK@@__'?$oLanguage->get('menu','address_book'):basename($this->mappedFolders[$tag]);
						$prefered[$this->mappedFolders[$tag]]=array(
							'label'=>$label,
							'ico'=>$info['ico'],
							'subtype'=>$tag,
							'page'=>$info['page'],
							'id'=>$this->mappedFolders[$tag],
							'type'=>$type,
							'is_default'=>1,
							 						);
					}catch(Exception $e){
	
					}
				break;
				case 'QL':
				case 'Q':
					$folders = array();
					if($_SESSION['QUARANTINE_SUPPORT']){
						$id = 'Quarantine';
						$qlabel = slLanguage::instance()->get('quarantine','quarantine');
						$info = $this->getInfo('Q','Quarantine');
						$prefered[$id]=array(
							'label'=>$qlabel,
							'ico'=>$info['ico'],
							'page'=>$info['page'],
							'id'=>$id,
							'type'=>'Q',
							'is_default'=>1
						);
						
					}
					if($_SESSION['WLIST_ENABLE']){
						$id = 'SPAM_QUEUE/Whitelist';
						$info = $this->getInfo('QL',$id);
						$prefered[$id]=array(
							'label'=>slLanguage::instance()->get('quarantine','whitelist'),
							'ico'=>$info['ico'],
							'page'=>$info['page'],
							'id'=>$id,
							'type'=>'QL',
							'is_default'=>1
						);
					}
					if($_SESSION['BLIST_ENABLE']){
						$id = 'SPAM_QUEUE/Blacklist';
						$info = $this->getInfo('QL',$id);
						$prefered[$id]=array(
							'label'=>slLanguage::instance()->get('quarantine','blacklist'),
							'ico'=>$info['ico'],
							'page'=>$info['page'],
							'id'=>$id,
							'type'=>'QL',
							'is_default'=>1
						);
					}
				break;
			}
			if($prefered){
				$folders = $prefered + $folders;
			}
			
			if(is_array($folders))
			{
				foreach($folders as $key=>$val)
				{
					$folders[$key]['label']=slToolsPHP::htmlspecialchars($val['label']);
				}
			}
			
			$app = slApplication::instance();
			$gui = slGUI::instance($app);
			$gui->setTemplateData(array('folders'=>array('personal'=>$folders)));
			self::$personalFolders[$type] = $folders;
		}else{
			$folders = self::$personalFolders[$type];
		}
		return $folders;
		}catch(Exc $e){
			
		}
	}

	public function fillFolders($folders,$type)
	{
		$cnt = count($folders[$type]);

		if($cnt <= 10 && $cnt > 0){

			foreach($folders[$type] as $folder){
				$fdr['label'] = basename($folder->name);
				$fdr['uid'] = $folder->name;
				 				 				if($folder->type=='V'){
					continue;
				}
				$personal[$folder->name] = $fdr;
			}
			$this->setPersonalFolders( $personal, $type );
			return true;
		}
		return false;
	}

	public function localizeFolder($sName)
	{
		$oLanguage = slLanguage::instance();
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
			$oFolder = $oAccount->getFolderWithAutoCreate($sFolder);

		}else{
			 			$sAccount = $_SESSION['EMAIL'];
			$oAccount = $oUser->getAccount($sAccount);
			try{
				$sFolder = ucfirst(strtolower($sType));

				$oFolder = $oAccount->getFolder($sFolder);
			}catch(Exception $e){
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
		}
		return $oFolder;
	}

	static public function isDisplayFolder($folder)
	{
		if($folder['wmtype']=='V'			|| $folder['wmtype']=='Q'			|| $folder['wmtype']=='J'			 			|| $folder['id']=='#/SPAM_QUEUE'			|| $folder['wmtype']=='QL'){			return false;
		}else{
			return true;
		}
	}
}

?>
