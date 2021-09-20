<?php
slSystem::import('io/variable');

 
class slIOGet extends slIOVariable {
	 
	private static $instance = null;

	 
	public static function instance()
	{
		if (!isset(self::$instance)) {
			$class = __CLASS__;
			self::$instance = new $class($_GET);
		}

		return self::$instance;
	}
}

?>
