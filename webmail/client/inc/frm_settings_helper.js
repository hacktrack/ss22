/**
 * Helper for settings form (admin/domain/user settings)
 * 
 * @param Boolean bIsDomainForm Domain settings
 * @param Boolean bIsAdminForm  Admin settings
 * 
 * @return undefined
 */
function FrmSettingsHelper(bIsDomainForm, bIsAdminForm) {
	this.__bIsDomainForm = bIsDomainForm;
	this.__bIsAdminForm = bIsAdminForm;
}

/**
 * Disables/enables fields related to html/text message setting. Also disables/enables force checkboxes
 * 
 * @param Object  oForm    Form which contains related fields (i.e. font_family, font_size ...)
 * @param Boolean bDisable Disable or enable the fields
 * 
 * @return undefined
 */
FrmSettingsHelper.prototype.htmlMessageFormatChange = function(oForm, bDisable) {
	var aFields = ['font_family', 'text_direction', 'font_size'],
		i, sFieldName, oCheckboxes;

	for (i = 0; i < aFields.length; i++) {
		sFieldName = aFields[i];
		oCheckboxes = oForm['x_' + sFieldName + '_set'];

		oForm[sFieldName]._disabled(bDisable);
		
		if (this.__bIsAdminForm) {
			oCheckboxes.user._disabled(bDisable);

			if (!this.__bIsDomainForm) {
				oCheckboxes.domadmin._disabled(bDisable);
			}
		}
	}
};