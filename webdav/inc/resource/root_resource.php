<?php
class root_resource extends collection_resource
{
	public function __construct($datastore, $uri)
	{
		parent::__construct($datastore, $uri);
	}

	public function get_title()
	{
		return 'webdav';
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:' && $property_name == 'displayname')
			return $xml_writer->text('webdav');
		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}

	public function get_children($filter=NULL)
	{
		$resources = array();
		foreach ($this->_datastore->get_groups(true) as $group => $group_info)
			$resources[] = new user_collection_resource($this->_datastore, new caldav_uri($this->get_uri(), $group), $group_info);
		$resources[] = new users_resource($this->_datastore, new caldav_uri($this->get_uri(), 'users'));
		return $resources;
	}
}
?>
