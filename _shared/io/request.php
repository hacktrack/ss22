<?php
require_once(SHAREDLIB_PATH.'system.php');
slSystem::import('system/variable');
 
class slRequest
{
	static protected $instance;
	private $data;
	private $isEmpty;

    public $initialized;
    public $files;
    public $queryString;
    public $path;
    public $http_referer;
	
	protected function __construct()
	{
		$this->isEmpty = true;
	}

	 
	static public function instance()
	{
		if(!isset(self::$instance)){
			self::$instance = new slRequest();
		}
		return self::$instance;
	}
	
	public function isEmpty()
	{
		return $this->isEmpty;
	}

	 
	public function data()
	{
		if(!$this->initialized){
			$this->check();
		}
		return $this->data;
	}

	public function setData($data)
	{
		$this->data = $data;
	}

	 
	public function check()
	{
		$this->initialized = true;
		$this->data = array();
		 
		
		if($_COOKIE){
			foreach($_COOKIE as $var => $value){
				$this->set('cookie.'.$var, $value);
			}
		}
		if($_GET){
			foreach($_GET as $var => $value){
				$this->set('get.'.$var, $value);
			}
		}
		if($_POST){
			foreach($_POST as $var => $value){
				$this->set('form.'.$var, $value);
			}
		}
		if($_FILES){
			foreach($_FILES as $var => $value){
				if($value){
					$this->processFile( $var, $value );
				}
			}
		}
		
		if(!empty($_GET) || !empty($_POST)){
			$this->isEmpty = false;
		}
		$this->files = $_FILES;
		if(isset($_SERVER['HTTP_REFERER'])){
			$this->setReferer( $_SERVER['HTTP_REFERER'] );
		}
		$this->setQueryString( $_SERVER['QUERY_STRING'] ?? '');
		$this->setPath('index.html');
	}
	
	private function processFile( $var,$value )
	{
		if(is_array($value['name'])){
			foreach($value['name'] as $index => $item){
				$this->processFileVar( $index, $item, $var, 'name' );
			}
			foreach($value['type'] as $index => $item){
				$this->processFileVar( $index, $item, $var, 'type' );
			}
			foreach($value['size'] as $index => $item){
				$this->processFileVar( $index, $item, $var, 'size' );
			}
			foreach($value['tmp_name'] as $index => $item){
				$this->processFileVar( $index, $item, $var, 'tmp_name' );
			}
			foreach($value['error'] as $index => $item){
				$this->processFileVar( $index, $item, $var, 'error' );
			}
		}else{
			$this->set( 'files.'.$var.'.name', $value['name'] );
			$this->set( 'files.'.$var.'.type', $value['type'] );
			$this->set( 'files.'.$var.'.size', $value['size'] );
			$this->set( 'files.'.$var.'.tmp_name', $value['tmp_name'] );
			$this->set( 'files.'.$var.'.error', $value['error'] );
			
		}
	}
	
	private function processFileVar( $index, $item, $var, $type )
	{
		 		if(is_array($item)){
			foreach($item as $name=>$value){
				$this->processFileVar( $name, $value, $var.'.'.$index, $type );
			}
		}else{
			$this->set(
				'files.'.$var.'.'.$index.'.'.$type,
				$item
			);
		}
	}

	public function set( $var ,$value )
	{
		if(!$this->initialized){
			$this->check();
		}
		if(substr_count((string)$value,"\0")>0){
			echo('Possible XSS Attack with binary zero, terminating script');die();
		}
		 		if(strpos($var,'all.')===0){
			$variables[] = $var;
			$variables[] = str_replace('all.','form.',$var);
			$variables[] = str_replace('all.','get.',$var);
			$variables[] = str_replace('all.','cookie.',$var);
		}else{
			$variables[] = $var;
			if(strpos($var,'cookie.')===0){
				$variables[] = str_replace('cookie.','all.',$var);
			}
			if(strpos($var,'get.')===0){
				$variables[] = str_replace('get.','all.',$var);
			}
			if(strpos($var,'form.')===0){
				$variables[] = str_replace('form.','all.',$var);
			}
		}
		 		 		foreach($variables as $var){
			switch($var){
				default:
					slVariable::setDotted( $var , $value, $this->data );
				break;
			}
		}
	}
	
	 
	public function get($var)
	{
		if(!$this->initialized){
			$this->check();
		}
		return slVariable::getDotted( $var, $this->data );
	}
	
	public function files()
	{
		if(!$this->initialized){
			$this->check();
		}
		return $this->files;
	}
	
	 
	public function clientIP()
	{
		if(!$this->initialized){
			$this->check();
		}
		if (env('HTTP_X_FORWARDED_FOR') != null) {
			$ipaddr = preg_replace('/,.*/', '', env('HTTP_X_FORWARDED_FOR'));
		} else {
			if (env('HTTP_CLIENT_IP') != null) {
				$ipaddr = env('HTTP_CLIENT_IP');
			} else {
				$ipaddr = env('REMOTE_ADDR');
			}
		}
		if (env('HTTP_CLIENTADDRESS') != null) {
			$tmpipaddr = env('HTTP_CLIENTADDRESS');
			if (!empty($tmpipaddr)) {
				$ipaddr = preg_replace('/,.*/', '', $tmpipaddr);
			}
		}
		return trim($ipaddr);
	}
	
	public function isHttp()
	{
		if(!$this->initialized){
			$this->check();
		}
		
	}
	
	public function getURI($specialChar = true)
	{
		if(!$this->initialized){
			$this->check();
		}
		$result = $_SERVER['REQUEST_URI'];
		if($specialChar){
			$result = str_replace( '&', '&amp;', $result );
		}
		return $result;
	}
	
	public function setQueryString( $string )
	{
		$this->queryString = $string;
	}
	public function getQueryString()
	{
		if(!$this->initialized){
			$this->check();
		}
		return $this->queryString;
	}
	
	public function setPath($path)
	{
		$this->path = $path;
	}
	
	public function getPath()
	{
		if(!$this->initialized){
			$this->check();
		}
		return $_SERVER['SCRIPT_NAME'];
	}
	
	public function setReferer($referer)
	{
		$this->http_referer = $referer;
	}
	public function getReferer()
	{
		return $_SERVER['HTTP_REFERER'];
	}
	
	public function isXml()
	{
		
	}
	
	public function isRss()
	{
		
	}
	
	public function moveUploadedFile($file,$dest,$force = true)
	{
		if($file['id']){
			if($force){
				rename($file['tmp_name'],$dest);
			}else{
				$dest = $file['tmp_name'];
			}
		}else{
			if (!move_uploaded_file($file['tmp_name'], $dest)) {
				throw new Exc('move_uploaded_file',$file['tmp_name']);
			}
		}
		return $dest;
	}
	
}

?>