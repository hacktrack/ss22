<?php
  define("ICON_FILE", "/dir/img/file.gif");
  define("ICON_DIRECTORY", "/dir/img/directory.gif");
  define("ICON_UP", "/dir/img/up.gif");

  function securepath($path) 
  { 
    if (preg_match("/(\.\.)/", $path) || preg_match("{(//)}", $path) || $path[0]=="/" || $path[0]=="\\") $path="";
    return $path;   
  }

  $lang = securepath($_GET["lang"]);

  require_once("lang/" . ($lang ? $lang : "en") . "/lang.php");
  require_once("compare.php");
?>