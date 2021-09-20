CREATE TABLE folder (folder_id INTEGER PRIMARY KEY IDENTITY, parent_folder_id INTEGER, account_id varchar(8000)  NOT NULL, name varchar(8000)  NOT NULL, rights INTEGER DEFAULT 0 NOT NULL , attributes INTEGER DEFAULT 0 NOT NULL , sync CHAR(1), path varchar(8000) , uid_validity varchar(8000) , sync_update INTEGER DEFAULT 0 NOT NULL , unseen INTEGER DEFAULT 0 NOT NULL , messages INTEGER DEFAULT 0 NOT NULL , subscription_type varchar(8000) )
CREATE TABLE item (item_id INTEGER PRIMARY KEY IDENTITY, folder_id INTEGER NOT NULL, rid varchar(8000)  NOT NULL, message_id varchar(255) , size INTEGER NOT NULL, date INTEGER NOT NULL, header_from varchar(8000)  , header_to varchar(8000)  , header_cc varchar(8000) , header_bcc varchar(8000) , header_sms varchar(8000) , subject varchar(8000)  , priority INTEGER DEFAULT 0 NOT NULL , flags INTEGER DEFAULT 0 NOT NULL , unread INTEGER DEFAULT 0 NOT NULL , body varchar(8000) , static_flags INTEGER DEFAULT 0 NOT NULL , smime_status INTEGER DEFAULT 0 NOT NULL , has_attachment VARCHAR(1) DEFAULT 'F' , color VARCHAR(1) DEFAULT 'Z' , completed_on VARCHAR(32),sort_subject varchar(8000) , sort_from varchar(8000) , sort_to varchar(8000)  , sort_cc varchar(8000)  , sort_bcc varchar(8000)  , sort_sms varchar(8000)  , msg_file varchar(8000)  , flag_update INTEGER DEFAULT 0 NOT NULL , source_folder_id INTEGER , dummy_id INTEGER , is_hidden INTEGER DEFAULT 0 NOT NULL, taglist varchar(8000) , item_moved INTEGER DEFAULT 0 NOT NULL ) 
CREATE INDEX IDX_folder_account ON folder (account_id,folder_id)
CREATE INDEX IDX_folder_parent ON folder (parent_folder_id)
CREATE INDEX IDX_item_date ON item (folder_id,date)
CREATE INDEX IDX_item_list ON item (folder_id,unread,is_hidden)
CREATE INDEX IDX_item_flag_update ON item (folder_id,flag_update)
CREATE INDEX IDX_item_rid ON item (folder_id,rid)
CREATE TABLE wm_metadata (item_key VARCHAR(128), item_value VARCHAR(128))
INSERT INTO wm_metadata (item_key, item_value) VALUES ('db_version', '26')