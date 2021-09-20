<?php
 require_once(SHAREDLIB_PATH . 'api/account.php');
require_once(SHAREDLIB_PATH . 'api/gw.php');

define('catWebDav', 13);
define('DAV_PATH_SEPARATOR', '\\');

define('E_NO_VEVENT',14);

class datastore
{
	var $_gw;
	var $_user;
	var $_email;
	var $_gsid;
	var $_fsid;
	var $_folders;
	var $_ticket;
	var $_files_folder;
	var $_events_folder;
	var $_tasks_folder;
	var $_journal_folder;
	var $_notes_folder;
	var $_contacts_folder;
	var $_folders_version;
	var $_folders_new_version;
	public $_folder_info_cache;

	function __construct()
	{
		if(!$_SESSION['WEBDAV_DEVICE_ID'])
			$_SESSION['WEBDAV_DEVICE_ID'] = preg_replace('/e/si','z',uniqid('', true));

		$this->_gw = new IceWarpGWAPI();
		$this->_gw->identity = 'com.icewarp.webdav';
		$this->_gw->deviceid = $_SESSION['WEBDAV_DEVICE_ID'];
	}

	function is_folder($group_name, $folder)
	{
		if (trim($folder)=='')
			return true;
		if ($this->get_folder_info($group_name, $folder) === false)
			return false;
		return true;
	}

	function login($username, $password, $scheme = '', $challenge = '')
	{
 
		$account = new IceWarpAccount();
		if ($scheme == 'GSSAPI')
		{
 			$host = $_SERVER['HTTP_HOST'];
			if (substr_count($host, ':')) 
			{ 
				$host = explode(':', $host); 
				$host = $host[0]; 
			}
 			$otoken = $account->AuthenticateUserSSO($challenge, $host, 'HTTP');
 			if (!$otoken)
				return false;

			$otoken = explode('&', $otoken);
			$username = $account->EmailAddress;
			$password = base64_decode($otoken[1]);
			$scheme = 'PLAIN';
			header('WWW-Authenticate: Negotiate ' . $otoken[0]);
		}
 		if ($account->Open($username) && $account->ValidateUser(catWebDav))
		{
			 			if ($this->_gw->sessid)
			{
				$this->_fsid = array();
				$this->_gw->Logout();
			}
 			$this->_user = $username;
			$this->_gw->user = $account->EmailAddress;
			$this->_gw->setPassword($password);
			$this->_gw->authscheme = $scheme;
			$this->_gw->authchallenge = $challenge;
			$this->_email = $account->EmailAddress;
 			if ($this->_gw->Login())
			{
 				$gsid = $this->_gsid = $this->_gw->OpenGroup('*');
				$this->cache_folder_list($gsid);
				$this->_folders_new_version = $this->_folders_version;
				return true;
			}
		}
		return false;
	}

	function recheck_login($username, $password, $scheme = '', $challenge = '')
	{
 
		$account = new IceWarpAccount();
		if (!$account->Open($username) || !$account->ValidateUser(catWebDav))
			return false;

		if ($this->_user != $username)
			return false;

		if ($scheme != 'PLAIN')
		{
			if (!$account->AuthenticateUserHash($this->_email, $password, '', $scheme . '|' . $challenge. '|' .$_SERVER['REMOTE_ADDR']))
				return false;
		}
		else
		{
			if ($this->_gw->getPassword() != $password)
				return false;
		}

		if ($this->_folders_new_version != $this->_folders_version)
		{
			$this->_folders_version = $this->_folders_new_version;
			$this->cache_folder_list($this->_gsid);
		}

		return true;
	}

	function login_ticket($ticket)
	{
		$this->_gw->user = 'anyone';
		$this->_gw->setPassword('*');
		$this->_gw->authscheme = '';
		$this->_gw->authchallenge = '';
		if ($this->_gw->Login())
		{
			$this->_gsid = $this->_gw->FunctionCall('OpenTicket', $this->_gw->sessid, $ticket);
			if (!$this->_gsid)
				throw new not_found_exception();
			$this->_ticket = $ticket;
			return true;
		}
		return false;
	}

	function make_ticket($group_name, $folder, $item_id, $attachment_id, $rights, $expiration)
	{
		$fsid = $this->open_folder($group_name, $folder);
		if (!$fsid)
			throw new not_found_exception();

		if ($attachment_id != null)
		{
			$params['id'] = $item_id . '/' . $attachment_id;
		}
		else
		{
			$folder_info = $this->get_folder_info($group_name, $folder);
			$object_type = $folder_info['type'];
			$id_query = $this->build_event_query($item_id);
			if ($object_type == 'C')
			{
				$list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetContactList', $fsid, $id_query, ''));
				if (!count($list))
					throw new not_found_exception();
				$params['id'] = $list[0]['ITM_ID'];
			}
			else
			{
				$list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetEventList', $fsid, $id_query, '', 'private_busy=1'));
				if (!count($list))
					throw new not_found_exception();
				$params['id'] = $list[0]['EVN_ID'];
			}
		}
		$params['rights'] = $rights;
		$params['expire'] = $expiration;
		$ticket = $this->_gw->FunctionCall('CreateTicket', $fsid, $this->_gw->CreateParamLine($params));
		if ($ticket == - 1)
			throw new forbidden_exception();
		return $ticket;
	}

	function get_ticket_info()
	{
		$info = [];
		$xml_info = text_to_xml($this->_gw->FunctionCall('OpenTicket', $this->_gw->sessid, $this->_ticket, 'info'));
		foreach ($xml_info->children() as $field)
			$info[$field->get_name()] = $xml_info->get_data($field->get_name());
		return $info;
	}

	function lock_item($group_name, $folder, $item_id, $lock_info)
	{
		if (!$this->_ticket)
		{
			$fsid = $this->open_folder($group_name, $folder);
			if (!$fsid)
				throw new not_found_exception();
		}
		else
			$fsid = $this->_gsid;
		if (!$fsid)
			throw new not_found_exception();
		$params = array('lockinfo' => $this->_gw->CreateParamLine($lock_info));
		$lock_state = $this->_gw->FunctionCall('LockItem', $fsid, $item_id, 2, $this->_gw->CreateParamLine($params));
		if ($lock_state == 0 || $lock_state == -1)
			throw new locked_exception();
	}

	function unlock_item($group_name, $folder, $item_id)
	{
		if (!$this->_ticket)
		{
			$fsid = $this->open_folder($group_name, $folder);
			if (!$fsid)
				throw new not_found_exception();
		}
		else
			$fsid = $this->_gsid;
		$this->_gw->FunctionCall('UnlockItem', $fsid, $item_id, 2, false);
	}

	function user_logged_on()
	{
		$this->_folder_info_cache = array();
		$this->_folders_new_version = $this->_gw->FunctionCall('GetFolderUpdate', $this->_gsid);
		return $this->_folders_new_version != 0;
	}

	function open_group($group_name)
	{
		if ($this->_ticket || $group_name == $this->_email)
			return $this->_gsid;

		 		 		 		$folder = $_SESSION['shared_prefix'] . $group_name;
		if (!isset($this->_fsid[$folder]))
		{
			$this->_fsid[$folder] = $this->_gw->OpenFolder($this->_gsid, $folder, true);
			$this->cache_folder_list($this->_gsid);
		}

		return $this->_gsid;
	}

	function get_group_folder_path($group_name, $folder)
	{
		$prefix = ($group_name == $this->_email) ? '' : $_SESSION['shared_prefix'] . $group_name . DAV_PATH_SEPARATOR;

		 		 		 		 		if ($folder == 'addressbook' && !isset($this->_folders[$prefix . 'addressbook']))
			$folder = $this->_contacts_folder;

		return rtrim($prefix . $folder, DAV_PATH_SEPARATOR);
	}

	function open_folder($group_name, $folder)
	{
 		if ($this->_ticket)
			return false;

		if (trim($folder)=='')
			return false;

		if (empty($group_name) && $folder == '@@GAL@@')
			return $this->_fsid[$folder] = $this->_gw->OpenFolder($this->_gsid, $folder);

		if ($folder == '@@UPLOAD@@')
			return $this->_fsid[$folder] = $this->_gw->OpenFolder($this->_gsid, $folder);

		if (!($gsid = $this->open_group($group_name)))
			return false;
 		$folder = $this->get_group_folder_path($group_name, $folder);
 		if (!$this->_fsid[$folder])
			$this->_fsid[$folder] = $this->_gw->OpenFolder($gsid, $folder);
		return $this->_fsid[$folder];
	}

