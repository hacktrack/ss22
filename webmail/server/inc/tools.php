<?php

function lang_compare($a,$b)
{
	return strcasecmp($a['name'],$b['name']);
}

function skin_sort($a,$b)
{
	if($a['name']=='Default'){
		return -1;
	}else if ($b['name']=='Default'){
		return 1;
	}else{	
		return strcasecmp($a['name'],$b['name']);
	}
}

function br2nl($str) {
	$str = preg_replace("#<br>#", "\r\n", $str);
	$str = preg_replace("#<br />#", "\r\n", $str);
	$str = preg_replace("#<br/>#", "\r\n", $str);
	return $str;
}

class Tools
{
	private static $host_domain;
	
	 
	public static function validateTemp($path)
	{
		 		return true;
	}

	
	public static function isIE()
	{
		$agent = $_SERVER['HTTP_USER_AGENT'];
		if ((strpos($agent,'MSIE') !== false || strpos($agent,'Trident') !== false) && strpos($agent,'Opera') === false) {
			return true;
		} else {
			return false;
		}
	}
	
	public static function sendFileHeaders($fileName, $length, $contentType,$charSet = false, $noattachment = false)
	{
		if (Tools::isIE()){
			 			 			 
			$fileName = rawurlencode($fileName);
		}
		$fileName = str_replace('"','\"',$fileName);
		header('Pragma: ');		 		header('Cache-Control: ');  		if($charSet){
			$contentType = $contentType.'; charset='.$charSet;
		}
		header('Content-Type: ' . $contentType);
		if(!$noattachment){
			header('Content-Disposition: attachment; filename="' . $fileName . '"');
		}
		if($length) {
			header('Content-Length: ' . $length);
		}
	}
	public static function removeHTML($message,$maxlen = false)
	{
		return slToolsString::removeHTML($message,$maxlen);
	}
	public static function dotConvert($value)
	{
		if ($value) {
			if ($value[0] == ".") {
				$value = "." . $value; 
			}
		}
		return str_replace("\n.", "\n.." , $value);
	}
	public static function cr2crlf($string)
	{
		$string = str_replace("\x0D", "", $string);
		return str_replace("\x0A", "\x0D\x0A", $string);
	}
	public static function lf2crlf($string)
	{
		$string = str_replace(CRLF, LF, $string);
		$string = str_replace(CR, LF, $string);
		return str_replace(LF, CRLF, $string);
	}
	 
	public static function isabovechar($string)
	{
		for ($i = 0; $i < strlen($string); $i++) {
			if (ord($string[$i]) > 127) {
				return true;
			}
		}
		return false;
	}
	public static function fillstr($str, $size, $char)
	{
		if (strlen($str) > $size) {
			return substr($str, 0, $size);
		}
		$value = $str;
		for ($i = strlen($str); $i < $size; $i++) {
			$value = $char . $value;
		}
		return $value;
	}
	 
	public static function makeXMLTags($item,$tags = '*')
	{
		$return = '';
		$tags = strtolower($tags);
		$tags = explode(",",$tags);
		if (is_array($item)) {
			foreach ($item as $tag => $value) {
				$tag = strtolower($tag);
				 				if ($tags[0]!='*' && !in_array($tag,$tags)) {
					continue;
				}
				if (isset($value) && $value !== '') {
					$return.='<'.$tag.'>'.@slToolsPHP::htmlspecialchars(trim($value)).'</'.$tag.'>';
				} else {
					$return.='<'.$tag.'/>';
				}
			}
		}
		return $return;
	}
	 
