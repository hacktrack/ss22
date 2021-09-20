<?php
 

 

class csstidy_optimise
{
     
    function __construct(&$css)
    {
        $this->parser    =& $css;
        $this->css       =& $css->css;
        $this->sub_value =& $css->sub_value;
        $this->at        =& $css->at;
        $this->selector  =& $css->selector;
        $this->property  =& $css->property;
        $this->value     =& $css->value;
    }

     
    function postparse()
    {
        if ($this->parser->get_cfg('preserve_css')) {
            return;
        }

        if ($this->parser->get_cfg('merge_selectors') == 2)
        {
            foreach ($this->css as $medium => $value)
            {
                $this->merge_selectors($this->css[$medium]);
            }
        }

        if ($this->parser->get_cfg('optimise_shorthands') > 0)
        {
            foreach ($this->css as $medium => $value)
            {
                foreach ($value as $selector => $value1)
                {
                    $this->css[$medium][$selector] = csstidy_optimise::merge_4value_shorthands($this->css[$medium][$selector]);

                    if ($this->parser->get_cfg('optimise_shorthands') < 2) {
                        continue;
                    }

                    $this->css[$medium][$selector] = csstidy_optimise::merge_bg($this->css[$medium][$selector]);
                    if (empty($this->css[$medium][$selector])) {
                        unset($this->css[$medium][$selector]);
                    }
                }
            }
        }
    }

     
    function value()
    {
        $shorthands =& $GLOBALS['csstidy']['shorthands'];

                 if(isset($shorthands[$this->property]))
        {
            $temp = csstidy_optimise::shorthand($this->value);              if($temp != $this->value)
            {
                $this->parser->log('Optimised shorthand notation ('.$this->property.'): Changed "'.$this->value.'" to "'.$temp.'"','Information');
            }
            $this->value = $temp;
        }

                 if($this->value != $this->compress_important($this->value))
        {
            $this->parser->log('Optimised !important','Information');
        }
    }

     
    function shorthands()
    {
        $shorthands =& $GLOBALS['csstidy']['shorthands'];

        if(!$this->parser->get_cfg('optimise_shorthands') || $this->parser->get_cfg('preserve_css')) {
            return;
        }

        if($this->property == 'background' && $this->parser->get_cfg('optimise_shorthands') > 1)
        {
            unset($this->css[$this->at][$this->selector]['background']);
            $this->parser->merge_css_blocks($this->at,$this->selector,csstidy_optimise::dissolve_short_bg($this->value));
        }
        if(isset($shorthands[$this->property]))
        {
            $this->parser->merge_css_blocks($this->at,$this->selector,csstidy_optimise::dissolve_4value_shorthands($this->property,$this->value));
            if(is_array($shorthands[$this->property]))
            {
                unset($this->css[$this->at][$this->selector][$this->property]);
            }
        }
    }

     
    function subvalue()
    {
        $replace_colors =& $GLOBALS['csstidy']['replace_colors'];

        $this->sub_value = trim($this->sub_value);
        if($this->sub_value == '')          {
            return;
        }

        $important = '';
        if(csstidy::is_important($this->sub_value))
        {
            $important = '!important';
        }
        $this->sub_value = csstidy::gvw_important($this->sub_value);

                 if($this->property == 'font-weight' && $this->parser->get_cfg('compress_font-weight'))
        {
            if($this->sub_value == 'bold')
            {
                $this->sub_value = '700';
                $this->parser->log('Optimised font-weight: Changed "bold" to "700"','Information');
            }
            else if($this->sub_value == 'normal')
            {
                $this->sub_value = '400';
                $this->parser->log('Optimised font-weight: Changed "normal" to "400"','Information');
            }
        }

        $temp = $this->compress_numbers($this->sub_value);
        if($temp != $this->sub_value)
        {
            if(strlen($temp) > strlen($this->sub_value)) {
                $this->parser->log('Fixed invalid number: Changed "'.$this->sub_value.'" to "'.$temp.'"','Warning');
            } else {
                $this->parser->log('Optimised number: Changed "'.$this->sub_value.'" to "'.$temp.'"','Information');
            }
            $this->sub_value = $temp;
        }
        if($this->parser->get_cfg('compress_colors'))
        {
            $temp = $this->cut_color($this->sub_value);
            if($temp !== $this->sub_value)
            {
                if(isset($replace_colors[$this->sub_value])) {
                    $this->parser->log('Fixed invalid color name: Changed "'.$this->sub_value.'" to "'.$temp.'"','Warning');
                } else {
                    $this->parser->log('Optimised color: Changed "'.$this->sub_value.'" to "'.$temp.'"','Information');
                }
                $this->sub_value = $temp;
            }
        }
        $this->sub_value .= $important;
    }

     
    function shorthand($value)
    {
        $important = '';
        if(csstidy::is_important($value))
        {
            $values = csstidy::gvw_important($value);
            $important = '!important';
        }
        else $values = $value;

        $values = explode(' ',$values);
        switch(count($values))
        {
            case 4:
            if($values[0] == $values[1] && $values[0] == $values[2] && $values[0] == $values[3])
            {
                return $values[0].$important;
            }
            elseif($values[1] == $values[3] && $values[0] == $values[2])
            {
                return $values[0].' '.$values[1].$important;
            }
            elseif($values[1] == $values[3])
            {
                return $values[0].' '.$values[1].' '.$values[2].$important;
            }
            break;

            case 3:
            if($values[0] == $values[1] && $values[0] == $values[2])
            {
                return $values[0].$important;
            }
            elseif($values[0] == $values[2])
            {
                return $values[0].' '.$values[1].$important;
            }
            break;

            case 2:
            if($values[0] == $values[1])
            {
                return $values[0].$important;
            }
            break;
        }

        return $value;
    }

     
    function compress_important(&$string)
    {
        if(csstidy::is_important($string))
        {
            $string = csstidy::gvw_important($string) . '!important';
        }
        return $string;
    }

     
    function cut_color($color)
    {
        $replace_colors =& $GLOBALS['csstidy']['replace_colors'];

                 if(strtolower(substr($color,0,4)) == 'rgb(')
        {
            $color_tmp = substr($color,4,strlen($color)-5);
            $color_tmp = explode(',',$color_tmp);
            for ( $i = 0; $i < count($color_tmp); $i++ )
            {
                $color_tmp[$i] = trim ($color_tmp[$i]);
                if(substr($color_tmp[$i],-1) == '%')
                {
                    $color_tmp[$i] = round((255*$color_tmp[$i])/100);
                }
                if($color_tmp[$i]>255) $color_tmp[$i] = 255;
            }
            $color = '#';
            for ($i = 0; $i < 3; $i++ )
            {
                if($color_tmp[$i]<16) {
                    $color .= '0' . dechex($color_tmp[$i]);
                } else {
                    $color .= dechex($color_tmp[$i]);
                }
            }
        }

                 if(isset($replace_colors[strtolower($color)]))
        {
            $color = $replace_colors[strtolower($color)];
        }

                 if(strlen($color) == 7)
        {
            $color_temp = strtolower($color);
            if($color_temp{0} == '#' && $color_temp{1} == $color_temp{2} && $color_temp{3} == $color_temp{4} && $color_temp{5} == $color_temp{6})
            {
                $color = '#'.$color{1}.$color{3}.$color{5};
            }
        }

        switch(strtolower($color))
        {
             
            case 'black': return '#000';
            case 'fuchsia': return '#F0F';
            case 'white': return '#FFF';
            case 'yellow': return '#FF0';

             
            case '#800000': return 'maroon';
            case '#ffa500': return 'orange';
            case '#808000': return 'olive';
            case '#800080': return 'purple';
            case '#008000': return 'green';
            case '#000080': return 'navy';
            case '#008080': return 'teal';
            case '#c0c0c0': return 'silver';
            case '#808080': return 'gray';
            case '#f00': return 'red';
        }

        return $color;
    }

     
    function compress_numbers($subvalue)
    {
        $units =& $GLOBALS['csstidy']['units'];
        $unit_values =& $GLOBALS['csstidy']['unit_values'];
        $color_values =& $GLOBALS['csstidy']['color_values'];

                 if($this->property == 'font')
        {
            $temp = explode('/',$subvalue);
        }
        else
        {
            $temp = array($subvalue);
        }
        for ($l = 0; $l < count($temp); $l++)
        {
                         if (!(strlen($temp[$l]) > 0 && ( is_numeric($temp[$l]{0}) || $temp[$l]{0} == '+' || $temp[$l]{0} == '-' ) ))
            {
                continue;
            }

                         if (in_array($this->property, $color_values))
            {
                $temp[$l] = '#'.$temp[$l];
            }

            if (floatval($temp[$l]) == 0)
            {
                $temp[$l] = '0';
            }
            else
            {
                $unit_found = FALSE;
                for ($m = 0, $size_4 = count($units); $m < $size_4; $m++)
                {
                    if (strpos(strtolower($temp[$l]),$units[$m]) !== FALSE)
                    {
                        $temp[$l] = floatval($temp[$l]).$units[$m];
                        $unit_found = TRUE;
                        break;
                    }
                }
                if (!$unit_found && in_array($this->property,$unit_values,TRUE))
                {
                    $temp[$l] = floatval($temp[$l]).'px';
                }
                else if (!$unit_found)
                {
                    $temp[$l] = floatval($temp[$l]);
                }
                                 if (abs(floatval($temp[$l])) < 1) {
                    if (floatval($temp[$l]) < 0) {
                        $temp[$l] = '-' . substr($temp[$l], 2);
                    } else {
                        $temp[$l] = substr($temp[$l], 1);
                    }
                }
            }
        }

        return ((count($temp) > 1) ? $temp[0].'/'.$temp[1] : $temp[0]);
    }

     
    function merge_selectors(&$array)
    {
        $css = $array;
        foreach($css as $key => $value)
        {
            if(!isset($css[$key]))
            {
                continue;
            }
            $newsel = '';

                         $keys = array();
                         foreach($css as $selector => $vali)
            {
                if($selector == $key)
                {
                    continue;
                }

                if($css[$key] === $vali)
                {
                    $keys[] = $selector;
                }
            }

            if(!empty($keys))
            {
                $newsel = $key;
                unset($css[$key]);
                foreach($keys as $selector)
                {
                    unset($css[$selector]);
                    $newsel .= ','.$selector;
                }
                $css[$newsel] = $value;
            }
        }
        $array = $css;
    }

     
    function dissolve_4value_shorthands($property,$value)
    {
        $shorthands =& $GLOBALS['csstidy']['shorthands'];
        if(!is_array($shorthands[$property]))
        {
            $return[$property] = $value;
            return $return;
        }

        $important = '';
        if(csstidy::is_important($value))
        {
            $value = csstidy::gvw_important($value);
            $important = '!important';
        }
        $values = explode(' ',$value);


        $return = array();
        if(count($values) == 4)
        {
            for($i=0;$i<4;$i++)
            {
                $return[$shorthands[$property][$i]] = $values[$i].$important;
            }
        }
        elseif(count($values) == 3)
        {
            $return[$shorthands[$property][0]] = $values[0].$important;
            $return[$shorthands[$property][1]] = $values[1].$important;
            $return[$shorthands[$property][3]] = $values[1].$important;
            $return[$shorthands[$property][2]] = $values[2].$important;
        }
        elseif(count($values) == 2)
        {
            for($i=0;$i<4;$i++)
            {
                $return[$shorthands[$property][$i]] = (($i % 2 != 0)) ? $values[1].$important : $values[0].$important;
            }
        }
        else
        {
            for($i=0;$i<4;$i++)
            {
                $return[$shorthands[$property][$i]] = $values[0].$important;
            }
        }

        return $return;
    }

     
    function explode_ws($sep,$string)
    {
        $status = 'st';
        $to = '';

        $output = array();
        $num = 0;
        for($i = 0, $len = strlen($string);$i < $len; $i++)
        {
            switch($status)
            {
                case 'st':
                if($string{$i} == $sep && !csstidy::escaped($string,$i))
                {
                    ++$num;
                }
                elseif($string{$i} == '"' || $string{$i} == '\'' || $string{$i} == '(' && !csstidy::escaped($string,$i))
                {
                    $status = 'str';
                    $to = ($string{$i} == '(') ? ')' : $string{$i};
                    (isset($output[$num])) ? $output[$num] .= $string{$i} : $output[$num] = $string{$i};
                }
                else
                {
                    (isset($output[$num])) ? $output[$num] .= $string{$i} : $output[$num] = $string{$i};
                }
                break;

                case 'str':
                if($string{$i} == $to && !csstidy::escaped($string,$i))
                {
                    $status = 'st';
                }
                (isset($output[$num])) ? $output[$num] .= $string{$i} : $output[$num] = $string{$i};
                break;
            }
        }

        if(isset($output[0]))
        {
            return $output;
        }
        else
        {
            return array($output);
        }
    }

     
    function merge_4value_shorthands($array)
    {
        $return = $array;
        $shorthands =& $GLOBALS['csstidy']['shorthands'];

        foreach($shorthands as $key => $value)
        {
            if(isset($array[$value[0]]) && isset($array[$value[1]])
            && isset($array[$value[2]]) && isset($array[$value[3]]) && $value !== 0)
            {
                $return[$key] = '';

                $important = '';
                for($i = 0; $i < 4; $i++)
                {
                    $val = $array[$value[$i]];
                    if(csstidy::is_important($val))
                    {
                        $important = '!important';
                        $return[$key] .= csstidy::gvw_important($val).' ';
                    }
                    else
                    {
                        $return[$key] .= $val.' ';
                    }
                    unset($return[$value[$i]]);
                }
                $return[$key] = csstidy_optimise::shorthand(trim($return[$key].$important));
            }
        }
        return $return;
    }

     
    function dissolve_short_bg($str_value)
    {
        $background_prop_default =& $GLOBALS['csstidy']['background_prop_default'];
        $repeat = array('repeat','repeat-x','repeat-y','no-repeat','space');
        $attachment = array('scroll','fixed','local');
        $clip = array('border','padding');
        $origin = array('border','padding','content');
        $pos = array('top','center','bottom','left','right');
        $important = '';
        $return = array('background-image' => NULL,'background-size' => NULL,'background-repeat' => NULL,'background-position' => NULL,'background-attachment'=>NULL,'background-clip' => NULL,'background-origin' => NULL,'background-color' => NULL);

        if(csstidy::is_important($str_value))
        {
            $important = ' !important';
            $str_value = csstidy::gvw_important($str_value);
        }

        $str_value = csstidy_optimise::explode_ws(',',$str_value);
        for($i = 0; $i < count($str_value); $i++)
        {
            $have['clip'] = FALSE; $have['pos'] = FALSE;
            $have['color'] = FALSE; $have['bg'] = FALSE;

            $str_value[$i] = csstidy_optimise::explode_ws(' ',trim($str_value[$i]));

            for($j = 0; $j < count($str_value[$i]); $j++)
            {
                if($have['bg'] === FALSE && (substr($str_value[$i][$j],0,4) == 'url(' || $str_value[$i][$j] === 'none'))
                {
                    $return['background-image'] .= $str_value[$i][$j].',';
                    $have['bg'] = TRUE;
                }
                elseif(in_array($str_value[$i][$j],$repeat,TRUE))
                {
                    $return['background-repeat'] .= $str_value[$i][$j].',';
                }
                elseif(in_array($str_value[$i][$j],$attachment,TRUE))
                {
                    $return['background-attachment'] .= $str_value[$i][$j].',';
                }
                elseif(in_array($str_value[$i][$j],$clip,TRUE) && !$have['clip'])
                {
                    $return['background-clip'] .= $str_value[$i][$j].',';
                    $have['clip'] = TRUE;
                }
                elseif(in_array($str_value[$i][$j],$origin,TRUE))
                {
                    $return['background-origin'] .= $str_value[$i][$j].',';
                }
                elseif($str_value[$i][$j]{0} == '(')
                {
                    $return['background-size'] .= substr($str_value[$i][$j],1,-1).',';
                }
                elseif(in_array($str_value[$i][$j],$pos,TRUE) || is_numeric($str_value[$i][$j]{0}) || $str_value[$i][$j]{0} === NULL)
                {
                    $return['background-position'] .= $str_value[$i][$j];
                    if(!$have['pos']) $return['background-position'] .= ' '; else $return['background-position'].= ',';
                    $have['pos'] = TRUE;
                }
                elseif(!$have['color'])
                {
                    $return['background-color'] .= $str_value[$i][$j].',';
                    $have['color'] = TRUE;
                }
            }
        }

        foreach($background_prop_default as $bg_prop => $default_value)
        {
            if($return[$bg_prop] !== NULL)
            {
                $return[$bg_prop] = substr($return[$bg_prop],0,-1).$important;
            }
            else $return[$bg_prop] = $default_value.$important;
        }
        return $return;
    }

     
    function merge_bg($input_css)
    {
        $background_prop_default =& $GLOBALS['csstidy']['background_prop_default'];
                 $number_of_values = @max(count(csstidy_optimise::explode_ws(',',$input_css['background-image'])),count(csstidy_optimise::explode_ws(',',$input_css['background-color'])),1);
                 $bg_img_array = @csstidy_optimise::explode_ws(',',csstidy::gvw_important($input_css['background-image']));
        $new_bg_value = '';
        $important = '';

        for($i = 0; $i < $number_of_values; $i++)
        {
            foreach($background_prop_default as $bg_property => $default_value)
            {
                                 if(!isset($input_css[$bg_property]))
                {
                    continue;
                }

                $cur_value = $input_css[$bg_property];

                                 if((!isset($bg_img_array[$i]) || $bg_img_array[$i] === 'none')
                    && ($bg_property === 'background-size' || $bg_property === 'background-position'
                    || $bg_property === 'background-attachment' || $bg_property === 'background-repeat'))
                {
                    continue;
                }

                                 if(csstidy::is_important($cur_value))
                {
                    $important = ' !important';
                    $cur_value = csstidy::gvw_important($cur_value);
                }

                                 if($cur_value === $default_value)
                {
                    continue;
                }

                $temp = csstidy_optimise::explode_ws(',',$cur_value);

                if(isset($temp[$i]))
                {
                    if($bg_property == 'background-size')
                    {
                        $new_bg_value .= '('.$temp[$i].') ';
                    }
                    else
                    {
                        $new_bg_value .= $temp[$i].' ';
                    }
                }
            }

            $new_bg_value = trim($new_bg_value);
            if($i != $number_of_values-1) $new_bg_value .= ',';
        }

                 foreach($background_prop_default as $bg_property => $default_value)
        {
            unset($input_css[$bg_property]);
        }

                 if($new_bg_value !== '') $input_css['background'] = $new_bg_value.$important;

        return $input_css;
    }
}
?>