	function cache_folder_list($gsid)
	{
		$tz = date_default_timezone_get();
		date_default_timezone_set('UTC');

		$this->_folders = array();
		$this->_files_folder = 'Files';
		$this->_events_folder = 'Events';
		$this->_tasks_folder = 'Tasks';
		$this->_journal_folder = 'Journal';
		$this->_notes_folder = 'Notes';
		$this->_contacts_folder = 'Contacts';

		$folders = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetFolderList', $gsid, 'FdrDisplay,FdrDesc,FdrTZ'));
		foreach ($folders as $folder)
		{
			if ($folder['FDRTYPE'] == 'M')
				continue;

			$name = $folder['FDR_ID'];
			$is_shared = $folder['FDRTYPE'] == 'P' || $folder['FDRTYPE'] == 'S' || $folder['FDRTYPE'] == 'R';

			if (($pos = strrpos($name, DAV_PATH_SEPARATOR)) !== false)
				$parent_name = substr($name, 0, $pos);
			else
				$parent_name = '';

			if ($parent_name != '')
			{
				$this->_folders[$parent_name]['subfolders'][] = $name;
				if (!$is_shared)
					$is_shared = $this->_folders[$parent_name]['shared'];
			}
			else
			{
				$this->_folders['']['subfolders'][] = $name;
			}

			 			if ($folder['FDR_DEFAULT'] == 1 && !$is_shared)
			{
				if ($folder['FDRTYPE'] == 'F')
					$this->_files_folder = $name;
				else if ($folder['FDRTYPE'] == 'E')
					$this->_events_folder = $name;
				else if ($folder['FDRTYPE'] == 'T')
					$this->_tasks_folder = $name;
				else if ($folder['FDRTYPE'] == 'C')
					$this->_contacts_folder = $name;
				else if ($folder['FDRTYPE'] == 'N')
					$this->_notes_folder = $name;
				else if ($folder['FDRTYPE'] == 'J')
					$this->_journal_folder = $name;
			}

			$this->_folders[$name] = array(
				'type' => $folder['FDRTYPE'],
				'creationdate' => date('Y-m-d\TH:i:s', intval($folder['FDR_CREATED'])) . 'Z',
				'displayname' => empty($folder['FDRDISPLAY'])?null:$folder['FDRDISPLAY'],
				'displayprefix' => null,
				'description' => empty($folder['FDRDESCISNULL'])?null:$folder['FDRDESC'],
				'timezone' => empty($folder['FDRTZISNULL'])?null:$folder['FDRTZ'],
				'shared' => $is_shared,
				'subfolders' => is_array($this->_folders[$name])?$this->_folders[$name]['subfolders']:null,
				'owner' => empty($folder['GRPOWNER'])?$this->_email:$folder['GRPOWNER'],
				'id' => $folder['GRPRELATIVEFOLDER'],
				'subtype' => $folder['FDRSUBTYPE']);
		}

		date_default_timezone_set($tz);
	}

	function build_item_query($local_id)
	{
		$quoted_id = str_replace("'", "''", $local_id);
		$id_query = "((ItmRID IS NULL AND ITM_ID='$quoted_id') OR ItmRID='$quoted_id')";
		return $id_query;
	}

	function build_event_query($local_id)
	{
		$quoted_id = str_replace("'", "''", $local_id);
		$id_query = "(EvnClass<>'O' AND ((EvnRID IS NULL AND EVN_ID='$quoted_id') OR EvnRID='$quoted_id'))";
		return $id_query;
	}

	function expand_lock_info($lockinfo)
	{
		$result = array();
		foreach (explode("&", $lockinfo) as $chunk)
		{
			if (!empty($chunk))
			{
				$param = explode("=", $chunk);
				$result[rawurldecode($param[0])] = rawurldecode($param[1]);
			}
		}
		return $result;
	}

	function get_attachment($group_name, $folder, $item_id, $attachment_id, $zip = false)
	{
		$result = [];
		if (!$this->_ticket)
		{
			$fsid = $this->open_folder($group_name, $folder);
			if (!$fsid)
				throw new not_found_exception();
		}
		else
			$fsid = $this->_gsid;

		$item_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetItemInfo', $fsid, $item_id));
		if (!isset($item_info[0]))
			throw new not_found_exception();

		$attachment_list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetAttachmentList', $fsid, $item_id, $attachment_id));
		if (!$zip)
			$path = $this->_gw->FunctionCall('GetAttachmentPath', $fsid, $item_id, $attachment_id);
		else
			$path = $this->_gw->FunctionCall('GetAttachmentPath', $fsid, 'TICKET');
		$item = @fopen('iw.file://' . $path, 'rb');
		if (!$item)
			throw new not_found_exception();
		$parameters = explode('&', $attachment_list[0]["ATTPARAMS"]);
		foreach ($parameters as $parameter)
		{
			if (substr_compare($parameter, 'mimetype=', 0, 9, true) == 0)
				$result['type'] = rawurldecode(substr($parameter, 9));
			if (!$result['type'])
				$result['type'] = 'application/octet-stream';
		}

		if (isset($item_info[0]['EVN_ID']) && isset($item_info[0]['EVN_EDITCOUNTER']))
			$result['etag'] = '"' . $item_info[0]['EVN_ID'] . ':' . $item_info[0]['EVN_EDITCOUNTER'] . '"';
		else if (isset($item_info[0]['ITM_ID']) && isset($item_info[0]['ITM_EDITCOUNTER']))
			$result['etag'] = '"' . $item_info[0]['ITM_ID'] . ':' . $item_info[0]['ITM_EDITCOUNTER'] . '"';
		else
			$result['etag'] = null;

		if (isset($item_info[0]['EVN_CREATED']))
			$result['creationdate'] = date('Y-m-d\TH:i:s', $item_info[0]['EVN_CREATED']) . 'Z';
		else if (isset($item_info[0]['ITM_CREATED']))
			$result['creationdate'] = date('Y-m-d\TH:i:s', $item_info[0]['ITM_CREATED']) . 'Z';

		if (isset($item_info[0]['EVN_MODIFIED']))
			$result['lastmodified'] = date(DATE_RFC1123, $item['EVN_MODIFIED']);
		else if (isset($item_info[0]['ITM_MODIFIED']))
			$result['lastmodified'] = date(DATE_RFC1123, $item['ITM_MODIFIED']);

		if ($item_info[0]['EVNCLASS'] == 'F')
			$result['size'] = intval($item_info[0]['EVNCOMPLETE']);

		$result['title'] = $attachment_list[0]['ATTDESC'];
		$result['data'] = $item;
		$result['datapath'] = $path;

		$result['lockinfo'] = $this->expand_lock_info(isset($item_info[0]['EVNLOCKINFO']) ? $item_info[0]['EVNLOCKINFO'] : $item_info[0]['ITMLOCKINFO']);
		$result['lockhash'] = isset($item_info[0]['EVNLOCKHASH']) ? $item_info[0]['EVNLOCKHASH'] : $item_info[0]['ITMLOCKHASH'];
		return $result;
	}

