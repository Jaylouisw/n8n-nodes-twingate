import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Make a GraphQL request to the Twingate API
 */
export async function twingateApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	query: string,
	variables: IDataObject = {},
	itemIndex = 0,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('twingateApi');

	const options: IHttpRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: `https://${credentials.subdomain}.twingate.com/api/graphql/`,
		headers: {
			'X-API-KEY': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body: {
			query,
			variables,
		},
		json: true,
	};

	try {
		const response = await this.helpers.httpRequest(options);

		if (response.errors) {
			const errorMessage = response.errors
				.map((error: { message: string }) => error.message)
				.join(', ');
			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: errorMessage,
				itemIndex,
			});
		}

		return response.data;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
	}
}

/**
 * Make a GraphQL request and return all items using pagination
 */
export async function twingateApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	query: string,
	rootKey: string,
	variables: IDataObject = {},
	itemIndex = 0,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let hasNextPage = true;
	let cursor: string | null = null;

	while (hasNextPage) {
		const paginatedVariables = { ...variables, after: cursor, first: 50 };
		const response = await twingateApiRequest.call(this, query, paginatedVariables, itemIndex);

		const data = response[rootKey] as IDataObject;
		const edges = data.edges as IDataObject[];

		if (edges) {
			for (const edge of edges) {
				returnData.push(edge.node as IDataObject);
			}
		}

		const pageInfo = data.pageInfo as IDataObject;
		hasNextPage = pageInfo?.hasNextPage as boolean;
		cursor = pageInfo?.endCursor as string;
	}

	return returnData;
}

/**
 * GraphQL Queries and Mutations for Twingate API
 */
