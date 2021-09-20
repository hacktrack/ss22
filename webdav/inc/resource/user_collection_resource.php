<?php
$datastore_types = array('VEVENT' => 'E', 'VJOURNAL' => 'J', 'VTODO' => 'T', 'VNOTE' => 'N', 'VCARD' => 'C');

class user_collection_resource extends collection_resource
{
	private $_groupdav_types = array('C' => 'vcard-collection', 'E' => 'vevent-collection', 'J' => 'vjournal-collection', 'N' => 'vnote-collection', 'T' => 'vtodo-collection');
	private $_icewarp_types = array('C' => 'contactcollection', 'E' => 'eventcollection', 'F' => 'filecollection', 'J' => 'journalcollection', 'N' => 'notecollection', 'T' => 'taskcollection');
	private $_folder_info;
	private $_group;
	private $_folder_path;
	private $_last_modified = null;
	private $_tag;
	private $_rights = null;
	public $folder_info;

	public function __construct($datastore, $uri, $folder_info = null)
	{
		parent::__construct($datastore, $uri);
		$segments = $uri->get_segments();
		$this->_group = $segments[0];
		unset($segments[0]);
		$this->_folder_path = implode(DAV_PATH_SEPARATOR, $segments);
		if ($folder_info == null)
		{
			if (count($segments) == 0)
				$this->_folder_info = $this->_datastore->get_group_info($this->_group);
			else
				$this->_folder_info = $this->_datastore->get_folder_info($this->_group, $this->_folder_path);
			if (!$this->_folder_info)
				throw new not_found_exception();
		}
		else
			$this->_folder_info = $folder_info;
	}

	public function get_collection_id()
	{
		return $this->_folder_info['id'];
	}

	public function get_internal_type()
	{
		return $this->_folder_info['type'];
	}

	private function is_account_root()
	{
		return $this->_folder_path == '' || $this->_folder_path == $_SESSION['resources'] || $this->_folder_info['type'] == 'S' || $this->_folder_info['type'] == 'P' || $this->_folder_info['type'] == 'R';
	}

	private function is_account_root_ancestor()
	{
		return $this->_folder_info['type'] == 'X';
	}

	public function get_etag()
	{
		return '"' . (!empty($this->_folder_info['creationdate']) ? $this->_folder_info['creationdate'] : '1970-01-01T00:00:00Z') . '"';
	}

	public function get_title()
	{
		if (empty($this->_folder_info['displayname']))
			return parent::get_title();
		return $this->_folder_info['displayname'];
	}

	private function get_subfolders_recursive($group, $folder_path)
	{
		$subsubfolders = array();
		$subfolders = $this->_datastore->get_subfolders($group, $folder_path);
		foreach ($subfolders as $subfolder)
			$subsubfolders = array_merge($subsubfolders, $this->get_subfolders_recursive($group, $subfolder));
		return array_merge($subfolders, $subsubfolders);
	}

