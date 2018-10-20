const JournalTypes = `

    """
    A business event. Generally, a journal entry results
    in a financial impact, i.e. a ledger transaction.
    """
    type JournalEntry {
        """
        Unique entry reference identifier defined by the entity posting the entry. Uniqueness
        is with respect to the journal in which the entry resides.
        """
        clientReference : String!

        """
        Unique and totally ordered identifier of the form "n.n" where each component, "n," is
        an integer. For ordering, the left component is the most significant.
        """
        id: String!

        """
        Non-unique time stamp with millisecond precision. The time stamp is isomorphic with the
        left component of the "id" field. This field is informational only, it is assigned when an entry
        is posted and corresponds roughly to the time of posting. Any time coordinates needed to
        resolve non-commutative journal application must be supplied by the client in the
        journal-specific portion of an entry.
        """
        timestamp: String!

        """
        Journal that holds this entry.
        """
        journal: Journal

        """
        The Tenant owning this entry.
        """
        tenant: Tenant

    }

    """
    A collection of business events with commonly-defined meaning.
    """
    type Journal {
        """
        Journal identity.
        """
        id: ID!

        """
        List of journal entries ordered by the "id" field, specified by a time stamp range.
        """
        entriesForRange("start of range inclusive" from: String! "end of range exclusive" to: String!): [JournalEntry!]!

        """
        The Tenant owning this journal.
        """
        tenant: Tenant
    }

    """
    Isolated clearinghouse instance.
    """
    type Tenant {
        """
        Tenant identity.
        """
        id: ID!

        """
        All journals in the instance.
        """
        journals: [Journal!]!

        """
        Journal by identifier
        """
        journalForId(id: ID!): Journal

    }

`;

export default () => [JournalTypes];
