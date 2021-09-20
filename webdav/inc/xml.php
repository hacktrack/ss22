<?php
class xml_tree_node
{
	var $_name;
	var $_attribs;
	var $_children;

	function &__construct($name, $attribs)
	{
		$this->_name = $name;
		$this->_attribs = $attribs;
		$this->_children = array();
		return $this;
	}

	function get_name()
	{
		return $this->_name;
	}

	function get_namespace()
	{
		$pos = strrpos($this->_name, ':');
		if ($pos)
			return substr($this->_name, 0, $pos);
		return '';
	}

	function get_local_name()
	{
		$pos = strrchr($this->_name, ':');
		if ($pos)
			return substr($pos, 1);
		return $this->_name;
	}

	function &children()
	{
		return $this->_children;
	}

	function children_count()
	{
		return count($this->_children);
	}

	function &get_child($name)
	{
		$seg = substr($name, 0, strcspn($name, "\\"));
		if (is_array($this->_children))
		{
			foreach ($this->_children as $child)
			{
				if (!($child instanceof xml_text_node))
				{
					if (strcasecmp($child->get_name(), $seg) == 0)
					{
						if ($seg == $name)
							return $child;
						else
							return $child->get_child(substr($name, strcspn($name, "\\") + 1));
					}
				}
			}
		}
		return null;
	}

	function &get_data($name)
	{
		$tmp = $this->get_child($name);
		if ($tmp && is_array($tmp->_children) && ($tmp->_children[0] instanceof xml_text_node))
			return $tmp->_children[0]->get_data();
		else
			return null;
	}

	function &add_child(&$xml_node)
	{
		return $this->_children[] = &$xml_node;
	}

	function &new_child($name, $attribs = null)
	{
		return $this->add_child(new xml_tree_node($name, $attribs));
	}
}

class xml_text_node
{
	var $_data;

	function &__construct($data)
	{
		$this->_data = $data;
		return $this;
	}

	function get_data()
	{
		return $this->_data;
	}
}

function text_to_xml($xml_text)
{
	$xml_parser = xml_parser_create_ns();
	xml_parser_set_option($xml_parser, XML_OPTION_CASE_FOLDING, false);
	xml_parser_set_option($xml_parser, XML_OPTION_SKIP_WHITE, true);
	if (!xml_parse_into_struct($xml_parser, $xml_text, $values, $index))
		return null;
	xml_parser_free($xml_parser);

	$stackpos = 0;
	$stack = array();
	foreach($values as $val)
	{
		if ($val["tag"][0] == ':')
			return null;

		switch ($val["type"])
		{
			case "open":
				if ($stackpos)
					$stack[$stackpos] = &$stack[$stackpos - 1]->new_child($val["tag"], $val["attributes"]);
				else
					$stack[0] = new xml_tree_node($val["tag"], $val["attributes"]);
				$stackpos++;
				break;

			case "complete":
				if ($stackpos)
					$stack[$stackpos] = &$stack[$stackpos - 1]->new_child($val["tag"], $val["attributes"]);
				else
					$stack[0] = new xml_tree_node($val["tag"], $val["attributes"]);
				if (isset($val['value']))
					$stack[$stackpos]->add_child(new xml_text_node($val['value']));
				break;

			case "close":
				if ($stackpos)
					$stackpos--;
		}
	}

	if ($stackpos != 0)
		return null;

	return $stack[0];
}

function create_cdata($text)
{
	$cdata_start = '<![CDATA[';
	$cdata_end = ']]>';
	
	$cdata = $cdata_start;
	$pos = 0;
	while(($new_pos = strpos($text, ']]>', $pos)) !== false)
	{
		$cdata .= substr($text, $pos, $new_pos - $pos).']]'.$cdata_end.$cdata_start.'>';
		$pos = $new_pos + 3;
	}
	
	$cdata .= substr($text, $pos, strlen($text) - $pos).$cdata_end;
	return $cdata;
}

?>
