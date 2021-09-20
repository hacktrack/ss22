<?php
slSystem::import('application/gui');
slSystem::import('io/request');
  
interface slControllerInterface
{
	 
	public function check( &$action, &$data );
	 
	public function index( $page = false );
}

 
class slControllerDefault implements slControllerInterface
{
     
    public $application;
    public $pageType;
    public $action;
    public $data;

	 
	public function __construct( &$application )
	{
		$this->application = &$application;
		$this->pageType = 'xml';
	}
	
	 
	public function getActualSkin()
	{
		$settings = slSettings::instance();
		$settings->check();
		 		$layoutSettings = $settings->get('layout');
		$default = $layoutSettings['skin'];
		$gui = slGUI::instance( $this->application );
		 		if(defined('APP_SKIN')){
			$skin = constant('APP_SKIN');
		}
		return $skin ? $skin : $default;
	}

	public function index($page = false,$template = false,$dialog_error = false)
	{
		 		$t = time();
		$m = microtime();
		$gui = slGUI::instance($this->application);
		$gui->setSkin( $this->getActualSkin() );
		if($page === false){
			$page = $this->application->getPageID();
		}
		
		$request = slRequest::instance();
		 		foreach($this->application->pages as $pageID=>$pageContent){
			if(!$request->get('all._n.p.'.$pageID)){
				$request->set('all._n.p.'.$pageID,$pageContent);
			}else{
				$pageContent = $request->get('all._n.p.'.$pageID);
			}
			$last = slSession::getMain('["history"]["'.$pageID.'"]');
			if($last!=$pageContent){
				slSession::delPage('["'.$pageID.'"]');
			}
			slSession::setMain('["history"]["'.$pageID.'"]',$pageContent);
			
		}
		
		$gui->setView( $page );
		if( $template ){
			$gui->setTemplateData( $template );
		}

		if($eid = $this->application->session->request->get('all.eid')){
			@$error = $this->application->session->getMain('["error"]["'.$eid.'"]["error"]');
			@$data = $this->application->session->getMain('["error"]["'.$eid.'"]["data"]');
			$request = slRequest::instance();
			$request->set('errorData',$data);
			$language = slLanguage::instance();
			 
			 
			
			$gui->setTemplateData( 
				array(
					'error'=>$error,
					'message'=>''
				)
			);
			$gui->setStylesheet('error');
		}
		if($mid = $this->application->session->request->get('all.mid')){
			$language = slLanguage::instance();
			$label = $language->get('messages',$mid);
			$label = $label?$label:$mid;
			$gui->setTemplateData( 
				array(
					'message'=>array(
						'id'=>$label,
						'message'=>''
					) 
				) 
			);
			$gui->setStylesheet('error');
		}
		$gui->setTemplateData(
			array('jscheck'=>$_SESSION['jscheck'])
		);
		if($dialog_error){
		$gui->setTemplateData( 
				array(
					'dialog.error'=>slLanguage::instance()->get('exceptions',$dialog_error)
				)
			);
		}

		 
		try{
			echo $gui->draw();
		}catch(Exception $e){
		    if(explode(':',$e->getMessage())[0]=='file_does_not_exist'){
				header("HTTP/1.1 403 Forbidden");
			}else{
				echo $e->getMessage();
			}
		}
		if($page=='win.login'){
			@session_destroy();
		}
		 

	}

	 
	 
	public function check( &$action, &$data )
	{
		$this->data = &$data;
		$this->action = $action;
	}
	

		 	
	protected function getController()
	{
		$class = get_class($this);
		$name = str_replace('slController','',$class);
		$name = strtolower($name);
		return $name;
	}
	
	protected function saveSentData($dataid = false)
	{
		
		$session = slSession::instance();
		$request = slRequest::instance();
		if($dataid===false){
			$dataid = $request->get('form._dlg.data');
			 			 			 			
		}
		$current= $request->getPath().$request->getQueryString();
		$previous = $request->getReferer();
		 		$files = $request->get('files');
		if($files){
			$this->saveUploadedFiles($files);
		}
		$data['data'] = $request->data();
		$data['referer'] = $request->getReferer();
		$data['path'] = $request->getPath();
		$data['qs'] = $request->getQueryString();
		$session->setMain($dataid,$data);
		 	}
	
	protected function saveUploadedFiles($files,$variable = 'files')
	{
		if(is_array($files) && isset($files['name']) && !is_array($files['name'])){
			$this->saveUploadedFile($files,$variable);
		}else{
			if(is_array($files)){
				foreach($files as $index => $file){
					$this->saveUploadedFiles($file,$variable.'.'.$index);
				}
			}
		}
	}
	
	protected function saveUploadedFile($file,$variable)
	{
		$session = slSession::instance();
		$request = slRequest::instance();
		$dir = $session->getUserDir();
		$id = slSystem::uniqueID();
		if(!$file['error']){
			if(!is_dir($dir)){
				slSystem::import('tools/filesystem');
				slToolsFilesystem::mkdir_r($dir);
			}
			$dst = $dir.$id.'.tmp';
			if(!move_uploaded_file($file['tmp_name'],$dst)){
				throw new Exc('error_moving_uploaded_file',$file['name']);
			}
			$request->set($variable.'.id',$id);
			$request->set($variable.'.tmp_name',$dst);
		}
	}
	
	protected function loadSentData($dataid = false,$dialogData = false)
	{
		$request = slRequest::instance();
		if($dataid===false){
			$dataid = $request->get('form._dlg.data');
		}
		$session = slSession::instance();
		$data = $session->getMain("[".$dataid."]");
		if(is_array($data)){
			$request->setData($data['data']);
			if($dialogData){
				$request->set('dialog',$dialogData);
			}
			$this->data = $data['data'];
			$request->setQueryString($data['qs']);
			$request->setPath($data['path']);
			$request->setReferer($data['referer']);
			 			return $data['data'];
		}else{
			return array();
		}
	}
	
	protected function callOtherControllerAction($controller,$action,$param = array())
	{
		$controller = slToolsFilesystem::securePath($controller);
		slSystem::import('controller/'.$controller,APP_PATH);
		$name = 'slController'.$controller;
		$oController = new $name( slApplication::instance() );
		$request = slRequest::instance();
		$data = $request->data();
		try{
			$oController->check($action,$data);
			$oController->data = $data;
		}catch(Exc $e){
			print_r($e);die();
		}
		return $oController->$action($param);
	}
	
}