	public static function makeArrayFromXML($oXMLNode,$bBlankTags = false)
	{
		$itm = array();
		if (is_object($oXMLNode) && $oXMLNode->hasChildNodes()) {
			foreach ($oXMLNode->childNodes as $node) {
				if ($node->nodeValue !== '' || $bBlankTags) {
					$itm[strtolower($node->nodeName)] = $node->nodeValue;
				}
			}
		}
		return $itm;
	}
	public static function makeTreeFromXML($oXMLNode,$encode = false)
	{
		$itm = array();
		if (is_object($oXMLNode) && $oXMLNode->hasAttributes()) {
			foreach($oXMLNode->attributes as $attr) {
				if($encode){
					$itm['@attributes'][$attr->name] = slToolsPHP::htmlspecialchars($attr->value);
				}else{
					$itm['@attributes'][$attr->name] = $attr->value;
				}
			}
		}
		$oldname ='';
		if (is_object($oXMLNode) && $oXMLNode->hasChildNodes()) {
			foreach($oXMLNode->childNodes as $node) {
				 				if ($oldname != $node->nodeName) {
					$nCount = 0;
				}
				$oldname = $node->nodeName;
				if ($node->nodeName=='#text') {
					
					if($encode){
						$itm['@value'] = slToolsPHP::htmlspecialchars($node->nodeValue);
					}else{
						$itm['@value'] = $node->nodeValue;
					}
				} else {
					if ($node->hasAttributes() && $uid = $node->getAttribute('uid')) {
						$itm['@childnodes'][strtolower($node->nodeName)][$uid] = self::makeTreeFromXML($node, $encode);
					} else {
						$itm['@childnodes'][strtolower($node->nodeName)][$nCount++] = self::makeTreeFromXML($node, $encode);
					}
				}
			}
		}
		return $itm;
	}

	 
	static public function utf8_bad_replace($input, $replace = ' ', $fixForXML = false)
	{
		return slToolsXML::utf8_bad_replace($input, $replace, $fixForXML);
	}

	 
	public static function str2JSArrayNew($xmlString) {
		$xml = self::getXmlFromString($xmlString);
		$array = Tools::xmlToArray($xml);
		return json_encode($array);
	}

	 
	public static function getXmlFromString($xmlString) {
		return slToolsXML::getXmlFromString($xmlString);
	}

	 
	public static function xmlToArray($xml) {

		$attributesArray = array();
		foreach ($xml->attributes() as $attributeName => $attribute) {
			$attributesArray[strtoupper($attributeName)] = (string) $attribute;
		}

		$tagsArray = array();
		foreach ($xml->children() as $childXml) {
			$childArray = Tools::xmlToArray($childXml);
            foreach ($childArray as $childTagName => $childProperties) {
                if (!isset($tagsArray[$childTagName])) {
                    $tagsArray[$childTagName] = $childProperties;
                }
                else {
                    $tagsArray[$childTagName][] = $childProperties[0];
                }
			}
		}

		$textContentArray = array();
		$plainText = (string) $xml;
		if ($plainText !== '') {
			$textContentArray['VALUE'] = $plainText;
		}

		$attributesArrayWrap = count($attributesArray) < 1 ? array() : array('ATTRIBUTES' => $attributesArray);
		$propertiesArray = array_merge($tagsArray, $textContentArray, $attributesArrayWrap);

		return array(
			strtoupper($xml->getName()) => array($propertiesArray)
		);
	}

	 
	public static function str2JSArray(&$xmlString) {
		$array = array();
		$xml = self::getXmlFromString($xmlString);
		$rootName = strtoupper(@dom_import_simplexml($xml)->nodeName);
		self::makeJSArray($xml, $array[$rootName][0]);
		if ($array[$rootName][0]) {
			$result =  json_encode($array);
		} else {
			$result =  false;
		}
		return $result;
	}

