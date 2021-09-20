<?php
class collection_resource extends resource
{
	protected function __construct($datastore, $uri)
	{
		parent::__construct($datastore, $uri);
	}

	public function get_content_type()
	{
		return 'text/html; charset=utf-8';
	}

	public function get_content()
	{
		$content = '<!DOCTYPE html><html><head><title>' . htmlspecialchars($this->get_title()) . '</title></head><body><ul>';
		foreach ($this->get_children() as $child)
		{
			$content .= '<li><a href="' . htmlspecialchars($child->get_uri()->to_string()) . '">';
			$content .= htmlspecialchars($child->get_title()) . "</a></li>\r\n";
		}
		$content .= '</ul></body></html>';
		return $content;
	}

	public function is_get_computed()
	{
		return true;
	}

	public function get_children($filter=NULL)
	{
		return array();
	}

	public function write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix)
	{
		if ($namespace_uri == 'DAV:' && $property_name == 'resourcetype')
			return $xml_writer->writeElementNS($xml_dav_prefix, 'collection', null);
		parent::write_property_value($namespace_uri, $property_name, $xml_writer, $xml_dav_prefix);
	}
}

?>
