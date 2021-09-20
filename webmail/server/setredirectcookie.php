<?php

if(empty($_GET['wa_sid'] ?? null)){
    header($_SERVER['SERVER_PROTOCOL'] . ' 400 BAD REQUEST', true, 400);
    die();
}

if(!defined('SHAREDLIB_PATH')) {
    if (($sharedLibPath = realpath(__DIR__ . '/../../_shared')) && is_dir($sharedLibPath)) {
        define('SHAREDLIB_PATH', $sharedLibPath . '/');
    } else {
        define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
    }
}

require_once(SHAREDLIB_PATH . '/tools/cookie.php');

foreach (getallheaders() as $key => $value){
    if($key == 'Host') continue;
    header($key, $value);
}

$cookie = new slToolsCookie();
$cookie->setcookie('waid',$_GET['wa_sid'],false, '/');
$cookie->setcookie('wall',$_GET['language'] ?? 'en',false, '/');

header("Location: " . urldecode($_GET['redirect_uri'] ?? $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? $_SERVER['REMOTE_ADDR']));
die();