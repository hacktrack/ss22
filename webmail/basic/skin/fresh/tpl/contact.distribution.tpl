{include ../basic/skin/fresh/tpl/_toolbar.top_groupware.detail.tpl}

<div class="body form">
	<input type="hidden" name="distribution" value="1" />
	<input type="hidden" name="_dlg[contact_select][actions]" value="contacts_distrib" />
	<input type="hidden" name="_dlg[contact_select][referer]" value="contact.distribution" />
	<input type="hidden" name="_dlg[contact_select][target]" value="content" />
	<input type="hidden" name="_dlg[contact_select][controller]" value="item" />
	<input type="hidden" name="_dlg[contact_select][parameters][all][_s][id]" value="{settings::default_folders::contacts}" />
	<input type="hidden" name="_dlg[contact_select][parameters][all][_s][filter]" value="(ITMCLASS &lt;&gt; 'L') AND ((NOT (LCTEMAIL1 ='')) OR (NOT (LCTEMAIL2 ='')) OR (NOT (LCTEMAIL3 ='')))" />
	<input type="hidden" name="item[values][0][ITMCLASS]" value="L" />
	
	{optional item::ITM_ID}
	<input type="hidden" name="item[values][0][ITM_ID]" value="{item::ITM_ID}" />
	<input type="hidden" name="items[{item::ITM_ID}]"/>
	{/optional}

	{optional request::get::distribution_contact}

		{optional request::all::action 'edit'}
		{dynamic item::ADDONS::LOCATION}

			{optional *::_SELECTED}
            <h2>{lang::contact_main::edit}</h2>
			<table class="frmtbl frmtbl100">
				<tr>
					<th class="th">{lang::contact_main::contact_name}</th>
					<td class="td">
						<div class="inp_text">
						<input type="text" class="inp_text" name="edit[{.*::LCT_ID}][description]" value="{optional *::LCTDESCRIPTION}{htmlspecialchars .*::LCTDESCRIPTION}{/optional}" />
						</div>
					</td>
				</tr>
				<tr>
					<th>{lang::contact_main::email}</th>
					<td>
                        <div class="inp_text">
						<input type="text" class="inp_text" name="edit[{.*::LCT_ID}][email]" value="{optional *::LCTEMAIL1}{htmlspecialchars .*::LCTEMAIL1}{/optional}"/>
						</div>
					</td>
				</tr>
			</table>
			{/optional}
		{/dynamic}
		{/optional}

		{optional request::all::action 'add'}
			<h2>{lang::contact_main::add_new}</h2>
			<table class="frmtbl frmtbl100">
				<tr>
					<th class="th">{lang::contact_main::contact_name}</th>
					<td class="td">
                        <div class="inp_text">
						<input type="text" class="inp_text" name="edit[new][description]"/>
						<input type="hidden" id="action_EN"/>
						</div>
					</td>
				</tr>
				<tr>
					<th>{lang::contact_main::email}</th>
					<td>
                        <div class="inp_text">
						<input type="text" class="inp_text" name="edit[new][email]"/>
						</div>
					</td>
				</tr>
			</table>
		{/optional}

		<input type="hidden" name="action" value="{request::all::action}" />
	{/optional}


	{optional request::get::distribution_contact}
	<input type="hidden" name="item[values][0][ITMCLASSIFYAS]" value="{optional item::ITMCLASSIFYAS}{htmlspecialchars item::ITMCLASSIFYAS}{/optional}{optional request::get::cname}{request::get::cname}{/optional}" />
	<input type="hidden" name="item[values][0][ITMCATEGORY]" {optional item::ITMCATEGORY} value="{htmlspecialchars item::ITMCATEGORY}"{/optional}/>
	<input type="hidden" name="item[values][0][ITMSHARETYPE]" value="{optional item::ITMSHARETYPE 'C'}C{/optional}{optional item::ITMSHARETYPE 'P'}P{/optional}" />
	{/optional}

	{!optional request::get::distribution_contact}

	{optional item::ITM_ID}
	<h2>{lang::contact_main::distribution_list}</h2>
	{/optional}
	{!optional item::ITM_ID}
	<h2>{lang::contact_main::add_distribution}</h2>
	{/optional}

	<table class="frmtbl frmtbl100">
		<tr>
			<th class="th">{lang::contact_main::title}</th>
			<td class="td">
				<div class="inp_text">
				<input type="text" class="inp_text" name="item[values][0][ITMCLASSIFYAS]" value="{optional item::ITMCLASSIFYAS}{htmlspecialchars item::ITMCLASSIFYAS}{/optional}{optional request::get::cname}{request::get::cname}{/optional}" />
				</div>
			</td>
		</tr>
		<tr>
			<th>{lang::contact_main::category}</th>
			<td>
                <div class="inp_text">
				<input type="text" class="inp_text" name="item[values][0][ITMCATEGORY]" {optional item::ITMCATEGORY} value="{htmlspecialchars item::ITMCATEGORY}"{/optional}/>
				</div>
			</td>
		</tr>
	</table>
    {/optional}




