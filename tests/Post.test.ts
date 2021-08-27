import { createTestContext } from './__helpers';

const ctx = createTestContext();

it(`Ensures that a draft can be created and published`, async () => {
  // Create a new draft
  const draftResult = await ctx.client.request(`
        mutation {
            createDraft(title: "Nexus", body: "...") {
                id
                title
                body
                published
            }
        }
    `);

  // Snapshot the draft and expect `published` to be false
  expect(draftResult).toMatchInlineSnapshot(`
Object {
  "createDraft": Object {
    "body": "...",
    "id": 7,
    "published": false,
    "title": "Nexus",
  },
}
`);

  // Publish the previously created draft
  const publishResult = await ctx.client.request(
    `
        mutation publishDraft($draftId: Int!) {
            publish(draftId: $draftId) {
                id
                title
                body
                published
            }
        }
    `,
    { draftId: draftResult.createDraft.id }
  );

  // Snapshot the published draft and expect `published` to be true
  expect(publishResult).toMatchInlineSnapshot(`
Object {
  "publish": Object {
    "body": "...",
    "id": 7,
    "published": true,
    "title": "Nexus",
  },
}
`);

  const persistedData = await ctx.db.post.findMany();

  expect(persistedData).toMatchInlineSnapshot(`
Array [
  Object {
    "body": "Draft body",
    "id": 1,
    "published": false,
    "title": "New draft to Prisma",
  },
  Object {
    "body": "Draft body",
    "id": 2,
    "published": false,
    "title": "New draft to Prisma",
  },
  Object {
    "body": "Draft body",
    "id": 3,
    "published": false,
    "title": "New draft to Prisma",
  },
  Object {
    "body": "Draft body",
    "id": 4,
    "published": false,
    "title": "New draft to Prisma",
  },
  Object {
    "body": "...",
    "id": 5,
    "published": true,
    "title": "Nexus",
  },
  Object {
    "body": "...",
    "id": 6,
    "published": true,
    "title": "Nexus",
  },
  Object {
    "body": "...",
    "id": 7,
    "published": true,
    "title": "Nexus",
  },
]
`);
});
