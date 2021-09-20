<?php
slSystem::import( 'io/router' );
slSystem::import( 'io/request' );
slSystem::import( 'system/session' );
slSystem::import( 'tools/inflector' );
slSystem::import( 'controller/default' );
slSystem::import( 'application/link' );

class slApplication
{
	static private $instance;
	private $navigation;
	private $controller;
	private $action;
	private $view;
	private $model;

	public $id;
	public $session;
	public $pages;
    public $window;
    public $path;
	
	public function __construct( $id, &$model, &$session )
	{
		$this->id = $id;
		$this->model = &$model;
		$this->session = &$session;
		 	}
	
	static public function instance( $id = false, &$model = false, &$session = false )
	{
		if(!isset(self::$instance)){
			self::$instance = new slApplication( $id, $model, $session );
		}
		return self::$instance;
	}
	
	public function respond($response)
	{
		 

		if( isset( $response['controller'] ) ){
			$this->setController( $response['controller'] );
		}else{
			$this->setController( 'default' );
		}

		if( isset( $response['action'] ) ){
			$this->setAction( $response['action'] );
		}else{
			$this->setAction( 'index' );
		}
		if( !$response['nav']['window'] ){
			$response['nav']['window'] = 'main';
		}

		
		if($response['isDialog']){
			$dialog = $response['argv']['dialog'];
			if($response['isDialogAction']){
				$this->session->setMain(
					'["dialog"]["config"]',
					$response['argv']
				);
			}else{
				$data = $this->session->getMain(
					'["dialog"]["config"]'
				);
				if($data && !is_array($response['argv'])){
					slSystem::import('tools/string');
					$gui = slGUI::instance($this);
					$gui->setTemplateData(array('dialog'=>slToolsString::htmlspecialchars_array($data)));
				}
			}
		}
		
		$this->setNavigation( $response['nav'] );
		if( $controler = $this->getController() ){
			$action = $this->getAction();
			if($response['argv']){
				$result = $controler->$action($response['argv']);
			}else{
				$result = $controler->$action();
			}
			 
			$this->finish($result);
		}
	}
	
	
	public function dispatch( $request = false )
	{
		if($request === false){
			$request = &$this->session->request;
		}
		$response = slRouter::instance()->route( $request );
		return $response;
	}
	
	public function finish($result)
	{
		if($result === true || $result === false){
			return $result;
		}
		if(is_object($result) && $result->redirect == true){
			 			if(isset($result->back) && $result->back == true){
				$result->redirectURL = slLink::removeErrorAndMessage($this->session->request->getReferer());
			}
			if($result->error){
				$eid = slSystem::uniqueID();
				if($this->session->sid!=session_id()){
					$this->session->start();
				}
				
				$error['eid'] = $result->error->wmcode?$result->error->wmcode:$result->error->getMessage();
				$error['message'] = $result->error->wmcode?$result->error->message:$result->error->getMessage();
				$language = slLanguage::instance();
				$label = $language->get('exceptions',$error['eid']);

				$ecode=$error['eid'];
				if(strpos($label,'%')!==false){
					$label = sprintf($label,$error['message']);
				}
				$error['eid'] = $label?$label:$error['eid'];
				$error['eid'] = slToolsPHP::htmlspecialchars($error['eid']);
				$error['message'] = $label?slToolsPHP::htmlspecialchars($label):slToolsPHP::htmlspecialchars($error['message']);

				$this->session->setMain('["error"]["'.$eid.'"]["error"]',$error);
				$this->session->setMain('["error"]["'.$eid.'"]["data"]',$this->session->request->data());
				if($result->errorParams){
					$result->redirectURL.=$result->errorParams;
				}
				$sep = strpos($result->redirectURL,'?')===false?'?':'&';
				if ($result->external)
				{
					$result->redirectURL.=$sep.'eid='.$ecode;
				}
				else
				{
					$result->redirectURL.=$sep.'eid='.$eid.'&_s[action]=error';
				}
			}
			if($result->message){
				$sep = strpos($result->redirectURL,'?')===false?'?':'&';
				$result->redirectURL.=$sep.'mid='.$result->message;
			}
			
			 			if(isset($result->redirectURL)){
				slRouter::instance()->redirect( $result->redirectURL,true ); 
			}
		}
	}
	
	private function redirect( $location,$exit = false )
	{
		slRouter::instance()->redirect( $location, $exit );
	}
	
	private function header( $header )
	{
		header( $header );
	}
	
	public function setController( $controller )
	{
		if(!$this->controller){
			$controller = slToolsFilesystem::securepath($controller);
			$controllerName = 'slController'.slToolsInflector::classify( $controller );
			slSystem::import('controller/'.$controller);
			if( class_exists( $controllerName ) ){
				$this->controller = new $controllerName( $this );
			}else{
				$this->error( 'controller_does_not_exist');
			}
		}
	}
	
	public function getController()
	{
		return $this->controller;
	}
	
	public function setAction( $action )
	{
		
		if( !$this->controller ){
			$this->error( ' create_controller_first ' );
		}
		
		$controller = $this->getController();
		
		if( method_exists( $controller, 'check' ) ){
			try{
				$data = $this->getData();
				$controller->check( $action, $data );
			}catch(Exception $e){
				$result = new stdClass();	
				$result->redirect = true;
				$result->back = true;
				$result->error = $e;
				$this->finish($result);
			}
			$this->action = $action;
		}else{
			$this->error( "missig_controller_method:check" );
		}
		if( !method_exists( $controller, $action )){
			$name = get_class($controller);
			$this->error( "missig_controller_action: $name -> $action" );
		}
	}
	
	
	public function getAction()
	{
		return $this->action;
	}
	
	public function getData()
	{
		$request = &$this->session->request;
		return $request->data();
	}
	
	public function setNavigation( $navigation )
	{
		 		$this->navigation = $navigation;
		$this->window = $navigation['window'];
		if( !$this->window ){
			$this->window = 'main';
		}
		$request = slRequest::instance();
		$this->session->start();
		$this->session->setMain( 'window', $this->window );
		$request->set( 'all._n.w', $this->window );
		if( $navigation['pages'] ){
			foreach( $navigation['pages'] as $id => $page ){
				$this->session->setMain( '["pages"]["' . $id . '"]' ,$page );
				$request->set( 'all._n.p.'.$id, $page );
			}
		}
		$this->pages = $this->session->getMain( 'pages' );
		if($this->pages && !$this->pages['main']){
			$this->pages['main'] = APP_SCREEN_LOGGED;
		}
		if(!isset($this->pages['main'])){
			$this->pages['main'] = APP_SCREEN_UNAUTHORIZED;
		}
		if($this->pages['main']=='win.login'){
			if($request->get('all.mid')!='logged_out'){
				$request->set('all.mid',false);
			}
		}
	}
	
	public function getModel()
	{
		return $this->model;
	}

	public function getPageID()
	{
		return $this->pages[$this->window];
	}
	
	public function error($msg)
	{
		throw new Exception($msg);
	}

     
	public static function errorStatic($msg)
    {
        throw new Exception($msg);
    }
}

?>