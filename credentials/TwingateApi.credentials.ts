import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TwingateApi implements ICredentialType {
	name = 'twingateApi';

	displayName = 'Twingate API';

	documentationUrl = 'https://www.twingate.com/docs/api-overview';

	properties: INodeProperties[] = [
		{
			displayName: 'Subdomain',
			name: 'subdomain',
			type: 'string',
			default: '',
			placeholder: 'your-network',
			description: 'Your Twingate network subdomain (e.g., if your URL is mycompany.twingate.com, enter "mycompany")',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key generated from Twingate Admin Console (Settings > API > Generate Token)',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.subdomain}}.twingate.com',
			url: '/api/graphql/',
			method: 'POST',
			body: JSON.stringify({
				query: '{ remoteNetworks(first: 1) { edges { node { id } } } }',
			}),
		},
	};
}