	function put_attachment($group_name, $folder, $item_id, $attachment_id, $stream)
	{  	
		$rights = $this->rights_to_string($this->_gw->FunctionCall('GetGroupAccessRights', $this->_gsid, $folder));
		if (strpos($rights, 'i') === false || strpos($rights, 'w') === false)
			throw new forbidden_exception();
			
		if (!$this->_ticket)
		{
			$fsid = $this->open_folder($group_name, $folder);
			if (!$fsid)
				throw new not_found_exception();
		}
		else
			$fsid = $this->_gsid;
			
		$item_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetItemInfo', $fsid, $item_id));
		if (!isset($item_info[0]))
			throw new not_found_exception();

		$attachment_list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetAttachmentList', $fsid, $item_id, $attachment_id));
		
		$time = time();
		$attachment['AttName'] = $attachment_id;
		$attachment['AttType'] = 'F';
		$attachment['AttTime'] = $time;
		if (!$this->_gw->FunctionCall('AddAttachment', $fsid, $item_id, $this->_gw->CreateParamLine($attachment)."&AttSkipValue=1", ''))
			throw new locked_exception();

		$path = $this->_gw->FunctionCall('GetAttachmentPath', $fsid, $item_id, $attachment_id, "LOCK");
		if (!$path)
			throw new locked_exception();
		$dest_stream = @fopen('iw.file://' . $path, 'wb');
		if (!$dest_stream)
			throw new forbidden_exception();
		stream_copy_to_stream($stream, $dest_stream);
		$size = ftell($dest_stream);
		fclose($dest_stream);
		$result = $this->_gw->FunctionCall('GetAttachmentPath', $fsid, $item_id, $attachment_id, "UNLOCK");
		if (!$result)
			throw new forbidden_exception();

		$event['EvnComplete'] = empty($size) ? 0 : $size;
		$event['EvnStartDate'] = unixtojd($time);
		$event['EvnStartTime'] = ($time / 60) % 3600;
		$event['EvnComplete'] = $size;
		$result = $this->_gw->FunctionCall('AddEventInfo', $fsid, $this->_gw->CreateParamLine($event), $item_id);
		if (!$result)
			throw new forbidden_exception();

		$result = $this->_gw->FunctionCall('AddEventInfo', $fsid, "", $item_id);
		if (!$result)
			throw new forbidden_exception();

		if (isset($item_info[0]['EVN_ID']) && isset($item_info[0]['EVN_EDITCOUNTER']))
			return '"' . $item_info[0]['EVN_ID'] . ':' . (++$item_info[0]['EVN_EDITCOUNTER']) . '"';
		else if (isset($item_info[0]['ITM_ID']) && isset($item_info[0]['ITM_EDITCOUNTER']))
			return '"' . $item_info[0]['ITM_ID'] . ':' . (++$item_info[0]['ITM_EDITCOUNTER']) . '"';
		else
			return null;
	}

	function get_file_info($group_name, $folder, $raw_item_id)
	{
		$content_type = null;
		if ($this->_ticket)
		{
			$fsid = $this->_gsid;
			$folder_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetFolderInfo', $fsid));
			$object_type = $folder_info[0]['FDRTYPE'];
		}
		else
		{
			$fsid = $this->open_folder($group_name, $folder);
			$folder_info = $this->get_folder_info($group_name, $folder);
			$object_type = $folder_info['type'];
		}

		if ($object_type != 'F')
			throw new forbidden_exception();
		if (!$fsid)
			throw new not_found_exception();

		$attachment_list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetAttachmentList', $fsid, $raw_item_id, ''));
		if (count($attachment_list) == 0)
			throw new not_found_exception();

		$parameters = explode('&', $attachment_list[0]["ATTPARAMS"]);
		foreach ($parameters as $parameter)
		if (substr_compare($parameter, 'mimetype=', 0, 9, true) == 0)
			$content_type = rawurldecode(substr($parameter, 9));
		if (!$content_type)
			$content_type = 'application/octet-stream';

		$result['type'] = $content_type;

		return $result;
	}

	function get_item($group_name, $folder, $raw_item_id, $calendar_data = null)
	{
		$filter = $content_type = $item = null;
		if ($this->_ticket)
		{
			$fsid = $this->_gsid;
			$folder_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetFolderInfo', $fsid));
			$object_type = $folder_info[0]['FDRTYPE'];
		}
		else
		{
			$fsid = $this->open_folder($group_name, $folder);
			$folder_info = $this->get_folder_info($group_name, $folder);
			$object_type = $folder_info['type'];
		}

		if (!$fsid)
			throw new not_found_exception();

		switch ($object_type)
		{
			case 'C':
				if (isset($calendar_data))
					$filter = ";FILTER=+" . implode(',', $calendar_data);
				else
					$filter = ";FILTER=X-SERVER-UID"; 
				$item = $this->_gw->FunctionCall('GetvCard', $fsid, $raw_item_id, $filter . ';VERSION=3.0');
				if (empty($item) && $this->_gw->FunctionCall('GetLastError', $fsid) == 4)
					throw new not_found_exception();
				break;

			case 'E':
			case 'J':
			case 'N':
			case 'T':
				if (isset($calendar_data))
				{
					if ($calendar_data['filter'][$object_type])
						$filter = ";FILTER=+" . implode(',', $calendar_data['filter'][$object_type]);
					if ($calendar_data['expand'])
					{
						$interval = $this->time_range_to_julian($calendar_data['expand']);
						$item = $this->_gw->FunctionCall('GetVCalendars', $fsid, $interval, "EVN_ID='" . str_replace("'", "''", $raw_item_id) . "'", "EXPAND" . $filter);
					}
					else if ($calendar_data['limit'])
					{
						$interval = $this->time_range_to_julian($calendar_data['limit']);
						$item = $this->_gw->FunctionCall('GetVCalendars', $fsid, $interval, "EVN_ID='" . str_replace("'", "''", $raw_item_id) . "'", $filter);
					}
					else
						$item = $this->_gw->FunctionCall('GetvCalendar', $fsid, $raw_item_id, $filter);
				}
				else
					$item = $this->_gw->FunctionCall('GetvCalendar', $fsid, $raw_item_id, null);
				if (empty($item) && $this->_gw->FunctionCall('GetLastError', $fsid) == 4)
					throw new not_found_exception();
				break;

			case 'F':
				$attachment_list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetAttachmentList', $fsid, $raw_item_id, ''));
				if (count($attachment_list)) {
					$path = $this->_gw->FunctionCall('GetAttachmentPath', $fsid, $raw_item_id, $attachment_list[0]['ATTNAME']);
					$item = @fopen('iw.file://' . $path, "rb");
					if (!$item) throw new not_found_exception();
				} else{
					throw new not_found_exception();
				}
				break;
		}

		return $item;
	}

	function text_filter_to_query($filter_component, $name)
	{
		if ($filter_component)
		{
			if ($filter_component['negate'])
				$prefix = 'NOT ';
			else
				$prefix = '';
			if ($filter_component['type'] == 'null')
				return $prefix . "$name == ''";
			else if ($filter_component['type'] == 'ends-with')
				return $prefix . "$name LIKE '%" . str_replace("'", "''", $filter_component['text']) . "'";
			else if ($filter_component['type'] == 'starts-with')
				return $prefix . "$name LIKE '" . str_replace("'", "''", $filter_component['text']) . "%'";
			else if ($filter_component['type'] == 'equals')
				return $prefix . "$name =='" . str_replace("'", "''", $filter_component['text']) . "'";
			else if ($filter_component['type'] == 'contains')
				return $prefix . "$name LIKE '%" . str_replace("'", "''", $filter_component['text']) . "%'";
		}
		return false;
	}

