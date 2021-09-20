<?php
class not_found_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Not Found', 404, $previous);
	}
}
?>