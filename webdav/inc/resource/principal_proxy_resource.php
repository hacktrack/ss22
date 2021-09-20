<?php
class principal_proxy_resource extends resource
{
	private $_principal_resource;
	private $_read;

	public function __construct($datastore, $uri)
	{
		parent::__construct($datastore, $uri);
		$segments = $uri->get_segments();
		$name = array_pop($segments);
		if ($name != 'calendar-proxy-read' && $name != 'calendar-proxy-write')
			throw new not_found_exception();
		$this->_read = $name == 'calendar-proxy-read';
		$this->_principal_resource = resource::get_resource($datastore, new caldav_uri($segments));
	}

	public function get_title()
	{
		return $this->_principal_resource->get_title();
	}

	public function get_property_names($include_all)
	{
		$additional_properties = array(
			array('DAV:', 'principal-URL'),
			array('DAV:', 'group-member-set')
		);

		return array_merge(
			parent::get_property_names($include_all),
			$additional_properties
		);
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'resourcetype')
			{
				parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
				$xml_writer->writeElementNS($xml_dav_prefix, 'principal', null);
				$xml_writer->writeElementNS(null, 'calendar-proxy-' . ($this->_read ? 'read' : 'write'), 'http://calendarserver.org/ns/');
				return;
			}
			
			if ($property_name == 'principal-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_uri()->to_string());
				
			if ($property_name == 'group-member-set')
			{
				$group_name = $this->_principal_resource->get_group_name();
				$rights = $this->_datastore->get_folder_rights($group_name, '');
				foreach ($rights as $group => $group_info)
				{
					if ($group == $group_name || $group == 'anyone')
						continue;
					if (($group_info['rights'] == 'lr' && $this->_read) || ($group_info['rights'] != 'lr' && !$this->_read))
					{
						$principal_uri = new caldav_uri(array('users', $group));
						$xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $principal_uri->to_string() . '/');
					}
				}
				return;
			}
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}
}
?>
