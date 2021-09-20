<?php

class slToolsInflector
{
	static public function classify( $s )
	{
		return str_replace( '/','_',$s );
	}	
}
?>