	public static function fixXML($XMLString)
	{
		return slToolsXML::fixXML($XMLString);
	}

	 
	private static function makeJSArray(&$parent, &$output) 
	{
		$hasChild = false;
		if ($parent) {
			foreach ($parent->children() as $name => $child) {
				$output2 = &$output[strtoupper($name)][];
				self::makeJSArray($child, $output2);
				$hasChild = true;
			}
		}
		if (($value = (string)$parent)!='') {
			$output['VALUE'] = $value;
		} else {
			if (!$hasChild) {
				$output = array();
			}
		}
		if ($parent) {
			foreach ($parent->attributes() as $attName => $attValue) {
				$output['ATTRIBUTES'][strtoupper($attName)] = (string)$attValue;
			}
		}
	}
	public static function makeXMLStringFromTree($aArray,$sTagName = 'documentElement',$specialchar = false)
	{
		 		$sStart = $sEnd = $sValue = $sReturn = $sAttributes = '';
		 		if (isset($aArray['@attributes'])) {
			foreach($aArray['@attributes'] as $attname => $attvalue) {
				$sAttributes.=' '.$attname.'="'.($specialchar?slToolsPHP::htmlspecialchars($attvalue):$attvalue).'"';
			}
		}
		 		if (isset($aArray['@childnodes'])) {
			foreach($aArray['@childnodes'] as $chName => $chValue) {
				foreach($chValue as $chVal) {
					$sValue.= Tools::makeXMLStringFromTree($chVal,$chName,$specialchar);
				}
			}
		}
		 		if (isset($aArray['@value'])) {
			$sValue .= ($specialchar?slToolsPHP::htmlspecialchars($aArray['@value']):$aArray['@value']);
		}
		 		if (!isset($aArray['@value']) && !isset($aArray['@childnodes'])) {
			$sReturn = '<'.$sTagName.$sAttributes.'/>';
		} else {
			$sReturn = '<'.$sTagName.$sAttributes.'>'.$sValue.'</'.$sTagName.'>';
		}
		return $sReturn;
	}
	public static function binary2decimal($num)
	{
		$dec = 0;
		for ($i=0;$i<sizeof($num);$i++) {
			$dec+=pow(2,$i)*$num[$i];
		}
		return $dec;
	}
	public static function decimal2binary($num,$length = 7)
	{
		$i = 0;
		while ($num!=0) {
			$binary[$i++] = $num%2;
			if (($num - $num%2)!=0) {
				$num = ($num - $num%2)/2;
			} else {
				$num = 0;
			}
		}
		while (count(@$binary)<$length) {
			$binary[$i++] = 0;
		}
		return $binary;
	}
	public static function securePath($path)
	{
		return slToolsFilesystem::securePath($path);
	}
	public static function createURL($array) 
	{
		if(!is_array($array)) { 
			return '';
		}
		$result = '';
		$first = true;
		if (is_array($array))
		{
			foreach($array as $k => $v) {
				if ($first) {
					$first = false;
				} else {
					$result .= '&';
				}
				$result .= $k. "=" . urlencode($v);
			}
		}
		return $result;
	}
	public static function parseURL($line)
	{
		if (!$line) {
			return array();
		}
		$result = array();
		$fields = explode("&", $line);
		 		if($fields) foreach ($fields as $item) {
			$pos = strpos($item, '=');
			if ($pos === false) {
				continue;
			}
			$key = substr($item, 0, $pos);
			$value = substr($item, $pos+1);
			$result[$key] = urldecode($value);
		}
		return $result;
	}
	 	 	 	public static function explode_j($sep,$string)
	{
		$return = explode($sep,$string);
		unset($return[count($return)-1]);
		return $return;
	}
	public static function parseFullPath($fullPath,$class)
	{
	    if($class == 'item' && $fullPath[0] == '@') $class = 'special';
		switch($class) {
			 			case 'image':
			case 'uploaded_certificate':
			case 'file':
				$lastSlash = strrpos($fullPath,"/");
				$attData['item'] = substr($fullPath,$lastSlash+1);
				$attData['folder'] = substr($fullPath,0,$lastSlash);
				break;
			case 'exportvcard':
				$info = explode("/",$fullPath,2);
				$attData['account'] = $info[0];
				$attData['folder'] = $info[1];
				break;
			case 'exportcsv':
				 
			 			case 'email_certificate':
			case 'file_attachment':
			case 'itemlink':
			case 'allattachments':
			case 'itemhtml':
			case 'itemtext':
			case 'item':
			case 'itemticket':
			case 'message':  			 				$lastSlash = strrpos($fullPath,"/");
				$firstSlash = strpos($fullPath,"/");
				$attData['item'] = substr($fullPath,$lastSlash+1);
				$attData['account'] = substr($fullPath,0,$firstSlash);
				$attData['folder'] = substr($fullPath,$firstSlash+1,$lastSlash-$firstSlash-1);
				break;
			 			case 'document':
			case 'contact_certificate':
			case 'teamchat_attachment':
			case 'teamchat_cid':
			case 'attachment':
			case 'gwattachment':
			case 'cid':
			case 'url':
			case 'attachmentticket':
			case 'revision':
				$lastSlash = strrpos($fullPath,"/");
				$preLastSlash = strrpos(substr($fullPath,0,$lastSlash),"/");
				$firstSlash = strpos($fullPath,"/");
				$attData['part'] = substr($fullPath,$lastSlash+1);
				$attData['item'] = substr($fullPath,$preLastSlash+1,$lastSlash-$preLastSlash-1);
				$attData['account'] = substr($fullPath,0,$firstSlash);
				$attData['folder'] = substr($fullPath,$firstSlash+1,$preLastSlash-$firstSlash-1);
				break;
			 
			 			case 'groupware':
				$attData['account'] = $fullPath;
				break;
			 			case 'captcha':
				$attData['uid'] = $fullPath;
				break;
			 			case 'ticket':
				$attData = gzuncompress(base64_decode(rawurldecode($fullPath)));
				$attData = MerakGWAPI::ParseURLLine($attData);
			break;
			case 'personal_certificate':
				$attData['cid'] = $fullPath;
			break;
			 			case 'socks':
				$info = explode('/',$fullPath);
				$attData['name'] = $info[0];
				$attData['size'] = $info[1];
				$attData['socket'] = $info[2];
				break;
			case 'raw':
				$attData['content'] = $fullPath;
				break;
			case 'logo':
			case 'jitsi_logo':
			case 'background':
			case 'icechat_background':
				$attData['host'] = $fullPath;
				break;
			case 'smiley':
				$attData['path'] = $fullPath;
			break;
			case 'two_factor_qr':
				$attData['code'] = $fullPath;
			break;
            case 'special':
                if(!preg_match('/^(?P<account>[^\\/]+)\\/(?P<folder>.*)\\/(?P<item>[^\\/]+)$/', $fullPath, $attData)) throw new Exc(404, 'File not found');
                break;
			default:
				throw new Exc('class_unknown',$class);
				break;
		}
		return $attData;
	}
	 
	 
	
