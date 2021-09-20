{include ../basic/skin/fresh/tpl/_toolbar.top_settings.personality.tpl}

<input type="hidden" name="_c" value="settings"/>
<input type="hidden" name="level" value="{optional property::level}{property::level}{/optional}{!optional property::level}user{/optional}"/>
<input type="hidden" name="type" value="{request::all::dlg_type}"/>
{optional property::domain}<input type="hidden" name="domain" value="{property::domain}"/>{/optional}
{optional property::function}
<input type="hidden" name="function[{property::storage}]" value="{property::function}"/>
{/optional}

<div class="body form">

		{optional request::all::dlg_type 'edit'}
			{optional property::rows}
				<h2>{lang::settings::person_edit_header}</h2>
				<table class="frmtbl">
				{dynamic property::rows}
					<tr>
                        {dynamic *::columns}
							{optional *::selected}
							<th>{lang::settings::person}</th>
							<td><input type="text" class="inp_text" name="{property::storage}[{.*::row}][columns][{.*::column}][value]" value="{.*::value}"/></td>
							{/optional}

							{!optional *::selected}
							<input type="hidden" name="{property::storage}[{.*::row}][columns][{.*::column}][value]" value="{.*::value}"/>
							{/optional}
						{/dynamic}
					</tr>
				{/dynamic}
				</table>
			{/optional}
		{/optional}
		
		{optional request::all::dlg_type 'add'}
		<h2>{lang::settings::person_header}</h2>
		<table class="frmtbl">
			<tr>
				<th><label for="personalities"><strong>{lang::settings::person}:</strong></label></th>
				<td>
					<input id="personalities" class="inp_text" type="text" name="personalities[0][columns][0][value]" />
				</td>
			</tr>
			<tr><td colspan="2"><small>{lang::settings::person_description}</small></td></tr>
		</table>
		{/optional}
</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_settings.personality.tpl}