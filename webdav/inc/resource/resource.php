<?php
class resource
{
	private $_uri;
	protected $_datastore;

	protected function __construct($datastore, $uri)
	{
		$this->_datastore = $datastore;
		$this->_uri = $uri;
	}

	public function get_etag()
	{
		return '"0"';
	}

	public function get_uri()
	{
		return $this->_uri;
	}

	public function get_content_type()
	{
		return 'text/plain';
	}

	public function get_title()
	{
		$segements = $this->get_uri()->get_segments();
		return end($segements);
	}

	public function is_get_computed()
	{
		return false;
	}

	public function get_content()
	{
		return '';
	}

	public function get_content_path()
	{
		return '';
	}

	public function get_property_names($include_all)
	{
		$properties = array();

		$properties[] = array('DAV:', 'displayname');
		$properties[] = array('DAV:', 'resourcetype');

		if (!$this->is_get_computed())
			$properties[] = array('DAV:', 'getcontentlength');

		$properties[] = array('DAV:', 'getcontenttype');
		$properties[] = array('DAV:', 'getetag');

		 		if ($include_all)
		{
			$properties[] = array('DAV:', 'current-user-principal');
			$properties[] = array('DAV:', 'principal-collection-set');
			$properties[] = array('DAV:', 'supported-report-set');
		}

		return $properties;
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:')
		{
			if ($property_name == 'displayname')
				return $xml_writer->text($this->get_title());

			if ($property_name == 'resourcetype')
				return;

			if ($property_name == 'getcontentlength')
			{
				$content = $this->get_content();
				if (!is_resource($content))
					return $xml_writer->text(strlen($content));
				$stat = fstat($content);
				fclose($content);
				return $xml_writer->text($stat['size']);
			}

			if ($property_name == 'getcontenttype')
				return $xml_writer->text($this->get_content_type());

			if ($property_name == 'getetag')
				return $xml_writer->text($this->get_etag());

			if ($property_name == 'current-user-principal')
			{
				$uri = new caldav_uri(array('users', $this->_datastore->_email));
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $uri->to_string() . '/');
			}

			if ($property_name == 'principal-collection-set')
			{
				$uri = new caldav_uri(array('users'));
				return $xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $uri->to_string() . '/');
			}

