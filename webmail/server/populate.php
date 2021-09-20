<?php

 

 require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');

 if($argv){
    foreach($argv as $arg){
        if(strpos($arg,'parameters=')===0){
            $parameters = str_replace("parameters=","",$arg);
        }elseif(strpos($arg,'-parameters=')===0){
            $parameters = str_replace("-parameters=","",$arg);
        }else{
            $parameters = $argv[1];
        }
    }
    parse_str($parameters,$data);
    $data = array_map('urldecode', $data);
}else{
    $data = $_GET;
}
$_SESSION['LOG'] = 4;
 

if(isset($data['impersonate'])){
    $api = IceWarpAPI::instance();
    $password = $api->GetProperty('c_accounts_policies_globaladminpassword');
    if($data['impersonate'] != md5($password)) throw new Exc('webclient_migrate_impersonate_failed');
    $result = icewarp_apitunnel('<iq uid="1" format="text/xml"><query xmlns="admin:iq:rpc" ><commandname>authenticate</commandname><commandparams><email>globaladmin</email><password>'.$password.'</password><digest></digest><authtype>0</authtype><persistentlogin>0</persistentlogin></commandparams></query></iq>');
    $xml = simplexml_load_string($result);
    if($xml->query->result != 1) throw new Exc('webclient_migrate_impersonate_failed');
    $sid = (string) $xml->attributes()->sid;

    $result = icewarp_apitunnel('<iq sid="'.$sid.'" format="text/xml"><query xmlns="admin:iq:rpc" ><commandname>impersonatewebclient</commandname><commandparams><email>'.$data['account'].'</email></commandparams></query></iq>');
    if(!preg_match('/atoken=(?P<atoken>[^<]+)<\\/result>/i', $result, $matches)) throw new Exc('webclient_migrate_impersonate_failed');
    $aToken = urldecode($matches['atoken']);
    $login = IceWarpAPI::instance()->FunctionCall("GetTokenEmail", $aToken);
    $pass = IceWarpAPI::instance()->FunctionCall("GetTokenPassword", $aToken);
}else{
    $login = $data['login'];
    $pass = $data['pass'];
}

 if(!$login){
    throw new Exc('webclient_migrate_missing_account');
}
if(!$pass){
    throw new Exc('webclient_migrate_missing_password');
}
 User::login($login,$pass);
$primary_account = $_SESSION['EMAIL'];
$user = $_SESSION['user'];
$account = $user->getAccount($primary_account);
$account->sync();

log_buffer("Cache Population - start :".$data['account'],"EXTENDED");

$folders = $account->folders["main"];
$folder_ids = array();
 if($folders){
	 	ksort($folders);
	
	 	foreach($folders as $folder){
		$folder->sync();
	}

}
log_buffer("Cache Population - before logout:".$data['login'],"EXTENDED");
$user->logout();
log_buffer("Cache Population ended:".$data['login'],"EXTENDED");
?>