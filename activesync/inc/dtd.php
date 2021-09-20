<?php
//Code Pages for MS Exchange ActiveSync Client Protocol 16.1
//[MS-ASWBXML] v22.0 (1.10.2018)

$code2namespace=array(
	0x00=>'AirSync:',
	0x01=>'Contacts:',
	0x02=>'Email:',
	0x03=>'AirNotify:',
	0x04=>'Cal:',		//Calendar
	0x05=>'Move:',
	0x06=>'ItemEstimate:',	//GetItemEstimeate
	0x07=>'FolderHierarchy:',
	0x08=>'MeetingResponse:',
	0x09=>'Tasks:',
	0x0A=>'ResolveRecipients:',
	0x0B=>'ValidateCerts:',
	0x0C=>'Contacts2:',
	0x0D=>'Ping:',
	0x0E=>'Provision:',
	0x0F=>'Search:',
	0x10=>'Gal:',
	0x11=>'AirSyncBase:',	//EAS v12.0
	0x12=>'Settings:',
	0x13=>'DocumentLibrary:',
	0x14=>'ItemOperations:',
	0x15=>'ComposeMail:',	//EAS v14.0
	0x16=>'Email2:',
	0x17=>'Notes:',
	0x18=>'RightsManagement:',	//EAS v14.1
	0x19=>'Find:');			//EAS v16.1

$namespace2code=array(
	'AirSync:'=>0x00,
	'Contacts:'=>0x01,
	'Email:'=>0x02,
	'AirNotify:'=>0x03,
	'Cal:'=>0x04,
	'Move:'=>0x05,
	'ItemEstimate:'=>0x06,
	'FolderHierarchy:'=>0x07,
	'MeetingResponse:'=>0x08,
	'Tasks:'=>0x09,
	'ResolveRecipients:'=>0x0A,
	'ValidateCerts:'=>0x0B,
	'Contacts2:'=>0x0C,
	'Ping:'=>0x0D,
	'Provision:'=>0x0E,
	'Search:'=>0x0F,
	'Gal:'=>0x10,
	'AirSyncBase:'=>0x11,
	'Settings:'=>0x12,
	'DocumentLibrary:'=>0x13,
	'ItemOperations:'=>0x14,
	'ComposeMail:'=>0x15,
	'Email2:'=>0x16,
	'Notes:'=>0x17,
	'RightsManagement:'=>0x18,
	'Find:'=>0x19);

