<?php
class inbox_folder_resource extends collection_resource
{
	private $_group_info;
	private $_sync_token;

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

	public function get_ctag()
	{
		if ($this->_sync_token == null)
			$this->_sync_token = $this->_datastore->get_inbox_state($this->_group_info['email']);
		return $this->_sync_token;
	}

	public function get_children($filter = null)
	{
		$resources = array();
		if ($filter == null || !isset($filter['is_collection']))
		{
			$last_state = null;
			foreach ($this->_datastore->list_inbox_items($this->_group_info['email'], $last_state) as $id => $item)
				$resources[] = new inbox_resource($this->_datastore, new caldav_uri($this->get_uri(), $id), $item, $this);
		}

		return $resources;
	}


	public function get_property_names($include_all)
	{
		return array_merge(
			parent::get_property_names($include_all),
			array(
				array('urn:ietf:params:xml:ns:caldav', 'calendar-free-busy-set'),
				array('http://calendarserver.org/ns/', 'getctag'),
				array('DAV:', 'sync-token')
			)
		);
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
				$xml_writer->writeElementNS(null, 'schedule-inbox', 'urn:ietf:params:xml:ns:caldav');
				return;
			}

			if ($property_name == 'sync-token')
			{
				$xml_writer->text($this->get_ctag());
				return;
			}
		}

		if ($namespace_uri == 'urn:ietf:params:xml:ns:caldav' && $property_name == 'calendar-free-busy-set')
		{
			 			 			 
			 			 			 			 			 			 			 			$home_resource = resource::get_resource($this->_datastore, new caldav_uri(array($this->_group_info['email'])));
			foreach ($home_resource->get_children(array('is_collection' => true)) as $collection)
			{
				if (strpos(' EJT', $collection->get_internal_type()) !== false)
					$xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $collection->get_uri()->to_string());
			}
			return;
		}

		if ($namespace_uri == 'http://calendarserver.org/ns/' && $property_name == 'getctag')
		{
			$xml_writer->text($this->get_ctag());
			return;
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}

	public function patch_properties($set_properties, $remove_properties)
	{
		$failed_properties = $remove_properties;
		foreach ($set_properties as $property)
		{
			if ($property[0] == 'urn:ietf:params:xml:ns:caldav' && $property[1] == 'calendar-free-busy-set')
				continue;
			$failed_properties[] = $property;
		}
		return $failed_properties;
	}
}

?>