	static public function fixSpace($string,$inout = 'out')
	{
		if($inout=='out'){
			$string = str_replace(">\r\n",">",$string);
			$string = str_replace("\r\n<","<",$string);
			$string = str_replace(">\n",">",$string);
			$string = str_replace("\n<","<",$string);
		}
		return $string;
	}
	public static function convertLFtoCRLF($string)
	{
		$string = str_replace("\r","",$string);
		return str_replace("\n","\r\n",$string);
	}
	
	
	static public function htmlspecialchars_array($array)
	{
		if (is_array($array)) {
			foreach($array as $key => $val) {
				if (is_array($val)) {
					$return[$key] = slToolsPHP::htmlspecialchars_array($val);
				} else {
					$return[$key] = slToolsPHP::htmlspecialchars($val);
				}
			}
            return $return;
		}
        return slToolsPHP::htmlspecialchars($array);
	}

	static public function unhtmlspecialchars($string)
	{
		$trans_tbl = get_html_translation_table (HTML_SPECIALCHARS);
		$trans_tbl = array_flip ($trans_tbl);
		return strtr ($string, $trans_tbl);
	}

	static public function unhtmlspecialchars_array($array)
	{
		if (is_array($array)) {
			foreach($array as $key => $val) {
				if (is_array($val)) {
					$return[$key] = Tools::unhtmlspecialchars_array($val);
				} else {
					$return[$key] = Tools::unhtmlspecialchars($val);
				}
			}
            return $return;
		}
		return Tools::unhtmlspecialchars($array);
    }

	static public function getServerPath()
	{
		$result=get_cfg_var('icewarp_server_path');
		if(!$result) {
			$result=dirname($_SERVER['SCRIPT_FILENAME']);
			$result=substr($result,0,strrpos($result,'html'));
		}
		return $result;
	}
	
	public static function randomFilename($directory = true) 
	{
		$filename = Tools::my_uniqid('',true);
		$dir = '';
		if($directory===true){
			if($_SESSION['user']) {
				$dir = User::getDir() . '~upload/';
				if(!is_dir($dir)) {
					slSystem::import('tools/filesystem');
					slToolsFilesystem::mkdir_r($dir, 0777, true);
				}
			} else {
				$api = createobject('API');
				$dir = $api->getProperty("C_System_Storage_Dir_TempPath").'webmail/';
			}
		}
		if($directory && $directory!==true){
			$dir = $directory;
		}
		return $dir . $filename . '.tmp';
	}
	
	
	 	 	static public function my_uniqid($prefix = '',$moreEntropy = true)
	{
		return preg_replace('/(e|\.)/si','z',uniqid($prefix,$moreEntropy));
	}
	static public function my_iconv($inCharset,$outCharset, $inputString)
	{
		$bIgnoreIn = self::checkIgnore($inCharset);
		$bIgnoreOut = self::checkIgnore($outCharset);
		if(!$inCharset) {
			$inCharset = $_SESSION['DEFAULTCHARSET'];
		}
		if(($pos = strpos($inCharset," "))!==false){
			$inCharset = substr($inCharset,0,$pos);
		}
		$inCharset = self::charsetOverride($inCharset,$inputString);
		if(strtolower($inCharset)!='utf-8' 
	|| (strtolower($outCharset)!='utf-8' && (strtolower($inCharset)!=strtolower($outCharset)))){
			$inputString = iconv($inCharset.($bIgnoreIn?"//TRANSLIT//IGNORE":""),$outCharset.($bIgnoreOut?"//TRANSLIT//IGNORE":""),$inputString);
		}
		 
		return $inputString;
	}
	
