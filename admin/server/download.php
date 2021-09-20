<?php
 
$download_webclient = 'server/download.php';
$relative_path = '../../webmail/';

if (file_exists($relative_path.$download_webclient)){
  chdir($relative_path.'server/');
  include($relative_path.$download_webclient);
}else{
  define('SHAREDLIB_PATH',get_cfg_var('icewarp_sharedlib_path'));
  require_once(SHAREDLIB_PATH.'system.php');
  $api = IceWarpAPI::instance();
  $absolute_path = $api->getProperty('C_Webmail_URL');
  header("Location: ".$absolute_path.$download_webclient.'?'.$_SERVER['QUERY_STRING']);
}

?>