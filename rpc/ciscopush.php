<?php
 define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
 include(SHAREDLIB_PATH . 'api/api.php');

 
  $x= file_get_contents("php://input");
 
 $api = new IceWarpAPI();
 $api->ManageConfig("system/pipe","add","servicetype=1&commandid=4134&name=cisco_push&param1=".urlencode($x).'&param2='.urlencode($_GET["domain"]));
?>