	static private function charsetOverride($inCharset,&$string)
	{
		if(strpos($inCharset,'\'')!==false){
			$inCharset=trim($inCharset,'\'');
			$inCharset = explode('\'',$inCharset);
			$inCharset = $inCharset[0];
		}
		switch(strtolower($inCharset)) {
			 			 			case 'utf-32':
			case 'utf':
			case 'utf8':
			case 'none':
			case 'unknown-8bit':
				$inCharset = 'utf-8';
				break;
			 			case 'unknown':
			case 'user-defined':
			case 'x-user-defined':
				$inCharset = $_SESSION['DEFAULTCHARSET'];
				break;
			 			case '_autodetect_all':
				$inCharset = '';
				break;
			 			case 'gb18030':
			case 'gb2312':
			case 'x-gbk':
				$inCharset = 'gbk';
				break;
			 			case 'unicode':
				$inCharset = 'ucs-2le';
				break;
			 			case 'ks_c_5601-1987':
				$inCharset = 'cp949';
				break;
			case 'ptbr-iso-8859-1':
			case '8859-1':
				$inCharset = 'iso-8859-1';
			break;
			case 'windows-1252http-equivcontent-type':
				$inCharset = 'windows-1252';
			break;
		}
		return $inCharset;
	}
	
	static private function checkIgnore(&$charset)
	{
		if(strpos($charset,"//IGNORE")!==false) {
			$charset = str_replace("//IGNORE","",$charset);
			return true;
		}
		return false;
	}
	
	static public function getHostDomain($host = false)
	{
		if($host=='__@@GLOBAL@@__'){
			return false;
		}
		 		if(!self::$host_domain){
			if(!$host){
				$host = $_SERVER['HTTP_HOST'];
			}
			if ($pos = strpos($host, ":")){
				$host = substr($host, 0, $pos);
			}
			$domain = false;
			if(!$domain = self::checkDomainExistence($host)){
				$end = false;
				 				 				while(strpos($host,'.') > 0 && !$end){
					$host = substr($host,strpos($host,'.') + 1);
					if($domain = self::checkDomainExistence($host)){
						$end = true;
					}
				}
			}
			self::$host_domain = $domain;
		}
		return self::$host_domain;
	}
	
	static private function checkDomainExistence($host)
	{
		$filename = WM_HOSTSPATH . $host . dataext;
		 		if (file_exists($filename)){
			@$domain = trim(file_get_contents($filename));
		} else  {
			 			$d = new IceWarpDomain();
			if($d->Open($host)){
				$domain = $host;
			}else{
				$domain = false;
			}
		}
		return $domain;
	}
	
	static public function loadLanguage()
	{
		$aGlobal = Storage::getDefaults('layout_settings');
		$aDomain = Storage::getDomainDefaults('layout_settings',Tools::getHostDomain());
		$aUser = Storage::getUserData('layout_settings');
		$aLayoutSettings = WebmailIqPrivate::get('layout_settings',$aGlobal,$aDomain,$aUser,false);
		$sLanguage = $aLayoutSettings
			['@childnodes']['item'][0]
			['@childnodes']['language'][0]
			['@value'];
		$sLanguage = $sLanguage?$sLanguage:'en';
		if (@$xml = slToolsXML::loadFile('../client/languages/'.$sLanguage.'/data.xml'))
		{
			foreach($xml as $groupName => $groupVal){
				foreach($groupVal as $optionName => $optionVal){
					$aLanguage[$groupName][$optionName] = strval($optionVal);
				}
			}
		}
		return $aLanguage;
	}
	
	static public function prepareItemToBeSaved($aItem,$type = 'text')
	{
		$aItem['size'] =(string) round(($aItem['size']/1024),1);
		if($aItem['attachments']['num']){
			foreach($aItem['attachments']['num'] as $aKey => $aAttachment){
				$aItem['attachments']['num'][$aKey]['size'] =(string) round(($aAttachment['size']/1024),1);
			}
		}
		$aItem['date']=date('r',$aItem['timestamp']);
		if($type=='html'){
			$sBody = $aItem[$type];
			$aItem = Tools::htmlspecialchars_array($aItem);
			$aItem[$type] = $sBody;
		}
		return $aItem;
 	}
	

	 
	static public function collateOrderBy($orderBy,$collation = 'utf8_general_ci')
	{
		if($_SESSION['COLLATION'])
		{
			$aFields['mail'] = 'subject|header_from|header_to';
			$aFields['quarantine'] = 'sndowner|sndsender|snddomain|sndsubject';
			$aFields['contacts'] = 'itmclassifyas|itmcategory|itmtitle|itmfirstname|itmmiddlename|itmsurname|itmsuffix|itmcompany|lctemail.';
			$aFields['events'] = 'evntitle|evnlocation|evntype|evnnote';
			$sFields = implode('|',$aFields);
			
            $aResult = [];
			$aOrderBy = explode(',',$orderBy);
			foreach($aOrderBy as $orderBy){
				switch(strtoupper($_SESSION['DBTYPE'])){
					case 'MYSQL':	
							$sCollationType = strtolower(substr($_SESSION['COLLATION'],0,4));
						if($sCollationType == 'utf8') {
                            $aResult[] = preg_replace('#^(' . $sFields . ')\s(asc|desc)#si', '$1 COLLATE ' . $_SESSION['COLLATION'] . ' $2', $orderBy);
                        }else{
                            $aResult[]= preg_replace("#(".$sFields.")\s(asc|desc)#si", "convert($1 using '".$_SESSION['COLLATION']."') $2", $orderBy);
							}
					break;
					case 'SQLITE':
						$aResult[] = preg_replace(
							'#('.$sFields.')\s(asc|desc)#si',
							'$1 COLLATE NOCASE $2',
							$orderBy
						);
					break;
					case 'OCI':
					case 'ODBC':
						$aResult[] = $orderBy;
				}
			}
			return implode(',',$aResult);
		}
		return $orderBy;
	}
	
