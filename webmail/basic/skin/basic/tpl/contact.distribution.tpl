<form method="post" action="">

<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:7px; z-index:10000">

	{optional item::ITM_ID}
		{optional request::get::distribution_contact}
			<input type="submit" name="_a[contact_save]" value="{lang::mail_main::save}" class="absoluteHide"/>
		{/optional}
		{!optional request::get::distribution_contact}
			<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton" alt="{lang::confirmation::delete_contact_distribution}"/>
		{/optional}
		{optional request::get::distribution_contact}
			{optional request::all::action}
				<a href="{stornoLink}" class="fancyButton right">{lang::contact_main::cancel}</a>
			{/optional}
			{!optional request::all::action}
				<input class="fancyButton right" type="submit" name="_a[cancel_distrib]" value="{lang::contact_main::cancel}"/>
			{/optional}
		{/optional}
	{/optional}
	{!optional item::ITM_ID}
			{optional request::all::action}
				<a href="{stornoLink}" class="fancyButton right">{lang::contact_main::cancel}</a>
			{/optional}
			{!optional request::all::action}
				<input class="fancyButton right" type="submit" name="_a[cancel_distrib]" value="{lang::contact_main::cancel}"/>
			{/optional}
	{/optional}
</div>
<div class="into-bottom-line" style="padding-left:25px; padding-top:12px; .padding-top:7px; z-index:10000">
{!optional request::all::action}
	{optional item::ITM_ID}
		<input type="submit" name="_a[edit]" value="{lang::mail_main::save}" class="fancyButton"/>
	{/optional}
	{!optional item::ITM_ID}
		<input type="submit" name="_a[create]" value="{lang::mail_main::save}" class="fancyButton"/>
	{/optional}
{/optional}
{optional request::all::action}
	<input type="submit" name="_a[contact_save]" value="{lang::mail_main::save}" class="fancyButton left"/>
{/optional}
</div>

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

<input type="hidden" name="distribution" value="1" />
<input type="hidden" name="_dlg[contact_select][actions]" value="contacts_distrib" />
<input type="hidden" name="_dlg[contact_select][referer]" value="contact.distribution" />
<input type="hidden" name="_dlg[contact_select][target]" value="content" />
<input type="hidden" name="_dlg[contact_select][controller]" value="item" />
<input type="hidden" name="_dlg[contact_select][parameters][all][_s][id]" value="{settings::default_folders::contacts}" />
<input type="hidden" name="_dlg[contact_select][parameters][all][_s][filter]" value="ITMCLASS &lt;&gt; 'L'" />

{include ../basic/skin/default/tpl/grid/_contact.view.tpl}

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer contact_form_distribution">

	<div class="p10">
		<input type="hidden" name="item[values][0][ITMCLASS]" value="L" />
		{optional item::ITM_ID}
		<input type="hidden" name="item[values][0][ITM_ID]" value="{item::ITM_ID}" />
		<input type="hidden" name="items[{item::ITM_ID}]"/>
		{/optional}

{optional request::get::distribution_contact}
<table class="gridDetail">
	<tr>
		<td>
		<strong>{optional request::all::action 'edit'}{lang::contact_main::edit}{/optional}{!optional request::all::action 'edit'}{lang::contact_main::add_new}{/optional}</strong>
		</td>
	</tr>
	<tr>
		<td>

	{optional request::all::action 'edit'}
	{dynamic item::ADDONS::LOCATION}
		{optional *::_SELECTED}
	<fieldset>
		<table class="gridDetail" celspacing="0" celpadding="0">
			<tr>
				<th>{lang::contact_main::contact_name}</th>
				<td>
					<input type="text" name="edit[{.*::LCT_ID}][description]" value="{optional *::LCTDESCRIPTION}{.*::LCTDESCRIPTION}{/optional}" />
				</td>
			</tr>
			<tr>
				<th>{lang::contact_main::email}</th>
				<td>
					<input type="text" name="edit[{.*::LCT_ID}][email]" value="{optional *::LCTEMAIL1}{.*::LCTEMAIL1}{/optional}"/>
				</td>
			</tr>
		</table>
	</fieldset>
		{/optional}
	{/dynamic}
	{/optional}

	{optional request::all::action 'add'}
		<table class="gridDetail" celspacing="0" celpadding="0">
			<tr>
				<th>{lang::contact_main::contact_name}</th>
				<td>
					<input type="text" name="edit[new][description]"/>
					<input type="hidden" id="action_EN"/>
				</td>
			</tr>
			<tr>
				<th>{lang::contact_main::email}</th>
				<td>
					<input type="text" name="edit[new][email]"/>
				</td>
			</tr>
		</table>
	{/optional}

		</td>
	</tr>
	<tr>
		<td>
			<input type="hidden" name="action" value="{request::all::action}" />
			<input class="fancyButton" type="submit" value="{optional contact_email}{lang::contact_main::edit}{/optional}{!optional contact_email}{lang::contact_main::save}{/optional}" name="_a[contact_save]"/>
		</td>
	</tr>
</table>
{/optional}


