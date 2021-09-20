<?php

 
abstract class slIOVariable {
	 
	protected $array;

	 
	protected function __construct(&$array)
	{
		$this->array = &$array;
	}

	 
	public static function isEmail($value)
	{
		return preg_match('/^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+)(\.[a-zA-Z0-9-]+)*(\.([a-z]{2,}|xn\-\-[a-z0-9]{2,}))$/', $value);
	}

	 
	public function getEmail($name)
	{
		$value = $this->$name;
		return self::isEmail($value) ? $value : null;
	}

	 
	public static function isDate($value)
	{
		return preg_match('/^[0-9]{4}[-.\/][0-9]{1,2}[-.\/][0-9]{1,2}$/', $value);
	}

	 
	public function getDate($name)
	{
		$value = $this->$name;
		return self::isDate($value) ? $value : null;
	}

	 
	public static function isInt($value)
	{
		return preg_match('/^-?[0-9]+$/', $value);
	}

	 
	public function getInt($name)
	{
		$value = $this->$name;
		return self::isInt($value) ? intval($value) : null;
	}

	 
	public static function isFloat($value)
	{
		return preg_match('/^-?[0-9]*([.,][0-9]+)?$/', $value);
	}

	 
	public function getFloat($name)
	{
		$value = $this->$name;
		return self::isFloat($value) ? floatval($value) : null;
	}

	 
	public function __get($name)
	{
		return isset($this->array[$name]) ? $this->array[$name] : null;
	}

	 
	public function __set($name, $value)
	{
		$this->array[$name] = $value;
	}
}

?>
