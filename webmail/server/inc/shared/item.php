<?php

class SharedAccountItem extends CacheItem
{
	public $wmclass;

     
	public function __construct( $folder, $itemID, $rid, $size = '', $date = '', $flags = 0,$from = '',$to = '',$subject ='' )
	{
		parent::__construct($folder, $itemID, $rid, 0, 0, 
							$flags, $from, $to, $subject, 0, 0, 'Z',0, 0);	
		$this->wmclass = 'SL';
	}
	
	static public function decode(&$item, $staticFlags = false, $folder = false, $protocolHandler = false)
	{
	}

    public function getLocalMessage($file = null){}

    public function autoCreateMessage($filename = null){}
}



?>