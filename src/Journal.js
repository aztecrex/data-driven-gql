import * as R from 'ramda';
import * as DB from './DB';

const JournalEntry = `
    """
    A business event. Generally, a journal entry results
    in a financial impact, i.e. a ledger transaction.
    """
    interface JournalEntry {
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
        id: String!

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

    }
`;

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

        """
        Retrieve all journals.
        """
        journals: [Journal!]!

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

const entryName = jnl => jnl.id + "JournalEntry";

const DynTypes = () => {

    const fields = ns => {
        const ds = R.map (n => `${n} : Int!`, ns);
        const rval =  R.join(" ", ds);
        return rval;
    }
    const journals = DB.allJournals();
    const rval = R.map(jnl => {
        return `type ${entryName(jnl)} implements JournalEntry {
            clientReference : String!
            id: String!
            timestamp: String!
            journal: Journal!
            ${fields(jnl.schema)}
        }`
    }, journals);
    return rval;
}

const JournalResolvers = {
    Query: {
        journalForId: (_, {id}) => DB.fetchJournal(id),
        journalEntryForId: (_, {id}) => DB.fetchJournalEntry(id),
        journals: () => DB.allJournals(),
    },

    Journal: {
        entries: (jnl) => DB.journalEntries(jnl.id),
        entriesForRange: (jnl) => DB.journalEntries(jnl.id),

    },
    JournalEntry: {
        __resolveType: e => entryName(e.journal),
    }
}

const JournalTypes = () => [QueryX, Journal, JournalEntry, MutationX, TestOps, OtherOps, DynTypes];

export {JournalTypes, JournalResolvers};
