<div iw-flex-grid="query 2 double-padding">
	<div iw-flex-cell>

		<!-- Active users -->
		<div class="box-content-title" id="{anchor active_users}">{SUBSCRIPTION::ACTIVE_USERS}
			<obj name="plan_details" type="obj_button" css="text link" tabindex="true">
				<value>subscription::plan_details</value>
			</obj>
		</div>
		<div class="form-block" id="{anchor fb_plan_details}"></div>

		<!-- Next billing -->
		<div class="box-content-title" id="{anchor fb_next_billing_title}">{SUBSCRIPTION::NEXT_BILLING}
			<span class="box-content-title-context">{SUBSCRIPTION::BILLING_PERIOD} <span class="color-primary" id="{anchor billing_period}"></span></span>
		</div>
		<div class="form-block" id="{anchor fb_next_billing}"></div>

	</div>

	<div iw-flex-cell>

		<!-- Last invoices -->
		<div class="box-content-title" id="{anchor fb_last_invoices_title}">{SUBSCRIPTION::LAST_INVOICES}
			<obj name="show_invoice_list" type="obj_button" css="text link" tabindex="true">
				<value>subscription::show_invoice_list</value>
			</obj>
		</div>
		<div class="form-block" id="{anchor fb_last_invoices}">
			<obj name="list" type="obj_loadable" iw-type="fixed">
				<value>obj_invoices_item</value>
			</obj>
		</div>

		<!-- Payment details -->
		<div class="box-content-title">{SUBSCRIPTION::PAYMENTS}
			<obj name="subscription_settings" type="obj_button" css="text primary" tabindex="true">
				<value>subscription::subscription_settings</value>
			</obj>
		</div>
		<div class="form-block" id="{anchor fb_payment_details}">
			<div class="panel" iw-type="block" id="{anchor payment_details}">
				<div class="panel-group">
					<h4 class="panel-title panel-title--border delta">{SUBSCRIPTION::ORDER_INFORMATION}</h4>
					<div iw-flex-grid="3 qs">
						<div iw-flex-cell>
							<div class="panel-item">
								<label class="panel-label">{SUBSCRIPTION::ORDER_ID}</label>
								<span class="panel-value" id="{anchor order_id}">{htmlspecialchars orderid}</span>
							</div>
						</div>
						<div iw-flex-cell>
							<div class="panel-item">
								<label class="panel-label">{SUBSCRIPTION::COMPANY_NAME}</label>
								<span class="panel-value" id="{anchor company_name}">{htmlspecialchars organization}</span>
							</div>
						</div>
						<div iw-flex-cell>
							<div class="panel-item">
								<label class="panel-label">{SUBSCRIPTION::BILLING_ADDRESS}</label>
								<span class="panel-value" id="{anchor billing_address}">{htmlspecialchars street}<br>{htmlspecialchars region} {htmlspecialchars areacode}<br>{htmlspecialchars country}</span>
							</div>
						</div>
					</div>
				</div>
				{optional cloudshowprice}
				{optional carddigits}
				<div class="panel-group">
					<h4 class="panel-title panel-title--border delta">{SUBSCRIPTION::CARD_DETAILS}</h4>
					<div iw-flex-grid="3 qs">
						<div iw-flex-cell>
							<div class="panel-item">
								<label class="panel-label">{SUBSCRIPTION::CARD_NUMBER}</label>
								<span class="panel-value" id="{anchor card_number}"> **** **** **** {carddigits}</span>
							</div>
						</div>
						<div iw-flex-cell>
							<div class="panel-item">
								<label class="panel-label">{SUBSCRIPTION::EXPIRATION_DATE}</label>
								<span class="panel-value" id="{anchor expiration_date}">{cardexpiration}</span>
							</div>
						</div>
					</div>
				</div>
				{/optional}
				{/optional}
			</div>
		</div>

		<div class="box-content-title" id="{anchor datacenter_storage_support_title}" is-hidden>{SUBSCRIPTION::DATACENTER_STORAGE_SUPPORT}</div>
		<div class="box-content-title" id="{anchor support_title}">{SUBSCRIPTION::SUPPORT}</div>
		<div class="form-block">
			<div class="topbar" iw-type="stats" id="{anchor support_topbar}" is-hidden></div>
			<div class="panel" iw-type="block" id="{anchor support_panel}">
				<div iw-flex-grid="center query">
					<div iw-flex-cell="4">
						<div iw-flex-grid="center fit">
							<div iw-flex-cell="none">
								<span class="icon icon-info-ico color-primary"></span>
							</div>
							<div iw-flex-cell="half-padding">
								<span>{SUBSCRIPTION::CONTACT_OUR_SUPPORT}</span>
							</div>
						</div>
					</div>
					{optional technicalcontact}
					<div iw-flex-cell="2">
						<div class="panel-item">
							<label class="panel-label">{SUBSCRIPTION::TECHNICAL_SUPPORT}</label>
							<a href="{noptional technicalcontact_url}mailto:{/noptional}{technicalcontact}" class="panel-value">{htmlspecialchars technicalcontact}</a>
						</div>
					</div>
					{/optional}
					{optional salescontact}
					<div iw-flex-cell="2">
						<div class="panel-item">
							<label class="panel-label">{SUBSCRIPTION::BUSINESS_SUPPORT}</label>
							<a href="{noptional salescontact_url}mailto:{/noptional}{salescontact}" class="panel-value">{htmlspecialchars salescontact}</a>
						</div>
					</div>
					{/optional}
				</div>
			</div>
		</div>
	</div>
</div>
