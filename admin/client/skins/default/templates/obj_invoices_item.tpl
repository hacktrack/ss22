<ul class="table-row">
	<li class="table__cell invoice-empty text-center" is-hidden="1">
		<span class="icon-documents"></span>
		<span>{SUBSCRIPTION::NO_INVOICES}</span>
	</li>
	<li class="table__cell invoice-date">{item::date}</li>
	<li class="table__cell invoice-number">{item::id}</li>
	<li class="table__cell invoice-price">{item::price}</li>
	<li class="table__cell invoice-download">
		<obj name="invoice_download" type="obj_button" css="text primary icon-arrow-down" tabindex="true">
			<value>generic::download</value>
		</obj>
	</li>
</ul>
