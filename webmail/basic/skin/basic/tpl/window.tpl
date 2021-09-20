<!-- Webmail Basic -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{language}">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<title>{optional title}{title}{/optional}</title>
<link rel="icon" type="image/gif" href="../basic/favicon.gif"/>
{optional stylesheet}
<link rel="stylesheet" type="text/css" href="minimizer/index.php?style={dynamic stylesheet}{*::src},{/dynamic}none" />
{/optional}
</head>
<body{optional request::all::_n::p::main 'win.main.public'} class="public"{/optional}>
{optional javascript}
<script type="text/javascript" src="minimizer/index.php?script={dynamic javascript}{*::src},{/dynamic}none"></script>
{/optional}

{body}

{include ../basic/skin/basic/tpl/error.tpl}
{include ../basic/skin/basic/tpl/message.tpl}

</body>
</html>