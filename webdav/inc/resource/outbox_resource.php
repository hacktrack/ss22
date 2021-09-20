<?php
class outbox_resource extends collection_resource
{
	private $_group_info;

	public function __construct($datastore, $uri, $group_info = null)
	{
		parent::__construct($datastore, $uri);
		if ($group_info == null)
		{
			$segments = $uri->get_segments();
			$this->_group_info = $this->_datastore->get_group_info($segments[1]);
			if (!$this->_group_info)
				throw new not_found_exception();
		}
		else
			$this->_group_info = $group_info;
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'displayname')
				return $xml_writer->text($this->_group_info['displayname']);

			if ($property_name == 'resourcetype')
			{
				parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
				$xml_writer->writeElementNS(null, 'schedule-outbox', 'urn:ietf:params:xml:ns:caldav');
				return;
			}
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}

	public function post($request, $response)
	{
		$stream = $request->get_body_stream();
		$itip_request = stream_get_contents($stream);
		fclose($stream);
		do_log('<<< ' . $itip_request, 2);

		$schedule_response = $this->_datastore->send_itip($this->_group_info['email'], $itip_request);
		if (empty($schedule_response))
			throw new bad_request_exception();

		$writer = $response->get_xml_writer();
		$writer->startElementNS(null, 'schedule-response', 'urn:ietf:params:xml:ns:caldav');

		foreach ($schedule_response as $response_line)
		{
			$writer->startElement('response');
			$writer->writeElement('recepient', $response_line['ATTENDEE']);
			$writer->writeElement('request-status', $response_line['STATUS']);
			if (!empty($response_line['DATA']))
			{
				$writer->startElement('calendar-data');
				 				$writer->writeRaw(create_cdata($response_line['DATA']));
				$writer->endElement();
			}
			$writer->endElement();
		}

		$writer->endElement();
		$writer->flush();

		$headers = array('Content-Type: application/xml');
		$response->http_response('200 OK', $headers);
	}
}
?>
