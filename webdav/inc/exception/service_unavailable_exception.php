<?php
class service_unavailable_exception extends dav_exception
{
	public function __construct($previous = null)
	{
		parent::__construct('Service Unavailable', 503, $previous);
	}
}
?>