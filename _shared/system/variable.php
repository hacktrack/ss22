<?php

class slVariable
{
	
	static private function dotted( $var, $value, &$pointer )
	{
		if(strpos($var,'.')!==false){
			$var = explode('.',$var);
			$c = count($var);
			for($i = 0;$i < ($c-1); $i++){
				$pointer = &$pointer[$var[$i]];
			}
			$var = $var[$i];
		}
		if($value===NULL){
			if( isset($pointer[$var]) ){
				return $pointer[$var];
			}
		}else{
			$pointer[$var] = $value;
		}
	}
	
	static public function getDotted( $var , $pointer )
	{
		return self::dotted($var, NULL, $pointer);
	}
	
	static public function setDotted( $var , $value,  &$pointer )
	{
		self::dotted($var, $value, $pointer);
	} 
	
	static public function dottedToBracket($var,$quot = '')
	{
		$bracket = '['.$quot;
		$bracket.= join($quot.']['.$quot,explode('.',$var));
		$bracket.= $quot.']';
		return $bracket;
	}
	
	static public function bracketToDotted($var,$quot = '')
	{
		$start = '['.$quot;
		$end = $quot.']';
		$separator = $quot.']['.$quot;
		$var = str_replace(array($start,$end),'',$var);
		$var = join('.',explode($separator,$var));
		
	}
	
}