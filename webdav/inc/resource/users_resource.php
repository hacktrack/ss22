<?php
class users_resource extends collection_resource
{
	public function __construct($datastore, $uri)
	{
		parent::__construct($datastore, $uri);
	}

	private function create_child_resource($group, $group_info, $gal_contact = null)
	
	{
		$segements = $this->get_uri()->get_segments();
		$type = end($segements);

		try
		{
			if ($type == 'users')
				return new principal_resource($this->_datastore, new caldav_uri($this->get_uri(), $group), $gal_contact);
			else if ($type == 'inbox')
				return new inbox_folder_resource($this->_datastore, new caldav_uri($this->get_uri(), $group), $group_info);
			else if ($type == 'outbox')
				return new outbox_resource($this->_datastore, new caldav_uri($this->get_uri(), $group), $group_info);
		}
		catch (not_found_exception $e)
		{
			 			return null;
		}
	}

	public function get_children($filter=null)
	{
		$resources = array();
		foreach ($this->_datastore->get_groups(false) as $group => $group_info)
		{
			$resource = $this->create_child_resource($group, $group_info);
			if ($resource)
				$resources[] = $resource;
		}
		return $resources;
	}
	
	public function get_items_filtered($filter, $dummy = null, $gal_search = false)
	{
		$resources = array();
		foreach ($this->_datastore->get_item_info('', '@@GAL@@', null, $filter) as $id => $item)
		{
			if ($gal_search)
				$resource = $this->create_child_resource($item['email'], null, $item);
			else
				$resource = $this->create_child_resource($item['email'], null);

			if ($resource)
				$resources[] = $resource;
		}

		return $resources;
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:' && $property_name == 'resourcetype')
		{
			parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
			$xml_writer->writeElementNS(null, 'principal-collection', 'http://icewarp.com/ns/');
			return;
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}
}
?>
