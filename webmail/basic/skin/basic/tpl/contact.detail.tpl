<form method="post" action="">

<div class="into-bottom-line-right" style="padding-top:12px; .padding-top:7px; z-index:10000">
	{optional request::get::p6}
		<input type="submit" name="_a[delete]" value="{lang::mail_main::delete}" class="fancyButton" alt="{lang::confirmation::delete_contact}"/>
	{/optional}
</div>
<div class="into-bottom-line" style="padding-left:25px; padding-top:12px; .padding-top:7px; z-index:10000">
	{optional request::get::p6}
		<input type="submit" name="_a[edit]" value="{lang::mail_main::save}" class="fancyButton"/>
	{/optional}
	{!optional request::get::p6}
		<input type="submit" name="_a[create]" value="{lang::mail_main::save}" class="fancyButton"/>
	{/optional}
</div>

<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">


{include ../basic/skin/default/tpl/grid/_contact.view.tpl}


</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer contact_form">

		{optional item::ITM_ID}<input type="hidden" name="item[values][0][ITM_ID]" value="{item::ITM_ID}" />
		<input type="hidden" name="items[{item::id}]"/>
		<input type="hidden" name="item[locations][0][location][H][values][0][LCT_ID]" value="{item::ADDONS::LOCATION::H::LCT_ID}" />

		{optional item::ADDONS::LOCATION::H::PHONES::I0::PHN_ID}<input type="hidden" name="item[locations][0][location][H][phones][0][phone][I0][values][0][PHN_ID]" value="{item::ADDONS::LOCATION::H::PHONES::I0::PHN_ID}" />{/optional}
		{optional item::ADDONS::LOCATION::H::PHONES::I1::PHN_ID}<input type="hidden" name="item[locations][0][location][H][phones][0][phone][I1][values][0][PHN_ID]" value="{item::ADDONS::LOCATION::H::PHONES::I1::PHN_ID}" />{/optional}
		{optional item::ADDONS::LOCATION::H::PHONES::I2::PHN_ID}<input type="hidden" name="item[locations][0][location][H][phones][0][phone][I2][values][0][PHN_ID]" value="{item::ADDONS::LOCATION::H::PHONES::I2::PHN_ID}" />{/optional}
		{optional item::ADDONS::LOCATION::H::PHONES::I3::PHN_ID}<input type="hidden" name="item[locations][0][location][H][phones][0][phone][I3][values][0][PHN_ID]" value="{item::ADDONS::LOCATION::H::PHONES::I3::PHN_ID}" />{/optional}
		{/optional}<input type="hidden" name="item[locations][0][location][H][values][0][LCTTYPE]" value="H" />

