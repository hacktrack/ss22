<?php

class xml_tree_node 
{
  var $_name;
  var $_attribs;
  var $_children;

  function &__construct($name,$attribs) 
  {
    
    $this->_name=$name;
    $this->_attribs=$attribs;
    $this->_children=array();
    return $this;
  }

  function get_name() 
  {
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
    $seg=substr($name,0,strcspn($name,'/'));
    if (is_array($this->_children))
      foreach($this->_children as $child)
        if (strcasecmp($child->get_name(),$seg)==0)
          if ($seg==$name)
            return $child;
          else
            return $child->get_child(substr($name,strcspn($name,'/')+1));

    return NULL;
  }

  function &get_data($name) 
  {
    $tmp=$this->get_child($name);
    if ($tmp)
      if ($tmp->_children[0])
        return $tmp->_children[0]->get_data();

    return NULL;
  }

  function &add_child(&$xml_node) 
  {
    return $this->_children[]=&$xml_node;
  }

  function &new_child($name,$attribs) 
  {
    return $this->add_child(new xml_tree_node($name,$attribs));
  }

  function &new_child_data($name,$attribs,$data) 
  {
    $tmp=&$this->new_child($name,$attribs);
    $tmp->add_child(new xml_text_node($data));
    return $tmp;
  }
  
  function &add_subtree($name,$attribs,$xml_text)
  {
    $subtree=text_to_xml($xml_text);	
    $subtree->_name=$name;
    $this->_attribs=$attribs;
    return $this->_children[]=&$subtree;
  }

  function print_node($rec_level,$format)
  {
    $result='';
    if ($format)

      for($i=0;$i<$rec_level;$i++) 
        $result.='  ';

    $result.='<'.$this->_name;

    if (is_array($this->_attribs)) 
      foreach($this->_attribs as $key=>$val)
        $result.=' '.$key."=\"".$val."\"";

    $result.='>';

    $nl=FALSE; 
    foreach($this->_children as $child)
    {
      if (!$nl&&(get_class($child)!='xml_text_node')) 
      {
        $nl=TRUE;
        $result.="\r\n";
      }
      $result.=$child->print_node($rec_level+1,$format);
    }

    if ($format&&$nl) 
      for($i=0;$i<$rec_level;$i++)
        $result.='  ';

    $result.='</'.$this->_name.'>';
    $result.="\r\n";
    return $result;
  }
}

class xml_text_node 
{
  var $_data;

  function &__construct($data) 
  {
    $this->_data=$data;
    return $this;
  }

  function get_data() 
  {
    return $this->_data;
  }

  function print_node($rec_level,$format) 
  {
    return $this->_data;
  }
}

function text_to_xml($xml_text) 
{
  $xml_parser=xml_parser_create('UTF-8');
  xml_parser_set_option($xml_parser,XML_OPTION_CASE_FOLDING,FALSE);
  if (!xml_parse_into_struct($xml_parser,$xml_text,$values,$index))
    die(sprintf("XML error: %s at line %d",xml_error_string(xml_get_error_code($xml_parser)),xml_get_current_line_number($xml_parser)));

  xml_parser_free($xml_parser);

  $stackpos=0;
  $stack=array();
  foreach($values as $val)
  {
    switch($val['type'])
    {
      case 'open':
        if ($stackpos)
          $stack[$stackpos]=&$stack[$stackpos-1]->new_child($val['tag'],$val['attributes']);
        else
          $stack[0]=new xml_tree_node($val['tag'],$val['attributes']);

        $stackpos++;
        break;

      case 'complete':
        if ($stackpos)
          $stack[$stackpos]=&$stack[$stackpos-1]->new_child($val['tag'],$val['attributes']);
        else
          $stack[0]=new xml_tree_node($val['tag'],$val['attributes']);

        $stack[$stackpos]->add_child(new xml_text_node($val['value']));
        break;

      case 'close':
        if ($stackpos)
          $stackpos--;
    }
  }
  return $stack[0];
}
?>