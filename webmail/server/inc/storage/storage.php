<?php
define('STORAGE_XML_MAX_LEVEL_DEPTH',4);

define('SETTINGS_ELM','settings');
define('RET_STRING',0x0);
define('RET_ARRAY',0x1);


 

class StorageCache
{
	public $data;
	public $refresh;

	public function __construct()
	{
		$this->clear();
	}
	
	public function set($data)
	{
		$this->data = $data;
		$this->refresh = false;
	}
	
	public function get()
	{
		return $this->data;
	}
	
	public function clear()
	{
		$this->refresh = true;
		$this->data = false;
	}
}




class Storage
{
	static public $rightType = array(0=>'useraccess',1=>false,2=>'domainadminaccess');
	static public $language;
	static public $cache;
	static $signatureTranslate = array(
		'firstname'=>'ITMFIRSTNAME',
		'middlename'=>'ITMMIDDLENAME',
		'surname'=>'ITMSURNAME',
		'displayname'=>'ITMCLASSIFYAS',
		'nickname'=>'ITMNICKNAME',
		'title'=>'ITMTITLE',
		'suffix'=>'ITMSUFFIX',
		'email1'=>'LCTEMAIL1',
		'email2'=>'LCTEMAIL2',
		'email3'=>'LCTEMAIL3',
		'im'=>'LCTIM',
		'freebusy'=>'ITMINTERNETFREEBUSY',
		'company'=>'ITMCOMPANY',
		'job'=>'ITMJOBTITLE',
		'profession'=>'ITMPROFESSION',
		'department'=>'ITMDEPARTMENT',
		'assistant'=>'ITMASSISTANTNAME',
		'manager'=>'ITMMANAGERNAME',
		'homepage'=>'LCTWEBPAGE',
		'street'=>'LCTSTREET',
		'city'=>'LCTCITY',
		'state'=>'LCTSTATE',
		'zip'=>'LCTZIP',
		'country'=>'LCTCOUNTRY',
		'businesshomepage'=>'BUSINESSLCTWEBPAGE',
		'businessstreet'=>'BUSINESSLCTSTREET',
		'businesscity'=>'BUSINESSLCTCITY',
		'businessstate'=>'BUSINESSLCTSTATE',
		'businesszip'=>'BUSINESSLCTZIP',
		'businesscountry'=>'BUSINESSLCTCOUNTRY',
		'phonehome'=>'LCTPHNHOME1',
		'phonehome2'=>'LCTPHNHOME2',
		'phoneassistant'=>'LCTPHNASSISTANT',
		'phonework'=>'LCTPHNWORK1',
		'phonework2'=>'LCTPHNWORK2',
		'faxhome'=>'LCTPHNFAXHOME',
		'faxwork'=>'LCTPHNFAXWORK',
		'faxother'=>'LCTPHNOTHERFAX',
		'phonecallback'=>'LCTPHNCALLBACK',
		'phonecompany'=>'LCTPHNCOMPANY',
		'phonecar'=>'LCTPHNCAR',
		'phoneisdn'=>'LCTPHNISDN',
		'phonemobile'=>'LCTPHNMOBILE',
		'phoneother'=>'LCTPHNOTHER',
		'phonepager'=>'LCTPHNPAGER',
		'phoneprimary'=>'LCTPHNPRIMARY',
		'phoneradio'=>'LCTPHNRADIO',
		'phonetelex'=>'LCTPHNTELEX',
		'phonehearing'=>'LCTPHNHEARING',
		'phonesip'=>'',
		'fullname'=>''
	);

	static public function getLicenseType()
	{
		$api=new IceWarpAPI();
		$licenseType='full';
		$license=$api->GetProperty('c_license_xml');
		 		@$licenseData=simplexml_load_string($license);
		if ($licenseData->info->license->restrictions->item)
		{
			$items = $licenseData->info->license->restrictions;
			foreach($items->item as $val)
			{
				if (strval($val)=='WEBCLIENTPRO') {$licenseType='simple';}
			}
		}
		 		return $licenseType;
	}
	
	static public function mergeResource($sResourceName,$data,$merge,$restriction,$set = false,$righttype = 'useraccess',$sPP = 'private',$aAsD = false)
	{
		if(!$data){
			$data = [];
		}

		 		switch($sResourceName)
		{
			case 'groups':
				$data['@childnodes']['item'] = $data['@childnodes']['item'] ?? [];
				$merge['@childnodes']['item'] = $merge['@childnodes']['item'] ?? [];
				$data['@childnodes']['item'] = slToolsPHP::array_merge($data['@childnodes']['item'],$merge['@childnodes']['item']);
				break;
			default:
				 				if($merge['@childnodes']['item']) foreach($merge['@childnodes']['item'] as $item => $itemVal){
				 					if (!$itemVal)	continue;
					@$restriction = $restriction['@childnodes']['item'][$item];
					$data['@childnodes']['item'][$item] = self::mergeItem($data['@childnodes']['item'][$item],
							$merge['@childnodes']['item'][$item],
							$restriction,
							$set,
							$righttype,
							$aAsD);
				}
				break;
		}
		
		return $data;
	}
	
	static public function mergeItem($data,$merge,$restriction,$set = false,$righttype = 'useraccess',$aAsD = false)
	{
		  		if ($merge['@childnodes']) foreach($merge['@childnodes'] as $keyIndex => $keyValue){
 			$count = 0;
			
			if (is_countable($data['@childnodes'][$keyIndex]) && count($data['@childnodes'][$keyIndex])>1) throw new Exc('settings_duplicity');
			
			if ($righttype && isset($restriction['@childnodes'][$keyIndex][0]['@attributes'][$righttype]))
				$keyRights = $restriction['@childnodes'][$keyIndex][0]['@attributes'][$righttype];
			else 
				$keyRights = 'full';
			
			  			if(!$set){
				switch($keyIndex){
	 				case 'logo_uid':
	 				case 'login_background_uid':
	 					@$data['@childnodes'][$keyIndex][$count]['@value'] = $data['@childnodes'][$keyIndex][$count]['@value'].$merge['@childnodes'][$keyIndex][$count]['@value'];
	 					break;
 				}
 			}
				
			switch($keyRights)
			{
				 				case 'view':
					if ($set){
						unset($data['@childnodes'][$keyIndex][$count]);
						if($aAsD){
							if (!isset($keyValue[0]['@value']))
								unset($data['@childnodes'][$keyIndex]);
							else{
								$data['@childnodes'][$keyIndex][0] = $keyValue[0];
							}
													
						}						
					}else{
						 						if(!isset($data['@childnodes'][$keyIndex][$count]['@attributes']['admin'])){
							$data['@childnodes'][$keyIndex][$count]['@value'] = $merge['@childnodes'][$keyIndex][$count]['@value'];
						}
						$data['@childnodes'][$keyIndex][$count]['@attributes']['access'] = 'view';
						
						if ($merge['@childnodes'][$keyIndex][$count]['@attributes']['useraccess']){
							$data['@childnodes'][$keyIndex][$count]['@attributes']['useraccess'] = $merge['@childnodes'][$keyIndex][$count]['@attributes']['useraccess'];
							$data['@childnodes'][$keyIndex][$count]['@attributes']['access'] = $merge['@childnodes'][$keyIndex][$count]['@attributes']['useraccess'];
						}
						unset($data['@childnodes'][$keyIndex][$count]['@attributes'][$righttype]);
						if($data['@childnodes'][$keyIndex][$count]['@attributes']['rights'] || $aAsD){
							$data['@childnodes'][$keyIndex][$count]['@attributes']['access'] = 'full';
						}
					}
					break;
				 				case 'none':
					$data['@childnodes'][$keyIndex][$count]['@attributes']['access'] = 'none';
					if (!$set){

						unset($data['@childnodes'][$keyIndex][$count]['@attributes']['useraccess']);
						unset($data['@childnodes'][$keyIndex][$count]['@attributes']['domainadminaccess']);
					} else {
						unset($data['@childnodes'][$keyIndex][$count]);
					}
					break;
				 				default:
					if (!$set){
					 
						if (!isset($data['@childnodes'][$keyIndex][$count]['@value'])){
						  	if($keyIndex=='disable_gw_types' && isset($data['@childnodes'][$keyIndex][$count])) break;
						    if(isset($merge['@childnodes'][$keyIndex][$count]['@value'])){
								$data['@childnodes'][$keyIndex][$count]['@value'] = $merge['@childnodes'][$keyIndex][$count]['@value'];
							}
						} 
						 						if(isset($merge['@childnodes'][$keyIndex][$count]['@attributes']['useraccess']))
							if(($merge['@childnodes'][$keyIndex][$count]['@attributes']['domainadminaccess']!='full'
							|| !isset($merge['@childnodes'][$keyIndex][$count]['@attributes']['domainadminaccess']))
							||!isset($data['@childnodes'][$keyIndex][$count]['@attributes']['useraccess']))
								$data['@childnodes'][$keyIndex][$count]['@attributes']['useraccess'] = $merge['@childnodes'][$keyIndex][$count]['@attributes']['useraccess'];
						unset($data['@childnodes'][$keyIndex][$count]['@attributes'][$righttype]);
					}else{
						if ($righttype=='access'){
							unset($keyValue[0]['@attributes']);
							if (!isset($keyValue[0]['@value']))
								unset($data['@childnodes'][$keyIndex]);
							else{
								$data['@childnodes'][$keyIndex][0] = $keyValue[0];
							}
						}
					}
					break;
			}
 			$count++; 
		}
		return $data;
	}
	
	static public function getDomainDefaults($resource = false,$domain = false)
	{
		if (!$domain) $domain = ($_SESSION['SLAVE_DOMAIN'] ?? false) ? $_SESSION['SLAVE_DOMAIN'] : $_SESSION['DOMAIN'];
		$path = WM_CONFIGPATH.$domain.'/';
		$aArray = self::getArray($path,$resource);
		return $aArray;
	}
	
	static public function setDomainDefaultsStr($xmlString,$sResourceName,$domain = false)
	{
		if (!$domain) $domain = $_SESSION['DOMAIN'];
		$path = WM_CONFIGPATH.$domain.'/';
		$file = SETTINGS_FILE.storeageext;
		
		if (!file_exists($path)){
			slSystem::import('tools/filesystem');
			if (!slToolsFilesystem::mkdir_r($path, 0777, true))
				throw new Exc('settings_get_domain_file',$path);
		     	}
    	log_buffer("Storage::setDomainDefaultsStr() : slToolsIcewarp::iw_file_put_contents(".$path.$file.")","EXTENDED");
    	if(isset(self::$cache[$path.$file])){
    		self::$cache[$path.$file]->clear();
    	}
    	slSystem::import('tools/icewarp');
		if (!@slToolsIcewarp::iw_file_put_contents($path.$file,$xmlString))
			throw new Exc('settings_domain_set',$path.$file);
		
		if(isset(self::$cache[$path.$file])){
			self::$cache[$path.$file]->clear();
		}
	}

	static public function getUserData($resource = false,$path = false)
	{
		if(isset($_SESSION) || $path){
			if(!$path){
				$path = $_SESSION['USERDIR'];
			}
			$result = self::getArray($path,$resource);
		}else{
			$result = false;
		}
		return $result;
	}

	static public function setUserDataStr($xmlString,$sResourceName,$userdir = false)
	{
		if(!$userdir){
			$userdir = $_SESSION['USERDIR'];
		}
		$path = $userdir.SETTINGS_FOLDER;
		$file = SETTINGS_FILE.storeageext;

	    if (!is_dir($userdir.SETTINGS_FOLDER)){
	    	slSystem::import('tools/filesystem');
	      	slToolsFilesystem::mkdir_r($userdir.SETTINGS_FOLDER, 0777, true);
		}
			if($sResourceName=='cookie_settings')
				$file = COOKIE_FILE.storeageext;
	
	    	
	    log_buffer("Storage::setUserDataStr() : slToolsIcewarp::iw_file_put_contents(".$path.$file."):".$xmlString,"EXTENDED");
	    slSystem::import('tools/icewarp');
	    if(!@slToolsIcewarp::iw_file_put_contents($path.$file,$xmlString))
				throw new Exc('settings_user_set',$path.$file);
		if(isset(self::$cache[$path.$file])){
			self::$cache[$path.$file]->clear();
		}
	}

