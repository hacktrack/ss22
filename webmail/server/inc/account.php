<?php
 

abstract class Account extends slObserver
{
	 	public $gwAccount;

	 	public $folders;

	 	public $server;

	 	public $port;

	 	public $username;

	 	private $password;

	 	public $description;
	public $primary;
	public $archiveFolder;
	public $virtualAccount;
	public $sharedAccount;
	public $remindersAccount;
	public $tagsAccount;
	public $hipaaAccount;
	public $groupAccount;
	public $sizeAccount;
	public $aSyncedFolders;
	public $meetingsFolder;
	
	   private static $aAutoCreateFolderTypes = array
	(
		'trash'=>'M',
		'drafts'=>'M',
		'sent'=>'M',
		'spam'=>'M',
		'contacts'=>'C',
		'events'=>'E',
		'notes'=>'N',
		'tasks'=>'T',
		'journal'=>'J',
		'files'=>'F'
	);
	
	public static 	$aForbiddenFolders = array(
			S_FOLDER_NAME_UPPER,
			Q_FOLDER_NAME_UPPER,
			B_FOLDER_NAME_UPPER,
			W_FOLDER_NAME_UPPER,
			'@@MYCARD@@',
			'__@@TAGS@@__',
			'__@@SHARED@@__',
			'__@@REMINDERS@@__',
			'__@@ADDRESSBOOK@@__',
			'__@@DEVICES@@__',
			'__@@GWTRASH@@__',
			'__@@CRO_FOLDER@@__'
		);

	
  public $accountID;

  abstract public function sync($force_gw = false, $folders = array());

	 
	protected function __construct($server, $port, $username, $password,$properties)
	{
		$this->folders	= array(
			'main' => array(),
			'gw'	=> array(),
			'quarantine' => array(),
			'virtual'=>array()
		);
		$this->server	= $server;
		$this->port	  = $port;
		$this->username  = $username;
		$this->password  = slToolsCrypt::encryptSymmetric($password);
		if (!$properties) return;
		foreach($properties as $key => $val){
			if($key == 'password') continue;
			$this->$key = $val;
		}
	}

	public function getPassword()
	{
		return slToolsCrypt::decryptSymmetric($this->password);
	}

	 
	final public function edit($aProperties)
	{
		foreach ($aProperties as $property => $value){
			$this->$property = $value;
		}
	}

	 
	final public function appendGroupWareAccount($gwAccount)
	{
		$this->gwAccount = $gwAccount;
	}

	 
	final public function isGroupWare(&$logged = true)
	{
		$logged = false;
		if ($this->gwAccount->bLogged){
			$logged = true;
		}
		return $this->gwAccount ? true : false;
	}
	
