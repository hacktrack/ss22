<?php

function compare_asc_name($a, $b) {
	if ($a[0] != $b[0])
	  return ($a[0] > $b[0]) ? 1 : -1;
  if ($a[1] == $b[1])
    return 0;
  else 
    return ($a[1] > $b[1]) ? -1 : 1;
}

function compare_asc_date($a, $b) {
	if ($a[0] != $b[0])
	  return ($a[0] > $b[0]) ? 1 : -1;
  if ($a[2] == $b[2])
    return 0;
  else 
    return ($a[2] > $b[2]) ? -1 : 1;
}

function compare_asc_size($a, $b) {
	if ($a[0] != $b[0])
	  return ($a[0] > $b[0]) ? 1 : -1;
  if ($a[3] == $b[3])
    return 0;
  else 
    return ($a[3] > $b[3]) ? -1 : 1;
}

function compare_desc_name($a, $b) {
	if ($a[0] != $b[0])
	  return ($a[0] > $b[0]) ? 1 : -1;
  if ($a[1] == $b[1])
    return 0;
  else 
    return ($a[1] > $b[1]) ? 1 : -1;
}

function compare_desc_date($a, $b) {
	if ($a[0] != $b[0])
	  return ($a[0] > $b[0]) ? 1 : -1;
  if ($a[2] == $b[2])
    return 0;
  else 
    return ($a[2] > $b[2]) ? 1 : -1;
}

function compare_desc_size($a, $b) {
	if ($a[0] != $b[0])
	  return ($a[0] > $b[0]) ? 1 : -1;
  if ($a[3] == $b[3])
    return 0;
  else 
    return ($a[3] > $b[3]) ? 1 : -1;
}


?>