export const GRAPHQL = {
	// Remote Networks
	GET_REMOTE_NETWORKS: `
		query GetRemoteNetworks($after: String, $first: Int) {
			remoteNetworks(after: $after, first: $first) {
				edges {
					node {
						id
						name
						isActive
						createdAt
						updatedAt
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_REMOTE_NETWORK: `
		query GetRemoteNetwork($id: ID!) {
			remoteNetwork(id: $id) {
				id
				name
				isActive
				createdAt
				updatedAt
				resources {
					edges {
						node {
							id
							name
						}
					}
				}
				connectors {
					edges {
						node {
							id
							name
							state
						}
					}
				}
			}
		}
	`,

	CREATE_REMOTE_NETWORK: `
		mutation CreateRemoteNetwork($name: String!, $isActive: Boolean) {
			remoteNetworkCreate(name: $name, isActive: $isActive) {
				ok
				error
				entity {
					id
					name
					isActive
					createdAt
					updatedAt
				}
			}
		}
	`,

	UPDATE_REMOTE_NETWORK: `
		mutation UpdateRemoteNetwork($id: ID!, $name: String, $isActive: Boolean) {
			remoteNetworkUpdate(id: $id, name: $name, isActive: $isActive) {
				ok
				error
				entity {
					id
					name
					isActive
					createdAt
					updatedAt
				}
			}
		}
	`,

	DELETE_REMOTE_NETWORK: `
		mutation DeleteRemoteNetwork($id: ID!) {
			remoteNetworkDelete(id: $id) {
				ok
				error
			}
		}
	`,

	// Resources
	GET_RESOURCES: `
		query GetResources($after: String, $first: Int) {
			resources(after: $after, first: $first) {
				edges {
					node {
						id
						name
						address {
							value
						}
						isActive
						createdAt
						updatedAt
						remoteNetwork {
							id
							name
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_RESOURCE: `
		query GetResource($id: ID!) {
			resource(id: $id) {
				id
				name
				address {
					value
				}
				isActive
				createdAt
				updatedAt
				remoteNetwork {
					id
					name
				}
				protocols {
					allowIcmp
					tcp {
						policy
						ports {
							start
							end
						}
					}
					udp {
						policy
						ports {
							start
							end
						}
					}
				}
				access {
					edges {
						node {
							... on Group {
								id
								name
							}
							... on ServiceAccount {
								id
								name
							}
						}
					}
				}
			}
		}
	`,

	CREATE_RESOURCE: `
		mutation CreateResource($name: String!, $address: String!, $remoteNetworkId: ID!, $isActive: Boolean, $protocols: ProtocolsInput, $groupIds: [ID!], $serviceAccountIds: [ID!]) {
			resourceCreate(
				name: $name
				address: $address
				remoteNetworkId: $remoteNetworkId
				isActive: $isActive
				protocols: $protocols
				groupIds: $groupIds
				serviceAccountIds: $serviceAccountIds
			) {
				ok
				error
				entity {
					id
					name
					address {
						value
					}
					isActive
					createdAt
					updatedAt
				}
			}
		}
	`,

	UPDATE_RESOURCE: `
		mutation UpdateResource($id: ID!, $name: String, $address: String, $remoteNetworkId: ID, $isActive: Boolean, $protocols: ProtocolsInput, $groupIds: [ID!], $serviceAccountIds: [ID!]) {
			resourceUpdate(
				id: $id
				name: $name
				address: $address
				remoteNetworkId: $remoteNetworkId
				isActive: $isActive
				protocols: $protocols
				groupIds: $groupIds
				serviceAccountIds: $serviceAccountIds
			) {
				ok
				error
				entity {
					id
					name
					address {
						value
					}
					isActive
					createdAt
					updatedAt
				}
			}
		}
	`,

	DELETE_RESOURCE: `
		mutation DeleteResource($id: ID!) {
			resourceDelete(id: $id) {
				ok
				error
			}
		}
	`,

	// Connectors
	GET_CONNECTORS: `
		query GetConnectors($after: String, $first: Int) {
			connectors(after: $after, first: $first) {
				edges {
					node {
						id
						name
						state
						publicIP
						privateIPs
						hostname
						version
						hasStatusNotificationsEnabled
						createdAt
						updatedAt
						remoteNetwork {
							id
							name
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_CONNECTOR: `
		query GetConnector($id: ID!) {
			connector(id: $id) {
				id
				name
				state
				publicIP
				privateIPs
				hostname
				version
				hasStatusNotificationsEnabled
				createdAt
				updatedAt
				remoteNetwork {
					id
					name
				}
			}
		}
	`,

	CREATE_CONNECTOR: `
		mutation CreateConnector($remoteNetworkId: ID!, $name: String, $hasStatusNotificationsEnabled: Boolean) {
			connectorCreate(
				remoteNetworkId: $remoteNetworkId
				name: $name
				hasStatusNotificationsEnabled: $hasStatusNotificationsEnabled
			) {
				ok
				error
				entity {
					id
					name
					state
					createdAt
					updatedAt
				}
			}
		}
	`,

	UPDATE_CONNECTOR: `
		mutation UpdateConnector($id: ID!, $name: String, $hasStatusNotificationsEnabled: Boolean) {
			connectorUpdate(
				id: $id
				name: $name
				hasStatusNotificationsEnabled: $hasStatusNotificationsEnabled
			) {
				ok
				error
				entity {
					id
					name
					state
					hasStatusNotificationsEnabled
					createdAt
					updatedAt
				}
			}
		}
	`,

	DELETE_CONNECTOR: `
		mutation DeleteConnector($id: ID!) {
			connectorDelete(id: $id) {
				ok
				error
			}
		}
	`,

	GENERATE_CONNECTOR_TOKENS: `
		mutation GenerateConnectorTokens($connectorId: ID!) {
			connectorGenerateTokens(connectorId: $connectorId) {
				ok
				error
				connectorTokens {
					accessToken
					refreshToken
				}
			}
		}
	`,

	// Groups
	GET_GROUPS: `
		query GetGroups($after: String, $first: Int) {
			groups(after: $after, first: $first) {
				edges {
					node {
						id
						name
						type
						isActive
						createdAt
						updatedAt
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_GROUP: `
		query GetGroup($id: ID!) {
			group(id: $id) {
				id
				name
				type
				isActive
				createdAt
				updatedAt
				users {
					edges {
						node {
							id
							email
							firstName
							lastName
						}
					}
				}
				resources {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		}
	`,

	CREATE_GROUP: `
		mutation CreateGroup($name: String!, $userIds: [ID!], $resourceIds: [ID!]) {
			groupCreate(name: $name, userIds: $userIds, resourceIds: $resourceIds) {
				ok
				error
				entity {
					id
					name
					type
					isActive
					createdAt
					updatedAt
				}
			}
		}
	`,

	UPDATE_GROUP: `
		mutation UpdateGroup($id: ID!, $name: String, $isActive: Boolean, $addedUserIds: [ID!], $removedUserIds: [ID!], $addedResourceIds: [ID!], $removedResourceIds: [ID!]) {
			groupUpdate(
				id: $id
				name: $name
				isActive: $isActive
				addedUserIds: $addedUserIds
				removedUserIds: $removedUserIds
				addedResourceIds: $addedResourceIds
				removedResourceIds: $removedResourceIds
			) {
				ok
				error
				entity {
					id
					name
					type
					isActive
					createdAt
					updatedAt
				}
			}
		}
	`,

	DELETE_GROUP: `
		mutation DeleteGroup($id: ID!) {
			groupDelete(id: $id) {
				ok
				error
			}
		}
	`,

	// Users
	GET_USERS: `
		query GetUsers($after: String, $first: Int) {
			users(after: $after, first: $first) {
				edges {
					node {
						id
						email
						firstName
						lastName
						role
						state
						createdAt
						updatedAt
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_USER: `
		query GetUser($id: ID!) {
			user(id: $id) {
				id
				email
				firstName
				lastName
				role
				state
				createdAt
				updatedAt
				groups {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		}
	`,

	UPDATE_USER: `
		mutation UpdateUser($id: ID!, $firstName: String, $lastName: String, $role: UserRole, $state: UserStateUpdateInput) {
			userUpdate(id: $id, firstName: $firstName, lastName: $lastName, role: $role, state: $state) {
				ok
				error
				entity {
					id
					email
					firstName
					lastName
					role
					state
				}
			}
		}
	`,

	DELETE_USER: `
		mutation DeleteUser($id: ID!) {
			userDelete(id: $id) {
				ok
				error
			}
		}
	`,

	// Service Accounts
	GET_SERVICE_ACCOUNTS: `
		query GetServiceAccounts($after: String, $first: Int) {
			serviceAccounts(after: $after, first: $first) {
				edges {
					node {
						id
						name
						createdAt
						updatedAt
						keys {
							edges {
								node {
									id
									name
									status
									createdAt
									expiresAt
								}
							}
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_SERVICE_ACCOUNT: `
		query GetServiceAccount($id: ID!) {
			serviceAccount(id: $id) {
				id
				name
				createdAt
				updatedAt
				resources {
					edges {
						node {
							id
							name
						}
					}
				}
				keys {
					edges {
						node {
							id
							name
							status
							createdAt
							expiresAt
						}
					}
				}
			}
		}
	`,

	CREATE_SERVICE_ACCOUNT: `
		mutation CreateServiceAccount($name: String!, $resourceIds: [ID!]) {
			serviceAccountCreate(name: $name, resourceIds: $resourceIds) {
				ok
				error
				entity {
					id
					name
					createdAt
					updatedAt
				}
			}
		}
	`,

	UPDATE_SERVICE_ACCOUNT: `
		mutation UpdateServiceAccount($id: ID!, $name: String, $addedResourceIds: [ID!], $removedResourceIds: [ID!]) {
			serviceAccountUpdate(
				id: $id
				name: $name
				addedResourceIds: $addedResourceIds
				removedResourceIds: $removedResourceIds
			) {
				ok
				error
				entity {
					id
					name
					createdAt
					updatedAt
				}
			}
		}
	`,

	DELETE_SERVICE_ACCOUNT: `
		mutation DeleteServiceAccount($id: ID!) {
			serviceAccountDelete(id: $id) {
				ok
				error
			}
		}
	`,

	CREATE_SERVICE_KEY: `
		mutation CreateServiceKey($serviceAccountId: ID!, $name: String!, $expirationTime: Int) {
			serviceAccountKeyCreate(
				serviceAccountId: $serviceAccountId
				name: $name
				expirationTime: $expirationTime
			) {
				ok
				error
				entity {
					id
					name
					status
					token
					createdAt
					expiresAt
				}
			}
		}
	`,

	REVOKE_SERVICE_KEY: `
		mutation RevokeServiceKey($id: ID!) {
			serviceAccountKeyRevoke(id: $id) {
				ok
				error
			}
		}
	`,

	// Devices
	GET_DEVICES: `
		query GetDevices($after: String, $first: Int) {
			devices(after: $after, first: $first) {
				edges {
					node {
						id
						name
						deviceType
						osName
						osVersion
						clientVersion
						isTrusted
						lastConnectedAt
						user {
							id
							email
							firstName
							lastName
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_DEVICE: `
		query GetDevice($id: ID!) {
			device(id: $id) {
				id
				name
				deviceType
				osName
				osVersion
				clientVersion
				isTrusted
				lastConnectedAt
				user {
					id
					email
					firstName
					lastName
				}
			}
		}
	`,

	UPDATE_DEVICE_TRUST: `
		mutation UpdateDeviceTrust($id: ID!, $isTrusted: Boolean!) {
			deviceUpdate(id: $id, isTrusted: $isTrusted) {
				ok
				error
				entity {
					id
					name
					isTrusted
				}
			}
		}
	`,

	// Security Policies
	GET_SECURITY_POLICIES: `
		query GetSecurityPolicies($after: String, $first: Int) {
			securityPolicies(after: $after, first: $first) {
				edges {
					node {
						id
						name
						policyType
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`,

	GET_SECURITY_POLICY: `
		query GetSecurityPolicy($id: ID!) {
			securityPolicy(id: $id) {
				id
				name
				policyType
			}
		}
	`,
};
