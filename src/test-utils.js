import { parse } from 'graphql';

export function getAst({ query, variables }) {
  const ast = parse(query);

  const operation = ast.definitions.find(
    (x) => x.kind === 'OperationDefinition',
  );

  const fragments = ast.definitions.filter(
    (x) => x.kind === 'FragmentDefinition',
  );

  return {
    fieldNodes: operation.selectionSet.selections,
    variableValues: variables,
    fragments,
  };
}

export const ast = getAst({
  query: `
    query ($where: CommentFilterInput!) {
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
            actor {
              ...Person
            }
          }
        }
      }
    }
    
    fragment Person on Actor {
      name
      email
    }
  `,
  variables: {
    where: {
      id: 'comment_2',
    },
  },
});
