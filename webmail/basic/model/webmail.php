<?php
 require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');

class WebmailModel
{
	private static $instance;
	
	static public function instance( &$settings = false )
	{
		if(!isset(self::$instance)){
			self::$instance = new WebmailModel( $settings );
		}
		return self::$instance;
	}
	protected function __construct( &$settings )
	{
		$this->settings = &$settings;
		$this->api = createobject('api');
		if($_SESSION['user']){
			$this->settings->session->setUserDir($_SESSION['USERDIR'].'~webmail/~upload/wmbasic/');
		}else{
			$id = $this->settings->session->getSID();
			$id = $id?$id:slSystem::uniqueID();
			$this->settings->session->setUserDir(
				$this->api->getProperty('C_System_Storage_Dir_TempPath').
				'~wmbasic/sessions/'.
				$id.
				'/'
			);
		}
	}
}