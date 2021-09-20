<form>
<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">
<input type="hidden" name="_c" value="settings"/>
<input type="hidden" name="level" value="{property::level}"/>
<input type="hidden" name="section" value="{property::id}"/>
{optional property::domain}<input type="hidden" name="domain" value="{property::domain}"/>{/optional}
<input type="hidden" name="_c" value="settings"/>
<br />
</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer">

{dynamic sections}
<div id="settings_box">
	<div>
		<div id="settings_{*::id}" class="settings_block"{optional *::icon} style="background-image:url('{*::icon}')"{/optional}>
			<div>
				<h5>
					<a href="{*::link}">{*::label}</a>
				</h5>
				<p>
					{*::description}
				</p>
			</div>
		</div>
	</div>
</div>
{/dynamic}

</div>
</div>
</div>
</div>
</div>
</form>