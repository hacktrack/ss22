<?php
  
require_once( SHAREDLIB_PATH .'system.php' );
slSystem::import('system/history');

 class slSession
{	
	 
	private static $dg=false;
	private static $instance;
	public $request;
	public $history;
	public $sid;
	 
    public $onetimelogin;
    public $userDir;
	 
	
	 
	
	static private function prepareKeys($keys,$key)
	{
		$prepared_keys=explode('[',str_replace(array(']',"'"),array('',''),$key));
		unset($prepared_keys[0]);
		
		foreach($prepared_keys as $val)
		{
			$keys[]=$val;
		}
		return $keys;
	}
	
	static private function evalFixerSet(&$var,$parts,$val)
	{
		foreach($parts as $part)
		{
			if(!isset($var[$part])){
				$var[$part]=false;
			}
			$var=&$var[$part];
		}
		$var=$val;
	}
	
	static private function evalFixerUnset(&$var,$parts)
	{
		foreach($parts as $part)
		{
			if(!isset($var[$part])){
				return false;
			}
			$var=&$var[$part];
		}
		$var=null;
	}
	
	static private function evalFixerIsset(&$var,$parts)
	{
		foreach($parts as $part)
		{
			if(!isset($var[$part])){
				return false;
			}
			$var=&$var[$part];
		}
		return true;
	}
	
	static private function evalFixerGet(&$var,$parts)
	{
		foreach($parts as $part)
		{
			if(!isset($var[$part])){
				return false;
			}
			$var=&$var[$part];
		}
		return $var;
	}
	
	 
	public function __construct(&$request = false,$useSID=true)
	{
		$this->request = &$request;
		$this->request->check();
		 		if($useSID && $session_id_login = $request->get('get.sid')){
			try{
				 				User::load(slToolsPHP::htmlspecialchars($session_id_login));
				unset($_SESSION['SID']);
				$session_backup = $_SESSION;
				session_destroy();
				$cookie = new slToolsCookie();
				if ($cookie->isSecure()) {
					ini_set('session.cookie_secure', 'on');
				}
				session_start();
				$newSID = session_id();
				foreach($session_backup as $key=>$val){
					$_SESSION[$key] = $val;
				}
				$this->sid  = $_SESSION['SID'] = $newSID;
				 				$cookie->setcookie( SESSION_COOKIE_NAME, $newSID,mktime(0,0,0,1,1,2030),'/');
				$this->onetimelogin = true;
			}catch(Exception $e){
			}
		}else
		if($this->sid = $request->get('all.' . (defined('SESSION_COOKIE_NAME') ? SESSION_COOKIE_NAME:''))){
			@session_id( slToolsPHP::htmlspecialchars($this->sid) );
			$cookie = new slToolsCookie();
			if ($cookie->isSecure()) {
				ini_set('session.cookie_secure', 'on');
			}
			@session_start();
			if( @session_id()!=$this->sid ){
				 				unset($this->sid);
			}
		}
		$ref = $request->getReferer();
		if($request->get('all.ref')){
			$ref = $request->get('all.ref');
		}
		if(isset($_SESSION) && !isset($_SESSION['LOGOUT_REFERER'])){
			$_SESSION['LOGOUT_REFERER'] = $ref;
		}
		$this->history = slHistory::instance( $this );
	}
	
	public function setUserDir($dir = false)
	{
		$this->userDir = $dir;
	}
	public function getUserDir()
	{
		return $this->userDir;
	}
	
	public function destroy()
	{
		@session_destroy();
	}
	
	public function start()
	{
		$cookie = new slToolsCookie();
		if ($cookie->isSecure()) {
			ini_set('session.cookie_secure', 'on');
		}
		@session_start();
		return @$this->sid = session_id();
	}
	
	public static function instance( &$request = false,$useSID=true)
	{
		if( !isset( self::$instance ) ){
			self::$instance = new slSession($request,$useSID);
		}
		
		return self::$instance;
	}
	
	public function getSID()
	{
		if($_SESSION['SID'] && !$this->sid){
			$this->sid = $_SESSION['SID'];
		}
		return $this->sid;
	}
	 