	function time_range_to_julian($time_range)
	{
		 		$start = $time_range['start'];
		 		if (empty($start))
			$jd_start = '0';
		else
			$jd_start = (gregoriantojd(substr($start, 4, 2), substr($start, 6, 2), substr($start, 0, 4)) +
				(((substr($start, 9, 2) * 3600) + (substr($start, 11, 2) * 60) + substr($start, 13, 2)) / 86400));
		$end = $time_range['end'];
		 		 		 		if (empty($end))
			$jd_end = unixtojd(time() + 365 * 24 * 60 * 60);
		else
			$jd_end = (gregoriantojd(substr($end, 4, 2), substr($end, 6, 2), substr($end, 0, 4)) +
				(((substr($end, 9, 2) * 3600) + (substr($end, 11, 2) * 60) + substr($end, 13, 2)) / 86400));

		return $jd_start . '-' . $jd_end . ';Z';
	}

	 
	function get_item_info($group_name, $folder, $local_id = null, $filter = null)
	{
		$result = $custom_queries = [];
		if ($this->_ticket != null)
		{
			$folder_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetFolderInfo', $this->_gsid));
			return array($local_id => array(
					'id' => $local_id,
					'title' => $local_id, 
					'type' => $folder_info[0]['FDRTYPE']
				));
		}
		
		$folder_info = $this->get_folder_info($group_name, $folder);
		$object_type = $folder_info['type'];
		if (!($fsid = $this->open_folder($group_name, $folder)))
			return false;

		$tz = date_default_timezone_get();
		date_default_timezone_set('UTC');

		if ($object_type == 'C')
		{		
			$use_detail_api = false;
			if ($filter)
			{
				$operator = $filter['test'] == 'anyof' ? ' OR ' : ' AND ';
				$custom_query = array();
				if ($filter['uid'])
				{
					$custom_query[] =
						"((ItmUID IS NULL AND " . $this->text_filter_to_query($filter['uid'], 'ITM_ID') .
						") OR (" . $this->text_filter_to_query($filter['uid'], 'ItmUID') . "))";
				}
				if ($filter['email'])
				{
					$use_detail_api = true;
					$custom_query[] =
						"(" . $this->text_filter_to_query($filter['email'], 'LctEmail1') . " OR " .
						$this->text_filter_to_query($filter['email'], 'LctEmail2') . " OR " .
						$this->text_filter_to_query($filter['email'], 'LctEmail3') . ")";
				}
				$custom_query[] = $this->text_filter_to_query($filter['first-name'], 'ItmFirstName');
				$custom_query[] = $this->text_filter_to_query($filter['last-name'], 'ItmSurname');
				$custom_query[] = $this->text_filter_to_query($filter['fn'], 'ItmClassifyAs');
				$custom_query[] = $this->text_filter_to_query($filter['note'], 'ItmDescription');
				$custom_query[] = $this->text_filter_to_query($filter['nickname'], 'ItmNickName');
				$custom_query = array_filter($custom_query);
				if (count($custom_query) == 0)
					$query = '1=1';
				else
					$query = '(' . implode($operator, $custom_query) . ')';
			}
			else
			{
				$query = '1=1';
			}

			if (isset($local_id))
				$query = $this->build_item_query($local_id) . ' AND ' . $query;

			$field_list = 'Itm_EditCounter,ItmClassifyAs,ItmRID,Itm_Created,Itm_Modified,ItmUID,ItmLockInfo,ItmLockHash';
			if (empty($group_name) && $folder == '@@GAL@@')
			{
				$use_detail_api = true;
				$field_list .= ',LctEmail1';
			}
			
			if ($use_detail_api)
				$query .= " AND (LCTTYPE IS NULL OR (ITMCLASS='C' AND LCTTYPE='H') OR (ITMCLASS='L' AND LCTTYPE='O'))";

			$result_line = $this->_gw->FunctionCall($use_detail_api ? 'GetContactDetailList' : 'GetContactList', $fsid, $query, $field_list);
			foreach ($this->_gw->ParseParamLine($result_line) as $item)
			{
				$key = $item['ITMRID']?$item['ITMRID']:$item['ITM_ID'];

				 				if (isset($result[$key]))
					continue;
				$result[$key]['id'] = $item['ITM_ID'];
				$result[$key]['etag'] = $item['ITM_ID'] . ':' . $item['ITM_EDITCOUNTER'];
				$result[$key]['title'] = $item['ITMCLASSIFYAS'];
				$result[$key]['type'] = $object_type;
				$result[$key]['creationdate'] = date('Y-m-d\TH:i:s', $item['ITM_CREATED']) . 'Z';
				$result[$key]['lastmodified'] = date(DATE_RFC1123, $item['ITM_MODIFIED']);
				$result[$key]['uid'] = $item['ITMUID']?$item['ITMUID']:$item['ITM_ID'];
				$result[$key]['lockinfo'] = $this->expand_lock_info($item['ITMLOCKINFO']);
				$result[$key]['lockhash'] = $item['ITMLOCKHASH'];
				if (isset($item['LCTEMAIL1']))
					$result[$key]['email'] = $item['LCTEMAIL1'];
			}
		}
		else if ($object_type != '-' && $object_type != 'S' && $object_type != 'P')
		{
			if ($filter)
			{
				$custom_query = array();
				foreach ($filter as $component => $comp_filter)
				{
					if ($component != 'time-range' && $component != 'timezone')
					{
						if (!$filter['time-range'])	 						{
							if ($component=='E')
								$custom_query[] = "(EvnClass='E' OR EvnClass='V')";
							else
								$custom_query[] = "(EvnClass='$component')";
						}

						if ($comp_filter['uid'])
						{
							$custom_query[] =
								"((EvnUID IS NULL AND " . $this->text_filter_to_query($comp_filter['uid'], 'EVN_ID') .
								") OR (" . $this->text_filter_to_query($comp_filter['uid'], 'EvnUID') . "))";
						}

						$custom_query[] = $this->text_filter_to_query($comp_filter['summary'], 'EvnTitle');
						$custom_query[] = $this->text_filter_to_query($comp_filter['description'], 'EvnNote');
						$custom_query[] = $this->text_filter_to_query($comp_filter['location'], 'EvnLocation');
						if (count($custom_query) > 0)
							$custom_queries[] = '(' . implode(' AND ', array_filter($custom_query)) . ')';

						if (!$filter['time-range'] && $component == 'E')	 						{
							$custom_queries[] =
								"(EVNRCR_ID IN (SELECT EVNRCR_ID FROM Event WHERE (EvnClass='O' AND (" .
								implode(' OR ', $custom_queries) . '))))';
						}
					}
				}

				if (count($custom_queries) > 0)
					$query = "(" . implode(' OR ', $custom_queries) . ')';
				else
					$query = '';

				if (!$filter['time-range'])	 					$query .= " AND EvnClass<>'O'";
			}
			else
			{
				$query = "EvnClass<>'O'";
			}

			if (isset($local_id))
			{
				if (strlen($query) > 0)
					$query = ' AND ' . $query;

				$query = $this->build_event_query($local_id) . $query;
			}

			if ($filter != null && $filter['time-range'])
			{
				if ($filter['timezone'])
					$tz = $filter['timezone'];
				else if ($folder_info['timezone'])
					$tz = $folder_info['timezone'];

				if ($tz)
				{
					$begin = strpos($tz, 'BEGIN:VTIMEZONE');
					$end = strrpos($tz, 'END:VTIMEZONE', $begin);;
					$tz = ';' . rawurlencode(substr($tz, $begin, $end - $begin + 13)) . ';;;freebusy=1';
				}
				else
				{
					$tz = ';;;;freebusy=1';
				}

				if ($query=='(())')
				{
					$query = '';
					do_log('WARNING: get_item_info still has invalid query!!!', 2);
				}

				$result_line = $this->_gw->FunctionCall('GetIntervalEvents', $fsid, $this->time_range_to_julian($filter['time-range']) . $tz, $query, 'Evn_EditCounter,EvnTitle,EvnClass,EvnRID,EvnComplete,EvnTimeFormat,EvnStartDate,EvnStartTime,EvnEndDate,EvnEndTime,EvnUID');
			}
			else
				$result_line = $this->_gw->FunctionCall('GetEventList', $fsid, $query, 'Evn_EditCounter,EvnTitle,EvnClass,EvnRID,EvnComplete,Evn_Created,Evn_Modified,EvnUID,EvnLockInfo,EvnLockHash', 'private_busy=1');

			foreach ($this->_gw->ParseParamLine($result_line) as $item)
			{
				$key = $item['EVNRID']?$item['EVNRID']:$item['EVN_ID'];
				if (!isset($result[$key]))
				{
					$result[$key]['id'] = $item['EVN_ID'];
					$result[$key]['etag'] = $item['EVN_ID'] . ':' . $item['EVN_EDITCOUNTER'];
					$result[$key]['title'] = $item['EVNTITLE'];
					$result[$key]['type'] = ($item['EVNCLASS'] == 'V' ? 'E': $item['EVNCLASS']);
					$result[$key]['creationdate'] = date('Y-m-d\TH:i:s', $item['EVN_CREATED']) . 'Z';
					$result[$key]['lastmodified'] = date(DATE_RFC1123, $item['EVN_MODIFIED']);
					$result[$key]['uid'] = $item['EVNUID']?$item['EVNUID']:$item['EVN_ID'];
					$result[$key]['lockinfo'] = $this->expand_lock_info($item['EVNLOCKINFO']);
					$result[$key]['lockhash'] = $item['EVNLOCKHASH'];
					$result[$key]['allids'] = array($item['EVN_ID']);
					if ($item['EVNCLASS'] == 'F')
					{
						$result[$key]['size'] = intval($item['EVNCOMPLETE']);

						 						$attributes_line = $this->_gw->FunctionCall('GetItemAttributes', $fsid, $item['EVN_ID'],"AtrParam='X_ICEWARP_FILEHASH'");
						$attributes = $this->_gw->ParseParamLine($attributes_line);
						if (count($attributes))
							$result[$key]['filehash'] = $attributes[0]['DATAVALUE'];

						 						$attachments_line = $this->_gw->FunctionCall('GetAttachmentList', $fsid, $item['EVN_ID']);
                        $attachments = $this->_gw->ParseParamLine($attachments_line);
                        if (count($attachments))
                            $result[$key]['filepublicurl'] = $this->_gw->FunctionCall('GetAttachmentPathLocal', $fsid, $item['EVN_ID'], $attachments[0]['ATTNAME'], 'TICKET');
					}
				}
				else
				{
					array_push($result[$key]['allids'],$item['EVN_ID']);
				}
			}
		}

		date_default_timezone_set($tz);

		return $result;
	}

