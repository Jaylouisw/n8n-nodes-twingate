import type { INodeProperties } from 'n8n-workflow';

export const resourceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['resource'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new resource',
				action: 'Create a resource',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a resource',
				action: 'Delete a resource',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a resource by ID',
				action: 'Get a resource',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many resources',
				action: 'Get many resources',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a resource',
				action: 'Update a resource',
			},
		],
		default: 'getAll',
	},
];

export const resourceFields: INodeProperties[] = [
	// ----------------------------------
	//         resource: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['create'],
			},
		},
		description: 'Name of the resource',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['create'],
			},
		},
		description: 'The IP address, CIDR range, or DNS name for the resource (e.g., 10.0.0.1, 10.0.0.0/24, internal.example.com)',
	},
	{
		displayName: 'Remote Network ID',
		name: 'remoteNetworkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['create'],
			},
		},
		description: 'The ID of the remote network this resource belongs to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the resource is active',
			},
			{
				displayName: 'Group IDs',
				name: 'groupIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of Group IDs to grant access to this resource',
			},
			{
				displayName: 'Service Account IDs',
				name: 'serviceAccountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of Service Account IDs to grant access to this resource',
			},
			{
				displayName: 'Allow ICMP',
				name: 'allowIcmp',
				type: 'boolean',
				default: true,
				description: 'Whether to allow ICMP traffic',
			},
			{
				displayName: 'TCP Policy',
				name: 'tcpPolicy',
				type: 'options',
				options: [
					{
						name: 'Allow All',
						value: 'ALLOW_ALL',
					},
					{
						name: 'Deny All',
						value: 'DENY_ALL',
					},
					{
						name: 'Restricted',
						value: 'RESTRICTED',
					},
				],
				default: 'ALLOW_ALL',
				description: 'TCP access policy',
			},
			{
				displayName: 'TCP Ports',
				name: 'tcpPorts',
				type: 'string',
				default: '',
				description: 'Comma-separated list of TCP port ranges (e.g., 22, 80, 443, 8000-9000). Only used when TCP Policy is "Restricted".',
			},
			{
				displayName: 'UDP Policy',
				name: 'udpPolicy',
				type: 'options',
				options: [
					{
						name: 'Allow All',
						value: 'ALLOW_ALL',
					},
					{
						name: 'Deny All',
						value: 'DENY_ALL',
					},
					{
						name: 'Restricted',
						value: 'RESTRICTED',
					},
				],
				default: 'ALLOW_ALL',
				description: 'UDP access policy',
			},
			{
				displayName: 'UDP Ports',
				name: 'udpPorts',
				type: 'string',
				default: '',
				description: 'Comma-separated list of UDP port ranges (e.g., 53, 5000-6000). Only used when UDP Policy is "Restricted".',
			},
		],
	},

	// ----------------------------------
	//         resource: get
	// ----------------------------------
	{
		displayName: 'Resource ID',
		name: 'resourceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['get'],
			},
		},
		description: 'The ID of the resource to retrieve',
	},

	// ----------------------------------
	//         resource: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['resource'],
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
				resource: ['resource'],
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
	//         resource: update
	// ----------------------------------
	{
		displayName: 'Resource ID',
		name: 'resourceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['update'],
			},
		},
		description: 'The ID of the resource to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the resource',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'New address for the resource',
			},
			{
				displayName: 'Remote Network ID',
				name: 'remoteNetworkId',
				type: 'string',
				default: '',
				description: 'New remote network ID for the resource',
			},
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the resource is active',
			},
			{
				displayName: 'Group IDs',
				name: 'groupIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of Group IDs to grant access to this resource (replaces existing access)',
			},
			{
				displayName: 'Service Account IDs',
				name: 'serviceAccountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of Service Account IDs to grant access to this resource (replaces existing access)',
			},
		],
	},

	// ----------------------------------
	//         resource: delete
	// ----------------------------------
	{
		displayName: 'Resource ID',
		name: 'resourceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resource'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the resource to delete',
	},
];
