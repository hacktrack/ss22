<?php
require_once 'webdav.php';
require_once 'caldav_uri.php';
require_once 'resource/resource.php';
require_once(SHAREDLIB_PATH . 'api/account.php');


$datastore_types = array('VEVENT' => 'E', 'VJOURNAL' => 'J', 'VTODO' => 'T', 'VNOTE' => 'N', 'VCARD' => 'C');

 
class caldav_session extends webdav_session
{
	public $_lock_info;

	function __construct()
	{
		parent::__construct();
	}

	function handle_acl($request, $response)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		if (!($dav_resource instanceof user_collection_resource))
			throw new forbidden_exception();

		 		$acl = $request->get_xml_body();
		if ($acl == null)
			throw new bad_request_exception();
		if ($acl->get_name() != 'DAV::acl')
			throw new bad_request_exception();

		 		$dav_resource->set_acl($acl->children());
		$response->http_response('204 No Content');
	}

	function handle_delete($request, $response)
	{
		 		if (isset($this->_lock_info[$_SERVER['REQUEST_URI']]))
			throw new forbidden_exception();
		$dav_resource = $request->get_resource($this->_datastore);
		$dav_resource->delete($_SERVER['HTTP_SCHEDULE_REPLY'] != 'F');
		$response->http_response('204 No Content');
	}

	function copy_children($source_resource, $collection_resource, $item_id)
	{
		$collection_resource = resource::get_resource($this->_datastore, new caldav_uri($collection_resource->get_uri(), $item_id));
		foreach ($source_resource->get_children() as $child_resource)
		{
			$segments=$source_resource->get_uri()->get_segments();
			$target_item_id = end($segments);
			$child_resource->copy_to($collection_resource, $target_item_id);
			if ($child_resource instanceof collection_resource)
				$this->copy_children($child_resource, $collection_resource, $target_item_id);
		}
	}

	function process_copy_move($request, $response, $copy)
	{
		$source_resource = $request->get_resource($this->_datastore);

		 		$segments = $request->_destination_uri->get_segments();
		$item_id = array_pop($segments);
		$collection_resource = resource::get_resource($this->_datastore, new caldav_uri($segments));
		if (!($collection_resource instanceof collection_resource))
			throw new forbidden_exception();

		 		if ($request->_destination_uri->starts_with($request->_uri))
			throw new forbidden_exception();

		try
		{
			$destination_resource = resource::get_resource($this->_datastore, $request->_destination_uri);
			if ($_SERVER['HTTP_OVERWRITE'] == 'F')
				throw new precondition_failed_exception();
			$destination_resource->delete();
			$overwritten = true;
		}
		catch (not_found_exception $e)
		{
			$overwritten = false;
		}

		if ($copy)
		{
			$source_resource->copy_to($collection_resource, $item_id);
			if ($source_resource instanceof collection_resource &&
				($request->_depth == 'infinity' || empty($request->_depth)))
			{
				$this->copy_children($source_resource, $collection_resource, $item_id);
			}
		}
		else
		{
			$source_resource->move_to($collection_resource, $item_id);
		}

		if ($_SERVER['HTTPS'] == 'OFF')
			$location = 'Location: http://';
		else
			$location = 'Location: https://';
		if (isset($_SERVER['HTTP_HOST']))
			$location .= $_SERVER['HTTP_HOST'];
		else
			$location .= $_SERVER['SERVER_NAME'];
		$location .= $request->_destination_uri->to_string();
		$headers = array($location);

		if ($overwritten)
			$response->http_response('204 No content', $headers);
		else
			$response->http_response('201 Created', $headers);
	}

	function handle_copy($request, $response)
	{
		$this->process_copy_move($request, $response, true);
	}

	function handle_move($request, $response)
	{
		$this->process_copy_move($request, $response, false);
	}

	function write_propertyupdate_response($writer, $xml_dav_prefix, $uri, $set_properties, $remove_properties, $failed_properties)
	{
		$failed_properties_dict = $failed_dependencies = [];
		foreach ($failed_properties as $failed_property)
			$failed_properties_dict[$failed_property[1]] = $failed_property[0];
		foreach ($set_properties as $property)
			if (!isset($failed_properties_dict[$property[1]]) || $failed_properties_dict[$property[1]] !== $property[0])
				$failed_dependencies[] = $property;
		foreach ($remove_properties as $property)
			if (!isset($failed_properties_dict[$property[1]]) || $failed_properties_dict[$property[1]] !== $property[0])
				$failed_dependencies[] = $property;

		$writer->startElementNS($xml_dav_prefix, 'response', null);
		$writer->writeElementNS($xml_dav_prefix, 'href', null, $uri->to_string());

		if (count($failed_dependencies) > 0)
		{
			$writer->startElementNS($xml_dav_prefix, 'propstat', null);
			$writer->startElementNS($xml_dav_prefix, 'prop', null);
			foreach ($failed_dependencies as $property)
				$writer->writeElementNS(null, $property[1], $property[0]);
			$writer->endElement();
			$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 424 Failed Dependency');
			$writer->endElement();
		}

		$writer->startElementNS($xml_dav_prefix, 'propstat', null);
		$writer->startElementNS($xml_dav_prefix, 'prop', null);
		foreach ($failed_properties as $failed_property)
			$writer->writeElementNS(null, $failed_property[1], $failed_property[0]);
		$writer->endElement();
		$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 403 Forbidden');
		$writer->endElement();

		$writer->endElement();  	}

	function handle_proppatch($request, $response)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		 		$propertyupdate = $request->get_xml_body();
		if ($propertyupdate == null)
			throw new bad_request_exception();
		if ($propertyupdate->get_name() != 'DAV::propertyupdate')
			throw new bad_request_exception();

		$set_properties = array();
		$remove_properties = array();

		if ($propertyupdate->get_child('DAV::set'))
		{
			foreach ($propertyupdate->get_child('DAV::set\\DAV::prop')->children() as $xml_property)
				$set_properties[] = array($xml_property->get_namespace(), $xml_property->get_local_name(), $xml_property);
		}
		if ($propertyupdate->get_child('DAV::remove'))
		{
			foreach ($propertyupdate->get_child('DAV::remove\\DAV::prop')->children() as $property)
				$remove_properties[] = array($property->get_namespace(), $property->get_local_name());
		}

		$failed_properties = $dav_resource->patch_properties($set_properties, $remove_properties);
		 		if (count($failed_properties) == 0)
			return $response->http_response('204 No Content');

		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'multistatus', 'DAV:');
		$this->write_propertyupdate_response($writer, $this->_xml_dav_prefix, $request->_uri, $set_properties, $remove_properties, $failed_properties);
		$writer->endElement();  		$writer->flush();

		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function handle_mkcalendar($request, $response)
	{
		$set_properties = [];
		$segments = $request->_uri->get_segments();
		$item_id = array_pop($segments);
		try
		{
			$old_resource = $request->get_resource($this->_datastore);
			 			 			throw new forbidden_precondition_exception('DAV:', 'resource-must-be-null');
		}
		catch (not_found_exception $e)
		{
		}

		try
		{
			$collection_resource = resource::get_resource($this->_datastore, new caldav_uri($segments));
		}
		catch (not_found_exception $e)
		{
			throw new conflict_exception($e);
		}

		 		if (!($collection_resource instanceof user_collection_resource))
			throw new method_not_allowed_exception();

		 		 		 		 		 		$resource_type = text_to_xml("<resourcetype xmlns='DAV:'><collection/><calendar xmlns='urn:ietf:params:xml:ns:caldav'/></resourcetype>");
		if ($request->has_body())
		{
			$mkcalendar = $request->get_xml_body();
			if ($mkcalendar == null)
				throw new bad_request_exception();
			 			if ($mkcalendar->get_name() != 'urn:ietf:params:xml:ns:caldav:mkcalendar' || $mkcalendar->children_count() != 1 || !$mkcalendar->get_child('DAV::set') || $mkcalendar->get_child('DAV::set\\DAV::prop\\DAV::resourcetype'))
				throw new bad_request_exception();
			if ($mkcalendar->get_child('DAV::set'))
			{
				foreach ($mkcalendar->get_child('DAV::set\\DAV::prop')->children() as $xml_property)
					$set_properties[] = array($xml_property->get_namespace(), $xml_property->get_local_name(), $xml_property);
			}
		}

		$failed_properties = $collection_resource->make_collection($item_id, $resource_type, $set_properties, array());
		 		if (count($failed_properties) == 0)
			return $response->http_response('201 Created');

		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'multistatus', 'DAV:');
		if ($resource_type != null)
			$set_properties[] = array($resource_type->get_namespace(), $resource_type->get_local_name(), $resource_type);
		$this->write_propertyupdate_response($writer, $this->_xml_dav_prefix, $request->_uri, $set_properties, array(), $failed_properties);
		$writer->endElement();  		$writer->flush();

		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function handle_mkcol($request, $response)
	{
		$resource_type = null;
		$segments = $request->_uri->get_segments();
		$item_id = array_pop($segments);
		try
		{
			$old_resource = $request->get_resource($this->_datastore);
			 			 			throw new forbidden_precondition_exception('DAV:', 'resource-must-be-null');
		}
		catch (not_found_exception $e)
		{
		}

		try
		{
			$collection_resource = resource::get_resource($this->_datastore, new caldav_uri($segments));
		}
		catch (not_found_exception $e)
		{
			if (count($segments) == 2 && $segments[1] == 'dropbox')
			{
				$group_segments = $segments;
				array_pop($group_segments);
				$group_collection_resource = resource::get_resource($this->_datastore, new caldav_uri($group_segments));
				$resource_type = text_to_xml("<resourcetype xmlns='DAV:'><collection/></resourcetype>");
				$set_properties = array(array('DAV:', 'displayname', text_to_xml("<displayname xmlns='DAV:'>iCal Attachments</displayname>")));
				$group_collection_resource->make_collection('dropbox', $resource_type, $set_properties, array());
				$collection_resource = resource::get_resource($this->_datastore, new caldav_uri($segments));
			}
			else
				throw new conflict_exception($e);
		}

		 		if (!($collection_resource instanceof user_collection_resource))
			throw new method_not_allowed_exception();

		$set_properties = array();
		if ($request->has_body())
		{
			$mkcol = $request->get_xml_body();
			if ($mkcol == null)
				throw new bad_request_exception();
			 			if ($mkcol->get_name() != 'DAV::mkcol' || $mkcol->children_count() != 1 || !$mkcol->get_child('DAV::set') || !$mkcol->get_child('DAV::set\\DAV::prop\\DAV::resourcetype'))
				throw new bad_request_exception();
			$resource_type = $mkcol->get_child('DAV::set\\DAV::prop\\DAV::resourcetype');
			if ($mkcol->get_child('DAV::set'))
			{
				foreach ($mkcol->get_child('DAV::set\\DAV::prop')->children() as $xml_property)
					if ($xml_property->get_name() != 'DAV::resourcetype')
						$set_properties[] = array($xml_property->get_namespace(), $xml_property->get_local_name(), $xml_property);
			}
		}

		$failed_properties = $collection_resource->make_collection($item_id, $resource_type, $set_properties, array());
		 		if (count($failed_properties) == 0)
			return $response->http_response('201 Created');

		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'mkcol-response', 'DAV:');
		if ($resource_type != null)
			$set_properties[] = array($resource_type->get_namespace(), $resource_type->get_local_name(), $resource_type);
		$this->write_propertyupdate_response($writer, $this->_xml_dav_prefix, $request->_uri, $set_properties, array(), $failed_properties);
		$writer->endElement();  		$writer->flush();

		$headers = array('Content-Type: application/xml');
		$response->http_response('403 Forbidden', $headers);
	}

	function handle_mkticket($request, $response)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		 		if (!($dav_resource instanceof item_resource) && !($dav_resource instanceof attachment_resource))
			throw new forbidden_exception();

		$ticketinfo = $request->get_xml_body();
		if ($ticketinfo == null)
			throw new bad_request_exception();
		 		if ($ticketinfo->get_name() != 'http://icewarp.com/ns/:ticketinfo')
			throw new bad_request_exception();

		$read = $write = false;
		if ($ticketinfo->get_child('http://icewarp.com/ns/:privilege\\http://icewarp.com/ns/:read'))
			$read = true;
		if ($ticketinfo->get_child('http://icewarp.com/ns/:privilege\\http://icewarp.com/ns/:write'))
			$write = true;
		$expiration = $ticketinfo->get_child('http://icewarp.com/ns/:expiration')->_children[0]->get_data();

		$ticket = $dav_resource->make_ticket($read, $write, $expiration);
		$headers = array('Ticket: ' . $ticket);
		$response->http_response('204 No Content', $headers);
	}

	function process_get_head($request, $response, $include_body = true)
	{
		$not_modified = false;
		try
		{
			$dav_resource = $request->get_resource($this->_datastore);
		}
		catch (precondition_failed_exception $e)
		{
			if (!empty($request->_if_none_match))
			{
				$not_modified = true;
				$dav_resource = resource::get_resource($this->_datastore, $request->_uri, $request->_if_match, null);
			}
			else
				throw $e;
		}
		$content_type = $dav_resource->get_content_type();
		$etag = $dav_resource->get_etag();
		$title = $dav_resource->get_title();
		if ($title != null && !($dav_resource instanceof collection_resource))
		{
			 			if (strpos($_SERVER['HTTP_USER_AGENT'], 'Opera') !== false)
			{
				$headers = array('Content-Disposition: attachment; filename="' . $title . '"');
			}
			else if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false || strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/') !== false)
			{
				$headers = array('Content-Disposition: attachment; filename="' . rawurlencode($title) . '"');
			}
			else if (strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') !== false)
			{
				$headers = array('Content-Disposition: attachment; filename="' . $title . '"');
			}
			else
			{
				 				$headers = array('Content-Disposition: attachment; filename="=?utf-8?b?' . base64_encode($title) . '?="');
			}
		}

		$headers[] = 'Content-Type: ' . $content_type;
		if (!empty($etag))
			$headers[] = 'ETag: ' . $etag;
		if ($dav_resource instanceof item_resource)
			$headers[] = 'Schedule-Tag: ' . $dav_resource->get_schedule_tag();
		$headers[] = 'X-Robots-Tag: noindex';

		if ($not_modified)
		{
			$response->http_response('304 Not Modified', $headers);
		}
		else if ($include_body)
		{
			$data = $dav_resource->get_content();
			 			if (is_resource($data))
			{
				$data_path = $dav_resource->get_content_path();  
				if (($data_path!='') && $_SERVER["SERVER_XFILEOPERATION_SUPPORT"])
				{
					 
					fclose($data);
					$response->http_response_stream_xoperation('200 OK', $headers, $data_path);
				}
				else
				{
					$response->http_response_stream('200 OK', $headers, $data);
					fclose($data);
				}
			}
			else
				$response->http_response('200 OK', $headers, $data);
		}
		else
			$response->http_response('200 OK', $headers);
	}

	function handle_get($request, $response)
	{
		$this->process_get_head($request, $response, true);
	}

	function handle_head($request, $response)
	{
		$this->process_get_head($request, $response, false);
	}

	function handle_put($request, $response)
	{
		$headers = array();
		$checkMailboxQuota = false;
		$account = new IceWarpAccount();
		if ($account && $this->_datastore->_email && $account->Open($this->_datastore->_email))
		{
			$mailboxQuota = $account->GetProperty("U_MailboxQuota");
			if ($mailboxQuota)
			{
				$checkMailboxQuota = true;
				$mailboxSize = $account->GetProperty('U_MailboxSize');
			}
		}

		if ($checkMailboxQuota)
		{
			$mailboxQuotaBytes = (int) $mailboxQuota * 1024;
			$mailboxSizeBytes = (int) $mailboxSize * 1024;
			$newItemSizeBytes = (int) $_SERVER['HTTP_CONTENT_LENGTH'];
			if ($mailboxSizeBytes + $newItemSizeBytes > $mailboxQuotaBytes)
				throw new request_entity_too_large_exception();
		}

		if ($_SERVER['HTTP_EXPECT'] == '100-continue')
			return $response->http_response('100 Continue', $headers);

		$segments = $request->_uri->get_segments();
		$item_id = array_pop($segments);
		try
		{
			$old_resource = $request->get_resource($this->_datastore);
			if ($old_resource instanceof attachment_resource)
			{
				$stream = $request->get_body_stream();
				$result = $old_resource->put($stream);
				fclose($stream);

				if (is_array($result))
				{
					$headers[] = 'ETag: ' . $result['etag'];
					if ($result['publicurl'])
						$headers[] = 'X-FilePublicURL: '.$result['publicurl'];
				}
				else
					$headers = array('ETag: ' . $result);

				return $response->http_response('204 No Content', $headers);
			}

			 			if (!($old_resource instanceof item_resource))
				throw new method_not_allowed_exception();

			$collection_resource = $old_resource->get_collection();
		}
		catch (not_found_exception $e)
		{
			$old_resource = null;
			$collection_resource = resource::get_resource($this->_datastore, new caldav_uri($segments));

			 			if (!($collection_resource instanceof user_collection_resource))
				throw new method_not_allowed_exception();
		}

		$stream = $request->get_body_stream();
		$result = $collection_resource->put($item_id, $stream);
		fclose($stream);

		if (is_array($result))
		{
			$headers[] = 'ETag: ' . $result['etag'];
			if ($result['publicurl'])
				$headers[] = 'X-FilePublicURL: '.$result['publicurl'];
		}
		else
			$headers = array('ETag: ' . $result);

		$response->http_response($old_resource == null ? '201 Created' : '204 No Content', $headers);
	}

	function handle_post($request, $response)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		$dav_resource->post($request, $response);
	}

	function handle_report($request, $response)
	{
		$request_body = $request->get_xml_body();
		if ($request_body == null)
			throw new bad_request_exception();
		$report_type = $request_body->get_name();

		switch ($report_type)
		{
			case 'DAV::acl-principal-prop-set':
				return $this->acl_principal_prop_set_report($request, $response, $request_body);
			case 'DAV::principal-match':
				return $this->principal_match_report($request, $response, $request_body);
			case 'DAV::principal-property-search':
				return $this->principal_property_search_report($request, $response, $request_body);
			case 'DAV::principal-search-property-set':
				return $this->principal_search_property_set_report($request, $response, $request_body);
			case 'DAV::expand-property':
				return $this->expand_property_report($request, $response, $request_body);
			case 'DAV::sync-collection':
				return $this->sync_collection_report($request, $response, $request_body);
			case 'urn:ietf:params:xml:ns:caldav:calendar-query':
				return $this->calendar_query_report($request, $response, $request_body);
			case 'urn:ietf:params:xml:ns:carddav:addressbook-query':
				return $this->addressbook_query_report($request, $response, $request_body);
			case 'urn:ietf:params:xml:ns:caldav:calendar-multiget':
				return $this->calendar_multiget_report($request, $response, $request_body);
			case 'urn:ietf:params:xml:ns:carddav:addressbook-multiget':
				return $this->addressbook_multiget_report($request, $response, $request_body);
			case 'urn:ietf:params:xml:ns:caldav:free-busy-query':
				return $this->free_busy_report($request, $response, $request_body);
			default:
				throw new forbidden_precondition_exception('DAV:', 'supported-report');
		}
	}

	function acl_principal_prop_set_report($request, $response, $request_body)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		if (!($dav_resource instanceof user_collection_resource) && !($dav_resource instanceof item_resource))
			throw new bad_request_exception();

		 		if ($request->_depth != '0' && $request->_depth != null)
			throw new bad_request_exception();

		 		$properties = $this->parse_property_list($request_body);
		if ($properties === null)
			throw new bad_request_exception();

		 		$writer = $response->get_xml_writer();
		$writer->startElementNS(null, 'multistatus', 'DAV:');
		foreach ($dav_resource->get_acl_uris() as $principal_uri)
			resource::get_resource($this->_datastore, $principal_uri)->write_response($writer, null, $properties, null, null, null, $request->_brief);
		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function principal_match_report($request, $response, $request_body)
	{
		$dav_resource = null;
		 		if ($request->_depth != '0' && $request->_depth != null)
			throw new bad_request_exception();

		$principal_property = $request_body->get_child('DAV::principal-property');
		$self = $request_body->get_child('DAV::self');
		if (($principal_property && $self) || (!$principal_property && !$self))
			throw new bad_request_exception();
		if ($principal_property)
		{
			if (!$principal_property->get_child('DAV::owner'))
				throw new bad_request_exception();
			$dav_resource = $request->get_resource($this->_datastore);
			if (!($dav_resource instanceof user_collection_resource))
				throw new bad_request_exception();
		}

		 		$properties = $this->parse_property_list($request_body);
		if ($properties === null)
			$properties = array();

		 		$writer = $response->get_xml_writer();
		$writer->startElementNS(null, 'multistatus', 'DAV:');

		$self_uri = new caldav_uri(array('users', $this->_datastore->_email));
		if ($self)
		{
			$self_principal_resource = resource::get_resource($this->_datastore, $self_uri);
			
			if ($self_uri->starts_with($request->_uri))
				$self_principal_resource->write_response($writer, null, $properties, null, null, null, $request->_brief);

			$pricipal_collection_uri = new caldav_uri(array('users'));
			if ($pricipal_collection_uri->starts_with($request->_uri))
			{
				foreach ($self_principal_resource->get_proxy_for_uris(true) as $principal_uri)
				{
					$principal_resource = resource::get_resource($this->_datastore, new caldav_uri($principal_uri, 'calendar-proxy-read')); 
					$principal_resource->write_response($writer, null, $properties, null, null, null, $request->_brief);
				}
				foreach ($self_principal_resource->get_proxy_for_uris(false) as $principal_uri)
				{
					$principal_resource = resource::get_resource($this->_datastore, new caldav_uri($principal_uri, 'calendar-proxy-write')); 
					$principal_resource->write_response($writer, null, $properties, null, null, null, $request->_brief);
				}
			}
		}
		else
		{
			 			$this->build_response($writer, $dav_resource, 'infinity', $properties, array('owner' => $self_uri), $request->_brief);
		}

		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function property_match($property_value, $search_value)
	{
		if (is_array($property_value))
		{
			foreach ($property_value as $property_value_single)
				if ($this->property_match($property_value_single, $search_value))
					return true;
			return false;
		}
		else
		{
			 			if ($property_value == $search_value)
				return true;
			if (strlen($search_value) >= 3 && stristr($property_value, $search_value) !== false)
				return true;
			return false;
		}
	}

	function get_principal_search_property_names()
	{
		return array(
			array('DAV:', 'displayname', 'Full name'),
			array('urn:ietf:params:xml:ns:caldav', 'calendar-home-set', 'Calendar home address'),
			array('urn:ietf:params:xml:ns:caldav', 'calendar-user-address-set', 'Calendar user address'),
			array('http://calendarserver.org/ns/', 'first-name', 'First name'), 		
			array('http://calendarserver.org/ns/', 'last-name', 'Last name'), 		
			array('http://calendarserver.org/ns/', 'email-address-set', 'Email addresses'), 		
		);
	}

	function principal_property_search_report($request, $response, $request_body)
	{
		 		if ($request->_depth != '0' && $request->_depth != null)
			throw new bad_request_exception();

		 		 		 		if ($request_body->get_child('DAV::apply-to-principal-collection-set'))
		{
			$dav_resource = resource::get_resource($this->_datastore, new caldav_uri(array('users')));
		}
		else
		{
			$dav_resource = $request->get_resource($this->_datastore);
			$segments = $dav_resource->get_uri()->get_segments();
			if (!($dav_resource instanceof users_resource) || end($segments) != 'users')
				throw new bad_request_exception();
		}

		 		if (!$request_body->get_child('DAV::prop'))
			throw new bad_request_exception();

		 		$allowed_properties = $this->get_principal_search_property_names();
		$search_properties = array();
		$filter = array();
		$test = $request_body->_attribs['test'];
		$filter['test'] = $test;
		$children = &$request_body->children();
		foreach ($children as $child)
		{
			if ($child->get_name() != 'DAV::property-search')
				break;

			$prop = &$child->get_child('DAV::prop');
			$match_element = &$child->get_child('DAV::match');
			if (!$prop || !$match_element)
				throw new bad_request_exception();

			$match = $match_element->children_count() > 0 ? $match_element->_children[0]->get_data() : '';
			foreach ($prop->children() as $property)
			{
				$search_property = array($property->get_namespace(), $property->get_local_name(), $match);
				$allowed = false;
				foreach ($allowed_properties as $allowed_propery)
				{
					if ($allowed_propery[0] == $search_property[0] && $allowed_propery[1] == $search_property[1])
					{
						$allowed = true;
						break;
					}
				}
				if (!$allowed)  					throw new bad_request_exception();
					
				$search_properties[] = $search_property;
				if ($search_property[0] == 'DAV:')
				{
					if ($search_property[1] == 'displayname')
						$filter['fn'] = array('text' => $search_property[2], 'type' => 'starts-with');
				}
				else if ($search_property[0] == 'http://calendarserver.org/ns/')
				{
					if ($search_property[1] == 'first-name')
						$filter['first-name'] = array('text' => $search_property[2], 'type' => 'starts-with'); 
					else if ($search_property[1] == 'last-name')
						$filter['last-name'] = array('text' => $search_property[2], 'type' => 'starts-with'); 
					else if ($search_property[1] == 'email-address-set')
						$filter['email'] = array('text' => $search_property[2], 'type' => 'starts-with'); 
				}
			}
		}
		
		$properties = $this->parse_property_list($request_body);
		if ($properties === null)
			throw new bad_request_exception();

		$writer = $response->get_xml_writer();
		$writer->startElementNS(null, 'multistatus', 'DAV:');

		if ($_SESSION["use_gal_for_search"] == '0')
			$child_resources = $dav_resource->get_children();
		else 
			$child_resources = $dav_resource->get_items_filtered($filter, null, true);
 
		foreach ($child_resources as $principal_resource)
		{
			 			 			$matched_resource = $test == 'anyof' ? false : true;
 			foreach ($search_properties as $search_property)
			{
				$property_value = $principal_resource->get_search_property($search_property[0], $search_property[1]);
				$search_value = $search_property[2];
 				$matched_property = $this->property_match($property_value, $search_value);
 				if ($test == 'anyof')
				{
					if ($matched_property)
					{
						$matched_resource = true;
						break;
					}
				}
				else  				{
					if (!$matched_property)
					{
						$matched_resource = false;
						break;
					}
				}
			}

			 			if ($matched_resource)
				$principal_resource->write_response($writer, null, $properties, null, null, null, $request->_brief);
		}
		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function principal_search_property_set_report($request, $response, $request_body)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		$segments = $dav_resource->get_uri()->get_segments();
		if (!($dav_resource instanceof users_resource) || end($segments) != 'users')
			throw new bad_request_exception();

		 		if ($request->_depth != '0' && $request->_depth != null)
			throw new bad_request_exception();

		 		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'principal-search-property-set', 'DAV:');
		foreach ($this->get_principal_search_property_names() as $property)
		{
			$writer->startElementNS($this->_xml_dav_prefix, 'principal-search-property', null);		
			$writer->startElementNS($this->_xml_dav_prefix, 'prop', null);
			if ($property[0] == 'DAV:')
				$writer->writeElementNS($this->_xml_dav_prefix, $property[1], null);
			else
				$writer->writeElementNS(null, $property[1], $property[0]);
			$writer->endElement();
			$writer->writeElementNS($this->_xml_dav_prefix, 'description', null, $property[2]);
			$writer->endElement();
		}
		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	public function calendar_query_item_callback($resource, $data_filter, $writer, $xml_dav_prefix, &$properties)
	{
		if ($properties == 'propname')
		{
			$writer->writeElementNS(null, 'calendar-data', 'urn:ietf:params:xml:ns:caldav');
			return;
		}
		else if ($properties != 'allprop')
		{
			foreach ($properties as $property_name => $namespace_uri)
			{
				if ($namespace_uri == 'urn:ietf:params:xml:ns:caldav' && $property_name == 'calendar-data')
				{
					$writer->startElementNS(null, 'calendar-data', 'urn:ietf:params:xml:ns:caldav');
					 					$writer->writeRaw(create_cdata($resource->get_content_filtered($data_filter)));
					$writer->endElement();
					unset($properties[$property_name]);
				}
			}
		}
	}

	public function addressbook_query_item_callback($resource, $data_filter, $writer, $xml_dav_prefix, &$properties)
	{
		if ($properties == 'propname')
		{
			$writer->writeElementNS(null, 'address-data', 'urn:ietf:params:xml:ns:carddav');
			return;
		}
		else if ($properties != 'allprop')
		{
			foreach ($properties as $property_name => $namespace_uri)
			{
				if ($namespace_uri == 'urn:ietf:params:xml:ns:carddav' && $property_name == 'address-data')
				{
					 					$writer->startElementNS(null, 'address-data', 'urn:ietf:params:xml:ns:carddav');
					 					$writer->writeRaw(create_cdata($resource->get_content_filtered($data_filter)));
					$writer->endElement();
					unset($properties[$property_name]);
				}
			}
		}
	}

	private function parse_calendar_query_data_filter($calendar_data)
	{
		global $datastore_types;
		$props = [];
		if ($calendar_data)
		{
			$data_filter = [];
			$expand = $calendar_data->get_child('urn:ietf:params:xml:ns:caldav:expand');
			$limit = $calendar_data->get_child('urn:ietf:params:xml:ns:caldav:limit-recurrence-set');
			if ($expand && $limit)
				return false;

			if ($expand)
			{
				$data_filter['expand']['start'] = $expand->_attribs['start'];
				$data_filter['expand']['end'] = $expand->_attribs['end'];
			}
			else if ($limit)
			{
				$data_filter['limit']['start'] = $limit->_attribs['start'];
				$data_filter['limit']['end'] = $limit->_attribs['end'];
			}

			 			 			$comp = $calendar_data->get_child('urn:ietf:params:xml:ns:caldav:comp\\urn:ietf:params:xml:ns:caldav:comp');
			if ($comp)
			{
				foreach ($comp->children() as $prop)
				{
					if ($prop->get_name() == 'urn:ietf:params:xml:ns:caldav:prop')
						$props[] = $prop->_attribs['name'];
				}
				$data_filter['filter'][$datastore_types[$comp->_attribs['name']]] = $props;
			}

			return $data_filter;
		}

		return null;
	}

	private function parse_addressbook_query_data_filter($address_data)
	{
		if ($address_data)
		{
			$data_filter = array();
			foreach ($address_data->children() as $prop)
			{
				if ($prop->get_name() == 'urn:ietf:params:xml:ns:carddav:prop')
					$data_filter[] = $prop->_attribs['name'];
			}
			return $data_filter;
		}
		return null;
	}

	private function multiget_report($request, $response, $request_body, $folder_types, $item_callback, $data_filter)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		if (!($dav_resource instanceof user_collection_resource) && !($dav_resource instanceof item_resource) &&
		!($dav_resource instanceof inbox_folder_resource) && !($dav_resource instanceof inbox_resource))
			throw new forbidden_exception();

		 		$properties = $this->parse_property_list($request_body);
		if ($properties === null)
			throw new bad_request_exception();

		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'multistatus', 'DAV:');
		$children = &$request_body->children();
		$uris = array();
		foreach ($children as $child)
		{
			if ($child->get_name() != 'DAV::href')
				continue;
			$uris[] = new caldav_uri($child->_children[0]->get_data());
		}

		$mem_writer = new XMLWriter();
		$mem_writer->openMemory();
		$mem_writer->setIndent(true);

		foreach ($uris as $uri)
		{
			try
			{
				$resource = resource::get_resource($this->_datastore, $uri);
				if (!$resource->get_uri()->starts_with($dav_resource->get_uri()) || (!($resource instanceof item_resource) && !($resource instanceof inbox_resource)))
					throw new not_found_exception();
				if (strpos($folder_types, $resource->get_internal_type()) === false)
					throw new forbidden_exception();
				$resource->write_response($mem_writer, null, $properties, $this, $item_callback, $data_filter, $request->_brief);

				$xml_string = $mem_writer->outputMemory(true);
				$writer->writeRaw($xml_string);
			}
			catch (dav_exception $e)
			{
				 				 				if (count($uris) == 1 && $e instanceof forbidden_exception)
					throw $e;

				$writer->startElementNS($this->_xml_dav_prefix, 'response', null);
				$writer->writeElementNS($this->_xml_dav_prefix, 'href', null, $uri->to_string());
				$writer->writeElementNS($this->_xml_dav_prefix, 'status', null, 'HTTP/1.1 ' . $e->get_status_line());
				$writer->endElement();

				$mem_writer->flush(true);
			}
		}

		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	private function calendar_multiget_report($request, $response, $request_body)
	{
		 		$data_filter = $this->parse_calendar_query_data_filter($request_body->get_child('DAV::prop\\urn:ietf:params:xml:ns:caldav:calendar-data'));
		$this->multiget_report($request, $response, $request_body, 'EJT', 'calendar_query_item_callback', $data_filter);
	}

	private function addressbook_multiget_report($request, $response, $request_body)
	{
		 		$data_filter = $this->parse_addressbook_query_data_filter($request_body->get_child('DAV::prop/urn:ietf:params:xml:ns:carddav:address-data'));
		$this->multiget_report($request, $response, $request_body, 'C', 'addressbook_query_item_callback', $data_filter);
	}

	private function parse_calendar_query_filter($filter_xml)
	{
		global $datastore_types;
		$filter = [];
		$calender_comp_filter = $filter_xml->get_child('urn:ietf:params:xml:ns:caldav:comp-filter');
		if ($calender_comp_filter->_attribs['name'] != 'VCALENDAR' || $calender_comp_filter->get_child('urn:ietf:params:xml:ns:caldav:is-not-defined'))
			throw new supported_filter_precondition_exception($calender_comp_filter);

		foreach ($calender_comp_filter->children() as $comp_filter)
		{
			 			if ($comp_filter->get_name() != 'urn:ietf:params:xml:ns:caldav:comp-filter')
				throw new supported_filter_precondition_exception($comp_filter);

			 			 			$comp_type = $datastore_types[$comp_filter->_attribs['name']];
			if (!$comp_type)
				throw new supported_filter_precondition_exception($comp_filter);

			$filter[$comp_type]['type'] = 'yes';
			if ($comp_filter->get_child('urn:ietf:params:xml:ns:caldav:is-not-defined'))
				throw new supported_filter_precondition_exception($comp_filter);

			foreach ($comp_filter->children() as $child)
			{
				if ($child->get_name() == 'urn:ietf:params:xml:ns:caldav:comp-filter')
					throw new supported_filter_precondition_exception($child);
				else if ($child->get_name() == 'urn:ietf:params:xml:ns:caldav:prop-filter')
				{
					$name = strtolower($child->_attribs['name']);
					if ($name == 'uid' || $name == 'summary' || $name == 'description' || $name == 'location')
					{
						if ($child->get_child('urn:ietf:params:xml:ns:caldav:is-not-defined'))
						{
							$filter[$comp_type][$name]['type'] = 'null';
						}
						else if (($text_match = $child->get_child('urn:ietf:params:xml:ns:caldav:text-match')) != null)
						{
							 							$filter[$comp_type][$name]['text'] = $text_match->_children[0]->get_data();
							$filter[$comp_type][$name]['negate'] = $text_match->_attribs['negate-condition'] == 'yes' ? true : false;
							$filter[$comp_type][$name]['type'] = $text_match->_attribs['match-type'];
							if (!$filter[$name]['type'])
							  $filter[$name]['type'] = 'contains';
						}
						else if ($child->children_count() == 0)
						{
							$filter[$comp_type][$name]['type'] = 'null';
							$filter[$comp_type][$name]['negate'] = true;
						}
						else
							throw new supported_filter_precondition_exception($child);
					}
					else
						throw new supported_filter_precondition_exception($child);
				}
				else if ($child->get_name() == 'urn:ietf:params:xml:ns:caldav:time-range')
				{
					if ($calender_comp_filter->children_count() != 1)
						throw new supported_filter_precondition_exception($child);
					$filter['time-range']['start'] = $child->_attribs['start'];
					$filter['time-range']['end'] = $child->_attribs['end'];
				}
				else
					throw new supported_filter_precondition_exception($child);
			}
		}

		return $filter;
	}

	public function calendar_query_report($request, $response, $request_body)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		if (!($dav_resource instanceof user_collection_resource) && !($dav_resource instanceof item_resource))
			throw new forbidden_precondition_exception('DAV:', 'supported-report');

		 		 		if (strpos(' EJT', $dav_resource->get_internal_type()) === false)
			throw new forbidden_precondition_exception('DAV:', 'supported-report');

		 		$properties = $this->parse_property_list($request_body);
		if ($properties === null)
			throw new bad_request_exception();

		 		$data_filter = $this->parse_calendar_query_data_filter($request_body->get_child('DAV::prop\\urn:ietf:params:xml:ns:caldav:calendar-data'));

		 		$filter = null;
		$filter_xml = &$request_body->get_child('urn:ietf:params:xml:ns:caldav:filter');
		if ($filter_xml)
			$filter = $this->parse_calendar_query_filter($filter_xml);

		$timezone_xml = &$request_body->get_child('urn:ietf:params:xml:ns:caldav:timezone');
		if ($timezone_xml)
			$filter['timezone'] = $timezone_xml->_children[0]->get_data();

		 		$writer = $response->get_xml_writer();
		$writer->startElementNS(null, 'multistatus', 'DAV:');

		if ($request->_depth == '1' || $request->_depth == 'infinity' || !$request->_depth ||
			($dav_resource instanceof item_resource))
		{
			 			 			 			foreach ($dav_resource->get_items_filtered($filter) as $resource)
				$resource->write_response($writer, null, $properties, $this, 'calendar_query_item_callback', $data_filter, $request->_brief);
		}

		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function parse_addressbook_query_filter($filter_xml, $filter = [])
	{
		foreach ($filter_xml->children() as $prop_filter)
		{
			 			if ($prop_filter->get_name() != 'urn:ietf:params:xml:ns:carddav:prop-filter')
				throw new supported_filter_precondition_exception($prop_filter);

			$name = strtolower($prop_filter->_attribs['name']);
			
			 			if ($name == 'mail')
				$name = 'email';
				
			if ($name == 'uid' || $name == 'email' || $name == 'fn' || $name == 'note' || $name == 'nickname')
			{
				if ($prop_filter->get_child('urn:ietf:params:xml:ns:carddav:is-not-defined'))
					$filter[$name]['type'] = 'null';
				else if ($prop_filter->get_child('urn:ietf:params:xml:ns:carddav:param-filter'))
					throw new supported_filter_precondition_exception($prop_filter);
				else if (($text_match = $prop_filter->get_child('urn:ietf:params:xml:ns:carddav:text-match')) != null)
				{
					 					 					$filter[$name]['text'] = $text_match->_children[0]->get_data();
					$filter[$name]['negate'] = $text_match->_attribs['negate-condition'] == 'yes' ? true : false;
					$filter[$name]['type'] = $text_match->_attribs['match-type'];
					if (!$filter[$name]['type'])
						$filter[$name]['type'] = 'contains';
				}
				else if ($prop_filter->children_count() == 0)
				{
					$filter[$name]['type'] = 'null';
					$filter[$name]['negate'] = true;
				}
				else
					throw new supported_filter_precondition_exception($prop_filter);
			}
			else
				throw new supported_filter_precondition_exception($prop_filter);
		}

		$filter['test'] = $filter_xml->_attribs['test'];

		return $filter;
	}

	function addressbook_query_report($request, $response, $request_body)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		if (!($dav_resource instanceof user_collection_resource) && !($dav_resource instanceof item_resource))
			throw new forbidden_precondition_exception('DAV:', 'supported-report');

		 		 		if ($dav_resource->get_internal_type() != 'C')
			throw new forbidden_precondition_exception('DAV:', 'supported-report');

		 		$properties = $this->parse_property_list($request_body);
		if ($properties === null)
			throw new bad_request_exception();

		 		$data_filter = $this->parse_addressbook_query_data_filter($request_body->get_child('DAV::prop\\urn:ietf:params:xml:ns:carddav:address-data'));

		 		$filter = null;
		$limit = null;
		$filter_xml = &$request_body->get_child('urn:ietf:params:xml:ns:carddav:filter');
		if ($filter_xml)
			$filter = $this->parse_addressbook_query_filter($filter_xml, $filter);
		$limit_xml = &$request_body->get_child('urn:ietf:params:xml:ns:carddav:limit\\urn:ietf:params:xml:ns:carddav:nresults');
		if ($limit_xml)
			$limit = $limit_xml->_children[0]->get_data();

		 		$writer = $response->get_xml_writer();
		$writer->startElementNS(null, 'multistatus', 'DAV:');
		 		if ($request->_depth == '1' || $request->_depth == 'infinity' || !$request->_depth ||
			($dav_resource instanceof item_resource))
		{
			$item_counter = 0;
			 			 			 			foreach ($dav_resource->get_items_filtered($filter) as $resource)
			{
				if ($limit != null && $item_counter == $limit)
				{
					$writer->startElement('response');
					if ($dav_resource instanceof collection_resource)
						$writer->writeElement('href', $request->_uri->to_string() . '/');
					else
						$writer->writeElement('href', $request->_uri->to_string());
					$writer->writeElement('status', 'HTTP/1.1 507 OK');
					$writer->startElement('error');
					$writer->writeElement('number-of-matches-within-limits', null);
					$writer->endElement();
					$writer->endElement();
					break;
				}
				$resource->write_response($writer, null, $properties, $this, 'addressbook_query_item_callback', $data_filter, $request->_brief);
				$item_counter++;
			}
		}

		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	private function free_busy_report($request, $response, $request_body)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		if (!($dav_resource instanceof user_collection_resource))
			throw new forbidden_precondition_exception('DAV:', 'supported-report');
		 		 		if (strpos(' EJT', $dav_resource->get_internal_type()) === false)
			throw new forbidden_precondition_exception('DAV:', 'supported-report');
		 		if ($request->_depth == 'infinity')
			throw new forbidden_exception();  
		$time_range = $request_body->get_child("urn:ietf:params:xml:ns:caldav:time-range");
		$result = $dav_resource->get_free_busy($time_range->_attribs['start'], $time_range->_attribs['end']);
		$response->http_response("200 OK", array('Content-Type: text/calendar'), $result);
	}

	private function verify_expand_properties_xml($properties_xml)
	{
		foreach ($properties_xml->children() as $property_xml)
		{
			if ($property_xml->get_name() != 'DAV::property')
				throw new bad_request_exception();			
			if (!isset($property_xml->_attribs['name']))
				throw new bad_request_exception();
			if ($property_xml->children_count() != 0)
				$this->verify_expand_properties_xml($property_xml);			
		}
	}
	
	private function expand_properties($writer, $xml_dav_prefix, $dav_resource, $properties_xml)
	{
		$writer->startElementNS($xml_dav_prefix, 'response', 'DAV:');
		if ($this instanceof collection_resource && !($this instanceof root_resource))
			$writer->writeElementNS($xml_dav_prefix, 'href', null, $dav_resource->get_uri()->to_string() . '/');
		else
			$writer->writeElementNS($xml_dav_prefix, 'href', null, $dav_resource->get_uri()->to_string());
		$in_propstat = false;		
		foreach ($properties_xml->children() as $property_xml)
		{
			$name = $property_xml->_attribs['name'];
			$namespace = 'DAV:';
			if (isset($property_xml->_attribs['namespace']))
				$namespace = $property_xml->_attribs['namespace'];
		
			try
			{
				$current_writer = new XMLWriter();
				$current_writer->openMemory();
				$current_writer->setIndent(true);

				if ($namespace == 'DAV:')
					$current_writer->startElementNS($xml_dav_prefix, $name, null);
				else
					$current_writer->startElementNS(null, $name, $namespace);
				$dav_resource->write_property_value($namespace, $name, $current_writer, $xml_dav_prefix);
				$current_writer->endElement();

				if ($in_propstat == false)
				{
					$writer->startElementNS($xml_dav_prefix, 'propstat', null);
					$writer->startElementNS($xml_dav_prefix, 'prop', null);
					$in_propstat = true;
				}

				if ($property_xml->children_count() != 0)
				{
					if ($namespace == 'DAV:')
						$writer->startElementNS($xml_dav_prefix, $name, null);
					else
						$writer->startElementNS(null, $name, $namespace);

					$href_xml = text_to_xml($current_writer->outputMemory(true));
					foreach ($href_xml->children() as $href)
					{
						$uri = new caldav_uri($href->_children[0]->get_data());
						$resource = resource::get_resource($this->_datastore, $uri);
						$this->expand_properties($writer, $xml_dav_prefix, $resource, $property_xml);
					}

					$writer->endElement();
				}
				else
					$writer->writeRaw($current_writer->outputMemory(true));
			}
			catch (dav_exception $e)
			{
				if ($property_xml->children_count() != 0)
					$writer->endElement();

				if ($in_propstat)
				{
					$writer->endElement();
					$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 200 OK');
					$writer->endElement();
					$in_propstat = false;
				}

				if ($property_xml->children_count() == 0)
				{
					$writer->startElementNS($xml_dav_prefix, 'propstat', null);
					$writer->startElementNS($xml_dav_prefix, 'prop', null);
					$writer->writeElementNS(null, $name, $namespace, null);
					$writer->endElement();
					$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 ' . $e->get_status_line());
					$writer->endElement();
				}
			}
		}
 
		if ($in_propstat)
		{
			$writer->endElement();
			$writer->writeElementNS($xml_dav_prefix, 'status', null, 'HTTP/1.1 200 OK');
			$writer->endElement();
		}
		$writer->endElement();
	}

	private function expand_property_report($request, $response, $request_body)
	{
		$dav_resource = $request->get_resource($this->_datastore);
		$this->verify_expand_properties_xml($request_body);			
		$writer = $response->get_xml_writer();
		$writer->startElementNS(null, 'multistatus', 'DAV:');
		$this->expand_properties($writer, null, $dav_resource, $request_body);
		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	private function sync_collection_report($request, $response, $request_body)
	{
		$properties = $this->parse_property_list($request_body);
		if ($properties === null)
			throw new bad_request_exception();
		if ($request_body->get_child('DAV::limit') != null)
			throw new forbidden_precondition_exception('DAV:', 'number-of-matches-within-limits');			
		$dav_resource = $request->get_resource($this->_datastore);
		if (!($dav_resource instanceof user_collection_resource) && !($dav_resource instanceof inbox_folder_resource))
			throw new forbidden_exception();
			
		$sync_token = $request_body->get_data('DAV::sync-token');
		$ctag = $dav_resource->get_ctag();
		if ($sync_token != null && $ctag != html_entity_decode($sync_token))
			throw new forbidden_precondition_exception('DAV:', 'valid-sync-token');
		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'multistatus', 'DAV:');
		if ($sync_token != null)
		  $filter = array('is_collection' => 'true');
		else
		  $filter = null;
		foreach ($dav_resource->get_children($filter) as $child_resource)
		{
			if (!($child_resource instanceof collection_resource))
				$child_resource->write_response($writer, $this->_xml_dav_prefix, $properties, null, null, null, $request->_brief);
			else if ($request->_depth == 'infinity')
			{
				$writer->startElementNS($this->_xml_dav_prefix, 'response', null);
				$writer->writeElementNS($this->_xml_dav_prefix, 'href', null, $child_resource->get_uri()->to_string() . '/');
				$writer->writeElementNS($this->_xml_dav_prefix, 'status', null, 'HTTP/1.1 403 Forbidden');
				$writer->startElementNS($this->_xml_dav_prefix, 'error', null);
				$writer->writeElementNS($this->_xml_dav_prefix, 'sync-traversal-supported', null);
				$writer->endElement();
				$writer->endElement();
			}
		}
		$writer->writeElementNS($this->_xml_dav_prefix, 'sync-token', null, $ctag);
		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function parse_property_list($xml_element)
	{
		$propname = &$xml_element->get_child('DAV::propname');
		$allprop = &$xml_element->get_child('DAV::allprop');
		$prop = &$xml_element->get_child('DAV::prop');
		$properties = [];
		if (($propname && $allprop) || ($propname && $prop) || ($allprop && $prop))
			return null;

		if ($propname)
			return 'propname';
		if ($allprop)
			return 'allprop';
		if ($prop)
		{
			foreach ($prop->children() as $child)
				$properties[$child->get_local_name()] = $child->get_namespace();
			return $properties;
		}

		return null;
	}

	function build_children_response($writer, $dav_resource, $depth, $properties, $filter, $brief = false)
	{
		if (!($dav_resource instanceof collection_resource))
			return 0;

		$children = $dav_resource->get_children($filter);
		$resource_count = count($children);
		foreach ($children as $child_resource)
		{
			if ($filter == null || 
			((!isset($filter['owner']) || $dav_resource->get_owner_uri()->equals($filter['owner'])) &&
			(!isset($filter['itemid']) || (($child_resource instanceof item_resource) && ($child_resource->get_item_id() == $filter['itemid']))) &&
			(!isset($filter['collectionid']) || (($dav_resource instanceof user_collection_resource) && ($dav_resource->get_collection_id() == $filter['collectionid'])))))
				$child_resource->write_response($writer, $this->_xml_dav_prefix, $properties, null, null, null, $brief);

			if ($depth != '1')
				$resource_count += $this->build_children_response($writer, $child_resource, $depth, $properties, $filter);
		}
		return $resource_count;
	}

	function build_response($writer, $dav_resource, $depth, $properties, $filter, $brief = false)
	{
		if ($filter == null || 
		((!isset($filter['owner']) || $dav_resource->get_owner_uri()->equals($filter['owner'])) &&
		(!isset($filter['itemid']) || (($dav_resource instanceof item_resource) && ($dav_resource->get_item_id() == $filter['itemid']))) &&
		(!isset($filter['collectionid']) || (($dav_resource instanceof user_collection_resource) && ($dav_resource->get_collection_id() == $filter['collectionid'])))))
			$dav_resource->write_response($writer, $this->_xml_dav_prefix, $properties, null, null, null, $brief);

		if ($depth != '0')
			return 1 + $this->build_children_response($writer, $dav_resource, $depth, $properties, $filter, $brief);
	}

	function handle_search($request, $response)
	{
		 		$request_body = $request->get_xml_body();
		if ($request_body == null)
			throw new bad_request_exception();
		if ($request_body->get_name() == 'DAV::query-schema-discovery')
			throw new forbidden_precondition_exception('DAV:', 'query-schema-discovery');
		if ($request_body->get_name() != 'DAV::searchrequest')
			throw new bad_request_exception();
		$basicsearch = $request_body->get_child('DAV::basicsearch');
		if ($basicsearch == null || $basicsearch->get_child('DAV::limit') != null || $basicsearch->get_child('DAV::orderby') != null)
			throw new forbidden_precondition_exception('DAV:', 'search-grammar-supported');
		$select = $basicsearch->get_child('DAV::select');
		$from = $basicsearch->get_child('DAV::from');
		if ($select == null || $from == null)
			throw new bad_request_exception();

		$properties = $this->parse_property_list($select);
		if ($properties === null || $properties == 'propname')
			throw new bad_request_exception();

		$where = $basicsearch->get_child('DAV::where');
		$filter = array();
		if ($where != null)
		{
			foreach ($where->children() as $where_condition)
			{
				if ($where_condition->get_name() == 'DAV::is-collection')
					$filter['is_collection'] = true;
				else
					if ($where_condition->get_name() == 'DAV::equal')
					{
						$prop = $where_condition->get_child('DAV::prop');
						$literal = $where_condition->get_child('DAV::literal');
						if ($prop == null || $literal == null)
							throw new forbidden_precondition_exception('DAV:', 'search-grammar-supported');

						$itemid_tag = $prop->get_child('itemid');
						$collectionid_tag = $prop->get_child('collectionid');

						if ($itemid_tag != null)
							$filter['itemid'] = $literal->_children[0]->get_data();
						else if ($collectionid_tag != null)
							$filter['collectionid'] = $literal->_children[0]->get_data();
						else
							throw new forbidden_precondition_exception('DAV:', 'search-grammar-supported');
					}
					else
						throw new forbidden_precondition_exception('DAV:', 'search-grammar-supported');
			}
		}

		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'multistatus', 'DAV:');

		foreach ($from->children() as $scope)
		{
			if ($scope->get_name() != 'DAV::scope')
				throw new bad_request_exception();

			$href = $scope->get_child('DAV::href');
			$depth = $scope->get_child('DAV::depth')->_children[0]->get_data();

			$uri = new caldav_uri($href->_children[0]->get_data());
			$dav_resource = resource::get_resource($this->_datastore, $uri, null, null, null, $filter);
			 			$this->build_response($writer, $dav_resource, $depth, $properties, $filter, $request->_brief);
		}

		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function handle_propfind($request, $response)
	{
		if (!$request->has_body())
			$properties = 'allprop';
		else
		{
			$request_body = $request->get_xml_body();
			if ($request_body == null)
				throw new bad_request_exception();
			$properties = $this->parse_property_list($request_body);
			if ($properties === null)
				throw new bad_request_exception();
		}

		$dav_resource = $request->get_resource($this->_datastore);
		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'multistatus', 'DAV:');
		$this->build_response($writer, $dav_resource, $request->_depth, $properties, null, $request->_brief);
		$writer->endElement();
		$writer->flush();
		$headers = array('Content-Type: application/xml');
		$response->http_response('207 Multi-Status', $headers);
	}

	function handle_lock($request, $response)
	{
		$lock_info = [];
		 		 		 		 		if ($request->has_body())
		{
			if ($request->_depth == 'infinity')
				throw new bad_request_exception();

			$lockrequest = $request->get_xml_body();
			if ($lockrequest == null)
				return $response->http_response("400 Bad Request");
			$lockscope = $lockrequest->get_child('DAV::lockscope');
			$locktype = $lockrequest->get_child('DAV::locktype');
			$owner = $lockrequest->get_child('DAV::owner');

			foreach ($lockscope->children() as $item)
				$lock_info['scope'] = $item->get_local_name();
			foreach ($locktype->children() as $item)
				$lock_info['type'] = $item->get_local_name();
			foreach ($owner->children() as $item)
			{
				if ($item instanceof xml_text_node)
					$lock_info['owner_text'] = $item->get_data();
				else if ($item->get_name() == 'DAV::href')
					$lock_info['owner'] = $item->_children[0]->get_data();
			}
			$lock_info['depth'] = $request->_depth;
			$timeout = $_SERVER['HTTP_TIMEOUT'];
			if ($timeout) {
				$tmp_arr = explode(',', $timeout);
				$lock_info['timeout'] = array_shift( $tmp_arr);
			}

			$dav_resource = $request->get_resource($this->_datastore);
			$lock_token = $dav_resource->lock($lock_info);
			if ($lock_token == null)
				throw new forbidden_exception();
		}
		else
		{
			$dav_resource = $request->get_resource($this->_datastore);
			$lock_info = $dav_resource->get_lock_info($lock_info);      
			$lock_token = $dav_resource->get_lock_token();
			if ($lock_info == null || $lock_token == null)
				throw new precondition_failed_exception();
		}

		$writer = $response->get_xml_writer();
		$writer->startElementNS($this->_xml_dav_prefix, 'prop', 'DAV:');    
		$writer->startElementNS($this->_xml_dav_prefix, 'lockdiscovery', null);
		$dav_resource->write_lockdiscovery($writer, $this->_xml_dav_prefix);
		$writer->endElement();
		$writer->endElement();
		$writer->flush();

		$headers = array('Content-Type: application/xml', 'Lock-Token: <' . $lock_token . '>');
		$response->http_response('200 OK', $headers);
	}

	function handle_unlock($request, $response)
	{
		 		$dav_resource = $request->get_resource($this->_datastore);
		$dav_resource->unlock();
		$response->http_response('204 No Content');
	}
}

?>
