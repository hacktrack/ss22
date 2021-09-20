<!DOCTYPE html 
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{language}">
<head>
{optional base}<base{optional base::target} target="{base::target}"{/optional}{optional base::href} href="{base::href}"{/optional}/>{/optional}
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=320; initial-scale=1.0; maximum-scale=1.0; user-scalable=1;"/>
<title>{optional title}{htmlspecialchars title}{/optional}</title>
<link rel="icon" type="image/gif" href="../favicon.gif"/>
<link rel="apple-touch-icon" href="../icon.png" />
<link sizes="64x64" href="../icon64.ico" rel="icon" />
<link sizes="16x16" href="../favicon.gif" rel="icon" />
{dynamic stylesheet}
<link rel="stylesheet" type="text/css" href="{.*::src}" />{/dynamic}
<link rel="apple-touch-icon-precomposed" href="../icon-precomposed.png" />
</head>
<body onload="addTokenParam();">
{optional message}<div id="notifier" class="message">{htmlspecialchars message::id}</div>{/optional}
{optional error}
<center>
	{include ../pda/skin/default/tpl/error.tpl}
</center>
{/optional}
{body}



{dynamic javascript}
<script type="text/javascript" src="{.*::src}"></script>{/dynamic}
</body>
</html>