<table class="gridDetail">
	<tr>
		<th>{lang::contact_main::contact_name}</th>
		<td>
			<input type="text" name="item[values][0][ITMCLASSIFYAS]" value="{optional item::ITMCLASSIFYAS}{htmlspecialchars item::ITMCLASSIFYAS}{/optional}{optional request::get::cname}{htmlspecialchars request::get::cname}{/optional}" />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::first_name}</th>
		<td>
			<input type="text" name="item[values][0][ITMFIRSTNAME]" {optional item::ITMFIRSTNAME} value="{htmlspecialchars item::ITMFIRSTNAME}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::middle_name}</th>
		<td>
			<input type="text" name="item[values][0][ITMMIDDLENAME]" {optional item::ITMMIDDLENAME} value="{htmlspecialchars item::ITMMIDDLENAME}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::last_name}</th>
		<td>
			<input type="text" name="item[values][0][ITMSURNAME]" {optional item::ITMSURNAME} value="{htmlspecialchars item::ITMSURNAME}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::nick}</th>
		<td>
			<input type="text" name="item[values][0][ITMNICKNAME]" {optional item::ITMNICKNAME} value="{htmlspecialchars item::ITMNICKNAME}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::title}</th>
		<td>
			<input type="text" name="item[values][0][ITMTITLE]" {optional item::ITMTITLE} value="{htmlspecialchars item::ITMTITLE}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::suffix}</th>
		<td>
			<input type="text" name="item[values][0][ITMSUFFIX]" {optional item::ITMSUFFIX} value="{htmlspecialchars item::ITMSUFFIX}"{/optional}/>
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<tr>
		<th>{lang::contact_main::web}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTWEBPAGE]" {optional item::ADDONS::LOCATION::H::LCTWEBPAGE} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTWEBPAGE}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{optional item::ADDONS::LOCATION::H::LCTEMAIL1}<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional item::ITMCLASSIFYAS}&quot;{htmlspecialchars item::ITMCLASSIFYAS}&quot;&lt;{htmlspecialchars item::ADDONS::LOCATION::H::LCTEMAIL1}&gt;{/optional}{!optional item::ITMCLASSIFYAS}{htmlspecialchars item::ADDONS::LOCATION::H::LCTEMAIL1}{/optional}">{/optional}{lang::contact_main::email} 1{optional item::ADDONS::LOCATION::H::LCTEMAIL1}</a>{/optional}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTEMAIL1]" {optional item::ADDONS::LOCATION::H::LCTEMAIL1} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTEMAIL1}"{/optional}{!optional item::ADDONS::LOCATION::H::LCTEMAIL1}{optional request::get::mail} value="{htmlspecialchars request::get::mail}"{/optional}{/optional} />
		</td>
	</tr>
	<tr>
		<th>{optional item::ADDONS::LOCATION::H::LCTEMAIL2}<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional item::ADDONS::LOCATION::H::ITMCLASSIFYAS}&quot;{htmlspecialchars item::ADDONS::LOCATION::H::ITMCLASSIFYAS}&quot;&lt;{item::ADDONS::LOCATION::H::LCTEMAIL2}&gt;{/optional}{!optional item::ADDONS::LOCATION::H::ITMCLASSIFYAS}{htmlspecialchars item::ADDONS::LOCATION::H::LCTEMAIL2}{/optional}">{/optional}{lang::contact_main::email} 2{optional item::ADDONS::LOCATION::H::LCTEMAIL2}</a>{/optional}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTEMAIL2]" {optional item::ADDONS::LOCATION::H::LCTEMAIL2} value="{item::ADDONS::LOCATION::H::LCTEMAIL2}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{optional item::ADDONS::LOCATION::H::LCTEMAIL3}<a href="?_n[p][content]=mail.compose&_n[p][main]=win.main.tree&to={optional item::ADDONS::LOCATION::H::ITMCLASSIFYAS}&quot;{htmlspecialchars item::ADDONS::LOCATION::H::ITMCLASSIFYAS}&quot;&lt;{htmlspecialchars item::ADDONS::LOCATION::H::LCTEMAIL3}&gt;{/optional}{!optional item::ADDONS::LOCATION::H::ITMCLASSIFYAS}{htmlspecialchars item::ADDONS::LOCATION::H::LCTEMAIL3}{/optional}">{/optional}{lang::contact_main::email} 3{optional item::ADDONS::LOCATION::H::LCTEMAIL3}</a>{/optional}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTEMAIL3]" {optional item::ADDONS::LOCATION::H::LCTEMAIL3} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTEMAIL3}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::im}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTIM]" {optional item::ADDONS::LOCATION::H::LCTIM} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTIM}"{/optional} />
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>

	<tr>
		<th>{lang::contact_main::street}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTSTREET]" {optional item::ADDONS::LOCATION::H::LCTSTREET} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTSTREET}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::city}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTCITY]" {optional item::ADDONS::LOCATION::H::LCTCITY} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTCITY}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::state}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTSTATE]" {optional item::ADDONS::LOCATION::H::LCTSTATE} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTSTATE}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::country}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTCOUNTRY]" {optional item::ADDONS::LOCATION::H::LCTCOUNTRY} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTCOUNTRY}"{/optional} />
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::zip}</th>
		<td>
			<input type="text" name="item[locations][0][location][H][values][0][LCTZIP]" {optional item::ADDONS::LOCATION::H::LCTZIP} value="{htmlspecialchars item::ADDONS::LOCATION::H::LCTZIP}"{/optional} />
		</td>
	</tr>
	<tr>
		<td>{lang::event_detail::private}</td>
		<td><input type="checkbox" name="item[values][0][ITMSHARETYPE]" {optional item::ITMSHARETYPE 'C'} checked="checked"{/optional}{!optional item::ITMSHARETYPE 'C'}{optional item::ITMSHARETYPE 'P'} checked="checked"{/optional}{/optional} class="checkboxFix"/></td>
	</tr>

	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