	public function get_children($filter=null)
	{
		$resources = array();

		$iCal =
			strpos($_SERVER['HTTP_USER_AGENT'], 'iCal/') !== false ||
			strpos($_SERVER['HTTP_USER_AGENT'], 'CalendarAgent/') !== false;
		$use_flat_folders =
			($iCal ||
			 strpos($_SERVER['HTTP_USER_AGENT'], 'iCalendar/') !== false ||
			 strpos($_SERVER['HTTP_USER_AGENT'], 'DataAccess/') !== false ||
			 strpos($_SERVER['HTTP_USER_AGENT'], 'Address%20Book/') !== false ||
			 strpos($_SERVER['HTTP_USER_AGENT'], 'AddressBook/') !== false ||
			 strpos($_SERVER['HTTP_USER_AGENT'], 'iOS/') !== false);
		
		 		if (count($this->get_uri()->get_segments()) == 1 && $use_flat_folders)
		{
			if (strpos($_SERVER['HTTP_USER_AGENT'], 'Address%20Book/') !== false ||
			strpos($_SERVER['HTTP_USER_AGENT'], 'AddressBook/') !== false)
				$subfolders = array($this->_datastore->_contacts_folder);
			else
				$subfolders = $this->get_subfolders_recursive($this->_group, $this->_folder_path);
		}
		else if (!$use_flat_folders)
			$subfolders = $this->_datastore->get_subfolders($this->_group, $this->_folder_path);
		else
			$subfolders = array();

		foreach ($subfolders as $subfolder)
		{
			$subfolder_name = substr($subfolder, empty($this->_folder_path) ? 0 : strlen($this->_folder_path) + 1);
			$subfolder_info = $this->_datastore->get_folder_info($this->_group, $subfolder);
			if (!$iCal || $subfolder_info['type'] != 'J')
				$resources[] = new user_collection_resource($this->_datastore, new caldav_uri($this->get_uri(), $subfolder_name), $subfolder_info);
		}

		if ($filter == null || !isset($filter['is_collection']))
		{
			foreach ($this->_datastore->get_item_info($this->_group, $this->_folder_path) as $id => $item)
				$resources[] = new item_resource($this->_datastore, new caldav_uri($this->get_uri(), $id), $item, $this);
		}

		return $resources;
	}

	public function get_items_filtered($filter, $item_id = null, $dummy = null)
	{
		$resources = array();
		foreach ($this->_datastore->get_item_info($this->_group, $this->_folder_path, $item_id, $filter) as $id => $item)
			$resources[] = new item_resource($this->_datastore, new caldav_uri($this->get_uri(), $id), $item, $this);

		return $resources;
	}

	public function get_free_busy($start, $end)
	{
		return $this->_datastore->get_free_busy($this->_group,
			$this->_folder_path,
			array('start' => $start, 'end' => $end));
	}

	public function get_ctag()
	{
		if ($this->_last_modified == null)
			$this->_last_modified = $this->_datastore->get_folder_last_modified($this->_group, $this->_folder_path, $this->_tag);
		return $this->_tag;
	}

