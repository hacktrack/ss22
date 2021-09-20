<?php
slSystem::import('system/variable');
class slSettings
{
	static protected $instance;
    public $settings;

	protected function __construct()
	{
	}
	
	static public function instance()
	{
		if(!isset(self::$instance)){
			self::$instance = new slSettings();
		}
		return self::$instance;
	}
	
	public function check( )
	{
		$this->loadXML( 'default.xml' );
	}
	
	public function loadXML($file)
	{
        $filename = null;
		if( file_exists( APP_PATH . 'settings/'.$file ) ){
			$filename = APP_PATH . 'settings/'.$file;
		}else{
			if( APP_INCLUDE_PATH &&  file_exists( APP_INCLUDE_PATH . 'settings/'.$file ) ){
				$filename = APP_INCLUDE_PATH . 'settings/'.$file;
			}
		}
		if(!$filename){
			throw new Exception('Invalid settings file:'.$file);
		}
		$xml = slToolsXML::loadFile( $filename );
		$this->xml_r( $xml, $this->settings );
	}
	
	private function xml_r(&$elm, &$result )
	{
		$elmCount = array();
		if( $a = $elm->attributes() ){
			$a = (array) $a;
			$result['@attributes'] = $a['@attributes'];
			if( trim( strval( $elm ) ) !== '' ){
				$result['@value'] = strval($elm);		
			}
		}
		if( $elm->children() ){
			foreach($elm->children() as $index => $value){
				if( !isset( $elmCount[$index] ) ){
					$elmCount[$index] = 0;
				}
				$this->xml_r( $value, $result[$index][$elmCount[$index]++] );
			}	
		}else{
		 			$result['@value'] = strval($elm);	
		}
		 	}
	
	public function get( $var )
	{
		return slVariable::getDotted($var, $this->settings ); 
	}
	
	public function set( $var, $value )
	{
		slVariable::setDotted($var, $value, $this->settings ); 
	}
}

?>