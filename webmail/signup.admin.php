<?php             

require_once('signup.php');

class Signup extends SignupAncestor 
{
	public $webadmin_template;
	public $sid;
	public $logged;

	protected static $default=array(
		'language'=>'en',
		'root'=>'./'
	);
	
	public function __construct()
	{
		$this->api = IceWarpAPI::instance(defined('APP_MAINTENANCE_IDENTITY')?APP_MAINTENANCE_IDENTITY:'Signup');
		$this->cacheWorkaround();
		$this->defines();
		$this->cookie = new slToolsCookie();
	}
		
	public static function isSupportedBrowser()
	{
		$data = self::parseUserAgent();
		if(substr_count($data['version'],'.')>0){
			$data['version']=explode('.',$data['version']);
			$data['version']=$data['version'][0].'.'.$data['version'][1];
		}
		
		if(isset($_GET['revealbrowserinfo'])){echo "<pre>".print_r($data,true)."</pre>";}
		
		if(strtolower($data['browser'])=='opera next'){$data['browser']='Opera';}
		if(strtolower($data['platform'])=='symbian'){return false;}
		
		$supported=array(
			'firefox'=>28.0,
			'chrome'=>30.0,
			'msie'=>10.0,
			'safari'=>7,
			'opera'=>17,
			'iemobile'=>10.1	 		);
		
		if(isset($data['browser']) && isset($data['version'])){
			
			if(isset($supported[strtolower($data['browser'])])){
				if(floatval($data['version'])<$supported[strtolower($data['browser'])]){
					return false;
				}
			}
		}
		
		return true;
	}
	
