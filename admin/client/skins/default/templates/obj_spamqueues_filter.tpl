<div iw-flex-grid="query" class="u-flex-none u-margin-top">
<div iw-flex-cell="6">

	<div iw-flex-grid="fit">

	<!-- Spam Queues - Filter - Sender -->
	<div iw-flex-cell id="{anchor fi_filter_sender}">
		<obj name="input_filter_sender" type="obj_input_text" css="u-margin-bottom" tabindex="true">
			<placeholder>spamqueues_header::filter_sender</placeholder>
		</obj>
	</div>

	<!-- Spam Queues - Filter - Owner -->
	<div iw-flex-cell="half-padding" id="{anchor fi_filter_owner}">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_filter_owner" type="obj_input_text" tabindex="true" css="group-left">
				<placeholder>spamqueues_header::filter_owner</placeholder>
			</obj>
		</div>
		<div iw-flex-cell="none">
			<obj name="button_filter_owner" type="obj_button" css="icon icon-user small group-right inner-button" tabindex="true"></obj>
		</div>
		</div>
	</div>

	<!-- Spam Queues - Filter - Domain -->
	<div iw-flex-cell="half-padding" id="{anchor fi_filter_domain}">
		<div iw-flex-grid="fit group">
		<div iw-flex-cell>
			<obj name="input_filter_domain" type="obj_input_text" tabindex="true" css="group-left">
				<placeholder>spamqueues_header::filter_domain</placeholder>
			</obj>
		</div>
		<div iw-flex-cell="none">
			<obj name="button_filter_domain" type="obj_button" css="icon icon-server small group-right inner-button" tabindex="true"></obj>
		</div>
		</div>
	</div>

	</div>

</div>
<div iw-flex-cell="2 text-end" id="{anchor fi_filter}">
	<obj name="button_filter" type="obj_button" css="text primary" tabindex="true">
		<value>spamqueues_header::filter</value>
	</obj>
</div>
</div>
