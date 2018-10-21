# Data Driven GraphQL Experiments

## Run Locally

Clone this project and `npm install` it.

To run the local server, `npm run server`.

Point browser to the resulting URL to use the Graphiql UI.

## Query Sample

Take a look at `src/DB.js` to see the sample data for this query.

In the Graphiql UI, enter this query:

```graphql
{
  journals {
    ...Journal
  }
}

fragment Journal on Journal {
  id
  description
  entries {
    ...JournalEntry
  }
}

fragment JournalEntry on JournalEntry {
  id
  clientReference
  timestamp
  ... on SalesJournalEntry {
    amount
    sku
    customer
  }
  ... on DiscountsJournalEntry {
    paid
    customer
  }
}

```
The distinct journal entry types `SalesJournalEntry` and `DiscountsJournalEntry`
are generated at runtime from the ids of the `Sales` nd `Discounts` journal
objects. Notice they have different fields based on the `schema` field of each
journal object in the database.


