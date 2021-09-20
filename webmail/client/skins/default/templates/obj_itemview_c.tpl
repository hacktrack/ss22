<div class="itemview itemview_c">

	<table class="frmtbl frmtbl100">
		<tr>
			<th class="th"><obj name="avatar" type="obj_avatar">{optional avatar contactid}<value><item>{htmlspecialchars avatar}</item><item>{htmlspecialchars contactid}</item></value>{/optional}</obj></th>
			<td class="td middle">
				<h1>{fullname}</h1>
			</td>
		</tr>

	{optional birthday}
		<tr><td colspan="2" class="space">&nbsp;</td></tr>
		<tr>
			<th class="th">{CONTACT::BIRTHDATE}</th>
			<td class="td">{birthday}</td>
		</tr>
	{/optional}

	{optional emails phones}
		<tr><td colspan="2" class="space">&nbsp;</td></tr>
		<tr><th colspan="2" class="th"><b>{CONTACT::CONTACT}</b></th></tr>

		{optional emails}
		<tr>
			<th class="th">{COMMON::EMAIL}</th>
			<td class="td">
			{dynamic emails}
			<obj name="X_e" type="obj_label_mail"><value>{htmlspecialchars emails::*}</value></obj>
			{/dynamic}
			</td>
		</tr>
	    <tr><td colspan="2" class="space">&nbsp;</td></tr>
		{/optional}

		{optional phones}
		{dynamic phones}
		<tr>
			<th class="th">{phones::*::title}</th>
			<td class="td"><obj name="X_p" type="obj_label_phone"><value>{htmlspecialchars phones::*::number}</value></obj></td>
		</tr>
	    {/dynamic}
		{/optional}

	{/optional}
	{optional company department jobtitle profession}
		<tr><td colspan="2" class="space">&nbsp;</td></tr>
		<tr><th colspan="2" class="th"><b>{CONTACT::PROFILE}</b></th></tr>
		{optional jobtitle}
		<tr>
			<th class="th">{CONTACT::JOB}</th>
			<td class="td">{jobtitle}</td>
		</tr>
		{/optional}
		{optional profession}
		<tr>
			<th class="th">{CONTACT::PROFESSION}</th>
			<td class="td">{profession}</td>
		</tr>
		{/optional}
		{optional department}
		<tr>
			<th class="th">{CONTACT::DEPARTMENT}</th>
			<td class="td">{department}</td>
		</tr>
		{/optional}
		{optional company}
		<tr>
			<th class="th">{CONTACT::COMPANY}</th>
			<td class="td">{company}</td>
		</tr>
		{/optional}
		{optional manager}
		<tr>
			<th class="th">{CONTACT::MANAGER}</th>
			<td class="td">{manager}</td>
		</tr>
		{/optional}
		{optional assistant}
		<tr>
			<th class="th">{CONTACT::ASSISTANT}</th>
			<td class="td">{assistant}</td>
		</tr>
		{/optional}
		{optional location}
		<tr>
			<th class="th">{CONTACT::OFFICE_LOCATION}</th>
			<td class="td">{location}</td>
		</tr>
		{/optional}
	{/optional}

	{optional business_street business_city business_state business_country}
		<tr><td colspan="2" class="space">&nbsp;</td></tr>
		<tr><th colspan="2" class="th"><obj name="X_MAP" type="obj_button_map" css="noborder"><value>{htmlspecialchars business_map}</value><text>{CONTACT::BUSINESS_ADDRESS}</text></obj></th></tr>
		{optional business_street}
		<tr>
			<td colspan="2" class="indent">{business_street}</td>
		</tr>
		{/optional}
		{optional business_city business_state business_zip}
		<tr>
			<td colspan="2" class="indent">{optional business_city}{business_city}{/optional}{optional business_state} {business_state}{/optional}{optional business_zip} {business_zip}{/optional}</td>
		</tr>
		{/optional}
		{optional business_country}
		<tr>
			<td colspan="2" class="indent">{business_country}</td>
		</tr>
		{/optional}
	{/optional}

	{optional home_street home_city home_state home_country}
		<tr><td colspan="2" class="space">&nbsp;</td></tr>
		<tr><th colspan="2" class="th"><obj name="X_MAP" type="obj_button_map" css="noborder"><value>{htmlspecialchars home_map}</value><text>{CONTACT::HOME_ADDRESS}</text></obj></th></tr>
		{optional home_street}
		<tr>
			<td colspan="2" class="indent">{home_street}</td>
		</tr>
		{/optional}
		{optional home_city home_state home_zip}
		<tr>
			<td colspan="2" class="indent">{optional home_city}{home_city}{/optional}{optional home_state} {home_state}{/optional}{optional home_zip} {home_zip}{/optional}</td>
		</tr>
		{/optional}
		{optional home_country}
		<tr>
			<td colspan="2" class="indent">{home_country}</td>
		</tr>
		{/optional}
	{/optional}

	{optional other_street other_city other_state other_country}
		<tr><td colspan="2" class="space">&nbsp;</td></tr>
		<tr><th colspan="2" class="th"><obj name="X_MAP" type="obj_button_map" css="noborder"><value>{htmlspecialchars other_map}</value><text>{CONTACT::OTHER_ADDRESS}</text></obj></th></tr>
		{optional other_street}
		<tr>
			<td colspan="2" class="indent">{other_street}</td>
		</tr>
		{/optional}
		{optional other_city other_state other_zip}
		<tr>
			<td colspan="2" class="indent">{optional other_city}{other_city}{/optional}{optional other_state} {other_state}{/optional}{optional other_zip} {other_zip}{/optional}</td>
		</tr>
		{/optional}
		{optional other_country}
		<tr>
			<td colspan="2" class="indent">{other_country}</td>
		</tr>
		{/optional}
	{/optional}

	</table>

 	<table class="frmtbl frmtbl100">

		{optional note}
		<tr><td class="space">&nbsp;</td></tr>
		<th class="th"><b>{CONTACT::NOTES}</b></th>
		<tr><td id="{anchor note}" class="view_note">{note}</td></tr>
		{/optional}

		{optional att}
		<tr><td class="space">&nbsp;</td></tr>
		<tr>
			<th class="th">{ATTACHMENT::ATTACHMENTS}</th>
		</tr>
		<tr>
			<td>
			{dynamic att}
			<div class="attach{optional att::*::ico} type_{att::*::ico}{/optional}">
				<a href="{att::*::link}" class="att{optional att::*::ico} ico_{att::*::ico}{/optional}" target="{_ins}.frame" title="{htmlspecialchars att::*::title}" rel="{htmlspecialchars att::*::id}">{optional att::*::size} <span>{htmlspecialchars att::*::size}</span>{/optional}{htmlspecialchars att::*::title}</a>
				{optional att::*::play}<obj name="X_play" type="obj_button_play" css="simple"><src>{htmlspecialchars att::*::play}</src><title>{htmlspecialchars att::*::title}</title></obj>{/optional}
			</div>
			{/dynamic}
			<iframe name="{_ins}.frame" id="{_ins}.frame" class="att"></iframe>
			</td>
		</tr>
		{/optional}

		{optional tags}
		<tr><td class="space">&nbsp;</td></tr>
		<tr>
			<th class="th">{TAGS::TAGS}</th>
		</tr>
		<tr>
			<td class="td">
				<div class="tags">
					{dynamic tags}
					<a href="javascript: void();" {optional tags::*::tagcolor}style="background-color: {htmlspecialchars tags::*::tagcolor}; color: {tags::*::textcolor}"{/optional}>{htmlspecialchars tags::*::tagname}</a>
					{/dynamic}
				</div>
			</td>
		</tr>
		{/optional}
 	</table>
</div>
