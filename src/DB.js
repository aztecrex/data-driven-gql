import * as R from 'ramda';

const journals = [
    {
        id: "Sales",
        description: "All sales",
        schema: ["amount", "sku", "customer"],
    },
    {
        id: "Discounts",
        description: "All receipts",
        schema: ["paid", "customer"],
    },
];

const entries = [
    {
        id: "1234.566",
        journal: journals[0],
        clientReference: "ABC!123",
        timestamp: "2010-12-19T13:00:37.301Z",
        amount: 10,
        sku: 12,
        customer: 100398,
    },
    {
        id: "1235.621",
        journal: journals[0],
        clientReference: "ABC!124",
        timestamp: "2010-12-19T13:00:38.301Z",
        amount: 9310,
        sku: 1234234,
        customer: 3100,
    },
    {
        id: "4321.8923",
        journal: journals[1],
        clientReference: "XYZ!273894",
        timestamp: "2018-11-01T09:21:05.144Z",
        customer: 122213,
        paid: 11111,
    },
    {
        id: "4211.5501",
        journal: journals[1],
        clientReference: "XYZ!273321",
        timestamp: "2018-11-01T09:46:34.121Z",
        customer: 9999993,
        paid: 8,
    },
]


const journalEntries = jid => R.filter(obj => obj.journal.id === jid, entries);
const fetchJournal = id => R.find(obj => obj.id === id, journals);
const fetchJournalEntry = id => R.find(obj => obj.id === id, entries);
const allJournals = () => journals;


export {
    fetchJournal,
    allJournals,
    journalEntries,
    fetchJournalEntry
};