	static public function getDefaults($resource = false)
	{
		$path = isset($_SESSION['WMCONFIGPATH'])?$_SESSION['WMCONFIGPATH']:WM_CONFIGPATH;

		$oDOM = self::getArray($path,$resource);

		return $oDOM;
	}

	static public function setDefaultsStr($xmlString,$sResourceName)
	{
		$path = $_SESSION['WMCONFIGPATH']?$_SESSION['WMCONFIGPATH']:WM_CONFIGPATH;
		$file = SETTINGS_FILE.storeageext;
		
		if ($sResourceName=='cookie_settings')
			$file = COOKIE_FILE.storeageext;
			
		if (!file_exists($path)){
			slSystem::import('tools/filesystem');
			if (!slToolsFilesystem::mkdir_r($path, 0777, true))
				throw new Exc('settings_public_set',$path);
		}
		log_buffer("Storage::setDefaultsStr() : slToolsIcewarp::iw_file_put_contents(".$path.$file.")","EXTENDED");
    	slSystem::import('tools/icewarp');
    	if (!@slToolsIcewarp::iw_file_put_contents($path.$file,$xmlString))
			throw new Exc('settings_public_set',$path.$file);
    	if(isset(self::$cache[$path.$file])){
    		self::$cache[$path.$file]->clear();
    	}
	
	}

	static public function getRestrictions($resource = false)
	{
		$path = $_SESSION['WMCONFIGPATH']?$_SESSION['WMCONFIGPATH']:WM_CONFIGPATH;
		$oDOM = self::getArray($path,$resource);

		return $oDOM;
	}

	static private function getDOM($path,$resource)
	{
		$file = $resource.storeageext;

		if (!file_exists($path.$file))
			return false;

		log_buffer("Storage::getDOM() DOMXML::open(".$path.$file.");","EXTENDED");
		try{
			slSystem::import('tools/dom');
			@$oDOM = slToolsDOM::open($path.$file,true);
		}catch(Exc $e){
			$loaderState = libxml_disable_entity_loader(false);
			$loaderState = $loaderState?'true':'false';
			log_buffer("Storage::getDOM() - Corrupted file[entity_loader:".$loaderState."]:".$path.$file,"EXTENDED");
			throw new Exc('storage_get_dom');
		}
		return $oDOM;
	}

	static public function getArray($path,$resource = false,$sfile = SETTINGS_FILE)
	{
		$loadFailed = null;
		$aArray = false;

		$file = $sfile . storeageext;
		if ($resource == 'cookie_settings') {
			$file = COOKIE_FILE . storeageext;
		}


		if ($resource == 'global_settings') $file = GLOBAL_FILE . storeageext;
		  
      
      if ($resource=='spellchecker_languages')
				$file = SPELLCHECKER_FILE.storeageext;

		 		 		
		if (isset($_SESSION['USERDIR']) && ($path == $_SESSION['USERDIR']))
			$path.=SETTINGS_FOLDER;

		if (!file_exists($path.$file)){
			log_buffer("Storage::getArray() ~ File does not exist: ".$path.$file,"EXTENDED");
			$load = false;
			if($file==COOKIE_FILE.storeageext){
				 				if(file_exists(DEFAULT_COOKIE_FILE)){
					log_buffer("Storage::getArray() CREATING DEFAULT COOKIE FILE","EXTENDED");
					if(!is_dir($path)){
						slSystem::import('tools/filesystem');
						slToolsFilesystem::mkdir_r($path, 0777, true);
					}
					$default_content = file_get_contents(DEFAULT_COOKIE_FILE);
					$default_content = str_replace('%%ACCOUNT_ID%%',$_SESSION['EMAIL'],$default_content);
					$default_content = str_replace('<cookie_settings>','<cookie_settings version="12">',$default_content);
					slSystem::import('tools/icewarp');
					slToolsIcewarp::iw_file_put_contents($path.$file,$default_content);
					$load = true;
				}
			}
			if($file==SETTINGS_FILE.storeageext && $path==$_SESSION['USERDIR']){
				 				if(file_exists(DEFAULT_SETTINGS_FILE)){
					log_buffer("Storage::getArray() CREATING DEFAULT SETTINGS FILE","EXTENDED");
					if(!is_dir($path)){
						slSystem::import('tools/filesystem');
						 						slToolsIcewarp::mkdir_r($path, 0777, true);
					}
					$default_content = file_get_contents(DEFAULT_SETTINGS_FILE);
					$default_content = str_replace('%%ACCOUNT_ID%%',$_SESSION['EMAIL'],$default_content);
					slSystem::import('tools/icewarp');
					slToolsIcewarp::iw_file_put_contents($path.$file,$default_content);
					$load = true;
				}
			}
			if(!$load){
				return false;
			}
		}
		if(!isset(self::$cache[$path.$file])){
			log_buffer("Storage::getArray() new StorageCache();","EXTENDED");
			self::$cache[$path.$file] = new StorageCache();
		}
		if(self::$cache[$path.$file]->refresh){
			log_buffer("Storage::getArray() StorageCache->refresh();","EXTENDED");
			$loadFailed = false;
			log_buffer("Storage::getArray() DOMXML::open(".$path.$file.");","EXTENDED");
			 			try{
				slSystem::import('tools/dom');
				$settingsDOM = slToolsDOM::open($path.$file,true);
				self::$cache[$path.$file]->set($settingsDOM);
			}catch(Exception $e){
				$loadFailed = true;
				$loaderState = libxml_disable_entity_loader(false);
				$loaderState = $loaderState?'true':'false';
				log_buffer("Storage::getArray() Corrupted file:[EntityLoader:".$loaderState."]: ".$path.$file,"EXTENEDED");
			}
		}
		@$oDOM = self::$cache[$path.$file]->get();
		
		if($file==COOKIE_FILE.storeageext && !$loadFailed){
			$version = intval($oDOM->documentElement->getAttribute('version'));
			if($version < 11){
				log_buffer("Cookie seetings are old , deleting","EXTENDED");
				$tzoffset = $oDOM->getNodeValue("/cookie_settings/item/tzoffset",$oDOM->documentElement);
				if($rights = $oDOM->getNode("/cookie_settings/item/rights",$oDOM->documentElement)){
					$rights = $oDOM->getNodeContent($rights);
				}
				if($favorites = $oDOM->getNode("/cookie_settings/item/favorites",$oDOM->documentElement)){
					$favorites = $oDOM->getNodeContent($favorites);
				}
				if($tree = $oDOM->getNode("/cookie_settings/item/tree",$oDOM->documentElement)){
					$tree = $oDOM->getNodeContent($tree);
				}
				if($suggest_address = $oDOM->getNode("/cookie_settings/item/suggest_address",$oDOM->documentElement)){
					$suggest_address = $oDOM->getNodeContent($suggest_address);
				}
				if($im = $oDOM->getNode("/cookie_settings/item/im",$oDOM->documentElement)){
					$im = $oDOM->getNodeContent($im);
				}
				if($sip = $oDOM->getNode("/cookie_settings/item/sip",$oDOM->documentElement)){
					$sip = $oDOM->getNodeContent($sip);
				}
				$newCookies =   '<cookie_settings version="11">'.
									'<item>'.
										($tzoffset?('<tzoffset>'.$tzoffset.'</tzoffset>'):'').
										($rights?$rights:'').
										($favorites?$favorites:'').
										($tree?$tree:'').
										($suggest_address?$suggest_address:'').
										($im?$im:'').
										($sip?$sip:'').
									'</item>'.
								'</cookie_settings>';
				file_put_contents($path.$file,$newCookies);
				$oDOM = slToolsDOM::openFromString($newCookies);
				self::$cache[$path.$file]->set($oDOM);
			}
			if($version < 12){
				log_buffer("Cookie seetings are old($version) , clearing <view>","EXTENDED");
				if($view = $oDOM->getNode('/cookie_settings/item/view',$oDOM->documentElement)){
					$item = $oDOM->getNode('/cookie_settings/item',$oDOM->documentElement);
					$item->removeChild($view);	
				}
				$oDOM->documentElement->setAttribute('version','12');
				$oDOM->save($path.$file);
				self::$cache[$path.$file]->set($oDOM);	
			}
		}
		
		 		if(($file==COOKIE_FILE.storeageext || $file==SETTINGS_FILE.storeageext) && ($loadFailed) ){
			log_buffer("Storage::getArray() LOAD FAILED","EXTENDED");
			slSystem::import('tools/icewarp');
			slToolsIcewarp::iw_delete($path.$file);
			self::$cache[$path.$file]->clear();
			return false;
		}
		if(!is_object($oDOM) || $oDOM->saveXML()==''){
			log_buffer("DOM empty in : ".$path.$file,"EXTENDED");
			throw new Exc('setting_file_corrupted');
		}
		
		if ($resource){
		    $oDOMResource = $oDOM->query("/settings/".$resource,$oDOM->documentElement);  
			if ($oDOMResource->item(0)){
				$aArray = Tools::makeTreeFromXML($oDOMResource->item(0));
			}
		}else{
			$aArray = Tools::makeTreeFromXML($oDOM->documentElement);
		}
		if (!$aArray)
			if ($resource=='cookie_settings'
          || $resource=='global_settings')
				$aArray = Tools::makeTreeFromXML($oDOM->documentElement);
			else
				$aArray = array();
		return $aArray;
	}	


	 
	 	 	 	static public function getCertificatePrivateKey($cert)
	{
		if(strpos($cert,'-----BEGIN RSA PRIVATE KEY-----')!==false){
			$matchstrings = '-----BEGIN RSA PRIVATE KEY-----';
			$matchstringe = '-----END RSA PRIVATE KEY-----';
		}elseif(strpos($cert,'-----BEGIN PRIVATE KEY-----')!==false){
			$matchstrings = '-----BEGIN PRIVATE KEY-----';
			$matchstringe = '-----END PRIVATE KEY-----';
		}else{
			return false;
		}
		
		$start = strpos($cert,$matchstrings);
		$end = strpos($cert,$matchstringe)+strlen($matchstringe);
		$privatekey = substr($cert,$start, $end - $start + 1 );

		return $privatekey;
	}
	
	static public function getCertificatePublicKey($cert)
	{
		$start = strpos($cert,'-----BEGIN CERTIFICATE-----');
		$end = strpos($cert,'-----END CERTIFICATE-----')+strlen('-----END CERTIFICATE-----');
		if($start!==false && strpos($cert,'-----END CERTIFICATE-----')!==false){
			$publickey = substr($cert,$start, $end - $start + 1 );
		}
		return $publickey;
	}
	
	static public function getCertificateExtraCerts($cert)
	{
		$i = 0;
		do{
			$start = strpos($cert,'-----BEGIN CERTIFICATE-----');
			$end = strpos($cert,'-----END CERTIFICATE-----')+strlen('-----END CERTIFICATE-----');
			if($start!==false){
				if($i++>0){
					$extracerts[] = substr($cert,$start, $end - $start + 1 );
				}
				$cert = substr_replace($cert,'',$start,$end);
			}
		}while($start!==false);
		return $extracerts;
	}
	
	static public function parseCertificates($content)
	{
		$result = array();
		$content = str_replace(CRLF,LF,$content);
		$certificates = explode('-'.LF.LF,$content);
		if(!empty($certificates)) foreach($certificates as $cert){
			$cert = trim($cert);
			if(count($certificates)>1){
				$cert.='-';	
			}
			if($cert && strpos($cert,'-----BEGIN CERTIFICATE-----')!==false ){
				$itm['id'] = md5($cert);
				$itm['cert'] = Storage::getCertificatePublicKey($cert);
				$pkey = Storage::getCertificatePrivateKey($cert);
				$extracerts = Storage::getCertificateExtraCerts($cert);
				if($pkey){
					$itm['pkey'] = $pkey;
				}
				if($extracerts){
					$itm['extracerts'] = $extracerts;
				}
				$itm['info'] = self::getCertificateInfo($itm['cert'],$itm['ainfo'],$itm['xmlinfo']);
				$result[$itm['id']] = $itm;
			}
		}
		if(count($result)==0){
			return false;
		}
		return $result;
	}
	
