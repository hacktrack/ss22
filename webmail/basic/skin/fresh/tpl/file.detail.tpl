{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.detail.tpl}

<div class="body form">

{optional item::EVN_ID}
<input type="hidden" name="item[values][0][EVN_ID]" value="{item::EVN_ID}" />
<h2>{lang::files::file}</h2>
{/optional}

{!optional item::EVN_ID}
<h2>{lang::files::add}</h2>
{/optional}

<input type="hidden" name="items[{item::id}]"/>

<div>&nbsp;</div>
			{optional item::has_attachment}
				{dynamic item::attachments}
				{optional *::ATTTYPE 'F'}
					<div>
						<!--<input type="hidden" name="item[attachments][0][attachment][{htmlspecialchars *::ATTNAME}]" value=""/>-->
						<a class="file_link ico_{htmlspecialchars *::extension}" href="{.*::ATTURL}">{htmlspecialchars *::ATTNAME_DISPLAY}</a>
					</div>
				{/optional}
				{/dynamic}
			{/optional}
<div>&nbsp;</div>

<table class="frmtbl frmtbl100">
	<tr>
		<th>
			{lang::files::add}
			
		</th>
		<td>
			<input type="file" name="item[attachments][0][attachment][{htmlspecialchars item::file_id}]"/>
		</td>
	</tr>
{optional item::EVN_ID}
	<tr>
		<th class="th">{lang::event_detail::title}</th>
		<td class="td">
			<div class="">
			<input class="inp_text" type="text" name="item[values][0][EVNLOCATION]" class="w2"{optional item::EVNTITLE} value="{htmlspecialchars item::EVNLOCATION}"{/optional}/>
			</div>
		</td>
	</tr>
{/optional}
	<tr>
		<th class="th">{lang::event_detail::tags}</th>
		<td class="td">
			<div class="">
			<input class="inp_text" type="text" name="item[values][0][EVNTYPE]" class="w2"{optional item::EVNTYPE} value="{htmlspecialchars item::EVNTYPE}"{/optional}/>
			</div>
		</td>
	</tr>
	<tr>
		<th colspan="2">{lang::event_detail::notes}</th>
	</tr>
	<tr>
		<td colspan="2">
			{anchor::fileDescription}
		</td>
	</tr>
</table>

<label class="sharing clear" for="item[values][0][EVNSHARETYPE]">
	<input type="checkbox" id="item[values][0][EVNSHARETYPE]" name="item[values][0][EVNSHARETYPE]" {optional item::EVNSHARETYPE 'C'} checked="checked"{/optional}{!optional item::EVNSHARETYPE 'C'}{optional item::EVNSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix"/>
	{lang::event_detail::private}
</label>

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.detail.tpl}