	function add_file_hash($group_name, $folder, $item_id, $file_hash)
	{
		$folder_info = $this->get_folder_info($group_name, $folder);
		if ($folder_info['type'] != 'F')
			return false;

		if (!($fsid = $this->open_folder($group_name, $folder)))
			return false;

		 		$attributes_line = $this->_gw->FunctionCall('GetItemAttributes', $fsid, $item_id,"AtrParam='X_ICEWARP_FILEHASH'");
		$attributes = $this->_gw->ParseParamLine($attributes_line);
		foreach ($attributes as $attribute)
			$this->_gw->FunctionCall('DeleteItemAttribute', $fsid, $item_id, $attribute['ATR_ID']);

		 		if (strlen($file_hash)>0)
			$this->_gw->FunctionCall('AddItemAttribute', $fsid, $item_id, $file_hash, 'AtrType=x&AtrParam=X_ICEWARP_FILEHASH');

		return true;
	}

	 
	function make_collection($group_name, $folder, $item_id, $folder_info)
	{
		$gsid = $this->open_group($group_name);
		$full_path = $this->get_group_folder_path($group_name, $folder);

		$params = array();
		if (isset($folder_info['displayname']))
			$params['FdrDisplay'] = $folder_info['displayname'];
		if (isset($folder_info['description']))
			$params['FdrDesc'] = $folder_info['description'];
		if (isset($folder_info['timezone']))
			$params['FdrTZ'] = $folder_info['timezone'];

		$result = $this->_gw->FunctionCall('AddFolder', $gsid, trim($full_path . DAV_PATH_SEPARATOR . $item_id, DAV_PATH_SEPARATOR), $folder_info['type'], $this->_gw->CreateParamLine($params));
		if (!$result)
		{
			if ($this->_gw->FunctionCall('GetLastError', $gsid) == 3)
				throw new forbidden_precondition_exception('DAV:', 'bind');
			throw new forbidden_exception();
		}

		$this->cache_folder_list($gsid);
	}

	 
	function modify_collection($group_name, $folder, $folder_info)
	{
		try
		{
			$this->make_collection($group_name, $folder, '', $folder_info);
		}
		catch (forbidden_exception $e)
		{
			throw new forbidden_precondition_exception('DAV:', 'write-properties');
		}
	}

	 
	function get_folder_info($group_name, $folder)
	{
		if (trim($folder)!=='')
		{
			if (empty($group_name) && $folder == '@@GAL@@')
				return array('type' => 'C');

			if ($folder == '@@UPLOAD@@')
				return array('type' => 'F');

			$gsid = $this->open_group($group_name);
			$folder_info = $this->_folders[$this->get_group_folder_path($group_name, $folder)];
			return (!$folder_info) ? false : $folder_info;
		}
		else
		{
			$result['type'] = '-';
			return $result;
		}
	}

	function get_folder_last_modified($group_name, $folder, &$tag)
	{
		$folder_info = $this->get_folder_info($group_name, $folder);
		if ($folder_info['type'] == 'C')
			$line = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetContactLastModified', $this->open_folder($group_name, $folder)));
		else if ($folder_info['type'] != '-' && $folder_info['type'] != 'S' && $folder_info['type'] != 'P' && $folder_info['type'] != 'R')
			$line = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetEventLastModified', $this->open_folder($group_name, $folder), '', 'private_busy=1'));
		else
			$line = array('0' => array('MAX_' => '0', 'COUNT_' => '0'));
		$tag = '"' . intval($line[0]['MAX_']) . ':' . intval($line[0]['COUNT_']) . '"';
		$tz = date_default_timezone_get();
		date_default_timezone_set('UTC');
		$result = date(DATE_RFC1123, intval($line[0]['MAX_']));
		date_default_timezone_set($tz);
		return $result;
	}

	function rights_to_string($rights)
	{
		if (!($rights &0x80000000))
		{
			switch ($rights)
			{
				case 2:  					return 'iatwlrkx';
				case 1:  					return 'itwlr';
				case 4:  					return 'iwlr';
				case 3:  					return 'ilr';
				case 0:  					return 'lr';
			}
		}
		else
		{
			$symbolic_rights = '';
			if ($rights &2)  				$symbolic_rights .= 'i';
			if ($rights &4)  				$symbolic_rights .= 'a';
			if ($rights &8)  				$symbolic_rights .= 't';
			if ($rights &16)  				$symbolic_rights .= 'w';
			if ($rights &32)  				$symbolic_rights .= 'l';
			if ($rights &64)  				$symbolic_rights .= 'r';
			if ($rights &128)  				$symbolic_rights .= 'k';
			if ($rights &256)  				$symbolic_rights .= 'x';
			return $symbolic_rights;
		}
	}

