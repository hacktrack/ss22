
// Add screen sharing support if Chrome
if('chrome' in window) {
	var WebRTCSharing = (function(){
        var sharing = {};

		// Access plugin from icewarp
		var iframe = document.createElement('iframe');
		iframe.onload = function() {
			iframe.isLoaded = true;
		};
		iframe.src = 'https://www.icewarp.com/screen-sharing-support.html'; // Testing 'https://mail.icewarp.com/svn/webmail/client/inc/sip/getSourceId.html';

		iframe.style.display = 'none';
		document.body.appendChild(iframe);

		// Interface to get id for sharing via callback
		sharing.getScreenId = function(callback) {

			// Make sure that external script is loaded
			if (!iframe.isLoaded) {
				setTimeout(function(){
				  sharing.getScreenId(callback);
				}, 500);
				return;
			}
	 
			// Ask plugin to provide sharing id
			iframe.contentWindow.postMessage({
				captureSourceId: true
			}, '*');
	 
			// Parsing and returning sharing id
			var receiveResponse = function(event) {
				if (!event.data) return;

				if (event.data.chromeMediaSourceId) {
					if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
						callback('permission-denied', null);
					} else callback(null, event.data.chromeMediaSourceId);
				}

				if (event.data.chromeExtensionStatus) {
					callback(event.data.chromeExtensionStatus, null);
				}

				// Remove listener to avoid multiple returns
				window.removeEventListener('message', receiveResponse, true);
			};

			// Add listener to get message after call
			window.addEventListener('message', receiveResponse, true);
		};

        return sharing;
	})();
};