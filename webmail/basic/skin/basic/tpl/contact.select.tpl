<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

<input type="submit" name="_a[page_both]" value="1" class="almostHidden"/>
<input type="hidden" name="_s[default_page]" value="{htmlspecialchars info::page}"/>

<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:6px;">
	{include ../basic/skin/default/tpl/grid/_list_bottom.tpl}
</div>

<table class="wsto" cellpadding="0" cellspacing="0">
	<tr>
		<td>
			<div class="left" style="margin-top:8px;">
				<input type="submit" class="fancyButton" name="_dlg[contact_select][process]" value="{lang::mail_compose::add_contacts}"/>
				<input type="submit" class="fancyButton" name="_dlg[cancel_select][process]" value="{lang::mail_compose::cancel}"/>
			</div>
		</td>
		<td>
			<div class="right" style="margin-top:6px;">
				{include ../basic/skin/default/tpl/grid/_list_top.tpl}
			</div>
		</td>
	</tr>
</table>

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer">






<div class="grid">
<div class="infoLine">{lang::contact_main::select_contacts}</div>
{optional info::template}
	{include info::template}
{/optional}
<fieldset class="into-bottom-line" style="padding-top:12px; .padding-top:4px;">
	<input type="submit" class="fancyButton" name="_dlg[contact_select][process]" value="{lang::mail_compose::add_contacts}"/>
	<input type="submit" class="fancyButton" name="_dlg[cancel_select][process]" value="{lang::mail_compose::cancel}"/>

	<input type="hidden" name="_dlg[contact_select][type]" value="select" />
	<input type="hidden" name="_dlg[contact_select][controller]" value="{dialog::controller}"/>
	<input type="hidden" name="_dlg[contact_select][action]" value="{dialog::action}"/>

	<input type="hidden" name="_dlg[cancel_select][type]" value="select"/>
	<input type="hidden" name="_dlg[cancel_select][controller]" value="{dialog::controller}"/>
	<input type="hidden" name="_dlg[cancel_select][action]" value="cancel_select"/>
</fieldset>
</div>





<div class="cleaner"></div>
</div>
</div>
</div>
</div>
</div>