{optional request::get::distribution_contact}
	<input type="hidden" name="item[values][0][ITMCLASSIFYAS]" value="{optional item::ITMCLASSIFYAS}{item::ITMCLASSIFYAS}{/optional}{optional request::get::cname}{request::get::cname}{/optional}" />
	<input type="hidden" name="item[values][0][ITMCATEGORY]" {optional item::ITMCATEGORY} value="{item::ITMCATEGORY}"{/optional}/>
	<input type="hidden" name="item[values][0][ITMSHARETYPE]" value="{optional item::ITMSHARETYPE 'C'}C{/optional}{optional item::ITMSHARETYPE 'P'}P{/optional}" />
{/optional}

{!optional request::get::distribution_contact}
		<table class="gridDetail">
			<tr>
				<th>{lang::contact_main::title}</th>
				<td>
					<input type="text" name="item[values][0][ITMCLASSIFYAS]" value="{optional item::ITMCLASSIFYAS}{item::ITMCLASSIFYAS}{/optional}{optional request::get::cname}{request::get::cname}{/optional}" />
				</td>
			</tr>
			<tr>
				<th>{lang::contact_main::category}</th>
				<td>
					<input type="text" name="item[values][0][ITMCATEGORY]" {optional item::ITMCATEGORY} value="{item::ITMCATEGORY}"{/optional}/>
				</td>
			</tr>
			<tr>
				<th>{lang::event_detail::private}</th>
				<td><input type="checkbox" name="item[values][0][ITMSHARETYPE]" {optional item::ITMSHARETYPE 'C'} checked="checked"{/optional}{!optional item::ITMSHARETYPE 'C'}{optional item::ITMSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix" value="1"/></td>
	</tr>
		</table>
{/optional}

</div>






{!optional request::get::distribution_contact}
<table cellspacing="0" class="tGrid contactGrid mt10" style="border-collapse:separate;">
{optional item::ADDONS::LOCATION}
<tr>
	<th style="width: 25px;">&nbsp;</th>
	<th>{lang::contact_main::contact_name}</th>
	<th>{lang::contact_main::email}</th>
</tr>

{dynamic item::ADDONS::LOCATION}
	{optional .*::LCT_ID}
	<tr{optional *::_ACTION 'delete'} style="display:none;"{/optional} >
		<td class="contactGridTD checkboxSize" style="width:25px;">
				<input type="checkbox" name="contacts[{.*::LCT_ID}][_SELECTED]" value="{.*::LCT_ID}" id="chb_{.*::LCT_ID}"/>
				<input type="hidden" name="contacts[{.*::LCT_ID}][_ACTION]" value="{.*::_ACTION}" />
				<input type="hidden" value="{.*::LCT_ID}" name="contacts[{.*::LCT_ID}][id]"/>
				<input type="hidden" value="{.*::LCTEMAIL1}" name="contacts[{.*::LCT_ID}][email]"/>
				<input type="hidden" value="{.*::LCTDESCRIPTION}" name="contacts[{.*::LCT_ID}][description]"/>
		</td>
		<td class="contactGridTD"><label for="chb_{.*::LCT_ID}"><a href="#">{.*::LCTDESCRIPTION ''}</a></label></td>
		<td class="contactGridTD underlineLinks" style="width:auto"><label for="chb_{.*::LCT_ID}"><a href="#">{.*::LCTEMAIL1 ''}</a></label></td>
	</tr>
	{/optional}
{/dynamic}
{/optional}
</table>
<table cellspacing="0" class="tGrid contactGrid" style="border-collapse:separate;">
<tr>
 <th>
		<input class="fancyButton left" type="submit" value="{lang::contact_main::add_item_distribution}" name="_a[contacts_distrib]"/>
		<input class="fancyButton left" type="submit" value="{lang::contact_main::add_new}" name="_a[contact_add]" />
		{optional item::ADDONS::LOCATION}
		<input class="fancyButton left" type="submit" value="{lang::contact_main::edit}" name="_a[contact_edit]" id="distrib_edit_contact"/>
		<input class="fancyButton left" type="submit" value="{lang::contact_main::delete_selected}" alt="{lang::confirmation::delete_contact}" name="_a[contact_delete]"  id="distrib_delete_contact"/>
		{/optional}
	</th>
</tr>
</table>
{/optional}

{optional request::get::distribution_contact}
{optional item::ADDONS::LOCATION}
{dynamic item::ADDONS::LOCATION}
{!optional *::action 'delete'}
		<input type="hidden" value="{.*::LCT_ID}" name="contacts[{.*::LCT_ID}][id]"/>
		<input type="hidden" value="{.*::LCTEMAIL1}" name="contacts[{.*::LCT_ID}][email]"/>
		<input type="hidden" value="{.*::LCTDESCRIPTION}" name="contacts[{.*::LCT_ID}][description]"/>
		<input type="hidden" value="{.*::_ACTION}" name="contacts[{.*::LCT_ID}][_ACTION]"/>

{/optional}
{/dynamic}
{/optional}
{/optional}

<input type="hidden" id="lang-contact_main-onleave_warning" value="{lang::contact_main::onleave_warning}" />
<div class="cleaner"></div>
</div>
</div>
</div>
</div>
</div>

</form>
