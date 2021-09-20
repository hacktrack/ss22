<?php
 

 
require('data.inc.php');

 
require('class.csstidy_print.php');

 
require('class.csstidy_optimise.php');

 
class csstidy {

 
var $css = array();

 
var $tokens = array();

 
var $print;

 
var $optimise;

 
var $charset = '';

 
var $import = array();

 
var $namespace = '';

 
var $version = '1.3';

 
var $settings = array();

 
var $status = 'is';


 
var $at = '';

 
var $selector = '';

 
var $property = '';

 
var $sel_separate = array();

 
var $value = '';

 
var $sub_value = '';

 
var $sub_value_arr = array();

 
var $str_char = '';
var $cur_string = '';

 
var $from = '';

 
var $str_in_str = false;

 
var $invalid_at = false;

 
var $added = false;

 
var $log = array();

 
var $line = 1;

 
function __construct()
{
	$this->settings['remove_bslash'] = true;
	$this->settings['compress_colors'] = true;
	$this->settings['compress_font-weight'] = true;
	$this->settings['lowercase_s'] = false;
	$this->settings['optimise_shorthands'] = 1;
	$this->settings['remove_last_;'] = false;
	$this->settings['case_properties'] = 1;
	$this->settings['sort_properties'] = false;
	$this->settings['sort_selectors'] = false;
	$this->settings['merge_selectors'] = 2;
	$this->settings['discard_invalid_properties'] = false;
	$this->settings['css_level'] = 'CSS2.1';
    $this->settings['preserve_css'] = false;
    $this->settings['timestamp'] = false;

	$this->load_template('default');
    $this->print = new csstidy_print($this);
    $this->optimise = new csstidy_optimise($this);
}

 
function get_cfg($setting)
{
	if(isset($this->settings[$setting]))
	{
		return $this->settings[$setting];
	}
	return false;
}

 
function set_cfg($setting,$value)
{
	if(isset($this->settings[$setting]) && $value !== '')
	{
		$this->settings[$setting] = $value;
		return true;
	}
	return false;
}

 
function _add_token($type, $data, $do = false) {
    if($this->get_cfg('preserve_css') || $do) {
        $this->tokens[] = array($type, ($type == COMMENT) ? $data : trim($data));
    }
}

 
function log($message,$type,$line = -1)
{
	if($line === -1)
	{
		$line = $this->line;
	}
	$line = intval($line);
	$add = array('m' => $message, 't' => $type);
	if(!isset($this->log[$line]) || !in_array($add,$this->log[$line]))
	{
		$this->log[$line][] = $add;
	}
}

 
function _unicode(&$string, &$i)
{
	++$i;
	$add = '';
	$tokens =& $GLOBALS['csstidy']['tokens'];
	$replaced = false;

	while($i < strlen($string) && (ctype_xdigit($string{$i}) || ctype_space($string{$i})) && strlen($add) < 6)
	{
		$add .= $string{$i};

		if(ctype_space($string{$i})) {
			break;
		}
		$i++;
	}

	if(hexdec($add) > 47 && hexdec($add) < 58 || hexdec($add) > 64 && hexdec($add) < 91 || hexdec($add) > 96 && hexdec($add) < 123)
	{
		$this->log('Replaced unicode notation: Changed \\'. $add .' to ' . chr(hexdec($add)),'Information');
		$add = chr(hexdec($add));
		$replaced = true;
	}
	else {
		$add = trim('\\'.$add);
	}

	if(@ctype_xdigit($string{$i+1}) && ctype_space($string{$i})
       && !$replaced || !ctype_space($string{$i})) {
		$i--;
	}

	if($add != '\\' || !$this->get_cfg('remove_bslash') || strpos($tokens, $string{$i+1}) !== false) {
		return $add;
	}

	if($add == '\\') {
		$this->log('Removed unnecessary backslash','Information');
	}
	return '';
}

 
function load_template($content, $from_file=true)
{
	$predefined_templates =& $GLOBALS['csstidy']['predefined_templates'];
	if($content == 'high_compression' || $content == 'default' || $content == 'highest_compression' || $content == 'low_compression')
	{
		$this->template = $predefined_templates[$content];
		return;
	}

	if($from_file)
	{
		$content = strip_tags(file_get_contents($content),'<span>');
	}
	$content = str_replace("\r\n","\n",$content);  	$template = explode('|',$content);

	for ($i = 0; $i < count($template); $i++ )
	{
		$this->template[$i] = $template[$i];
	}
}

 
function parse_from_url($url)
{
	return $this->parse(@file_get_contents($url));
}

 
function is_token(&$string, $i)
{
	$tokens =& $GLOBALS['csstidy']['tokens'];
	return (strpos($tokens, $string{$i}) !== false && !csstidy::escaped($string,$i));
}


 
function parse($string) {
         $this->print = new csstidy_print($this);
    $this->optimise = new csstidy_optimise($this);

    $all_properties =& $GLOBALS['csstidy']['all_properties'];
    $at_rules =& $GLOBALS['csstidy']['at_rules'];

    $this->css = array();
    $this->print->input_css = $string;
    $string = str_replace("\r\n","\n",$string) . ' ';
    $cur_comment = '';

    for ($i = 0, $size = strlen($string); $i < $size; $i++ )
    {
        if($string{$i} == "\n" || $string{$i} == "\r")
        {
            ++$this->line;
        }

        switch($this->status)
        {
             
            case 'at':
            if(csstidy::is_token($string,$i))
            {
                if($string{$i} == '/' && @$string{$i+1} == '*')
                {
                    $this->status = 'ic'; ++$i;
                    $this->from = 'at';
                }
                elseif($string{$i} == '{')
                {
                    $this->status = 'is';
                    $this->_add_token(AT_START, $this->at);
                }
                elseif($string{$i} == ',')
                {
                    $this->at = trim($this->at).',';
                }
                elseif($string{$i} == '\\')
                {
                    $this->at .= $this->_unicode($string,$i);
                }
                                 elseif($string{$i} == '(' || $string{$i} == ')' || $string{$i} == ':' || $string{$i} == '.')
                {
                    $this->at .= $string{$i};
                }
            }
            else
            {
                $lastpos = strlen($this->at)-1;
                if(!( (ctype_space($this->at{$lastpos}) || csstidy::is_token($this->at,$lastpos) && $this->at{$lastpos} == ',') && ctype_space($string{$i})))
                {
                    $this->at .= $string{$i};
                }
            }
            break;

             
            case 'is':
            if(csstidy::is_token($string,$i))
            {
                if($string{$i} == '/' && @$string{$i+1} == '*' && trim($this->selector) == '')
                {
                    $this->status = 'ic'; ++$i;
                    $this->from = 'is';
                }
                elseif($string{$i} == '@' && trim($this->selector) == '')
                {
                                         $this->invalid_at = true;
                    foreach($at_rules as $name => $type)
                    {
                        if(!strcasecmp(substr($string,$i+1,strlen($name)),$name))
                        {
                            ($type == 'at') ? $this->at = '@'.$name : $this->selector = '@'.$name;
                            $this->status = $type;
                            $i += strlen($name);
                            $this->invalid_at = false;
                        }
                    }

                    if($this->invalid_at)
                    {
                        $this->selector = '@';
                        $invalid_at_name = '';
                        for($j = $i+1; $j < $size; ++$j)
                        {
                            if(!ctype_alpha($string{$j}))
                            {
                                break;
                            }
                            $invalid_at_name .= $string{$j};
                        }
                        $this->log('Invalid @-rule: '.$invalid_at_name.' (removed)','Warning');
                    }
                }
                elseif(($string{$i} == '"' || $string{$i} == "'"))
                {
                    $this->cur_string = $string{$i};
                    $this->status = 'instr';
                    $this->str_char = $string{$i};
                    $this->from = 'is';
                }
                elseif($this->invalid_at && $string{$i} == ';')
                {
                    $this->invalid_at = false;
                    $this->status = 'is';
                }
                elseif($string{$i} == '{')
                {
                    $this->status = 'ip';
                    $this->_add_token(SEL_START, $this->selector);
                    $this->added = false;
                }
                elseif($string{$i} == '}')
                {
                    $this->_add_token(AT_END, $this->at);
                    $this->at = '';
                    $this->selector = '';
                    $this->sel_separate = array();
                }
                elseif($string{$i} == ',')
                {
                    $this->selector = trim($this->selector).',';
                    $this->sel_separate[] = strlen($this->selector);
                }
                elseif($string{$i} == '\\')
                {
                    $this->selector .= $this->_unicode($string,$i);
                }
                                 else if(!($string{$i} == '*' && @in_array($string{$i+1}, array('.', '#', '[', ':')))) {
                    $this->selector .= $string{$i};
                }
            }
            else
            {
                $lastpos = strlen($this->selector)-1;
                if($lastpos == -1 || !( (ctype_space($this->selector{$lastpos}) || csstidy::is_token($this->selector,$lastpos) && $this->selector{$lastpos} == ',') && ctype_space($string{$i})))
                {
                    $this->selector .= $string{$i};
                }
            }
            break;

             
            case 'ip':
            if(csstidy::is_token($string,$i))
            {
                if(($string{$i} == ':' || $string{$i} == '=') && $this->property != '')
                {
                    $this->status = 'iv';
                    if(!$this->get_cfg('discard_invalid_properties') || csstidy::property_is_valid($this->property)) {
                        $this->_add_token(PROPERTY, $this->property);
                    }
                }
                elseif($string{$i} == '/' && @$string{$i+1} == '*' && $this->property == '')
                {
                    $this->status = 'ic'; ++$i;
                    $this->from = 'ip';
                }
                elseif($string{$i} == '}')
                {
                    $this->explode_selectors();
                    $this->status = 'is';
                    $this->invalid_at = false;
                    $this->_add_token(SEL_END, $this->selector);
                    $this->selector = '';
                    $this->property = '';
                }
                elseif($string{$i} == ';')
                {
                    $this->property = '';
                }
                elseif($string{$i} == '\\')
                {
                    $this->property .= $this->_unicode($string,$i);
                }
            }
            elseif(!ctype_space($string{$i}))
            {
                $this->property .= $string{$i};
            }
            break;

             
            case 'iv':
            $pn = (($string{$i} == "\n" || $string{$i} == "\r") && $this->property_is_next($string,$i+1) || $i == strlen($string)-1);
            if(csstidy::is_token($string,$i) || $pn)
            {
                if($string{$i} == '/' && @$string{$i+1} == '*')
                {
                    $this->status = 'ic'; ++$i;
                    $this->from = 'iv';
                }
                elseif(($string{$i} == '"' || $string{$i} == "'" || $string{$i} == '('))
                {
                    $this->cur_string = $string{$i};
                    $this->str_char = ($string{$i} == '(') ? ')' : $string{$i};
                    $this->status = 'instr';
                    $this->from = 'iv';
                }
                elseif($string{$i} == ',')
                {
                    $this->sub_value = trim($this->sub_value).',';
                }
                elseif($string{$i} == '\\')
                {
                    $this->sub_value .= $this->_unicode($string,$i);
                }
                elseif($string{$i} == ';' || $pn)
                {
                    if($this->selector{0} == '@' && isset($at_rules[substr($this->selector,1)]) && $at_rules[substr($this->selector,1)] == 'iv')
                    {
                        $this->sub_value_arr[] = trim($this->sub_value);

                        $this->status = 'is';

                        switch($this->selector)
                        {
                            case '@charset': $this->charset = $this->sub_value_arr[0]; break;
                            case '@namespace': $this->namespace = implode(' ',$this->sub_value_arr); break;
                            case '@import': $this->import[] = implode(' ',$this->sub_value_arr); break;
                        }

                        $this->sub_value_arr = array();
                        $this->sub_value = '';
                        $this->selector = '';
                        $this->sel_separate = array();
                    }
                    else
                    {
                        $this->status = 'ip';
                    }
                }
                elseif($string{$i} != '}')
                {
                    $this->sub_value .= $string{$i};
                }
                if(($string{$i} == '}' || $string{$i} == ';' || $pn) && !empty($this->selector))
                {
                    if($this->at == '')
                    {
                        $this->at = DEFAULT_AT;
                    }

                                         if($this->get_cfg('lowercase_s'))
                    {
                        $this->selector = strtolower($this->selector);
                    }
                    $this->property = strtolower($this->property);

                    $this->optimise->subvalue();
                    if($this->sub_value != '') {
                        $this->sub_value_arr[] = $this->sub_value;
                        $this->sub_value = '';
                    }

                    $this->value = implode(' ',$this->sub_value_arr);

                    $this->selector = trim($this->selector);

                    $this->optimise->value();

                    $valid = csstidy::property_is_valid($this->property);
                    if((!$this->invalid_at || $this->get_cfg('preserve_css')) && (!$this->get_cfg('discard_invalid_properties') || $valid))
                    {
                        $this->css_add_property($this->at,$this->selector,$this->property,$this->value);
                        $this->_add_token(VALUE, $this->value);
                        $this->optimise->shorthands();
                    }
                    if(!$valid)
                    {
                        if($this->get_cfg('discard_invalid_properties'))
                        {
                            $this->log('Removed invalid property: '.$this->property,'Warning');
                        }
                        else
                        {
                            $this->log('Invalid property in '.strtoupper($this->get_cfg('css_level')).': '.$this->property,'Warning');
                        }
                    }

                    $this->property = '';
                    $this->sub_value_arr = array();
                    $this->value = '';
                }
                if($string{$i} == '}')
                {
                    $this->explode_selectors();
                    $this->_add_token(SEL_END, $this->selector);
                    $this->status = 'is';
                    $this->invalid_at = false;
                    $this->selector = '';
                }
            }
            elseif(!$pn)
            {
                $this->sub_value .= $string{$i};

                if(ctype_space($string{$i}))
                {
                    $this->optimise->subvalue();
                    if($this->sub_value != '') {
                        $this->sub_value_arr[] = $this->sub_value;
                        $this->sub_value = '';
                    }
                }
            }
            break;

             
            case 'instr':
            if($this->str_char == ')' && ($string{$i} == '"' || $string{$i} == '\'') && !$this->str_in_str && !csstidy::escaped($string,$i))
            {
                $this->str_in_str = true;
            }
            elseif($this->str_char == ')' && ($string{$i} == '"' || $string{$i} == '\'') && $this->str_in_str && !csstidy::escaped($string,$i))
            {
                $this->str_in_str = false;
            }
            $temp_add = $string{$i};                        if( ($string{$i} == "\n" || $string{$i} == "\r") && !($string{$i-1} == '\\' && !csstidy::escaped($string,$i-1)) )
            {
                $temp_add = "\\A ";
                $this->log('Fixed incorrect newline in string','Warning');
            }
            if (!($this->str_char == ')' && in_array($string{$i}, $GLOBALS['csstidy']['whitespace']) && !$this->str_in_str)) {
                $this->cur_string .= $temp_add;
            }
            if($string{$i} == $this->str_char && !csstidy::escaped($string,$i) && !$this->str_in_str)
            {
                $this->status = $this->from;
                if (!preg_match('|[' . implode('', $GLOBALS['csstidy']['whitespace']) . ']|uis', $this->cur_string) && $this->property != 'content') {
                    if ($this->str_char == '"' || $this->str_char == '\'') {
						$this->cur_string = substr($this->cur_string, 1, -1);
					} else if (strlen($this->cur_string) > 3 && ($this->cur_string[1] == '"' || $this->cur_string[1] == '\''))   {
						$this->cur_string = $this->cur_string[0] . substr($this->cur_string, 2, -2) . substr($this->cur_string, -1);
					}
                }
                if($this->from == 'iv')
                {
                    $this->sub_value .= $this->cur_string;
                }
                elseif($this->from == 'is')
                {
                    $this->selector .= $this->cur_string;
                }
            }
            break;

             
            case 'ic':
            if($string{$i} == '*' && $string{$i+1} == '/')
            {
                $this->status = $this->from;
                $i++;
                $this->_add_token(COMMENT, $cur_comment);
                $cur_comment = '';
            }
            else
            {
                $cur_comment .= $string{$i};
            }
            break;
        }
    }

    $this->optimise->postparse();

    $this->print->_reset();

    return !(empty($this->css) && empty($this->import) && empty($this->charset) && empty($this->tokens) && empty($this->namespace));
}

 
function explode_selectors()
{
         if($this->get_cfg('merge_selectors') == 1)
    {
        $new_sels = array();
        $lastpos = 0;
        $this->sel_separate[] = strlen($this->selector);
        foreach($this->sel_separate as $num => $pos)
        {
            if($num == count($this->sel_separate)-1) {
                $pos += 1;
            }

            $new_sels[] = substr($this->selector,$lastpos,$pos-$lastpos-1);
            $lastpos = $pos;
        }

        if(count($new_sels) > 1)
        {
            foreach($new_sels as $selector)
            {
                $this->merge_css_blocks($this->at,$selector,$this->css[$this->at][$this->selector]);
            }
            unset($this->css[$this->at][$this->selector]);
        }
    }
    $this->sel_separate = array();
}

 
    public static function escaped(&$string,$pos)
{
	return !(@($string{$pos-1} != '\\') || csstidy::escaped($string,$pos-1));
}

 
function css_add_property($media,$selector,$property,$new_val)
{
    if($this->get_cfg('preserve_css') || trim($new_val) == '') {
        return;
    }

    $this->added = true;
    if(isset($this->css[$media][$selector][$property]))
    {
        if((csstidy::is_important($this->css[$media][$selector][$property]) && csstidy::is_important($new_val)) || !csstidy::is_important($this->css[$media][$selector][$property]))
        {
            unset($this->css[$media][$selector][$property]);
            $this->css[$media][$selector][$property] = trim($new_val);
        }
    }
    else
    {
        $this->css[$media][$selector][$property] = trim($new_val);
    }
}

 
function merge_css_blocks($media,$selector,$css_add)
{
	foreach($css_add as $property => $value)
	{
		$this->css_add_property($media,$selector,$property,$value);
	}
}

 
    public static function is_important(&$value)
{
	return (!strcasecmp(substr(str_replace($GLOBALS['csstidy']['whitespace'],'',$value),-10,10),'!important'));
}

 
    public static function gvw_important($value)
{
	if(csstidy::is_important($value))
	{
		$value = trim($value);
		$value = substr($value,0,-9);
		$value = trim($value);
		$value = substr($value,0,-1);
		$value = trim($value);
		return $value;
	}
	return $value;
}

 
function property_is_next($istring, $pos)
{
	$all_properties =& $GLOBALS['csstidy']['all_properties'];
	$istring = substr($istring,$pos,strlen($istring)-$pos);
	$pos = strpos($istring,':');
	if($pos === false)
	{
		return false;
	}
	$istring = strtolower(trim(substr($istring,0,$pos)));
	if(isset($all_properties[$istring]))
	{
		$this->log('Added semicolon to the end of declaration','Warning');
		return true;
	}
	return false;
}

 
function property_is_valid($property) {
    $all_properties =& $GLOBALS['csstidy']['all_properties'];
    return (isset($all_properties[$property]) && strpos($all_properties[$property],strtoupper($this->get_cfg('css_level'))) !== false );
}

}
?>
