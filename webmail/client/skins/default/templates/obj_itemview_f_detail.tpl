<div class="tabform">
	<h2>{ITEMVIEW::DETAILS}</h2>

	<div class="info">
		<div class="sharing"><i>{ITEMVIEW::SHARING}:</i>{optional shared}<span class="shared"> {COMMON::ENABLED}</span>{/optional}{noptional shared}<span> {COMMON::DISABLED}</span>{/noptional}</div>
		{optional editing}<div class="sharing"><i>{ITEMVIEW::EDITING}:</i><span class="shared"> {COMMON::ENABLED}</span></div>{/optional}
		{optional password_protected}<div class="sharing"><span class="shared">{ITEMVIEW::PASSWORD_PROTECTED}</span></div>{/optional}
		<div><i>{ITEMVIEW::STATUS}:</i><span> {htmlspecialchars lock_info}</span></div>
		{optional mime}<div><i>{DATAGRID_ITEMS_VIEW::TYPE}:</i><span> {htmlspecialchars mime}</span></div>{/optional}
		<div><i>{DATAGRID_ITEMS_VIEW::EVN_MODIFIED}:</i><span> {date}</span></div>
		{optional created_by}<div><i>{DATAGRID_ITEMS_VIEW::EVN_CREATED_BY}:</i><span> {htmlspecialchars created_by}</span></div>{/optional}
		{optional modified_by}<div><i>{DATAGRID_ITEMS_VIEW::EVN_MODIFIED_BY}:</i><span> {htmlspecialchars modified_by}</span></div>{/optional}
		<div><i>{DATAGRID_ITEMS_VIEW::SIZE}:</i><span> {size}</span></div>
		<div><i>{ITEMVIEW::SECURITY}:</i><span> {htmlspecialchars security}</span></div>
	</div>

	<h2>{TAGS::TAGS}{optional has_rights}<a href="javascript: void(0);" class="itmtags">{FORM_BUTTONS::EDIT}</a>{/optional}</h2>

	{optional tags}
	<div class="tags">
	{dynamic tags}
	<a href="javascript: void(0);"{optional tags::*::tagcolor} style="background-color: {htmlspecialchars tags::*::tagcolor}; color: {tags::*::textcolor}"{/optional}>{htmlspecialchars tags::*::tagname}</a>
	{/dynamic}
	</div>
	{/optional}

	<h2>{NOTE::NOTE}{optional has_rights}<a href="javascript: void(0);" class="itmnote">{FORM_BUTTONS::EDIT}</a>{/optional}</h2>
	<pre>{optional note}{note}{/optional}</pre>

</div>