$code2tag=array(
	//AirSync
	0x00=>array(
		0x05=>'Sync',
		0x06=>'Responses',
		0x07=>'Add',
		0x08=>'Change',
		0x09=>'Delete',
		0x0A=>'Fetch',
		0x0B=>'SyncKey',
		0x0C=>'ClientId',
		0x0D=>'ServerId',
		0x0E=>'Status',
		0x0F=>'Collection',
		0x10=>'Class',
		0x11=>'Version',	//Unused
		0x12=>'CollectionId',
		0x13=>'GetChanges',
		0x14=>'MoreAvailable',
		0x15=>'WindowSize',
		0x16=>'Commands',
		0x17=>'Options',
		0x18=>'FilterType',
		0x19=>'Truncation',	//Max EAS v2.5
		0x1A=>'RTFTruncation',	//Unused
		0x1B=>'Conflict',
		0x1C=>'Collections',
		0x1D=>'ApplicationData',
		0x1E=>'DeletesAsMoves',
		0x1F=>'NotifyGUID',	//Unused
		0x20=>'Supported',
		0x21=>'SoftDelete',
		0x22=>'MIMESupport',
		0x23=>'MIMETruncation',
		0x24=>'Wait',		//EAS v12.1
		0x25=>'Limit',
		0x26=>'Partial',
		0x27=>'ConversationMode',	//EAS v14.0
		0x28=>'MaxItems',
		0x29=>'HeartbeatInterval'),
	//Contacts
	0x01=>array(
		0x05=>'Anniversary',
		0x06=>'AssistantName',
		0x07=>'AssistnameTelephoneNumber',	//AssistnamePhoneNumber
		0x08=>'Birthday',
		0x09=>'Body',				//Max EAS v2.5
		0x0A=>'BodySize',			//Max EAS v2.5
		0x0B=>'BodyTruncated',			//Max EAS v2.5
		0x0C=>'Business2TelephoneNumber',	//Business2PhoneNumber
		0x0D=>'BusinessAddressCity',
		0x0E=>'BusinessAddressCountry',
		0x0F=>'BusinessAddressPostalCode',
		0x10=>'BusinessAddressState',
		0x11=>'BusinessAddressStreet',
		0x12=>'BusinessFaxNumber',
		0x13=>'BusinessTelephoneNumber',	//BusinessPhoneNumber
		0x14=>'CarTelephoneNumber',		//CarPhoneNumber
		0x15=>'Categories',
		0x16=>'Category',
		0x17=>'Children',
		0x18=>'Child',
		0x19=>'CompanyName',
		0x1A=>'Department',
		0x1B=>'Email1Address',
		0x1C=>'Email2Address',
		0x1D=>'Email3Address',
		0x1E=>'FileAs',
		0x1F=>'FirstName',
		0x20=>'Home2TelephoneNumber',	//Home2PhoneNumber
		0x21=>'HomeAddressCity',
		0x22=>'HomeAddressCountry',
		0x23=>'HomeAddressPostalCode',
		0x24=>'HomeAddressState',
		0x25=>'HomeAddressStreet',
		0x26=>'HomeFaxNumber',
		0x27=>'HomeTelephoneNumber',	//HomePhoneNumber
		0x28=>'JobTitle',
		0x29=>'LastName',
		0x2A=>'MiddleName',
		0x2B=>'MobileTelephoneNumber',	//MobilePhoneNumber
		0x2C=>'OfficeLocation',
		0x2D=>'OtherAddressCity',
		0x2E=>'OtherAddressCountry',
		0x2F=>'OtherAddressPostalCode',
		0x30=>'OtherAddressState',
		0x31=>'OtherAddressStreet',
		0x32=>'PagerNumber',
		0x33=>'RadioTelephoneNumber',	//RadioPhoneNumber
		0x34=>'Spouse',
		0x35=>'Suffix',
		0x36=>'Title',
		0x37=>'WebPage',
		0x38=>'YomiCompanyName',
		0x39=>'YomiFirstName',
		0x3A=>'YomiLastName',
		0x3B=>'CompressedRTF',
		0x3C=>'Picture',
		0x3D=>'Alias',	//EAS v14.0
		0x3E=>'WeightedRank'),
	//Email
	0x02=>array(
		0x05=>'Attachment',	//Max EAS v2.5
		0x06=>'Attachments',	//Max EAS v2.5
		0x07=>'AttName',	//Max EAS v2.5
		0x08=>'AttSize',	//Max EAS v2.5
		0x09=>'AttOId',		//Max EAS v2.5 AttOid
		0x0A=>'AttMethod',	//Max EAS v2.5
		0x0B=>'AttRemoved',	//Unused
		0x0C=>'Body',		//Max EAS v2.5
		0x0D=>'BodySize',	//Max EAS v2.5
		0x0E=>'BodyTruncated',	//Max EAS v2.5
		0x0F=>'DateReceived',
		0x10=>'DisplayName',	//Max EAS v2.5
		0x11=>'DisplayTo',
		0x12=>'Importance',
		0x13=>'MessageClass',
		0x14=>'Subject',
		0x15=>'Read',
		0x16=>'To',
		0x17=>'Cc',
		0x18=>'From',
		0x19=>'ReplyTo',
		0x1A=>'AllDayEvent',
		0x1B=>'Categories',
		0x1C=>'Category',
		0x1D=>'DTStamp',	//DtStamp
		0x1E=>'End',		//EndTime
		0x1F=>'InstanceType',
		0x20=>'BusyStatus',
		0x21=>'Location',	//Max EAS v14.1
		0x22=>'MeetingRequest',
		0x23=>'OrganizerEmail',	//Organizer
		0x24=>'RecurrenceId',
		0x25=>'Reminder',
		0x26=>'ResponseRequested',
		0x27=>'Recurrences',
		0x28=>'Recurrence',
		0x29=>'RecurrenceType',	//Type
		0x2A=>'Until',
		0x2B=>'Occurrences',
		0x2C=>'Interval',
		0x2D=>'DayOfWeekMask',	//DayOfWeek
		0x2E=>'DayOfMonth',
		0x2F=>'Instance',	//WeekOfMonth
		0x30=>'MonthOfYear',
		0x31=>'Start',		//StartTime
		0x32=>'Sensitivity',
		0x33=>'TimeZone',
		0x34=>'GlobalObjId',	//Max EAS v14.1
		0x35=>'ThreadTopic',
		0x36=>'MIMEData',	//Max EAS v2.5
		0x37=>'MIMETruncated',	//Max EAS v2.5
		0x38=>'MIMESize',	//Max EAS v2.5
		0x39=>'InternetCPID',
		0x3A=>'Flag',		//EAS v12.0
		0x3B=>'FlagStatus',	//Status
		0x3C=>'ContentClass',
		0x3D=>'FlagType',
		0x3E=>'CompleteTime',
		0x3F=>'DisallowNewTimeProposal'), //EAS v14.0
	//AirNotify
	0x03=>array(
		0x05=>'Notify',			//Unused
		0x06=>'Notification',		//Unused
		0x07=>'Version',		//Unused
		0x08=>'LifeTime',		//Unused
		0x09=>'DeviceInfo',		//Unused
		0x0A=>'Enable',			//Unused
		0x0B=>'Folder',			//Unused
		0x0C=>'ServerId',		//Unused
		0x0D=>'DeviceAddress',		//Unused
		0x0E=>'ValidCarrierProfiles',	//Unused
		0x0F=>'CarrierProfile',		//Unused
		0x10=>'Status',			//Unused
		0x11=>'Responses',		//Unused
		0x12=>'Devices',		//Unused
		0x13=>'Device',			//Unused
		0x14=>'Id',			//Unused
		0x15=>'Expiry',			//Unused
		0x16=>'NotifyGUID',		//Unused
		0x17=>'DeviceFriendlyName'),	//Unused
	//Calendar
	0x04=>array(
		0x05=>'TimeZone',	//Timezone
		0x06=>'AllDayEvent',
		0x07=>'Attendees',
		0x08=>'Attendee',
		0x09=>'Email',
		0x0A=>'Name',
		0x0B=>'Body',		//Max EAS v2.5
		0x0C=>'BodyTruncated',	//Max EAS v2.5
		0x0D=>'BusyStatus',
		0x0E=>'Categories',
		0x0F=>'Category',
		0x10=>'CompressedRTF',
		0x11=>'DTStamp',	//DtStamp
		0x12=>'End',		//EndTime
		0x13=>'Exception',
		0x14=>'Exceptions',
		0x15=>'IsDeleted',		//Deleted
		0x16=>'ExceptionStartTime',	//Max EAS v14.0
		0x17=>'Location',		//Max EAS v14.0
		0x18=>'MeetingStatus',
		0x19=>'OrganizerEmail',
		0x1A=>'OrganizerName',
		0x1B=>'Recurrence',
		0x1C=>'RecurrenceType',	//Type
		0x1D=>'Until',
		0x1E=>'Occurrences',
		0x1F=>'Interval',
		0x20=>'DayOfWeekMask',	//DayOfWeek
		0x21=>'DayOfMonth',
		0x22=>'Instance',	//WeekOfMonth
		0x23=>'MonthOfYear',
		0x24=>'Reminder',
		0x25=>'Sensitivity',
		0x26=>'Subject',
		0x27=>'Start',				//StartTime
		0x28=>'UID',
		0x29=>'Status',				//EAS v12.0 AttendeeStatus
		0x2A=>'AttendeeType',
		0x33=>'DisallowNewTimeProposal',	//EAS v14.0
		0x34=>'ResponseRequested',
		0x35=>'AppointmentReplyTime',
		0x36=>'ResponseType',
		0x37=>'CalendarType',
		0x38=>'IsLeapMonth',
		0x39=>'FirstDayOfWeek',	//EAS v14.1
		0x3A=>'OnlineMeetingConfLink',
		0x3B=>'OnlineMeetingExternalLink',
		0x3C=>'ClientUid'),	//EAS v16.0
	//Move
	0x05=>array(
		0x05=>'MoveItems',
		0x06=>'Move',
		0x07=>'SrcMsgId',
		0x08=>'SrcFldId',
		0x09=>'DstFldId',
		0x0A=>'Response',
		0x0B=>'Status',
		0x0C=>'DstMsgId'),
	//GetItemEstimate
	0x06=>array(
		0x05=>'GetItemEstimate',
		0x06=>'Version',	//Unused
		0x07=>'Collections',
		0x08=>'Collection',
		0x09=>'Class',		//Max EAS v12.1
		0x0A=>'CollectionId',
		0x0B=>'DateTime',	//Unused
		0x0C=>'Estimate',
		0x0D=>'Response',
		0x0E=>'Status'),
	//FolderHierarchy
	0x07=>array(
		0x05=>'Folders',	//Max EAS v12.1
		0x06=>'Folder',		//Max EAS v12.1
		0x07=>'DisplayName',
		0x08=>'ServerId',
		0x09=>'ParentId',
		0x0A=>'Type',
		0x0B=>'Response',	//Unused
		0x0C=>'Status',
		0x0D=>'ContentClass',	//Unused
		0x0E=>'Changes',
		0x0F=>'Add',
		0x10=>'Delete',
		0x11=>'Update',
		0x12=>'SyncKey',
		0x13=>'FolderCreate',
		0x14=>'FolderDelete',
		0x15=>'FolderUpdate',
		0x16=>'FolderSync',
		0x17=>'Count',
		0x18=>'Version'),	//Unused
	//MeetingResponse
	0x08=>array(
		0x05=>'CalId',	//CalendarId
		0x06=>'CollectionId',
		0x07=>'MeetingResponse',
		0x08=>'RequestId',
		0x09=>'Request',
		0x0A=>'Result',
		0x0B=>'Status',
		0x0C=>'UserResponse',
		0x0D=>'Version',		//Unused
		0x0E=>'InstanceId',		//EAS v14.1
		0x10=>'ProposedStartTime',	//EAS v16.1
		0x11=>'ProposedEndTime',
		0x12=>'SendResponse'),		//EAS v16.0
	//Tasks
	0x09=>array(
		0x05=>'Body',		//Max EAS v2,5
		0x06=>'BodySize',	//Max EAS v2.5
		0x07=>'BodyTruncated',	//Max EAS v2.5
		0x08=>'Categories',
		0x09=>'Category',
		0x0A=>'Complete',
		0x0B=>'DateCompleted',
		0x0C=>'DueDate',
		0x0D=>'UTCDueDate',	//UtcDueDate
		0x0E=>'Importance',
		0x0F=>'Recurrence',
		0x10=>'RecurrenceType',	//Type
		0x11=>'Start',
		0x12=>'Until',
		0x13=>'Occurrences',
		0x14=>'Interval',
		0x15=>'DayOfMonth',
		0x16=>'DayOfWeekMask',	//DayOfWeek
		0x17=>'Instance',	//WeekOfMonth
		0x18=>'MonthOfYear',
		0x19=>'Regenerate',
		0x1A=>'DeadOccur',
		0x1B=>'ReminderSet',
		0x1C=>'ReminderTime',
		0x1D=>'Sensitivity',
		0x1E=>'StartDate',
		0x1F=>'UTCStartDate',		//UtcStartDate
		0x20=>'Subject',
		0x21=>'CompressedRTF',		//Unused
		0x22=>'OrdinalDate',		//EAS v12.0
		0x23=>'SubOrdinalDate',
		0x24=>'CalendarType'	,	//EAS v14.0
		0x25=>'IsLeapMonth',
		0x26=>'FirstDayOfWeek'),	//EAS v14.1
	//ResolveRecipients
	0x0A=>array(
		0x05=>'ResolveRecipients',
		0x06=>'Response',
		0x07=>'Status',
		0x08=>'Type',
		0x09=>'Recipient',
		0x0A=>'DisplayName',
		0x0B=>'EmailAddress',
		0x0C=>'Certificates',
		0x0D=>'Certificate',
		0x0E=>'MiniCertificate',
		0x0F=>'Options',
		0x10=>'To',
		0x11=>'CertificateRetrieval',
		0x12=>'RecipientCount',
		0x13=>'MaxCertificates',
		0x14=>'MaxAmbiguousRecipients',
		0x15=>'CertificateCount',
		0x16=>'Availability',	//EAS v14.0
		0x17=>'StartTime',
		0x18=>'EndTime',
		0x19=>'MergedFreeBusy',
		0x1A=>'Picture',	//EAS v14.1
		0x1B=>'MaxSize',
		0x1C=>'Data',
		0x1D=>'MaxPictures'),
	//ValidateCert
	0x0B=>array(
		0x05=>'ValidateCert',
		0x06=>'Certificates',
		0x07=>'Certificate',
		0x08=>'CertificateChain',
		0x09=>'CheckCRL',
		0x0A=>'Status'),
	//Contacts2
	0x0C=>array(
		0x05=>'CustomerId',
		0x06=>'GovernmentId',
		0x07=>'IMAddress',
		0x08=>'IMAddress2',
		0x09=>'IMAddress3',
		0x0A=>'ManagerName',
		0x0B=>'CompanyMainTelephoneNumber',	//CompanyMainPhone
		0x0C=>'AccountName',
		0x0D=>'NickName',
		0x0E=>'MMS'),
	//Ping
	0x0D=>array(
		0x05=>'Ping',
		0x07=>'Status',
		0x08=>'HeartbeatInterval',
		0x09=>'Folders',
		0x0A=>'Folder',
		0x0B=>'Id',
		0x0C=>'Class',
		0x0D=>'MaxFolders'),
	//Provision
	0x0E=>array(
		0x05=>'Provision',
		0x06=>'Policies',
		0x07=>'Policy',
		0x08=>'PolicyType',
		0x09=>'PolicyKey',
		0x0A=>'Data',
		0x0B=>'Status',
		0x0C=>'RemoteWipe',
		0x0D=>'EASProvisionDoc',	//EAS v12.0
		0x0E=>'DevicePasswordEnabled',
		0x0F=>'AlphanumericDevicePasswordRequired',
		0x10=>'DeviceEncryptionEnabled',	//EAS v12.1 RequireStorageCardEncryption
		0x11=>'PasswordRecoveryEnabled',	//EAS v12.0
		0x13=>'AttachmentsEnabled',
		0x14=>'MinDevicePasswordLength',
		0x15=>'MaxInactivityTimeDeviceLock',
		0x16=>'MaxDevicePasswordFailedAttempts',
		0x17=>'MaxAttachmentSize',
		0x18=>'AllowSimpleDevicePassword',
		0x19=>'DevicePasswordExpiration',
		0x1A=>'DevicePasswordHistory',
		0x1B=>'AllowStorageCard',	//EAS v12.1
		0x1C=>'AllowCamera',
		0x1D=>'RequireDeviceEncryption',
		0x1E=>'AllowUnsignedApplications',
		0x1F=>'AllowUnsignedInstallationPackages',
		0x20=>'MinDevicePasswordComplexCharacters',
		0x21=>'AllowWiFi',
		0x22=>'AllowTextMessaging',
		0x23=>'AllowPOPIMAPEmail',
		0x24=>'AllowBluetooth',
		0x25=>'AllowIrDA',
		0x26=>'RequireManualSyncWhenRoaming',
		0x27=>'AllowDesktopSync',
		0x28=>'MaxCalendarAgeFilter',
		0x29=>'AllowHTMLEmail',
		0x2A=>'MaxEmailAgeFilter',
		0x2B=>'MaxEmailBodyTruncationSize',
		0x2C=>'MaxEmailHTMLBodyTruncationSize',
		0x2D=>'RequireSignedSMIMEMessages',
		0x2E=>'RequireEncryptedMessages',	//RequireEncryptedSMIMEMessages
		0x2F=>'RequireSignedSMIMEAlgorithm',
		0x30=>'RequireEncryptionSMIMEAlgorithm',
		0x31=>'AllowSMIMEEncryptionAlgorithmNegotiation',
		0x32=>'AllowSMIMESoftCerts',
		0x33=>'AllowBrowser',
		0x34=>'AllowConsumerEmail',
		0x35=>'AllowRemoteDesktop',
		0x36=>'AllowInternetSharing',
		0x37=>'UnapprovedlnROMApplicationList',	//UnapprovedInROMApplicationList
		0x38=>'ApplicationName',
		0x39=>'ApprovedApplicationList',
		0x3A=>'Hash',
		0x3B=>'AccountOnlyRemoteWipe'),	//EAS v16.1
	//Search
	0x0F=>array(
		0x05=>'Search',
		0x06=>'Stores',	//Unused
		0x07=>'Store',
		0x08=>'Name',
		0x09=>'Query',
		0x0A=>'Options',
		0x0B=>'Range',
		0x0C=>'Status',
		0x0D=>'Response',
		0x0E=>'Result',
		0x0F=>'Properties',
		0x10=>'Total',
		0x11=>'EqualTo',	//EAS v12.0
		0x12=>'Value',
		0x13=>'And',
		0x14=>'Or',
		0x15=>'FreeText',
		0x16=>'SubstringOp',
		0x17=>'DeepTraversal',
		0x18=>'LongId',
		0x19=>'RebuildResults',
		0x1A=>'LessThan',
		0x1B=>'GreaterThan',
		0x1C=>'Schema',
		0x1D=>'Supported',	//Unused
		0x1E=>'UserName',	//EAS v12.1
		0x1F=>'Password',
		0x20=>'ConversationId',	//EAS v14.0
		0x21=>'Picture',	//EAS v14.1
		0x22=>'MaxSize',
		0x23=>'MaxPictures'),
	//Gal
	0x10=>array(
		0x05=>'FileAs',				//DisplayName
		0x06=>'BusinessTelephoneNumber',	//Phone
		0x07=>'OfficeLocation',			//Office
		0x08=>'Title',
		0x09=>'CompanyName',			//Company
		0x0A=>'NickName',			//Alias
		0x0B=>'FirstName',
		0x0C=>'LastName',
		0x0D=>'HomeTelephoneNumber',	//HomePhone
		0x0E=>'MobileTelephoneNumber',	//MobilePhone
		0x0F=>'Email1Address',
		0x10=>'Picture',		//EAS v14.1
		0x11=>'Status',
		0x12=>'Data'),
	//AirSyncBase
	0x11=>array(
		0x05=>'BodyPreference',	//EAS v12.0
		0x06=>'Type',
		0x07=>'TruncationSize',
		0x08=>'AllOrNone',
		0x0A=>'Body',
		0x0B=>'Data',
		0x0C=>'AttSize',	//EstimatedDataSize
		0x0D=>'Truncated',
		0x0E=>'Attachments',
		0x0F=>'Attachment',
		0x10=>'DisplayName',
		0x11=>'AttName',	//FileReference
		0x12=>'AttMethod',	//Method
		0x13=>'ContentId',
		0x14=>'ContentLocation',
		0x15=>'IsInline',
		0x16=>'NativeBodyType',
		0x17=>'ContentType',
		0x18=>'Preview',		//EAS v14.0
		0x19=>'BodyPartReference',	//EAS v14.1
		0x1A=>'BodyPart',
		0x1B=>'Status',
		0x1C=>'Add',	//EAS v16.0
		0x1D=>'Delete',
		0x1E=>'ClientId',
		0x1F=>'Content',
		0x20=>'Location',
		0x21=>'Annotation',
		0x22=>'Street',
		0x23=>'City',
		0x24=>'State',
		0x25=>'Country',
		0x26=>'PostalCode',
		0x27=>'Latitude',
		0x28=>'Longitude',
		0x29=>'Accuracy',
		0x2A=>'Altitude',
		0x2B=>'AltitudeAccuracy',
		0x2C=>'LocationUri',
		0x2D=>'InstanceId'),
	//Settings
	0x12=>array(
		0x05=>'Settings',	//EAS v12.0
		0x06=>'Status',
		0x07=>'Get',
		0x08=>'Set',
		0x09=>'Oof',
		0x0A=>'OofState',
		0x0B=>'StartTime',
		0x0C=>'EndTime',
		0x0D=>'OofMessage',
		0x0E=>'AppliesToInternal',
		0x0F=>'AppliesToExternalKnown',
		0x10=>'AppliesToExternalUnknown',
		0x11=>'Enabled',
		0x12=>'ReplyMessage',
		0x13=>'BodyType',
		0x14=>'DevicePassword',
		0x15=>'Password',
		0x16=>'DeviceInformation',
		0x17=>'Model',
		0x18=>'IMEI',
		0x19=>'FriendlyName',
		0x1A=>'OS',
		0x1B=>'OSLanguage',
		0x1C=>'PhoneNumber',
		0x1D=>'UserInformation',
		0x1E=>'EmailAddresses',
		0x1F=>'SmtpAddress',
		0x20=>'UserAgent',		//EAS v12.1
		0x21=>'EnableOutboundSMS',	//EAS v14.0
		0x22=>'MobileOperator',
		0x23=>'PrimarySmtpAddress',	//EAS v14.1
		0x24=>'Accounts',
		0x25=>'Account',
		0x26=>'AccountId',
		0x27=>'AccountName',
		0x28=>'UserDisplayName',
		0x29=>'SendDisabled',
		0x2B=>'RightsManagementInformation'),
	//DocumentLibrary
	0x13=>array(
		0x05=>'LinkId',	//EAS v12.0
		0x06=>'DisplayName',
		0x07=>'IsFolder',
		0x08=>'CreationDate',
		0x09=>'LastModifiedDate',
		0x0A=>'IsHidden',
		0x0B=>'ContentLength',
		0x0C=>'ContentType'),
	//ItemOperations
	0x14=>array(
		0x05=>'ItemOperations',	//EAS v12.0
		0x06=>'Fetch',
		0x07=>'Store',
		0x08=>'Options',
		0x09=>'Range',
		0x0A=>'Total',
		0x0B=>'Properties',
		0x0C=>'Data',
		0x0D=>'Status',
		0x0E=>'Response',
		0x0F=>'Version',
		0x10=>'Schema',
		0x11=>'Part',
		0x12=>'EmptyFolderContents',
		0x13=>'DeleteSubFolders',
		0x14=>'UserName',	//EAS v12.1
		0x15=>'Password',
		0x16=>'Move',		//EAS v14.0
		0x17=>'DstFldId',
		0x18=>'ConversationId',
		0x19=>'MoveAlways'),
	//ComposeMail
	0x15=>array(
		0x05=>'SendMail',	//EAS v14.0
		0x06=>'SmartForward',
		0x07=>'SmartReply',
		0x08=>'SaveInSentItems',
		0x09=>'ReplaceMime',
		0x0B=>'Source',
		0x0C=>'FolderId',
		0x0D=>'ItemId',
		0x0E=>'LongId',
		0x0F=>'InstanceId',
		0x10=>'MIME',	//Mime
		0x11=>'ClientId',
		0x12=>'Status',
		0x13=>'AccountId',	//EAS v14.1
		0x15=>'Forwardees',	//EAS v16.0
		0x16=>'Forwardee',
		0x17=>'ForwardeeName',
		0x18=>'ForwardeeEmail'),
	//Email2
	0x16=>array(
		0x05=>'UmCallerID',	//EAS v14.0
		0x06=>'UmUserNotes',
		0x07=>'UmAttDuration',
		0x08=>'UmAttOrder',
		0x09=>'ConversationId',
		0x0A=>'ConverstionIndex',
		0x0B=>'LastVerbExecuted',
		0x0C=>'LastVerbExecutionTime',
		0x0D=>'ReceivedAsBcc',
		0x0E=>'Sender',
		0x0F=>'CalendarType',
		0x10=>'IsLeapMonth',
		0x11=>'AccountId',	//EAS v14.1
		0x12=>'FirstDayOfWeek',
		0x13=>'MeetingMessageType',
		0x15=>'IsDraft',	//EAS v16.0
		0x16=>'Bcc',
		0x17=>'Send'),
	//Notes
	0x17=>array(
		0x05=>'Subject',	//EAS v14.0
		0x06=>'MessageClass',
		0x07=>'LastModifiedDate',
		0x08=>'Categories',
		0x09=>'Category'),
	//RightsManagement
	0x18=>array(
		0x05=>'RightsManagementSupport',	//EAS v14.1
		0x06=>'RightsManagementTemplates',
		0x07=>'RightsManagementTemplate',
		0x08=>'RightsManagementLicense',
		0x09=>'EditAllowed',
		0x0A=>'ReplyAllowed',
		0x0B=>'ReplyAllAllowed',
		0x0C=>'ForwardAllowed',
		0x0D=>'ModifyRecipientsAllowed',
		0x0E=>'ExtractAllowed',
		0x0F=>'PrintAllowed',
		0x10=>'ExportAllowed',
		0x11=>'ProgrammaticAccessAllowed',
		0x12=>'RMOwner',	//Owner
		0x13=>'ContentExpiryDate',
		0x14=>'TemlateID',
		0x15=>'TemplateName',
		0x16=>'TemplateDescription',
		0x17=>'ContentOwner',
		0x18=>'RemoveRightsManagementDistribution'),	//RemoveRightsManagementProtection
	//Find
	0x19=>array(
		0x05=>'Find',	//EAS v16.1
		0x06=>'SearchId',
		0x07=>'ExecuteSearch',
		0x08=>'MailBoxSearchCriterion',
		0x09=>'Query',
		0x0A=>'Status',
		0x0B=>'FreeText',
		0x0C=>'Options',
		0x0D=>'Range',
		0x0E=>'DeepTraversal',
		0x11=>'Response',
		0x12=>'Result',
		0x13=>'Properties',
		0x14=>'Preview',
		0x15=>'HasAttachments',
		0x16=>'Total',
		0x17=>'DisplayCc',
		0x18=>'DisplayBcc',
		0x19=>'GalSearchCriterion')
);

