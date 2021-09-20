<table>
	<tr><td colspan="2"><h2>{htmlspecialchars ITMSURNAME}{optional ITMSURNAME}{optional ITMFIRSTNAME}, {/optional}{/optional}{htmlspecialchars ITMFIRSTNAME}</h2>{optional ITMGENDER} ({htmlspecialchars ITMGENDER}){/optional}</td></tr>
	{optional ITMCLASSIFYAS}<tr><th>{CONTACT::DISPLAYNAME}</th><td>{htmlspecialchars ITMCLASSIFYAS}</td></tr>{/optional}
	{optional ITMBDATE}<tr><th>{CONTACT::BIRTHDATE}</th><td>{htmlspecialchars ITMBDATE}</td></tr>{/optional}
	{optional ITMCOMPANY}<tr><th>{CONTACT::COMPANY}</th><td>{htmlspecialchars ITMCOMPANY}</td></tr>{/optional}
	{optional B::LCTWEBPAGE}<tr><th>{CONTACT::WEB}</th><td>{htmlspecialchars B::LCTWEBPAGE}</td></tr>{/optional}

	{optional ITMDEPARTMENT}<tr><th>{CONTACT::DEPARTMENT}</th><td>{htmlspecialchars ITMDEPARTMENT}</td></tr>{/optional}
	{optional ITMJOBTITLE}<tr><th>{CONTACT::JOB}</th><td>{htmlspecialchars ITMJOBTITLE}</td></tr>{/optional}

	{optional LCTEMAIL1 LCTEMAIL2 LCTEMAIL3}
	<tr><th>{COMMON::EMAIL}</th>
		<td>
			{optional LCTEMAIL1}<div>{htmlspecialchars LCTEMAIL1}</div>{/optional}
			{optional LCTEMAIL2}<div>{htmlspecialchars LCTEMAIL2}</div>{/optional}
			{optional LCTEMAIL3}<div>{htmlspecialchars LCTEMAIL3}</div>{/optional}
		</td>
	</tr>
	{/optional}

	<tr><td class="space" colspan="2"></td></tr>

	{dynamic PHONES}
	<tr><th>{PHONES::*::PHNTYPE}</th><td>{htmlspecialchars PHONES::*::PHNNUMBER}</td></tr>
	{/dynamic}

	{optional LCTSTREET LCTCITY LCTSTATE LCTZIP LCTCOUNTRY}
	<tr><td class="space" colspan="2"></td></tr>
	<tr><th>{CONTACT::HOME_ADDRESS}</th>
		<td>
			{optional LCTSTREET}<div>{htmlspecialchars LCTSTREET}</div>{/optional}
			{optional LCTCITY LCTSTATE LCTZIP}<div>{optional LCTCITY}{htmlspecialchars LCTCITY}, {/optional}{optional LCTSTATE}{htmlspecialchars LCTSTATE} {/optional}{optional LCTZIP}{htmlspecialchars LCTZIP}{/optional}</div>{/optional}
			{optional LCTCOUNTRY}<div>{htmlspecialchars LCTCOUNTRY}</div>{/optional}
		</td>
	</tr>
	{/optional}

	{optional B::LCTSTREET B::LCTCITY B::LCTSTATE B::LCTZIP B::LCTCOUNTRY}
	<tr><td class="space" colspan="2"></td></tr>
	<tr><th>{CONTACT::BUSINESS_ADDRESS}</th>
		<td>
			{optional B::LCTSTREET}<div>{htmlspecialchars B::LCTSTREET}</div>{/optional}
			{optional B::LCTCITY B::LCTSTATE B::LCTZIP}<div>{optional B::LCTCITY}{htmlspecialchars B::LCTCITY}, {/optional}{optional B::LCTSTATE}{htmlspecialchars B::LCTSTATE} {/optional}{optional B::LCTZIP}{htmlspecialchars B::LCTZIP}{/optional}</div>{/optional}
			{optional B::LCTCOUNTRY}<div>{htmlspecialchars B::LCTCOUNTRY}</div>{/optional}
		</td>
	</tr>
	{/optional}
	{optional ITMOFFICELOCATION}<tr><th>{CONTACT::OFFICE_LOCATION}</th><td>{htmlspecialchars ITMOFFICELOCATION}</td></tr>{/optional}
	{optional ITMDESCRIPTION}
	<tr><td class="space" colspan="2"></td></tr>
	<tr><th>{NOTE::NOTE}</th><td>{ITMDESCRIPTION}</td></tr>
	{/optional}

</table>
