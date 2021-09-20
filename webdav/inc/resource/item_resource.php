<?php
class item_resource extends resource
{
	private $_item_info;
	private $_file_info;
	private $_parent_resource;
	private $_group;
	private $_folder_path;
	private $_item_id;
	private $_ticket_info;

	public function __construct($datastore, $uri, $item_info = null, $parent_resource = null, $ticket_info = null)
	{
		parent::__construct($datastore, $uri);
		$this->_ticket_info = $ticket_info;

		if ($ticket_info == null)
		{
			$segments = $uri->get_segments();
			$this->_group = array_shift($segments);
			$this->_item_id = array_pop($segments);
			$this->_folder_path = implode(DAV_PATH_SEPARATOR, $segments);
		}
		else
		{
			$this->_group = '';
			$this->_item_id = $ticket_info['item_id'];
			$this->_folder_path = $ticket_info['folder'];
		}

		if ($item_info == null)
		{
			$this->_item_info = $this->_datastore->get_item_info($this->_group, $this->_folder_path, $this->_item_id);
			if ((!$this->_item_info || count($this->_item_info) == 0))
				throw new not_found_exception();
			$this->_item_info = array_shift($this->_item_info);
		}
		else
			$this->_item_info = $item_info;

		$this->_parent_resource = $parent_resource;
	}

	public function get_item_id()
	{
		return $this->_item_info['id'];
	}

	public function get_collection()
	{
		if (!$this->_parent_resource)
		{
			$segments = $this->get_uri()->get_segments();
			array_pop($segments);
			$uri = new caldav_uri($segments);
			$this->_parent_resource = resource::get_resource($this->_datastore, $uri);
		}
		return $this->_parent_resource;
	}

	public function get_items_filtered($filter)
	{
		return $this->get_collection()->get_items_filtered($filter, $this->_item_id);
	}

	public function get_internal_type()
	{
		return $this->_item_info['type'];
	}

	public function get_content_type()
	{
		switch ($this->get_internal_type())
		{
			case 'C': return 'text/x-vcard';
			case 'E': return 'text/calendar; component="VEVENT"';
			case 'J': return 'text/calendar; component="VJOURNAL"';
			case 'T': return 'text/calendar; component="VTODO"';
			case 'N': return 'text/x-vnote';
			case 'F':
				if ($this->_file_info == null)
					$this->_file_info = $this->_datastore->get_file_info($this->_group, $this->_folder_path, $this->_item_info['id']);
				return $this->_file_info['type'];
		}
		return 'application/octet-stream';
	}

	public function get_title()
	{
		$this_title = $this->_item_info['title'];

		switch ($this->get_internal_type())
		{
			case 'C':
				$this_title = $this->_item_info['title'] . '.vcf';
				break;
			case 'E':
			case 'J':
			case 'T':
				$this_title = $this->_item_info['title'] . '.ics';
		}

		if ($this->_ticket_info == null)
		{
			return $this_title;
		}
		else
		{
			$segements = $this->get_uri()->get_segments();
			$parent_title= urldecode(end($segements));

			$parent_info = pathinfo($parent_title);
			$this_info = pathinfo($this_title);

			if($parent_info['extension'] == $this_info['extension'])
			{
				 				return $parent_title;
			}
			else
			{
				return $this_title;
			}

		}
	}

	public function get_etag()
	{
		if (isset($this->_item_info['etag']))
			return '"' . $this->_item_info['etag'] . '"';
		return '';
	}

	public function get_schedule_tag()
	{
		return $this->get_etag();
	}

	public function get_content()
	{
		return $this->_datastore->get_item($this->_group, $this->_folder_path, $this->_item_info['id']);
	}

	public function get_content_filtered($data_filter)
	{
		return $this->_datastore->get_item($this->_group, $this->_folder_path, $this->_item_info['id'], $data_filter);
	}

	public function is_get_computed()
	{
		return !isset($this->_item_info['size']);
	}

	public function get_property_names($include_all)
	{
		$additional_properties = array(
			array('DAV:', 'creationdate'),
			array('DAV:', 'getlastmodified')
		);

		if ($include_all)
		{
			$additional_properties[] = array('DAV:', 'acl');
			$additional_properties[] = array('DAV:', 'owner');
			$additional_properties[] = array('DAV:', 'current-user-privilege-set');
			$additional_properties[] = array('DAV:', 'lockdiscovery');
			$additional_properties[] = array('http://calendarserver.org/ns/', 'uid');
			$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'schedule-tag');
			$additional_properties[] = array('http://icewarp.com/ns/', 'filehash');
			$additional_properties[] = array('http://icewarp.com/ns/', 'filepublicurl');
		}

