import type { INodeProperties } from 'n8n-workflow';

export const serviceAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new service account',
				action: 'Create a service account',
			},
			{
				name: 'Create Key',
				value: 'createKey',
				description: 'Create a new service key for a service account',
				action: 'Create a service key',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a service account',
				action: 'Delete a service account',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a service account by ID',
				action: 'Get a service account',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many service accounts',
				action: 'Get many service accounts',
			},
			{
				name: 'Revoke Key',
				value: 'revokeKey',
				description: 'Revoke a service key',
				action: 'Revoke a service key',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a service account',
				action: 'Update a service account',
			},
		],
		default: 'getAll',
	},
];

export const serviceAccountFields: INodeProperties[] = [
	// ----------------------------------
	//         serviceAccount: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['create'],
			},
		},
		description: 'Name of the service account',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Resource IDs',
				name: 'resourceIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of Resource IDs to grant this service account access to',
			},
		],
	},

	// ----------------------------------
	//         serviceAccount: get
	// ----------------------------------
	{
		displayName: 'Service Account ID',
		name: 'serviceAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['get'],
			},
		},
		description: 'The ID of the service account to retrieve',
	},

	// ----------------------------------
	//         serviceAccount: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         serviceAccount: update
	// ----------------------------------
	{
		displayName: 'Service Account ID',
		name: 'serviceAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['update'],
			},
		},
		description: 'The ID of the service account to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the service account',
			},
			{
				displayName: 'Resource IDs to Add',
				name: 'addedResourceIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of Resource IDs to add access to',
			},
			{
				displayName: 'Resource IDs to Remove',
				name: 'removedResourceIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of Resource IDs to remove access from',
			},
		],
	},

	// ----------------------------------
	//         serviceAccount: delete
	// ----------------------------------
	{
		displayName: 'Service Account ID',
		name: 'serviceAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the service account to delete',
	},

	// ----------------------------------
	//         serviceAccount: createKey
	// ----------------------------------
	{
		displayName: 'Service Account ID',
		name: 'serviceAccountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['createKey'],
			},
		},
		description: 'The ID of the service account to create a key for',
	},
	{
		displayName: 'Key Name',
		name: 'keyName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['createKey'],
			},
		},
		description: 'Name of the service key',
	},
	{
		displayName: 'Additional Fields',
		name: 'keyAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['createKey'],
			},
		},
		options: [
			{
				displayName: 'Expiration Time (Days)',
				name: 'expirationTime',
				type: 'number',
				default: 365,
				description: 'Number of days until the key expires',
			},
		],
	},

	// ----------------------------------
	//         serviceAccount: revokeKey
	// ----------------------------------
	{
		displayName: 'Service Key ID',
		name: 'serviceKeyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceAccount'],
				operation: ['revokeKey'],
			},
		},
		description: 'The ID of the service key to revoke',
	},
];
