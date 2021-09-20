<?php

class slObject
{
	public function __call($method,$args){
		$fp = fopen('c:\\ultralog.txt','w+');
		fwrite($fp,'Framework: '.get_class($this).'->'.$method.'('.join(',',$args).')');
		fclose($fp);
		return call_user_func_array(array($this, $method), $args);
	}
}

?>