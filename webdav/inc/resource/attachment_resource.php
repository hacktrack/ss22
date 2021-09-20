<?php
class attachment_resource extends resource
{
	private $_group;
	private $_folder_path;
	private $_item_id;
	private $_attachment_id;
	private $_attachment_info;
	private $_zip;

	public function __construct($datastore, $uri, $ticket_info = null)
	{
		parent::__construct($datastore, $uri);
		if ($ticket_info == null)
		{
			$segments = $uri->get_segments();
			array_shift($segments);  			$this->_group = array_shift($segments);
			$this->_attachment_id = array_pop($segments);
			$this->_item_id = array_pop($segments);
			$this->_folder_path = implode(DAV_PATH_SEPARATOR, $segments);
			$this->_zip = false;
		}
		else
		{
			$slash_pos = strpos($ticket_info['item_id'], '/');
			$this->_group = '';
			$this->_item_id = substr($ticket_info['item_id'], 0, $slash_pos);
			$this->_attachment_id = substr($ticket_info['item_id'], $slash_pos + 1);
			$this->_folder_path = $ticket_info['folder'];
			$this->_zip = $ticket_info['zip'] == '1';
		}
		$this->_attachment_info = $this->_datastore->get_attachment($this->_group,
			$this->_folder_path,
			$this->_item_id,
			$this->_attachment_id,
			$this->_zip);
	}

	public function get_content_type()
	{
		return $this->_attachment_info['type'];
	}

	public function get_title()
	{
		return $this->_attachment_info['title'];
	}

	public function get_etag()
	{
		return $this->_attachment_info['etag'];
	}

	public function get_content()
	{
		 		return $this->_attachment_info['data'];
	}
	
	public function get_content_path()
	{	
		return $this->_attachment_info['datapath'];
	}

	public function make_ticket($read, $write, $expiration)
	{
		$rights = (1 << 31);
		if ($read)
			$rights |= 32 | 64;
		if ($write)
			$rights |= 2 | 16;
		return $this->_datastore->make_ticket($this->_group,
			$this->_folder_path,
			$this->_item_id,
			$this->_attachment_id,
			$rights, $expiration);
	}
	
	public function put($stream)
	{
		return $this->_datastore->put_attachment($this->_group,
			$this->_folder_path,
			$this->_item_id,
			$this->_attachment_id,
			$stream);
	}

	public function get_property_names($include_all)
	{
		$additional_properties = array(
			array('DAV:', 'creationdate'),
			array('DAV:', 'getlastmodified')
		);

		if ($include_all)
			$additional_properties[] = array('DAV:', 'lockdiscovery');

		return array_merge(
			parent::get_property_names($include_all),
			$additional_properties
		);
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'creationdate')
			{
				$xml_writer->writeAttributeNS('B', 'dt', 'urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/', 'dateTime.tz');
				$xml_writer->text($this->_attachment_info['creationdate']);
				return;
			}

			if ($property_name == 'getlastmodified')
			{
				$xml_writer->writeAttributeNS('B', 'dt', 'urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/', 'dateTime.rfc1123');
				$xml_writer->text($this->_attachment_info['lastmodified']);
				return;
			}

			if ($property_name == 'lockdiscovery')
				return $this->write_lockdiscovery($xml_writer, $xml_dav_prefix);

			if (isset($this->_attachment_info['size']) && $property_name == 'getcontentlength')
				return $xml_writer->text($this->_attachment_info['size']);
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}

	public function lock($lock_info)
	{
		$this->_datastore->lock_item($this->_group,
			$this->_folder_path,
			$this->_item_id,
			$lock_info);

		 		$this->_attachment_info = $this->_datastore->get_attachment($this->_group,
			$this->_folder_path,
			$this->_item_id,
			$this->_attachment_id,
			$this->_zip);
		if (!$this->_attachment_info)
			throw new not_found_exception();

		return $this->get_lock_token();
	}

	public function get_lock_info()
	{   
		if ($this->_attachment_info['lockinfo'])
			return $this->_attachment_info['lockinfo'];
		if (!$this->_attachment_info['lockhash'])
			return null;
		return array(
			'scope' => 'exclusive',
			'type' => 'write',
			'owner_text' => 'unknown',
			'depth' => '1');
	}

	public function get_lock_token()
	{
		if ($this->_attachment_info['lockhash'])
			return 'uniqid:' . $this->_attachment_info['lockhash'];
		return null;
	}

	public function unlock()
	{
		$this->_datastore->unlock_item($this->_group,
			$this->_folder_path,
			$this->_item_id);
		unset($this->_attachment_info['lockinfo']);
		unset($this->_attachment_info['lockhash']);
	}
}
?>
