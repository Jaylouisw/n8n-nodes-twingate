import type { INodeProperties } from 'n8n-workflow';

export const deviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['device'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a device by ID',
				action: 'Get a device',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many devices',
				action: 'Get many devices',
			},
			{
				name: 'Update Trust',
				value: 'updateTrust',
				description: 'Update the trust status of a device',
				action: 'Update device trust status',
			},
		],
		default: 'getAll',
	},
];

export const deviceFields: INodeProperties[] = [
	// ----------------------------------
	//         device: get
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['get'],
			},
		},
		description: 'The ID of the device to retrieve',
	},

	// ----------------------------------
	//         device: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['device'],
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
				resource: ['device'],
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
	//         device: updateTrust
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateTrust'],
			},
		},
		description: 'The ID of the device to update',
	},
	{
		displayName: 'Is Trusted',
		name: 'isTrusted',
		type: 'boolean',
		required: true,
		default: false,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['updateTrust'],
			},
		},
		description: 'Whether the device should be trusted',
	},
];
