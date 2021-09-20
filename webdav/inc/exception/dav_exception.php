<?php
class dav_exception extends Exception
{
	protected $_body;

	public function __construct($message = '', $code = 500, $previous = null)
	{
		if (PHP_VERSION_ID >= 503000)
			parent::__construct($message, $code, $previous);
		else
			parent::__construct($message, $code);
	}

	public function get_status_line()
	{
		return $this->getCode() . ' ' . $this->getMessage();
	}

	public function get_body()
	{
		return $this->_body;
	}
}
?>
