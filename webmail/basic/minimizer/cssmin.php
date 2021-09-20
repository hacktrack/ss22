<?php
function cssmin($css)
{
	$co=array("\r\n","\r","\n","  ","	",": ","/**/");
	$zaco=array("","",""," ","",":","");
	$css=str_replace($co,$zaco,$css);
	$css=preg_replace("/(\/\*[^(\*\/)]{5,}\*\/)/","",$css);
	return $css;
}
?>