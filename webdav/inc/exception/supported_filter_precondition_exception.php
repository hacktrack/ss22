<?php
class supported_filter_precondition_exception extends forbidden_exception
{
	public function __construct($precondition_xml = null, $previous = null)
	{
		parent::__construct($previous);
		$xml_writer = new XMLWriter();
		$xml_writer->openMemory();
		$xml_writer->startElementNS(null, 'error', 'DAV:');
		$xml_writer->startElementNS(null, 'supported-filter', $precondition_xml->get_namespace());
		$xml_writer->startElementNS(null, $precondition_xml->get_local_name(), $precondition_xml->get_namespace());
		foreach ($precondition_xml->_attribs as $name => $value)
			$xml_writer->writeAttribute($name, $value);
		$xml_writer->endElement();
		$xml_writer->endElement();
		$xml_writer->endElement();
		$this->_body = $xml_writer->outputMemory(true);
	}
}
?>