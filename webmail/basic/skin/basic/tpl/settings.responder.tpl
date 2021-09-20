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
<br />
<input type="submit" class="fancyButton almostHidden" value="{lang::grid::save}" name="_a[norespond_save]"/>
<input type="submit" class="fancyButton" value="{lang::grid::cancel}" name="_a[cancel]"/>
</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer">
	<div>
		{optional request::all::dlg_type 'edit'}
			{optional property::rows}{dynamic property::rows}
			{optional *::selected}<fieldset>{/optional}
			{dynamic *::columns}
			{optional *::selected}
			<label>{lang::settings::email}</label>
			<input type="text" name="{property::storage}[{.*::row}][columns][{.*::column}][value]" value="{.*::value}"/>
			<input type="submit" class="fancyButton" value="{lang::grid::save}" name="_a[norespond_save]"/>
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
		<fieldset>
			<legend>{lang::settings::responder}</legend>
			<label for="responder" >{lang::settings::email}</label>
			<input id="responder" type="text" name="{property::storage}[0][columns][0][value]" />
			<input type="hidden" class="fancyButton" value="1" name="_a[norespond_save]"/>
			<input type="submit" class="fancyButton" value="{lang::grid::save}" name="_a[norespond_save]"/>
		</fieldset>
		{/optional}


	</div>


</div>
</div>
</div>
</div>
</div>
</form>