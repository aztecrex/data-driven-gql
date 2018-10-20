const Tenant = `

    """
    Isolated clearinghouse instance.
    """
    type Tenant {
        """
        Tenant identifier.
        """
        id: ID!

    }

`;

const QueryX = `
    extend type Query {
        """
        All tenants.
        """
        tenants: [Tenant!]!

        """
        Fetch a tenant by its identifier.
        """
        tenantForId(id: ID!) : Tenant!
    }
`;

const types = () => [QueryX, Tenant]

export default types;

