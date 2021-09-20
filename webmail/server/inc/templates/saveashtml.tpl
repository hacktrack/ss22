<html>
	<head>
		<title>{subject}</title>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">
		<style>
			div.iw_mail_header{
				display: block!important;
				border-bottom: 2px solid black!important;
				padding: 0 0 0.5em!important;
				margin: 0 0 1em!important;

				font-family: Tahoma, Helvetica, sans-serif!important;
				color: black!important;
				background: white!important;
			}
			div.iw_mail_header h1{
				font-size: 1.1em!important;
				margin: 0.2em 0 0.5em!important;
				padding: 0!important;
			}
			div.iw_mail_header table{
				margin: 0!important;
				padding: 0!important;
				width: 100%!important;
				font-size: 0.8em!important;
				border-collapse: collapse!important;
			}
			div.iw_mail_header table th{
				text-align: left!important;
				padding: 0 1em 0 0!important;
				width: 0;
				white-space: nowrap!important;
				vertical-align: top!important;
			}
			div.iw_mail_header table td{
				width: 100%!important;
			}
		</style>
	</head>
	<body>
		<div class="iw_mail_header">
		<h1>{subject}</h1>
		<table>
			<tr>
				<th>{language::email::from}</th><td>{from}</td>
			</tr>
			<tr>
				<th>{language::email::to}</th><td>{to}</td>
			</tr>
			<tr>
				<th>{language::email::date}</th><td>{date}</td>
			</tr>{optional attachments}
			<tr>
				<th colspan="2">&nbsp;</th>
			</tr>
			<tr>
				<th colspan="2">{language::attachment::attachments}</th>
			</tr>
			<tr>
				<td colspan="2">{dynamic attachments}{*::name} ({*::size}kB); {/dynamic}</td>
			</tr>{/optional}
		</table>
		</div>

		<div>
{html}
		</div>
	</body>
</html>