	static public function getCurrentCertificate($list)
	{
		$max = 0;
		if($list) {
			foreach($list as $cert){
				if(($cert['ainfo']["validTo_time_t"] ?? 0) > $max){
					$max = $cert['ainfo']["validTo_time_t"];
					$result = $cert;
				}
			}
			if($max < time()){
				throw new Exc(
					'recipient_certificate_expired',
					$result['ainfo']['subject']['CN']
				);
			}
		}else{
			return false;
		}
		return $result;
	}
	
	static public function getCertificates()
	{
		$certFile = $_SESSION['USERDIR'] . CERTIFICATE_FILE;
		@$content = file_get_contents($certFile);
		$list = self::parseCertificates($content);
		return $list;
	}
	
	static public function getCertificate($id)
	{
		$certificates = self::getCertificates();
		if($certificates[$id]){
			return $certificates[$id];
		}
		throw new Exc('certificate_does_not_exists',$id);
	}

	static public function certInfo2XML(&$array)
	{
		$emails = [];
		$array = slToolsString::utf8_bad_replace_array($array);
		$array = slToolsString::htmlspecialchars_array($array);
		if(!empty($array['purposes'])) foreach($array['purposes'] as $key => $val){
			foreach($array['purposes'][$key] as $k2 =>$v2){
				$array['purposes'][$key]['item'.$k2] = $v2;
				unset($array['purposes'][$key][$k2]);
			}
		}
		if($array && isset($array['extensions']) && isset($array['extensions']['subjectAltName'])){
			$san = $array['extensions']['subjectAltName'];
			$san = explode(',',$san);
			foreach($san as $sitem){
				$info = explode(':',$sitem);
				if($info[0]=='email'){
					$emails[]= $info[1];
				}
			}
			
			if(count($emails)>1){
				$emails = join(',',$emails);
			}else{
				$emails = $emails[0];
			}
			$array['subjectAltName'] = $emails;
		}
		if($array){
			$xml =  template( 'inc/templates/certificate_info.tpl', $array);
		}
		return $xml;
	}

	static public function getCertificateInfo($key,&$raw = false,&$xml = false)
	{
		$result = '';
		if ($key){
			 			$raw = openssl_x509_parse($key);
			$xml = self::certInfo2XML($raw);
			 			if (is_array($raw))
			{
				$result .= $raw["name"] . "\r\n\r\n";
				$result .= $raw["subject"]["CN"] . "\r\n";
				$result .= $raw["subject"]["emailAddress"] . "\r\n\r\n";
				$result .= $raw["issuer"]["C"] . "\r\n";
				$result .= $raw["issuer"]["ST"] . "\r\n";
				$result .= $raw["issuer"]["L"] . "\r\n";
				$result .= $raw["issuer"]["O"] . "\r\n";
				$result .= $raw["issuer"]["OU"] . "\r\n";
				$result .= $raw["issuer"]["CN"] . "\r\n";
				$result .= $raw["issuer"]["emailAddress"] . "\r\n\r\n";
				$result .= $raw["validFrom"] . "\r\n";
				$result .= $raw["validTo"] . "\r\n\r\n";
			}
		}
		return trim($result);
	}
	
	static public function parseUploadedCertificate($folder,$file,$passphrase = false)
	{
			$certFile = $_SESSION['user']->getAttachments($folder,$file);
			$certExt = substr( $certFile['name'], strrpos($certFile['name'],'.')+1);
			$certExt = strtolower( $certExt );
			switch($certExt){
				 				case 'pem':
				case 'crt':
					$certData = file_get_contents( $certFile['file'] );
					$pubkey = self::getCertificatePublicKey($certData);
					$privkey = self::getCertificatePrivateKey($certData);
					$extracerts = self::getCertificateExtraCerts($certData);
					if(!$pubkey){
						 						 						 						 						 						if(!$pubkey){
							throw new Exc('certificate_invalid');
						}
					}
				break;
				 				case 'p12':
				case 'pfx':
					if($passphrase===false && $certFile['passphrase']){
						$passphrase = $certFile['passphrase'];
					}else{
						$_SESSION['user']->attachments[$folder][$file]['passphrase'] = $passphrase;
					}
					if($certData = icewarp_openssl_pkcs12_read( $certFile['file'], $passphrase)){
						$pubkey = $certData['cert'];
						$privkey = $certData['pkey'];
						$extracerts = $certData['extracerts'];
					}else{
						throw new Exc('certificate_invalid');
					}
				break;
				 				case 'p7c':
				case 'p7b':
					if($pkcs7 = icewarp_openssl_pkcs7_read($certFile['file'])){
						$pubkey = $pkcs7['certs'][0];
					}else{
						throw new Exc('certificate_invalid');
					}
					
				break;
				default:
					throw new Exc('certificate_type_unsupported');
				break;
			}
			return array('cert'=>$pubkey,'pkey'=>$privkey,'extracerts'=>$extracerts);
	}
	
	static public function getCertificateData(&$oUser, $aAction)
	{
		if(isset($aAction['file']) || ($aAction['class']=='file')){
			if($aAction['class']=='file'){
				$path = Tools::parseFullPath($aAction['fullpath'],$aAction['class']);
				$folder = $path['folder'];
				$file = $path['item'];
			}else{
				$path = explode('/',$aAction['file']);
				$folder = $path[0];
				$file = $path[1];
			}
			$certInfo = self::parseUploadedCertificate($folder,$file,$aAction['passphrase']);
			$pubkey = $certInfo['cert'];
			$privkey = $certInfo['pkey'];
			$extracerts = $certInfo['extracerts'];
		}else{
			if($aAction['data']){
				$certData = $aAction['data'];
				$pubkey = self::getCertificatePublicKey($certData);
				$privkey = self::getCertificatePrivateKey($certData);
				$extracerts = self::getCertificateExtraCerts($certData);
				if(!$pubkey){
						throw new Exc('certificate_invalid');
				}
			}else if($aAction['class']){
				$attData = Tools::parseFullPath($aAction['fullpath'],$aAction['class']);
				$account = $oUser->getAccount($attData['account']);
				$folder = $account->getFolder($attData['folder']);
				$item = $folder->getItem($attData['item']);
				$certData = $item->getCertificate();
				$certString = $certData['cert'];
				$pubkey = self::getCertificatePublicKey($certString);
			}else{
				throw new Exc('certificate_data_missing');
			}
		}
		return array(
			'cert'=>$pubkey,
			'pkey'=>$privkey,
			'extracerts'=>$extracerts
		);
	}
	
	static public function setCertificates(&$oUser,$aActions)
	{
		if($aActions){
			$certList = self::getCertificates();
			foreach($aActions as $aAction){
				switch($aAction['action']){
					case 'add':
						self::addCertificate( $oUser, $certList, $aAction );
						break;
					case 'edit':
						self::editCertificate( $oUser, $certList, $aAction );
						break;
					case 'delete':
						self::deleteCertificate( $oUser, $certList, $aAction );
						break;
				}
			}
			self::saveCertificates( $certList );
		}
	}
	
	static public function addCertificate(&$oUser, &$certList, $aAction)
	{
		$certData = self::getCertificateData( $oUser, $aAction['data'] );
		$certList[] = $certData;
	}
	
	static public function editCertificate(&$oUser, &$certList,$aAction)
	{
		$certData = self::getCertificateData( $oUser, $aAction['data'] );
		$certList[$certData['id']] = $certData;
	}
	
	static public function deleteCertificate(&$oUser, &$certList,$aAction)
	{
		$deleteID = $aAction['uid'];
		if(isset($certList[$deleteID])){
			unset($certList[$deleteID]);
		}
	}
	
	static public function savePersonalCertificate($value,$userdir = false)
	{
		
		$certFile = ($userdir?$userdir:$_SESSION['USERDIR']) . CERTIFICATE_FILE;
		slSystem::import('tools/icewarp');
		return slToolsIcewarp::iw_file_put_contents($certFile,$value);
	}
	
	static public function certificateListToString($list)
	{
		$result = '';
		if($list) foreach($list as $cert){
			 			$result.= 
				trim($cert['cert']).LF;
			 			if(is_array($cert['extracerts']) && !empty($cert['extracerts'])){
				foreach($cert['extracerts'] as $extracert){
					$result.=trim($extracert).LF;
				}
			}
			 			$result.=($cert['pkey']?trim($cert['pkey']).LF:'');
			$result.=LF;
		}
		return $result;
	}
	
	static public function saveCertificates($list)
	{
		$string = self::certificateListToString($list);
		self::savePersonalCertificate($string);
	}

	static public function getPersonalCertificates()
	{
		$result = array();
		$list = Storage::getCertificates();
		if(is_array($list) && !empty($list)){
			foreach($list as $certificate){
				if($certificate && $certificate['ainfo'] && $certificate['ainfo']['extensions'] && $certificate['ainfo']['extensions']['subjectAltName']){
					$san = $certificate['ainfo']['extensions']['subjectAltName'];
					$san = explode(',',$san);
					foreach($san as $sitem){
						$info = explode(':',$sitem);
						if(strpos($info[1], '@') !== false){
							$result[strtoupper($info[1])][$certificate['ainfo']['validTo_time_t']] = $certificate;
						}
					}
				}else if($certificate['ainfo']['subject']['emailAddress']){
						$result[strtoupper($certificate['ainfo']['subject']['emailAddress'])][$certificate['ainfo']['validTo_time_t']] = $certificate;
				}
			}
		}
		return $result;
	}
	
	static public function getAvailableLanguages($langRoot = '')
	{
		$result = array();
		if($langRoot == ''){
			if(defined('APP_PATH') && is_dir(APP_PATH.LANGUAGE_PATH)){
				$langRoot = APP_PATH.LANGUAGE_PATH;
			}else{
				$langRoot = LANGUAGE_PATH;
			}
		}
		if (@$dh = opendir($langRoot)) {
			while (($lang = readdir($dh)) !== false) {
				if (($lang == '.') || ($lang == '..'))
					continue;

				$dir = $langRoot . '/' . $lang;
				if (is_dir($dir) && ( file_exists($dir . '/data.xml') || file_exists($dir . '/lang.xml'))) {
				 	
					@$aContent = explode(CRLF,file_get_contents($dir . '/name.dat'));
					$collation = $aContent[1] ?? false;
					$weatherLanguage = $aContent[2] ?? false;
					$isRTL = strtolower($aContent[3] ?? '') == 'rtl';
					$customDateFormat = ($trimmed = trim($aContent[4] ?? '')) != '' ? $trimmed : false;
					$data = &$result[$lang];
					$data['lang'] = $lang;
					$data['name'] = $aContent[0];
					if($collation){
						$data['collation'] = $collation;
					}
					if($weatherLanguage){
						$data['weather'] = $weatherLanguage;
					}
				 	if($isRTL){
						$data['rtl'] = 1;
					}
					if($customDateFormat){
						$data['date_format'] = $customDateFormat;
					}
				}
			}
			closedir($dh);
		}else{
			throw new Exc('language_path_not_found');
		}
		
		 		require_once(__DIR__ . '/../tools.php');
		uasort($result,'lang_compare');
		return $result;
	}
	
	 
	
	static public function getAvailableSkins()
	{
		$result = array();
		$skinsRoot = '../client/skins/';
		if (@$dh = opendir($skinsRoot)) {
			while (($skin = readdir($dh)) !== false) {
				if (($skin == '.') || ($skin == '..'))
					continue;

				$dir = $skinsRoot . '/' . $skin;
				if (is_dir($dir) && file_exists($dir.'/name.dat')) {
					@$aContent = explode(CRLF,file_get_contents($dir . '/name.dat'));
					$data = &$result[$skin];
					$data['skin'] = $skin;
					$data['name'] = $aContent[0];
				}
			}
			closedir($dh);
		}else{
			throw new Exc('skin_path_not_found');
		}
		
		 		require_once('inc/tools.php');
		uasort($result,'skin_sort');
		return $result;
	}
	
