// api/schema.ts

import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './graphql';

export const schema = makeSchema({
  // 1. GraphQL Types will be used to construct your GraphQL Schema. Empty for now
  types, // 1
  // 2. Output path where nexus should write the generated TS definition types from the schema. Required to benefit from Nexus' type-safety. (We call this system "reflection", more info on that TBD)
  // 3. Outpath path where neux should write the SDL (schema defintion version of GraphQL schema)
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), //2
    schema: join(__dirname, '..', 'schema.graphql'), //3
  },
  contextType: {
    // 1. Option to set the context type
    module: join(__dirname, './context.ts'), // 2. Path to the module where the context type is exported
    export: 'Context', // 3. Name of the export in that module
  },
});
