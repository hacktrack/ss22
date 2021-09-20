<?php
class forbidden_precondition_exception extends dav_exception
{
	public function __construct($namespace_uri = null, $precondition_name = null, $previous = null)
	{
		parent::__construct('Forbidden', 403, $previous);
		$xml_writer = new XMLWriter();
		$xml_writer->openMemory();
		$xml_writer->startElementNS(null, 'error', 'DAV:');
		$xml_writer->writeElementNS(null, $precondition_name, $namespace_uri == 'DAV:' ? null : $namespace_uri);
		$xml_writer->endElement();
		$this->_body = $xml_writer->outputMemory(true);
	}
}
?>