	final public function appendOperatorFolders()
	{
		$uid = null;
		$povolene_skupiny = [];
		$this->folders['cro'] = array();
		 		$userfile = $_SESSION['USERDIR'].'redaktors.xml';
		if(file_exists($userfile)){
			$file = $_SESSION['CONFIGPATH'].'redaktors.xml';
			$icewarpAccount = new IceWarpAccount();
			$redaktors = array();
			$skupiny = array();
			$modified = filemtime($file);
			$usermodified = filemtime($userfile);
			if($usermodified!=$_SESSION['CRO']['USER_MODIFIED']){
				$xml = slToolsXML::loadFile($userfile);
				if($xml->skupina){
					foreach($xml->skupina as $skupina){
						$povolene_skupiny[strval($skupina)]['id'] = strval($skupina);
						$povolene_skupiny[strval($skupina)]['rights'] = strval($skupina['access']);
					}
					$_SESSION['CRO']['POVOLENE_SKUPINY'] = $povolene_skupiny;
					$_SESSION['CRO']['USER_MODIFIED'] = $usermodified;
				}
			}
			if($modified!=$_SESSION['CRO']['MODIFIED']){
				$xml = slToolsXML::loadFile($file);
				if($xml->skupina){
					foreach($xml->skupina as $skupina){
						$ids = array();
						if($skupina->uzivatel){
							$redaktors = array();
							$uid = strval($skupina['uid']);
							if(isset($povolene_skupiny[$uid])){
								foreach($skupina->uzivatel as $uzivatel){
									if(strval($uzivatel->email) == $_SESSION['EMAIL']){
										$fdrName = strval($uzivatel->adresar);
									}else{
										$fdrName = $_SESSION['SHARED_PREFIX'].strval($uzivatel->email).'/'.strval($uzivatel->adresar);
									}
									$icewarpAccount->Open(strval($uzivatel->email));
									$r['folder'] = $fdrName;
									$r['name'] = $icewarpAccount->GetProperty('u_name');
									$redaktors[] = $r;
									$ids[] = $fdrName;
									$gwFolder = new GroupWareFolder(
											$this->gwAccount,
											$fdrName,
											'E'
									);
									$this->folders['gw'][$fdrName] = $gwFolder;
								}
							}
						}
						if(isset($povolene_skupiny[$uid])){
							$skupiny[$uid]['redaktors'] = $redaktors;
							$skupiny[$uid]['nadpis'] = strval($skupina['nadpis']);
							$skupiny[$uid]['rights'] = $povolene_skupiny[$uid]['rights'];
							$skupiny[$uid]['folder'] = '__@@CRO_FOLDER@@__/'.$uid;
							$folderID = join(CRLF,$ids);
							$this->folders['cro']['__@@CRO_FOLDER@@__/'.$uid] = new VirtualFolder(
								$this->virtualAccount,
								'__@@CRO_FOLDER@@__/'.$uid,
								'E',
								$ids,
								reset($ids),
								false,
								false,
								true
							);
						}
					}
				}
				$_SESSION['CRO']['SKUPINY'] = $skupiny;
				$_SESSION['CRO']['MODIFIED'] = $modified;
				
			}
		}
		if(empty($this->folders['cro'])){
			throw new Exc('no_redaktors_users');
		}else{
			$_SESSION['CRO']['DEFAULT'] = reset(array_keys($this->folders['cro']));
		}
		 	}

	 
	public function getFolders($refresh = true)
	{
		 		if ($this->gwAccount && $this->gwAccount->bLogged){
			try{
				if($refresh){ 
					$this->folders["gw"] = $this->gwAccount->getFolders();
				}
			}catch(Exc $e){
				$this->folders["gw"] = array();
			}
		}
		
		 		if ($this->virtualAccount){
			
			try{
				if($refresh){
					$this->folders["virtual"] = $this->virtualAccount->getFolders();
				}
			}catch(Exc $e){
				$this->folders["virtual"] = array();
			}
		}
		
		
		 		if(!Folder::isRestrictedType('M')){
			$return = $this->folders['main'];
		}else{
			$return = array();
		}
		if(is_array($return) && !empty($return)){
			foreach($return as $mainKey => $mainFolder){
				 				if(is_object($mainFolder) && $mainFolder->isRSS() && $mainFolder->isRestricted()){
					unset($return[$mainKey]);
				}

			}
		}
		
		 		if ($this->folders['gw']){
			foreach($this->folders['gw'] as $fid => $folder){
				switch($folder->getType()){
					 					case 'S':
						if(Folder::isRestrictedType('S')){
							break;
						}
						 						if(!isset($return[$fid])){
							$return[$fid] = $folder;
						}
						$return[$fid]->shared = true;
						$return[$fid]->type = 'X';
						break;
					 					case 'P':
						 						if(isset($return[$fid])){
							$return[$fid]->publicRoot = true;
							$return[$fid]->groupOwner = $folder->groupOwner;
							$return[$fid]->rights = $folder->rights;
						}else{
							$return[$fid] = $folder;
							$return[$fid]->shared = true;
							$return[$fid]->type = 'X';
							$return[$fid]->rights = $folder->rights;
						}
						break;
					 					default:
						if ($folder->getType()!='M' && !Folder::isRestrictedType($folder->getType())  
							){
							$return[$fid] = $folder; 
						}
						break;
				}
			}
		}
		
		if ($this->primary){
			 			if(is_array($this->folders['quarantine']) && !empty($this->folders['quarantine'])){
				foreach($this->folders['quarantine'] as $folder){
					$return[$folder->name] = $folder;
				}
			}
			 			if(is_array($this->folders['virtual']) && !empty($this->folders['virtual'])){
				foreach($this->folders['virtual'] as $folder){
					$return[$folder->name] = $folder;
				}
			}
			 			if(isset($this->folders['search']) && is_array($this->folders['search'])){
				foreach($this->folders['search'] as $folder){
					$return[$folder->name] = $folder;
				}
			}
		}
		return $return;
	}

	 
	public function &getFolder($name, &$type = '', $logError = true, $allowDualHiddenFolder = false)
	{
		$oUser = &$_SESSION['user'];
		$nameUc = strtoupper($name);
		switch($nameUc){
			case '__@@VIRTUAL@@__/__@@MEETINGS@@__':
				if(!($this->meetingsFolder ?? false)) {
					$primary = User::getDefaultFolder('E');
					$folders = [$primary];
					$this->meetingsFolder = new VirtualFolder($this->virtualAccount, $nameUc, 'E', $folders, $primary);
				}
				return $this->meetingsFolder;
				break;
			case '__@@ARCHIVE@@__':
				if(!$this->archiveFolder){
					$ids = array();
					if(isset($this->folders['main']) && !empty($this->folders['main'])){
						foreach($this->folders['main'] as $id => $folder){
							if($folder->isArchiveSubfolder()){
								$ids[$id] = $id;
							}
						}
					}
					$this->archiveFolder = new VirtualFolder(
								$this->virtualAccount,
								'__@@ARCHIVE@@__',
								'M',
								$ids,
								reset($ids)
						);
				}
				return $this->archiveFolder;
				break;
			case '__@@SHARED@@__':
				if(!$this->sharedAccount){
					$this->sharedAccount = new SharedAccountAccount(
						$oUser,
						$_SESSION['EMAIL'].'_shared',
						$this
					);
					$this->sharedAccount->sync();
				}
				$folders = $this->sharedAccount->getFolders();
				$folder = reset($folders);
				$this->sharedAccount->folders["main"]["__@@SHARED@@__"] = $folder;
				return $folder;
			break;
			case '__@@ADDRESSBOOK@@__':
				if(!$this->folders['addressbook']){
					 					$primary = User::getDefaultFolder('C');
					 					$folders = array($primary,'@@GAL@@');
					if($_SESSION['CUSTOM_ADDRESS_BOOK']!=User::getDefaultFolder('C') && $_SESSION['CUSTOM_ADDRESS_BOOK']!='__@@ADDRESSBOOK@@__'){
						$folders[] = $_SESSION['CUSTOM_ADDRESS_BOOK'];
					}

					$oAccount = &$this->virtualAccount;
					$this->folders['addressbook'] = new VirtualFolder(
						$oAccount, 
						'__@@ADDRESSBOOK@@__', 
						'C', 
						$folders, 
						$primary
					);
				}
				return $this->folders['addressbook'];
			break;
			case '__@@REMINDERS@@__':
				if(!$this->remindersAccount){
					$this->remindersAccount = new RemindersAccount(
						$oUser,
						$_SESSION['EMAIL'].'_reminders',
						$this
					);
				}
				$folder = &$this->remindersAccount->folders['main']['__@@REMINDERS@@__'];
				return $folder;
			break;
			case '__@@TAGS@@__':
				if(!$this->tagsAccount){
					$this->tagsAccount = new TagsAccount(
						$oUser,
						$_SESSION['EMAIL'].'_tags',
						$this
					);
				}
				$folder = &$this->tagsAccount->folders['main']['__@@TAGS@@__'];
				return $folder;
			break;
			case '__@@GWTRASH@@__':
				if(!$this->folders['gwtrash']){
					$oAccount = &$this->gwAccount;
					$this->folders['gwtrash'] = new GroupWareFolder(
						$oAccount,
						'@@TRASH@@',
						'G'
					);
				}
				return $this->folders['gwtrash'];
			break;
			case '@@MYCARD@@':
				if(!$this->folders['mycard']){
					$this->folders['mycard'] = $this->gwAccount->getFolder('@@MYCARD@@', $type);
				}
				return $this->folders['mycard'];
			break;
			case '__@@DEVICES@@__':
				$folder = new DevicesFolder();
				return $folder;
			break;
			case '__@@HIPAA@@__':
				if(!$this->hipaaAccount){
					$this->hipaaAccount = new HipaaAccount(
						$oUser,
						$_SESSION['EMAIL'].'_domain',
						$this
					);
				}
				$folder = &$this->hipaaAccount->folders['icewarp']['__@@HIPAA@@__'];
				return $folder;
			break;
			case '__@@UPLOAD@@__':
				$oAccount = &$this->gwAccount;
				foreach($this->folders['gw'] as $fdr){
					if($fdr->subtype=='U' && $fdr->groupOwner==$_SESSION['EMAIL']){
						return $fdr;
					}
				}
				$folder = new GroupWareFolder(
					$oAccount, 
					'@@UPLOAD@@', 
					'F',
					Folder::DEFAULT_RIGHTS,
					false,
					false,
					false,
					false,
					0,
					'',
					'',
					'',
					'',
					'',
					'U'
				);
				$folder->groupOwner = $_SESSION['EMAIL'];
				$this->sync();
				return $folder;
			break;
			default:
				 				if(strpos($name,'__@@GROUP@@__')===0){
					if(!$this->groupAccount){
						$this->groupAccount = new GroupAccount($this->gwAccount);
					}
					$folder = $this->groupAccount->getFolder($name);
					return $folder;
				 				}else if(strpos($name,'__@@SIZE@@__')===0){
					if(!$this->sizeAccount){
						$this->sizeAccount = new SizeAccount($this->gwAccount);
					}
					$folder = $this->sizeAccount->getFolder($name);
					return $folder;				
				}
			break;
		}

		
		 		if (isset($this->folders["quarantine"][$name])) {
			$type = 'quarantine';
			return $this->folders[$type][$name];
		}
		 		if (isset($this->folders["virtual"][$name])) {
			$type = 'virtual';
			return $this->folders[$type][$name];
		}
		 		if (isset($this->folders["search"][$name])) {
			$type = 'search';
			return $this->folders[$type][$name];
		}
		 		if (isset($this->folders["icewarp"][$name])) {
			$type = 'icewarp';
			return $this->folders[$type][$name];
		}
		if (isset($this->folders["cro"][$name])) {
			$type = 'cro';
			return $this->folders[$type][$name];
		}
		 		if ($this->gwAccount && (!$type || $type=='gw')){
			try {
				$oFolder = null;
				if(!$this->gwAccount->foldersLoaded){
					$oFolder = $this->gwAccount->getFolder(MerakGWAPI::encode($name), $type);
				}else{
					if(isset($this->folders['gw'][$name])){
						$oFolder = &$this->folders['gw'][$name];
					}
				}
				if(is_object($oFolder) && $oFolder->getType()=='P' && isset($this->folders['main'][$name])){
					$type = 'main';
					return $this->folders['main'][$name];
				}
				 				if (is_object($oFolder) && ($oFolder->getType()!='M' || $allowDualHiddenFolder)){
					$type = 'gw';
					return $oFolder;
				}
			} catch (Exc $e) {
				 			}
		}
		 		if (isset($this->folders['main'][$name])) {
			$type = 'main';
			return $this->folders[$type][$name];
			 			 		} else {
			throw new Exc('folder_does_not_exist',$name,false,$logError);
		}
	}
	
