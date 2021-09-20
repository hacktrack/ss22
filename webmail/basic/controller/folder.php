<?php
require_once('inc/user.php');

class slControllerFolder extends slControllerDefault
{
	public function check( &$action, &$data )
	{
		parent::check($action,$data);
		$request = slRequest::instance();
		$aHelper['helper'] = 'folder';
		$this->oHelper = slHelperFactory::instance($aHelper);
		switch($action){
			case 'renameLink':
			case 'unlinkFolder':
			case 'linkFolder':
				$this->sName = $request->get('all.folderLinkName');
				$this->sFID = $request->get('all.folder.active');
			break;
			case 'addFolder':
				$this->sName = $request->get('all.newFolderName2');
				$this->sType = $request->get('all.folder.type');
			case 'editFolder':
				if (empty($this->sName))
				{
					$this->sName =$request->get('all.newFolderName');
				}
				$this->sFID = $request->get('all.folder.active');
			break;
			case 'defaultFolder':
			case 'emptyFolder':
			case 'deleteFolder':
				$this->sFID = $request->get('all.folder.active');
			break;
			case 'multiple_action':
			break;
		}
		$this->sFID = str_replace( '#/', '', $this->sFID );
		 		$sid = $request->get('all.'.SESSION_COOKIE_NAME);
		$oUser = User::load($sid);
		$this->oAccount = &$oUser->getAccount($_SESSION['EMAIL']);
	}
	
	public function linkFolder($redirect = true,&$folders = false)
	{
		$oFolder = $this->oAccount->getFolder($this->sFID);
		$type = $oFolder->getType();
		$folders = $this->oHelper->getPersonalFolders($type);
		$this->oHelper->addPersonalFolder($folders,$this->sFID,$this->sName);
		$this->oHelper->setPersonalFolders($folders,$type);
		return $this->redirect();
	}
	
	public function unlinkFolder($redirect = true,&$folders = false)
	{
		$oFolder = $this->oAccount->getFolder($this->sFID);
		$type = $oFolder->getType();
		$set = false;
		if($folders===false){
			$set = true;
			$folders = $this->oHelper->getPersonalFolders($type);
		}
		$this->oHelper->deletePersonalFolder($folders,$this->sFID);
		if($set){
			$this->oHelper->setPersonalFolders($folders,$type);
		}
		if($redirect){
			return $this->redirect();
		}
	}
	
	public function renameLink($redirect = true,&$folders = false)
	{
		$type = slRequest::instance()->get('all.type');
		$set = false;
		if($folders===false){
			$set = true;
			$folders = $this->oHelper->getPersonalFolders($type);
		}
		$request = slRequest::instance();
		$folders[$this->sFID]['label'] = $this->sName;
		if($set){
			$this->oHelper->setPersonalFolders($folders,$type);
		}
		if($redirect){
			return $this->redirect();
		}
	}
	
	public function deleteFolder($redirect = true)
	{
		try{
			$this->oAccount->deleteFolder($this->sFID);
		}catch(Exception $e){
		}
		if($redirect){
			return $this->redirect();
		}
	}
	
	public function defaultFolder($redirect = true)
	{
		try{
			$request = slRequest::instance();
			$session = slSession::instance();
			$oFolder = $this->oAccount->getFolder($this->sFID);
			$oFolder->setDefault($request->get('all._s.defaultFolderType'));
			$helperSettings['helper'] = 'settings';
			$settings = slHelperFactory::instance($helperSettings);
			$settings->clearCache('default_folders','public');
			$settings->clearCache('default_folders','private');
			$settings->clearCache('mail_settings_general');
			$session->setMain('["cache"]["helper"]["settings"]["data"]',false);
			$settings->get();
		}catch(Exc $e){
			return $this->redirect($e);
		}
		if($redirect){
			return $this->redirect(false,'folder_set_default_ok');
		}
	}
	
	public function emptyFolder($redirect = true)
	{
		$result = new stdClass();
		$settingsConstructor = array('helper'=>'settings');
		$settings = slHelperFactory::instance($settingsConstructor);
		$mail_settings_general = $settings->getPrivate('mail_settings_general');
		$mail_settings_general = $mail_settings_general['@childnodes']['item'][0]['@childnodes'];
		if($mail_settings_general['delete_emptyfolder']){
			$delete_emptyfolder = $mail_settings_general['delete_emptyfolder'][0]['@value'];
		}else{
			$delete_emptyfolder = 0;
		}
		try{
			$oFolder = $this->oAccount->getFolder($this->sFID);
			if($delete_emptyfolder){
				$oFolder->deleteItems();
			}else{
				switch($oFolder->getType()){
					case 'M':
						$preloaded = $settings->get();
						$trash_name = $preloaded['settings']['default_folders']['trash'];
						$trash = $this->oAccount->getFolderWithAutoCreate($trash_name,'main');
					break;
					default:
						$trash = $this->oAccount->getFolder('__@@GWTRASH@@__');
					break;
				}
				if($oFolder==$trash){
					$oFolder->deleteItems();
				}else{
					$oFolder->moveItems($trash);
				}
			}
		}catch(Exception $e){
			$request = slRequest::instance();
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			return $result;
		}
		if($redirect){
			return $this->redirect();
		}
	}
	