	function string_to_rights($symbolic_rights)
	{
		$rights = 0x80000000;
		foreach (str_split($symbolic_rights) as $symbolic_right)
		{
			switch ($symbolic_right)
			{
				case 'i': $rights |= 2;
					break;
				case 'a': $rights |= 4;
					break;
				case 't': $rights |= 8;
					break;
				case 'w': $rights |= 16;
					break;
				case 'l': $rights |= 32;
					break;
				case 'r': $rights |= 64;
					break;
				case 'k': $rights |= 128;
					break;
				case 'x': $rights |= 256;
					break;
			}
		}
		return $rights;
	}

	 
	function get_folder_rights($group_name, $folder)
	{
		$result = [];
		$full_name = $this->get_group_folder_path($group_name, $folder);		
		$result_line = $this->_gw->FunctionCall('GetFolderRightList', $this->open_group($group_name), $full_name);
		$found_owner = false;
		foreach ($this->_gw->ParseParamLine($result_line) as $ace)
		{
			$principal = $ace['FRTEMAIL'];
			$rights = intval($ace['FRTRIGHT']);
			if (($rights & 0x80000001) == 0x80000001)  			{
				$result[$principal]['owner'] = true;
				$found_owner = true;
			}
			$result[$principal]['rights'] = $this->rights_to_string($rights);
			if ($ace['FRT_FOLDER'] != $full_name)
				$result[$principal]['inherited'] = $ace['FRT_FOLDER'];
		}

		if (!$found_owner)
		{
			$fsid = (trim($full_name) == '') ? $this->open_group($group_name) : $this->open_folder($group_name, $full_name);
			if ($fsid)
			{
				$owner = $this->_gw->FunctionCall('GetGroupOwnerEmail', $fsid, true);
				$result[$owner]['rights'] = 'iatwlrkx';
				$result[$owner]['owner'] = true;
			}
		}

		if (!isset($result[$this->_email]))
		{
			$result[$this->_email]['owner'] = false;
			$rights = $this->_gw->FunctionCall('GetGroupAccessRights', $this->_gsid, $full_name);
			$result[$this->_email]['rights'] = $this->rights_to_string($rights);		
		}

		return $result;
	}

	 
	function set_folder_rights($group_name, $folder, $folder_rights)
	{
		$groups = [];
		$full_name = $this->get_group_folder_path($group_name, $folder);
		$group_id = $this->open_group($group_name);
		$result_line = $this->_gw->FunctionCall('GetFolderRightList', $group_id, $full_name);
		foreach ($this->_gw->ParseParamLine($result_line) as $ace)
		{
			if ($ace['FRTRIGHTS'] != 5)  				$groups[$ace['FRTEMAIL']] = 1;
		}
		 		foreach ($folder_rights as $group => $rights)
		{
			unset($groups[$group]);
			if (!$this->_gw->FunctionCall('AddFolderRight', $group_id, $full_name, $group, $this->string_to_rights($rights)))
				throw new forbidden_exception();
		}
		 		foreach ($groups as $group => $dummy)
		{
			if (!$this->_gw->FunctionCall('DeleteFolderRight', $group_id, $full_name, $group))
				throw new forbidden_exception();
		}
	}

	 
	function get_subfolders($group_name, $folder)
	{
		$result = array();
		if ($group_name != $this->_email)
		{
			$gsid = $this->open_group($group_name);
			$full_name = $this->get_group_folder_path($group_name, $folder);
			$prefix = $this->get_group_folder_path($group_name, '') . DAV_PATH_SEPARATOR;
			foreach ($this->_folders[$full_name]['subfolders'] as $subfolder)
				$result[] = substr($subfolder, strlen($prefix));
		}
		else
		{
			$base_path = (trim($folder) == '') ? '' : $folder . DAV_PATH_SEPARATOR;
			foreach ($this->_folders[$folder]['subfolders'] as $subfolder)
			{
				$type = $this->_folders[$base_path . $subfolder]['type'];
				if ($type != 'S')
					$result[] = $subfolder;
			}
		}
		return $result;
	}

	 
	function get_groups($only_subscribed = true)
	{
		if ($only_subscribed)
			$group_flags = 1 | 8 | 16;
		else
			$group_flags = 1 | 2 | 8 | 32;
		$groups = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetShareAccountList', $this->_gsid, $group_flags));
		foreach($groups as $group)
  		$result[$group['FRTEMAIL']] = array('displayname' => $group['OWNERNAME'], 'email' => $group['FRTEMAIL']);
		$result[$this->_email] = $this->get_group_info($this->_email);
		return $result;
	}

	 
	function get_group_info($email, $extended_info = false)
	{
		$account = new IceWarpAccount();
		$type = $group_member_set = null;
		$full_aliases = $full_groups = [];
		if ($email[0] == '[')
		{
			 			if (strpos($email, '@') !== false)
				$email = substr($email, 1, strlen($email) - 2);
			else  				return array('displayname' => $email, 'email' => $email);			
		}
			
		if ($account->Open($email))
		{
			$domain = $account->Domain;
			$aliases = explode(';', $account->GetProperty('u_emailalias'));
			foreach ($aliases as $alias)
			{
				$full_alias = $alias . '@' . $domain;
				if ($full_alias != $account->EmailAddress)
					$full_aliases[] = $full_alias;
			}

			if ($account->GetProperty('u_type') == 7)			
				$type = 'group';
			
			if ($extended_info)
			{
				foreach (array_filter(explode(";\r\n", $account->GetUserGroups($account->EmailAddress))) as $group)
		 			$full_groups[] = '[' . $group . ']';
		 		if ($account->GetProperty('u_type') == 7)  				{
		 			$list_file = @fopen($_SESSION["config_path"] . $account->GetProperty('g_listfile'), 'r');
	 		 		if ($list_file !== false)
					{
			 			$group_member_set = array();
						while (!feof($list_file))
							if (($group_member = trim(fgets($list_file))) != '')
	 							$group_member_set[] = $group_member;						 
						fclose($list_file);
		 			}
				}
			}
						 
			return array(
				'type' => $type,
				'displayname' => $account->GetProperty('u_name'),
				'email' => $account->EmailAddress,				
				'aliases' => $full_aliases,
				'group-membership' => $full_groups,
				'group-member-set' => $group_member_set);
		}
		
		return false;
	}

	function get_free_busy($group_name, $folder, $time_range)
	{
		$folder_info = $this->get_folder_info($group_name, $folder);
		$tz = null;
		if ($folder_info['timezone'])
		{
			$tz = $folder_info['timezone'];
			$begin = strpos($tz, 'BEGIN:VTIMEZONE');
			$end = strrpos($tz, 'END:VTIMEZONE', $begin);;
			$tz = ';' . rawurlencode(substr($tz, $begin, $end - $begin + 13));
		}
		$folder_id = $this->open_folder($group_name, $folder);
		return $this->_gw->FunctionCall('GetGroupVFreeBusy', $folder_id, $this->time_range_to_julian($time_range) . $tz, null);
	}

		function endsWith($haystack, $needle)
		{
			return $needle === "" || substr($haystack, -strlen($needle)) === $needle;
		}

		function is_outlook_calendar_publishing($id)
		{
			return $this->endsWith($id,'Calendar.ics');
		}

