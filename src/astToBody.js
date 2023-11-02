import { Kind } from 'graphql';
import { Symbols } from './constants';

export function astToBody(ast) {
  const body = extractSelectionSet(
    { selections: ast.fieldNodes },
    ast.variableValues,
    ast.fragments,
  );

  return Object.values(body)[0];
}

function extractArgumentValue(value, variables) {
  if (!value) return null;
  const kind = value.kind;
  switch (kind) {
    case Kind.VARIABLE:
      return variables[value.name.value];
    case Kind.INT:
      return parseInt(value.value);
    case Kind.FLOAT:
      return parseFloat(value.value);
    case Kind.BOOLEAN:
      return Boolean(value.value);
    case Kind.NULL:
      return null;
    case Kind.STRING:
    case Kind.ENUM:
      return value.value;
    case Kind.LIST:
      return value.values.map((v) => extractArgumentValue(v, variables));
    case Kind.OBJECT:
      return Object.keys(value.fields).reduce((acc, key) => {
        acc[value.fields[key].name.value] = extractArgumentValue(
          value.fields[key].value,
          variables,
        );
        return acc;
      }, {});
    default:
      return value.value;
  }
}

function extractArguments(args, variables) {
  if (!Array.isArray(args) || args.length === 0) {
    return {};
  }

  // recursively walk down the ast, to collect all arguments. The recursive
  // behavior covers input types (arguments of type object/array etc. supports all GraphQL type).
  // think of queries like `comments({ where: { blog: { id: 123 } } })`
  return args.reduce((acc, field) => {
    acc[field.name.value] = extractArgumentValue(field.value, variables);
    return acc;
  }, {});
}

function extractSelectionSet(set, variables, fragments) {
  let body = {};

  set.selections.forEach((el) => {
    if (el.kind === 'FragmentSpread') {
      if (fragments === null) {
        return;
      }
      const fragment = fragments[el.name.value];
      const selectionSet = extractSelectionSet(
        fragment.selectionSet,
        variables,
        fragments,
      );

      Object.assign(body, selectionSet);
    } else if (!el.selectionSet) {
      body[el.name.value] = true;
    } else {
      body[el.name.value] = extractSelectionSet(
        el.selectionSet,
        variables,
        fragments,
      );
      body[el.name.value][Symbols.ARGUMENTS] = extractArguments(
        el.arguments,
        variables,
      );
    }
  });

  return body;
}
