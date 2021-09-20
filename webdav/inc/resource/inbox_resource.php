<?php
class inbox_resource extends resource
{
	private $_item_info;
	private $_file_info;
	private $_parent_resource;
	private $_group;
	private $_folder_path;
	private $_item_id;

	public function __construct($datastore, $uri, $item_info = null, $parent_resource = null)
	{
		parent::__construct($datastore, $uri);
		$segments = $uri->get_segments();
		array_shift($segments);  		$this->_group = array_shift($segments);
		$this->_item_id = array_pop($segments);
		if ($item_info == null)
		{
			$this->_item_info = $this->_datastore->get_inbox_item($this->_group, $this->_item_id);
			if ((!$this->_item_info || count($this->_item_info) == 0))
				throw new not_found_exception();
		}
		else
			$this->_item_info = $item_info;
		$this->_parent_resource = $parent_resource;
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

	public function get_internal_type()
	{
		return 'E';
	}

	public function get_content_type()
	{
		return 'text/calendar';
	}

	public function get_title()
	{
		return $this->_item_info['uid'] . '.ics';
	}

	public function get_etag()
	{
		return $this->_item_info['uid'];
	}

	public function get_content()
	{
		return $this->_item_info['ical'];
		 	}

	public function get_content_filtered($data_filter)
	{
		if (($data_filter !== null) && (count($data_filter) > 0))
			throw new method_not_allowed_exception();

		return $this->_item_info['ical'];
		 	}

	public function is_get_computed()
	{
		return true;
	}

	public function delete($schedule_reply)
	{
		return $this->_datastore->delete_inbox_item($this->_group, $this->_item_info['uid']);
	}
}
?>
