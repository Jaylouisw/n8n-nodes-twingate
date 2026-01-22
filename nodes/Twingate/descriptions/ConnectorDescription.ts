import type { INodeProperties } from 'n8n-workflow';

export const connectorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['connector'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new connector',
				action: 'Create a connector',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a connector',
				action: 'Delete a connector',
			},
			{
				name: 'Generate Tokens',
				value: 'generateTokens',
				description: 'Generate access and refresh tokens for a connector',
				action: 'Generate tokens for a connector',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a connector by ID',
				action: 'Get a connector',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many connectors',
				action: 'Get many connectors',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a connector',
				action: 'Update a connector',
			},
		],
		default: 'getAll',
	},
];

export const connectorFields: INodeProperties[] = [
	// ----------------------------------
	//         connector: create
	// ----------------------------------
	{
		displayName: 'Remote Network ID',
		name: 'remoteNetworkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['connector'],
				operation: ['create'],
			},
		},
		description: 'The ID of the remote network for this connector',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['connector'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the connector',
			},
			{
				displayName: 'Status Notifications Enabled',
				name: 'hasStatusNotificationsEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to enable status notifications for this connector',
			},
		],
	},

	// ----------------------------------
	//         connector: get
	// ----------------------------------
	{
		displayName: 'Connector ID',
		name: 'connectorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['connector'],
				operation: ['get'],
			},
		},
		description: 'The ID of the connector to retrieve',
	},

	// ----------------------------------
	//         connector: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['connector'],
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
				resource: ['connector'],
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
	//         connector: update
	// ----------------------------------
	{
		displayName: 'Connector ID',
		name: 'connectorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['connector'],
				operation: ['update'],
			},
		},
		description: 'The ID of the connector to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['connector'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the connector',
			},
			{
				displayName: 'Status Notifications Enabled',
				name: 'hasStatusNotificationsEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to enable status notifications for this connector',
			},
		],
	},

	// ----------------------------------
	//         connector: delete
	// ----------------------------------
	{
		displayName: 'Connector ID',
		name: 'connectorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['connector'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the connector to delete',
	},

	// ----------------------------------
	//         connector: generateTokens
	// ----------------------------------
	{
		displayName: 'Connector ID',
		name: 'connectorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['connector'],
				operation: ['generateTokens'],
			},
		},
		description: 'The ID of the connector to generate tokens for',
	},
];
