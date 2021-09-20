<?php

class slToolsHTTPAuth
{
	public static function login()
	{
		$result = false;

		 		if ($_SERVER['HTTP_AUTHORIZATION'])
		{
			 			list($scheme, $text) = explode(' ', $_SERVER['HTTP_AUTHORIZATION']);

			 			$text = base64_decode($text);
			list($username, $password) = explode(':', $text);
			
			if(!defined("SHAREDLIB_PATH")){
				if($sharedLibPath = realpath(__DIR__ . '/../')){
					define('SHAREDLIB_PATH', $sharedLibPath);
				}else{
					define('SHAREDLIB_PATH',get_cfg_var('icewarp_sharedlib_path'));
				}
			}
			 			require_once(SHAREDLIB_PATH.'system.php');
			slSystem::import('api/account');
			$account = new IceWarpAccount();

			 			$result = $account->AuthenticateUser($username, $password, $_SERVER['SERVER_NAME']);
		}


		 		if (!$result)
		{

			header('Status: 401 Access Denied');
			header('Authorization: Basic');
			header('WWW-Authenticate: Basic realm="Tools"');

			die();
		}
	}

}

?>
