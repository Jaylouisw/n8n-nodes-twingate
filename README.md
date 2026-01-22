# n8n-nodes-twingate

This is an n8n community node that integrates with [Twingate](https://www.twingate.com/), a Zero Trust Network Access (ZTNA) platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install @jaylouisw/n8n-nodes-twingate
```

Or install directly in n8n:

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `@jaylouisw/n8n-nodes-twingate` and confirm

## Operations

This node supports the following Twingate resources and operations:

### Remote Network

- **Create** - Create a new remote network
- **Get** - Get a remote network by ID
- **Get All** - Get all remote networks
- **Update** - Update a remote network
- **Delete** - Delete a remote network

### Resource

- **Create** - Create a new resource with access controls and protocol restrictions
- **Get** - Get a resource by ID
- **Get All** - Get all resources
- **Update** - Update a resource
- **Delete** - Delete a resource

### Connector

- **Create** - Create a new connector in a remote network
- **Get** - Get a connector by ID
- **Get All** - Get all connectors
- **Update** - Update connector settings
- **Delete** - Delete a connector
- **Generate Tokens** - Generate authentication tokens for a connector

### Group

- **Create** - Create a new group with users and resource access
- **Get** - Get a group by ID
- **Get All** - Get all groups
- **Update** - Update group membership and resources
- **Delete** - Delete a group

### User

- **Get** - Get a user by ID
- **Get All** - Get all users
- **Update** - Update user details and role
- **Delete** - Delete a user

### Device

- **Get** - Get a device by ID
- **Get All** - Get all devices
- **Update Trust** - Update device trust status

### Service Account

- **Create** - Create a new service account
- **Get** - Get a service account by ID
- **Get All** - Get all service accounts
- **Update** - Update service account resource access
- **Delete** - Delete a service account
- **Create Key** - Generate a new API key for the service account
- **Revoke Key** - Revoke an existing service account key

### Security Policy

- **Get** - Get a security policy by ID
- **Get All** - Get all security policies

## Credentials

To use this node, you need to set up Twingate API credentials:

1. Log in to your [Twingate Admin Console](https://admin.twingate.com)
2. Navigate to **Settings > API**
3. Generate a new API token
4. In n8n, create new credentials of type **Twingate API**
5. Enter your:
   - **Subdomain**: Your Twingate network subdomain (e.g., `mycompany` for `mycompany.twingate.com`)
   - **API Key**: The API token you generated

### API Rate Limits

Twingate enforces the following rate limits:

- **Read operations**: 60 requests per minute
- **Write operations**: 20 requests per minute

The node will return an error if rate limits are exceeded.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Twingate API Documentation](https://www.twingate.com/docs/api-overview)
- [Twingate GraphQL API Reference](https://www.twingate.com/docs/api-reference)

## Development

### Building

```bash
npm install
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing Locally

To test the node locally with n8n:

```bash
# Link the package
npm link

# In your n8n installation directory
npm link n8n-nodes-twingate

# Start n8n
n8n start
```

## License

[MIT](LICENSE.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues with this community node, please open an issue in this repository.

For issues with Twingate itself, please contact [Twingate Support](https://www.twingate.com/support/).
