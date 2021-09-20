<h3 class="box-content-title gamma">{SMARTDISCOVER::SMARTDISCOVER}</h3>

<div iw-flex-grid="query 2 double-padding">
<div iw-flex-cell>

	<div iw-flex-grid class="form-block" id="{anchor fb_public_hostname}">

	<!-- SmartDiscover - Public Hostname -->
	{include inc_form}
		{	"element_input": true,
			"input_placeholder": "smartdiscover::public_hostname",
			"label_text": "{SMARTDISCOVER::PUBLIC_HOSTNAME}",
			"name": "public_hostname"
		}
	{/include}

	</div>

	<div iw-flex-grid class="form-block" id="{anchor fb_services}">

	<!-- SmartDiscover - SMTP -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::smtp",
			"element_dropdown": true,
			"label_text": "{SMARTDISCOVER::SMTP}",
			"name": "smtp"
		}
	{/include}

	<!-- SmartDiscover - POP3 -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::pop3",
			"element_dropdown": true,
			"label_text": "{SMARTDISCOVER::POP3}",
			"name": "pop3"
		}
	{/include}

	<!-- SmartDiscover - IMAP -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::imap",
			"element_dropdown": true,
			"label_text": "{SMARTDISCOVER::IMAP}",
			"name": "imap"
		}
	{/include}

	<!-- SmartDiscover - XMPP -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::xmpp",
			"element_dropdown": true,
			"label_text": "{SMARTDISCOVER::XMPP}",
			"name": "xmpp"
		}
	{/include}

	<!-- SmartDiscover - SIP -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::sip",
			"element_dropdown": true,
			"label_text": "{SMARTDISCOVER::SIP}",
			"name": "sip"
		}
	{/include}

	</div>

</div>
<div iw-flex-cell>

	<div iw-flex-grid class="form-block" id="{anchor fb_url}">

	<!-- SmartDiscover - MobileSync (ActiveSync) -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::mobilesync",
			"label_text": "{SMARTDISCOVER::MOBILESYNC}",
			"name": "mobilesync",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - WebDAV & SmartAttach -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::webdav_smartattach",
			"label_text": "{SMARTDISCOVER::WEBDAV_SMARTATTACH}",
			"name": "webdav_smartattach",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - WebClient -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::webclient",
			"label_text": "{SMARTDISCOVER::WEBCLIENT}",
			"name": "webclient",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - WebAdmin -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::webadmin",
			"label_text": "{SMARTDISCOVER::WEBADMIN}",
			"name": "webadmin",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - Free / Busy -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::free_busy",
			"label_text": "{SMARTDISCOVER::FREE_BUSY}",
			"name": "free_busy",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - Internet Calendar -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::internet_calendar",
			"label_text": "{SMARTDISCOVER::INTERNET_CALENDAR}",
			"name": "internet_calendar",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - SMS -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::sms",
			"label_text": "{SMARTDISCOVER::SMS}",
			"name": "sms",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - Anti-Spam Reports -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::anti_spam_reports",
			"label_text": "{SMARTDISCOVER::ANTI_SPAM_REPORTS}",
			"name": "anti_spam_reports",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - Install -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::install",
			"label_text": "{SMARTDISCOVER::INSTALL}",
			"name": "install",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - TeamChat -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::teamchat",
			"label_text": "{SMARTDISCOVER::TEAMCHAT}",
			"name": "teamchat",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - Collaboration API URL -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::collaboration",
			"label_text": "{SMARTDISCOVER::COLLABORATION}",
			"name": "collaboration",
			"item_class": "row"
		}
	{/include}

	<!-- SmartDiscover - Conference URL -->
	{include inc_form}
		{	"element_input": true,
			"input_type": "url",
			"input_placeholder": "smartdiscover::conference",
			"label_text": "{SMARTDISCOVER::CONFERENCE}",
			"name": "conference",
			"item_class": "row"
		}
	{/include}

	</div>

</div>
</div>