	static public function getAvailableHolidays($oGWAccount,$cs = 'holidays')
	{
		 		$sHolidays = $oGWAccount->gwAPI->FunctionCall(
			"GetHolidays",
			$oGWAccount->gwAPI->sessid,
			$cs
		);
		 		$aHolidays = $oGWAccount->gwAPI->ParseParamLine($sHolidays);
		
		if($aHolidays){
			foreach($aHolidays as $key => $aHoliday){
				$aHolidays[$key]['HOLSHORTDESCRIPTION'] = $aHoliday['HOLSHORTDESCRIPTION'];
			}
		}
		return $aHolidays;
	}

	static public function subscribeHolidays($oGWAccount,$aActions,$cs = 'holidays')
	{
		if($aActions){
			foreach($aActions as $aAction){
				$sHolidayID = $aAction['dataTree']['@attributes']['uid'];
				if(!$sHolidayID){
					$sHolidayID = $aAction['dataTree']['@childnodes']['name'][0]['@value'];
				}
				$sSelected = strtolower($aAction['dataTree']['@childnodes']['subscribed'][0]['@value']);
				
				$aNewHoliday['HOLHOLIDAYID'] = $sHolidayID;
				$aNewHoliday['HOLSELECTED'] = 1;
				
				if ($sSelected=='true' || $sSelected=='1'){
					$sHoliday = $oGWAccount->gwAPI->CreateParamLine($aNewHoliday);
					$oGWAccount->gwAPI->FunctionCall("AddHoliday",$oGWAccount->gwAPI->sessid,$sHoliday,$cs);
				}
				if ($sSelected=='false' || !$sSelected){
					$oGWAccount->gwAPI->FunctionCall("DeleteHolidays",$oGWAccount->gwAPI->sessid,$cs,$sHolidayID);
					unset($aSelectedHolidays[$sHolidayID]);
				}
			}
		}
		return true;
	}
	
	static public function checkCityWeather($oGWAccount,$city,$cs = 'weather',&$result = array(), $all = false)
	{
		$language = $_SESSION['LANGUAGE_WEATHER']?$_SESSION['LANGUAGE_WEATHER']:'EN';
		$result = $oGWAccount->gwAPI->FunctionCall("GetHolidays",$oGWAccount->gwAPI->sessid,'weather','location='.$city.'&lang='.$language);
		$result = $oGWAccount->gwAPI->ParseParamLine($result);
		if (!$all){
			$result = reset($result);
		}
		if(is_array($result) && count($result)>0){
			return true;
		}
		return false;
	}

	static private function getPropertyItems($type,&$aAccess = array()) {
		switch (strtoupper($type)) {
			case 'AUTORESPONDER':
				return array('U_RESPOND','U_RESPONDPERIOD','U_REPLYFROM','U_RESPONDBETWEENFROM','U_RESPONDBETWEENTO','U_RESPONDONLYIFTOME','U_RESPONDERCONTENT','U_NORESPONDFOR');
			case 'FORWARDER':
				return array('U_FORWARDTO','U_FORWARDOLDER','U_FORWARDOLDERDAYS','U_FORWARDOLDERTO','U_NULL');
			case 'FILTER_RULES':
				return array('U_RULESCONTENTXML');
			case 'TEAMCHAT_NOTIFY':
				return array('U_GW_TEAMCHAT_DAILYNOTIFY','U_GW_TEAMCHAT_MENTIONNOTIFY','U_GW_TEAMCHAT_PINNOTIFY','U_GW_TEAMCHAT_UPLOADNOTIFY');
			case 'ANTISPAM':
				$aAccess['U_AS']['NAME'] = 'U_ASEditable';
				$aAccess['U_CR']['NAME'] = 'U_QuarantineEditable';
		    	return array('U_AS','U_CR','U_QUARANTINEREPORTS','U_SPAMFOLDER');
			case 'CALL_FORWARDING':
				return array('U_SIP_CALLTRANSFERACTIVE','U_SIP_CALLTRANSFERTARGET','U_SIP_CALLTRANSFERTIME');
    		default:
				throw new Exc('api_property_get',strtoupper($type));
		}
	}

	static public function getUserProperties($type, $encode = true)
	{
		$result = array();
		
		$mAccount = new MerakAccount();

		if ($mAccount->Open($_SESSION['user']->email)){
			$result['properties']['num'] = array();
			foreach (self::getPropertyItems($type,$aAccess) as $item) {
				$data = &$result['properties']['num'][];
				$data['name'] = strtolower($item);
				$data['value'] = $mAccount->GetProperty($item);
				if($item=='U_RULESCONTENTXML'){
					$xml = slToolsXML::loadString($data['value']);
					if($xml->FILTER){
						foreach($xml->FILTER as $fkey => $filter){
							if ($filter->CONDITION)
							{
								foreach($filter->CONDITION as $key=>$condition)
								{
									 									if($condition->EXPRESSION==10 && $condition->HEADERTYPE==33){
										$schedule_value = base64_decode($condition->CONTAIN);
										$schedule_value = unpack("c1daysenabled/c7day/c1timesenabled/d2time/c1datesenabled/d2date",$schedule_value);

										$xmldata = $condition->addChild('XML');
										$weekdays = $xmldata->addChild('WEEKDAYS');
										$weekdays->addChild('ENABLED',$schedule_value['daysenabled']);
										$weekdays->addChild('SU',$schedule_value['day1']);
										$weekdays->addChild('MO',$schedule_value['day2']);
										$weekdays->addChild('TU',$schedule_value['day3']);
										$weekdays->addChild('WE',$schedule_value['day4']);
										$weekdays->addChild('TH',$schedule_value['day5']);
										$weekdays->addChild('FR',$schedule_value['day6']);
										$weekdays->addChild('SA',$schedule_value['day7']);
										$times = $xmldata->addChild('TIMES');
										$times->addChild('ENABLED',$schedule_value['timesenabled']);
										$times->addChild('FROM',substr(slToolsDate::timetostr($schedule_value['time1']*1440),6)?substr(slToolsDate::timetostr($schedule_value['time1']*1440),6):'00:00');
										$times->addChild('TO',substr(slToolsDate::timetostr($schedule_value['time2']*1440),6)?substr(slToolsDate::timetostr($schedule_value['time2']*1440),6):'00:00');
										$dates = $xmldata->addChild('DATES');
										$dates->addChild('ENABLED',$schedule_value['datesenabled']);
										$dates->addChild('FROM',slToolsDate::datetostr($schedule_value['date1']));
										$dates->addChild('TO',slToolsDate::datetostr($schedule_value['date2']));
									}
								}
							}
						}
					}
					$data['value'] = $xml->asXML();
				}

				if($encode){
					$data['value'] = slToolsPHP::htmlspecialchars($data['value']);
				}

				if ($aAccess && ($aAccess[$item] ?? false)){
					$bAccess = $mAccount->GetProperty($aAccess[$item]['NAME']);
					$data['access'] = $bAccess?'full':'view';
					if(!$bAccess){
						$data['value'] = false;
					}
				}
			}
		}
		return $result;
	}

		
	static public function setUserProperties($type, $properties)
	{
		$mAccount = new MerakAccount();
		if ($mAccount->Open($_SESSION['user']->email)){
			foreach (self::getPropertyItems($type,$aAccess) as $item) {
				if(!isset($properties[strtolower($item)])){
					continue;
				}
				$value = isset($properties[strtolower($item)]) ? $properties[strtolower($item)] : '';
				if(strtolower($item)=='u_respondercontent'){
					$part0 = substr($value,0,strrpos($value,'$$')+2);
					$text = substr($value,strrpos($value,'$$')+2);
					slSystem::import('tools/string');
					$text = slToolsString::removeHTML(nl2br($text));
					$value = $part0.$text;
				}
				if(strtolower($item)=='u_rulescontentxml'){
					$xml = slToolsXML::loadString($value);
					if($xml->FILTER) foreach($xml->FILTER as $filter){
						if($filter->CONDITION){
							foreach($filter->CONDITION as $condition){
								if($condition->EXPRESSION==10 && $condition->HEADERTYPE==33){
									$time = explode(":",$condition->XML->TIMES->FROM); 
									$fromtime = ($time[0]*60+$time[1])/1440;
									$time = explode(":",$condition->XML->TIMES->TO);
									$totime = ($time[0]*60+$time[1])/1440;
									$fromdate = slToolsDate::strtodate($condition->XML->DATES->FROM);
									$todate = slToolsDate::strtodate($condition->XML->DATES->TO);

									$binary = pack(
											"c1c7c1d2c1d2",
											(int) $condition->XML->WEEKDAYS->ENABLED,
											(int) $condition->XML->WEEKDAYS->SU,
											(int) $condition->XML->WEEKDAYS->MO,
											(int) $condition->XML->WEEKDAYS->TU,
											(int) $condition->XML->WEEKDAYS->WE,
											(int) $condition->XML->WEEKDAYS->TH,
											(int) $condition->XML->WEEKDAYS->FR,
											(int) $condition->XML->WEEKDAYS->SA,
											(int) $condition->XML->TIMES->ENABLED,
											$fromtime,
											$totime,
											(int) $condition->XML->DATES->ENABLED,
											$fromdate,
											$todate
										);

									unset($condition->XML);
									$condition->CONTAIN = strval(base64_encode($binary));
								}
							}
						}
					}

					$value = $xml->asXML();
					$value = preg_replace('/<\?xml(.*?)\?>/si','',$value);
				}
				if ($aAccess && $aAccess[$item]){
					if(!$mAPI){
						$mAPI = createobject('API');
					}
					if($mAPI->GetProperty($aAccess[$item]['NAME'])==$aAccess[$item]['VALUE']){
						$mAccount->SetProperty($item,$value);
					}
				}else{
					$mAccount->SetProperty($item,$value);
				}
			}
			$mAccount->Save();
		}
	}
	
	static public function getAvailableDomains()
	{
		$list = self::getDomains();
		if($list){
			foreach($list as $dom){
				$ret = array();
				$ret['domain']=$dom;
				if (file_exists($_SESSION['WMCONFIGPATH'].$dom)){
					$ret['set'] = 'true'; 
				}
				$return[] = $ret;
			}
		}
		return $return;
	}
	
	static public function getSignupDomains()
	{
		 		$domaindata = Storage::getDomainDefaults('restrictions',Tools::getHostDomain());
		$defaultdata = Storage::getDefaults('restrictions');
		$bSignupEnabledGlobal = $defaultdata['@childnodes']['item'][0]['@childnodes']['disable_signup'][0]['@value']==1?false:true;
		$data = WebmailIqPublic::get('restrictions',$defaultdata,$domaindata,false,0);
		$bSignupEnabled = $data['@childnodes']['item'][0]['@childnodes']['disable_signup'][0]['@value']==1?false:true;
		$sSignupFile = WM_CONFIGPATH.'signup.dat';
		$bSignupFileExistence = file_exists($sSignupFile)?true:false;

		if($bSignupEnabled){
			if($bSignupFileExistence){
				$api = createobject('API');
				@$domains = rtrim(file_get_contents(WM_CONFIGPATH.'signup.dat'));
				$domains = explode("\r\n",$domains);
				if($domains){
					foreach($domains as $key => $domain){
					$dom = trim($domain);
						if($api->GetDomainIndex($dom)!=-1){
							$return[$key]['domain'] = trim($dom);
						}
					}
				}
			}else{
				$list = self::getDomains();
				if($list){
					foreach($list as $key => $dom){
						 						$domaindata = Storage::getDomainDefaults('restrictions',$dom);
						if($domaindata){
							$data = WebmailIqPublic::get('restrictions',$defaultdata,$domaindata,false,0);
							$bSignupEnabled = $data['@childnodes']['item'][0]['@childnodes']['disable_signup'][0]['@value']==1?false:true;
						}else{
							$bSignupEnabled = $bSignupEnabledGlobal; 
						}
						if($bSignupEnabled){
							$return[$key]['domain'] = $dom;
						}
					}
				}
			}
		}
		return $return;
	}
	
	static public function getDomains(){
		$api = createobject('API');
		$list = $api->getDomainList();
		$list = Tools::explode_j(';',$list);

		return $list;
	}
	
