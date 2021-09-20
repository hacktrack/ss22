<?php

 
 
class slHelperFactory
{
	static private $instance;
	  
	public static function &instance(&$aConstruct = false) 
	{
		if(!$aConstruct['helper']){
			throw new Exception('Helper:empty_helper');
		}
		if (!self::$instance[$aConstruct['helper']]){
			$helperFile = slSystem::getFile(
				'controller/helper',
				$aConstruct['helper'],
				'.php'
			);
			$helperClass = 'slHelper'.ucfirst(basename($aConstruct['helper']));
			if( file_exists( $helperFile ) ){
				require_once($helperFile);
				if($aConstruct){
					self::$instance[$aConstruct['helper']] = new $helperClass($aConstruct);
				}else{
					self::$instance[$aConstruct['helper']] = new $helperClass();
				}
				if(method_exists(self::$instance[$aConstruct['helper']],'check')){
					self::$instance[$aConstruct['helper']]->check();
				}
			}else{
				
				throw new Exc('Helper:helper_load_failiure:'.$helperFile);
			}
		}
		$reference = &self::$instance[$aConstruct['helper']];
		if($aConstruct['widget']){
			$reference->assignWidget($aConstruct['widget']);
		}
		return $reference;
	}
}

class slHelper
{
    public $data;
    public $widget;
    public $aConstruct;
    public $sent;

	public function __construct( &$aConstruct )
	{
		$request = slRequest::instance();
		$this->data = $request->get('all._s') ;
		$this->data = self::urldecode_array( $this->data );
		$this->widget = array();
		$this->aConstruct = $aConstruct;
	}
	
	static function urldecode_array( $array)
	{
		if($array) foreach($array as $key => $index){
			if(is_array($index)){
				$result[$key] = self::urldecode_array( $index );
			}else{
				$result[$key] = rawurldecode($index);
			}
		}
		return $result;
	}
	
	public function getData( $default )
	{
		if($default) foreach( $default as $key => $val){
			if(!isset( $this->sent[$key] )){
				$this->data[$key] = $val;	
			}
		}
		return $this->data;
	}
	
	public function check()
	{
		return true;
	}
	
	public function assignWidget($widget){
		if(is_array($widget)){
			$widget = reset($widget);
		}
		$index = str_replace('slwidget','',strtolower(get_class($widget)));
		$this->widget[$index] = &$widget;
	}
	public function getWidget($name)
	{
		$index = strtolower($name);
		if(isset($this->widget[$index])){
			return $this->widget[$index];
		}
	}
	public function getCurrentWidget()
	{
		if(!empty($this->widget)){
			return current($this->widget);
		}
	}
}
?>