	public function &getFolderWithAutoCreate($name,$ftype = 'main') 
	{
		$oFolder = false;
		$_SESSION['EXCEPTION_LOG'] = false;
		 		try {
			$oFolder = &$this->getFolder($name,$ftype,false);
		}catch(Exc $e) {
			 			$checkname = strtolower($name);
			$ftype = self::$aAutoCreateFolderTypes[$checkname] ?? 'm';
			 			$oAccount = $this->gwAccount;
			if(  strtolower($ftype) == 'm' || strtolower($ftype) == 'main' ){
				$oAccount = $this;
			}
			 			$isDefault = false;
			$default_folders = $_SESSION['user']->getDefaultFolderList();
			$param['type'] = $ftype;
			if(in_array($name,$default_folders)){
				$isDefault = true;
				$param['type'] = array_search($name,$default_folders);
				if(isset(User::$gwFolders[$param['type']])){
					$oAccount = $this->gwAccount;
					try{
						$ftype = 'gw';
						$oFolder = $this->getFolder($name,$ftype);
						return $oFolder;
					}catch(Exception $e){}
				}
				
			}
			$param['name'] = $name;
			$param['virtual'] = false;
			try{
				 				$isAllowed = false;
				foreach($_SESSION['user']->getDefaultFolderList() as $t => $defaultFolder){
					if(strtolower($name)==strtolower($defaultFolder)){
						$isAllowed = true;
						$param['attributes'] = User::$mailFlags[$t];
					}
				}
				if(!$isAllowed){
					throw new Exc('folder_does_not_exist', $name);
				}
				 
				$oAccount->createFolder($param);
			}catch(Exc $e){
				$folders = $oAccount->getFolders();
				if($folders){
					foreach($folders as $folder){
						if(strtolower($name)==strtolower($folder->name)){
							$folder->setDefault($param['type']);
							return $folder;
						}
					}
				}
				throw $e;
			}
			$oAccount->sync();
			
			if($oAccount && $oFolder = &$oAccount->getFolder($name)){
				if($isDefault){
					log_buffer("Setting folder as default","EXTENDED");
					$oFolder->setDefault($param['type'],true);
				}
				$_SESSION['EXCEPTION_LOG'] = true;
				return $oFolder;
			}
			$_SESSION['EXCEPTION_LOG'] = true;
			throw new Exc('folder_autocreate_failed',$name);
		}
		$_SESSION['EXCEPTION_LOG'] = true;
		return $oFolder;
	}
	 
