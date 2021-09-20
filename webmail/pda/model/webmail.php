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
	}
}