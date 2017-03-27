import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import schema from '~/server/schema';

// Save JSON of full schema introspection for Babel Relay Plugin to use
/* eslint-disable no-console */
(async () => {
  console.log('Parsing graphql schema...');
  const result = await (graphql(schema, introspectionQuery));
  console.log('Generating graphql schema...');
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2),
    );
  } else {
    console.log('Writing graphql schema...');
    fs.writeFileSync(
      path.join(process.cwd(), 'schema.json'),
      JSON.stringify(result, null, 2),
    );
    // Save user readable type system shorthand of schema
    fs.writeFileSync(
      path.join(process.cwd(), 'schema.gql'),
      printSchema(schema),
    );
  }
  process.exit(0);
})();
/* eslint-enable no-console */
