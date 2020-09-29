import { parse } from 'graphql';

export function getAst({ query, variables }) {
  return {
    fieldNodes: parse(query).definitions[0].selectionSet.selections,
    variableValues: variables,
  };
}

export const ast = getAst({
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
