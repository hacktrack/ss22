<div class="preview__card">
	<div class="preview__card-section">
		<div class="preview__language" iw-section="language">
			<span>{PREVIEW::LANGUAGE} ▼</span>
		</div>
		<div class="preview__logo">
			<div style="height:100%" id="{anchor login_logo_default}">
				{include ../login/images/login-logo}{/include}
			</div>
			<img id="{anchor login_logo_custom}" class="login-logo" src="" is-hidden="1">
		</div>
		<div class="preview__text">
			<h1>{PREVIEW::SIGN_IN_WEBCLIENT}</h1>
			<p>account@domain.com</p>
		</div>
	</div>
	<div class="preview__card-section preview__card-section--form">
		<div class="preview__input">
			<span>{PREVIEW::PASSWORD}</span>
			<strong iw-section="autofill">••••••••••••</strong>
		</div>
	</div>
	<div class="preview__card-section">
		<div class="preview__button">
			<button><span>{PREVIEW::SIGN_IN}</span></button>
		</div>
		<div class="preview__checkbox" iw-section="remember">
			<i></i>
			<label>{PREVIEW::REMEMBER_ME}</label>
		</div>
		<div class="preview__link" iw-section="support">
			<span><a>{PREVIEW::CONTACT_ADMIN} ›</a></span>
		</div>
		<div style="clear: both;"></div>
	</div>
	<div class="preview__card-section" iw-section="sign_up">
		<div class="preview__card-footer">
			<span>{PREVIEW::NOT_YOU} <a>{PREVIEW::CHOOSE_ACCOUNT} ›</a></span>
		</div>
	</div>
	<div iw-section="search" class="preview__card-section preview__card-section--form">
		<div class="preview__input">
			<span>{PREVIEW::SEARCH}</span>
		</div>
	</div>
</div>

<div class="preview__footer">
	<div class="preview__footer--left">
		<span class="preview__icon preview__icon--w"></span>
		<span>{PREVIEW::POWERED}</span>
	</div>
	<div class="preview__footer--center">
		<span class="preview__icon preview__icon--f" iw-section="facebook"></span>
		<span class="preview__icon preview__icon--t" iw-section="twitter"></span>
		<span class="preview__icon preview__icon--l" iw-section="linkedin"></span>
	</div>
	<div class="preview__footer--right">
		<span>{PREVIEW::FIND_OUT_MORE}</span>
		<a>www.icewarp.com</a>
	</div>
</div>
