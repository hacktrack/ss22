<form method="post" action="{request::path}">
<div class="cover-b wsto quarantineBox">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

	<div>
		
			<div>
				<input type="hidden" name="_c" value="item" />
				<input type="hidden" name="items[{item::id}]" value="on"/>
				<input type="hidden" name="container" value="{container::id}"/>
				<input type="hidden" name="type" value="{container::type}"/>
				<input type="hidden" name="_s[id]" value="{container::id}"/>
				<input type="hidden" name="_s[type]" value="{container::type}"/>
				
				
				<input type="submit" name="_a[create]" value="{lang::quarantine::save}" class="fancyButton"/>
				<input type="submit" name="_a[cancel]" value="{lang::quarantine::cancel}" class="fancyButton"/>
			</div>
		
	</div>

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer ">



<div class="grid obj_datagrid2 right wsto">
	

	<table cellspacing="0" cellpadding="0">
		<tr><td colspan="2"><strong>{lang::quarantine::new_item}</strong></td></tr>
		<tr>
			<td>{lang::settings::email} :&nbsp;</td><td><input type="text" name="email" /></td>
		</tr>
	</table>

</div>

<div class="cleaner"></div>

</div>


</div>
</div>
</div>
</div>
</form>