	static public function removeAvailableDomains($aActions)
	{
		$domains = self::getAvailableDomains();
		
		if($aActions) foreach($aActions as $action)
			$arr[] = $action['data']['domain'];
		
		slSystem::import('tools/filesystem');
		
		if($domains) foreach($domains as $dom){
			if (!@in_array($dom['domain'],$arr) && $dom['domain']){
				slToolsFilesystem::rmdir($_SESSION['CONFIGPATH'].'_webmail/'.$dom['domain']);
			}else{
				slToolsFilesystem::mkdir($_SESSION['CONFIGPATH'].'_webmail/'.$dom['domain']);
			}
		}
	}
	
 

	static public function getLoginSettings()
	{
		$mAPI = createobject('API');
		$result = self::getArray(WM_CONFIGPATH,'login_settings');
		if(!isset($_SESSION['SETTINGS_GLOBAL'])){
			log_buffer("Storage::getLoginSettings() DOMXML::open(".GLOBAL_SETTINGS_FILE.");","EXTENDED");
			@$data = file_get_contents(GLOBAL_SETTINGS_FILE);
			if(trim($data)){
				slSystem::import('tools/dom');
				$xml = slToolsDOM::openFromString(trim($data));
			}
			$global_settings = Tools::makeTreeFromXML($xml);
			$set = $global_settings['@childnodes']['global_settings'][0]['@childnodes']['item'][0]['@childnodes'];
			$logging_type = $set['logging_type'][0]['@value'];
		}else{
			$logging_type = $_SESSION['LOGGING_TYPE'];
		}
		$result['@childnodes']['item'][0]['@childnodes']['version'][0]['@value'] = $mAPI->GetProperty('C_Version');
		$result['@childnodes']['item'][0]['@childnodes']['logging_type'][0]['@value'] = $logging_type;
		$result['@childnodes']['item'][0]['@childnodes']['logging_type'][0]['@attributes']['access'] = 'view';
		return $result;
	}
	
	static public function getSpellcheckerLanguages($sResourceName)
	{
		if(!file_exists(SPELLCHECKER_SETTINGS_FILE)){
			$fp = @fopen(SPELLCHECKER_SETTINGS_FILE,"w+");
			@fwrite($fp,file_get_contents(SPELLCHECKER_SETTINGS_DEFAULT));
			@fclose($fp);
			slSystem::import('tools/icewarp');
			slToolsIcewarp::iw_index(SPELLCHECKER_SETTINGS_FILE);
		}
		log_buffer("Storage::getSpellcheckerLanguages() slToolsXML::loadFile(".SPELLCHECKER_SETTINGS_FILE.");","EXTENDED");
		$xml = slToolsXML::loadFile(WM_CONFIGPATH.'spellchecker.xml');
		$result = '';
		if($xml->item){
			foreach($xml->item as $item){
				foreach($item->children() as $elmName =>$elmVal){
					$result.='<item><name>'.slToolsPHP::htmlspecialchars($elmVal).'</name><path>'.slToolsPHP::htmlspecialchars($elmName).'</path></item>';
				}
			}
		}
		$result = '<'.$sResourceName.'>'.$result.'</'.$sResourceName.'>';
		return $result;
	}
 
	static public function getGlobalSettings()
	{
	  $api = createobject('api');
	  $result = self::getArray(WM_CONFIGPATH,'global_settings');
	  if($result['@childnodes']['item'][0]['@childnodes'])
	  	foreach($result['@childnodes']['item'][0]['@childnodes'] as $key=>$child){
	  		switch($key){
    			case 'dbconn':
	    		case 'dbuser':
	    		case 'dbpass':
	    			break;
	    			
	    		default:
	     	 		$return['@childnodes']['item'][0]['@childnodes'][$key] = $child;
	    			break;
    		}
		}
		
		$return['@childnodes']['item'][0]['@childnodes']['logs'][0]['@value'] = $api->GetProperty('c_webmail_logs');
		$return['@childnodes']['item'][0]['@childnodes']['http_secure_cookie'][0]['@value'] = $api->GetProperty('C_Webmail_HTTPSecureCookie');
		$return['@childnodes']['item'][0]['@childnodes']['session_cookie'][0]['@value'] = $api->GetProperty('C_WebMail_SessionCookie');
		$return['@childnodes']['item'][0]['@childnodes']['teamchat_notify'][0]['@value'] = $api->GetProperty('C_TeamChat_Enable_Notification_Mails');

  		$return = Tools::makeXMLStringFromTree($return,'global_settings',true);
  		return $return;
	}

	static public function setGlobalSettings($settings)
	{
		log_buffer("Storage::setGlobalSettings() : file_put_contents(".WM_CONFIGPATH.GLOBAL_FILE.storeageext.")","EXTENDED");
		$aActions = [];
		if ($aActions[0]['dataTree']['@childnodes']['database']) {
			$val = $aActions[0]['dataTree']['@childnodes']['database'][0]['@value'];
			$aActions[0]['data']['database'] = $val;
			$aActions[0]['dataTree']['@childnodes']['database'][0]['@value'] = $val;
		}

		if ($aActions[0]['dataTree']['@childnodes']['upload_limit']) {
			$upload_limit = $aActions[0]['dataTree']['@childnodes']['upload_limit'][0]['@value'];
			 			file_put_contents('.user.ini','upload_max_filesize = '.$upload_limit.'M'.CRLF.'post_max_size = '.$upload_limit.'M'.CRLF);
			 			$_SESSION['UPLOAD_LIMIT'] = $upload_limit;
		}
		$api = createobject('api');
		$apisave = false;
		if ($aActions[0]['dataTree']['@childnodes']['logs']) {
			$apisave =  true;
			$api->SetProperty('C_Webmail_Logs',$aActions[0]['dataTree']['@childnodes']['logs'][0]['@value']);
		}
		if ($aActions[0]['dataTree']['@childnodes']['http_secure_cookie']) {
			$apisave =  true;
			$api->SetProperty('C_Webmail_HTTPSecureCookie',$aActions[0]['dataTree']['@childnodes']['http_secure_cookie'][0]['@value']);
		}
		if ($aActions[0]['dataTree']['@childnodes']['session_cookie']) {
			$apisave =  true;
			$api->SetProperty('C_WebMail_SessionCookie',$aActions[0]['dataTree']['@childnodes']['session_cookie'][0]['@value']);
		}
		if($apisave){
			$api->Save();
		}
		if (!@file_put_contents(WM_CONFIGPATH.GLOBAL_FILE.storeageext,$settings,LOCK_EX)){
			return false;
		}
		return true;
	}

	static public function getSIPCallsHistory()
	{
	  $oUser = $_SESSION['user'];
	  $api = createobject('API');
	        
	  $sUserDir = User::getDir(true);
	  $sSipCallsDirectory = $sUserDir.'~sip/calls/';
	
	  $time = time();
	  
	  $year = date('Y',$time);
	  $month = date('m',$time);
	    
	   	  $aLogFiles[] = date('Ym',$time).'.log';
	
	   	  if($month == 1){
	    $month = 12;
	    $year--;  
	  }
	  
	   	  $time = mktime(0,0,0,$month,0,$year);
	  $aLogFiles[] = date('Ym',$time).'.log';
	
	  $total=0;
	
	  for ($fi=0;$fi<count($aLogFiles);$fi++){
	    if($total>=100) break;
	
	    $logfile=$aLogFiles[$fi];
	    $date = array();
	
	    @$log = file_get_contents($sSipCallsDirectory.$logfile);
	    $aLogs = explode("\r\n",$log);
	
	    for ($i=count($aLogs);$i>0;$i--){
	      if($total>=100) break;
	  $logLine=$aLogs[$i-1];
	
	      $aLog = array();
	      preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2}) (([0-9]{2}):([0-9]{2}):([0-9]{2}))'.
	            ' ([0-9]{2}):([0-9]{2}):([0-9]{2})'. 
	            ' ([^ ]{0,}) ([^ ]{0,}) ([0-9]{3})'.
	            ' (FAILED|ANSWERED|CANCELLED) (IN|OUT) ([^ ]{0,})'.
	            ' ([^ ]{0,}) ([^ ]{0,}) (.*)$/si',$logLine,$aLog);
	
