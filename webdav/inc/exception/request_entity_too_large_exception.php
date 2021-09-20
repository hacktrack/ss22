<?php
class request_entity_too_large_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Request Entity Too Large', 413, $previous);
	}
}
?>