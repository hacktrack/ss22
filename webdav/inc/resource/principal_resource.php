<?php
class principal_resource extends collection_resource
{
	private $_group_info;
	private $_has_extended_info = false;

	public function __construct($datastore, $uri, $gal_contact = null)
	{
		parent::__construct($datastore, $uri);
		$segments = $uri->get_segments();
		$this->_group_info = $this->_datastore->get_group_info($segments[1]);
		if (!$this->_group_info)
		{
			if ($gal_contact)
				$this->_group_info = array('displayname' => $gal_contact['title'], 'email' => $gal_contact['email']);
			else
				throw new not_found_exception();
		}
	}

	public function get_extended_info()
	{
		if (!$this->_has_extended_info)
		{
			$segments = $this->get_uri()->get_segments();
			$this->_group_info = $this->_datastore->get_group_info($segments[1], true);
			$this->_has_extended_info = true;
		}
		return $this->_group_info;
	}

	public function get_children($filter=NULL)
	{
		return array(
			new principal_proxy_resource($this->_datastore, new caldav_uri($this->get_uri(), 'calendar-proxy-read')),
			new principal_proxy_resource($this->_datastore, new caldav_uri($this->get_uri(), 'calendar-proxy-write'))
		);
	}

	public function get_title()
	{
		if (!empty($this->_group_info['displayname']))	
			return $this->_group_info['displayname'];
		return parent::get_title();
	}

	public function get_first_name()
	{
		$displayname = $this->_group_info['displayname']; 
		$pos = strpos($displayname, ' ');
		if ($pos === FALSE)
			return '';		
		return substr($displayname, 0, $pos);
	}

	public function get_last_name()
	{
		$displayname = $this->_group_info['displayname']; 
		$pos = strpos($displayname, ' ');
		if ($pos === FALSE)
			return $displayname;		
		return substr($displayname, $pos + 1);
	}
	
	public function get_email_address_set()
	{
		$emails = array();
		if (strpos($this->_group_info['email'], '@') !== false)
			$emails[] = $this->_group_info['email'];
		foreach ($this->_group_info['aliases'] as $alias)
			$emails[] = $alias;
		return $emails;
	}

	public function get_calendar_user_address_set()
	{
		$address_set = array();
		foreach ($this->get_email_address_set() as $email_address)
			$address_set[] = 'mailto:' . $email_address;
		$address_set[] = $this->get_uri()->to_string() . '/';
		return $address_set;
	}

	public function get_home_uri()
	{
		return new caldav_uri(array($this->_group_info['email']));
	}

	public function get_principal_uri()
	{
		return new caldav_uri(array('users', $this->_group_info['email']));
	}

	public function get_group_name()
	{
		return $this->_group_info['email'];
	}

