<?php

class slHistory
{
	static private $instance;
	private $session;
	private $data;
	protected function __construct( &$session )
	{
		$this->session = &$session;
	}
	
	static public function instance( &$session )
	{
		if(!isset(self::$instance)){
			self::$instance = new slHistory( $session );
		}
		return self::$instance;
	}
	
	public function store($rid , $data )
	{
		return $this->session->setMain( '["history"]["'.$rid.'"]', $data );
	}
	
	public function get( $rid )
	{
		return $this->session->getMain( '["history"]["'.$rid.'"]' );
	}
}