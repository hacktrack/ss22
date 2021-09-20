<form method="post">

<input type="hidden" name="_c" value="settings"/>
<input type="hidden" name="level" value="{optional property::level}{property::level}{/optional}{!optional property::level}user{/optional}"/>
<input type="hidden" name="type" value="{request::all::dlg_type}"/>
{optional property::domain}<input type="hidden" name="domain" value="{property::domain}"/>{/optional}
{optional property::function}
<input type="hidden" name="function[{property::storage}]" value="{property::function}"/>
{/optional}
<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">
{optional request::all::dlg_type 'edit'}
<br />
<input type="submit" class="fancyButton" value="{lang::grid::save}" name="_a[personality_save]"/>
{/optional}
<input type="submit" class="fancyButton almostHidden" value="{lang::grid::save}" name="_a[personality_save]"/>
<input type="submit" class="fancyButton" value="{lang::grid::cancel}" name="_a[cancel]"/>
</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer">
	<fieldset>
		{optional request::all::dlg_type 'edit'}
			{optional property::rows}{dynamic property::rows}
			{optional *::selected}<fieldset>{/optional}
			{dynamic *::columns}
			{optional *::selected}
			<label>{lang::settings::person}</label>
			<input type="edit" name="{property::storage}[{.*::row}][columns][{.*::column}][value]" value="{.*::value}"/>
			{/optional}
			
			{!optional *::selected}
			<input type="hidden" name="{property::storage}[{.*::row}][columns][{.*::column}][value]" value="{.*::value}"/>
			{/optional}
			
			{/dynamic}
			{optional *::selected}</fieldset>{/optional}
			{/dynamic}
			{/optional}

		{/optional}
		{optional request::all::dlg_type 'add'}
		<label for="personalities" >{lang::settings::person}</label>
		<input id="personalities" class="input_big" type="text" name="personalities[0][columns][0][value]" />
		<input type="hidden" name="_a[personality_save]" value="{lang::grid::save}" />
		<input type="submit" name="_a[personality_save]" value="{lang::grid::save}" class="fancyButton" />
		{/optional}


	</fieldset>


</div>
</div>
</div>
</div>
</div>
</form>