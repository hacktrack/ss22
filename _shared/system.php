<?php

class slSystem
{
	static private $aCachedFiles = array();
	static public function import( $location , $path = SHAREDLIB_PATH, $ext = '.php' )
	{
		if(strpos($location,'controller')===0){
			$controller = preg_replace('#controller\/#','',$location,1);
			$file = self::getFile('controller',$controller,'.php');
			$path='';
			$location=$file;
			$ext = '';
		}
		if( file_exists( $path . $location . $ext ) ){
			require_once( $path . $location . $ext );
		}else{
			throw new Exception( 'file_does_not_exist:'. $path . $location . $ext  );
		}
	}
	
	static public function getFile( $prefix, $file, $ext )
	{
		$file = slToolsFilesystem::securePath($file);
		$ext = slToolsFilesystem::securePath($ext);	
			
		$cacheID = $prefix.'#'.$file.'#'.$ext;
		if(isset(self::$aCachedFiles[$cacheID])){
			return self::$aCachedFiles[$cacheID];
		}
		$p = APP_PATH . $prefix. '/' . $file . $ext ;
		if( file_exists( $p ) ){
			self::$aCachedFiles[$cacheID] = $p;
			return $p;
		}
		if(defined('APP_INCLUDE_PATH')){
			$p = APP_INCLUDE_PATH .  $prefix. '/' . $file . $ext;
			if( file_exists( $p ) ){
				self::$aCachedFiles[$cacheID] = $p;
				return $p;
			}
		}
		$p = SHAREDLIB_PATH . 'application/' . $prefix. '/' . $file . $ext;
		if( file_exists( $p ) ){
			self::$aCachedFiles[$cacheID] = $p;
			
			return $p;
		}

		throw new Exception( 'file_does_not_exist:'. $prefix . '/'. $file . $ext );	
	}
	
	static public function uniqueID($prefix = '',$moreEntropy = true)
	{
		return preg_replace('/e/si','z',uniqid($prefix,$moreEntropy));
	}
	
}

function sharedlib_autoloader($classname)
{
	$require_array = array(
			'slobject'=>'object.php',
			'slapplication'=>'application.php',
			 			'sltoolszip'=>'tools/zip.php',
			'sltoolsxml'=>'tools/xml.php',
			'sltoolsvalidate'=>'tools/validate.php',
			'sltoolstemplate'=>'tools/template.php',
			'sltoolsstring'=>'tools/string.php',
			'sltoolsspellchecker'=>'tools/spellchecker.php',
			'searchtool'=>'tools/search.php',
			'sltoolsphp'=>'tools/php.php',
			'sltoolsmath'=>'tools/math.php',
			'sltoolsinflector'=>'tools/inflector.php',
			'sltoolsimage'=>'tools/image.php',
			'sltoolsicewarp'=>'tools/icewarp.php',
			'sltoolscharset'=>'tools/charset.php',
			'sltoolshttpauth'=>'tools/httpauth.php',
			'sltoolsfilesystem'=>'tools/filesystem.php',
			'sltoolsdom'=>'tools/dom.php',
			'sltoolsdebugticker'=>'tools/debug.php',
			'sltoolsdebug'=>'tools/debug.php',
			'sltoolsdate'=>'tools/date.php',
			'sltoolscrypt'=>'tools/crypt.php',
			'sltoolscaptcha'=>'tools/captcha.php',
            'sltoolscookie'=>'tools/cookie.php',
			 			'slvariable'=>'system/variable.php',
			'slsingleton'=>'system/singleton.php',
			'slsession'=>'system/session.php',
			'slobserver'=>'system/observer.php',
			'slobservable'=>'system/observer.php',
			'slhistory'=>'system/history.php',
			 			'slsettings'=>'storage/settings.php',
			'sldatabasestatement'=>'storage/database.php',
			'sldatabase'=>'storage/database.php',
			'slcacherecord'=>'storage/cache.php',
			'slcache'=>'storage/cache.php',
			 			'chesscardclientapi'=>'plugin/chesscard.php',
			'chesscardclientapiexception'=>'plugin/chesscard.php',
			 			'slsmtp'=>'mail/smtp.php',
			'slsmime'=>'mail/smime.php',
			'slphpmailer'=>'mail/phpmailer.php',
			'slmailparselite'=>'mail/parserlite.php',
			'slmailparse'=>'mail/parse.php',
			'slmailexception'=>'mail/mail.php',
			'slmail'=>'mail/mail.php',
			 			'sliovariable'=>'io/variable.php',
			'slrouter'=>'io/router.php',
			'slioresponse'=>'io/response.php',
			'slrequest'=>'io/request.php',
			'sliopost'=>'io/post.php',
			'slioget'=>'io/get.php',
			 			'iapiinterface'=>'api/abstract.php',
			'merakapi'=>'api/api.php',
			'icewarpapi'=>'api/api.php',
			 			 			'merakaccount'=>'api/account.php',
			'icewarpaccount'=>'api/account.php',
			'merakdomain'=>'api/domain.php',
			'icewarpdomain'=>'api/domain.php',
			'merakremoteaccount'=>'api/remoteaccount.php',
			'icwarpremoteaccount'=>'api/remoteaccount.php',
			'icewarpidp'=>'api/idp.php',
			'slservices'=>'api/services.php',
			'icewarpschedule'=>'api/schedule.php',
			'merakschedule'=>'api/schedule.php',
			'merakstatistics'=>'api/statistics.php',
			'icewarpstatistics'=>'api/statistics.php'
	);
    if(isset($require_array[strtolower($classname)]) && file_exists(SHAREDLIB_PATH.$require_array[strtolower($classname)])){
        require_once(SHAREDLIB_PATH.$require_array[strtolower($classname)]);
    }else{
        $classname = str_replace('\\', '/', $classname);
        $classname = str_replace('_', '/', $classname);

        if (!is_file(__DIR__ . '/' . $classname . '.php')) return false;
        require_once(__DIR__ . '/' . $classname . '.php');
    }
}
spl_autoload_register('sharedlib_autoloader');
?>