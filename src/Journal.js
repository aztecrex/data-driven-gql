import * as R from 'ramda';

import TenantTypes from './Tenant';

const JournalEntry = `
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
        journal: Journal!

        """
        The Tenant owning this entry.
        """
        tenant: Tenant!

    }
`;

const Journal = `
    """
    A collection of business events with commonly-defined meaning.
    """
    type Journal {
        """
        Journal identity.
        """
        id: ID!

        """
        Journal name. Required but not unique.
        """
        name: String!

        """
        Journal description. Not required.
        """
        description: String

        """
        List of journal entries ordered by the "id" field, specified by a time stamp range.
        """
        entriesForRange("start of range inclusive" from: String! "end of range exclusive" to: String!): [JournalEntry!]!

        """
        All journal entries ordered by the "id" field.
        """
        entries: [JournalEntry!]!

        """
        The Tenant owning this journal.
        """
        tenant: Tenant!
    }
`;

const TenantX = `
    extend type Tenant {
        """
        All journals in the instance.
        """
        journals: [Journal!]!

        """
        Lookup journals by name. Names are not unique so this can return zero or more
        Journals.
        """
        journalsForName (name: String!): [Journal!]!
    }
`

const QueryX = `
    extend type Query {
        """
        Fetch a journal by its identifier.
        """
        journalForId(id: ID!): Journal!

        """
        Fetch a journal entry by its identifier.
        """
        journalEntryForId(id: String!): JournalEntry!
    }
`;




const TestOps = `

    input TestIn {
        """
        Unique entry reference identifier defined by the entity posting the entry. Uniqueness
        is with respect to the journal in which the entry resides.
        """
        clientReference : String!

        amount: Int
    }

    type TestJournalOps implements JournalOps {
        id : ID!
        post(entry : TestIn!) : JournalEntry!
    }


`;

const OtherOps = `

    input OtherIn {
        """
        Unique entry reference identifier defined by the entity posting the entry. Uniqueness
        is with respect to the journal in which the entry resides.
        """
        clientReference : String!

        adjust: Int
    }

    type OtherJournalOps implements JournalOps {
        id : ID!
        post(entry : OtherIn!) : JournalEntry!
    }


`;

const MutationX = `

    interface JournalOps {
        id : ID!
    }

    extend type Mutation {
        withJournal (id: ID!) : JournalOps!
    }
`;


const tenant = {id: 10092};
const journals = [
    {
        id: "1",
        name: "Sales",
        description: "All sales",
        tenant : tenant,
    },
    {
        id: "2",
        name: "Discounts",
        description: "All discounts",
        tenant : tenant,
    },
];

const JournalResolvers = {
    Query: {
        journalForId: (_, {id}) => R.find(obj => obj.id === id, journals),
    }
}

const JournalTypes = () => [QueryX, Journal, JournalEntry, TenantX, MutationX, TestOps, OtherOps, TenantTypes];

export {JournalTypes, JournalResolvers};
