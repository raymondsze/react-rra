import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

// read all files in this folder ending with .gql
const filenames = glob.sync(path.join(__dirname, '**/*.gql'));
// append all contents to contrust the executable schema
const rawSchema = filenames.map(filename => fs.readFileSync(filename, 'utf-8')).join('\n');
// convert to executable schema
const executableSchema = makeExecutableSchema({
  typeDefs: rawSchema,
  resolvers,
});

export default executableSchema;