	function put_item($group_name, $folder, $item_id, $stream)
	{
		$add_info = $id_name = null;
		$list = [];
		$edit_counter = 0;
		$fsid = $this->open_folder($group_name, $folder);
		$folder_info = $this->get_folder_info($group_name, $folder);
		$object_type = $folder_info['type'];
		if (!$fsid)
			throw new not_found_exception();

		$pos = strpos($_SERVER['CONTENT_TYPE'], ';');
		$content_type = $pos !== false ? substr($_SERVER['CONTENT_TYPE'], 0, $pos) : $_SERVER['CONTENT_TYPE'];

		switch ($object_type)
		{
			case 'C':
				$list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetContactList', $fsid, $this->build_item_query($item_id), 'Itm_EditCounter'));
				if (count($list) > 0)
				{
					$raw_item_id = $list[0]['ITM_ID'];
					$edit_counter = ++$list[0]['ITM_EDITCOUNTER'];
				}
				else
				{
					$raw_item_id = null;
					$edit_counter = 0;
				}

				$add_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('AddvCard', $fsid, stream_get_contents($stream), $raw_item_id, ';SETUID;EXRESULT;PARAMS=ItmRID=' . rawurlencode($item_id)));
				$id_name = 'ITM_ID';
				break;

			case 'E':
			case 'J':
			case 'N':
			case 'T':
				 				if (!empty($content_type))
				{
					if ($object_type != 'N' && $content_type != "text/calendar")
						throw new precondition_failed_exception('urn:ietf:params:xml:ns:caldav', 'supported-calendar-data');
					if ($object_type == 'N' && $content_type != "text/x-vnote")
						throw new precondition_failed_exception('urn:ietf:params:xml:ns:caldav', 'supported-calendar-data');
				}

				$list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetEventList', $fsid, $this->build_event_query($item_id), 'Evn_EditCounter', 'private_busy=1'));
				if (count($list) > 0)
				{
					$raw_item_id = $list[0]['EVN_ID'];
					$edit_counter = ++$list[0]['EVN_EDITCOUNTER'];

					 					if($this->is_outlook_calendar_publishing($item_id))
					{
						 						for($i=0;$i<count($list);$i++)
							$this->_gw->FunctionCall('DeleteEvent', $fsid, $list[$i]['EVN_ID']);

						$raw_item_id = null;
					}
				}
				else
				{
					$raw_item_id = null;
					$edit_counter = 0;
				}

				$id_name = 'EVN_ID';

				if ($object_type == 'N' || $object_type == 'J' || $_SERVER['HTTP_SCHEDULE_REPLY'] == 'F')
					$add_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('AddvCalendar', $fsid, stream_get_contents($stream), $raw_item_id, ';SETUID;EXRESULT;PARAMS=EvnRID=' . rawurlencode($item_id)));
				else
					$add_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('ProcessvCalendar', $fsid, $raw_item_id, stream_get_contents($stream), 'rfc6638=&action=edit&versitparams=' . rawurlencode(';EXRESULT;PARAMS=EvnRID=' . $item_id)));

				if (!$add_info || count($add_info) == 0 || !$add_info[0][$id_name])
				{
					if ($this->_gw->FunctionCall('GetLastError', $fsid) == E_NO_VEVENT)
						$add_info = array(array("EVN_ID" => "deadbeef", "ItemModified" => (count($list) > 0 ? 1: 0)));
				}
				else
				{
					$list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetEventList', $fsid, $this->build_event_query($item_id), 'Evn_EditCounter', 'private_busy=1'));
					if (count($list) > 0)
						$edit_counter = $list[0]['EVN_EDITCOUNTER'];
				}

				break;

			case 'F':
				$list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetEventList', $fsid, $this->build_event_query($item_id), 'Evn_EditCounter', 'private_busy=1'));

				$size = $_SERVER["CONTENT_LENGTH"];
				$time = time();
				$event['EvnRID'] = $item_id;
				$event['EvnTitle'] = $item_id;
				$event['EvnLocation'] = $item_id;
				$event['EvnComplete'] = empty($size) ? 0 : $size;
				$event['EvnStartDate'] = unixtojd($time);
				$event['EvnStartTime'] = ($time / 60) % 3600;
				$event['EvnClass'] = 'F';
				$event['EvnShareType'] = 'U';

				$event_id = $this->_gw->FunctionCall('AddEventInfo', $fsid, $this->_gw->CreateParamLine($event), count($list) ? $list[0]['EVN_ID'] : null);
				if ($event_id)
				{
					if (count($list))
					{
						$attachment_list = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetAttachmentList', $fsid, $event_id, ''));
						$lattid = $attachment_list[0]["ATTNAME"];
					}
					else
					{
						$attachment['AttName'] = $item_id;
						$attachment['AttType'] = 'F';
						$attachment['AttDesc'] = $item_id;
						$attachment['AttSize'] = $size;
						$attachment['AttTime'] = $time;
						$attachment['AttParams'] = $this->_gw->CreateParamLine(array('mimetype' => $content_type));
						$attid = $this->_gw->FunctionCall('AddAttachment', $fsid, $event_id, $this->_gw->CreateParamLine($attachment), '');
						if (!$attid)
							throw new locked_exception();

						$lattid = $attid;
					}

					 					$path = $this->_gw->FunctionCall('GetAttachmentPath', $fsid, $event_id, $lattid, 'LOCK');
					if (!$path)
						throw new locked_exception();

					 					$dest_stream = @fopen('iw.file://' . $path, 'wb');
					if (!$dest_stream)
						throw new forbidden_exception();

					stream_copy_to_stream($stream, $dest_stream);
					if (empty($size))
					{
						 						$size = ftell($dest_stream);
						$event['EvnComplete'] = $size;
						$this->_gw->FunctionCall('AddEventInfo', $fsid, $this->_gw->CreateParamLine($event), $event_id);
					}

					fclose($dest_stream);

					 					$result = $this->_gw->FunctionCall('GetAttachmentPath', $fsid, $event_id, $lattid, 'UNLOCK');
					if (!$result)
						throw new forbidden_exception();

					$this->_gw->FunctionCall('AddEventInfo', $fsid, null, $event_id);

					$result = array();
					if ($folder == '@@UPLOAD@@')
					{
						if (count($list))
							$result['publicurl'] = '"' . $this->_gw->FunctionCall('GetAttachmentPathLocal', $fsid, $list[0]['EVN_ID'], $event['EvnTitle'], 'TICKET') . '"';
						else
							$result['publicurl'] = '"' . $this->_gw->FunctionCall('GetAttachmentPathLocal', $fsid, $event_id, $event['EvnTitle'], 'TICKET') . '"';
					}

					if (count($list))
						$result['etag'] = '"' . $list[0]['EVN_ID'] . ':' . (++$list[0]['EVN_EDITCOUNTER']) . '"';
					else
						$result['etag'] = '"' . $event_id . ':0"';

					return $result;
				}
		}

		if (!$add_info || count($add_info) == 0 || !$add_info[0][$id_name])
		{
			if ($this->_gw->FunctionCall('GetLastError', $fsid) == 3)
			{
				if (count($list) == 0)
					throw new forbidden_precondition_exception('DAV:', 'write');
				else
					throw new forbidden_precondition_exception('DAV:', 'write-content');
			}

			throw new forbidden_exception();
		}

		if ($add_info[0]['ITEMMODIFIED'])
			return null;

		return '"' . $add_info[0][$id_name] . ':' . $edit_counter . '"';
	}

	function delete_folder($group_name, $folder)
	{
		$gsid = $this->open_group($group_name);
		if (!$gsid)
			throw new not_found_exception();
		$full_path = $this->get_group_folder_path($group_name, $folder);
		$result = $this->_gw->FunctionCall('DeleteFolder', $gsid, $full_path);
		if ($result)
		{
			$this->cache_folder_list($gsid);
			foreach($this->_fsid as $key => $value)
			if (substr_compare($key, $full_path, 0, strlen($full_path)) == 0)
				unset($this->_fsid[$key]);
			return;
		}
		else
		{
			if ($this->_gw->FunctionCall('GetLastError', $gsid) == 3)
				throw new forbidden_precondition_exception('DAV:', 'unbind');
			throw new not_found_exception();
		}
	}

	function delete_item($group_name, $folder, $raw_item_id, $schedule_reply)
	{
		$fsid = $this->open_folder($group_name, $folder);
		if (!$fsid)
			throw new not_found_exception();
		$folder_info = $this->get_folder_info($group_name, $folder);
		$object_type = $folder_info['type'];
		if ($object_type == 'C')
			$result = $this->_gw->FunctionCall('DeleteContact', $fsid, $raw_item_id);
		else if ($object_type == 'F' || $object_type == 'N' || $object_type == 'J' || !$schedule_reply)
			$result = $this->_gw->FunctionCall('DeleteEvent', $fsid, $raw_item_id);
		else
			$result = $this->_gw->FunctionCall('ProcessvCalendar', $fsid, $raw_item_id, null, 'rfc6638=&action=delete');
		if (!$result)
		{
			if ($this->_gw->FunctionCall('GetLastError', $this->_gsid) == 3)
				throw new forbidden_precondition_exception('DAV:', 'unbind');
			throw new not_found_exception();
		}
	}

	function copy_item($group_name, $folder, $raw_item_id, $target_group_name, $target_folder, $target_item_id)
	{
		 		$folder_info = $this->get_folder_info($group_name, $folder);
		if (!$folder_info)
			throw new not_found_exception();

		 		$target_folder_info = $this->get_folder_info($target_group_name, $target_folder);
		if (!$target_folder_info)
			throw new conflict_exception();

		$object_type = $folder_info['type'];
		$target_object_type = $target_folder_info['type'];
		if ($target_object_type != $object_type)
			throw new bad_gateway_exception();

		$fsid = $this->open_folder($group_name, $folder);
		if (!$fsid)
			throw new not_found_exception();

		$target_fsid = $this->open_folder($target_group_name, $target_folder);
		if (!$target_fsid)
			throw new conflict_exception();

		switch ($object_type)
		{
			case 'C':
				 				$contact_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetContactInfo', $fsid, $raw_item_id));
				unset($contact_info[0]['ITM_ID']);
				unset($contact_info[0]['ITMFOLDER']);
				unset($contact_info[0]['ITM_EDITCOUNTER']);
				$contact_info[0]['ITMRID'] = $target_item_id;
				 				$result = $this->_gw->FunctionCall('AddContactInfo', $target_fsid, $this->_gw->CreateParamLine($contact_info[0]));
				if ($result)
				{
					 					$old_data = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetContactCertificate', $fsid, $raw_item_id));
					foreach ($old_data as $old_data_row)
					$this->_gw->FunctionCall('SetContactCertificate', $target_fsid, $result, $this->_gw->CreateParamLine($old_data_row));
					 					$old_data = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetContactLocations', $fsid, $raw_item_id));
					foreach ($old_data as $old_data_row)
					{
						$new_lct_id = $this->_gw->FunctionCall('AddContactLocation', $target_fsid, $result, $this->_gw->CreateParamLine($old_data_row));
						$old_lct_data = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetContactLocationPhones', $fsid, $old_data_row['LCT_ID']));
						foreach ($old_lct_data as $old_lct_data_row)
						$this->_gw->FunctionCall('AddContactLocationPhone', $target_fsid, $new_lct_id, $this->_gw->CreateParamLine($old_lct_data_row));
					}
					 					$contact_attachments = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetAttachmentList', $fsid, $raw_item_id));
					foreach ($contact_attachments as $attachment)
					{
						$item = $this->_gw->FunctionCall('GetAttachment', $fsid, $raw_item_id, $attachment["ATTNAME"]);
						$this->_gw->FunctionCall('AddAttachment', $target_fsid, $result, $this->_gw->CreateParamLine($attachment), $item);
					}
					 					$this->_gw->FunctionCall('AddContactInfo', $target_fsid, null, $result);
				}
				break;

			case 'E':
			case 'J':
			case 'N':
			case 'T':
			case 'F':
				$event_info = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetEventInfo', $fsid, $raw_item_id));

				unset($event_info[0]['EVN_EDITCOUNTER']);
				unset($event_info[0]['EVN_ID']);
				unset($event_info[0]['EVNFOLDER']);
				unset($event_info[0]['EVNGRP_ID']);
				unset($event_info[0]['EVNRCR_ID']);
				$event_info[0]['EVNLOCATION'] = $target_item_id;
				$event_info[0]['EVNRID'] = $target_item_id;
				$event_info[0]['EVNTITLE'] = $target_item_id;

				$result = $this->_gw->FunctionCall('AddEventInfo', $target_fsid, $this->_gw->CreateParamLine($event_info[0]));
				if ($result)
				{
					 					$functions = array('GetEventReminders' => 'AddEventReminder', 'GetEventRecurrence' => 'AddEventRecurrence', 'GetEventContacts' => 'AddEventContact');
					foreach ($functions as $get_function => $set_function)
					{
						$old_data = $this->_gw->ParseParamLine($this->_gw->FunctionCall($get_function, $fsid, $raw_item_id));
						foreach ($old_data as $old_data_row)
						$this->_gw->FunctionCall($set_function, $target_fsid, $result, $this->_gw->CreateParamLine($old_data_row));
					}
					 					$event_attachments = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetAttachmentList', $fsid, $raw_item_id));
					foreach ($event_attachments as $attachment)
					{
						$item = $this->_gw->FunctionCall('GetAttachment', $fsid, $raw_item_id, $attachment["ATTNAME"]);
						$this->_gw->FunctionCall('AddAttachment', $target_fsid, $result, $this->_gw->CreateParamLine($attachment), $item);
					}

					$old_data = $this->_gw->ParseParamLine($this->_gw->FunctionCall('GetItemAttributes', $fsid, $raw_item_id));
					foreach ($old_data as $old_data_row)
					{
						$value = $old_data_row['DATAVALUE'];
						$data_row['AtrType'] = $old_data_row['ATRTYPE'];
						$data_row['AtrParam'] = $old_data_row['ATRPARAM'];
						$this->_gw->FunctionCall('AddItemAttribute', $target_fsid, $result, $value, $this->_gw->CreateParamLine($data_row));
					}
					 					$this->_gw->FunctionCall('AddEventInfo', $target_fsid, null, $result);
				}
				break;

			default:
				throw new forbidden_exception();
		}

		if (!$result)
		{
			if ($this->_gw->FunctionCall('GetLastError', $fsid) == 3)
				throw new forbidden_exception();  			throw new forbidden_exception();
		}
	}

	function rename_item($group_name, $folder, $raw_item_id, $target_item_id)
	{
		$result = null;
		$fsid = $this->open_folder($group_name, $folder);
		if (!$fsid)
			throw new not_found_exception();

		 		$folder_info = $this->get_folder_info($group_name, $folder);
		if (!$folder_info)
			throw new not_found_exception();

		switch ($folder_info['type'])
		{
			case 'C':
				$result = $this->_gw->FunctionCall('AddContactInfo', $fsid, "ItmRID=" . rawurlencode($target_item_id), $raw_item_id);
				break;

			case 'E':
			case 'J':
			case 'N':
			case 'T':
				$result = $this->_gw->FunctionCall('AddEventInfo', $fsid, "EvnRID=" . rawurlencode($target_item_id), $raw_item_id);
				break;

			case 'F':
				$event['EvnRID'] = $target_item_id;
				$event['EvnTitle'] = $target_item_id;
				$event['EvnLocation'] = $target_item_id;
				$result = $this->_gw->FunctionCall('AddEventInfo', $fsid, $this->_gw->CreateParamLine($event), $raw_item_id);
				if ($result)
					$this->_gw->FunctionCall('AddEventInfo', $fsid, null, $result);
				break;
		}

		if (!$result)
		{
			if ($this->_gw->FunctionCall('GetLastError', $fsid) == 3)
				throw new forbidden_exception();  			throw new not_found_exception();
		}
	}

	function rename_folder($group_name, $folder, $target_group_name, $target_folder)
	{
		$gsid = $this->open_group($group_name);
		if (!$gsid)
			throw new not_found_exception();
		$source = $this->get_group_folder_path($group_name, $folder);
		$target = $this->get_group_folder_path($target_group_name, $target_folder);
		$result = $this->_gw->FunctionCall('RenameFolder', $gsid, $source, $target);
		if ($result)
		{
			$this->cache_folder_list($gsid);
		}
		else
		{
			if ($this->_gw->FunctionCall('GetLastError', $gsid) == 3)
				throw new forbidden_exception();  			throw new not_found_exception();
		}
	}

	function send_itip($group_name, $request)
	{
		$gsid = $this->open_group($group_name);
		if (!$gsid)
			throw new bad_request_exception();
		$result = $this->_gw->FunctionCall('ProcessvCalendar', $gsid, '', $request, 'SEND_ITIP');
		return $this->_gw->ParseParamLine($result);
	}

	function get_inbox_state($group_name)
	{
		$gsid = $this->open_group($group_name);
		if (!$gsid)
			throw new not_found_exception();
		$xmlResult = $this->_gw->FunctionCall('ProcessvCalendar', $gsid, '', '', 'rfc6638=&action=list_inbox&stateonly=1' . '&owner=' . rawurlencode($group_name));

		$reader = new XMLReader();
		$reader->XML($xmlResult);
		$reader->read();  		$last_state = $reader->getAttribute('laststate');
		$reader->close();

		return $last_state;
	}

	function list_inbox_items($group_name, &$last_state)
	{
		$result = [];
		$gsid = $this->open_group($group_name);
		if (!$gsid)
			throw new not_found_exception();

		$xmlResult = $this->_gw->FunctionCall('ProcessvCalendar', $gsid, '', '', 'rfc6638=&action=list_inbox' . ($last_state == null ? '' : '&laststate=' . rawurlencode($last_state)) . '&owner=' . rawurlencode($group_name));

		$reader = new XMLReader();
		$reader->XML($xmlResult);
		$reader->read();  		$last_state = $reader->getAttribute('laststate');
		$reader->read();  		while ($reader->localName == 'item')
		{
			$reader->read();  			$uid = $reader->readString();
			$reader->read();  			$reader->read();  			$reader->read();  			$reader->read();  			$inbox_item_data = array('uid' => $uid);
			$result[$uid] = $inbox_item_data;
		}
		$reader->close();

		return $result;
	}

	function get_inbox_item($group_name, $local_id)
	{
		$gsid = $this->open_group($group_name);
		if (!$gsid)
			throw new not_found_exception();

		$result = $this->_gw->FunctionCall('ProcessvCalendar', $gsid, $local_id, '', 'rfc6638=&action=get_inbox' . '&owner=' . rawurlencode($group_name));
		if (!$result)
			throw new not_found_exception();

		$xml = text_to_xml($result);
		if (is_null($xml))
			throw new not_found_exception();

		$uid = $xml->get_data('uid');
		$ical = $xml->get_data('ical');

		return array('ical' => $ical, 'uid' => $uid);
	}

	function delete_inbox_item($group_name, $local_id)
	{
		$gsid = $this->open_group($group_name);
		if (!$gsid)
			throw new not_found_exception();

		$result = $this->_gw->FunctionCall('ProcessvCalendar', $gsid, $local_id, null, 'rfc6638=&action=delete_inbox' . '&owner=' . rawurlencode($group_name));
		if (!$result)
		{
			if ($this->_gw->FunctionCall('GetLastError', $this->_gsid) == 3)
				throw new forbidden_precondition_exception('DAV:', 'unbind');
			 		}
	}
}
?>