	static public function getServerURL()
	{
		return 'index.html';
	}
	
	static public function checkMessageEnd($filename)
	{
	
		$fp = fopen($filename,'ab+');
		fseek($fp,-4,SEEK_END);
		$end = fread($fp,4);
		 		if ($end!=CRLF.CRLF){
			fwrite($fp,CRLF.CRLF);
		}
		fclose($fp);
	}
	
	static public function overrideContentType($fileName,&$contentType)
	{
		$extStart = strpos($fileName,'.');
		$ext = substr($fileName,$extStart+1);
		switch($ext){
			case 'eml':
				$contentType ='message/rfc822';
				break;
			default:
			break;
		}
	}
	
	static public function utf8_bad_replace_array( &$array )
	{
		if($array) foreach($array as $key => $val){
			if(is_array($val)){
				$array[$key] = self::utf8_bad_replace_array( $array[$key] );
			}else{
				$array[$key] = self::utf8_bad_replace( $array[$key] );
			}
		}
		return $array;
	}
	
	static public function decodeASCII($string){
		while(preg_match("#&\#([0-9]{1,});#",$string,$matches)){
			$string = Tools::unhtmlspecialchars(str_replace($matches[0],chr($matches[1]),$string));
		}
		return $string;
	}
	
	static public function fixHeader($header)
	{
		return trim($header);
	}
	
	
	static function pem2der($pem_data) {
   $begin = "CERTIFICATE-----";
   $end   = "-----END";
   $pem_data = substr($pem_data, strpos($pem_data, $begin)+strlen($begin));   
   $pem_data = substr($pem_data, 0, strpos($pem_data, $end));
   $der = base64_decode($pem_data);
   return $der;
}

 static public function der2pem($der_data) {
   $pem = chunk_split(base64_encode($der_data), 64, "\n");
   $pem = "-----BEGIN CERTIFICATE-----\n".$pem."-----END CERTIFICATE-----\n";
   return $pem;
}
	static public function dbSortValue($value)
	{
		return trim(str_replace(array('\'','"','<'),'',$value));
	}
	static public function my_fputcsv ($fh, array $fields, $delimiter = ',', $enclosure = '"', $newline = "\n") {
    $delimiter_esc = preg_quote($delimiter, '/');
    $enclosure_esc = preg_quote($enclosure, '/');
  
    $output = array();
    foreach ($fields as $field) {
        $output[] = preg_match("/(?:${delimiter_esc}|${enclosure_esc}|\s)/", $field) ? (
            $enclosure . str_replace($enclosure, $enclosure . $enclosure, $field) . $enclosure
        ) : $field;
    }
  
    fwrite($fh, join($delimiter, $output) . $newline);
  }
 static public function my_str_getcsv($data, $delimiter = ',', $enclosure = '"', $newline = "\n",&$quote_open){
 		$data = str_replace("\r\n","\n",$data);
        $pos = $last_pos = -1;
        $end = strlen($data);
        $row = 0;
                 $trim_quote = false;

        $return = array();

                 for ($i = -1;; ++$i){
            ++$pos;
                         $comma_pos = strpos($data, $delimiter, $pos);
            $quote_pos = strpos($data, $enclosure, $pos);
            $newline_pos = strpos($data, $newline, $pos);

                         $pos = min(($comma_pos === false) ? $end : $comma_pos, ($quote_pos === false) ? $end : $quote_pos, ($newline_pos === false) ? $end : $newline_pos);

                         $char = (isset($data[$pos])) ? $data[$pos] : null;
            $done = ($pos == $end);

                         if ($done || $char == $delimiter || $char == $newline){
                                 if ($quote_open && !$done){
                    continue;
                }

                $length = $pos - ++$last_pos;

                                 if ($trim_quote){
                                         --$length;
                }

                                 $return[$row][] = ($length > 0) ? str_replace($enclosure . $enclosure, $enclosure, substr($data, $last_pos, $length)) : '';

                                 if ($done){
                    break;
                }

                                 $last_pos = $pos;

                                 if ($char == $newline){
                    ++$row;
                }

                $trim_quote = false;
            }
                         else if ($char == $enclosure){

                                 if ($quote_open == false){
                                         $quote_open = true;
                    $trim_quote = false;

                                         if ($last_pos + 1 == $pos){
                        ++$last_pos;
                    }

                }
                else {
                                         $quote_open = false;

                                         $trim_quote = true;
                }

            }

        }
        return $return[0];
    }
	
