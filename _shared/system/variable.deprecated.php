<?php

class Variable
{
	
	static public function dotted( $var, &$pointer )
	{
		$var = explode( '.', $var );
		foreach( $var as $v ){
			$pointer = &$pointer[$v];
		}
		return $pointer;
	}
	
	static public function getDotted( $var , &$pointer )
	{
		return self::dotted($var, $pointer);
	}
	
	static public function setDotted( $var , $value,  &$pointer )
	{
		$pointer = self::dotted($var, $pointer);
		$pointer = $value;
	}
	
}