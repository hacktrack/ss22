<?php  
class login
{
	private static $default=array(
		'language'=>'en',
		'root'=>'./'
	);
	
	public static function supported()
	{
		$data=self::parse_user_agent();
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
	
	public static function parse_user_agent( $u_agent = null ) {
		if( is_null($u_agent) ) {
			if( isset($_SERVER['HTTP_USER_AGENT']) ) {
				$u_agent = $_SERVER['HTTP_USER_AGENT'];
			} else {
				throw new \InvalidArgumentException('parse_user_agent requires a user agent');
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
	
	public static function sortLanguages($l)
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
	
	public static function translateLanguage($code)
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
	
	public static function getLanguages($translate=false,$active='en')
	{
		$langs=array();
		$d=opendir(trim(self::$default['root'],'/').'/client/languages/');
		while($f=readdir($d)){
			$langs[]=$f;
		}
		
		$langs=self::sortLanguages($langs);
		
		$languages=$langs;
		if($translate){
			$languages=array();
			foreach($langs as $val){
				$languages[]=array('name'=>self::translateLanguage($val),'code'=>$val,'active'=>$active==$val);
			}
		}
		
		
		return $languages;
	}
	
	public static function getLanguage($lang)
	{
		if(!in_array($lang,self::getLanguages())){
			$lang=self::$default['language'];
		}
		
		$lang_file=file_get_contents(trim(self::$default['root'],'/').'/client/languages/'.$lang.'/data.xml');
		$xml=(array)simplexml_load_string($lang_file);
		foreach($xml as &$val)
		{
			$val=(array)$val;
		}
		
		return $xml;
	}
	
	public static function translate($str,$lang)
	{
		$str=explode('::',$str);
		if(isset($str[1]) && isset($lang[$str[0]][$str[1]])){
			return $lang[$str[0]][$str[1]];
		}else{
			return "{".join('::',$str)."}";
		}
	}
	
	public static function sendGatewayAuthentication($settings)
	{
		$error=false;
		
		if(isset($_POST['action']) && $_POST['action']=='login')
		{
			$query=template('<iq format="text/xml" type="set"><query xmlns="admin:iq:rpc"><commandname>sendgatewayauthentication</commandname><commandparams><email>{email}</email></commandparams></query></iq>',array('email'=>$_POST['username']),true);
			
			$xData=icewarp_apitunnel($query, $_SERVER['REMOTE_ADDR']);
		
			 		
			 		
			$xoData=simplexml_load_string($xData);
			 			if(isset($xoData->attributes()->type))
			{
				if($xoData->attributes()->type == 'result'){
					
					if((int)$xoData->query->result==0){
						return 'authentication_unsuccessful';
					}
					
					return false;
				} elseif($xoData->attributes()->type == 'error'){
					$error=(string)$xoData->query->error->attributes()->uid;
				}
			}
			else
			{
				$error="unknown_error";
			}
		}
		
		 		
		return $error;
	}
	
	public static function handleLogin($settings)
	{
		$error=false;
		
		if((isset($_POST['action']) && $_POST['action']=='login') || (isset($_GET['from']) && isset($_GET['sid'])) || (isset($_GET['gauth']) && isset($_GET['sid']) && isset($_GET['hash'])))
		{
			 			if(isset($_GET['from']) && isset($_GET['sid'])){
				$query='<iq format="text/xml" type="set"><query xmlns="admin:iq:rpc"><commandname>authenticatewebclient</commandname><commandparams><webclientsessionid>'.$_GET['sid'].'</webclientsessionid></commandparams></query></iq>';
			}
			 			else
			{
				if(isset($_GET['gauth']) && isset($_GET['sid']) && isset($_GET['hash']))
				{
					$query=template('<iq format="text/xml" type="set" sid="{sid}"><query xmlns="admin:iq:rpc"><commandname>authenticategateway</commandname><commandparams><hash>{hash}</hash></commandparams></query></iq>',array(
						'sid'=>$_GET['sid'],
						'hash'=>$_GET['hash']
					),true);
					 				}
				else
				{
					if(isset($_POST['password_rsa']))
					{
						$query=template('<iq format="text/xml" type="set"><query xmlns="admin:iq:rpc"><commandname>authenticate</commandname><commandparams><authtype>1</authtype><email>{user}</email><digest>{digest}</digest><persistentlogin>{persistent}</persistentlogin></commandparams></query></iq>',array(
							'user'=>$_POST['username'],
							'digest'=>$_POST['password_rsa'],
							'persistent'=>(isset($_POST['remember'])&&$_POST['remember']=='1'?'1':'0')
						),true);
					}
					else
					{
						$query=template('<iq format="text/xml" type="set"><query xmlns="admin:iq:rpc"><commandname>authenticate</commandname><commandparams><authtype>0</authtype><email>{user}</email><password>{password}</password><persistentlogin>{persistent}</persistentlogin></commandparams></query></iq>',array(
							'user'=>$_POST['username'],
							'password'=>$_POST['password'],
							'persistent'=>(isset($_POST['remember'])&&$_POST['remember']=='1'?'1':'0')
						),true);
					}
				}
			}
			
			
			$xData=icewarp_apitunnel($query, $_SERVER['REMOTE_ADDR']);
		
			 		
			 		
			$xoData=simplexml_load_string($xData);
			 			if(isset($xoData->attributes()->type))
			{
				if($xoData->attributes()->type == 'result'){
					
					if((int)$xoData->query->result==0){
						return 'login_unsuccessful';
					}
					
					$sid=$xoData->attributes()->sid;
					$cookie = new slToolsCookie();
					$cookie->setcookie('waid',$sid.'&'.(isset($_POST['remember'])&&$_POST['remember']=='1'?'1':'0'));
					header('Location: ./');
					die();
				} elseif($xoData->attributes()->type == 'error'){
					$error=(string)$xoData->query->error->attributes()->uid;
				}
			}
			else
			{
				$error="unknown_error";
			}
		}
		
		 		
		return $error;
	}
	
	private static function resources($webmail=false){
		$data=array();
		$domain=$_SERVER['HTTP_HOST'];
		
		try
		{
		
			$query=template('<iq type="get" format="application/xml">
				<query xmlns="admin:iq:rpc">
					<commandname>'.($webmail?'getwebmailresources':'getadminresources').'</commandname>
					<commandparams>
						<resources>
							<item>
								<name>layout_settings</name>
							</item>
							<item>
								<name>restrictions</name>
							</item>
						</resources>
					<selector>{DOMAIN}</selector>
					<level>1</level>
					</commandparams>
				</query>
			</iq>',array(
				'DOMAIN'=>$domain
			),true);
			
			$xData=icewarp_apitunnel($query, $_SERVER['REMOTE_ADDR']);
			$xml=simplexml_load_string($xData);
			
			 			 			foreach($xml->query->result->list->item as $key=>$val)
			{
				 				if(!isset($data[strtolower($val->name)])){$data[strtolower($val->name)]=array();}
				foreach($val->list->item->list->item as $key2=>$val2)
				{
					$data[strtolower($val->name)][strtolower($val2->name)]=(string)$val2->value;
					 				}
			}
			
			 		}
		catch(Exception $e)
		{
			
		}
		
		return $data;
	}
	
	public static function settings($settings)
	{
		$query=template('<iq format="text/xml" type="set"><query xmlns="admin:iq:rpc"><commandname>getserverproperties</commandname><commandparams><serverpropertylist><item><propname>c_accounts_policies_login_loginsettings</propname></item><item><propname>c_webmail_url</propname></item><item><propname>c_system_server_language</propname></item></serverpropertylist></commandparams></query></iq>',array(),true);
		$xData=icewarp_apitunnel($query, $_SERVER['REMOTE_ADDR']);
		 		$xml=simplexml_load_string($xData);
		 		try
		{
			$items=(array)$xml->query->result;
			
			 			
			$items=$items['item'];
			
			$data=array();
			foreach($items as $val)
			{
				$key=(string)$val->apiproperty->propname;
				$value=(string)$val->propertyval->val;
				$data[$key]=$value;
			}
			
			if(isset($data['c_webmail_url'])){
				$settings['webmail_url']=trim($data['c_webmail_url'],'/').'/';
			}
			if(isset($data['c_accounts_policies_login_loginsettings'])){
				$settings['login_type']=intval($data['c_accounts_policies_login_loginsettings']);
			}
			if(isset($data['c_system_server_language'])){
				$settings['default_language']=($data['c_system_server_language']?$data['c_system_server_language']:'en');
			}
		}
		catch(Exception $e)
		{
			
		}
		
		 		$settings['resources']=self::resources();
		$settings['resources_webmail']=self::resources(true);
		 		
		return $settings;
	}
	
	public static function getAuthChallange()
	{
		$data=array();
		
		$query=template('<iq><query xmlns="admin:iq:rpc"><commandname>getauthchallenge</commandname><commandparams><authtype>1</authtype></commandparams></query></iq>',array(),true);
		$xData=icewarp_apitunnel($query, $_SERVER['REMOTE_ADDR']);
		 		$xml=simplexml_load_string($xData);
		 		try
		{
			$items=(array)$xml->query->result;
			
			foreach($items as $key=>$val)
			{
				$value=(string)$val;
				$data[$key]=$value;
			}
		}
		catch(Exception $e)
		{
			
		}
		
		 		
		return $data;
	}
}
?>