<div class="body">

<input type="hidden" name="_c" value="settings"/>
<input type="hidden" name="level" value="{property::level}"/>
<input type="hidden" name="section" value="{property::id}"/>
{optional property::domain}<input type="hidden" name="domain" value="{property::domain}"/>{/optional}
<input type="hidden" name="_c" value="settings"/>

{dynamic sections}
<div id="settings_box">
	<div>
		<div id="settings_{.*::id}" class="settings_block"{optional *::icon} style="background-image:url('{.*::icon}')"{/optional}>
			<div>
				<h5>
					<a href="{.*::link}">{.*::label}</a>
				</h5>
				<p>
					{.*::description}
				</p>
			</div>
		</div>
	</div>
</div>
{/dynamic}

</div>