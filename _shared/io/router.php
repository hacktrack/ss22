<?php
require_once( SHAREDLIB_PATH.'system.php');
define ('ROUTE_OPTIONAL',0x1);
define ('ROUTE_COMPULSORY',0x2);

slSystem::import('storage/settings');

 setcookie('use_cookies','1',mktime(0,0,0,1,1,2030),'/');
@ini_set('session.use_cookies', $_COOKIE['use_cookies']);
@ini_set('session.use_trans_sid',!$_COOKIE['use_cookies']);
@ini_set('session.use_only_cookies',$_COOKIE['use_cookies']?'On':'Off');

 
class slRouter
{
	static private $instance;
	private $routes;

    public $links;

	 
	protected function __construct()
	{
		 		$this->initLinks();
	}
	
	 
	static public function instance()
	{
		if(!isset(self::$instance)){
			self::$instance = new slRouter();
		}
		return self::$instance;
	}
	
	 
 
	
	 
	public function route( $request )
	{
		 		$route['data'] = $request->get('form');
		 		if($get = $request->get('get')){
			$route['get'] = $get;
		}
		 		if( $linkID = $request->get( 'all._l' ) ){
			 			 			$link = $this->parseCompressedLink( $linkID, $get );
			 			foreach( $link as $property => $value ){
				$request->set( 'all.' . $property, $value );
				$request->set( 'get.' . $property, $value );
			}
		}
		 		if( $session = $request->get( 'all._s' ) ){
			 			$var = $request->get( 'all._s.data' );
			 			foreach( $session as $key => $val ){
				if( $val != $var ){
					$route['session']['data'][$key] = $val;
				}
			}
			 			$route['session']['index'] = $var;
		}
		 		if( $nav = $request->get( 'all._n' ) ){
			 			$route['nav']['window'] = $nav['w'];
			 			$route['nav']['pages'] = $nav['p'];
		}
		 		if( $controller = $request->get( 'all._c' ) ){
			if( $request->get( 'all._r' ) == 1 ){
				$route['controller_raw'] = true;
			}else{
				$route['controller_raw'] = false;
			}
			$route['controller'] = slToolsPHP::htmlspecialchars($controller);
		}else{
			$route['controller'] = defined('APP_DEFAULT_CONTROLLER')?APP_DEFAULT_CONTROLLER:'default';
		}
		 		if( $action = $request->get( 'all._a' ) ){
			foreach($action as $key => $action_controller){
				if(is_array($action_controller) && $action_controller['process']){
					if(isset($action_controller['controller'])){
						$route['controller'] = slToolsPHP::htmlspecialchars($action_controller['controller']);
					}
					if(isset($action_controller['action'])){
						$route['action'] = slToolsPHP::htmlspecialchars($action_controller['action']);
					}
				}else{
					if(!is_array($action_controller) && $action_controller){
						$route['action'] = slToolsPHP::htmlspecialchars($key);
					}
				}
			}
		}
		$this->checkDialog( $route );
			
		 		if(!$route['action']){
			$route['action'] = 'index';
		}
		
		 		if($request->isEmpty()){
			$route['controller'] = 'empty';
			$route['action'] = 'index';
		}
		 		 		return $route;
	}
 
	 
	public function checkDialog(&$route)
	{
		$request = slRequest::instance();
		if(($dlg = $request->get('form._dlg')) || $request->get('get._dlg')){
			
			$session = slSession::instance();
			$dialog = str_replace('.','_',$request->get('all._n.p.content'));
			if(!$dialog){
				$dialog = str_replace('.','_',$request->get('all._n.p.main'));
			}
			$dialog = $session->getMain('["dialogs"]["'.$dialog.'"]');
			if(is_array($dlg)) foreach($dlg as $dlgID => $dlgConfig){
				$dlgIDDotted = str_replace('_','.',$dlgID);
				if(strpos($dlgConfig['actions'],"|")!==false){
					$actions = explode("|",$dlgConfig['actions']);
				}else{
					$actions = array(0=>$dlgConfig['actions']);
				}
				 				if(in_array($route['action'],$actions) || $dlgConfig['process']){
					$route['argv']['action'] = slToolsPHP::htmlspecialchars($route['action']);
					$route['argv']['controller'] = slToolsPHP::htmlspecialchars($dlgConfig['controller']);
					$route['argv']['dialog'] = $dlgIDDotted;
					$route['argv']['parameters'] = $dlgConfig;
					if($dlgConfig['process']){
						$route['argv']['action'] = slToolsPHP::htmlspecialchars($dlgConfig['action']);
						$route['controller'] = 'dialog';
						$route['action'] = 'processDialog';
					}else {
						$route['controller'] = 'dialog';
						$route['action'] = 'initDialog';
					}
					$route['isDialogAction'] = true;
				}
			}else{
				slSystem::import('controller/dialog');
				if(is_array($dialog)){
					slControllerDialog::setDialogParameters($dialog['parameters']['parameters'],"",false);
				}
			}
			$route['isDialog'] = true;
		}else{
			$route['isDialog'] = false;
			$route['isDialogAction'] = false;
		}
	}
	
	 
	static private function transSID( $location )
	{
		
		if(	( ini_get( 'session.use_trans_sid' ) == '1') 
		 && ( strpos( $location, SESSION_COOKIE_NAME ) === false) ){
			$first = strpos( $location, '?' ) === false ? '?' : '&';
			$location = $location . $first .SESSION_COOKIE_NAME.'='.slSession::instance()->getSID();
		}
		return $location;
	}
		
	 
	static public function redirect( $location, $exit = false )
	{
		$location = self::transSID( $location );
		header( "Location: " . $location );
		if($exit){
			exit(200);
		}
	}
	
	
	 