	protected function createFolder($param)
	{
		$name = isset($param['name'])?$param['name']:false;
		$type = isset($param['type'])?$param['type']:false;
		$virtual = isset($param['virtual'])?$param['virtual']:false;
		Folder::checkName($name);
		 		if (isset($this->folders['main'][$name])
			|| isset($this->folders['gw'][$name]))
		{
			throw new Exc('folder_already_exists',$name);
		}
	}

	 
	public function deleteFolder($name)
	{
		$folder = &$this->getFolder($name, $type);
		$type = $folder->getType();
		$folder->delete();
		if ($this->folders[$type]) foreach($this->folders[$type] as $n => $fdr){
			if(strpos($n,$name)===0){
				unset($this->folders[$type][$n]);
			}
		}
		$default_folder = $_SESSION['user']->getDefaultFolderList();
		if(in_array($name,$default_folder)){
			unset($_SESSION['DEFAULT_FOLDERS'][$type]);
			log_buffer("Account::sync() line 509 User::syncDefaultFolders()","EXTENDED");
			$_SESSION['user']->syncDefaultFolders();
			log_buffer("Account::sync() line 511 User::syncDefaultFoldersStorage()","EXTENDED");
			$_SESSION['user']->syncDefaultFoldersStorage();
		}
	}

	 
	public function renameFolder($oldName, $newName)
	{
		if ($oldName === $newName){
			return;
		}
		if (isset($this->folders['main'][$newName])
			|| isset($this->folders['gw'][$newName]))
		{
			throw new Exc('folder_already_exists', $newName);
		}
		$folder = $this->getFolder($oldName, $type);
		$folder->rename($newName);
		$this->folders[$type][$newName] = $this->folders[$type][$oldName];
		unset($this->folders[$type][$oldName]);
	}
	
