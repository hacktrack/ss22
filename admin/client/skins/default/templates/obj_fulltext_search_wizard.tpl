<!-- White Labeling - Login screen -->
<div iw-flex-grid class="form__section">
	<div iw-flex-cell>

		<div iw-flex-grid>
			<div iw-flex-cell id="{anchor steps}">

				<ul class="steps u-margin-top">
					<li class="steps__item"></li>
					<li class="steps__item"></li>
					<li class="steps__item"></li>
					<li class="steps__item"></li>
					<li class="steps__item"></li>
				</ul>

			</div>

			<div iw-flex-cell class="form__block" id="{anchor step0}">
				<h4 class="form__block-title">{FULLTEXT_SEARCH_WIZARD::SEARCH}</h4>
				<p class="form__block-desc">{FULLTEXT_SEARCH_WIZARD::SEARCH_HELPER1}</p>
				<p class="form__block-desc">{FULLTEXT_SEARCH_WIZARD::SEARCH_HELPER2}</p>
				<ul class="form__block-desc">
					<li>{FULLTEXT_SEARCH_WIZARD::SEARCH_HELPER_COMPONENT1}</li>
					<li>{FULLTEXT_SEARCH_WIZARD::SEARCH_HELPER_COMPONENT2}</li>
					<li>{FULLTEXT_SEARCH_WIZARD::SEARCH_HELPER_COMPONENT3}</li>
				</ul>
				<div iw-flex-grid>

					{include inc_form}
					{
						"label_toggle": "FULLTEXT_SEARCH_WIZARD::SEARCH_ENABLE",
						"name": "c_system_services_fulltext_enabled",
						"item_class": "row"
					}
					{/include}

				</div>
			</div>

			<div iw-flex-cell is-hidden class="form__block" id="{anchor step1}">
				<h4 class="form__block-title">{FULLTEXT_SEARCH_WIZARD::SCANNER}</h4>
				<p class="form__block-desc">{FULLTEXT_SEARCH_WIZARD::SCANNER_HELPER}</p>
				<div iw-flex-grid iw-flex-cell>

					<div>
						<div>
							<obj name="scanner_local" type="obj_radio" group="scanner" tabindex="true">
								<label>FULLTEXT_SEARCH_WIZARD::SCANNER_LOCAL</label>
								<value>0</value>
							</obj>
						</div>
						<div class="pad">
							{include inc_form}
							{
								"element_input": true,
								"input_type": "number",
								"input_placeholder_plain": "25795",
								"label_text": "{FULLTEXT_SEARCH_WIZARD::SCANNER_LOCAL_HELPER}",
								"name": "c_system_services_fulltext_scanner_url_local",
								"item_class": "row"
							}
							{/include}
						</div>
					</div>

					<div>
						<div>
							<obj name="scanner_remote" type="obj_radio" group="scanner" tabindex="true">
								<label>FULLTEXT_SEARCH_WIZARD::SCANNER_REMOTE</label>
								<value>1</value>
							</obj>
						</div>
						<div class="pad">
							{include inc_form}
							{
								"element_input": true,
								"input_type": "text",
								"input_placeholder_plain": "http://127.0.0.1:25795",
								"label_text": "{FULLTEXT_SEARCH_WIZARD::SCANNER_REMOTE_HELPER}",
								"name": "c_system_services_fulltext_scanner_url_remote"
							}
							{/include}
						</div>

					</div>
				</div>
			</div>

			<div iw-flex-cell is-hidden class="form__block" id="{anchor step2}">
				<h4 class="form__block-title">{FULLTEXT_SEARCH_WIZARD::DATABASE}</h4>
				<p class="form__block-desc">{FULLTEXT_SEARCH_WIZARD::DATABASE_HELPER1}</p>
				<p class="form__block-desc">{FULLTEXT_SEARCH_WIZARD::DATABASE_HELPER2}</p>
				<div iw-flex-grid iw-flex-cell>

					<div>
						<div>
							<obj name="database_local" type="obj_radio" group="database" tabindex="true">
								<label>FULLTEXT_SEARCH_WIZARD::database_LOCAL</label>
								<value>0</value>
							</obj>
						</div>
						<div class="pad">
							{include inc_form}
							{
								"element_input": true,
								"input_type": "number",
								"input_placeholder_plain": "25793",
								"label_text": "{FULLTEXT_SEARCH_WIZARD::DATABASE_LOCAL_HELPER}",
								"name": "c_system_services_fulltext_database_url_local",
								"item_class": "row"
							}
							{/include}

							{include inc_form}
							{
								"element_input": true,
								"input_type": "text",
								"input_placeholder_plain": "",
								"label_text": "{FULLTEXT_SEARCH_WIZARD::INDEX_STORAGE_PATH}",
								"name": "c_system_services_fulltext_database_path"
							}
							{/include}
						</div>
					</div>

					<div>
						<div>
							<obj name="database_remote" type="obj_radio" group="database" tabindex="true">
								<label>FULLTEXT_SEARCH_WIZARD::database_REMOTE</label>
								<value>1</value>
							</obj>
						</div>
						<div class="pad">
							{include inc_form}
							{
								"element_input": true,
								"input_type": "text",
								"input_placeholder_plain": "http://127.0.0.1:25793",
								"label_text": "{FULLTEXT_SEARCH_WIZARD::DATABASE_REMOTE_HELPER}",
								"name": "c_system_services_fulltext_database_url_remote"
							}
							{/include}
						</div>

					</div>
				</div>
			</div>

			<div iw-flex-cell is-hidden class="form__block" id="{anchor step3}">
				<h4 class="form__block-title">{FULLTEXT_SEARCH_WIZARD::DOCCONV}</h4>
				<p class="form__block-desc">{FULLTEXT_SEARCH_WIZARD::DOCCONV_HELPER}</p>
				<div iw-flex-grid iw-flex-cell>

					<div>
						<div>
							<obj name="docconv_local" type="obj_radio" group="docconv" tabindex="true">
								<label>FULLTEXT_SEARCH_WIZARD::docconv_LOCAL</label>
								<value>0</value>
							</obj>
						</div>
						<div class="pad">
							{include inc_form}
							{
								"element_input": true,
								"input_type": "number",
								"input_placeholder_plain": "25797",
								"label_text": "{FULLTEXT_SEARCH_WIZARD::DOCCONV_LOCAL_HELPER}",
								"name": "c_system_services_fulltext_docconv_url_local",
								"item_class": "row"
							}
							{/include}
						</div>
					</div>

					<div>
						<div>
							<obj name="docconv_remote" type="obj_radio" group="docconv" tabindex="true">
								<label>FULLTEXT_SEARCH_WIZARD::docconv_REMOTE</label>
								<value>1</value>
							</obj>
						</div>
						<div class="pad">
							{include inc_form}
							{
								"element_input": true,
								"input_type": "text",
								"input_placeholder_plain": "http://127.0.0.1:25797",
								"label_text": "{FULLTEXT_SEARCH_WIZARD::DOCCONV_REMOTE_HELPER}",
								"name": "c_system_services_fulltext_docconv_url_remote"
							}
							{/include}
						</div>

					</div>

					<div>
						<div>
							<obj name="docconv_disable" type="obj_radio" group="docconv" tabindex="true">
								<label>FULLTEXT_SEARCH_WIZARD::docconv_DISABLE</label>
								<value>2</value>
							</obj>
						</div>
					</div>
				</div>
			</div>

			<div iw-flex-cell is-hidden class="form__block" id="{anchor step4}">
				<h4 class="form__block-title">{FULLTEXT_SEARCH_WIZARD::SUMMARY}</h4>
				<p class="form__block-desc">{FULLTEXT_SEARCH_WIZARD::SUMMARY_HELPER}</p>
				<div iw-flex-grid>

					{include inc_form}
					{
						"element_input": true,
						"input_type": "text",
						"input_placeholder_plain": "",
						"input_readonly": true,
						"label_text": "{FULLTEXT_SEARCH::INDEXER}",
						"name": "indexer"
					}
					{/include}
					{include inc_form}
					{
						"element_input": true,
						"input_type": "text",
						"input_placeholder_plain": "",
						"input_readonly": true,
						"label_text": "{FULLTEXT_SEARCH::SERVER}",
						"name": "server"
					}
					{/include}
					{include inc_form}
					{
						"element_input": true,
						"input_type": "text",
						"input_placeholder_plain": "",
						"input_readonly": true,
						"label_text": "{FULLTEXT_SEARCH::INDEXPATH}",
						"name": "indexpath"
					}
					{/include}
					{include inc_form}
					{
						"element_input": true,
						"input_type": "text",
						"input_placeholder_plain": "",
						"input_readonly": true,
						"label_text": "{FULLTEXT_SEARCH::DOCCONV}",
						"name": "docconv"
					}
					{/include}
				</div>
			</div>

		</div>
	</div>
</div>