	protected static function parseUserAgent( $u_agent = null ) {
		if( is_null($u_agent) ) {
			if( isset($_SERVER['HTTP_USER_AGENT']) ) {
				$u_agent = $_SERVER['HTTP_USER_AGENT'];
			} else {
				throw new InvalidArgumentException('parseUserAgent requires a user agent');
			}
		}
		$platform = null;
		$browser  = null;
		$version  = null;
		$empty = array( 'platform' => $platform, 'browser' => $browser, 'version' => $version );
		if( !$u_agent ) return $empty;
		if( preg_match('/\((.*?)\)/im', $u_agent, $parent_matches) ) {
			preg_match_all('/(?P<platform>BB\d+;|Symbian|Android|CrOS|Tizen|iPhone|iPad|Linux|Macintosh|Windows(\ Phone)?|Silk|linux-gnu|BlackBerry|PlayBook|(New\ )?Nintendo\ (WiiU?|3DS)|Xbox(\ One)?)
					(?:\\/ [^;]*)?
					(?:;|$)/imx', $parent_matches[1], $result, PREG_PATTERN_ORDER);
			$priority           = array( 'Xbox One', 'Xbox', 'Windows Phone', 'Tizen', 'Android' );
			$result['platform'] = array_unique($result['platform']);
			if( count($result['platform']) > 1 ) {
				if( $keys = array_intersect($priority, $result['platform']) ) {
					$platform = reset($keys);
				} else {
					$platform = $result['platform'][0];
				}
			} elseif( isset($result['platform'][0]) ) {
				$platform = $result['platform'][0];
			}
		}
		if( $platform == 'linux-gnu' ) {
			$platform = 'Linux';
		} elseif( $platform == 'CrOS' ) {
			$platform = 'Chrome OS';
		}
		preg_match_all('%(?P<browser>Camino|Kindle(\ Fire\ Build)?|Firefox|Iceweasel|Safari|MSIE|Trident|AppleWebKit|TizenBrowser|Chrome|
				Vivaldi|IEMobile|Opera|OPR|Silk|Midori|Edge|CriOS|
				Baiduspider|Googlebot|YandexBot|bingbot|Lynx|Version|Wget|curl|
				NintendoBrowser|PLAYSTATION\ (\d|Vita)+)
				(?:\)?;?)
				(?:(?:[:/ ])(?P<version>[0-9A-Z.]+)|/(?:[A-Z]*))%ix',
			$u_agent, $result, PREG_PATTERN_ORDER);
		 		if( !isset($result['browser'][0]) || !isset($result['version'][0]) ) {
			if( !$platform && preg_match('%^(?!Mozilla)(?P<browser>[A-Z0-9\-]+)(/(?P<version>[0-9A-Z.]+))?([;| ]\ ?.*)?$%ix', $u_agent, $result)
			) {
				return array( 'platform' => null, 'browser' => $result['browser'], 'version' => isset($result['version']) ? $result['version'] ?: null : null );
			}
			return $empty;
		}
		if( preg_match('/rv:(?P<version>[0-9A-Z.]+)/si', $u_agent, $rv_result) ) {
			$rv_result = $rv_result['version'];
		}
		$browser = $result['browser'][0];
		$version = $result['version'][0];
		$find = function ( $search, &$key ) use ( $result ) {
			$xkey = array_search(strtolower($search), array_map('strtolower', $result['browser']));
			if( $xkey !== false ) {
				$key = $xkey;
				return true;
			}
			return false;
		};
		$key  = 0;
		$ekey = 0;
		if( $browser == 'Iceweasel' ) {
			$browser = 'Firefox';
		} elseif( $find('Playstation Vita', $key) ) {
			$platform = 'PlayStation Vita';
			$browser  = 'Browser';
		} elseif( $find('Kindle Fire Build', $key) || $find('Silk', $key) ) {
			$browser  = $result['browser'][$key] == 'Silk' ? 'Silk' : 'Kindle';
			$platform = 'Kindle Fire';
			if( !($version = $result['version'][$key]) || !is_numeric($version[0]) ) {
				$version = $result['version'][array_search('Version', $result['browser'])];
			}
		} elseif( $find('NintendoBrowser', $key) || $platform == 'Nintendo 3DS' ) {
			$browser = 'NintendoBrowser';
			$version = $result['version'][$key];
		} elseif( $find('Kindle', $key) ) {
			$browser  = $result['browser'][$key];
			$platform = 'Kindle';
			$version  = $result['version'][$key];
		} elseif( $find('OPR', $key) ) {
			$browser = 'Opera Next';
			$version = $result['version'][$key];
		} elseif( $find('Opera', $key) ) {
			$browser = 'Opera';
			$find('Version', $key);
			$version = $result['version'][$key];
		} elseif( $find('Midori', $key) ) {
			$browser = 'Midori';
			$version = $result['version'][$key];
		} elseif( $browser == 'MSIE' || ($rv_result && $find('Trident', $key)) || $find('Edge', $ekey) ) {
			$browser = 'MSIE';
			if( $find('IEMobile', $key) ) {
				$browser = 'IEMobile';
				$version = $result['version'][$key];
			} elseif( $ekey ) {
				$version = $result['version'][$ekey];
			} else {
				$version = $rv_result ?: $result['version'][$key];
			}
		} elseif( $find('Vivaldi', $key) ) {
			$browser = 'Vivaldi';
			$version = $result['version'][$key];
		} elseif( $find('Chrome', $key) || $find('CriOS', $key) ) {
			$browser = 'Chrome';
			$version = $result['version'][$key];
		} elseif( $browser == 'AppleWebKit' ) {
			if( ($platform == 'Android' && !($key = 0)) ) {
				$browser = 'Android Browser';
			} elseif( strpos($platform, 'BB') === 0 ) {
				$browser  = 'BlackBerry Browser';
				$platform = 'BlackBerry';
			} elseif( $platform == 'BlackBerry' || $platform == 'PlayBook' ) {
				$browser = 'BlackBerry Browser';
			} elseif( $find('Safari', $key) ) {
				$browser = 'Safari';
			} elseif( $find('TizenBrowser', $key) ) {
				$browser = 'TizenBrowser';
			}
			$find('Version', $key);
			$version = $result['version'][$key];
		} elseif( $key = preg_grep('/playstation \d/i', array_map('strtolower', $result['browser'])) ) {
			$key = reset($key);
			$platform = 'PlayStation ' . preg_replace('/[^\d]/i', '', $key);
			$browser  = 'NetFront';
		}
		return array( 'platform' => $platform ?: null, 'browser' => $browser ?: null, 'version' => $version ?: null );
	}
	
	protected function getTemplate()
	{
		$this->cookie->deleteAll('admin');
		if(Signup::isSupportedBrowser()){
			if(isset($_GET['*']) && isset($_COOKIE['waid'])){
				unset($_COOKIE['waid']);
			}
			 			if(isset($_REQUEST['atoken'])){
				$response = icewarp_apitunnel('<iq><query xmlns="admin:iq:rpc"><commandname>authenticatetoken</commandname><commandparams><token>'.$_REQUEST['atoken'].'</token></commandparams></query></iq>',$_SERVER['REMOTE_ADDR']);
				$xml = slToolsXML::loadString($response);
				 				$this->sid = strval($xml['sid']);
				$this->logged = true;
				$this->cookie->setcookie('waid',$this->sid."&".(isset($_GET['remember'])?1:0),false);
				$this->cookie->setcookie('wall',$_GET['language']?$_GET['language']:'en',false);
				if(isset($_GET['referer'])||isset($_GET['ref'])){
					$this->cookie->setcookie('ware',(isset($_GET['referer'])?$_GET['referer']:$_GET['ref']),false);
				}
				header("Location: ./");
				die();
			}			
			
			 			if(isset($_GET['gauth']) && isset($_GET['sid']) && isset($_GET['hash'])){
                $response = icewarp_apitunnel('<iq sid="'.$_GET['sid'].'"><query xmlns="admin:iq:rpc"><commandname>authenticategateway</commandname><commandparams><hash>'.$_GET['hash'].'</hash></commandparams></query></iq>',$_SERVER['REMOTE_ADDR']);
				$xml = slToolsXML::loadString($response);
				$this->sid = strval($xml['sid']);
				$this->logged = true;			 
				$this->cookie->setcookie('waid',$this->sid."&".(isset($_GET['remember'])?1:0),false);
				$this->cookie->setcookie('wall',$_GET['language']?$_GET['language']:'en',false);
				if(isset($_GET['referer'])||isset($_GET['ref'])){
					$this->cookie->setcookie('ware',(isset($_GET['referer'])?$_GET['referer']:$_GET['ref']),false);
				}
				header("Location: ./");
				die();
			}	
			
			 			if(isset($_GET['sid']) && !isset($_GET['from'])){
				$this->cookie->setcookie('waid',$_GET['sid']."&".(isset($_GET['remember'])?1:0),false);
				$this->cookie->setcookie('wall',$_GET['language']?$_GET['language']:'en',false);
				if(isset($_GET['referer'])||isset($_GET['ref'])){
					$this->cookie->setcookie('ware',(isset($_GET['referer'])?$_GET['referer']:$_GET['ref']),false);
				}
				header("Location: ./");
				die();
			}

			 			if(isset($_GET['sid']) && isset($_GET['from'])){
                $response = icewarp_apitunnel('<iq><query xmlns="admin:iq:rpc"><commandname>authenticatewebclient</commandname><commandparams><webclientsessionid>'.$_REQUEST['sid'].'</webclientsessionid></commandparams></query></iq>',$_SERVER['REMOTE_ADDR']);
				$xml = slToolsXML::loadString($response);
				 				$this->sid = strval($xml['sid']);
				$this->logged = true;			 
				$this->cookie->setcookie('waid',$this->sid."&".(isset($_GET['remember'])?1:0),false);
				$this->cookie->setcookie('wall',$_GET['language']?$_GET['language']:'en',false);
				if(isset($_GET['referer'])||isset($_GET['ref'])){
					$this->cookie->setcookie('ware',(isset($_GET['referer'])?$_GET['referer']:$_GET['ref']),false);
				}
				header("Location: ./");
				die();
			}	
			
			 			if(isset($_COOKIE['waid']) && $_COOKIE['waid']!='0' && $_COOKIE['waid']!=''){
				if($_COOKIE['waid']!='1'){
					$sid=explode('&',$_COOKIE['waid']);
					$remember=(isset($sid[1])&&$sid[1]=='1'?true:false);
					$sid=$sid[0];
			
					$this->cookie->setcookie('waid','1',($remember?time()+(86400*365):false));
				}
				$this->logged=true;
				$this->sid = $sid;
				$this->webadmin_template = true;
			}
			 
			if($this->webadmin_template){
				$template=('client/skins/default/login/templates/login.tpl');
			}else{
				$template=('templates/pc.tpl');
			}
		}else{
			$template=('client/skins/default/login/templates/login-old.tpl');
		}
		return $template;
	}
	
	protected function getTemplateData()
	{
		$this->templateData = array();
		$this->templateData['sid'] = $this->sid;
		$this->templateData['logged'] = $this->logged;
		$this->templateData['base'] = $this->base;
		$this->templateData['base_login'] = $this->base_login;
		$this->templateData['self'] = $this->self;
		$this->templateData['client'] = CLIENT;
		$l = $_COOKIE['wall']?$_COOKIE['wall']:'en';
		if($this->translateLanguage($l)==$l){
			$l = 'en';
		}
		$active_lang=array('code'=>$l,'name'=>$this->translateLanguage($l));
		$this->templateData['lang'] = $this->getLanguage($l);
		$this->templateData['languages'] = $this->getLanguages(true,$active_lang['code']);
		$this->templateData['active_language'] = $active_lang;
		return $this->templateData;
	}
	
	protected function sortLanguages($l)
	{
		$languages=array("en","ar","bg","cs","dk","de","el","es","la","fr","kr","hu","jp","nl","no","is","it","pl","pt","ru","sk","fi","se","th","tr",'si');
		
		$ret=array();
		foreach($languages as $val) {
			if(in_array($val,$l)) {
				$ret[]=$val;
			}
		}
		
		return $ret;
	}
	
	protected function translateLanguage($code)
	{
		$languages=array(
				"en"=>"English" ,
				"ar"=>"العربية" ,
				"cs"=>"Česky" ,
				"dk"=>"Dansk" ,
				"de"=>"Deutsch" ,
				"el"=>"ελληνικά" ,
				"es"=>"Español" ,
				"la"=>"Español - Sudamérica" ,
				"fr"=>"Français" ,
				"hr"=>"Hrvatski",
				"bg"=>"Български",
				"kr"=>"한국어" ,
				"lv"=>"Latvias",
				"hu"=>"Magyar" ,
				"jp"=>"日本語" ,
				"nl"=>"Nederlands" ,
				"no"=>"Norsk" ,
				"is"=>"Íslenska" ,
				"it"=>"Italiano" ,
				"pl"=>"Polski" ,
				"pt"=>"Português Brasileiro" ,
				"ru"=>"Русский" ,
				"sk"=>"Slovenčina" ,
				"fi"=>"Suomi" ,
				"se"=>"Svenska" ,
				"th"=>"ภาษาไทย" ,
				"tr"=>"Türkçe",
				"si"=>"Slovenščina"
		);
		if (isset($languages[$code])) {
			return $languages[$code];
		}
		return $code;
	}
	
	public function getLanguages($translate=false,$active='en')
	{
		$langs=array();
		$d=opendir(trim(self::$default['root'],'/').'/client/languages/');
		while($f=readdir($d)){
			$langs[]=$f;
		}
		
		$langs=$this->sortLanguages($langs);
		
		$languages=$langs;
		if($translate){
			$languages=array();
			foreach($langs as $val){
				$languages[]=array('name'=>self::translateLanguage($val),'code'=>$val,'active'=>$active==$val);
			}
		}
		
		
		return $languages;
	}
	
	protected function getLanguage(&$lang)
	{
		if(!in_array($lang,self::getLanguages())){
			$lang=self::$default['language'];
		}
		
		$lang_file = file_get_contents(trim(self::$default['root'], '/') . '/client/languages/' . $lang . '/data.xml');
		$output = array();
		$xml = (array) simplexml_load_string($lang_file);
		foreach($xml as $key => $val) {
			$output[$key] = (array) $val;
		}
		return $output;
	}
	
	protected function translate($str,$lang)
	{
		$str=explode('::',$str);
		if(isset($str[1]) && isset($lang[$str[0]][$str[1]])){
			return $lang[$str[0]][$str[1]];
		}else{
			return "{".join('::',$str)."}";
		}
	}

}


 
 


?>