	public function setAcl($acl,$folder = false){
		return true;
	}
	
	public function getAcl($folder = false){
		return array($this->accountID=>Folder::DEFAULT_RIGHTS);
	}
	
	static public function getLicense()
	{
		$account = createobject('account');
		$account->Open($_SESSION['EMAIL']);
		$result['out'] = $account->GetProperty('U_ActivationKey_OutConn');
		$result['desk'] = $account->GetProperty('U_ActivationKey_Desktop');
		return $result;
	}
	
	public function syncFolders()
	{
		 		$this->aSyncedFolders = array();
		 		foreach($this->folders["main"] as $oFolder){
			if ($oFolder->sync){
				log_buffer("Account::syncFolders()->".$oFolder->name."->sync == true => AUTOSYNC START ","EXTENDED");
				$oFolder->sync();
				log_buffer("Account::syncFolders()->".$oFolder->name."->sync == true => AUTOSYNC END ","EXTENDED");
			}
		}
	}
	
	public function getGWTrash()
	{
		if($_SESSION['GWTRASH_SUPPORT'] && $this->gwAccount && $this->gwAccount->isConnected()){
			if(Folder::isRestrictedType('C')
			&& Folder::isRestrictedType('E')
			&& Folder::isRestrictedType('T')
			&& Folder::isRestrictedType('N')
			&& Folder::isRestrictedType('J')
			&& Folder::isRestrictedType('F')){
				return false;
			}
			$gwtrash = new GroupWareFolder($this->gwAccount,'__@@GWTRASH@@__','G');
			$gwtrash->name = '__@@GWTRASH@@__';
			$gwtrash->folderID = '__@@GWTRASH@@__';
			$gwtrash->type = 'G';
			$gwtrash->gw = true;
			$gwtrash->rights = Folder::RIGHT_DELETE | Folder::RIGHT_FOLDER_READ | Folder::RIGHT_READ;
			return $gwtrash;
		}else{
			return false;
		}
	}
	public function isDelayed()
	{
		return false;
	}

