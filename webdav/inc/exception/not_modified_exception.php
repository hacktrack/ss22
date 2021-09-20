<?php
class not_modified_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Not Modified', 304, $previous);
	}
}
?>