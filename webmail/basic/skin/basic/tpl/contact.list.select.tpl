<table cellspacing="0" class="tGrid contactGrid" id="tGrid">
<tr>
	<th>{lang::contact_main::email}</th>
	<th>{lang::contact_main::contact_name}</th>
	<th>{lang::contact_main::company}</th>
	<th>{lang::contact_main::department}</th>
	<th>{lang::contact_main::category}</th>
</tr>
{dynamic items}

<tr>
	<td class="contactGridTD">
		<div class="oFlowController"><div class="oFlowA">
		<table cellspacing="0">
			<tr>
				<td>
					{optional *::LCTEMAIL1}
						{optional type 'multiple'}
						<input type="checkbox" name="{variable}[{.*::ITM_ID}#EMAIL1][selected]"{optional *::checked} checked="checked"{/optional}/>
						<input type="hidden" name="{variable}[{.*::ITM_ID}#EMAIL1][address]" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS_ESCAPED}&quot;&lt;{/optional}{.*::LCTEMAIL1}{!optional *::NOCA}&gt;{/optional}"/>
						{/optional}
						{optional type 'single'}
						<input type="radio" name="{variable}" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{.*::LCTEMAIL1}{!optional *::NOCA}&gt;{/optional}"{optional *::checked} checked="checked"{/optional}/>
						{/optional}
					{/optional}
					{!optional *::LCTEMAIL1}
						<span class="gray">{lang::contact_main::no_email}</span>
					{/optional}
				</td>
				<td>{.*::LCTEMAIL1DISPLAY}</td>
			</tr>
			{optional *::LCTEMAIL2}
			<tr>
				<td>
					{optional type 'multiple'}
					<input type="checkbox" name="{variable}[{.*::ITM_ID}#EMAIL2][selected]"{optional *::checked} checked="checked"{/optional}/>
					<input type="hidden" name="{variable}[{.*::ITM_ID}#EMAIL2][address]" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS_ESCAPED}&quot;&lt;{/optional}{.*::LCTEMAIL2}{!optional *::NOCA}&gt;{/optional}"/>
					{/optional}
					{optional type 'single'}
					<input type="radio" name="{variable}" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{.*::LCTEMAIL2}{!optional *::NOCA}&gt;{/optional}"{optional *::checked} checked="checked"{/optional}/>
					{/optional}
				</td>
				<td>{.*::LCTEMAIL2}</td>
			</tr>
			{/optional}
			{optional *::LCTEMAIL3}
			<tr>
				<td>
					{optional type 'multiple'}
					<input type="checkbox" name="{variable}[{.*::ITM_ID}#EMAIL3][selected]"{optional *::checked} checked="checked"{/optional}/>
					<input type="hidden" name="{variable}[{.*::ITM_ID}#EMAIL3][address]" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS_ESCAPED}&quot;&lt;{/optional}{.*::LCTEMAIL3}{!optional *::NOCA}&gt;{/optional}"/>
					{/optional}
					{optional type 'single'}
					<input type="radio" name="{variable}" value="{!optional *::NOCA}&quot;{htmlspecialchars .*::ITMCLASSIFYAS}&quot;&lt;{/optional}{.*::LCTEMAIL3}{!optional *::NOCA}&gt;{/optional}"{optional *::checked} checked="checked"{/optional}/>
					{/optional}
				</td>
				<td>{.*::LCTEMAIL3}</td>
			</tr>
			{/optional}
		</table>
		</div></div>
	</td>
	<td class="contactGridTD"><div class="oFlowController"><span class="oFlowA">{.*::ITMCLASSIFYAS}{optional *::NOCA}<span class="gray">{lang::contact_main::no_name}</span>{/optional}</span></div></td>
	<td class="contactGridTD"><div class="oFlowController"><span class="oFlowA">{.*::ITMCOMPANY ''}</span></div></td>
	<td class="contactGridTD"><div class="oFlowController"><span class="oFlowA">{.*::ITMDEPARTMENT ''}</span></div></td>
	<td class="contactGridTD"><div class="oFlowController"><span class="oFlowA">{.*::ITMCATEGORY ''}</span></div></td>
</tr>

{/dynamic}
</table>