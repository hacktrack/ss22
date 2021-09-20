<div iw-flex-grid>
<div iw-flex-cell>
	<div class="card card--legend">
		<legend class="card__legend"><span class="icon-hat"></span>Academy</legend>
		<div iw-flex-grid="query 2">

		<div iw-flex-cell class="u-margin-vertical">
			<a class="card__media" href="http://www.icewarp.com/academy-video/dns-validation/" target="_blank" rel="noopener noreferrer">
				<img src="client/skins/default/images/academy/zone-file.jpg" alt="{DNS::ACADEMY_CAPTION}" title="{DNS::ACADEMY_CAPTION}">
				<p class="card__media-text">{DNS::ACADEMY_CAPTION}</p>
			</a>
		</div>

		<div iw-flex-cell class="u-margin-vertical">
			<div class="card__text">
				<p class="card__text-warning"><span class="icon-warning"></span>{DNS::ACADEMY_WARNING}</p>
				<p class="card__text-info">{DNS::ACADEMY_TEXT}</p>
				<div class="button text primary disabled">
					<a id="{anchor button_download_dnszonefile}" tabindex="true">{GENERIC::DOWNLOAD}</a>
				</div>
			</div>
		</div>

		</div>
	</div>
</div>
</div>

{noptional items}
<div class="text-center">
	<img src="client/skins/default/images/loading/loader.gif" alt="loading..." title="Loading animation">
	<label class="label">{DNS::LOADING}</label>
</div>
{/noptional}
{optional items}
<div iw-flex-grid>
<div iw-flex-cell is-hidden="1">

	<h3 class="box-content-title gamma">{DNS::GENERAL}</h4>
	<table class="dns-table">
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::NAME}</td>
			<td class="dns-table__cell dns-table--right">{general::name}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::DEFAULT_ALIAS}</td>
			<td class="dns-table__cell dns-table--right">{general::defaultalias}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::EMAIL}</td>
			<td class="dns-table__cell dns-table--right">{general::email}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::USER_COUNT}</td>
			<td class="dns-table__cell dns-table--right">{general::usercount}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::USER_LIMIT}</td>
			<td class="dns-table__cell dns-table--right">{general::userlimit}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::IP_ADDRESS}</td>
			<td class="dns-table__cell dns-table--right">{noptional general::ipaddress}&lt;{DNS::ALL_AVAILABLE}&gt;{/noptional}{optional general::ipaddress}{general::ipaddress}{/optional}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::TYPE}</td>
			<td class="dns-table__cell dns-table--right">{general::type}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::EXPIRES_ON}</td>
			<td class="dns-table__cell dns-table--right">{general::expireson}</td>
		</tr>
		<tr class="dns-table__row">
			<td class="dns-table__cell dns-table--left">{DNS::HOSTNAME}</td>
			<td class="dns-table__cell dns-table--right">{general::hostname}</td>
		</tr>
	</table>

</div>
<div iw-flex-cell>

	<h3 class="box-content-title gamma">{DNS::DNS}</h4>
	<p class="box-content-desc">{DNS_HELP::DNS}</p>
	<table class="dns-table">
		{dynamic items}
		<tr class="dns-table__row dns-table--{items::*::status}">
			<td class="dns-table__cell dns-table--left">
				<p class="dns-table__text dns-table__type">{items::*::service} ({items::*::type})</p>
				<p class="dns-table__text dns-table__variable">{items::*::variable}</p>
			</td>
			<td class="dns-table__cell dns-table--right">
				{optional items::*::value}
				{dynamic items::*::value}
				<p class="dns-table__text dns-table__value">{items::*::value::*}</p>
				{/dynamic}
				{/optional}
				{noptional items::*::value}
				<p class="dns-table__text dns-table__value">{DNS::NO_DNS_RECORDS}</p>
				{/noptional}
			</td>
		</tr>
		{/dynamic}
	</table>

</div>
</div>
{/optional}
