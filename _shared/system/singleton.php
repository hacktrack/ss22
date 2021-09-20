<?php
 
class slSingleton
{
	protected static $instance = array();
	
	 
	public static function &instance($sClass, &$aConstruct = false) {
		if (!isset(self::$instance[$sClass])){
			if($aConstruct){
				self::$instance[$sClass] = new $sClass($aConstruct);
			}else{
				self::$instance[$sClass] = new $sClass();
			}
		}
		$reference = self::$instance[$sClass];
		return $reference;
	}
}
?>