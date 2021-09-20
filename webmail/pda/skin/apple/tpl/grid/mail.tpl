<form method="post" name="grid_mail" action="{info::link}">
<fieldset style="display:none;">
<input type="hidden" value="{info::controller}" name="_c"/>
<input type="hidden" value="{container::id}" name="container"/>
<input type="hidden" value="{container::type}" name="type"/>
<input type="submit" name="_a[enter_click]" value="{lang::general::refresh}"/>
</fieldset>
<!-- DG sort -->
<div class="grey">
	
	<input type="hidden"  name="_s[page_current]" value="{info::page}"/>
	
	<input type="checkbox" id="checkall" onclick="pdaCheckAll('{variable}',this.checked,'grid_mail');" />
		
	
	
	{optional buttons}
	<select name="multiple_mail_action_bottom">
	{dynamic buttons}<option value="{.*::name}" >{.*::label}</option>
	{/dynamic}
	</select>
	{/optional}
	
	<input type="submit" name="_a[multiple_mail_action_bottom]" class="button ico_go small" title="{lang::pda::go}" value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" onclick="return confirm_select([{dynamic buttons}{optional *::confirm}['{.*::name}','{.*::confirm}'],{/optional}{/dynamic}],document.grid_mail.multiple_mail_action_bottom);" />
	
</div>

<!-- DG body -->
<div class="mail_item" id="at_mail_grid">
    {dynamic items}
	<div class="{optional *::unread}unread{/optional} {optional *::priority}ico_priority_{.*::priority}{/optional}">
		<input type="checkbox" name="{variable}[{.*::id}]" value="{.*::id}"/>
		<a href="{.*::link}">
			<strong>{.*::address}{!optional *::address}{lang::grid_mail::no_address}{/optional}</strong>
			<span>{.*::subject}{!optional *::subject}{lang::grid_mail::no_subject}{/optional}</span>
			<b>{.*::aditional::size}</b><i>{.*::aditional::shortdate}</i>
		</a>
	</div>
	{/dynamic}
</div>

<!-- DG listing -->
{include ../pda/skin/apple/tpl/grid/_list.tpl}

<!-- DG toolbar -->

</form>
