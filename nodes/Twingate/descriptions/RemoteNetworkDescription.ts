import type { INodeProperties } from 'n8n-workflow';

export const remoteNetworkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new remote network',
				action: 'Create a remote network',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a remote network',
				action: 'Delete a remote network',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a remote network by ID',
				action: 'Get a remote network',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many remote networks',
				action: 'Get many remote networks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a remote network',
				action: 'Update a remote network',
			},
		],
		default: 'getAll',
	},
];

export const remoteNetworkFields: INodeProperties[] = [
	// ----------------------------------
	//         remoteNetwork: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
				operation: ['create'],
			},
		},
		description: 'Name of the remote network',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the remote network is active',
			},
		],
	},

	// ----------------------------------
	//         remoteNetwork: get
	// ----------------------------------
	{
		displayName: 'Remote Network ID',
		name: 'remoteNetworkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
				operation: ['get'],
			},
		},
		description: 'The ID of the remote network to retrieve',
	},

	// ----------------------------------
	//         remoteNetwork: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
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
				resource: ['remoteNetwork'],
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
	//         remoteNetwork: update
	// ----------------------------------
	{
		displayName: 'Remote Network ID',
		name: 'remoteNetworkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
				operation: ['update'],
			},
		},
		description: 'The ID of the remote network to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the remote network',
			},
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the remote network is active',
			},
		],
	},

	// ----------------------------------
	//         remoteNetwork: delete
	// ----------------------------------
	{
		displayName: 'Remote Network ID',
		name: 'remoteNetworkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['remoteNetwork'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the remote network to delete',
	},
];