	public function addRoute( $source, $destination )
	{
		$route = array();
		$route['source'] = $source;
		$route['destination'] = $destination;
		$this->routes[] = $route;
	}
	 
	public function initLinks()
	{
		$settings = slSettings::instance();
		$settings->loadXML( 'link.xml' );
		$links = $settings->get( 'links' );
		foreach( $links[0]['link'] as $link ){
			$lnk = &$this->links[ strval( $link["@attributes"]["id"] ) ];
			foreach($link['parameters'][0]['param'] as $param){
				$var = $param['@attributes']['variable'];
				$lnk['parameters'][$var]['name'] = $var;
				$lnk['parameters'][$var]['value'] = $param['@value'];
				$lnk['parameters'][$var]['replace'] = (isset($param['@attributes']['replace']) && $param['@attributes']['replace']=='1')?true:false;
			}
			if(isset($link['format'])){
				$lnk['url'] = $link['format'][0]['url'][0]; 
				$lnk['rewrite'] = $link['format'][0]['rewrite'][0];
			}
			$lnk['additional'] = $link['additional'][0]['@value'];
		}
	}
	
	 
	public function getLink( $window = '', $target = '',  $view = '', $parameters = '',$controller = '', $action = '', $isStart = true, $forceTransSID = false )
	{
		$link = $isStart ? '?' : '&amp;';
		$link.= $window ? ( '_n[w]=' . rawurlencode( $window ) )  : '';
		$link.= $view ? ('&amp;_n[p]['. rawurlencode( $target ) . ']=' . $view ) : '';
		$link.= $controller ? ('&amp;_c='.rawurlencode( $controller ) ) : '';
		$link.= $action ? ('&amp;_a['.rawurlencode( $action ).']=1') : '';
		$link.= $parameters ? (''.$parameters ) : '';
		if( $forceTransSID ){
			$link = $this->transSID( $link );
		}
		return $link;
	}
	
	 
	public function getCustomLink( $parameters, $isStart = true, $urlEncode = true, $url = '', $forceTransSID = false)
	{
		$link = '';
		foreach( $parameters as $paramName => $paramValue ){
			if($urlEncode){
				$paramValue = rawurlencode( $paramValue );
			}
			$link .= '&amp;'. $paramName .'='. $paramValue;
		}
		
		if($isStart){
			$link = preg_replace( '/&amp;/', '?', $link, 1 );
		}
		$link = $url.$link;
		if( $forceTransSID ){
			$link = $this->transSID( $link );
		}
		return $link;
	}
	
	 
	public function isCompressedLink( $linkID )
	{
		return isset($this->links[$linkID]);
	}
	
	 
	public function getCompressedLink( $linkID, $parameters, $forceTransSID = false )
	{
		$paramCount = 0;
		$link = $this->links[$linkID];
		$pars = $link['parameters'];
		$result = '?_l='.$linkID;
		if($pars) foreach($pars as $param){
			$result.='&amp;p'.$paramCount++.'='.rawurlencode( $parameters[$param['name']] );
		}
		if($link['additional']){
			$result.= str_replace('&','&amp;',$link['additional']);
		}
		if( $forceTransSID ){
			$result = $this->transSID( $result );
		}
		return $result;
	}
	
	 
	public function parseCompressedLink( $linkID, $parameters )
	{
		
		$paramCount = 0;
		$link = $this->links[$linkID];
		foreach( $link['parameters'] as $param){
			if(!isset($parameters['p'.$paramCount])){
				                 $errorResponse = new stdClass();
				$errorResponse->redirect = true;
				$error = new Exc( 'link_compressed_variable_missing', $linkID . ' / ' . $param['name']  );
				$errorResponse->error = $error;
				$errorResponse->redirectURL = slRequest::instance()->getPath();
				slApplication::instance()->finish($errorResponse);
			}	
			$param['value'] = preg_replace('/\[([%a-z0-9\+\-_]*)\]/i','.$1',$param['value']);
			$result[$param['value']]['value'] = rawurldecode( $parameters['p'.$paramCount++] );	
			if($param['replace']){	
				$result[$param['value']]['replace'] = true;
			}
		}
		foreach( $result as $key => $param){
			if($param['replace']){
				if(	preg_match('/(%%([a-z0-9%]*)%%)/i', $key, $matches) ){
					$val = $result[ $matches[2] ]['value'];
					$index = preg_replace( '/'.$matches[1].'/i', $val, $key );
					unset( $result[ $key ] );
					$res[$index] = $param['value'];
				}
			}else{
				$res[$key] = $param['value'];
			}
		}
		return $res;		
	}

}