	      if($aLog[11]){
	
	     	    if ($aLog[13]=='407') continue;
	
	        $aItem['time'] = $aLog[4];
	        $aItem['duration'] = $aLog[10]+$aLog[9]*60+$aLog[8]*3600;
	        $aItem['from'] = $aLog[11];
	        $aItem['to'] = $aLog[12];
	        $aItem['inout'] = $aLog[15];
	        $aItem['status'] = $aLog[14];
	        $aItem['date'] = $date = mktime($aLog[5],$aLog[6],$aLog[7],$aLog[2],$aLog[3],$aLog[1]);
	
	     	     
	
	        $aResult[] = $aItem;
	
	    $total++;
	      }          
	    }
  }

  return $aResult;
}
	static public function getOwnerInfo($oGWAccount)
	{
		$owner = $oGWAccount->gwAPI->FunctionCall(
			'GetOwnerInfo',
			$oGWAccount->gwAPI->sessid
		);
		$owner = $oGWAccount->gwAPI->ParseParamLine($owner);
		return $owner[0];
	}

	static public function setOwnerInfo($oGWAccount,$owner)
	{
		$owner = $oGWAccount->gwAPI->CreateParamLine($owner);
		if($oGWAccount->gwAPI->FunctionCall(
			"UpdateOwnerInfo",
			$oGWAccount->gwAPI->sessid,
			$owner
			)==-1
		){
			throw new Exc('settings_owner_set',$owner);
		}
	}

	static public function setMyGroup(&$oGWAccount,$data)
	{
		if(isset($data['ownautorevisionmode'])){
			$ownerInfo['ownautorevisionmode'] = $data['ownautorevisionmode'];
			$ownerInfo = $oGWAccount->gwAPI->CreateParamLine($ownerInfo);
			if($oGWAccount->gwAPI->FunctionCall(
					'UpdateOwnerInfo',
					$oGWAccount->gwAPI->sessid,
					$ownerInfo
			)==-1
			){
				throw new Exc('settings_set','owner:'.var_export($ownerInfo,true));
			}
			unset($data['ownautorevisionmode']);
		}
		$mygroup = self::getMyGroup($oGWAccount);
		$id = $mygroup['GRP_ID'];
		unset($data['rights']);
		unset($data['grp_id']);
		$data = $oGWAccount->gwAPI->CreateParamLine($data);
		
		if($oGWAccount->gwAPI->FunctionCall(
				'AddGroup',
				$oGWAccount->gwAPI->sessid,
				$data,
				$id
			)==-1
		){
			throw new Exc('settings_set','mygroup:'.var_export($data,true));
		}
	}
	
	static public function getMyGroup(&$oGWAccount, $encode = false)
	{
		$ownerData = $oGWAccount->gwAPI->FunctionCall(
				'GetOwnerInfo',
				$oGWAccount->gwAPI->sessid
		);
		$ownerData = $oGWAccount->gwAPI->ParseParamLine($ownerData);
		$ownerData = $ownerData[0];
		$data = $oGWAccount->gwAPI->FunctionCall(
			'GetGroupList',
			$oGWAccount->gwAPI->sessid,
			$oGWAccount->username
		);
		$data = $oGWAccount->gwAPI->ParseParamLine($data);
		
		$data = $data[0];
		$data['ownautorevisionmode'] = $ownerData['OWNAUTOREVISIONMODE'];
		if($encode){
			$data = Tools::htmlspecialchars_array($data);
		}
		return $data;
	}
	
	static public function getDefaultMailFolder($type)
	{
		
		if(!self::$language[$_SESSION['LANGUAGE']]){
			self::$language[$_SESSION['LANGUAGE']] = slToolsXML::loadFile(
				dirname(__FILE__).
				'/../../../client/languages/'.
				$_SESSION['LANGUAGE'].
				'/data.xml'
			);
		}
		if($fdrName = strval(self::$language[$_SESSION['LANGUAGE']]->common_folders->$type)){
			return $fdrName;
		}
		return false;
	}
	static public function getDefaultGWFolder($type)
	{
		if(!self::$language[$_SESSION['LANGUAGE']]){
			self::$language[$_SESSION['LANGUAGE']] = slToolsXML::loadFile(
				dirname(__FILE__).
				'/../../../client/languages/'.
				$_SESSION['LANGUAGE'].
				'/data.xml'
			);
		}
		if($fdrName = strval(self::$language[$_SESSION['LANGUAGE']]->folders->$type)){
			return $fdrName;
		}
		return false;
	}
	
	static public function getPaths()
	{
		$api = createobject('api');
		$data['paths'][0]['value'] = $api->getProperty('C_Install_URL');
		$data['paths'][0]['id'] = 'install';
		return $data;
	}
	
	static public function setPaths($aActions)
	{
		return true;
	}
	
	static public function getStreamHosts()
	{
		$host = array(
			'jid'=>$_SESSION['SOCKS_JID'],
			'host'=>$_SESSION['SOCKS_HOST'],
			'port'=>$_SESSION['SOCKS_PORT']
		);
		$data['hosts'][] = $host;
		return $data;
	}
	
	static public function setActualLanguage($lang)
	{
		$data = Storage::getUserData();
		$data['@childnodes']['layout_settings'][0]['@childnodes']['item'][0]['@childnodes']['language'][0]['@value'] = $lang;
		$str = Tools::makeXMLStringFromTree($data,'settings',true);
		Storage::setUserDataStr($str,'settings');
	}
	
	static public function getPasswordPolicy()
	{
		return $_SESSION['PASSWORD_POLICY'];
	}
	
	static public function getTZIDList(&$oGWAccount)
	{
		$gwapi = &$oGWAccount->gwAPI;
		$tzids = $gwapi->FunctionCall("GetTZIDList",1);
		$result = Tools::explode_j(CRLF,$tzids);
		foreach($result as $key =>$val){
			$data = explode(';',$val,2);
			$response[$key]['tzid'] = $data[1];
			$response[$key]['name'] = $data[0];
		}
		return $response;
	}
	
	static public function getAvailableTags(&$oGWAccount,$aFilter = false,$sid = false)
	{
		if($aFilter){
			$sAttributes = $oGWAccount->gwAPI->filterToAttributes($aFilter);
		}
		$tags = $oGWAccount->gwAPI->FunctionCall(
			"GetTagDetailList",
			$sid?$sid:$oGWAccount->sGWSessionID,
			icewarp_sanitize_db_sql($aFilter['sql']),
			$sAttributes
		);
		
		$tags = $oGWAccount->gwAPI->ParseParamLine($tags);
		if(is_array($tags) && !empty($tags)){
			foreach($tags as $key => $tag){
				$tags[$key]['wuid'] = base64_encode($tag['TAGNAME']);
				$tags[$key]['color'] = $tag['TAGCOLOR'];
			}
		}
		return $tags;
	}
	
	static public function setAvailableTags(&$oGWAccount,$aActions)
	{
		if(is_array($aActions) && !empty($aActions)){
			foreach($aActions as $aAction){
				switch($aAction['action']){
					case 'add':
						self::addTag($oGWAccount,$aAction['data']['tag'],$aAction['data']['color']);
					break;
					case 'edit':
						self::editTag($oGWAccount,$aAction['uid'],$aAction['data']['tag'],$aAction['data']['color']);
					break;
					case 'delete':
						self::deleteTag($oGWAccount,$aAction['uid']);
					break;
				}
			}
		}
	}
	
	static public function addTag(&$oGWAccount,$value,$color = '')
	{
		if(isset($_SESSION['tags'][$value])) return;
		$oGWAccount->gwAPI->FunctionCall(
			"AddTag",
			$oGWAccount->sGWSessionID,
			$value,
			'',
			$color?'tagcolor='.$color:''
		);
		$_SESSION['tags'][$value] = null;
	}
	
	static public function editTag(&$oGWAccount,$uid,$value,$color = '')
	{
		$oldValue = base64_decode($uid);
		if(!$value){
			$value = $oldValue;
		}
		$oGWAccount->gwAPI->FunctionCall(
			"AddTag",
			$oGWAccount->sGWSessionID,
			$value,
			$oldValue,
			$color?'tagcolor='.$color:''
		);
	}
	
	static public function deleteTag(&$oGWAccount,$uid)
	{
		$oldValue = base64_decode($uid);
		unset($_SESSION['tags'][$oldValue]);
		return $oGWAccount->gwAPI->FunctionCall(
			"DeleteTag",
			$oGWAccount->sGWSessionID,
			$oldValue
		);
	}
	
	static public function getAvailableFonts()
	{
		$file = dirname(__FILE__).
			'/../../../client/languages/'.
			$_SESSION['LANGUAGE'].
			'/fonts.xml';
		$fileen = dirname(__FILE__).
			'/../../../client/languages/'.
			'en'.
			'/fonts.xml';
		if(!file_exists($file)){
			$file = $fileen;
		}
		@$xml = slToolsXML::loadFile($file);
		if($xml){
			foreach($xml->item as $item){
				$itm['name'] = strval($item->name);
				$itm['family'] = strval($item->family);
				$result[] = $itm;
			}
		}
		return $result;
	}
	
	static public function parseDOMFilter($oDOMDoc,$oResource,$sPrefix = '')
	{
		if ($oDOMFilter = $oDOMDoc->getNode($sPrefix.':filter',$oResource)){
			 			if ($oDOMLimit = $oDOMDoc->getNode($sPrefix.":limit",$oDOMFilter)) {
				$aFilterTags['limit'] = $oDOMDoc->getNodeValue($sPrefix.':limit',$oDOMFilter);
			}
			if ($oDOMOffset = $oDOMDoc->getNode($sPrefix.':offset',$oDOMFilter)) {
				$aFilterTags['offset'] = $oDOMDoc->getNodeValue($sPrefix.':offset',$oDOMFilter);
			}
			if ($oDOMOrderBy = $oDOMDoc->getNode($sPrefix.':order_by',$oDOMFilter)) {
				$aFilterTags['orderby'] = $oDOMDoc->getNodeValue($sPrefix.':order_by',$oDOMFilter);
			}
			 			if ($oSQL = $oDOMDoc->getNode($sPrefix.':sql',$oDOMFilter)) {
				$aFilterTags['sql'] = $oDOMDoc->getNodeValue($sPrefix.':sql',$oDOMFilter);
			}
		}
		return $aFilterTags;
	}
	
	 
		

	static public function setAliases($aActions,$data)
	{
		$aliases = self::getAliases($deleteData);
		if($deleteData){
			self::removeObsoleteAliasData($aActions,$aliases,$deleteData,$data);
		}
		$result = $data[0];
		$personalityDelete = array();
		if(is_array($aActions))foreach($aActions as $action){
			switch($action['action']){
				case 'add':
					$user = $_SESSION['EMAIL'];
					$name = $_SESSION['FULLNAME']?$_SESSION['FULLNAME']:$_SESSION['DESCRIPTION'];
					$email = $action['data']['email'];
					$isDelegate = $action['data']['isdelegate']==1;
					$isLocalAndShared = false;
					 					$account = new IceWarpAccount();
					if($isDelegate){
						 						if(!$account->Open($email)){
							throw new Exc('delegate_not_exists');
						}
						try{
							$sharedInbox = $_SESSION['user']->getAccount($_SESSION['EMAIL'])->getFolder($_SESSION['SHARED_PREFIX'].$email.'/INBOX');
						
							$name = $account->getProperty('u_name');
							
							 							if($sharedInbox){
								$isLocalAndShared = true;
							}
						}catch (Exc $e){
							throw new Exc('delegate_no_shared_inbox');
						}
					}
						
					if($isLocalAndShared){
						Storage::confirmDelegateAlias($user,$email,$name);
						if($name){
							$result['@childnodes']['item'][$email]['@childnodes']['name'][0]['@value'] = $name;
							$action['dataTree']['@childnodes']['name'][0]['@value'] = $name;
							$action['data']['name']= $name;
						}
						$action['dataTree']['@childnodes']['isdelegate'][0]['@value'] = 1;
						$action['data']['isdelegate'] = 1;
						$result['@childnodes']['item'][$email] = $action['dataTree'];
						$result['@childnodes']['item'][$email]['@attributes']['uid'] = $email;
					}else{
						$hash = self::sendPersonalAliasConfirmation($user, $email, $name);
						$action['dataTree']['@childnodes']['timestamp'][0]['@value'] = time();
						$result['@childnodes']['item'][$email] = $action['dataTree'];
						$result['@childnodes']['item'][$email]['@attributes']['uid'] = $email;
					}
				case 'edit':
					 					$test = $action['data'];
					unset($test['#text']);
					unset($test['email']);
					if(count($test)>0){
						$result['@childnodes']['item'][$action['uid']] = $action['dataTree'];
					}
					break;
				case 'delete':
					if($action['action2'] && is_iterable($result['@childnodes']['item'][$action['uid']]['@childnodes'])){
						foreach($result['@childnodes']['item'][$action['uid']]['@childnodes'] as $key => $val){
							if($key!='email' && $key!='name'){
								unset($result['@childnodes']['item'][$action['uid']]['@childnodes'][$key]);
							}
						}
					}else{
						if($aliases[$action['uid']]['deleteable'] == 1) {
							$personalityDelete[] = $action['uid'];	
						} 
						unset($result['@childnodes']['item'][$action['uid']]);
					}
					break;
			}		
		}
		 		if (!empty($personalityDelete)){
			$account = createobject('account');
			$account->Open($_SESSION['EMAIL']);
			$path = $account->GetProperty('u_fullmailboxpath');
			$personalityfile =  $path.'personality.dat';
			$a = file($personalityfile);
			$savedata = '';
			foreach($a as $line){
				if (! in_array(trim($line),$personalityDelete)){
					$savedata.=$line.CRLF; 
				}
			}
			if($savedata){
				file_put_contents($path.'personality.dat', $savedata);
			}else{
				unlink($path.'personality.dat');
			}
		}
		return $result;
	}
	
	static public function getAliases(&$deleteData = false)
	{
		
		$userAliases = self::getUserAliases();
		$globalAliases = self::getGlobalAliases();
		$accountAliases = self::getAccountAliases();
		$personalAliases = self::getPersonalAliases();
		$aliasesData = self::getAliasesData();
	
		$aliases = $userAliases;
		unset($userAliases);
		foreach($globalAliases as $globalAlias){
			$aliases[slToolsPHP::htmlspecialchars($globalAlias['email'])] = $globalAlias;
		}
		foreach($accountAliases as $accountAlias){
			if(!isset($aliases[slToolsPHP::htmlspecialchars($accountAlias['email'])]['enabled'])){
				$aliases[slToolsPHP::htmlspecialchars($accountAlias['email'])]['enabled'] = $accountAlias['enabled'];
			}
			if($accountAlias['name']){
				$aliases[slToolsPHP::htmlspecialchars($accountAlias['email'])]['name'] = $accountAlias['name'];
			}
			$aliases[slToolsPHP::htmlspecialchars($accountAlias['email'])]['email'] = $accountAlias['email'];
		}
		foreach($personalAliases as $personalAlias){
			$aliases[slToolsPHP::htmlspecialchars($personalAlias['email'])] = $personalAlias;
		}
		if($aliasesData) foreach($aliasesData as $email => $alias){
			if(isset($aliases[$email])){
				foreach($aliasesData[$email] as $key =>$value){
					if($key=='hash' || $key=='needs_confirmation'){
						continue;
					}
					if($value!==''){
						$aliases[$email][$key] = $value;
					}
				}
			}else{
				$deleteData[$email]['alias'] = $alias;
				$deleteData[$email]['values'] = $aliasesData[$email];
			}
		}
		ksort($aliases);
		return $aliases;
	}
	
	static public function convertAliases($aliases)
	{
		if(is_array($aliases)) foreach($aliases as $aliasID => $alias){
			$i = 0;
			foreach($alias as $key => $value){
				$result[$aliasID]['variables'][$i]['key'] = $key;
				$result[$aliasID]['variables'][$i++]['value'] = $value;
			}
			$result[$aliasID]['email'] = $aliasID;
		}
		return $result;
	}
	
	static private function getAccountAliases()
	{
		$aliases = array();
		if($_SESSION['user']){
			$oUser = $_SESSION['user'];
			$aAccounts = $oUser->getAccounts();
		}
		if($aAccounts){
			foreach($aAccounts as $accountID => $oAccount){
				 				$aliases[slToolsPHP::htmlspecialchars($accountID)]['email'] = $oAccount->accountID;
				$aliases[slToolsPHP::htmlspecialchars($accountID)]['name'] = $oAccount->fullname?$oAccount->fullname:$oAccount->description;
				$aliases[slToolsPHP::htmlspecialchars($accountID)]['enabled'] = true;
			}
		}
		return $aliases;
	}
	
	static private function getUserAliases()
	{
		$aliases = array();
		$aAliases = $_SESSION['USER_ALIAS_LIST_ARRAY'];
		$fullname = $_SESSION['FULLNAME']?$_SESSION['FULLNAME']:$_SESSION['DESCRIPTION'];
		if($aAliases){
			foreach($aAliases as $sAlias)
			{
				$email = $sAlias;
				if($email==$_SESSION['EMAIL']){
					continue;
				}
				if($fullname){
					$aliases[slToolsPHP::htmlspecialchars($email)]['name'] = $fullname;
				}
				$aliases[slToolsPHP::htmlspecialchars($email)]['email'] = $email;
				$aliases[slToolsPHP::htmlspecialchars($email)]['enabled'] = true;
			}
		}
		return $aliases;
	}
	
	static public function getGlobalAliases()
	{
		$aliases = array();
		$global_aliases = self::getDefaults('groups');
		$domain_aliases = self::getDomainDefaults('groups',$_SESSION['DOMAIN']);
		
		$data = WebmailIqPublic::get('groups',$global_aliases,$domain_aliases,false,2);
		$account = new IceWarpAccount();
		$account->Open($_SESSION['EMAIL']);
		$available_groups = $account->getProperty('u_groupslist');
		$available_groups = Tools::explode_j(';',$available_groups);
		if(@$items = $data['@childnodes']['item']){
			foreach($items as $globalAlias){
				
				$email = str_replace(array('&gt;','&lt;'),'',$globalAlias['@childnodes']['group'][0]['@value']);
				if(!in_array($email,$available_groups)){
					continue;
				}
				$name = $globalAlias['@childnodes']['name'][0]['@value'];
				$aliases[slToolsPHP::htmlspecialchars($email)]['email'] = $email;
				if($name){
					$aliases[slToolsPHP::htmlspecialchars($email)]['name'] = $name;
				}
				$aliases[slToolsPHP::htmlspecialchars($email)]['enabled'] = true;
			}
		}
		return $aliases;
	}
	
	static public function getAliasesData()
	{
		$aliasesData = array();
		$aliases_data = self::getUserData('aliases_data');
		if(@$aliases_data = $aliases_data['@childnodes']['item']){
			foreach($aliases_data as $alias_data){
				$email = $alias_data['@attributes']['uid'];
				$aliasData = array();
				foreach($alias_data['@childnodes'] as $variable => $value){
					$aliasData[$variable] = $value[0]['@value'];
				}
				$aliasesData[slToolsPHP::htmlspecialchars($aliasData['email'])] = $aliasData;
			}
		}
		return $aliasesData;
	}

	public static function checkAliases(CacheAccount $account)
	{
		$path = $_SESSION['USERDIR'] . SETTINGS_FOLDER . SETTINGS_FILE . storeageext;
		if(!file_exists($path)) return;
		$simpleXml = simplexml_load_file($path);
		$personalityFile = $_SESSION['USERDIR'] . 'personality.dat';
		$personality = false;
		$contents = '';
		if(file_exists($personalityFile)){
			$personality = true;
			$contents = file_get_contents($personalityFile);
		}
        if(!isset($simpleXml->aliases_data->item)) return;
        foreach ($simpleXml->aliases_data->item as $item) {
			if($item->isdelegate != '1' || $account->getMyRights('~'.$item->email.'/INBOX') !== 0) continue;
            slToolsXML::removeFromXmlByChildValues($path, ['email' => $item->email, 'isdelegate' => 1], 'aliases_data/item');
			if(!$personality) continue;
			$contents = preg_replace('/'. $item->email . '\n?\r?/', '', $contents);
		}
        if(!$personality) return;
		$contents = trim($contents);
        if(!empty($contents)){
        	file_put_contents($personalityFile, $contents);
		}else{
        	unlink($personalityFile);
		}
	}
	
	static public function confirmDelegateAlias($user,$email,$name)
	{
		$account = createobject('account');
		if(!$account->Open($user)){
			throw new Exc('personality_confirmation_invalid_user');
		}
		$path = $account->getProperty('u_fullmailboxpath');
		
		 		$personalitiesFile = $path.'personality.dat';
		@$personalities = explode(CRLF,file_get_contents($personalitiesFile));
		foreach($personalities as $personality){
			if($personality){
				$result[$personality] = $personality;
			}
		}
		$result[$email] = $email;
		@file_put_contents($personalitiesFile,join(CRLF,$result));

		 		 

	}

	static public function confirmPersonalAlias($user,$email,$hash)
	{
		$account = createobject('account');
		if(!$account->Open($user)){
			throw new Exc('personality_confirmation_invalid_user');
		}
		$path = $account->GetProperty('u_fullmailboxpath');
		$settingFile = $path.SETTINGS_FOLDER.SETTINGS_FILE.storeageext;
		
		if(file_exists($settingFile)){
			$xml = slToolsXML::loadFile($settingFile);
			$aliases_data = $xml->aliases_data;
			if($aliases_data->item){
				foreach($aliases_data->item as $item){
					if(strval($item['uid'])==$email){
						$hash_check = urldecode(strval($item->hash));
					}
				}
			}
			$check['user'] = $user;
			$check['email'] = $email;
			$check['action'] = 'confirm_personality';
			$hash_check = MerakGWAPI::createURLLine($check);
			$hash_check = rawurlencode(base64_encode(gzcompress($hash_check)));
			$check['hash'] = $hash_check;
			$hash_check = MerakGWAPI::createURLLine($check);
			$hash_check = base64_encode(gzcompress($hash_check));
			$hash_check = $hash_check.md5(WebmailIqAuth::getServerData('private'));
			
			if($hash!=$hash_check){
				throw new Exc('personality_confirmation_invalid_hashid');
			}else{
				$personalitiesFile = $path.'personality.dat';
				@$personalities = explode(CRLF,file_get_contents($personalitiesFile));
				foreach($personalities as $personality){
					if($personality){
						$result[$personality] = $personality;
					}
				}
				$result[$email] = $email;
				@file_put_contents($personalitiesFile,join(CRLF,$result));
				 				$aAction['uid'] = $email;
				$aAction['action'] = 'delete';
				$aAction['action2'] = true; 
				$aActions[] = $aAction;
				$return = Storage::getUserData(false,$path.SETTINGS_FOLDER);
				$settings['aliases_data'] = Storage::setAliases($aActions,$return['@childnodes']['aliases_data']);
				foreach ($settings as $key => $value){
					$return['@childnodes'][$key][0] = $value;
				}
				$return = Tools::makeXMLStringFromTree($return, 'settings',true);
				Storage::setUserDataStr($return,'settings',$path);
			}
		}
	}
	static public function getNoTitleLabel()
	{
		 		$language = $_SESSION['LANGUAGE'];
		if(!self::$language[$language]){
			self::$language[$language] = slToolsXML::loadFile(
					dirname(__FILE__).
					'/../../../client/languages/'.
					$language.
					'/data.xml'
			);
		}
		return self::$language[$language]->event_view->no_title;
	}	
	static private function sendPersonalAliasConfirmation($user,$email,$name = "")
	{
		 		$language = $_SESSION['LANGUAGE'];
		if(!self::$language[$language]){
			self::$language[$language] = slToolsXML::loadFile(
					dirname(__FILE__).
					'/../../../client/languages/'.
					$language.
					'/data.xml'
			);
		}
		 		$api = createobject('api');
		$webmail_url = $_SERVER['HTTP_REFERER'] ?? $api->getProperty('c_webmail_url');
		$sPrivateKey = WebmailIqAuth::getServerData('private');
		$pathdata['user'] = $user;
		$pathdata['email'] = $email;
		$pathdata['action'] = 'confirm_personality';
		$sHash = MerakGWAPI::createURLLine($pathdata);
		$sHash = rawurlencode(base64_encode(gzcompress($sHash)));
		$pathdata['hash'] = $sHash;
		$sHash = MerakGWAPI::createURLLine($pathdata);
		$sHash = rawurlencode(base64_encode(gzcompress($sHash)));
		$sHash = $sHash.md5($sPrivateKey);
		
		$url = $webmail_url.'?action=confirm_personality&user='.urlencode($user).'&email='.urlencode($email).'&hash='.urlencode($sHash);
		 		$body = self::$language[$language]->confirmation->alias_confirmation;
		$body = str_replace('%email%',$email,$body);
		$body = str_replace('%username%',$name?$name:$user,$body);
		if(strpos($body,'%url%')!==false){
			$body = str_replace('%url%',$url,$body);
		}else{
			$body.= CRLF.$url;
		}
		$subject = self::$language[$language]->confirmation->alias_subject;
		$subject = str_replace('%email%',$email,$subject);
		$subject = str_replace('%username%',$name?$name:$user,$subject);
		
		 		$mail = new Mail();
		$mail->XMailer.='-Storage';
		$mail->setFrom($user,$name);
		$mail->addTo($email);
		$mail->setSubject($subject);
		$mail->setBody($body);
		$hash = wordwrap($sHash,75,"\n\t",true);
		$mail->addHeader('X-IceWarp-Personality-Request: user="'.urlencode($user).'";'."\r\n\t".' email="'.urlencode($email).'";'."\r\n\t".' hash="'.$hash.'"');
		try{
			$mail->send();
		}catch(Exc $e){
			
		}
		return $sHash;
	}
	
	static public function confirmResetPassword($user, $hash, $userdir)
	{
		$check['user'] = $user;
		$check['action'] = 'reset_password';
		if(!file_exists($userdir.'resetpwd.dat')){
			throw new Exc('reset_password_uid_file');
		}
		$check['salt'] = file_get_contents($userdir.'resetpwd.dat');

		$hash_check = MerakGWAPI::createURLLine($check);
		$hash_check = rawurlencode(base64_encode(gzcompress($hash_check)));
		$check['hash'] = $hash_check;
		
		$hash_check = MerakGWAPI::createURLLine($check);
		$hash_check = base64_encode(gzcompress($hash_check));
		$hash_check = rawurlencode($hash_check).md5(WebmailIqAuth::getServerData('private'));

		if($hash!=$hash_check){
			throw new Exc('reset_password_invalid_hashid');
		}else{		
			return true;
		}
	}

	 
	static public function sendResetPasswordConfirmation($user, $email, $maildir, $language, $name = "")
	{
		log_buffer('Depricated method used: server/inc/storage/storage.php -> sendResetPasswordConfirmation()','SUMMARY');
		 		 
		$mail = new Mail();
		$mail->XMailer.='-Storage';
		 		$aDomain = Storage::getDomainDefaults('global_settings');
		$aGlobal = Storage::getDefaults('global_settings');
		$aData = WebmailIqPublic::get('global_settings',$aGlobal,$aDomain,false);
		$sSMTPServer = strval($aData['@childnodes']['item'][0]['@childnodes']['smtpserver'][0]['@value']);
		$sSMTPPort = strval($aData['@childnodes']['item'][0]['@childnodes']['smtpport'][0]['@value']);
		
		if($sSMTPServer){
			$mail->Host = $sSMTPServer;
		}
		if($sSMTPPort){
			$mail->Port = $sSMTPPort;
		}
		 		$server = Storage::getDefaults('reset_settings');
		$domain = Storage::getDomainDefaults('reset_settings');
		$settings = WebmailIqPublic::get('reset_settings', $server, $domain, false);
		$settings = $settings['@childnodes']['item'][0]['@childnodes'];
		 		if($settings['enabled'][0]['@value']!=1){
			throw new Exc('reset_disabled','reset_disabled');
		}
		$body = $settings['mail'][0]['@value'];
		$subject = $settings['subject'][0]['@value'];
		
		if(!$body || !$subject){
			if(!$language){
				$server = Storage::getDefaults('layout_settings');
				$domain = Storage::getDomainDefaults('layout_settings');
				$layout = WebmailIqPublic::get('layout_settings', $server, $domain, false );
				$layout = $layout['@childnodes']['item'][0]['@childnodes'];
				$language = $layout['language'][0]['@value'];
				$language = $language ? $language : 'en';
			}
			$languageFile = '../client/languages/'.$language.'/data.xml';
			$languageXML = slToolsXML::loadFile($languageFile);
			if(!$body){
				$body = strval($languageXML->reset_pass->email);
			}
			if(!$subject){
				$subject = strval($languageXML->reset_pass->subject);
			}
		}
		 		$api = createobject('api');
		$account = createobject('account');
		$account->Open($user);
		$password = $account->GetProperty('u_password');
		$webmail_url = $api->getProperty('c_webmail_url');
		$sPrivateKey = WebmailIqAuth::getServerData('private');
		$pathdata['user'] = $user;
		$pathdata['action'] = 'reset_password';
		$pathdata['salt'] = Tools::my_uniqid('WMResetPwd',true);
		if(!is_dir($maildir.'~webmail/')){
			slToolsFilesystem::mkdir_r($maildir.'~webmail/');
		}
		if(!file_put_contents($maildir.'~webmail/resetpwd.dat',$pathdata['salt'])){
			throw new Exc('reset_password_uid_file');
		}
		$sHash = MerakGWAPI::createURLLine($pathdata);
		$sHash = rawurlencode(base64_encode(gzcompress($sHash)));
		$pathdata['hash'] = $sHash;
		$sHash = MerakGWAPI::createURLLine($pathdata);
		$sHash = rawurlencode(base64_encode(gzcompress($sHash)));
		$sHash = $sHash.md5($sPrivateKey);
		
		$url = $webmail_url.'?resetpwd=1&user='.urlencode($user).'&hash='.urlencode($sHash);
		 		 		$body = str_ireplace('%email%',$user,$body);
		$body = str_ireplace('%username%',$name ? $name : $user, $body);
		$body = str_ireplace('%fullname%',$name ? $name : $user, $body);
		 		if(strpos($email,'sms:')!==false){
			$body = str_ireplace('%password%',$password,$body);
			$subject = str_ireplace('%password%',$password,$subject);
		}
		if(stripos($body,'%url%')!==false){
			$body = str_ireplace('%url%',$url,$body);
		}else{
			$body.= CRLF.$url;
		}
		 		$subject = str_ireplace('%email%',$user,$subject);
		$subject = str_ireplace('%username%',$name?$name:$user,$subject);
		$subject = str_ireplace('%fullname%',$name?$name:$user,$subject);
		 		$mail->setSendMode('string');
		$mail->setFrom($user,$name);
		$mail->addTo($email);
		$mail->setSubject($subject);
		$mail->setBody($body);
		$hash = wordwrap($sHash,75,"\n\t",true);
		$mail->addHeader('X-IceWarp-Reset-Password: user="'.urlencode($user).'";'."\r\n\t".' hash="'.urlencode($hash).'"');
		$mail->send();
		

		return $sHash;
	}
	
	
	static public function confirmGuestInvite($email, $hash)
	{
		$api = IceWarpAPI::instance(APP_MAINTENANCE_IDENTITY?APP_MAINTENANCE_IDENTITY:'webclient/confirm_guest_invite');
		$gw = new IceWarpGWAPI('webclient/confirm_guest_invite');
		$gw->user = $api->GetProperty('C_GW_SuperUser');
		$gw->setPassword($api->GetProperty('C_GW_SuperPass'));
		$gw->Login();
		$gw->OpenGroup('*');
		if(!$gw->FunctionCall('CheckGuestSignature',$gw->gid,"0",'email='.urlencode($email).'&hash='.$hash)){
			throw new Exc('guest_invalid_hash','guest_invalid_hash');
		}
		
		return true;		
	}
	
	static public function verifyGuest($email, $hash)
	{
		$api = IceWarpAPI::instance(APP_MAINTENANCE_IDENTITY?APP_MAINTENANCE_IDENTITY:'webclient/confirm_guest_invite');
		$gw = new IceWarpGWAPI('webclient/verify_guest_invite');
		$gw->user = $api->GetProperty('C_GW_SuperUser');
		$gw->setPassword($api->GetProperty('C_GW_SuperPass'));
		$gw->Login();
		$gw->OpenGroup('*');
		if(!$gw->FunctionCall('CheckGuestSignature',$gw->gid,"1",'email='.urlencode($email).'&hash='.$hash)){
			throw new Exc('guest_invalid_hash','guest_invalid_hash');
		}
		
		return true;	
	}
	
	static private function removeObsoleteAliasData(&$aActions,$currentData,$obsoleteData,&$data)
	{
		if($aActions) foreach($aActions as $key => $aAction){
			$email = $aAction['uid'];
			if(isset($obsoleteData[$email])||!isset($currentData[$email])){
				if($aActions[$key]['action']!='add'){
					unset($aActions[$key]);
				}
			}
		}
		if(@$data[0]['@childnodes']['item']){
			foreach($data[0]['@childnodes']['item'] as $key => $dataItem){
				$email = $key;
				
				$timestamp = $data[0]['@childnodes']['item'][$key]['@childnodes']['timestamp'][0]['@value'];
				if($timestamp){
					if($timestamp + 86400*30 > time()){
						continue;
					}
				}
				if(isset($obsoleteData[$email]) || !isset($currentData[$email])){
					unset($data[0]['@childnodes']['item'][$key]);
				}
			}
		}
	}
	
	static public function getPersonalAliases()
	{
		$result = array();
		$path = $_SESSION['USERDIR'];
		$personalitiesFile = $path.'personality.dat';
		@$personalities = explode(CRLF,file_get_contents($personalitiesFile));
		if($personalities) foreach($personalities as $personality){
			if($personality){
				$result[slToolsPHP::htmlspecialchars($personality)]['email'] = $personality;
				$result[slToolsPHP::htmlspecialchars($personality)]['enabled'] = 1;
				$result[slToolsPHP::htmlspecialchars($personality)]['deleteable'] = 1;
			}
		}
		return $result;
	}
	
	static public function translateSignature(GroupWareAccount &$oGWAccount,$signature, $mycarddata = false)
	{
		 		if($mycarddata){
			$item = $mycarddata;
		}else{
			try{
				$oMyCardFolder = $oGWAccount->getMyCardFolder();
				$oMyCard = $oMyCardFolder->getItem('@@mycard@@',WITH_ADDONS);
				
				$item = $oMyCard->item;
			
				$locations = $oMyCard->aAddons['location']->getData();
				if($locations) foreach($locations as $location){
					switch($location['LCTTYPE']){
						case 'H':
							$item = slToolsPHP::array_merge($item,$location);
							break;
						case 'B':
							foreach($location as $lctProperty=>$lctValue){
								$item['BUSINESS'.$lctProperty] = $lctValue;
							}
							break;
					}
				}
				
			}catch(Exc $e){
				$item = array();
			}
		}
		foreach(self::$signatureTranslate as $key => $translate){
			switch($key){
				case 'phonesip':
						$sip = $item['LCTPHNOTHER'];
						if(stripos($sip,'sip:') !== false){
							$sip = preg_replace('/sip:/','',$sip,1);	
						}else{
							$sip = '';
						}
						$signature = str_ireplace('%'.$key.'%', $sip, $signature);
						$templateData['phonesip'] = $sip;
					break;
				case 'fullname':
					$fullname = $item['ITMTITLE'].' '.
								$item['ITMFIRSTNAME'].' '.
								$item['ITMMIDDLENAME'].' '.
								$item['ITMSURNAME'].' '.
								$item['ITMSUFFIX'];
					$fullname = slToolsPHP::htmlspecialchars($fullname);
					$signature = str_ireplace('%'.$key.'%', strip_tags($fullname), $signature);
					$templateData['fullname'] = $fullname;
					break;
				default:
					$templateData[$key] = slToolsPHP::htmlspecialchars(strip_tags($item[$translate] ?? ''));
					$signature = str_ireplace('%'.$key.'%', $templateData[$key], $signature);
					break;
			}
		}
		 		$signature = preg_replace("/\?sid=([^&\s\"']{0,})('|\"|\s|&)/si","?sid=".$_SESSION['SID']."$2",$signature);
		 		$signature = preg_replace("/\&amp;fullpath=({account})(%2F[^&\s\"']{0,})/si","&amp;fullpath=".urlencode($_SESSION['EMAIL'])."$2",$signature);
		$signature = template($signature,$templateData,true);

		return $signature;
	}
	
	static public function setWholeArray($aActions)
	{
		if($aActions) foreach($aActions as $key => $aAction){
			$result['@childnodes']['item'][$key] = $aAction['dataTree'];
		}
		return $result;
	}
	
	static public function getSignatures($oGWAccount,$domain = false, $mycarddata = false)
	{
		$resource = 'signature';
		$user = Storage::getUserData($resource);
		$domain = Storage::getDomainDefaults($resource, $domain);
		$default = Storage::getDefaults($resource);
		$data = WebmailIqPublic::get($resource,$default,$domain,array(),2);
		$signature = $data['@childnodes']['item'][0]['@childnodes']['text'][0]['@value'] ?? null;
		$access = 	$data['@childnodes']['item'][0]['@childnodes']['text'][0]['@attributes']['useraccess'] ?? null;
		$userSignatures = $user['@childnodes']['item'] ?? null;
		$defaultUserSignature = false;
		$signature = Storage::translateSignature($oGWAccount,$signature, $mycarddata);
		if($userSignatures) foreach($userSignatures as $key => $value){
			$skip = false;
			if(!isset($value['@childnodes']['id'][0]['@value'])){	
				$defaultUserSignature = true;
				if($signature && !$value['@childnodes']['text'][0]['@value'] || $access=='view'){
					$skip = true;
					$user['@childnodes']['item'][$key]['@childnodes']['text'][0]['@value'] = $signature;
					$user['@childnodes']['item'][$key]['@childnodes']['text'][0]['@attributes']['access'] = $access;
				}	
			}
			if(!$skip){
				$signature = $user['@childnodes']['item'][$key]['@childnodes']['text'][0]['@value'];
				$signature = Storage::translateSignature($oGWAccount,$signature, $mycarddata);
				$user['@childnodes']['item'][$key]['@childnodes']['text'][0]['@value'] = $signature;
			}
		}
		if(!$defaultUserSignature){
			$itm['@childnodes']['text'][0]['@value'] = $signature;
			$itm['@childnodes']['text'][0]['@attributes']['access'] = $access;
			$user['@childnodes']['item'][] = $itm;
		}
		return $user;
	}

	 
	public static function setUserAutoclearSpamDays($sUser, $iAutoclearSpamDays) {
		$oIcewarpAccount = createobject('account');
		$oIcewarpAccount->Open($sUser);
		$result = $oIcewarpAccount->SetProperty('U_SpamDeleteOlder', $iAutoclearSpamDays);
		$result2 = $oIcewarpAccount->Save();
	}

	 
	public static function getUserAutoclearSpamDays($sUser) {
		$oIcewarpAccount = createobject('account');
		$oIcewarpAccount->Open($sUser);
		$iAutoclearSpamDays = $oIcewarpAccount->GetProperty('U_SpamDeleteOlder');
		return $iAutoclearSpamDays;
	}

	 
	public static function setDomainAutoclearSpamDays($sDomain, $iAutoclearSpamDays) {
		$oIcewarpDomain = createobject('domain');
		$oIcewarpDomain->Open($sDomain);
		$result = $oIcewarpDomain->SetProperty('D_SpamDeleteOlder', $iAutoclearSpamDays);
		$result2 = $oIcewarpDomain->Save();
	}

	 
	public static function getDomainAutoclearSpamDays($sDomain) {
		$oIcewarpDomain = createobject('domain');
		$oIcewarpDomain->Open($sDomain);
		$iAutoclearSpamDays = $oIcewarpDomain->GetProperty('D_SpamDeleteOlder');
		return $iAutoclearSpamDays;
	}
}
?>
