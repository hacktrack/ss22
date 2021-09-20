<?php

if(!defined('SHAREDLIB_PATH')) {
    if (($sharedLibPath = realpath(__DIR__ . '/../_shared')) && is_dir($sharedLibPath)) {
        define('SHAREDLIB_PATH', $sharedLibPath . '/');
    } else {
        define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
    }
}

require_once(SHAREDLIB_PATH.'system.php');

 
if (isset($_GET['d'])) {
	$cookie = new slToolsCookie();
    $cookie->setcookie('lastUsername','',mktime(0,0,0,1,1,2000),'/'); die();
}
 
if (isset($_GET['t'])) {echo time(); die();}
 
if (isset($_GET['s'])) {
	chdir('../');
	require_once('inc/require.php');
	require_once('inc/include.php');
	require_once('inc/exception.php');
	 	$domainsData=Storage::getSignupDomains();
	if (is_array($domainsData)){
		$res=array();
		foreach($domainsData as $val){
			$res[]=$val['domain'];
		}
		echo join(';',$res);
	}
}
 
?>