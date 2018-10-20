import express from 'express';
import graphqlHTTP from 'express-graphql';

import { makeExecutableSchema} from 'graphql-tools';

import JournalTypes from './Journal';

const RootQuery = `
    type RootQuery {
        tenants: [Tenant!]!
    }
`

const Schema = `
    schema {
        query: RootQuery
    }
`

const schema = makeExecutableSchema({
    typeDefs: [RootQuery, Schema, JournalTypes],
});


// // Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     tenants: [Tenant!]!
//   }
// `);

// // The root provides a resolver function for each API endpoint
// const root = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
//   rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
