<?php
class unsupported_media_type_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Unsupported Media Type', 415, $previous);
	}
}
?>