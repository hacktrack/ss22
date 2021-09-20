<form action="" method="post">

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

<!--
{optional request::get::p6}
<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:7px;">
	<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton" alt="{lang::confirmation::delete_event}"/>
</div>
{/optional}
-->

{include ../basic/skin/default/tpl/grid/_new_item_top.tpl}

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer notes_form">

	{optional item::EVN_ID}<input type="hidden" name="item[values][0][EVN_ID]" value="{item::EVN_ID}" />{/optional}
	<input type="hidden" name="items[{item::id}]"/>

	<input type="hidden" name="_c" value="{info::controller}" />
	<input type="hidden" name="container" value="{container::id}" />
	<input type="hidden" name="type" value="{container::type}" />

<table class="gridDetail">
	<tr>
		<th>{lang::event_detail::title}</th>
		<td>
			<input type="text" name="item[values][0][EVNTITLE]" class="w2"{optional item::EVNTITLE} value="{htmlspecialchars item::EVNTITLE}"{/optional}/>
		</td>
	</tr>
	<tr>
		<th>{lang::event_detail::category}</th>
		<td>
			<input type="text" class="w2" name="item[values][0][EVNTYPE]" {optional item::EVNTYPE} value="{item::EVNTYPE}"{/optional}/>
		</td>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr>
		<th colspan="2">{lang::event_detail::notes}</th>
	</tr>
	<tr>
		<td colspan="2">
			<textarea name=" item[notes][0][note][0][values][0][note_text]" class="wsto">{optional item::ADDONS::NOTE::NOTE_TEXT}{htmlspecialchars item::ADDONS::NOTE::NOTE_TEXT}{/optional}</textarea>
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<input type="checkbox" name="item[values][0][EVNSHARETYPE]" {optional item::EVNSHARETYPE 'C'} checked="checked"{/optional}{!optional item::EVNSHARETYPE 'C'}{optional item::EVNSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix"/>{lang::event_detail::private}
		</td>
	</tr>
</table>




<br />

<table>
<td>{lang::mail_compose::attachments}</td>
</table>

{dynamic item::aditional::attachments}
	<a href="{.*::ATTURL}" target="_blank">{htmlspecialchars *::ATTDESC} ({.*::ATTSIZE})</a><br />
{/dynamic}
<!--
<table>
	<tr>
		<td>
			<div class="fieldHolder" id="attachments">
				<div>
					<input type="file" name="item[attachments][]" size="45" id="attachments_first"/><input type="button" class="bfield submitField noJSHide rem" onclick="addFileField()" value="+" id="addFileField2" />
				</div>
			</div>
			
		</td>
	</tr>
</table>
-->




<div class="cleaner"></div>
</div>

{include ../basic/skin/default/tpl/grid/_new_item_bottom.tpl}

</div>
</div>
</div>
</div>


</form>