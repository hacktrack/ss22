<?php
class forbidden_exception extends dav_exception
{
	public function __construct($namespace_uri = null, $privilege_name = null, $previous = null)
	{
		parent::__construct('Forbidden', 403, $previous);
	}
}
?>