$tag2code=array(
	//AirSync
	0x00=>array(
		'Sync'=>0x05,
		'Responses'=>0x06,
		'Add'=>0x07,
		'Change'=>0x08,
		'Delete'=>0x09,
		'Fetch'=>0x0A,
		'SyncKey'=>0x0B,
		'ClientId'=>0x0C,
		'ServerId'=>0x0D,
		'Status'=>0x0E,
		'Collection'=>0x0F,
		'Class'=>0x10,
		'Version'=>0x11,	//Unused
		'CollectionId'=>0x12,
		'GetChanges'=>0x13,
		'MoreAvailable'=>0x14,
		'WindowSize'=>0x15,
		'Commands'=>0x16,
		'Options'=>0x17,
		'FilterType'=>0x18,
		'Truncation'=>0x19,	//Max EAS v2.5
		'RTFTruncation'=>0x1A,	//Unused
		'Conflict'=>0x1B,
		'Collections'=>0x1C,
		'ApplicationData'=>0x1D,
		'DeletesAsMoves'=>0x1E,
		'NotifyGUID'=>0x1F,	//Unused
		'Supported'=>0x20,
		'SoftDelete'=>0x21,
		'MIMESupport'=>0x22,
		'MIMETruncation'=>0x23,
		'Wait'=>0x24,	//EAS v12.1
		'Limit'=>0x25,
		'Partial'=>0x26,
		'ConversationMode'=>0x27,	//EAS v14.0
		'MaxItems'=>0x28,
		'HeartbeatInterval'=>0x29),
	//Contacts
	0x01=>array(
		'Anniversary'=>0x05,
		'AssistantName'=>0x06,
		'AssistnameTelephoneNumber'=>0x07,	//AssistnamePhoneNumber
		'Birthday'=>0x08,
		'Body'=>0x09,				//Max EAS v2.5
		'BodySize'=>0x0A,			//Max EAS v2.5
		'BodyTruncated'=>0x0B,			//Max EAS v2.5
		'Business2TelephoneNumber'=>0x0C,	//Business2PhoneNumber
		'BusinessAddressCity'=>0x0D,
		'BusinessAddressCountry'=>0x0E,
		'BusinessAddressPostalCode'=>0x0F,
		'BusinessAddressState'=>0x10,
		'BusinessAddressStreet'=>0x11,
		'BusinessFaxNumber'=>0x12,
		'BusinessTelephoneNumber'=>0x13,	//BusinessPhoneNumber
		'CarTelephoneNumber'=>0x14,		//CarPhoneNumber
		'Categories'=>0x15,
		'Category'=>0x16,
		'Children'=>0x17,
		'Child'=>0x18,
		'CompanyName'=>0x19,
		'Department'=>0x1A,
		'Email1Address'=>0x1B,
		'Email2Address'=>0x1C,
		'Email3Address'=>0x1D,
		'FileAs'=>0x1E,
		'FirstName'=>0x1F,
		'Home2TelephoneNumber'=>0x20,	//Home2PhoneNumber
		'HomeAddressCity'=>0x21,
		'HomeAddressCountry'=>0x22,
		'HomeAddressPostalCode'=>0x23,
		'HomeAddressState'=>0x24,
		'HomeAddressStreet'=>0x25,
		'HomeFaxNumber'=>0x26,
		'HomeTelephoneNumber'=>0x27,	//HomePhoneNumber
		'JobTitle'=>0x28,
		'LastName'=>0x29,
		'MiddleName'=>0x2A,
		'MobileTelephoneNumber'=>0x2B,	//MobilePhoneNumber
		'OfficeLocation'=>0x2C,
		'OtherAddressCity'=>0x2D,
		'OtherAddressCountry'=>0x2E,
		'OtherAddressPostalCode'=>0x2F,
		'OtherAddressState'=>0x30,
		'OtherAddressStreet'=>0x31,
		'PagerNumber'=>0x32,
		'RadioTelephoneNumber'=>0x33,	//RadioPhoneNumber
		'Spouse'=>0x34,
		'Suffix'=>0x35,
		'Title'=>0x36,
		'WebPage'=>0x37,
		'YomiCompanyName'=>0x38,
		'YomiFirstName'=>0x39,
		'YomiLastName'=>0x3A,
		'CompressedRTF'=>0x3B,
		'Picture'=>0x3C,
		'Alias'=>0x3D,	//EAS v14.0
		'WeightedRank'=>0x3E),
	//Email
	0x02=>array(
		'Attachment'=>0x05,	//Max EAS v2.5
		'Attachments'=>0x06,	//Max EAS v2.5
		'AttName'=>0x07,	//Max EAS v2.5
		'AttSize'=>0x08,	//Max EAS v2.5
		'AttOId'=>0x09,		//Max EAS v2.5 AttOid
		'AttMethod'=>0x0A,	//Max EAS v2.5
		'AttRemoved'=>0x0B,	//Unused
		'Body'=>0x0C,		//Max EAS v2.5
		'BodySize'=>0x0D,	//Max EAS v2.5
		'BodyTruncated'=>0x0E,	//Max EAS v2.5
		'DateReceived'=>0x0F,
		'DisplayName'=>0x10,	//Max EAS v2.5
		'DisplayTo'=>0x11,
		'Importance'=>0x12,
		'MessageClass'=>0x13,
		'Subject'=>0x14,
		'Read'=>0x15,
		'To'=>0x16,
		'Cc'=>0x17,
		'From'=>0x18,
		'ReplyTo'=>0x19,
		'AllDayEvent'=>0x1A,
		'Categories'=>0x1B,
		'Category'=>0x1C,
		'DTStamp'=>0x1D,	//DtStamp
		'End'=>0x1E,		//EndTime
		'InstanceType'=>0x1F,
		'BusyStatus'=>0x20,
		'Location'=>0x21,	//Max EAS v14.1
		'MeetingRequest'=>0x22,
		'OrganizerEmail'=>0x23,	//Organizer
		'RecurrenceId'=>0x24,
		'Reminder'=>0x25,
		'ResponseRequested'=>0x26,
		'Recurrences'=>0x27,
		'Recurrence'=>0x28,
		'RecurrenceType'=>0x29,	//Type
		'Until'=>0x2A,
		'Occurrences'=>0x2B,
		'Interval'=>0x2C,
		'DayOfWeekMask'=>0x2D,	//DayOfWeek
		'DayOfMonth'=>0x2E,
		'Instance'=>0x2F,	//WeekOfMonth
		'MonthOfYear'=>0x30,
		'Start'=>0x31,		//StartTime
		'Sensitivity'=>0x32,
		'TimeZone'=>0x33,
		'GlobalObjId'=>0x34,	//Max EAS v14.1
		'ThreadTopic'=>0x35,
		'MIMEData'=>0x36,	//Max EAS v2.5
		'MIMETruncated'=>0x37,	//Max EAS v2.5
		'MIMESize'=>0x38,	//Max EAS v2.5
		'InternetCPID'=>0x39,
		'Flag'=>0x3A,		//EAS v12.0
		'FlagStatus'=>0x3B,	//Status
		'ContentClass'=>0x3C,
		'FlagType'=>0x3D,
		'CompleteTime'=>0x3E,
		'DisallowNewTimeProposal'=>0x3F), //EAS v14.0
	//AirNotify
	0x03=>array(
		'Notify'=>0x05,			//Unused
		'Notification'=>0x06,		//Unused
		'Version'=>0x07,		//Unused
		'LifeTime'=>0x08,		//Unused
		'DeviceInfo'=>0x09,		//Unused
		'Enable'=>0x0A,			//Unused
		'Folder'=>0x0B,			//Unused
		'ServerId'=>0x0C,		//Unused
		'DeviceAddress'=>0x0D,		//Unused
		'ValidCarrierProfiles'=>0x0E,	//Unused
		'CarrierProfile'=>0x0F,		//Unused
		'Status'=>0x10,			//Unused
		'Responses'=>0x11,		//Unused
		'Devices'=>0x12,		//Unused
		'Device'=>0x13,			//Unused
		'Id'=>0x14,			//Unused
		'Expiry'=>0x15,			//Unused
		'NotifyGUID'=>0x16,		//Unused
		'DeviceFriendlyName'=>0x17),	//Unused
	//Calendar
	0x04=>array(
		'TimeZone'=>0x05,	//Timezone
		'AllDayEvent'=>0x06,
		'Attendees'=>0x07,
		'Attendee'=>0x08,
		'Email'=>0x09,
		'Name'=>0x0A,
		'Body'=>0x0B,		//Max EAS v2.5
		'BodyTruncated'=>0x0C,	//Max EAS v2.5
		'BusyStatus'=>0x0D,
		'Categories'=>0x0E,
		'Category'=>0x0F,
		'CompressedRTF'=>0x10,
		'DTStamp'=>0x11,	//DtStamp
		'End'=>0x12,		//EndTime
		'Exception'=>0x13,
		'Exceptions'=>0x14,
		'IsDeleted'=>0x15,		//Deleted
		'ExceptionStartTime'=>0x16,	//Max EAS v14.0
		'Location'=>0x17,		//Max EAS v14.0
		'MeetingStatus'=>0x18,
		'OrganizerEmail'=>0x19,
		'OrganizerName'=>0x1A,
		'Recurrence'=>0x1B,
		'RecurrenceType'=>0x1C,	//Type
		'Until'=>0x1D,
		'Occurrences'=>0x1E,
		'Interval'=>0x1F,
		'DayOfWeekMask'=>0x20,	//DayOfWeek
		'DayOfMonth'=>0x21,
		'Instance'=>0x22,	//WeekOfMonth
		'MonthOfYear'=>0x23,
		'Reminder'=>0x24,
		'Sensitivity'=>0x25,
		'Subject'=>0x26,
		'Start'=>0x27,				//StartTime
		'UID'=>0x28,
		'Status'=>0x29,				//EAS v12.0 AttendeeStatus
		'AttendeeType'=>0x2A,
		'DisallowNewTimeProposal'=>0x33,	//EAS v14.0
		'ResponseRequested'=>0x34,
		'AppointmentReplyTime'=>0x35,
		'ResponseType'=>0x36,
		'CalendarType'=>0x37,
		'IsLeapMonth'=>0x38,
		'FirstDayOfWeek'=>0x39,	//EAS v14.1
		'OnlineMeetingConfLink'=>0x3A,
		'OnlineMeetingExternalLink'=>0x3B,
		'ClientUid'=>0x3C),	//EAS v16.0
	//Move
	0x05=>array(
		'MoveItems'=>0x05,
		'Move'=>0x06,
		'SrcMsgId'=>0x07,
		'SrcFldId'=>0x08,
		'DstFldId'=>0x09,
		'Response'=>0x0A,
		'Status'=>0x0B,
		'DstMsgId'=>0x0C),
	//GetItemEstimate
	0x06=>array(
		'GetItemEstimate'=>0x05,
		'Version'=>0x06,	//Unused
		'Collections'=>0x07,
		'Collection'=>0x08,
		'Class'=>0x09,		//Max EAS v12.1
		'CollectionId'=>0x0A,
		'DateTime'=>0x0B,	//Unused
		'Estimate'=>0x0C,
		'Response'=>0x0D,
		'Status'=>0x0E),
	//FolderHierarchy
	0x07=>array(
		'Folders'=>0x05,	//Max EAS v12.1
		'Folder'=>0x06,		//Max EAS v12.1
		'DisplayName'=>0x07,
		'ServerId'=>0x08,
		'ParentId'=>0x09,
		'Type'=>0x0A,
		'Response'=>0x0B,	//Unused
		'Status'=>0x0C,
		'ContentClass'=>0x0D,	//Unused
		'Changes'=>0x0E,
		'Add'=>0x0F,
		'Delete'=>0x10,
		'Update'=>0x11,
		'SyncKey'=>0x12,
		'FolderCreate'=>0x13,
		'FolderDelete'=>0x14,
		'FolderUpdate'=>0x15,
		'FolderSync'=>0x16,
		'Count'=>0x17,
		'Version'=>0x18),	//Unused
	//MeetingResponse
	0x08=>array(
		'CalId'=>0x05,	//CalendarId
		'CollectionId'=>0x06,
		'MeetingResponse'=>0x07,
		'RequestId'=>0x08,
		'Request'=>0x09,
		'Result'=>0x0A,
		'Status'=>0x0B,
		'UserResponse'=>0x0C,
		'Version'=>0x0D,		//Unused
		'InstanceId'=>0x0E,		//EAS v14.1
		'ProposedStartTime'=>0x10,	//EAS v16.1
		'ProposedEndTime'=>0x11,
		'SendResponse'=>0x12),		//EAS v16.0
	//Tasks
	0x09=>array(
		'Body'=>0x05,		//Max EAS v2,5
		'BodySize'=>0x06,	//Max EAS v2,5
		'BodyTruncated'=>0x07,	//Max EAS v2,5
		'Categories'=>0x08,
		'Category'=>0x09,
		'Complete'=>0x0A,
		'DateCompleted'=>0x0B,
		'DueDate'=>0x0C,
		'UTCDueDate'=>0x0D,	//UtcDueDate
		'Importance'=>0x0E,
		'Recurrence'=>0x0F,
		'RecurrenceType'=>0x10,	//Type
		'Start'=>0x11,
		'Until'=>0x12,
		'Occurrences'=>0x13,
		'Interval'=>0x14,
		'DayOfMonth'=>0x15,
		'DayOfWeekMask'=>0x16,	//DayOfWeek	
		'Instance'=>0x17,	//WeekOfMonth
		'MonthOfYear'=>0x18,
		'Regenerate'=>0x19,
		'DeadOccur'=>0x1A,
		'ReminderSet'=>0x1B,
		'ReminderTime'=>0x1C,
		'Sensitivity'=>0x1D,
		'StartDate'=>0x1E,
		'UTCStartDate'=>0x1F,		//UtcStartDate
		'Subject'=>0x20,
		'CompressedRTF'=>0x21,		//Unused
		'OrdinalDate'=>0x22,		//EAS v12.0
		'SubOrdinalDate'=>0x23,
		'CalendarType'=>0x24,		//EAS v14.0
		'IsLeapMonth'=>0x25,
		'FirstDayOfWeek'=>0x26),	//EAS v14.1
	//ResolveRecipients
	0x0a=>array(
		'ResolveRecipients'=>0x05,
		'Response'=>0x06,
		'Status'=>0x07,
		'Type'=>0x08,
		'Recipient'=>0x09,
		'DisplayName'=>0x0A,
		'EmailAddress'=>0x0B,
		'Certificates'=>0x0C,
		'Certificate'=>0x0D,
		'MiniCertificate'=>0x0E,
		'Options'=>0x0F,
		'To'=>0x10,
		'CertificateRetrieval'=>0x11,
		'RecipientCount'=>0x12,
		'MaxCertificates'=>0x13,
		'MaxAmbiguousRecipients'=>0x14,
		'CertificateCount'=>0x15,
		'Availability'=>0x16,	//EAS v14.0
		'StartTime'=>0x17,
		'EndTime'=>0x18,
		'MergedFreeBusy'=>0x19,
		'Picture'=>0x1A,	//EAS v14.1
		'MaxSize'=>0x1B,
		'Data'=>0x1C,
		'MaxPictures'=>0x1D),
	//ValidateCerts
	0x0b=>array(
		'ValidateCert'=>0x05,
		'Certificates'=>0x06,
		'Certificate'=>0x07,
		'CertificateChain'=>0x08,
		'CheckCRL'=>0x09,
		'Status'=>0x0A),
	//Contacts2
	0x0c=>array(
		'CustomerId'=>0x05,
		'GovernmentId'=>0x06,
		'IMAddress'=>0x07,
		'IMAddress2'=>0x08,
		'IMAddress3'=>0x09,
		'ManagerName'=>0x0A,
		'CompanyMainTelephoneNumber'=>0x0B,	//CompanyMainPhone
		'AccountName'=>0x0C,
		'NickName'=>0x0D,
		'MMS'=>0x0E),
	//Ping
	0x0d=>array(
		'Ping'=>0x05,
		'Status'=>0x07,
		'HeartbeatInterval'=>0x08,
		'Folders'=>0x09,
		'Folder'=>0x0A,
		'Id'=>0x0B,
		'Class'=>0x0C,
		'MaxFolders'=>0x0D),
	//Provision
	0x0e=>array(
		'Provision'=>0x05,
		'Policies'=>0x06,
		'Policy'=>0x07,
		'PolicyType'=>0x08,
		'PolicyKey'=>0x09,
		'Data'=>0x0A,
		'Status'=>0x0B,
		'RemoteWipe'=>0x0C,
		'EASProvisionDoc'=>0x0D,	//EAS v12.0
		'DevicePasswordEnabled'=>0x0E,
		'AlphanumericDevicePasswordRequired'=>0x0F,
		'DeviceEncryptionEnabled'=>0x10,	//EAS v12.1 RequireStorageCardEncryption
		'PasswordRecoveryEnabled'=>0x11,	//EAS v12.0
		'AttachmentsEnabled'=>0x13,
		'MinDevicePasswordLength'=>0x14,
		'MaxInactivityTimeDeviceLock'=>0x15,
		'MaxDevicePasswordFailedAttempts'=>0x16,
		'MaxAttachmentSize'=>0x17,
		'AllowSimpleDevicePassword'=>0x18,
		'DevicePasswordExpiration'=>0x19,
		'DevicePasswordHistory'=>0x1A,
		'AllowStorageCard'=>0x1B,	//EAS v12.1
		'AllowCamera'=>0x1C,
		'RequireDeviceEncryption'=>0x1D,
		'AllowUnsignedApplications'=>0x1E,
		'AllowUnsignedInstallationPackages'=>0x1F,
		'MinDevicePasswordComplexCharacters'=>0x20,
		'AllowWiFi'=>0x21,
		'AllowTextMessaging'=>0x22,
		'AllowPOPIMAPEmail'=>0x23,
		'AllowBluetooth'=>0x24,
		'AllowIrDA'=>0x25,
		'RequireManualSyncWhenRoaming'=>0x26,
		'AllowDesktopSync'=>0x27,
		'MaxCalendarAgeFilter'=>0x28,
		'AllowHTMLEmail'=>0x29,
		'MaxEmailAgeFilter'=>0x2A,
		'MaxEmailBodyTruncationSize'=>0x2B,
		'MaxEmailHTMLBodyTruncationSize'=>0x2C,
		'RequireSignedSMIMEMessages'=>0x2D,
		'RequireEncryptedMessages'=>0x2E,	//RequireEncryptedSMIMEMessages
		'RequireSignedSMIMEAlgorithm'=>0x2F,
		'RequireEncryptionSMIMEAlgorithm'=>0x30,
		'AllowSMIMEEncryptionAlgorithmNegotiation'=>0x31,
		'AllowSMIMESoftCerts'=>0x32,
		'AllowBrowser'=>0x33,
		'AllowConsumerEmail'=>0x34,
		'AllowRemoteDesktop'=>0x35,
		'AllowInternetSharing'=>0x36,
		'UnapprovedlnROMApplicationList'=>0x37,	//UnapprovedInROMApplicationList
		'ApplicationName'=>0x38,
		'ApprovedApplicationList'=>0x39,
		'Hash'=>0x3A,
		'AccountOnlyRemoteWipe'=>0x3B),	//EAS v16.1
	//Search
	0x0f=>array(
		'Search'=>0x05,
		'Stores'=>0x06,	//Unused
		'Store'=>0x07,
		'Name'=>0x08,
		'Query'=>0x09,
		'Options'=>0x0A,
		'Range'=>0x0B,
		'Status'=>0x0C,
		'Response'=>0x0D,
		'Result'=>0x0E,
		'Properties'=>0x0F,
		'Total'=>0x10,
		'EqualTo'=>0x11,	//EAS v12.0
		'Value'=>0x12,
		'And'=>0x13,
		'Or'=>0x14,
		'FreeText'=>0x15,
		'SubstringOp'=>0x16,
		'DeepTraversal'=>0x17,
		'LongId'=>0x18,
		'RebuildResults'=>0x19,
		'LessThan'=>0x1A,
		'GreaterThan'=>0x1B,
		'Schema'=>0x1C,
		'Supported'=>0x1D,	//Unused
		'UserName'=>0x1E,	//EAS v12.1
		'Password'=>0x1F,
		'ConversationId'=>0x20,	//EAS v14.0
		'Picture'=>0x21,	//EAS v14.1
		'MaxSize'=>0x22,
		'MaxPictures'=>0x23),
	//Gal
	0x10=>array(
		'FileAs'=>0x05,				//DisplayName
		'BusinessTelephoneNumber'=>0x06,	//Phone
		'OfficeLocation'=>0x07,			//Office
		'Title'=>0x08,
		'CompanyName'=>0x09,	//Company
		'NickName'=>0x0A,	//Alias
		'FirstName'=>0x0B,
		'LastName'=>0x0C,
		'HomeTelephoneNumber'=>0x0D,	//HomePhone
		'MobileTelephoneNumber'=>0x0E,	//MobilePhone
		'Email1Address'=>0x0F,
		'Picture'=>0x10,		//EAS v14.1
		'Status'=>0x11,
		'Data'=>0x12),
	//AirSyncBase
	0x11=>array(
		'BodyPreference'=>0x05,	//EAS v12.0
		'Type'=>0x06,
		'TruncationSize'=>0x07,
		'AllOrNone'=>0x08,
		'Body'=>0x0A,
		'Data'=>0x0B,
		'AttSize'=>0x0C,	//EstimatedDataSize
		'Truncated'=>0x0D,
		'Attachments'=>0x0E,
		'Attachment'=>0x0F,
		'DisplayName'=>0x10,
		'AttName'=>0x11,	//FileReference
		'AttMethod'=>0x12,	//Method
		'ContentId'=>0x13,
		'ContentLocation'=>0x14,
		'IsInline'=>0x15,
		'NativeBodyType'=>0x16,
		'ContentType'=>0x17,
		'Preview'=>0x18,		//EAS v14.0
		'BodyPartReference'=>0x19,	//EAS v14.1
		'BodyPart'=>0x1A,
		'Status'=>0x1B,
		'Add'=>0x1C,	//EAS v16.0
		'Delete'=>0x1D,
		'ClientId'=>0x1E,
		'Content'=>0x1F,
		'Location'=>0x20,
		'Annotation'=>0x21,
		'Street'=>0x22,
		'City'=>0x23,
		'State'=>0x24,
		'Country'=>0x25,
		'PostalCode'=>0x26,
		'Latitude'=>0x27,
		'Longitude'=>0x28,
		'Accuracy'=>0x29,
		'Altitude'=>0x2A,
		'AltitudeAccuracy'=>0x2B,
		'LocationUri'=>0x2C,
		'InstanceId'=>0x2D),
	//Settings
	0x12=>array(
		'Settings'=>0x05,	//EAS v12.0
		'Status'=>0x06,
		'Get'=>0x07,
		'Set'=>0x08,
		'Oof'=>0x09,
		'OofState'=>0x0A,
		'StartTime'=>0x0B,
		'EndTime'=>0x0C,
		'OofMessage'=>0x0D,
		'AppliesToInternal'=>0x0E,
		'AppliesToExternalKnown'=>0x0F,
		'AppliesToExternalUnknown'=>0x10,
		'Enabled'=>0x11,
		'ReplyMessage'=>0x12,
		'BodyType'=>0x13,
		'DevicePassword'=>0x14,
		'Password'=>0x15,
		'DeviceInformation'=>0x16,
		'Model'=>0x17,
		'IMEI'=>0x18,
		'FriendlyName'=>0x19,
		'OS'=>0x1A,
		'OSLanguage'=>0x1B,
		'PhoneNumber'=>0x1C,
		'UserInformation'=>0x1D,
		'EmailAddresses'=>0x1E,
		'SmtpAddress'=>0x1F,
		'UserAgent'=>0x20,		//EAS v12.1
		'EnableOutboundSMS'=>0x21,	//EAS v14.0
		'MobileOperator'=>0x22,
		'PrimarySmtpAddress'=>0x23,	//EAS v14.1
		'Accounts'=>0x24,
		'Account'=>0x25,
		'AccountId'=>0x26,
		'AccountName'=>0x27,
		'UserDisplayName'=>0x28,
		'SendDisabled'=>0x29,
		'RightsManagementInformation'=>0x2B),
	//DocumentLibrary
	0x13=>array(
		'LinkId'=>0x05,	//EAS v12.0
		'DisplayName'=>0x06,
		'IsFolder'=>0x07,
		'CreationDate'=>0x08,
		'LastModifiedDate'=>0x09,
		'IsHidden'=>0x0A,
		'ContentLength'=>0x0B,
		'ContentType'=>0x0C),
	//ItemOperations
	0x14=>array(
		'ItemOperations'=>0x05,	//EAS v12.0
		'Fetch'=>0x06,
		'Store'=>0x07,
		'Options'=>0x08,
		'Range'=>0x09,
		'Total'=>0x0A,
		'Properties'=>0x0B,
		'Data'=>0x0C,
		'Status'=>0x0D,
		'Response'=>0x0E,
		'Version'=>0x0F,
		'Schema'=>0x10,
		'Part'=>0x11,
		'EmptyFolderContents'=>0x12,
		'DeleteSubFolders'=>0x13,
		'UserName'=>0x14,	//EAS v12.1
		'Password'=>0x15,
		'Move'=>0x16,		//EAS v14.0
		'DstFldId'=>0x17,
		'ConversationId'=>0x18,
		'MoveAlways'=>0x19),
	//ComposeMail
	0x15=>array(
		'SendMail'=>0x05,	//EAS v14.0
		'SmartForward'=>0x06,
		'SmartReply'=>0x07,
		'SaveInSentItems'=>0x08,
		'ReplaceMime'=>0x09,
		'Source'=>0x0B,
		'FolderId'=>0x0C,
		'ItemId'=>0x0D,
		'LongId'=>0x0E,
		'InstanceId'=>0x0F,
		'MIME'=>0x10,	//Mime
		'ClientId'=>0x11,
		'Status'=>0x12,
		'AccountId'=>0x13,	//EAS v14.1
		'Forwardees'=>0x15,	//EAS v16.0
		'Forwardee'=>0x16,
		'ForwardeeName'=>0x17,
		'ForwardeeEmail'=>0x18),
	//Email2
	0x16=>array(
		'UmCallerID'=>0x05,	//EAS v14.0
		'UmUserNotes'=>0x06,
		'UmAttDuration'=>0x07,
		'UmAttOrder'=>0x08,
		'ConversationId'=>0x09,
		'ConverstionIndex'=>0x0A,
		'LastVerbExecuted'=>0x0B,
		'LastVerbExecutionTime'=>0x0C,
		'ReceivedAsBcc'=>0x0D,
		'Sender'=>0x0E,
		'CalendarType'=>0x0F,
		'IsLeapMonth'=>0x10,
		'AccountId'=>0x11,	//EAS v14.1
		'FirstDayOfWeek'=>0x12,
		'MeetingMessageType'=>0x13,
		'IsDraft'=>0x15,	//EAS v16.0
		'Bcc'=>0x16,
		'Send'=>0x17),
	//Notes
	0x17=>array(
		'Subject'=>0x05,	//EAS v14.0
		'MessageClass'=>0x06,
		'LastModifiedDate'=>0x07,
		'Categories'=>0x08,
		'Category'=>0x09),
	//RightsManagement
	0x18=>array(
		'RightsManagementSupport'=>0x05,	//EAS v14.1
		'RightsManagementTemplates'=>0x06,
		'RightsManagementTemplate'=>0x07,
		'RightsManagementLicense'=>0x08,
		'EditAllowed'=>0x09,
		'ReplyAllowed'=>0x0A,
		'ReplyAllAllowed'=>0x0B,
		'ForwardAllowed'=>0x0C,
		'ModifyRecipientsAllowed'=>0x0D,
		'ExtractAllowed'=>0x0E,
		'PrintAllowed'=>0x0F,
		'ExportAllowed'=>0x10,
		'ProgrammaticAccessAllowed'=>0x11,
		'RMOwner'=>0x12,	//Owner
		'ContentExpiryDate'=>0x13,
		'TemlateID'=>0x14,
		'TemplateName'=>0x15,
		'TemplateDescription'=>0x16,
		'ContentOwner'=>0x17,
		'RemoveRightsManagementDistribution'=>0x18),	//RemoveRightsManagementProtection
	//Find
	0x19=>array(
		'Find'=>0x05,	//EAS v16.1
		'SearchId'=>0x06,
		'ExecuteSearch'=>0x07,
		'MailBoxSearchCriterion'=>0x08,
		'Query'=>0x09,
		'Status'=>0x0A,
		'FreeText'=>0x0B,
		'Options'=>0x0C,
		'Range'=>0x0D,
		'DeepTraversal'=>0x0E,
		'Response'=>0x11,
		'Result'=>0x12,
		'Properties'=>0x13,
		'Preview'=>0x14,
		'HasAttachments'=>0x15,
		'Total'=>0x16,
		'DisplayCc'=>0x17,
		'DisplayBcc'=>0x18,
		'GalSearchCriterion'=>0x19)
);
?>