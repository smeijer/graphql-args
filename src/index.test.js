import { parse, getFields, getArgs } from './index';
import { ast } from './test-utils';

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

test('getArgs can use `parse` as optimization', () => {
  const { getArgs } = parse(ast);
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

test('getFields can return the root level', () => {
  const fields = getFields(ast, '');

  expect(fields).toMatchObject({
    author: true,
    comment: true,
    comments: true,
    id: true,
    title: true,
  });
});

test('getFields can limit the depth', () => {
  const fields = getFields(ast, '', { depth: 2 });

  expect(fields).toMatchObject({
    author: { name: true },
    comment: { id: true },
    comments: {
      author: true,
      id: true,
      // likes is flattened, original has { actor: true }
      likes: true,
      message: true,
    },
    id: true,
    title: true,
  });
});

test('getFields can return the entire object', () => {
  const fields = getFields(ast, '', { depth: -1 });

  expect(fields).toMatchObject({
    author: { name: true },
    comment: { id: true },
    comments: {
      author: true,
      id: true,
      likes: { actor: { email: true, name: true } },
      message: true,
    },
    id: true,
    title: true,
  });
});

test('getFields can retrieve nested objects', () => {
  const fields = getFields(ast, 'author');

  expect(fields).toMatchObject({
    name: true,
  });
});

test('getFields can retrieve the deeply nested objects', () => {
  const fields = getFields(ast, 'comments.likes');

  expect(fields).toEqual({
    actor: true,
  });
});

test('getFields can use `parse` as optimization', () => {
  const { getFields } = parse(ast);
  const fields = getFields('comments');

  expect(fields).toEqual({
    id: true,
    author: true,
    likes: true,
    message: true,
  });
});

test('getFields creator instance correctly handles nested objects with depth', () => {
  const { getFields } = parse(ast);
  const fields = getFields('comments', { depth: 2 });

  expect(fields).toEqual({
    id: true,
    author: true,
    likes: { actor: true },
    message: true,
  });
});
