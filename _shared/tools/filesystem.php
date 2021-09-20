<?php

 
class slToolsFilesystem
{
	 
	public static function mkdir($dir,$rights = 0777,$cache = false) {
		if (!is_dir($dir)) {
			if (!@mkdir($dir, 0755, true)){
				return false;			}else{
				if($cache){
					slSystem::import('tools/icewarp');
					slToolsIcewarp::iw_index_dir($dir);
				}
			}
		}
	}

	public static function mkdir_r($dirName, $rights=0777,$cache = false){
	
		 		if (is_dir($dirName)){
			return true;
		}
		if($cache){
			slSystem::import('tools/icewarp');
		}
		 		$dirName = str_replace('\\','/',$dirName);
	
		$dirs = explode('/', $dirName);
		$dir='';
	
		foreach ($dirs as $part) {
			$dir.=$part.'/';
	
			if (!is_dir($dir) && strlen($dir)>0){
				if(@mkdir($dir, $rights)){
					if($cache){
						slToolsIcewarp::iw_index_dir($dir);
					}
				}
			}
		}
	
		return true;
	}
	 
	public static function rmdir($dir,$empty = false,$cache = false)
	{
		if (!is_dir($dir))
			return;
		if($cache){
			slSystem::import('tools/icewarp');
		}
		if ($dh = @opendir($dir)) {
			while (($file = readdir($dh)) !== false) {
				if (($file == '.') || ($file == '..'))
					continue;
	
				$file = $dir . '/' . $file;
	
				if (is_dir($file)){
					if($cache){
						slToolsIcewarp::iw_delete_dir($file);
					}else{
						self::rmdir($file,$empty,$cache);
					}
				}else{
					if($cache){
						slToolsIcewarp::iw_delete($file);
					}else{
						unlink($file);
					}
				}
			}
			closedir($dh);
		}
		if (!$empty){
			if($cache){
				@slToolsIcewarp::iw_delete_dir($dir);
			}else{
				@rmdir($dir);
			}
		}
	}



     
    public static function securePath($path)
    {
    	if (preg_match("/(\.\.)|(:)/", $path)|| preg_match("#(//)#", $path) || $path[0]=="/" || $path[0]=="\\") {
    		$path=false;
    	}
    	return $path;
    }
	
    
   	public static function randomFilename($directory = '',$extension = '.tmp') 
	{
		$filename = slSystem::uniqueID('',true);
		return $directory . $filename . $extension;
	}

