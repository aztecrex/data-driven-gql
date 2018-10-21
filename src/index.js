import express from 'express';
import graphqlHTTP from 'express-graphql';

import { makeExecutableSchema} from 'graphql-tools';

import {JournalTypes, JournalResolvers} from './Journal';


const Schema = `
    schema {
        query: Query
        mutation: Mutation
    }
    type Query
    type Mutation
`

const schema = makeExecutableSchema({
    typeDefs: [Schema, JournalTypes],
    resolvers: JournalResolvers
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
