<?php

 
if($sharedLibPath = realpath(__DIR__ . '/')){
    define('SHAREDLIB_PATH', $sharedLibPath);
}else{
    define('SHAREDLIB_PATH',get_cfg_var('icewarp_sharedlib_path'));
}

define( 'APP' , '' );
define( 'APP_PATH' , '' );
 define( 'LOG_LEVEL' , 0 );
 require_once( SHAREDLIB_PATH. 'system.php' );

slSystem::import( 'application' );
slSystem::import( 'io/router' );
slSystem::import( 'system/session' );

 

$request = slRequest::instance();
$session = slSession::instance( $request );

$application = slApplication::instance( APP, $model, $session );
$application->run();

?>