	public static function set($key,$value,$where)
	{
		$bkey=$key;
		$key=self::prepareWhat($key);
	
		 		 		
		$where=strtolower(str_replace(array("0","1","2"),array("main","page","temp"),$where));
		if (substr_count($key,"[")>0 && substr_count($key,"]")>0)
		{
			self::evalFixerSet($_SESSION,self::prepareKeys(array('framework',APP,$where),$key),$value);
			 		}
		else
		{
			if (is_object($_SESSION["framework"][APP][APP_SKIN][$where]))
			{
				$_SESSION["framework"][APP][APP_SKIN][$where]->$key=$value;
			}
			else
			{
				$_SESSION["framework"][APP][APP_SKIN][$where][$key]=$value;
			}
		}
	}
	
	 
	public static function add($key,$value,$where)
	{			
		 		
		self::set($key,$value,$where);
	}
	
	 
	public static function setMain($key,$value)
	{			
		 		
		self::set($key,$value,'main');
	}
	
	 
	public static function addMain($key,$value)
	{
		 		
		self::set($key,$value,'main');
	}
	
	 
	public static function setPage($key,$value, $page = '')
	{		
		if(!$page){
			$page = self::getMain('actual_page');
		}
		self::set('["'.$page.'"]["'.$key.'"]' ,$value,'page');
	}
	
	 
	public static function addPage($key,$value, $page = '')
	{		
		self::setPage($key,$value,$page);
	}
	
	 
	public static function setTemp($key,$value)
	{		
		 		
		self::set($key,$value,'test');
	}
	
	 
	public static function addTemp($key,$value)
	{		
		 
		self::set($key,$value,'test');		
	}

	 	
	
	 
	
	 
	public static function get($what)
	{
		$ret=false;
		$what=self::prepareWhat($what);
		
		 		$Mset=self::evalFixerIsset($_SESSION,self::prepareKeys(array('framework',APP,'main'),$what));
		if ($Mset) {
			 			$ret=self::evalFixerGet($_SESSION,self::prepareKeys(array('framework',APP,'main'),$what));
		}
		
		 		$Pset=self::evalFixerIsset($_SESSION,self::prepareKeys(array('framework',APP,'page'),$what));
		if ($Pset) {
			 			$ret=self::evalFixerGet($_SESSION,self::prepareKeys(array('framework',APP,'page'),$what));
		}
		 		$Tset=self::evalFixerIsset($_SESSION,self::prepareKeys(array('framework',APP,'temp'),$what));
		if ($Tset) {
			 			$ret=self::evalFixerGet($_SESSION,self::prepareKeys(array('framework',APP,'temp'),$what));
		}
		
		 		 		 		 		 		 		
		return $ret;
	}
	
	 
	public static function getMain($what)
	{		
		 		
		return self::getExact('main',$what);
	}
	
	
	 
	public static function getPage($what, $page = '')
	{	
		 		if(!$page){
			$page = self::getMain('actual_page');
		}
		return self::getExact('page','["'.$page.'"]["'.$what.'"]');
	}
	
	 
	public static function getTemp($what)
	{	
		 		
		return self::getExact('temp',$what);
	}
	
	 
	
	 
	public static function del($what,$where='')
	{			
		$what=self::prepareWhat($what);
		
		if ($where=='')
		{		
			 			self::evalFixerUnset($_SESSION,self::prepareKeys(array('framework',APP,'temp'),$what));
			 			self::evalFixerUnset($_SESSION,self::prepareKeys(array('framework',APP,'page'),$what));
			 			self::evalFixerUnset($_SESSION,self::prepareKeys(array('framework',APP,'main'),$what));
		}
		else
		{
			 			self::evalFixerUnset($_SESSION,self::prepareKeys(array('framework',APP,$where),$what));
		}
		
		 		 	}
	
	 
	public static function delMain($what)
	{	
		 		
		self::del($what,'main');
	}
	
	 
	public static function delPage($what)
	{		
		         $page = self::getMain('actual_page');
		self::del('["'.$page.'"]["'.$what.'"]','page');
	}
	
	 
	public static function delTemp($what)
	{		
		 		
		self::del($what,'temp');
	}			
	
	
	 
	private static function prepareWhat($what)
	{		
		if (substr_count($what,"[")==0) {$what="[".$what;}
		if (substr_count($what,"]")==0) {$what=$what."]";}
		$ret=str_replace(array('["','"]','[\'','\']','[',']'),array('[',']','[',']','[\'','\']'),$what);		
		return $ret;
	}
		
		
	 
	private static function getExact($func,$what)
	{	
		$func=strtolower($func);
		
		 		
		$what=self::prepareWhat($what);
		
		 
		$parts=explode('^',str_replace(array('\'][\'','\'][','][\'','][','[\'','\']','[',']'),array('^','^','^','^','','','',''),$what));
		 		if (defined('APP') && isset($_SESSION['framework'][APP][$func])) {
			$var=$_SESSION['framework'][APP][$func];
			$not=false;
			
			foreach($parts as $val)
			{
				if (isset($var[$val]))
				{
					$var=$var[$val];
				}
				else
				{
					$not=true;
				}
			}
			if (!$not)
			{
				$ret=$var;
			}
			else
			{
				$ret = array();
			}
		}
		else
		{
			$ret = array();
		}
		 
		
		 		 		
		 		 		 		
		return $ret;
	}	
	
	 	 	
	 
	 	 	 	 	 	
	 
	 	 	 	 	
	 
	 	 	 	 	
	 
	 	 	 	 	
	
	 
	 	 	  	  	  	  	  	  	  	 	  	  	  	 	 	

	 
	 	 	 	 	 	 	
	 	}

?>