	public function twoFactorSetup($two_factor_type,$two_factor_sms = '')
	{
		$oAccount = new IceWarpAccount();
		$oAccount->Open($_SESSION['EMAIL']);
		return $oAccount->FunctionCall("InitTOTP",'', $two_factor_type==1?$two_factor_sms:'');
	}

	public function twoFactorReset($two_factor_code)
	{
		 		$oAccount = new IceWarpAccount();
		$oAccount->Open($_SESSION['EMAIL']);

		if(!$oAccount->FunctionCall("ResetTOTP",$two_factor_code)){
			throw new Exc('auth_two_factor_invalid');
		}
		$_SESSION['TWO_FACTOR_ENABLED'] = false;
		return true;
	}

	public function twoFactorConfirm($totp_code, $password)
	{
		 		if(!$totp_code){
			throw new Exc('auth_two_factor_required');
		}
		 		WebmailIqAuth::checkServerKeys();
		$privateData = file_get_contents(WM_CONFIGPATH.'private.key');
		$privateKey = openssl_pkey_get_private($privateData);
		openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($password), $password, $privateKey);
		parse_str($password,$pwd);
		$password = $pwd['p'];


		 		$oAccount = new IceWarpAccount();
		if(!$oAccount->AuthenticateUserHash($_SESSION['MAILBOX'],$password,$_SERVER['SERVER_NAME'],'||'.$_SERVER['REMOTE_ADDR'],pow($_SESSION['SERVER_LOGGING_TYPE'],2))){
			throw new Exc('login_invalid',$_SESSION['EMAIL']);
		}
		if (!$oAccount->FunctionCall("ActiveTOTP",$totp_code)){
			throw new Exc('auth_two_factor_invalid');
		}
		$_SESSION['TWO_FACTOR_ENABLED'] = true;
		return true;
	}
	public function twoFactorQRCode($totp_code)
	{
		 		$oAccount = new IceWarpAccount();
		$oAccount->Open($_SESSION['EMAIL']);
		
		$qrCode = $oAccount->FunctionCall("GetTOTPQRCode",$totp_code);
		if(!$qrCode){
			throw new Exc('auth_two_factor_invalid');
		}
		return $qrCode;
	}
	
	public function twoFactorManual($key)
	{
		 		$oAccount = new IceWarpAccount();
		$oAccount->Open($_SESSION['EMAIL']);
		
		 		WebmailIqAuth::checkServerKeys();
		$privateData = file_get_contents(WM_CONFIGPATH.'private.key');
		$privateKey = openssl_pkey_get_private($privateData);
		openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($key), $key, $privateKey);
		
		 		$kInfo = Tools::parseURL($key);
		$aeskey = $kInfo['key'];
		$code = $kInfo['code'];
		
		 		$totpSecret = $oAccount->FunctionCall("GetTOTPStr",$code,$aeskey);


		return $totpSecret;
	}

}

?>
