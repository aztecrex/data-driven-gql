import express from 'express';
import graphqlHTTP from 'express-graphql';

import { makeExecutableSchema} from 'graphql-tools';

import {JournalTypes, JournalResolvers} from './Journal';
import TenantTypes from './Tenant';


const Schema = `
    schema {
        query: Query
        mutation: Mutation
    }

    """
    Root query.
    """
    type Query

    """
    Root mutation.
    """
    type Mutation
`

const schema = makeExecutableSchema({
    typeDefs: [Schema, JournalTypes, TenantTypes],
    resolvers: [JournalResolvers]
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
