<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html><head>
<title>{title}</title>
<style>

{optional ltr}
*,div,body,table,tr,td,th{
direction: rtl !important;
}
{/optional}
body{
	{optional ltr}font-family: Verdana !important;{/optional}{!optional ltr}font-family: Helvetica CE, Arial CE, Helvetica, Arial, sans-serif;{/optional}
	font-size: 0.8em;
	padding: 10px;
}
table{
    cursor: default;
	border-collapse: collapse;
	empty-cells: show;
}
	table th{
		background-color: #ECE9D8;
		color: #000;
		text-align: left;
		text-indent: 5px;
		white-space: nowrap;
		border: 1px solid #D2CFBE;
		border-bottom-width: 3px;

		font-size: 0.9em;
		font-weight: normal;
	}
	table td{
		height:1.8em;
		text-indent: 5px;
		border: 1px solid #D2CFBE;
		font-size: 0.8em;
	}
h1{
	font-size: 1.2em;
}
h2{
	font-weight: bold;
	font-size: 1em;
	margin-bottom: 0.3em;
	
	color: #3B619C;
}
a.actionButton{
	border: 2px outset white;
	color: #000;
	text-decoration: none;
	text-indent: 0;
	background-color: #ECE9D8;
	padding: 0 2px;
	margin: 1px;
	white-space:nowrap;
}

a.actionButton:hover{
   border-style: inset;
}
a.actionButton:visited{
   border-style: inset;
   color:#AAA;
}


/* ???? */
.resultError{
	color: red;
	font-size: 17px;
	font-weight: bold;
}
.resultOk{
	color: green;
	font-size: 17px;
	font-weight: bold;
}
fieldset{
border:0px;
}
</style>

</head>

<body>
<h1>{title}</h1>
<p>{intro}</p>