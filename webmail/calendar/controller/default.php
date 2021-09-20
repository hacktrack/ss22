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
	 
	public function __construct( &$application )
	{
		$this->application = &$application;
		$this->pageType = 'xml';
	}
	
	 
	public function getActualSkin()
	{
		$settings = slSettings::instance();
		$settings->check( APP );
		 		$layoutSettings = $settings->get('layout');
		$default = $layoutSettings['skin'];
		$gui = slGUI::instance( $this->application );
		 		if(defined('APP_SKIN')){
			$skin = constant('APP_SKIN');
		}
		
		$skin='fresh';
		
		return $skin?$skin:$default;
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
		if($request->get('all.email') && $this->application->pages['main'] == 'win.login'){
			$result = new stdClass();
			$result->redirect = true;
			$result->redirectURL = $request->getPath().'?_n[p][main]=win.main.public&_n[p][content]=event.main&email='.$request->get('all.email');
			return $result;
		}
		foreach($this->application->pages as $pageID=>$pageContent){
			if(!$request->get('all._n.p.'.$pageID)){
				$request->set('all._n.p.'.$pageID,$pageContent);
			}
		}
		$gui->setView( $page );
		if( $template ){
			$gui->setTemplateData( $template );
		}
		if($eid = $this->application->session->request->get('all.eid')){
			$error = $this->application->session->getMain('["error"]["'.$eid.'"]["error"]');
			$data = $this->application->session->getMain('["error"]["'.$eid.'"]["data"]');
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
		
		 
		try{
			echo $gui->draw();
		}catch(Exception $e){
			echo $e->getMessage();
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
				slToolsFilesystem::mkdir_r($dir,0777,true);
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
		$request->setData($data['data']);
		if($dialogData){
			$request->set('dialog',$dialogData);
		}
		$this->data = $data['data'];
		$request->setQueryString($data['qs']);
		$request->setPath($data['path']);
		$request->setReferer($data['referer']);
		 		return $data['data'];
	}
	
}