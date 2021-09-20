CREATE TABLE folder (folder_id INTEGER  , parent_folder_id INTEGER, account_id nvarchar2(2000) DEFAULT '' NOT NULL, name nvarchar2(2000) DEFAULT '' NOT NULL, rights INTEGER DEFAULT 0 NOT NULL , attributes INTEGER DEFAULT 0 NOT NULL , sync CHAR(1), path nvarchar2(2000) DEFAULT '', uid_validity nvarchar2(2000) DEFAULT '', sync_update INTEGER DEFAULT 0 NOT NULL , unseen INTEGER DEFAULT 0 NOT NULL , messages INTEGER DEFAULT 0 NOT NULL , subscription_type nvarchar2(2000) DEFAULT '', CONSTRAINT folder_PK PRIMARY KEY ( folder_id ))
CREATE SEQUENCE SEQ_FOLDER INCREMENT BY 1 START WITH 1 NOMAXVALUE MINVALUE 1 NOCYCLE CACHE 20 NOORDER
CREATE TRIGGER TR_FOLDER BEFORE INSERT OR UPDATE OF FOLDER_ID ON FOLDER REFERENCING NEW AS NEW FOR EACH ROW BEGIN IF :NEW."FOLDER_ID" IS NULL THEN SELECT "SEQ_FOLDER".NEXTVAL INTO :NEW."FOLDER_ID" FROM dual; END IF; END;
CREATE TABLE item (item_id INTEGER  , folder_id INTEGER NOT NULL, rid nvarchar2(2000) DEFAULT '' NOT NULL, message_id varchar(255) , "size" INTEGER NOT NULL, "date" INTEGER NOT NULL, header_from nvarchar2(2000) DEFAULT '' , header_to nvarchar2(2000) DEFAULT '' , header_cc nvarchar2(2000) DEFAULT '', header_bcc nvarchar2(2000) DEFAULT '', header_sms nvarchar2(2000) DEFAULT '', subject nvarchar2(2000) DEFAULT '' , priority INTEGER DEFAULT 0 NOT NULL , flags INTEGER DEFAULT 0 NOT NULL , unread INTEGER DEFAULT 0 NOT NULL , body nvarchar2(2000) DEFAULT '', static_flags INTEGER DEFAULT 0 NOT NULL , smime_status INTEGER DEFAULT 0 NOT NULL , has_attachment VARCHAR(1) DEFAULT 'F' , color VARCHAR(1) DEFAULT 'Z' , completed_on VARCHAR(32),sort_subject nvarchar2(2000) DEFAULT '', sort_from nvarchar2(2000) DEFAULT '', sort_to nvarchar2(2000) DEFAULT '' , sort_cc nvarchar2(2000) DEFAULT '' , sort_bcc nvarchar2(2000) DEFAULT '' , sort_sms nvarchar2(2000) DEFAULT '' , msg_file nvarchar2(2000) DEFAULT '' , flag_update INTEGER DEFAULT 0 NOT NULL , source_folder_id INTEGER , dummy_id INTEGER , is_hidden INTEGER DEFAULT 0 NOT NULL, taglist nvarchar2(2000) DEFAULT '', item_moved INTEGER DEFAULT 0 NOT NULL , CONSTRAINT item_PK PRIMARY KEY ( item_id )) 
CREATE SEQUENCE SEQ_ITEM INCREMENT BY 1 START WITH 1 NOMAXVALUE MINVALUE 1 NOCYCLE CACHE 20 NOORDER
CREATE TRIGGER TR_ITEM BEFORE INSERT OR UPDATE OF ITEM_ID ON ITEM REFERENCING NEW AS NEW OLD AS OLD FOR EACH ROW BEGIN IF :NEW."ITEM_ID" IS NULL THEN SELECT "SEQ_ITEM".NEXTVAL INTO :NEW."ITEM_ID" FROM dual; END IF; END;
CREATE FUNCTION bitnot(x IN NUMBER) RETURN NUMBER AS BEGIN    RETURN (0 - x) - 1; END;
CREATE FUNCTION bitor(x IN NUMBER, y IN NUMBER) RETURN NUMBER AS BEGIN RETURN (x + y - BITAND(x, y)); END;
CREATE INDEX IDX_folder_account ON folder (account_id,folder_id)
CREATE INDEX IDX_folder_parent ON folder (parent_folder_id)
CREATE INDEX IDX_item_date ON item (folder_id,"date")
CREATE INDEX IDX_item_list ON item (folder_id,unread,is_hidden)
CREATE INDEX IDX_item_flag_update ON item (folder_id,flag_update)
CREATE INDEX IDX_item_rid ON item (folder_id,rid)
CREATE INDEX IDX_folder_account ON folder (account_id,folder_id)
CREATE INDEX IDX_folder_parent ON folder (parent_folder_id)
CREATE INDEX IDX_item_date ON item (folder_id,"date")
CREATE INDEX IDX_item_list ON item (folder_id,unread,is_hidden)
CREATE INDEX IDX_item_flag_update ON item (folder_id,flag_update)
CREATE INDEX IDX_item_rid ON item (folder_id,rid)
CREATE TABLE wm_metadata (item_key VARCHAR(128), item_value VARCHAR(128))
INSERT INTO wm_metadata (item_key, item_value) VALUES ('db_version', '26')