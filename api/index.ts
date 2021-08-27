import { server } from './server';

server.listen().then(({ url }) => {
  console.log(`Nexus Server ready at ${url}`);
});
