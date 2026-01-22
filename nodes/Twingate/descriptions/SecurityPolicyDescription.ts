import type { INodeProperties } from 'n8n-workflow';

export const securityPolicyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['securityPolicy'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a security policy by ID',
				action: 'Get a security policy',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many security policies',
				action: 'Get many security policies',
			},
		],
		default: 'getAll',
	},
];

export const securityPolicyFields: INodeProperties[] = [
	// ----------------------------------
	//         securityPolicy: get
	// ----------------------------------
	{
		displayName: 'Security Policy ID',
		name: 'securityPolicyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['securityPolicy'],
				operation: ['get'],
			},
		},
		description: 'The ID of the security policy to retrieve',
	},

	// ----------------------------------
	//         securityPolicy: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['securityPolicy'],
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
				resource: ['securityPolicy'],
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
];
