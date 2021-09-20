<?php
class webdav_response
{
	var $close_buffer;

	function __construct()
	{
	}

	function start_buffering()
	{
		ob_start();
		ob_start("ob_gzhandler");
		$this->close_buffer = true;
	}

	function flush()
	{
		if ($this->close_buffer)
		{
			if ($_SESSION["log_level"] >= 2)
				do_log('>>> ' . ob_get_contents(), 2);
			$length = ob_get_length();
			ob_end_flush();
			if ($length == 0)
				ob_clean();
			header('Content-Length: ' . ob_get_length());
			ob_end_flush();
		}
	}

	function get_xml_writer()
	{
		$this->start_buffering();
		$writer = new XMLWriter();
		$writer->openURI('php://output');
		$writer->setIndent(true);
		$writer->startDocument('1.0', 'utf-8');
		return $writer;
	}

	function http_response($status, $headers = array(), $body = '', $dont_close_buffer= false)
	{
		header('HTTP/1.1 ' . $status);
		header('MS-Author-Via: DAV');
		header('Access-Control-Allow-Origin: *');    

		$levels[] = '1';
		 		if (strncmp($_SERVER['HTTP_USER_AGENT'], "WebDAVFS/", 9) === 0)
			$levels[] = '2';
		$levels[] = 'access-control';
		$levels[] = 'calendar-access';
		$levels[] = 'calendar-auto-schedule';
		$levels[] = 'calendar-proxy';  		$levels[] = 'calendarserver-principal-property-search';
		$levels[] = 'extended-mkcol';
		$levels[] = 'addressbook';
		header('DAV: ' . implode(', ', $levels));
        $log_headers = '';
		foreach ($headers as $header)
		{
			header($header, false);
			$log_headers .= $header . ' ';
		}

		do_log(">>> HTTP/1.1 " . $status . ($log_headers ? ' [' . trim($log_headers) . ']' : ''), 2);

		if ($body)
		{
			$this->start_buffering();
			echo $body;
		}
		else if ((!$dont_close_buffer) && (!$this->close_buffer))
		{
			header('Content-Length: 0');
		}
	}

	function http_response_stream($status, $headers, $stream)
	{
		$old_close_buffer = $this->close_buffer;
		$this->close_buffer = true;
		$this->http_response($status, $headers);
		$this->close_buffer = $old_close_buffer;
		ini_set('max_execution_time',10800);  
		$stat = fstat($stream);
		if (isset($stat['size']))
			header('Content-Length: ' . $stat['size']);

		$dest_stream = fopen("php://output", "w");
		stream_copy_to_stream($stream, $dest_stream);
		fclose($dest_stream);
	}

	function http_response_stream_xoperation($status, $headers, $data_path)
	{
		$this->http_response($status, $headers,'',true);

		header('Content-Length: 0');
		header("X-File-Operation: filepath=".urlencode($data_path)."&delete=0");
	}
}
?>