	public function get_property_names($include_all)
	{
		$additional_properties = array(
			array('DAV:', 'principal-URL'),
			array('DAV:', 'alternate-URI-set')
		);
		
		if ($include_all)
		{
			 			if ($this->_group_info['type'] == 'group' ||
					$this->_group_info['email'] == $this->_datastore->_email)
				$additional_properties[] = array('DAV:', 'group-membership');
			if ($this->_group_info['type'] == 'group')
				$additional_properties[] = array('DAV:', 'group-member-set');
			$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'calendar-home-set');
			$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'calendar-user-address-set');
			$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'schedule-inbox-URL');
			$additional_properties[] = array('urn:ietf:params:xml:ns:caldav', 'schedule-outbox-URL');
			$additional_properties[] = array('urn:ietf:params:xml:ns:carddav', 'addressbook-home-set');
			$additional_properties[] = array('http://calendarserver.org/ns/', 'dropbox-home-URL');
			$additional_properties[] = array('http://calendarserver.org/ns/', 'calendar-proxy-read-for');
			$additional_properties[] = array('http://calendarserver.org/ns/', 'calendar-proxy-write-for');			
			$additional_properties[] = array('http://calendarserver.org/ns/', 'first-name');
			$additional_properties[] = array('http://calendarserver.org/ns/', 'last-name');
			$additional_properties[] = array('http://calendarserver.org/ns/', 'email-address-set');			
			$additional_properties[] = array('http://icewarp.com/ns/', 'default-calendar-URL');
			$additional_properties[] = array('http://icewarp.com/ns/', 'default-tasks-URL');
			$additional_properties[] = array('http://icewarp.com/ns/', 'default-journal-URL');
			$additional_properties[] = array('http://icewarp.com/ns/', 'default-notes-URL');
			$additional_properties[] = array('http://icewarp.com/ns/', 'default-contacts-URL');
			$additional_properties[] = array('http://icewarp.com/ns/', 'default-files-URL');
		}

		return array_merge(
			parent::get_property_names($include_all),
			$additional_properties
			);
	}
	
	public function get_proxy_for_uris($read)
	{
		$uris = array();
		foreach ($this->_datastore->get_groups(true) as $group => $group_info)
		{
			if ($group != $this->_datastore->_email)
			{
				$rights = $this->_datastore->get_folder_rights($group, '');
				$myrights = $rights[$this->_datastore->_email]['rights'];
				if (($myrights == 'lr' && $read) || ($myrights != 'lr' && !$read))
					$uris[] = new caldav_uri(array('users', $group));
			}
		}
		return $uris;
	}

	public function get_search_property($namespace_uri, $property_name)
	{
		 		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'displayname')
				return $this->get_title();
		}		
		else if ($namespace_uri == 'urn:ietf:params:xml:ns:caldav')
		{
			if ($property_name == 'calendar-home-set')
				return $this->get_home_uri()->to_string() . '/';
			if ($property_name == 'calendar-user-address-set')
				return $this->get_calendar_user_address_set();
		}
		else if ($namespace_uri == 'http://calendarserver.org/ns/')
		{
			if ($property_name == 'first-name')
				return $this->get_first_name();
			if ($property_name == 'last-name')
				return $this->get_last_name();
			if ($property_name == 'email-address-set')
				return $this->get_email_address_set();
		}		
		return '';
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'resourcetype')
			{
				parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
				return $xml_writer->writeElementNS($xml_dav_prefix, 'principal', null);
			}
			
			if ($property_name == 'principal-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_principal_uri()->to_string() . '/');

			if ($property_name == 'alternate-URI-set')
			{
				if (!$this->get_principal_uri()->equals($this->get_uri()))
					$xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_uri()->to_string() . '/');
				return;
			}
				
			if ($property_name == 'group-membership')
			{
				if ($this->_group_info['type'] != 'group' && $this->_group_info['email'] != $this->_datastore->_email)
					throw new forbidden_exception();
				if ($this->_group_info['type'] == 'group')
				{
					$ext_group_info = $this->get_extended_info();
					foreach ($ext_group_info['group-membership'] as $group)
					{
						$group_uri = new caldav_uri(array('users', $group));
						$xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $group_uri->to_string() . '/');
					}
				}					
				if ($this->_group_info['email'] == $this->_datastore->_email)
				{
					foreach ($this->_datastore->get_groups(true) as $group => $group_info)
					{
						if ($group != $this->get_group_name())
						{
							$rights = $this->_datastore->get_folder_rights($group, '');
							$myrights = $rights[$this->get_group_name()]['rights'];
							if ($myrights == 'lr')
								$principal_uri = new caldav_uri(array('users', $group, 'calendar-proxy-read'));
							else
								$principal_uri = new caldav_uri(array('users', $group, 'calendar-proxy-write'));
							$xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $principal_uri->to_string());
						}
					}
				}
				return;
			}
			
			if ($property_name == 'group-member-set' &&
					$this->_group_info['type'] == 'group')
			{
				$ext_group_info = $this->get_extended_info();
				foreach ($ext_group_info['group-member-set'] as $group)
				{
					$group_uri = new caldav_uri(array('users', $group));
					$xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $group_uri->to_string() . '/');
				}
				return;
			}
		}
		else if ($namespace_uri == 'urn:ietf:params:xml:ns:caldav')
		{
			if ($property_name == 'calendar-home-set')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $this->get_home_uri()->to_string() . '/');

			if ($property_name == 'calendar-user-address-set')
			{
				foreach ($this->get_calendar_user_address_set() as $calendar_user_address)
					$xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $calendar_user_address);
				return;
			}

			 			 			 			 			 			if ($property_name == 'schedule-inbox-URL')
			{
				$uri = new caldav_uri(array('inbox', $this->_group_info['email']));
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $uri->to_string() . '/');
			}

			 			if ($property_name == 'schedule-outbox-URL')
			{
				$uri = new caldav_uri(array('outbox', $this->_group_info['email']));
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $uri->to_string() . '/');
			}
		}
		else if ($namespace_uri == 'urn:ietf:params:xml:ns:carddav')
		{
			if ($property_name == 'addressbook-home-set')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $this->get_home_uri()->to_string() . '/');
		}
		else if ($namespace_uri == 'http://calendarserver.org/ns/')
		{
			if ($property_name == 'dropbox-home-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', resource::raw_path_to_uri($this->_group_info['email'], 'dropbox')->to_string() . '/');

			if ($property_name == 'calendar-proxy-read-for' ||
					$property_name == 'calendar-proxy-write-for')
			{
				$read = $property_name == 'calendar-proxy-read-for';
				foreach ($this->get_proxy_for_uris($read) as $principal_uri)
					$xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', $principal_uri->to_string() . '/');
				return;				
			}

			if ($property_name == 'first-name')
				return $xml_writer->text($this->get_first_name());

			if ($property_name == 'last-name')
				return $xml_writer->text($this->get_last_name());
	
			if ($property_name == 'email-address-set')
			{
				foreach ($this->get_email_address_set() as $email_address)
					$xml_writer->writeElementNS(null, 'email-address', 'http://calendarserver.org/ns/', $email_address);
				return;
			}
		}
		else if ($namespace_uri == 'http://icewarp.com/ns/')
		{
			if ($property_name == 'default-calendar-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', resource::raw_path_to_uri($this->_group_info['email'], $this->_datastore->_events_folder)->to_string() . '/');
			if ($property_name == 'default-tasks-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', resource::raw_path_to_uri($this->_group_info['email'], $this->_datastore->_tasks_folder)->to_string() . '/');
			if ($property_name == 'default-journal-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', resource::raw_path_to_uri($this->_group_info['email'], $this->_datastore->_journal_folder)->to_string() . '/');
			if ($property_name == 'default-notes-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', resource::raw_path_to_uri($this->_group_info['email'], $this->_datastore->_notes_folder)->to_string() . '/');
			if ($property_name == 'default-contacts-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', resource::raw_path_to_uri($this->_group_info['email'], $this->_datastore->_contacts_folder)->to_string() . '/');
			if ($property_name == 'default-files-URL')
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', 'DAV:', resource::raw_path_to_uri($this->_group_info['email'], $this->_datastore->_files_folder)->to_string() . '/');
		}

		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}
}
?>
