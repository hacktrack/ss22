{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.detail.tpl}

<div class="body form">

{optional item::EVN_ID}
<input type="hidden" name="item[values][0][EVN_ID]" value="{item::EVN_ID}" />
<h2>{lang::notes_detail::note}</h2>
{/optional}

{!optional item::EVN_ID}
<h2>{lang::notes::add}</h2>
{/optional}

<input type="hidden" name="items[{item::id}]"/>

<table class="frmtbl frmtbl100">
	<tr>
		<th class="th">{lang::event_detail::title}</th>
		<td class="td">
			<div class="inp_text">
			<input class="inp_text" type="text" name="item[values][0][EVNTITLE]" class="w2"{optional item::EVNTITLE} value="{htmlspecialchars item::EVNTITLE}"{/optional}/>
			</div>
		</td>
	</tr>
	<tr>
		<th>{lang::event_detail::tags}</th>
		<td>
            <div class="inp_text">
			<input class="inp_text" type="text" class="w2" name="item[values][0][EVNTYPE]" {optional item::EVNTYPE} value="{item::EVNTYPE}"{/optional}/>
			</div>
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<tr>
		<th colspan="2">{lang::event_detail::notes}</th>
	</tr>
	<tr>
		<td colspan="2">
			{anchor::noteText}
		</td>
	</tr>
{optional item::aditional::attachments}
	<tr>
		<th colspan="2">{lang::mail_compose::attachments}</th>
	</tr>
	{dynamic item::aditional::attachments}
	<tr>
		<td colspan="2" class="attachmentLinkBox"><a href="{.*::ATTURL}" target="_blank" class="ico_{htmlspecialchars *::extension}">{htmlspecialchars *::ATTDESC} ({.*::ATTSIZE})</a></td>
	<tr>
	{/dynamic}
{/optional}
</table>

<label class="sharing clear" for="item[values][0][EVNSHARETYPE]">
	<input type="checkbox" id="item[values][0][EVNSHARETYPE]" name="item[values][0][EVNSHARETYPE]" {optional item::EVNSHARETYPE 'C'} checked="checked"{/optional}{!optional item::EVNSHARETYPE 'C'}{optional item::EVNSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix"/>
	{lang::event_detail::private}
</label>

</div>

{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.detail.tpl}