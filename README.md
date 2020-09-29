# graphql-args

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

**extract query arguments from the graphql ast**

![screenshot of getArgs output](./docs/preview.png)

`graphql-args` provides a way to extract query arguments out of the 4th resolver argument.

## Installation

With npm:

```sh
npm install --save-dev graphql-args
```

With yarn:

```sh
yarn add -D graphql-args
```

## API

The examples below use the following query:

```gql
query blog($where: CommentFilterInput!) {
  blog(id: "blog_1") {
    comments(where: $where) {
      likes(where: { type: "heart" }) {
        actor
      }
    }
  }
}
```

with the following variables:

```js
where: {
  id: 'comment_2';
}
```

# getArgs(ast, 'path')

```js
import { getArgs } from 'graphql-args';

const resolvers = {
  blog(parent, args, context, ast) {
    getArgs(ast, 'comments'); // » { where: { id: 'comment_2' } }
  },
};
```

# getArgs(ast, 'nested.path')

```js
import { getArgs } from 'graphql-args';

const resolvers = {
  blog(parent, args, context, ast) {
    getArgs(ast, 'comments.likes'); // » { where: { type: 'heart' } }
  },
};
```

# getArgs(ast) => get('path')

In the scenario where you need to get arguments from multiple paths, and don't want to parse the ast more than once, the curry behavior of `getArgs` can be used.

```js
import { createGetArgs } from 'graphql-args';

const resolvers = {
  blog(parent, args, context, ast) {
    const get = getArgs(ast);

    get('comments'); // » { where: { id: 'comment_2' } }
    get('comments.likes'); // » { where: { type: 'heart' } }
  },
};
```

# createGetArgs(ast) => getArgs('path')

Use `createGetArgs` in the scenario where you need to get arguments from multiple paths, and don't want to parse the ast more than once. This will result in improved performance, although it might be negligible.

The same can be achieved by using the `getArgs(ast)`, but some of us like the more explicit nature of `createGetArgs` over curried functions.

```js
import { createGetArgs } from 'graphql-args';

const resolvers = {
  blog(parent, args, context, ast) {
    const getArgs = createGetArgs(ast);

    getArgs('comments'); // » { where: { id: 'comment_2' } }
    getArgs('comments.likes'); // » { where: { type: 'heart' } }
  },
};
```

## Prior Art

This library was created when I encountered a few short-commings in [cult-of-coders/grapher](https://github.com/cult-of-coders/grapher). While waiting for my [PR](https://github.com/cult-of-coders/grapher/pull/435) to get merged, I decided to extract some code, and adjusted to my needs.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
      <td align="center"><a href="https://github.com/smeijer"><img src="https://avatars1.githubusercontent.com/u/1196524?v=4" width="100px;" alt=""/><br /><sub><b>Stephan Meijer</b></sub></a><br /><a href="#ideas-smeijer" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/smeijer/graphql-args/commits?author=smeijer" title="Code">💻</a> <a href="#infra-smeijer" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-smeijer" title="Maintenance">🚧</a></td>
    </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