	static public function getMimeType ($filename) 
	{
		$ext = strrpos($filename,'.');
		$type = substr( $filename, $ext + 1 );
		$type = strtolower($type);
		
		$mimetypes = array(
		'doc' => 'application/msword',
		'bin' => 'application/octet-stream',
		'lha' => 'application/octet-stream',
		'exe' => 'application/octet-stream',
		'dll' => 'application/octet-stream',
		'pdf' => 'application/pdf',
		'eps' => 'application/postscript',
		'ps' => 'application/postscript',
		'xls' => 'application/vnd.ms-excel',
		'ppt' => 'application/vnd.ms-powerpoint',
		'swf' => 'application/x-shockwave-flash',
		'tar' => 'application/x-tar',
		'zip' => 'application/zip',
		'mid' => 'audio/midi',
		'midi' => 'audio/midi',
		'mp2' => 'audio/mpeg',
		'mp3' => 'audio/mpeg',
		'm3u' => 'audio/x-mpegurl',
		'bmp' => 'image/bmp',
		'gif' => 'image/gif',
		'ief' => 'image/ief',
		'jpeg' => 'image/jpeg',
		'jpg' => 'image/jpeg',
		'jpe' => 'image/jpeg',
		'png' => 'image/png',
		'tiff' => 'image/tiff',
		'tif' => 'image/tiff',
		'xbm' => 'image/x-xbitmap',
		'wrl' => 'model/vrml',
		'vrml' => 'model/vrml',
		'css' => 'text/css',
		'html' => 'text/html',
		'htm' => 'text/html',
		'asc' => 'text/plain',
		'txt' => 'text/plain',
		'rtx' => 'text/richtext',
		'rtf' => 'text/rtf',
		'sgml' => 'text/sgml',
		'sgm' => 'text/sgml',
		'xml' => 'text/xml',
		'mpeg' => 'video/mpeg',
		'mpg' => 'video/mpeg',
		'mpe' => 'video/mpeg',
		'qt' => 'video/quicktime',
		'mov' => 'video/quicktime',
		'avi' => 'video/x-msvideo',
		'rar' => 'application/rar',
		'svg'=>'image/svg+xml'
		);

		return ( $mimetypes[$type]?$mimetypes[$type]:'application/octet-stream');
	}

	static public function getDeliveryReport($email,$message_id,$unix_time)
	{
		$api = createobject('api');
		return $api->GetDeliveryReport($email,$message_id,$unix_time);
	}
	
	static public function my_date($format,$timestamp = false)
	{
		if($timestamp===false){
			$timestamp = time();
		}
		$date = getdate($timestamp);
	}
	
	static public function parsePassword(&$sPassword,$bCipher = true)
	{
		$pInfo = Tools::parseURL($sPassword);
		if(is_array($pInfo) && !empty($pInfo)){
			if (isset($pInfo['p']) && isset($pInfo['t']) ){
			  $sPassword = $pInfo['p'];
			  $timestamp = $pInfo['t'];
			  $id = $pInfo['i'];
			}
			if(isset($pInfo['t'])){
				if(abs(time()-$timestamp) > 300){
					trigger_error("Login Expired [".time()."/".$timestamp."]",E_USER_WARNING);
					throw new Exc('login_expired');
				}
			}
		}else{
			if($bCipher){
				$sPassword = urldecode($sPassword);
			}
			$id = false;
		}
		return $id;
	}
	
