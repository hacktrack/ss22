{include ../basic/skin/fresh/tpl/_toolbar.top_settings.responder.tpl}

<div class="body form">
	<input type="hidden" name="_c" value="settings"/>
	<input type="hidden" name="level" value="{optional property::level}{property::level}{/optional}{!optional property::level}user{/optional}"/>
	<input type="hidden" name="type" value="{request::all::dlg_type}"/>
	{optional property::domain}<input type="hidden" name="domain" value="{property::domain}"/>{/optional}
	{optional property::function}
	<input type="hidden" name="function[{property::storage}]" value="{property::function}"/>
	{/optional}
	

    {optional request::all::dlg_type 'add'}
	<input type="hidden" class="inp_btn" value="1" name="_a[norespond_save]"/>
    <h2>{lang::settings::responder}</h2>
	<table class="frmtbl">
		<tr>
			<th><label for="responder">{lang::settings::email}</label></th>
			<th><input id="responder" class="inp_text" type="text" name="{property::storage}[0][columns][0][value]" /></th>
			<td><input type="submit" class="inp_btn" value="{lang::grid::save}" name="_a[norespond_save]" /></td>
		</tr>
	</table>
	{/optional}


	{optional request::all::dlg_type 'edit'}
		{optional property::rows}
			<table class="frmtbl">
			{dynamic property::rows}

				{dynamic *::columns}
					{optional *::selected}
					<tr>
					    <th><label>{lang::settings::email}</label></th>
					    <th><input type="text" class="inp_text" name="{property::storage}[{.*::row}][columns][{.*::column}][value]" value="{.*::value}"/></th>
						<td><input type="submit" class="inp_btn" value="{lang::grid::save}" name="_a[norespond_save]"/></td>
					</tr>
					{/optional}

					{!optional *::selected}
					<input type="hidden" name="{property::storage}[{.*::row}][columns][{.*::column}][value]" value="{.*::value}"/>
					{/optional}
				{/dynamic}

				{optional *::selected}<tr><td colspan="3">&nbsp;</td></tr>{/optional}
				
			{/dynamic}
			</table>
		{/optional}
	{/optional}

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_settings.responder.tpl}