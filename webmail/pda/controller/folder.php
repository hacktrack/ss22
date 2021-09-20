<?php
require_once('inc/user.php');
slSystem::import('controller/grid',APP_PATH);

class slControllerFolder extends slControllerGrid
{
	public function check( &$action, &$data )
	{
		parent::check($action,$data);
		$request = slRequest::instance();
		$aHelper['helper'] = 'folder';
		$this->oHelper = slHelperFactory::instance($aHelper);
		switch($action){
			case 'unlinkFolder':
			case 'linkFolder':
				$this->sName = $request->get('all.folderLinkName');
				$this->sFID = $request->get('all.folder.active');
			break;
			case 'addFolder':
				$this->sName = $request->get('all.newFolderName');
				$this->sFID = $request->get('all.folder.active');
			break;
			case 'deleteFolder':
				$this->sFID = $request->get('all.folder.active');
			break;
			case 'multiple_action':
			break;
		}
		$this->sFID = str_replace( '#/', '', $this->sFID );
		$this->sFID = str_replace( '#', '', $this->sFID );
		 		$sid = $request->get('all.'.SESSION_COOKIE_NAME);
		$oUser = User::load($sid);
		$this->oAccount = $oUser->getAccount($_SESSION['EMAIL']);
	}
	
	public function sync()
	{
		
		$request = slRequest::instance();
		$result = new stdClass();
		$selector = $request->get('all._s');
		$qs = $request->getQueryString();
		try{
			$this->oAccount->sync();
			$this->oAccount->aSyncedFolders[$selector['id']] = false;
			$oFolder = $this->oAccount->getFolder($selector['id']);
			$oFolder->sync();
		}catch(Exception $e){

		}
		$result->redirect = true;
		$result->redirectURL = $this->getContainerLink($selector);
		return $result;
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
	
	public function deleteFolder($redirect = true)
	{
		try{
			$this->oAccount->deleteFolder($this->sFID);
		}catch(Exception $e){
			
		}
		if($redirect){
			return $this->redirect($redirect = true);
		}
	}
	
	public function addFolder($redirect = true)
	{
		if($this->sFID){
			$sNewFolderName = $this->sFID.'/'.$this->sName;
		}else{
			$sNewFolderName = $this->sName;
		}
		try{
			$this->oAccount->createFolder(array('name'=>$sNewFolderName));
		}catch(Exception $e){
			
		}
		if($redirect){
			return $this->redirect();
		}
	}
	
	public function redirect()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$qs = $request->getQueryString();
		$qs = preg_replace('/&folder[action]=[a-z0-9]{0,}&folder[active]=([^&])+/i','',$qs);
		$path = $request->getPath();
		$result->redirect = true;
		$result->redirectURL = $path.'?'.$qs;
		
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
	
	protected function getContainerLink($selector)
	{
		$router = slRouter::instance();
		$request = slRequest::instance();
		$folder['helper'] = 'folder';
		$folderHelper =slHelperFactory::instance($folder);
		$folderInfo = $folderHelper->getInfo($selector['type'],$selector['id']);
		$params = array(
			'window'=>'main',
			'target'=>'main',
			'view'=>$folderInfo['page'],
			'data'=>'item.fdr',
			'id'=>$selector['id'],
			'type'=>$selector['type']
		);
		$link = $router->getCompressedLink('folder',$params);
		$link = $request->getPath().str_replace('&amp;','&',$link);
		if($sort = $request->get('get._s.sort')){
			$link = $this->replaceURLVariable($link,'_s[sort]',$sort);
		}
		if($search = $request->get('get._s.search')){
			$link = $this->replaceURLVariable($link,'_s[search]',$search);
		}
		if($page = $request->get('get._s.page')){
			$link = $this->replaceURLVariable($link,'_s[page]',$page);
		}
		return $link;
	}
}

?>