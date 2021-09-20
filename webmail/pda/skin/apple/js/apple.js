		var currentWidth = 0;
		var updateLayout = function () {
			if (window.innerWidth != document.currentWidth) {
				window.scrollTo(0, 1);
				if (!document.currentWidth)
					window.setInterval(updateLayout, 500);
				document.currentWidth = window.innerWidth;
			}
		};
		addEventListener('load', function() { setTimeout(updateLayout, 0); }, false);

		/* submit parent form + add hidden item from sName with value 1 */
		function frm_submit(sName){
			if (typeof sName == 'string'){
				var s = document.createElement('input');
				s.type = 'hidden';
				s.name = '__a_grid_sort';
				s.value = 'true';
				document.forms[sName].appendChild(s);
				document.forms[sName].submit();
			}
			else
			if (typeof sName == 'object')
				sName.form.submit();
		};

		/* addressbook check address */
		function check_address (elm){
			elm.parentNode.getElementsByTagName('input')[0].checked = !(elm.parentNode.getElementsByTagName('input')[0].checked);
		};
		
		function go_back (){
			/*if (document.referrer)
			    document.location.href = document.referrer;
			else*/
				history.go(-1);
		};
		
		function confirm_select(value,element)
		{
			for(var i in value){
				if(value[i][0]==element.value){
					return confirm(value[i][1]);
				}
			}
			return true;
		}
		
if(document.getElementById("checkall")){document.getElementById("checkall").style.display="inline";}