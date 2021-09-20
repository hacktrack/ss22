<?php
class precondition_failed_exception extends dav_exception
{
	public function __construct($previous = null, $precondition_name = null)
	{
		parent::__construct('Precondition Failed', 412, $previous);
	}
}
?>