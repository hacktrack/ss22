<?php
define('APP_IDENTITY','WebClient/PRO');
define('SESSION_COOKIE_NAME','PHPSESSID_PRO');
ini_set('session.name',SESSION_COOKIE_NAME);
ini_set('session.use_cookies',$_SESSION['SESSION_COOKIE']);
define('EMAIL_LINK_FORMAT',"#__w_o#a href=#__w_q#mailto:$0#__w_q##__w_c#$1#__w_o#/a#__w_c#");
define('LANGUAGE_PATH','../client/languages/');
?>