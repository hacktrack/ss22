<?php
class bad_gateway_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Bad Gateway', 502, $previous);
	}
}
?>