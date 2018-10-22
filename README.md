# Data Driven GraphQL Schema Experiments

I need to model a dynamically-shaped API in GraphQL. In particular, the shape
can be modified through configuration or an API. One approach is to marshall
the parts that can change into a scalar type. I don't think that would be a good
experience for my API users.

I started this project to see if a GraphQL API schema can be a function of
data and, if so, whether the resulting API can be convenient and clear. The
results of these experiments show that it is entirely possible.

The API in this project models a business Journal. A journal in this model
is simply a list of business events that may (are likely to) have ledger impact
on the business. Booking (the application of the journals to a ledger) is not
modeled by this simple API.

This project shows that a journal's type can result in a different API for
both retrieving and posting journal entries. There are two journals,
"Sales" and "Discounts." The fields in the entries of each type are different.
I've made the simplifying assumption that the variable schema is simply a list
of named integer values. But the dynamic schema could easily map to more types.

The project runs with express and serves a Graphiql UI for messing around with
it.


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
are generated at runtime from the ids of the `Sales` and `Discounts` journal
objects. Notice they have different fields based on the `schema` field of each
journal object in the database.

## Mutation Sample

In the Graphiql UI, enter this query:

```graphql
mutation {
  postSales: withSalesJournal {
    post(reference: "MYSALESENTRY", entry: {amount: 100, sku: 200, customer: 300}) {
      id
      clientReference
      timestamp
      sku
    }
  }
  postDiscount: withDiscountsJournal {
    post(reference: "MYDISCENTRY", entry: {paid: 29291, customer: 400}) {
      id
      paid
    }
  }
}

```

The `withSalesJournal` and `withDiscountsJournal` properties are generated from the 
journal objects in the database. The journal name is used to distinguish the property
names. The schema attached is used to generate the entry input types for each.


