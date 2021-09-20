<div iw-flex-grid="query 2 double-padding">
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{FULLTEXT_SEARCH::TITLE}</h3>
	<h4 class="form__block-title">
		{optional enabled}{FULLTEXT_SEARCH::CONFIGURED}:{/optional}
		{noptional enabled}{FULLTEXT_SEARCH::NOT_CONFIGURED}{/noptional}
	</h4>
	<div iw-flex-grid class="form-block">

	{optional enabled}
		{include inc_form}
		{
			"element_input": true,
			"input_type": "text",
			"input_placeholder_plain": "",
			"input_readonly": true,
			"label_text": "{FULLTEXT_SEARCH::INDEXER}",
			"name": "indexer",
			"item_class": "row"
		}
		{/include}
		{include inc_form}
		{
			"element_input": true,
			"input_type": "text",
			"input_placeholder_plain": "",
			"input_readonly": true,
			"label_text": "{FULLTEXT_SEARCH::SERVER}",
			"name": "server",
			"item_class": "row"
		}
		{/include}
		{include inc_form}
		{
			"element_input": true,
			"input_type": "text",
			"input_placeholder_plain": "",
			"input_readonly": true,
			"label_text": "{FULLTEXT_SEARCH::INDEXPATH}",
			"name": "indexpath",
			"item_class": "row"
		}
		{/include}
		{include inc_form}
		{
			"element_input": true,
			"input_type": "text",
			"input_placeholder_plain": "",
			"input_readonly": true,
			"label_text": "{FULLTEXT_SEARCH::DOCCONV}",
			"name": "docconv",
			"item_class": "row"
		}
		{/include}
	{/optional}

	<div iw-flex-cell class="form__item">
	</div>
	<div iw-flex-cell>
		<obj name="configure" type="obj_button" css="text primary" tabindex="true">
			<value>FULLTEXT_SEARCH::CONFIGURE</value>
		</obj>
	</div>
	</div>

</div>
</div>
