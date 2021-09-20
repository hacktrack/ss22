<?php
class bad_request_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Bad Request', 400, $previous);
	}
}
?>