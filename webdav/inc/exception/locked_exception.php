<?php
class locked_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Locked', 423, $previous);
	}
}
?>