<ul class="table-row _item-row{optional item::isdefault} u-bold{/optional}">
	<li class="table__cell table-select-row">
		<obj name="checkbox" type="obj_checkbox" tabindex="true"></obj>
	</li>
	<li class="table__cell certificate-type no-wrap" id="{anchor certificate_}{item::id}">
		<span class="icon-certificate certificate_{item::status} u-margin-right"></span>
		<span>{item::typename}{optional item::iscsr} [{CERTIFICATES::CSR}]{/optional}</span>
	</li>
	<li class="table__cell certificate-hostname">
		{noptional item::hostnames}&mdash;{/noptional}
		{optional item::hostnames}{item::hostnames}{/optional}
	</li>
	<li class="table__cell certificate-ip text-center">
		{optional item::iscsr}&mdash;{/optional}
		{noptional item::iscsr}{item::ipaddresses}{/noptional}
	</li>
	<li class="table__cell certificate-expiration text-center">
		{optional item::iscsr}&mdash;{/optional}
		{noptional item::iscsr}
		{optional item::expiration}{item::expiration}{/optional}
		{/noptional}
	</li>
</ul>