		return array_merge(
			parent::get_property_names($include_all),
			$additional_properties
		);
	}

	public function get_owner_uri()
	{
		return $this->get_collection()->get_owner_uri();
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'creationdate')
			{
				$xml_writer->writeAttributeNS('B', 'dt', 'urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/', 'dateTime.tz');
				$xml_writer->text($this->_item_info['creationdate']);
				return;
			}

			if ($property_name == 'getlastmodified')
			{
				$xml_writer->writeAttributeNS('B', 'dt', 'urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/', 'dateTime.rfc1123');
				$xml_writer->text($this->_item_info['lastmodified']);
				return;
			}

			if (isset($this->_item_info['size']) && $property_name == 'getcontentlength')
				return $xml_writer->text($this->_item_info['size']);

			if ($property_name == 'acl')
				return $this->get_collection()->write_acl($xml_writer, $xml_dav_prefix, true);

			if ($property_name == 'owner' || $property_name == 'current-user-privilege-set')
				return $this->get_collection()->write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);

			if ($property_name == 'lockdiscovery')
				return $this->write_lockdiscovery($xml_writer, $xml_dav_prefix);
		}

		if ($namespace_uri == 'http://calendarserver.org/ns/')
		{
			if ($property_name == 'uid')
			{
				$xml_writer->text($this->_item_info['uid']);
				return;
			}
		}

		if ($namespace_uri == 'urn:ietf:params:xml:ns:caldav')
		{
			if ($property_name == 'schedule-tag')
			{
				$xml_writer->text($this->get_schedule_tag());
				return;
			}
		}

		if ($namespace_uri == 'http://icewarp.com/ns/')
		{
			if ($property_name == 'filehash')
			{
				$xml_writer->text($this->_item_info['filehash']);
				return;
			}

			if ($property_name == 'filepublicurl')
			{
				$xml_writer->text($this->_item_info['filepublicurl']);
				return;
			}
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}

	public function delete($schedule_reply)
	{
		$result = null;
		if (isset($this->_item_info['allids']) && count($this->_item_info['allids']) > 0)
		{
			for ($i = 0; $i < count($this->_item_info['allids']); $i++)
				$result = $this->_datastore->delete_item($this->_group, $this->_folder_path, $this->_item_info['allids'][$i], $schedule_reply);
			return $result;
		}
		else
		{
			return $this->_datastore->delete_item($this->_group,
				$this->_folder_path,
				$this->_item_info['id'],
				$schedule_reply);
		}
	}

	public function patch_properties($set_properties, $remove_properties)
	{
		$failed_properties = $remove_properties;
		foreach ($set_properties as $property)
		{
			if ($property[1] == 'filehash')
			{
				$file_hash = '';
				if ($property[2]&&$property[2]->_children[0])
					$file_hash = $property[2]->_children[0]->get_data();

				$result = $this->_datastore->add_file_hash($this->_group, $this->_folder_path, $this->_item_info['id'], $file_hash);

				if ($result)
					continue;
			}

			$failed_properties[] = $property;
		}

		return $failed_properties;
	}

	public function make_ticket($read, $write, $expiration)
	{
		$rights = (1 << 31);
		if ($read)
			$rights |= 32 | 64;

		if ($write)
			$rights |= 2 | 16;

		return $this->_datastore->make_ticket($this->_group, $this->_folder_path, $this->_item_id, null, $rights, $expiration);
	}

	public function copy_to($collection_resource, $item_id)
	{
		if (!($collection_resource instanceof user_collection_resource))
			throw new bad_gateway_exception();

		 		 		if (($this->get_internal_type() != 'F') && $collection_resource->get_uri()->equals($this->get_collection()->get_uri()))
			throw new forbidden_exception();

		$segments = $collection_resource->get_uri()->get_segments();
		$target_group = array_shift($segments);
		$target_folder_path = implode(DAV_PATH_SEPARATOR, $segments);
		$this->_datastore->copy_item($this->_group,
			$this->_folder_path,
			$this->_item_info['id'],
			$target_group,
			$target_folder_path,
			$item_id);
	}

	public function move_to($collection_resource, $item_id)
	{
		if ($collection_resource->get_uri()->equals($this->get_collection()->get_uri()))
		{
			$this->_datastore->rename_item($this->_group,
				$this->_folder_path,
				$this->_item_info['id'],
				$item_id);
		}
		else
		{
			$this->copy_to($collection_resource, $item_id);
			$this->delete(false);
		}
	}
 
	public function lock($lock_info)
	{
		$this->_datastore->lock_item($this->_group,
			$this->_folder_path,
			$this->_item_info['id'],
			$lock_info);

		 		$this->_item_info = $this->_datastore->get_item_info($this->_group, $this->_folder_path, $this->_item_id);
		if ((!$this->_item_info || count($this->_item_info) == 0))
			throw new not_found_exception();				
		$this->_item_info = array_shift($this->_item_info);

		return $this->get_lock_token();
	}

	public function get_lock_info()
	{
		if ($this->_item_info['lockinfo'])
			return $this->_item_info['lockinfo'];

		if (!$this->_item_info['lockhash'])
			return null;

		return array(
			'scope' => 'exclusive',
			'type' => 'write',
			'owner_text' => 'unknown',
			'depth' => '1');
	}

	public function get_lock_token()
	{
		if ($this->_item_info['lockhash'])
			return 'uniqid:' . $this->_item_info['lockhash'];
		return null;
	}

	public function unlock()
	{
		$this->_datastore->unlock_item($this->_group,
			$this->_folder_path,
			$this->_item_info['id']);
		unset($this->_item_info['lockinfo']);
		unset($this->_item_info['lockhash']);
	}
}
?>
