{optional parseurl}
<div class="preview" id="{anchor preview}"></div>
{/optional}
{optional block}
<div class="block" id="{anchor block}"></div>
{/optional}
<div class="container">
	{optional handlers}
	<div class="button">
		<obj name="add" type="obj_button" css="big ico img add simple"></obj>
	</div>
	{/optional}
	<div class="inputs">
		<div>
			<obj name="label" type="obj_label"><title>{FORM_BUTTONS::REMOVE}</title><disabled>1</disabled></obj>
			{optional smiles_enabled}<obj name="smile" type="obj_button" css="simple transparent ico img smile"></obj>{/optional}
			{optional giphy_enabled}<obj name="giphy" type="obj_button" css="simple transparent ico img smile giphy"></obj>{/optional}
			<obj name="input" type="obj_text_mentions" css="noborder" tabindex="true"></obj>
		</div>
	</div>
</div>