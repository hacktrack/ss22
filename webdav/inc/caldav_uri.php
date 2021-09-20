<?php
class caldav_uri
{
	private static $_server;
	private $_segments;

	public static function static_constructor()
	{
		$server = $_SERVER['SCRIPT_NAME'];

		 		if (substr_compare($server, '/', - 1, 1) != 0)
			$server .= '/';

		 		if (substr_compare($server, 'index.html/', - 11, 11) === 0)
			$server = substr($server, 0, - 11);

		 		if (substr_compare($server, 'index.php/', - 10, 10) === 0)
			$server = substr($server, 0, - 10);

		caldav_uri::$_server = $server;
	}

	function __construct($uri, $new_segment = null)
	{
		if ($new_segment != null)
		{
			$segments = $uri->get_segments();
			$segments[] = $new_segment;
			$this->_segments = $segments;
		}
		else if (is_array($uri))
		{
			$this->_segments = $uri;
		}
		else
		{
			 			 			 
			$path = parse_url($uri, PHP_URL_PATH);

			 			if ($path === false ||
				substr_compare($path, caldav_uri::$_server, 0, strlen(caldav_uri::$_server)) != 0)
				throw new not_found_exception();

			 			$path = substr($path, strlen(caldav_uri::$_server));

			 			$raw_segments = explode('/', $path);
			$segments = array();
			foreach ($raw_segments as $raw_segment)
			{
				if ($raw_segment !== '')
					$segments[] = str_replace(':', '\\', rawurldecode($raw_segment));
			}

			$this->_segments = $segments;
		}
	}

	function starts_with($uri)
	{
		$other_segments = $uri->get_segments();
		$segments = $this->get_segments();
		if (count($other_segments) > count($segments))
			return false;
		while (count($other_segments) > 0)
		{
			$other_segment = array_shift($other_segments);
			$segment = array_shift($segments);
			if ($other_segment !== $segment)
				return false;
		}
		return true;
	}

	function equals($uri)
	{
		$other_segments = $uri->get_segments();
		$segments = $this->get_segments();
		if (count($other_segments) != count($segments))
			return false;
		while (count($other_segments) > 0)
		{
			$other_segment = array_shift($other_segments);
			$segment = array_shift($segments);
			if ($other_segment !== $segment)
				return false;
		}
		return true;
	}

	function get_segments()
	{
		return $this->_segments;
	}

	function to_string()
	{
		$raw_segments = array();
		foreach ($this->get_segments() as $segment)
		$raw_segments[] = str_replace('%40', '@', rawurlencode(str_replace('\\', ':', $segment)));
		return caldav_uri::$_server . implode('/', $raw_segments);
	}
}

caldav_uri::static_constructor();

?>
