<div class="popupmaindialog">
	<h3>{VERIFICATION::SMS_LBL}</h3>
	<p>{label}</p>
	<div class="block ico">
		<svg class="ico phone" xmlns="http://www.w3.org/2000/svg" width="24" height="46" viewBox="0 0 24 46">
			<g fill="none" fill-rule="evenodd">
				<path stroke="#333" d="M.5.5h23v45H.5z"/>
				<path class="anim" fill="#333" fill-rule="nonzero" d="M16.85 16l.15.15v5.7l-.15.15h-4.66l-1.63 1.11V22H8.15L8 21.85v-5.7l.15-.15h8.7zm.41-1H7.74l-.74.73v6.53l.73.73h1.82v2L12.5 23h4.77l.73-.74v-6.53l-.73-.73h-.01z"/>
				<path fill="#333" d="M10 3h4v1h-4z"/>
				<circle cx="12" cy="41" r="1.5" stroke="#333"/>
				<path fill="#333" d="M0 36h23v1H0z"/>
			</g>
		</svg>
		<svg class="ico enter" xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13">
			<path fill="#333" fill-rule="evenodd" d="M14.715 6L9.662 1.369l.676-.738L16.74 6.5l-6.402 5.869-.676-.738L14.715 7H0V6h14.715z"/>
		</svg>
		<span>{VERIFICATION::SMS_CODE}</span>
		<obj name="code" type="obj_input" css="obj_input_100 space" focus="true" tabindex="true"><placeholder>{VERIFICATION::SMS_CODE_PH}</placeholder></obj>
	</div>

	<p>{pwd_lbl}<obj name="pass" type="obj_password" css="obj_input_100" tabindex="true"><placeholder>{FORM_ACCOUNTS::PASSWORD}</placeholder></obj></p>
</div>