	public function get_property_names($include_all)
	{
		$additional_properties = array();

		if (!$this->is_account_root() && !$this->is_account_root_ancestor())
		{
			$additional_properties[] = array('DAV:', 'creationdate');
			$additional_properties[] = array('DAV:', 'getlastmodified');
		}

		if ($include_all)
		{
			$additional_properties[] = array('DAV:', 'supported-report-set');
			$additional_properties[] = array('DAV:', 'supported-query-grammar-set');
			$additional_properties[] = array('DAV:', 'supported-privilege-set');
			$additional_properties[] = array('DAV:', 'acl-restrictions');
			$additional_properties[] = array('DAV:', 'owner');
			$additional_properties[] = array('DAV:', 'acl');
			$additional_properties[] = array('DAV:', 'current-user-privilege-set');

			if (!$this->is_account_root())
			{
				if (!$this->is_account_root_ancestor())
				{
					$additional_properties[] = array('http://icewarp.com/ns/', 'collectionowner');
					$additional_properties[] = array('http://icewarp.com/ns/', 'collectionid');
				}
			}
			else
			{
				$additional_properties[] = array('http://icewarp.com/ns/', 'deviceid');
			}

			if (strpos(' EJT', (string)$this->_folder_info['type']))
			{
				if ($this->_folder_info['description'] !== null)
					$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'calendar-description');
				if ($this->_folder_info['timezone'] !== null)
					$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'calendar-timezone');
				$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'supported-calendar-component-set');
				$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'supported-calendar-data');
				$additional_properties[] = array('http://apple.com/ns/ical/', 'calendar-order');
			}
			else if ($this->_folder_info['type'] == 'C')
			{
				if ($this->_folder_info['description'] !== null)
					$additional_properties[] = array('urn:ietf:params:xml:ns:carddav', 'addressbook-description');
				$additional_properties[] = array('urn:ietf:params:xml:ns:carddav', 'supported-collation-set');
			}

			$additional_properties[] = array('http://calendarserver.org/ns/', 'getctag');
			$additional_properties[] = array('DAV:', 'sync-token');
		}

		return array_merge(
			parent::get_property_names($include_all),
			$additional_properties
			);
	}

	private function get_rights()
	{
		if (!$this->_rights)
			$this->_rights = $this->_datastore->get_folder_rights($this->_group, $this->_folder_path);
		return $this->_rights;
	}

	private function write_rights($writer, $xml_dav_prefix, $rights)
	{
		$iCal = strpos($_SERVER['HTTP_USER_AGENT'], 'iCal/') !== false || strpos($_SERVER['HTTP_USER_AGENT'], 'CalendarAgent/') !== false;
		$bind_collection = $bind_item = false;
		$unbind_collection = $unbind_item = false;
		$lookup = $read_content = false;
		$write_acl = $write_content = false;

		$writer->startElementNS($xml_dav_prefix, 'privilege', null);
		$writer->writeElementNS($xml_dav_prefix, 'read-current-user-privilege-set', null);
		$writer->endElement();

		foreach (str_split($rights) as $permission)
		{
			$writer->startElementNS($xml_dav_prefix, 'privilege', null);
			switch ($permission)
			{
				case 'i':
					$writer->writeElementNS(null, 'bind-item', 'http://icewarp.com/ns/');
					$bind_item = true;
					break;
				case 'a':
					$writer->writeElementNS($xml_dav_prefix, 'write-acl', null);
					$write_acl = true;
					break;
				case 't':
					$writer->writeElementNS(null, 'unbind-item', 'http://icewarp.com/ns/');
					$unbind_item = true;
					break;
				case 'w':
					$writer->writeElementNS($xml_dav_prefix, 'write-content', null);
					$write_content = true;
					break;
				case 'l':
					$writer->writeElementNS(null, 'lookup', 'http://icewarp.com/ns/');
					$lookup = true;
					break;
				case 'r':
					$writer->writeElementNS(null, 'read-content', 'http://icewarp.com/ns/');
					$read_content = true;
					break;
				case 'k':
					$writer->writeElementNS(null, 'bind-collection', 'http://icewarp.com/ns/');
					$bind_collection = true;
					break;
				case 'x':
					$writer->writeElementNS(null, 'unbind-collection', 'http://icewarp.com/ns/');
					$unbind_collection = true;
					 					if ($iCal)
					{
						$writer->endElement();
						$writer->startElementNS($xml_dav_prefix, 'privilege', null);
						$writer->writeElementNS($xml_dav_prefix, 'write-properties', null);
					}
					break;
			}
			$writer->endElement();
		}

		if ($iCal && $lookup && $read_content)
		{
			$writer->startElementNS($xml_dav_prefix, 'privilege', null);
			$writer->writeElementNS($xml_dav_prefix, 'read', null);
			$writer->endElement();
		}

		if ($iCal && $write_acl && $write_content)
		{
			$writer->startElementNS($xml_dav_prefix, 'privilege', null);
			$writer->writeElementNS($xml_dav_prefix, 'write', null);
			$writer->endElement();
		}

		if ($iCal && $bind_collection && $bind_item)
		{
			$writer->startElementNS($xml_dav_prefix, 'privilege', null);
			$writer->writeElementNS($xml_dav_prefix, 'bind', null);
			$writer->endElement();
		}

		if ($iCal && $unbind_collection && $unbind_item)
		{
			$writer->startElementNS($xml_dav_prefix, 'privilege', null);
			$writer->writeElementNS($xml_dav_prefix, 'unbind', null);
			$writer->endElement();
		}
	}

	public function write_acl($writer, $xml_dav_prefix, $for_child = false)
	{
		foreach ($this->get_rights() as $principal => $props)
		{
			if (empty($props['rights']))
				continue;
			$writer->startElementNS($xml_dav_prefix, 'ace', null);
			$writer->startElementNS($xml_dav_prefix, 'principal', null);
			if ($principal == 'anyone')
				$writer->writeElementNS($xml_dav_prefix, 'all', null);
			else
			{
				$uri = new caldav_uri(array('users', $principal));
				$writer->writeElementNS($xml_dav_prefix, 'href', null, $uri->to_string() . '/');
			}
			$writer->endElement();
			$writer->startElementNS($xml_dav_prefix, 'grant', null);
			$this->write_rights($writer, $xml_dav_prefix, $props['rights']);
			$writer->endElement();
			if (isset($props['inherited']))
			{
				$writer->startElementNS($xml_dav_prefix, 'inherited', null);
				$writer->writeElementNS($xml_dav_prefix, 'href', null, resource::raw_path_to_uri($this->_group, $props['inherited'])->to_string() . '/');
				$writer->endElement();
			}
			else if ($for_child)
			{
				$writer->startElementNS($xml_dav_prefix, 'inherited', null);
				$writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_uri()->to_string() . '/');
				$writer->endElement();
			}
			$writer->endElement();
		}
		 		 		 		 		$writer->startElementNS($xml_dav_prefix, 'ace', null);
		$writer->startElementNS($xml_dav_prefix, 'principal', null);
		$writer->writeElementNS($xml_dav_prefix, 'authenticated', null);
		$writer->endElement();
		$writer->startElementNS($xml_dav_prefix, 'grant', null);
		$writer->startElementNS($xml_dav_prefix, 'privilege', null);
		$writer->writeElementNS(null, 'read-free-busy', 'urn:ietf:params:xml:ns:caldav');
		$writer->endElement();
		$writer->endElement();
		$writer->writeElementNS($xml_dav_prefix, 'protected', null);
		$writer->endElement();  	}

	public function get_owner_uri()
	{
		foreach ($this->get_rights() as $email => $props)
			if (isset($props['owner']))
				return new caldav_uri(array('users', $email));
		 		return new caldav_uri(array('users', '[unknown]'));
	}

	public function get_acl_uris()
	{
		$uris = array();
		foreach ($this->get_rights() as $principal => $props)
		{
			if (empty($props['rights']))
				continue;
			if ($principal != 'anyone')
				$uris[] = new caldav_uri(array('users', $principal));
		}

		return $uris;
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'resourcetype')
			{
				parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
				if (strpos(' EJT', (string)$this->_folder_info['type']))
					$xml_writer->writeElementNS(null, 'calendar', 'urn:ietf:params:xml:ns:caldav');
				else if ($this->_folder_info['type'] == 'C')
					$xml_writer->writeElementNS(null, 'addressbook', 'urn:ietf:params:xml:ns:carddav');
				
                if ($this->is_account_root())
					$xml_writer->writeElementNS(null, 'account-root', 'http://icewarp.com/ns/');
				else if ($this->is_account_root_ancestor())
					$xml_writer->writeElementNS(null, 'account-root-ancestor', 'http://icewarp.com/ns/');

				$groupdav_type = $this->_groupdav_types[$this->_folder_info['type']];
				if ($groupdav_type)
					$xml_writer->writeElementNS('G', $groupdav_type, 'http://groupdav.org/');

				$icewarp_type = $this->_icewarp_types[$this->_folder_info['type']];
				if ($icewarp_type)
					$xml_writer->writeElementNS(null, $icewarp_type, 'http://icewarp.com/ns/');

				if ($this->_folder_path == 'dropbox')
					$xml_writer->writeElementNS(null, 'dropbox-home', 'http://calendarserver.org/ns/');
				else if (substr_compare($this->_folder_path, 'dropbox' . DAV_PATH_SEPARATOR, 0, 8) === 0)
					$xml_writer->writeElementNS(null, 'dropbox', 'http://calendarserver.org/ns/');
				return;
			}

			if ($property_name == 'supported-report-set')
			{
				parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
				if (strpos(' EJT', (string)$this->_folder_info['type']))
				{
					$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
					$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
					$xml_writer->writeElementNS(null, 'calendar-query', 'urn:ietf:params:xml:ns:caldav');
					$xml_writer->endElement();
					$xml_writer->endElement();
					$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
					$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
					$xml_writer->writeElementNS(null, 'calendar-multiget', 'urn:ietf:params:xml:ns:caldav');
					$xml_writer->endElement();
					$xml_writer->endElement();
					$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
					$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
					$xml_writer->writeElementNS(null, 'free-busy-query', 'urn:ietf:params:xml:ns:caldav');
					$xml_writer->endElement();
					$xml_writer->endElement();
				}
				else if ($this->_folder_info['type'] == 'C')
				{
					$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
					$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
					$xml_writer->writeElementNS(null, 'addressbook-query', 'urn:ietf:params:xml:ns:carddav');
					$xml_writer->endElement();
					$xml_writer->endElement();
					$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
					$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
					$xml_writer->writeElementNS(null, 'addressbook-multiget', 'urn:ietf:params:xml:ns:carddav');
					$xml_writer->endElement();
					$xml_writer->endElement();
				}

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'sync-collection', null);
				$xml_writer->endElement();
				$xml_writer->endElement();

				return;
			}

			if ($property_name == 'supported-query-grammar-set')
			{
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-query-grammar', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'grammar', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'basicsearch', null);
				$xml_writer->endElement();
				$xml_writer->endElement();
				return;
			}

			if ($property_name == 'supported-privilege-set')
			{
				 				 				 				 				 				 				 				 				 				 				 				 				 				 				 				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'all', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'abstract', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Any operation');

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'read', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'abstract', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Any read operation');

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'read-content', 'http://icewarp.com/ns/');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Read resource content');
				$xml_writer->endElement();

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'lookup', 'http://icewarp.com/ns/');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'List collections');
				$xml_writer->endElement();

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'read-free-busy', 'urn:ietf:params:xml:ns:caldav');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'abstract', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Read free/busy information');
				$xml_writer->endElement();

				$xml_writer->endElement();  
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'write', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'abstract', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Any write operation');

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'write-acl', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Write ACL');
				$xml_writer->endElement();

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'write-content', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Write resource content');
				$xml_writer->endElement();

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'unbind', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'abstract', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Unbind');

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'unbind-collection', 'http://icewarp.com/ns/');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Unbind collection');
				$xml_writer->endElement();

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'unbind-item', 'http://icewarp.com/ns/');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Unbind item');
				$xml_writer->endElement();

				$xml_writer->endElement();  
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'bind', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'abstract', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Bind');

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'bind-collection', 'http://icewarp.com/ns/');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Bind collection');
				$xml_writer->endElement();

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'bind-item', 'http://icewarp.com/ns/');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Bind item');
				$xml_writer->endElement();

				$xml_writer->endElement();  
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'write-properties', null);
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'abstract', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Write properties');

				$xml_writer->startElementNS($xml_dav_prefix, 'supported-privilege', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'bind-collection', 'http://icewarp.com/ns/');
				$xml_writer->endElement();
				$xml_writer->writeElementNS($xml_dav_prefix, 'description', null, 'Bind collection');
				$xml_writer->endElement();

				$xml_writer->endElement();  
				$xml_writer->endElement();  
				$xml_writer->endElement();  				return;
			}

			if ($property_name == 'acl-restrictions')
			{
				$xml_writer->writeElementNS($xml_dav_prefix, 'grant-only', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'no-invert', null);
				return;
			}

			if ($property_name == 'owner')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_owner_uri()->to_string() . '/');

			if ($property_name == 'acl')
				return $this->write_acl($xml_writer, $xml_dav_prefix);

			if ($property_name == 'current-user-privilege-set')
			{
				foreach ($this->get_rights() as $email => $props)
					if ($email == $this->_datastore->_email)
						$this->write_rights($xml_writer, $xml_dav_prefix, $props['rights']);

				$xml_writer->startElementNS($xml_dav_prefix, 'privilege', null);
				$xml_writer->writeElementNS(null, 'read-free-busy', 'urn:ietf:params:xml:ns:caldav');
				$xml_writer->endElement();
				return;
			}

			if ($property_name == 'sync-token')
			{
				$xml_writer->text($this->get_ctag());
				return;
			}

			if (!$this->is_account_root() && !$this->is_account_root_ancestor())
			{
				if ($property_name == 'creationdate')
				{
					$xml_writer->writeAttributeNS('B', 'dt', 'urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/', 'dateTime.tz');
					$xml_writer->text(isset($this->_folder_info['creationdate'])?$this->_folder_info['creationdate']:'1970-01-01T00:00:00Z');
					return;
				}

				if ($property_name == 'getlastmodified')
				{
					if ($this->_last_modified == null)
						$this->_last_modified = $this->_datastore->get_folder_last_modified($this->_group, $this->_folder_path, $this->_tag);
					$xml_writer->writeAttributeNS('B', 'dt', 'urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/', 'dateTime.rfc1123');
					$xml_writer->text($this->_last_modified);
					return;
				}
			}
		}

		if ($namespace_uri == 'urn:ietf:params:xml:ns:caldav' &&
			strpos(' EJT', (string)$this->_folder_info['type']))
		{
			if ($property_name == 'calendar-description' && $this->_folder_info['description'] !== null)
				return $xml_writer->text($this->_folder_info['description']);

			if ($property_name == 'calendar-timezone' && $this->_folder_info['timezone'] !== null)
				 				return $xml_writer->writeRaw(create_cdata($this->_folder_info['timezone']));

			if ($property_name == 'supported-calendar-component-set')
			{
				$component_types = array('E' => 'VEVENT', 'J' => 'VJOURNAL', 'T' => 'VTODO');
				$xml_writer->startElement('comp');
				$xml_writer->writeAttribute('name', $component_types[$this->_folder_info['type']]);
				$xml_writer->endElement();
				return;
			}

			if ($property_name == 'supported-calendar-data')
			{
				$xml_writer->startElement('calendar-data');
				$xml_writer->writeAttribute('content-type', 'text/calendar');
				$xml_writer->writeAttribute('version', '2.0');
				$xml_writer->endElement();
				return;
			}
		}

		if ($namespace_uri == 'urn:ietf:params:xml:ns:carddav' && $this->_folder_info['type'] == 'C')
		{
			if ($property_name == 'addressbook-description' && $this->_folder_info['description'] !== null)
				return $xml_writer->text($this->_folder_info['description']);

			if ($property_name == 'supported-collation-set')
			{
				$xml_writer->writeElement('supported-collation', 'i;ascii-casemap');
				$xml_writer->writeElement('supported-collation', 'i;octet');
				$xml_writer->writeElement('supported-collation', 'i;unicasemap');
				return;
			}
		}

		if ($namespace_uri == 'http://calendarserver.org/ns/' && $property_name == 'getctag')
		{
			$xml_writer->text($this->get_ctag());
			return;
		}

		if ($namespace_uri == 'http://apple.com/ns/ical/' && $property_name == 'calendar-order')
		{
			 			if ($this->_folder_path == $this->_datastore->_events_folder)
				return $xml_writer->text('1');
			if ($this->_folder_path == $this->_datastore->_tasks_folder)
				return $xml_writer->text('2');
			if ($this->_folder_path == $this->_datastore->_journal_folder)
				return $xml_writer->text('3');
			return $xml_writer->text('666');
		}

		if ($namespace_uri == 'http://icewarp.com/ns/')
		{
			if (!$this->is_account_root())
			{
				if (!$this->is_account_root_ancestor())
				{
					if ($property_name == 'collectionowner')
						return $xml_writer->text($this->_folder_info['owner']);

					if ($property_name == 'collectionid')
						return $xml_writer->text($this->_folder_info['id']);
				}
			}
			else
			{
				if ($property_name == 'deviceid')
					return $xml_writer->text($_SESSION['WEBDAV_DEVICE_ID']);
			}
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}

	private function properties_to_folder_info(&$folder_info, $set_properties, $remove_properties, &$updated)
	{
		global $datastore_types;

		$failed_properties = $remove_properties;

		foreach ($set_properties as $property)
		{
			$value = $property[2];

			if ($property[0] == 'DAV:' && $property[1] == 'displayname')
			{
				$displayname = $value->_children[0]->get_data();
				$folder_info['displayname'] = $displayname;
				$updated = true;
				continue;
			}

			if ($property[0] == 'urn:ietf:params:xml:ns:caldav' &&
				strpos(' EJT', (string)$folder_info['type']))
			{
				if ($property[1] == 'calendar-description')
				{
					$folder_info['description'] = $value->_children[0]->get_data();
					$updated = true;
					continue;
				}

				if ($property[1] == 'calendar-timezone')
				{
					$folder_info['timezone'] = $value->_children[0]->get_data();
					$updated = true;
					continue;
				}

				if ($property[1] == 'supported-calendar-component-set' && $value->children_count() == 1)
				{
					$comp_name = $value->get_child('urn:ietf:params:xml:ns:caldav:comp')->_attribs['name'];
					if (isset($datastore_types[$comp_name]))
					{
						$folder_info['type'] = $datastore_types[$comp_name];
						$updated = true;
						continue;
					}
				}

				if ($property[1] == 'schedule-calendar-transp' || $property[1] == 'supported-calendar-data' || $property[1] == 'max-resource-size' || $property[1] == 'min-date-time' || $property[1] == 'max-date-time' || $property[1] == 'max-instances' || $property[1] == 'calendar-free-busy-set')
				{
					continue;
				}
			}

			if ($property[0] == 'urn:ietf:params:xml:ns:carddav' && $folder_info['type'] == 'C')
			{
				if ($property[1] == 'addressbook-description')
				{
					$folder_info['description'] = $value->_children[0]->get_data();
					$updated = true;
					continue;
				}
			}

			if ($property[0] == 'http://apple.com/ns/ical/')
			{
				if ($property[1] == 'calendar-color' || $property[1] == 'calendar-order')
				{
					continue;
				}
			}

			$failed_properties[] = $property;
		}

		return $failed_properties;
	}

	public function patch_properties($set_properties, $remove_properties)
	{
		$folder_info_copy = $this->_folder_info;
		$updated = false;
		$failed_properties = $this->properties_to_folder_info($folder_info_copy, $set_properties, $remove_properties, $updated);
		if (count($failed_properties) == 0 && $updated)
		{
			$this->_datastore->modify_collection($this->_group, $this->_folder_path, $folder_info_copy);
			$this->_folder_info = $folder_info_copy;
		}
		return $failed_properties;
	}

	public function make_collection($item_id, $resource_type, $set_properties, $remove_properties)
	{
		$folder_info = array('type' => 'F');
		if ($resource_type != null)
		{
			foreach ($resource_type->children() as $type)
			{
				if ($type->get_name() == 'urn:ietf:params:xml:ns:carddav:addressbook')
					$folder_info['type'] = 'C';
				else if ($type->get_name() == 'urn:ietf:params:xml:ns:caldav:calendar-collection' ||  						$type->get_name() == 'urn:ietf:params:xml:ns:caldav:calendar')
					$folder_info['type'] = 'E';
				else if ($type->get_name() != 'DAV::collection')
				  throw new forbidden_precondition_exception('DAV:', 'valid-resourcetype');
			}
		}
		$updated = false;  		$failed_properties = $this->properties_to_folder_info($folder_info, $set_properties, $remove_properties, $updated);
		if (count($failed_properties) == 0)
			$this->_datastore->make_collection($this->_group, $this->_folder_path, $item_id, $folder_info);
		return $failed_properties;
	}

	public function put($item_id, $stream)
	{
		return $this->_datastore->put_item($this->_group,
			$this->_folder_path,
			$item_id, $stream);
	}

	public function delete($schedule_reply)
	{
		return $this->_datastore->delete_folder(
			$this->_group,
			$this->_folder_path);
	}

	public function set_acl($aces)
	{
		$folder_rights = [];
		 		foreach ($aces as $ace)
		{
			if ($ace->get_name() != 'DAV::ace')
				throw new bad_request_exception();
			$principal = $ace->get_child('DAV::principal');
			$grant = $ace->get_child('DAV::grant');
			$deny = $ace->get_child('DAV::deny');
			if ($deny)
				throw new forbidden_precondition_exception('DAV:', 'grant-only');
			if (!$principal || !grant)
				throw new bad_request_exception();
			 			if ($principal->get_child('DAV::all'))
				$principal_name = 'anyone';
			else if ($principal->get_child('DAV::authenticated'))
				$principal_name = 'authenticated';
			else if (($principal_href = $principal->get_child('DAV::href')))
			{
				$principal_resource = resource::get_resource($this->_datastore,
					new caldav_uri($principal_href->_children[0]->get_data()));
				if (!($principal_resource instanceof principal_resource))
					throw new forbidden_precondition_exception('DAV:', 'allowed-principal');

				$segments = $principal_resource->get_uri()->get_segments();
				$principal_name = end($segments);
			}
			else
				throw new forbidden_precondition_exception('DAV:', 'allowed-principal');

			$rights = '';
			foreach ($grant->children() as $privilege)
			{
				switch ($privilege->_children[0]->get_name())
				{
					case 'http://icewarp.com/ns/:bind-item': $rights .= 'i';
						break;
					case 'DAV::write-acl': $rights .= 'a';
						break;
					case 'http://icewarp.com/ns/:unbind-item': $rights .= 't';
						break;
					case 'DAV::write-content': $rights .= 'w';
						break;
					case 'http://icewarp.com/ns/:lookup': $rights .= 'l';
						break;
					case 'http://icewarp.com/ns/:read-content': $rights .= 'r';
						break;
					case 'http://icewarp.com/ns/:bind-collection': $rights .= 'k';
						break;
					case 'http://icewarp.com/ns/:unbind-collection': $rights .= 'x';
						break;
					case 'urn:ietf:params:xml:ns:caldav:read-free-busy':
						if ($principal_name == 'authenticated')
							$rights .= 'f';
						break;
					default:
						throw new forbidden_precondition_exception('DAV:', 'not-supported-privilege');
				}
			}
			if ($folder_rights[$principal_name])
				throw new forbidden_precondition_exception('DAV:', 'limited-number-of-aces');
			$folder_rights[$principal_name] = $rights;
		}

		$folder_type = $this->get_internal_type();
		if (strpos(' EJT', (string)$folder_type) !== false)
		{
			if (!$folder_rights['authenticated'])
				throw new forbidden_precondition_exception('DAV:', 'no-protected-ace-conflict');
			if ($folder_rights['authenticated'] != 'f')
				throw new forbidden_precondition_exception('DAV:', 'no-protected-ace-conflict');
		}
		unset($folder_rights['authenticated']);

		$this->_datastore->set_folder_rights($this->_group, $this->_folder_path, $folder_rights);
	}

	public function copy_to($collection_resource, $item_id)
	{
		if (!($collection_resource instanceof user_collection_resource))
			throw new bad_gateway_exception();
		$this->_datastore->make_collection($collection_resource->_group,
			$collection_resource->_folder_path,
			$item_id, $this->folder_info);
	}

	public function move_to($collection_resource, $item_id)
	{
		if (!($collection_resource instanceof user_collection_resource))
			throw new bad_gateway_exception();

		$destination = ($collection_resource->_folder_path ? $collection_resource->_folder_path.DAV_PATH_SEPARATOR : '').$item_id;
		$this->_datastore->rename_folder($this->_group,
			$this->_folder_path,
			$collection_resource->_group,
			$destination);
	}
}

?>
