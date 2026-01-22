import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { twingateApiRequest, twingateApiRequestAllItems, GRAPHQL } from './GenericFunctions';

import {
	remoteNetworkOperations,
	remoteNetworkFields,
	resourceOperations,
	resourceFields,
	connectorOperations,
	connectorFields,
	groupOperations,
	groupFields,
	userOperations,
	userFields,
	deviceOperations,
	deviceFields,
	serviceAccountOperations,
	serviceAccountFields,
	securityPolicyOperations,
	securityPolicyFields,
} from './descriptions';

export class Twingate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twingate',
		name: 'twingate',
		icon: 'file:twingate.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Twingate Zero Trust Network Access API',
		defaults: {
			name: 'Twingate',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'twingateApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Connector',
						value: 'connector',
					},
					{
						name: 'Device',
						value: 'device',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Remote Network',
						value: 'remoteNetwork',
					},
					{
						name: 'Resource',
						value: 'resource',
					},
					{
						name: 'Security Policy',
						value: 'securityPolicy',
					},
					{
						name: 'Service Account',
						value: 'serviceAccount',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'resource',
			},
			// Remote Network
			...remoteNetworkOperations,
			...remoteNetworkFields,
			// Resource
			...resourceOperations,
			...resourceFields,
			// Connector
			...connectorOperations,
			...connectorFields,
			// Group
			...groupOperations,
			...groupFields,
			// User
			...userOperations,
			...userFields,
			// Device
			...deviceOperations,
			...deviceFields,
			// Service Account
			...serviceAccountOperations,
			...serviceAccountFields,
			// Security Policy
			...securityPolicyOperations,
			...securityPolicyFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// -------------------------
				//       Remote Network
				// -------------------------
				if (resource === 'remoteNetwork') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const variables: IDataObject = { name };
						if (additionalFields.isActive !== undefined) {
							variables.isActive = additionalFields.isActive;
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.CREATE_REMOTE_NETWORK, variables, i);
						const result = response.remoteNetworkCreate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'get') {
						const remoteNetworkId = this.getNodeParameter('remoteNetworkId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_REMOTE_NETWORK, { id: remoteNetworkId }, i);
						responseData = response.remoteNetwork as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_REMOTE_NETWORKS, 'remoteNetworks', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_REMOTE_NETWORKS, { first: limit }, i);
							const data = response.remoteNetworks as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}

					if (operation === 'update') {
						const remoteNetworkId = this.getNodeParameter('remoteNetworkId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const variables: IDataObject = { id: remoteNetworkId, ...updateFields };

						const response = await twingateApiRequest.call(this, GRAPHQL.UPDATE_REMOTE_NETWORK, variables, i);
						const result = response.remoteNetworkUpdate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'delete') {
						const remoteNetworkId = this.getNodeParameter('remoteNetworkId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.DELETE_REMOTE_NETWORK, { id: remoteNetworkId }, i);
						const result = response.remoteNetworkDelete as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = { success: true };
					}
				}

				// -------------------------
				//         Resource
				// -------------------------
				if (resource === 'resource') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const address = this.getNodeParameter('address', i) as string;
						const remoteNetworkId = this.getNodeParameter('remoteNetworkId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const variables: IDataObject = { name, address, remoteNetworkId };

						if (additionalFields.isActive !== undefined) {
							variables.isActive = additionalFields.isActive;
						}

						if (additionalFields.groupIds) {
							variables.groupIds = (additionalFields.groupIds as string).split(',').map((id) => id.trim());
						}

						if (additionalFields.serviceAccountIds) {
							variables.serviceAccountIds = (additionalFields.serviceAccountIds as string).split(',').map((id) => id.trim());
						}

						// Build protocols object if specified
						const protocols: IDataObject = {};
						if (additionalFields.allowIcmp !== undefined) {
							protocols.allowIcmp = additionalFields.allowIcmp;
						}
						if (additionalFields.tcpPolicy) {
							protocols.tcp = { policy: additionalFields.tcpPolicy };
							if (additionalFields.tcpPolicy === 'RESTRICTED' && additionalFields.tcpPorts) {
								const ports = parsePortRanges(additionalFields.tcpPorts as string);
								(protocols.tcp as IDataObject).ports = ports;
							}
						}
						if (additionalFields.udpPolicy) {
							protocols.udp = { policy: additionalFields.udpPolicy };
							if (additionalFields.udpPolicy === 'RESTRICTED' && additionalFields.udpPorts) {
								const ports = parsePortRanges(additionalFields.udpPorts as string);
								(protocols.udp as IDataObject).ports = ports;
							}
						}
						if (Object.keys(protocols).length > 0) {
							variables.protocols = protocols;
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.CREATE_RESOURCE, variables, i);
						const result = response.resourceCreate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'get') {
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_RESOURCE, { id: resourceId }, i);
						responseData = response.resource as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_RESOURCES, 'resources', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_RESOURCES, { first: limit }, i);
							const data = response.resources as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}

					if (operation === 'update') {
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const variables: IDataObject = { id: resourceId };

						if (updateFields.name) variables.name = updateFields.name;
						if (updateFields.address) variables.address = updateFields.address;
						if (updateFields.remoteNetworkId) variables.remoteNetworkId = updateFields.remoteNetworkId;
						if (updateFields.isActive !== undefined) variables.isActive = updateFields.isActive;

						if (updateFields.groupIds) {
							variables.groupIds = (updateFields.groupIds as string).split(',').map((id) => id.trim());
						}

						if (updateFields.serviceAccountIds) {
							variables.serviceAccountIds = (updateFields.serviceAccountIds as string).split(',').map((id) => id.trim());
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.UPDATE_RESOURCE, variables, i);
						const result = response.resourceUpdate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'delete') {
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.DELETE_RESOURCE, { id: resourceId }, i);
						const result = response.resourceDelete as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = { success: true };
					}
				}

				// -------------------------
				//        Connector
				// -------------------------
				if (resource === 'connector') {
					if (operation === 'create') {
						const remoteNetworkId = this.getNodeParameter('remoteNetworkId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const variables: IDataObject = { remoteNetworkId };
						if (additionalFields.name) variables.name = additionalFields.name;
						if (additionalFields.hasStatusNotificationsEnabled !== undefined) {
							variables.hasStatusNotificationsEnabled = additionalFields.hasStatusNotificationsEnabled;
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.CREATE_CONNECTOR, variables, i);
						const result = response.connectorCreate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'get') {
						const connectorId = this.getNodeParameter('connectorId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_CONNECTOR, { id: connectorId }, i);
						responseData = response.connector as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_CONNECTORS, 'connectors', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_CONNECTORS, { first: limit }, i);
							const data = response.connectors as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}

					if (operation === 'update') {
						const connectorId = this.getNodeParameter('connectorId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const variables: IDataObject = { id: connectorId, ...updateFields };

						const response = await twingateApiRequest.call(this, GRAPHQL.UPDATE_CONNECTOR, variables, i);
						const result = response.connectorUpdate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'delete') {
						const connectorId = this.getNodeParameter('connectorId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.DELETE_CONNECTOR, { id: connectorId }, i);
						const result = response.connectorDelete as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = { success: true };
					}

					if (operation === 'generateTokens') {
						const connectorId = this.getNodeParameter('connectorId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GENERATE_CONNECTOR_TOKENS, { connectorId }, i);
						const result = response.connectorGenerateTokens as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.connectorTokens as IDataObject;
					}
				}

				// -------------------------
				//          Group
				// -------------------------
				if (resource === 'group') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const variables: IDataObject = { name };

						if (additionalFields.userIds) {
							variables.userIds = (additionalFields.userIds as string).split(',').map((id) => id.trim());
						}

						if (additionalFields.resourceIds) {
							variables.resourceIds = (additionalFields.resourceIds as string).split(',').map((id) => id.trim());
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.CREATE_GROUP, variables, i);
						const result = response.groupCreate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'get') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_GROUP, { id: groupId }, i);
						responseData = response.group as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_GROUPS, 'groups', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_GROUPS, { first: limit }, i);
							const data = response.groups as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}

					if (operation === 'update') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const variables: IDataObject = { id: groupId };

						if (updateFields.name) variables.name = updateFields.name;
						if (updateFields.isActive !== undefined) variables.isActive = updateFields.isActive;

						if (updateFields.addedUserIds) {
							variables.addedUserIds = (updateFields.addedUserIds as string).split(',').map((id) => id.trim());
						}
						if (updateFields.removedUserIds) {
							variables.removedUserIds = (updateFields.removedUserIds as string).split(',').map((id) => id.trim());
						}
						if (updateFields.addedResourceIds) {
							variables.addedResourceIds = (updateFields.addedResourceIds as string).split(',').map((id) => id.trim());
						}
						if (updateFields.removedResourceIds) {
							variables.removedResourceIds = (updateFields.removedResourceIds as string).split(',').map((id) => id.trim());
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.UPDATE_GROUP, variables, i);
						const result = response.groupUpdate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'delete') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.DELETE_GROUP, { id: groupId }, i);
						const result = response.groupDelete as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = { success: true };
					}
				}

				// -------------------------
				//          User
				// -------------------------
				if (resource === 'user') {
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_USER, { id: userId }, i);
						responseData = response.user as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_USERS, 'users', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_USERS, { first: limit }, i);
							const data = response.users as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}

					if (operation === 'update') {
						const userId = this.getNodeParameter('userId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const variables: IDataObject = { id: userId };

						if (updateFields.firstName) variables.firstName = updateFields.firstName;
						if (updateFields.lastName) variables.lastName = updateFields.lastName;
						if (updateFields.role) variables.role = updateFields.role;
						if (updateFields.state) variables.state = updateFields.state;

						const response = await twingateApiRequest.call(this, GRAPHQL.UPDATE_USER, variables, i);
						const result = response.userUpdate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'delete') {
						const userId = this.getNodeParameter('userId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.DELETE_USER, { id: userId }, i);
						const result = response.userDelete as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = { success: true };
					}
				}

				// -------------------------
				//         Device
				// -------------------------
				if (resource === 'device') {
					if (operation === 'get') {
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_DEVICE, { id: deviceId }, i);
						responseData = response.device as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_DEVICES, 'devices', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_DEVICES, { first: limit }, i);
							const data = response.devices as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}

					if (operation === 'updateTrust') {
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const isTrusted = this.getNodeParameter('isTrusted', i) as boolean;

						const response = await twingateApiRequest.call(this, GRAPHQL.UPDATE_DEVICE_TRUST, { id: deviceId, isTrusted }, i);
						const result = response.deviceUpdate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}
				}

				// -------------------------
				//     Service Account
				// -------------------------
				if (resource === 'serviceAccount') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const variables: IDataObject = { name };

						if (additionalFields.resourceIds) {
							variables.resourceIds = (additionalFields.resourceIds as string).split(',').map((id) => id.trim());
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.CREATE_SERVICE_ACCOUNT, variables, i);
						const result = response.serviceAccountCreate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'get') {
						const serviceAccountId = this.getNodeParameter('serviceAccountId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_SERVICE_ACCOUNT, { id: serviceAccountId }, i);
						responseData = response.serviceAccount as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_SERVICE_ACCOUNTS, 'serviceAccounts', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_SERVICE_ACCOUNTS, { first: limit }, i);
							const data = response.serviceAccounts as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}

					if (operation === 'update') {
						const serviceAccountId = this.getNodeParameter('serviceAccountId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const variables: IDataObject = { id: serviceAccountId };

						if (updateFields.name) variables.name = updateFields.name;

						if (updateFields.addedResourceIds) {
							variables.addedResourceIds = (updateFields.addedResourceIds as string).split(',').map((id) => id.trim());
						}
						if (updateFields.removedResourceIds) {
							variables.removedResourceIds = (updateFields.removedResourceIds as string).split(',').map((id) => id.trim());
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.UPDATE_SERVICE_ACCOUNT, variables, i);
						const result = response.serviceAccountUpdate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'delete') {
						const serviceAccountId = this.getNodeParameter('serviceAccountId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.DELETE_SERVICE_ACCOUNT, { id: serviceAccountId }, i);
						const result = response.serviceAccountDelete as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = { success: true };
					}

					if (operation === 'createKey') {
						const serviceAccountId = this.getNodeParameter('serviceAccountId', i) as string;
						const keyName = this.getNodeParameter('keyName', i) as string;
						const keyAdditionalFields = this.getNodeParameter('keyAdditionalFields', i) as IDataObject;

						const variables: IDataObject = {
							serviceAccountId,
							name: keyName,
						};

						if (keyAdditionalFields.expirationTime) {
							variables.expirationTime = keyAdditionalFields.expirationTime;
						}

						const response = await twingateApiRequest.call(this, GRAPHQL.CREATE_SERVICE_KEY, variables, i);
						const result = response.serviceAccountKeyCreate as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = result.entity as IDataObject;
					}

					if (operation === 'revokeKey') {
						const serviceKeyId = this.getNodeParameter('serviceKeyId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.REVOKE_SERVICE_KEY, { id: serviceKeyId }, i);
						const result = response.serviceAccountKeyRevoke as IDataObject;

						if (!result.ok) {
							throw new NodeOperationError(this.getNode(), result.error as string, { itemIndex: i });
						}
						responseData = { success: true };
					}
				}

				// -------------------------
				//     Security Policy
				// -------------------------
				if (resource === 'securityPolicy') {
					if (operation === 'get') {
						const securityPolicyId = this.getNodeParameter('securityPolicyId', i) as string;
						const response = await twingateApiRequest.call(this, GRAPHQL.GET_SECURITY_POLICY, { id: securityPolicyId }, i);
						responseData = response.securityPolicy as IDataObject;
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await twingateApiRequestAllItems.call(this, GRAPHQL.GET_SECURITY_POLICIES, 'securityPolicies', {}, i);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await twingateApiRequest.call(this, GRAPHQL.GET_SECURITY_POLICIES, { first: limit }, i);
							const data = response.securityPolicies as IDataObject;
							const edges = data.edges as IDataObject[];
							responseData = edges.map((edge) => edge.node as IDataObject);
						}
					}
				}

				// Build output
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

/**
 * Helper function to parse port ranges from a string like "22, 80, 443, 8000-9000"
 */
function parsePortRanges(portsString: string): Array<{ start: number; end: number }> {
	const ranges: Array<{ start: number; end: number }> = [];
	const parts = portsString.split(',').map((p) => p.trim());

	for (const part of parts) {
		if (part.includes('-')) {
			const [start, end] = part.split('-').map((p) => parseInt(p.trim(), 10));
			ranges.push({ start, end });
		} else {
			const port = parseInt(part, 10);
			ranges.push({ start: port, end: port });
		}
	}

	return ranges;
}
