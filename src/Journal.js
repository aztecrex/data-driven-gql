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

const MutationX = `

    interface JournalOps {
        id : ID!
    }

    extend type Mutation {
        withJournal (id: ID!) : JournalOps!
    }
`;

const entryName = jnl => jnl.id + "JournalEntry";
const inputName = jnl => jnl.id + "JournalEntryInput";
const opsName = jnl => jnl.id + "JournalOps";

const DynTypes = () => {

    const fields = ns => {
        const ds = R.map (n => `${n} : Int!`, ns);
        const rval =  R.join(" ", ds);
        return rval;
    }
    const journals = DB.allJournals();
    const entryTypes = R.map(jnl => {
        return `type ${entryName(jnl)} implements JournalEntry {
            clientReference : String!
            id: String!
            timestamp: String!
            journal: Journal!
            ${fields(jnl.schema)}
        }`
    }, journals);
    const inputTypes = R.map(jnl => {
        return `input ${inputName(jnl)} {
            ${fields(jnl.schema)}
        } type ${opsName(jnl)} implements JournalOps {
            id : ID!
            post(reference: String! entry : ${inputName(jnl)}!) : ${entryName(jnl)}!
        }`
    }, journals);
    return R.concat(entryTypes, inputTypes);
}

const FixedResolvers = {
    Query: {
        journalForId: (_, {id}) => DB.fetchJournal(id),
        journalEntryForId: (_, {id}) => DB.fetchJournalEntry(id),
        journals: () => DB.allJournals(),
    },

    Mutation: {
        withJournal: (_, {id}) => DB.fetchJournal(id),
    },

    Journal: {
        entries: (jnl) => DB.journalEntries(jnl.id),
        entriesForRange: (jnl) => DB.journalEntries(jnl.id),

    },

    JournalEntry: {
        __resolveType: e => entryName(e.journal),
    },

    JournalOps: {
        __resolveType: jnl => opsName(jnl),
    },
}

const DynResolvers = (() => {
    var dot = 19390421;
    const journals = DB.allJournals();
    return R.reduce((obj, jnl) => {
        const res = {
            [opsName(jnl)]: {
                post: (_, {reference, entry}) => {
                    const when = new Date();
                    dot = dot + 19;
                    return {
                        id: `${when.getTime()}.${dot}`,
                        journal: jnl,
                        clientReference: reference,
                        timestamp: when.toISOString(),
                        customer: entry.customer,
                        paid: entry.paid,
                        sku: entry.sku,
                        amount: entry.amount,
                    };
                }
            }
        };
        return {...res, ...obj};
    }, {}, journals);
})();

const JournalTypes = () => [QueryX, Journal, JournalEntry, MutationX, DynTypes];
const JournalResolvers = {...FixedResolvers, ...DynResolvers}

export {JournalTypes, JournalResolvers};
