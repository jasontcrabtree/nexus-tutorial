import { objectType, extendType, stringArg, nonNull, intArg } from 'nexus';

export const Post = objectType({
  name: 'Post', // Name of type
  definition(type) {
    type.int('id'); // Field named `id` of type integer
    type.string('title'); // Field named `title` of type `String`
    type.string('body'); // Field named `body` of type `String`
    type.boolean('published'); // Field named `published` of type boolean`
  },
});

export const PostQuery = extendType({
  type: 'Query',
  definition(type) {
    type.nonNull.list.field('drafts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: false } });
      },
    });
    type.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: true } });
      },
    });
  },
});

export const PostMutation = extendType({
  type: 'Mutation',
  definition(type) {
    type.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const draft = {
          title: args.title,
          body: args.body,
          published: false,
        };
        return ctx.db.post.create({ data: draft });
      },
    });
    type.field('publish', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: { id: args.draftId },
          data: {
            published: true,
          },
        });
      },
    });
  },
});
