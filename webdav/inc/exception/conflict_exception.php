<?php
class conflict_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Conflict', 409, $previous);
	}
}
?>