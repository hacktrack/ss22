{optional extended}
<div class="ico img loader buttons" id="{anchor loader}">
	<a id="{anchor loader}" unselectable="on"><span>&nbsp;</span></a>
</div>
{/optional}
<div class="filter buttons" id="{anchor buttons}">
	{noptional m}<span class="m mail" id="{anchor M}"></span>{/noptional}
	{noptional i}<span class="i teamchat" id="{anchor I}"></span>{/noptional}
	{optional conference}<span class="w conference" id="{anchor W}"></span>{/optional}
	{noptional e}<span class="e calendar" id="{anchor E}"></span>{/noptional}
	{noptional c}<span class="c contact" id="{anchor C}"></span>{/noptional}
	{noptional f}<span class="f file" id="{anchor F}"></span>{/noptional}
	{noptional t}<span class="t task" id="{anchor T}"></span>{/noptional}
	{noptional n}<span class="n note" id="{anchor N}"></span>{/noptional}
	{noptional b}<span class="b" id="{anchor B}"></span>{/noptional}
	<span class="x hidden" id="{anchor X}"></span>
	{optional alfresco}<span class="k hidden" id="{anchor K}"></span>{/optional}
</div>
{optional extended}
<div class="com buttons" id="{anchor com}">
	{optional sip}<span class="sip" id="gui.frm_main.filter#sip"></span>{/optional}
</div>
{optional quota}<div class="quota" id="{anchor quota}"></div>{/optional}
{/optional}