	public static function sendFileHeaders($fileName, $length, $contentType,$charSet = false, $disposition = 'attachment',$isLogo = false)
	{
		$fileName = str_replace('"','\"',$fileName);
		header('Pragma: ');		 		header('Cache-Control: ');  		if($charSet){
			$contentType = $contentType.'; charset='.$charSet;
		}

 		header('Content-Type: ' . $contentType);
		
        if($fileName){
            if(self::isAndroid() || self::isEdge()){
                header('Content-Disposition: attachment;  filename="'.rawurlencode($fileName).'"');
            }else if (self::isSafari()){
                header('Content-Disposition: attachment;  filename="'.$fileName.'"');
            }else{
                if(self::isIE() && strpos($fileName,'.')===false){
                    header('Content-Disposition: '.$disposition.';  filename="'.rawurlencode($fileName).'"; filename*=UTF-8\'\''.str_replace('%20',' ',rawurlencode(slToolsString::utf8_bad_replace($fileName))));
                }else{
                    header('Content-Disposition: '.$disposition.';  filename="'.slToolsCharset::my_iconv('UTF-8', 'US-ASCII//TRANSLIT',rawurlencode($fileName)).'"; filename*=UTF-8\'\''.rawurlencode(slToolsString::utf8_bad_replace($fileName)));
                }
            }
        }else{
            header('Content-Disposition:'.$disposition.';');
        }

		if($length) {
			header('Content-Length: ' . $length);
		}
		if(defined('APP_LOGGING_METHOD')){
			call_user_func_array( APP_LOGGING_METHOD, array(0=>"Download session [".(isset($_SESSION['SID']) ? $_SESSION['SID']:'Unauthorized')."] FILE [name:".$fileName.",mimetype:".$contentType.",size:".$length."]",1=>"DEBUG"));
		}
	}
	static public function truepath($path)
	{
		 		$unipath = strlen($path)==0 || $path{0}!='/';
		$unc = substr($path,0,2)=='\\\\'?true:false;
		 		if(strpos($path,':') === false && $unipath && !$unc){
			$path=getcwd().DIRECTORY_SEPARATOR.$path;
			if($path{0}=='/'){
				$unipath = false;
			}
		}

		 		$path = str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $path);
		$parts = array_filter(explode(DIRECTORY_SEPARATOR, $path), 'strlen');
		$absolutes = array();
		foreach ($parts as $part) {
			if ('.'  == $part){
				continue;
			}
			if ('..' == $part) {
				array_pop($absolutes);
			} else {
				$absolutes[] = $part;
			}
		}
		$path = implode(DIRECTORY_SEPARATOR, $absolutes);
		 		if( function_exists('readlink') && file_exists($path) && @linkinfo($path)>0 ){
			@$realpath = readlink($path);
			if(file_exists($realpath)){
				$path = $realpath;
			}
		}
		 		$path = !$unipath ? '/'.$path : $path;
		$path = $unc ? '\\\\'.$path : $path;
		return $path;
	}

	static public function downloadFile($path,$delete = false)
	{
		if($_SERVER["SERVER_XFILEOPERATION_SUPPORT"]){
			if(defined('APP_LOGGING_METHOD')){
				call_user_func_array( APP_LOGGING_METHOD, array(0=>"Download X-File-Operation",1=>"EXTENDED"));
			}
			if(str_replace('\\','/',$path)!=str_replace('\\','/',self::truepath($path))){
				if(defined('APP_LOGGING_METHOD')){
					call_user_func_array( APP_LOGGING_METHOD, array(0=>"slToolsFilesystem::truepath() method is failing for the following path cwd:(".getcwd().") path:(".$path."=>".self::truepath($path).")",1=>"EXTENDED"));
				}
			}
			header("X-File-Operation: filepath=".urlencode(self::truepath($path))."&delete=".($delete?1:0));
				
		}else{
			if(defined('APP_LOGGING_METHOD')){
				call_user_func_array( APP_LOGGING_METHOD, array(0=>"Download Ordinary",1=>"EXTENDED"));
			}
			$fp = fopen($path,'rb');
			while($buffer = fread($fp,65535)){
				echo $buffer;
			}
			fclose($fp);
			if($delete){
				unlink($fp);
			}
		}
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

	public static function isEdge()
	{
		$agent = $_SERVER['HTTP_USER_AGENT'];
		if (strpos($agent,'Edge') !== false ) {
			return true;
		} else {
			return false;
		}
	}
	
	public static function isAndroid444()
	{
		$agent = $_SERVER['HTTP_USER_AGENT'];
		if (stripos($agent,'Android') !== false && stripos($agent,'4.4.4')!==false) {
			return true;
		} else {
			return false;
		}
	}
	
	public static function isAndroid()
	{
		$agent = $_SERVER['HTTP_USER_AGENT'];
		if (stripos($agent,'Android') !== false) {
			return true;
		} else {
			return false;
		}
	}
	
	public static function isSafari()
	{
		$agent = $_SERVER['HTTP_USER_AGENT'];
		if (stripos($agent,'Safari') !== false && !self::isChrome()) {
			return true;
		} else {
			return false;
		}
	}

    public static function isChrome()
    {
        $agent = $_SERVER['HTTP_USER_AGENT'];
        if (stripos($agent,'Chrome') !== false) return true;
        return false;
    }
}

?>