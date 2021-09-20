<?php
class method_not_allowed_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Method Not Allowed', 405, $previous);
	}
}
?>