</table>
<table class="gridDetail">
	<tr>
		<th>{lang::contact_main::company}</th>
		<td>
			<input type="text" name="item[values][0][ITMCOMPANY]" {optional item::ITMCOMPANY} value="{htmlspecialchars item::ITMCOMPANY}"{/optional}/>
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::department}</th>
		<td>
			<input type="text" name="item[values][0][ITMDEPARTMENT]" {optional item::ITMDEPARTMENT} value="{htmlspecialchars item::ITMDEPARTMENT}"{/optional}/>
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::job}</th>
		<td>
			<input type="text" name="item[values][0][ITMJOBTITLE]" {optional item::ITMJOBTITLE} value="{htmlspecialchars item::ITMJOBTITLE}"{/optional}/>
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::profession}</th>
		<td>
			<input type="text" name="item[values][0][ITMPROFESSION]" {optional item::ITMPROFESSION} value="{htmlspecialchars item::ITMPROFESSION}"{/optional}/>
		</td>
	</tr>
	<tr>
		<th>{lang::contact_main::category}</th>
		<td>
			<input type="text" name="item[values][0][ITMCATEGORY]" {optional item::ITMCATEGORY} value="{htmlspecialchars item::ITMCATEGORY}"{/optional}/>
		</td>
	</tr>
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	
	<tr>
		<th colspan="2">{lang::contact_main::phones}</th>
	</tr>
{dynamic item::ADDONS::LOCATION::H::PHONES}
	<tr>
		<td>
			<select size="1" name="item[phones][var][]">
				<option value="LCTPHNHOME1" {optional *::PHN_ID 'LCTPHNHOME1'} selected="selected"{/optional}>{lang::contact_main::home} 1</option>
				<option value="LCTPHNHOME2" {optional *::PHN_ID 'LCTPHNHOME2'} selected="selected"{/optional}>{lang::contact_main::home} 2</option>
				<option value="LCTPHNASSISTANT" {optional *::PHN_ID 'LCTPHNASSISTANT'} selected="selected"{/optional}>{lang::contact_main::assistant}</option>
				<option value="LCTPHNWORK1" {optional *::PHN_ID 'LCTPHNWORK1'} selected="selected"{/optional}>{lang::contact_main::work} 1</option>
				<option value="LCTPHNWORK2" {optional *::PHN_ID 'LCTPHNWORK2'} selected="selected"{/optional}>{lang::contact_main::work} 2</option>
				<option value="LCTPHNFAXHOME" {optional *::PHN_ID 'LCTPHNFAXHOME'} selected="selected"{/optional}>{lang::contact_main::fax_home}</option>
				<option value="LCTPHNFAXWORK" {optional *::PHN_ID 'LCTPHNFAXWORK'} selected="selected"{/optional}>{lang::contact_main::fax_work}</option>
				<option value="LCTPHNCALLBACK" {optional *::PHN_ID 'LCTPHNCALLBACK'} selected="selected"{/optional}>{lang::contact_main::call_back}</option>
				<option value="LCTPHNCOMPANY" {optional *::PHN_ID 'LCTPHNCOMPANY'} selected="selected"{/optional}>{lang::contact_main::company}</option>
				<option value="LCTPHNCAR" {optional *::PHN_ID 'LCTPHNCAR'} selected="selected"{/optional}>{lang::contact_main::car}</option>
				<option value="LCTPHNISDN" {optional *::PHN_ID 'LCTPHNISDN'} selected="selected"{/optional}>{lang::contact_main::isdn}</option>
				<option value="LCTPHNMOBILE" {optional *::PHN_ID 'LCTPHNMOBILE'} selected="selected"{/optional}>{lang::contact_main::mobile}</option>
				<option value="LCTPHNOTHER" {optional *::PHN_ID 'LCTPHNOTHER'} selected="selected"{/optional}>{lang::contact_main::other}</option>
				<option value="LCTPHNOTHERFAX" {optional *::PHN_ID 'LCTPHNOTHERFAX'} selected="selected"{/optional}>{lang::contact_main::other_fax}</option>
				<option value="LCTPHNPAGER" {optional *::PHN_ID 'LCTPHNPAGER'} selected="selected"{/optional}>{lang::contact_main::pager}</option>
				<option value="LCTPHNPRIMARY" {optional *::PHN_ID 'LCTPHNPRIMARY'} selected="selected"{/optional}>{lang::contact_main::primary}</option>
				<option value="LCTPHNRADIO" {optional *::PHN_ID 'LCTPHNRADIO'} selected="selected"{/optional}>{lang::contact_main::radio}</option>
				<option value="LCTPHNTELEX" {optional *::PHN_ID 'LCTPHNTELEX'} selected="selected"{/optional}>{lang::contact_main::telex}</option>
				<option value="LCTPHNHEARING" {optional *::PHN_ID 'LCTPHNHEARING'} selected="selected"{/optional}>{lang::contact_main::hearing}</option>
			</select>
		</td>
		<td>
			<input type="text" name="item[phones][val][]" value="{.*::PHNNUMBER ''}"/>
		</td>
	</tr>
{/dynamic}
	<tr>
		<td colspan="2">&nbsp;</td>
	</tr>
	<tr>
		<th colspan="2">{lang::contact_main::notes}</th>
	</tr>
	<tr>
		<td colspan="2"><textarea class="wsto" name="item[values][0][ITMDESCRIPTION]">{optional item::ITMDESCRIPTION}{htmlspecialchars item::ITMDESCRIPTION}{/optional}</textarea></td>
	</tr>

</table>




<div class="cleaner"></div>
</div>
</div>
</div>
</div>
</div>

</form>