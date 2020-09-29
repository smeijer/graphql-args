import { createGetArgs, getArgs } from './getArgs';
import { parse } from 'graphql';

function getAst({ query, variables }) {
  return {
    fieldNodes: parse(query).definitions[0].selectionSet.selections,
    variableValues: variables,
  };
}

const ast = getAst({
  query: `query ($where: CommentFilterInput!) {
    blog (id: "blog_1") {
      id
      title
      
      author(id: "author_1") {
        name
      }
      
      comment(where: { id: "comment_1" }) {
        id
      }
      
      comments(where: $where) {
        id
        message
        author
        
        likes(where: { type: "heart" }) {
          actor
        }
      }
    }
  }`,
  variables: {
    where: {
      id: 'comment_2',
    },
  },
});

test('getArgs can retrieve the root arguments', () => {
  const args = getArgs(ast, '');

  expect(args).toEqual({
    id: 'blog_1',
  });
});

test('getArgs can retrieve the nested arguments', () => {
  const args = getArgs(ast, 'author');

  expect(args).toEqual({
    id: 'author_1',
  });
});

test('getArgs can retrieve the nested input type arguments', () => {
  const args = getArgs(ast, 'comment');

  expect(args).toEqual({
    where: { id: 'comment_1' },
  });
});

test('getArgs can retrieve the nested input type arguments using variables', () => {
  const args = getArgs(ast, 'comments');

  expect(args).toEqual({
    where: { id: 'comment_2' },
  });
});

test('getArgs can retrieve the deeply nested arguments', () => {
  const args = getArgs(ast, 'comments.likes');

  expect(args).toEqual({
    where: { type: 'heart' },
  });
});

test('createGetArgs returns single argument getArgs', () => {
  const getArgs = createGetArgs(ast);
  const args = getArgs('comment');

  expect(args).toEqual({
    where: { id: 'comment_1' },
  });
});

test('getArgs returns a creator instance when called with single argument', () => {
  const get = getArgs(ast);
  const args = get('comment');

  expect(args).toEqual({
    where: { id: 'comment_1' },
  });
});
