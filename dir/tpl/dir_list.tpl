<html>

<head>

  <meta http-equiv="content-type" content="text/html; charset=utf-8" />  <title>{dir_name} - {htmlspecialchars lang::dir_list}</title>
  <link rel="stylesheet" type="text/css" href="{proto}{server_name}/dir/tpl/dir_list.css" />

</head>

<body>
	<table cellpadding="0" cellspacing="0">
		<tr>
			<th colspan="4">
				<span class="heading">Index of "{dir_name}"</span>
			</th>
		</tr>
		<tr>
			<th colspan="2" class="row_left_align">
				<a href="{proto}{rawurlencode host_name}:{port}{dir_name}{slash}?sort_by=name&sort_dir={sort_dir}">{htmlspecialchars lang::file_name}</a>
			</th>
			<th class="date">
				<a href="{proto}{rawurlencode host_name}:{port}{dir_name}{slash}?sort_by=date&sort_dir={sort_dir}">{htmlspecialchars lang::file_date}</a>
			</th>
			<th class="numbers size">
				<a href="{proto}{rawurlencode host_name}:{port}{dir_name}{slash}?sort_by=size&sort_dir={sort_dir}">{htmlspecialchars lang::file_size}</a>
			</th>
		</tr>
		{dynamic dir_up}
		<tr class="{optional *::bold}bold{/optional}">
			<td class="firstColumn"><a href="{proto}{rawurlencode host_name}:{port}{.*::path}"><img class="img_no_border" src="{proto}{server_name}{.*::icon}" /></a></td>
			<td class="name"><a href="{proto}{rawurlencode host_name}:{port}{.*::path}">{htmlspecialchars lang::dir_parent}</a></td>
			<td></td>
			<td></td>
		</tr>
		{/dynamic}
		{dynamic file}
		<tr class="{optional *::bold}bold{/optional}">
			<td class="firstColumn"><a href="{proto}{rawurlencode host_name}:{port}{htmlspecialchars dir_name}{slash}{htmlspecialchars .*::name}"><img border="0" src="{proto}{server_name}{.*::icon}" /></a></td>
			<td class="name"><a href="{proto}{rawurlencode host_name}:{port}{htmlspecialchars dir_name}{slash}{htmlspecialchars .*::name}">{htmlspecialchars *::name}</a></td>
			<td class="date">{.*::date}</td>
			<td class="numbers size">{.*::size}</td>
		</tr>
		{/dynamic}
	</table>

</body>

</html>
