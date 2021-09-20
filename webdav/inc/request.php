<?php
require_once("caldav_uri.php");

class webdav_request
{
	var $_method;
	var $_uri;
	var $_destination_uri;
	var $_if_match;
	var $_if_none_match;
	var $_if_schedule_match;
	var $_if;
	var $_depth;
	var $_ticket;
	var $_brief;

	function __construct()
	{
		$this->_method = strtolower($_SERVER['REQUEST_METHOD']);
		$this->_uri = new caldav_uri($_SERVER['REQUEST_URI']);
		if (!empty($_SERVER['HTTP_DESTINATION']))
			$this->_destination_uri = new caldav_uri($_SERVER['HTTP_DESTINATION']);
		$this->_depth = $_SERVER['HTTP_DEPTH'];
		$this->_if_match = $this->parse_match_header($_SERVER['HTTP_IF_MATCH']);
		$this->_if_none_match = $this->parse_match_header($_SERVER['HTTP_IF_NONE_MATCH']);
		$this->_if_schedule_match = $this->parse_match_header($_SERVER['HTTP_IF_SCHEDULE_TAG_MATCH']);
		$this->_if = $this->parse_if_header($_SERVER['HTTP_IF']);
		$this->_brief = $_SERVER['HTTP_BRIEF'] == 't';

		$uri_segments = $this->_uri->get_segments();
		if (count($uri_segments) >= 2 && $uri_segments[0] == 'ticket')
		{
			array_shift($uri_segments);
			$this->_ticket = array_shift($uri_segments);
		}
		else
		{
			$this->_ticket = $_GET['ticket'];
			if (empty($this->_ticket))
				$this->_ticket = $_SERVER['HTTP_TICKET'];
		}
	}

	function log()
	{
        $log_headers = "";
		if ($_SERVER['HTTP_X_LITMUS'])
			$log_headers .= "X-Litmus: " . $_SERVER['HTTP_X_LITMUS'] . " ";
		if ($this->_depth)
			$log_headers .= "Depth: $this->_depth ";
		if ($_SERVER['HTTP_IF_MATCH'])
			$log_headers .= "If-Match: " . $_SERVER['HTTP_IF_MATCH'] . " ";
		if ($_SERVER['HTTP_IF_NONE_MATCH'])
			$log_headers .= "If-None-Match: " . $_SERVER['HTTP_IF_NONE_MATCH'] . " ";
		if ($_SERVER['HTTP_IF'])
			$log_headers .= "If: " . $_SERVER['HTTP_IF'] . " ";
		if ($_SERVER['HTTP_DESTINATION'])
			$log_headers .= "Destination: " . $_SERVER['HTTP_DESTINATION'] . " ";
		if ($_SERVER['HTTP_USER_AGENT'])
			$log_headers .= "User-Agent: " . $_SERVER['HTTP_USER_AGENT'] . " ";
		if ($_SERVER['HTTP_BRIEF'])
			$log_headers .= "Brief: " . $_SERVER['HTTP_BRIEF'] . " ";
		$log_str = '<<< ' . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'] . ($log_headers?' [' . trim($log_headers) . ']':'');
		do_log($log_str, 2);
	}

	function has_body()
	{
		return $_SERVER['CONTENT_LENGTH'] > 0;
	}

	function get_xml_body()
	{
		$body = file_get_contents("php://input");
		do_log('<<< ' . $body, 2);
		return text_to_xml($body);
	}

	function get_body_stream()
	{
		if (isset($_SERVER['HTTP_CONTENT_ENCODING']))
		{
			 				 			if ($_SERVER['HTTP_CONTENT_ENCODING'] != 'identity')
				throw new unsupported_media_type_exception();
		}
		return fopen("php://input", "r");
	}

	function get_resource($datastore)
	{
		return resource::get_resource($datastore, $this->_uri, $this->_if_match, $this->_if_none_match, $this->_if_schedule_match);
	}

	private function parse_match_header($match)
	{
		if (!$match)
			return null;
		if ($match == '*')
			return '*';
		return preg_split("/[\s,]*\\\"([^\\\"]+)\\\"[\s,]*|[\s,]+/", $match, 0, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
	}

	private function parse_if_header($if)
	{
		if (!$if)
			return array();

		$matches = array();
		$regex = '/(?:\<(?P<uri>.*?)\>\s)?\((?P<not>Not\s)?(?:\<(?P<token>[^\>]*)\>)?(?:\s?)(?:\[(?P<etag>[^\]]*)\])?\)/im';
		preg_match_all($regex, $if, $matches, PREG_SET_ORDER);

		$conditions = array();
		foreach ($matches as $match)
		{
			$condition = array(
				'uri' => $match['uri'],
				'tokens' => array(
					array($match['not'] ? 0 : 1, $match['token'], isset($match['etag']) ? $match['etag'] : '')
				),
			);

			if (!$condition['uri'] && count($conditions))
			{
				$conditions[count($conditions) - 1]['tokens'][] = array(
					$match['not'] ? 0 : 1,
					$match['token'],
					isset($match['etag']) ? $match['etag'] : '');
			}
			else
			{
				$conditions[] = $condition;
			}
		}

		return $conditions;
	}
}

?>