			if ($property_name == 'supported-report-set')
			{
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'acl-principal-prop-set', null);
				$xml_writer->endElement();
				$xml_writer->endElement();
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'principal-match', null);
				$xml_writer->endElement();
				$xml_writer->endElement();
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'principal-property-search', null);
				$xml_writer->endElement();
				$xml_writer->endElement();
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'principal-search-property-set', null);
				$xml_writer->endElement();
				$xml_writer->endElement();
				$xml_writer->startElementNS($xml_dav_prefix, 'supported-report', null);
				$xml_writer->startElementNS($xml_dav_prefix, 'report', null);
				$xml_writer->writeElementNS($xml_dav_prefix, 'expand-property', null);
				$xml_writer->endElement();
				$xml_writer->endElement();
				return;
			}
		}
		throw new not_found_exception();
	}

	public function write_response($writer, $xml_dav_prefix, $properties, $callback_object = null, $callback = null, $callback_data = null, $brief = false)
	{
		$item = null;
		$writer->startElementNS($xml_dav_prefix, 'response', null);
		if ($this instanceof collection_resource && !($this instanceof root_resource))
			$writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_uri()->to_string() . '/');
		else
			$writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_uri()->to_string());

		if ($properties == 'propname')
		{
			$writer->startElementNS($xml_dav_prefix, 'propstat', null);
			$writer->startElementNS($xml_dav_prefix, 'prop', null);
			foreach ($this->get_property_names(true) as $property)
			{
				if ($property[0] == 'DAV:')
					$writer->writeElementNS($xml_dav_prefix, $property[1], null);
				else
					$writer->writeElementNS(null, $property[1], $property[0]);
			}
			if ($callback != null) {
				$item = null;
				$callback_object->$callback($item, $callback_data, $writer, $xml_dav_prefix, $properties);
			}

			$writer->endElement();  			$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 200 OK');
			$writer->endElement();  		}
		else if ($properties != null)
		{
			$setPropstatTag = false;
			if ($properties == 'allprop')
			{
				$valid_properties = $this->get_property_names(false);
			}
			else
			{
				$valid_properties = array();
				foreach ($this->get_property_names(true) as $valid_property)
				{
					if ($properties[$valid_property[1]] == $valid_property[0])
					{
						unset($properties[$valid_property[1]]);
						$valid_properties[] = $valid_property;
					}
				}
			}

			if (count($valid_properties) > 0 || $callback != null)
			{
				$setPropstatTag = true;
				$writer->startElementNS($xml_dav_prefix, 'propstat', null);
				$writer->startElementNS($xml_dav_prefix, 'prop', null);

				foreach ($valid_properties as $property)
				{
					if ($property[0] == 'DAV:')
						$writer->startElementNS($xml_dav_prefix, $property[1], null);
					else
						$writer->startElementNS(null, $property[1], $property[0]);

					try
					{
						$this->write_property_value($property[0], $property[1], $writer, $xml_dav_prefix);
					}
					catch (dav_exception $e)
					{
						 					}

					$writer->endElement();
				}

				if ($callback != null)
				{
					$temp_property_count = count($properties);
					$callback_object->$callback($this, $callback_data, $writer, $xml_dav_prefix, $properties);
					if ($temp_property_count != count($properties))
						$valid_properties[] = 0;
				}

				if (count($valid_properties) > 0)
				{
					$setPropstatTag = false;
					$writer->endElement();  					$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 200 OK');
					$writer->endElement();  				}
			}

			if (is_array($properties) && count($properties) && !$brief)
			{
				if (!$setPropstatTag)
				{
					$writer->startElementNS($xml_dav_prefix, 'propstat', null);
					$writer->startElementNS($xml_dav_prefix, 'prop', null);
				}

				foreach ($properties as $property => $namespace)
					$writer->writeElementNS(null, $property, $namespace);

				$writer->endElement();  				$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 404 Not Found');
				$writer->endElement();  			}
		}
		else
		{
			$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 200 OK');
		}

		$writer->endElement();  	}

	public function delete($schedule_reply)
	{
		throw new forbidden_exception();
	}

	public function copy_to($collection_resource, $item_id)
	{
		throw new bad_gateway_exception();
	}

	public function move_to($collection_resource, $item_id)
	{
		throw new bad_gateway_exception();
	}

	public function post($request, $response)
	{
		throw new forbidden_exception();
	}

	public function lock($lock_info)
	{
		throw new forbidden_exception();
	}

	public function get_lock_info()
	{
		return null;
	}

	public function get_lock_token()
	{
		return null;
	}

	public function unlock()
	{
		throw new forbidden_exception();
	}

	public function patch_properties($set_properties, $remove_properties)
	{
		$failed_properties = $remove_properties;
		foreach ($set_properties as $property)
			$failed_properties[] = $property;
		return $failed_properties;
	}

	public function write_lockdiscovery($xml_writer, $xml_dav_prefix)
	{
		$lock_info = $this->get_lock_info();
		if ($lock_info)
		{
			$xml_writer->startElementNS($xml_dav_prefix, 'activelock', null);
			$xml_writer->startElementNS($xml_dav_prefix, 'lockscope', null);
			$xml_writer->writeElementNS($xml_dav_prefix, $lock_info['scope'], null);
			$xml_writer->endElement();
			$xml_writer->startElementNS($xml_dav_prefix, 'locktype', null);
			$xml_writer->writeElementNS($xml_dav_prefix, $lock_info['type'], null);
			$xml_writer->endElement();
			if (empty($lock_info['depth']))
				$xml_writer->writeElementNS($xml_dav_prefix, 'depth', null, 'infinity');
			else
				$xml_writer->writeElementNS($xml_dav_prefix, 'depth', null, $lock_info['depth']);
			$xml_writer->startElementNS($xml_dav_prefix, 'owner', null);
			if (isset($lock_info['owner_text']))
				$xml_writer->text($lock_info['owner_text']);
			else
				$xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $lock_info['owner']);		
			$xml_writer->endElement();
			if (isset($lock_info['timeout']))
				$xml_writer->writeElementNS($xml_dav_prefix, 'timeout', null, $lock_info['timeout']);
			$xml_writer->startElementNS($xml_dav_prefix, 'locktoken', null);
			$xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_lock_token());
			$xml_writer->endElement();
			$xml_writer->startElementNS($xml_dav_prefix, 'lockroot', null);
			$xml_writer->writeElementNS($xml_dav_prefix, 'href', null, $this->get_uri()->to_string());
			$xml_writer->endElement();
			$xml_writer->endElement();
		}
	}

	protected static function raw_path_to_uri($group, $raw_path)
	{
		$segments = explode(DAV_PATH_SEPARATOR, $raw_path);
		array_unshift($segments, $group);
		return new caldav_uri($segments);
	}

	private static function match_etag($etag, $if_match, $if_none_match)
	{
		if ($if_match)
		{
			if ($if_match == '*')
				return true;
			if (in_array($etag, $if_match))
				return true;
			return false;
		}
		else if ($if_none_match)
		{
			if ($if_none_match == '*')
				return false;
			else if (in_array($etag, $if_none_match))
				return false;
		}
		return true;
	}

	public static function get_resource($datastore, $uri, $if_match = null, $if_none_match = null, $if_schedule_match = null, $filter = null)
	{
		$segments = $uri->get_segments();
		if (count($segments) == 0)
		{
			$resource = new root_resource($datastore, $uri);
		}
		else
		{
			switch ($segments[0])
			{
				case 'ticket':
					if (count($segments) >= 3)
					{
						$ticket_info = $datastore->get_ticket_info();
						if (strpos($ticket_info['item_id'], '/') > 0)
							$resource = new attachment_resource($datastore, $uri, $ticket_info);
						else
							$resource = new item_resource($datastore, $uri, null, null, $ticket_info);
					}
					else
						$resource = new empty_folder_resource($datastore, $uri);
					break;

				case 'attachments':
					if (count($segments) >= 4)
						$resource = new attachment_resource($datastore, $uri);
					else
						$resource = new empty_folder_resource($datastore, $uri);
					break;

				case 'users':
					if (count($segments) == 1)
						$resource = new users_resource($datastore, $uri);
					else if (count($segments) == 2)
						$resource = new principal_resource($datastore, $uri);
					else if (count($segments) == 3)
						$resource = new principal_proxy_resource($datastore, $uri);
					else
						throw new not_found_exception();
					break;

				case 'inbox':
					if (count($segments) == 1)
						$resource = new users_resource($datastore, $uri);
					else if (count($segments) == 2)
						$resource = new inbox_folder_resource($datastore, $uri);
					else if (count($segments) == 3)
						$resource = new inbox_resource($datastore, $uri);
					else
						throw new not_found_exception();
					break;

				case 'outbox':
					if (count($segments) == 1)
						$resource = new users_resource($datastore, $uri);
					else if (count($segments) == 2)
						$resource = new outbox_resource($datastore, $uri);
					else
						throw new not_found_exception();
					break;

				default:
					$group = $segments[0];
					unset($segments[0]);
					if ($datastore->is_folder($group, implode(DAV_PATH_SEPARATOR, $segments)))
						$resource = new user_collection_resource($datastore, $uri);
					else
						$resource = new item_resource($datastore, $uri);
					break;
			}
		}

		if (!resource::match_etag(trim($resource->get_etag(), '"'), $if_match, $if_none_match))
			throw new precondition_failed_exception();

		if ($if_schedule_match != null)
		{
			if (!($resource instanceof item_resource))
				throw new precondition_failed_exception();
			if (!resource::match_etag(trim($resource->get_schedule_tag(), '"'), $if_schedule_match, null))
				throw new precondition_failed_exception();
		}

		if ($filter != null)
		{
			if (isset($filter['is_collection']) && !($resource instanceof collection_resource))
				return null;
		}

		return $resource;
	}
}
?>