	public function addFolder($redirect = true)
	{
		$result = new stdClass();
		if($this->sFID && $this->sFID!='#'){
			$sNewFolderName = $this->sFID.'/'.$this->sName;
		}else{
			$sNewFolderName = $this->sName;
		}
		try{
			if(strpos($this->sName,'/')!==false || strpos($this->sName,'\\')!==false ){
				throw new Exc('folder_name_bad_char',$this->sName);
			}
			if(strpos($this->sName,'~')!==false){
				throw new Exc('folder_name_bad_char',$this->sName);
			}
			switch($this->sType){
				case 'R':
				break;
				case 'V':
				break;
				case 'C':
				case 'E':
				case 'T':
				case 'N':
				case 'J':
				case 'F':
					$this->oAccount = &$this->oAccount->gwAccount;
				break;
				case 'M':
				break;
			}
			$this->oAccount->createFolder(
				array(
					'name'=>$sNewFolderName,
					'type'=>$this->sType,
					'check'=>1
				)
			);
		}catch(Exception $e){
			$request = slRequest::instance();
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			return $result;
		}catch(Exc $e){
			$request = slRequest::instance();
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			return $result;
		}
		if($redirect){
			return $this->redirect();
		}
	}
	
	public function editFolder($redirect = true)
	{
		$result = new stdClass();
		$oFolder = &$this->oAccount->getFolder($this->sFID);
		$type = $oFolder->getType();
		try{
			if(strpos($this->sName,'/')!==false || strpos($this->sName,'\\')!==false ){
				throw new Exc('folder_name_bad_char',$this->sName);
			}
			if(strpos($this->sName,'~')!==false){
				throw new Exc('folder_name_bad_char',$this->sName);
			}
			if(($pos = strpos($this->sFID,'/'))!==false){
				$parent = substr($this->sFID,0,$pos);
			}else{
				$parent = '';
			}
			$personal = $this->oHelper->getPersonalFolders($type);
			$sNewFolderName = ($parent?($parent.'/'):'').$this->sName;
			if(strtoupper($oFolder->name)=='INBOX'){
				throw new Exc('folder_rename_inbox','Inbox folder cannot be renamed');
			}
			if($oFolder->name!=$sNewFolderName){
				$oFolder->edit(array('name'=>$sNewFolderName));
			}
			 
			$this->oAccount->sync();
			$change =false;
			
			foreach($personal as $fdrID => $folder){
				if(strpos($fdrID,$this->sFID)===0){
					$p_folder = $personal[$fdrID];
					unset($personal[$fdrID]);
					$newID = str_replace($this->sFID,$sNewFolderName,$fdrID);
					try{
						$this->oAccount->getFolder($newID)->sync();
					}catch(Exception $e){
						
					}
					$personal[$newID] = $p_folder;
					$personal[$newID]['id'] = $newID;
					$change =true;
				}
			}
			 			$settings = slApplication::instance()->getModel()->settings;
			$settings->clearCache('default_folders','private');
			$settings->clearCache('mail_settings_general');
			if($change){
				$this->oHelper->check();
				$this->oHelper->setPersonalFolders($personal,$type);
			}
		}catch(Exception $e){
			$request = slRequest::instance();
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			return $result;
		}catch(Exc $e){
			$request = slRequest::instance();
			$result->redirect = true;
			$result->back = true;
			$result->error = $e;
			return $result;
		}
		if($redirect){
			return $this->redirect();
		}
	}
	
	public function redirect($error = false,$message = false)
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$qs = $request->getQueryString();
		$qs = preg_replace('/&folder\[active\]=([^&])+/i','',$qs);
		$path = $request->getPath();
		if($error){
			$result->error = $error;
		}
		if($message){
			$result->message = $message;
		}
		$result->redirect = true;
		$result->redirectURL = $path.'?'.$qs.'&_s[type]='.$request->get('all.type');
		return $result;
	}
	
	public function multiple_action()
	{
		$request = slRequest::instance();
		$folders = $request->get('all.folders');
		$action = $request->get('all.multiple_action');
		$type = 'M';
		switch($action){
			case 'unlink':
				$personal = $this->oHelper->getPersonalFolders($type);
			break;
		}
		if($folders){
			foreach($folders as $folder => $selected){
				$this->sFID = str_replace( '#/', '', $folder );
				switch($request->get('all.multiple_action')){
					case 'delete':
						$this->deleteFolder(false);
					break;
					case 'unlink':
						$this->unlinkFolder(false,$personal);
					break;
				}
			}
		}
		switch($action){
			case 'unlink':
				$this->oHelper->setPersonalFolders($personal,$type);
			break;
		}
		return $this->redirect();
	}
}

?>