{!optional request::get::distribution_contact}
<table>
    <tr>
		<td colspan="3">&nbsp;</td>
	</tr>
	<tr>
		<td class="rbig">
			<input class="inp_btn" type="submit" value="{lang::contact_main::add_item_distribution}" name="_a[contacts_distrib]"/>
			<input class="inp_btn" type="submit" value="{lang::contact_main::add_new}" name="_a[contact_add]" />
		</td>
		{optional item::ADDONS::LOCATION}
		<td class="lbig rbig">
			<input class="inp_btn" type="submit" value="{lang::contact_main::edit}" name="_a[contact_edit]" id="distrib_edit_contact"/>
		</td>
		<td class="lbig">
			<input class="inp_btn" type="submit" value="{lang::contact_main::delete_selected}" name="_a[contact_delete]"  id="distrib_delete_contact"/>
			{optional item::ADDONS::LOCATION}{/optional}
		</td>
		{/optional}
	</tr>
</table>

<div class="tbig bbig">
<div class="datagrid">
	<table class="datagrid">
	    <thead>
			<tr>
				<th class="th_check"><span>&nbsp;</span></th>
				<th style="width: 50%"><span>{lang::contact_main::contact_name}</span></th>
				<th style="width: 50%"><span>{lang::contact_main::email}</span></th>
			</tr>
	    </thead>
		{optional item::ADDONS::LOCATION}
	    <tbody>
			{dynamic item::ADDONS::LOCATION}
			{optional .*::LCT_ID}
			{!optional *::LCTEMAIL ''}
			<tr{optional *::_ACTION 'delete'} style="display:none;"{/optional} >
				<td class="contactGridTD checkboxSize" style="width:25px;">
						<input type="checkbox" class="inp_check" name="contacts[{.*::LCT_ID}][_SELECTED]" value="{.*::LCT_ID}" id="chb_{.*::LCT_ID}"/>
						<input type="hidden" name="contacts[{.*::LCT_ID}][_ACTION]" value="{.*::_ACTION}" />
						<input type="hidden" value="{.*::LCT_ID}" name="contacts[{.*::LCT_ID}][id]"/>
						<input type="hidden" value="{htmlspecialchars .*::LCTEMAIL1}" name="contacts[{.*::LCT_ID}][email]"/>
						<input type="hidden" value="{htmlspecialchars .*::LCTDESCRIPTION}" name="contacts[{.*::LCT_ID}][description]"/>
				</td>
				<td class="contactGridTD"><label for="chb_{.*::LCT_ID}"><a href="#">{htmlspecialchars .*::LCTDESCRIPTION}</a></label></td>
				<td class="contactGridTD underlineLinks" style="width:auto"><label for="chb_{.*::LCT_ID}"><a href="#">{htmlspecialchars .*::LCTEMAIL1}</a></label></td>
			</tr>
			{/optional}
			{/optional}
			{/dynamic}
	    </tbody>
		{/optional}
	</table>
</div>
</div>
{/optional}

	{optional request::get::distribution_contact}
	{optional item::ADDONS::LOCATION}
	{dynamic item::ADDONS::LOCATION}
	{!optional *::action 'delete'}
		<input type="hidden" value="{.*::LCT_ID}" name="contacts[{.*::LCT_ID}][id]"/>
		<input type="hidden" value="{htmlspecialchars .*::LCTEMAIL1}" name="contacts[{.*::LCT_ID}][email]"/>
		<input type="hidden" value="{htmlspecialchars .*::LCTDESCRIPTION}" name="contacts[{.*::LCT_ID}][description]"/>
		<input type="hidden" value="{.*::_ACTION}" name="contacts[{.*::LCT_ID}][_ACTION]"/>
	{/optional}
	{/dynamic}
	{/optional}
	{/optional}

	<input type="hidden" id="lang-contact_main-onleave_warning-distribution" value="{lang::contact_main::onleave_warning}" />


	{!optional request::get::distribution_contact}
	<label class="sharing clear" for="item[values][0][ITMSHARETYPE]">
		<input type="checkbox" id="item[values][0][ITMSHARETYPE]" name="item[values][0][ITMSHARETYPE]" {optional item::ITMSHARETYPE 'C'} checked="checked"{/optional}{!optional item::ITMSHARETYPE 'C'}{optional item::ITMSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix" value="1"/>
		{lang::event_detail::private}
	</label>
	{/optional}

</div>


{include ../basic/skin/fresh/tpl/_toolbar.bottom_groupware.detail.tpl}
