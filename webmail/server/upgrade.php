<?php
 

 if($argv) foreach($argv as $arg){
	if(strpos($arg,'parameters=')===0){
		$parameters = str_replace("parameters=","",$arg);
	}
	if(strpos($arg,'-parameters=')===0){
		$parameters = str_replace("-parameters=","",$arg);
	}
}
if(!$parameters){
	$parameters = $argv[1];
}

parse_str($parameters,$data);

$background = $data['background'] || $_REQUEST['background'];

ini_set('max_execution_time',86400);  

require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');

@session_start();
try{
	WebmailIqAuth::checkServerKeys();
	User::settingsGlobal();
	$api = IceWarpAPI::instance('UpgradeTask');
	$_SESSION['QUERY_LOG'] = $api->getProperty('c_system_sqllogtype');		
	$_SESSION['LOGS'] = $api->getProperty("C_WebMail_Logs");
	User::checkDB($background);
}catch(Exc $e){
	trigger_error(print_R($e,true));
}
@session_destroy();
?>