<?php
slSystem::import('io/variable');

 
class slIOPost extends slIOVariable {
	 
	private static $instance = null;

	 
	public static function instance()
	{
		if (!isset(self::$instance)) {
			$class = __CLASS__;
			self::$instance = new $class($_POST);
		}

		return self::$instance;
	}
}

?>
