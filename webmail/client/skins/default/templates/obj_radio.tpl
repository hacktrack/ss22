{dynamic row}
	<div><input type="radio" id="{_ins}{row::*::key}" name="{_ins}" value="{row::*::value}" />{optional row::*::label}<label for="{_ins}{row::*::key}">{row::*::label}</label>{/optional}</div>
{/dynamic}