	static public function decideLoginType($sUsername,$sPassword,$sHashID,$bDisableIPCheck,$usePermanentPrefix=false,$bCipher = true,$language = 'en')
	{
        $permanentPrefix='wm-';
		 
        if ($usePermanentPrefix) $permanentPrefix='wm-perm';
		
		$id = Tools::parsePassword($sPassword,$bCipher);

		$normalLogin = false;

		if($id){
			if($_SESSION['user']){
				if($id != $_SESSION['SID']){
					throw new Exc('session_mismatch','session_mismatch');
				}
			} elseif(session_id()!='') {
			    @session_destroy();
			}
			
			$sesid = session_id($id);
			session_start();
			
			
			$account = createobject("account");
			if(!$account->Open($_SESSION['EMAIL'])){
				@session_destroy();
				$normalLogin=true;
			}
			
			if(!isset($_SESSION['no_regenerate_id']) || $_SESSION['no_regenerate_id']==false){
				session_regenerate_id(true);
			}
			 if ($usePermanentPrefix){session_id( str_replace('.','',uniqid($permanentPrefix,true)) );}
			$id = session_id();
			
			$_SESSION['REQUEST_UID'] = time() + microtime();
			$_SESSION['SID'] = $id;
			$sSID = $id;
			
			
			
			$cookie = new slToolsCookie();
			$cookie->setcookie(SESSION_COOKIE_NAME,$sSID,mktime(0,0,0,1,1,2030),'/');
		} else {
			$normalLogin=true;
		}
		
		if ($normalLogin){
			if($_SESSION){
				@session_destroy();
			}
			$sSID = User::login(
				$sUsername,
				$sPassword,
				$sHashID,
				"",
				true,
				"",
				false,
				false,
				$bDisableIPCheck,
				$language,
				$permanentPrefix
			);
			
		}
		return $sSID;
	}
	
	static public function fixAttachmentName($attachment)
	{
		if(iconv_strrpos($attachment['name'],'.','utf-8')!==false){
			$ext = iconv_substr(
				$attachment['name'],
				iconv_strrpos($attachment['name'],'.','utf-8'),
				iconv_strlen($attachment['name'],'utf-8'),
				'utf-8'
			);
		}
		if(!$ext){
			if($attachment['type']=='message/rfc822'){
				$attachment['name'] = str_replace(array('/','\\','?','%','*',':','|','"','<','>','.'),'',$attachment['name']);
				$name = $attachment['name'].'.eml';
			}else{
				$name = $attachment['name'];
			}
		}else{
			$name = $attachment['name'];
		}
		return $name;
	}
	
	static public function ReplaceReservedName($string)
	{
		$reservedNames = array('CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9');
		$api = createobject('api');
		$os = $api->GetProperty('C_OS');
		if($os!=0){
			
			return $string;
		}
		foreach($reservedNames as $name){
			if(strtolower($name)==strtolower($string)){
				$string.='@';
			}
		}
		return $string;
	}
	
	static public function deliveryReport($messages)
	{
		foreach($messages as $key => $item){
			$messages[$key]['report'] = Tools::getDeliveryReport(
				$_SESSION['EMAIL'],
				$item['message_id'],
				$item['unix_time']
			);
			$xml = self::getXmlFromString($messages[$key]['report']);
			if (false === $xml) {
				return false;
			}
			$messages[$key]['sender'] = (string) $xml->sender;
			$messages[$key]['recipient'] = (string) $xml->recipient;
			$messages[$key]['time'] = (int) $xml->time;
			if($xml->recipients->item) foreach($xml->recipients->item as $recipient){
				$rcp['email'] = (string) $recipient->email;
				$rcp['status'] = (string) $recipient->status;
				$rcp['time'] = (string) $recipient->time;
				$statusname = 'status-text';
				$rcp['error'] = (string) $recipient->$statusname;
				$messages[$key]['recipients'][] = $rcp;
			}
		}
		return $messages;
	}
	
	static public function cancelDelivery($messages)
	{
		$result = true;
		$api = createobject('api');
		foreach($messages as $key => $item){
			$result = $api->FunctionCall("RecallMessage",$_SESSION['EMAIL'],$item['message_id'],$item['unix_time']) && $result;
		}
		return $result;
	}
	
	static public function getWebAdminSession($session_id)
	{
		$api = createobject('api');
		$sessions_file = $api->GetProperty('C_ConfigPath') . 'wasessions.dat';
		$sessions = file($sessions_file);
		foreach($sessions as $session){
			$info = explode('&',$session);
			if($info[0]==$session_id){
				return $info;
			}
		}
		return array();
	}

    public static function camelize($input, $separator = '_')
    {
        return str_replace($separator, '', ucwords($input, $separator));
    }

    public static function externalResourcesEnabled() : bool
    {
        return isset($_SESSION['clientSettings']) && isset($_SESSION['clientSettings']['show_inline_images']) && true === $_SESSION['clientSettings']['show_inline_images'];
    }
}

?>