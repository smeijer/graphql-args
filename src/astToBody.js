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
  if (value.kind === 'Variable') {
    return variables[value.name.value];
  }

  return value.value;
}

function extractArguments(args, variables) {
  if (!Array.isArray(args) || args.length === 0) {
    return {};
  }

  // recursively walk down the ast, to collect all arguments. The recursive
  // behavior covers input types (arguments of type object). Think of queries
  // like `comments({ where: { blog: { id: 123 } } })`
  return args.reduce((acc, field) => {
    acc[field.name.value] =
      field.value.kind === 'ObjectValue'
        ? extractArguments(field.value.fields, variables)
        : extractArgumentValue(field.value, variables);

    return acc;
  }, {});
}

function extractSelectionSet(set, variables, fragments) {
  let body = {};

  set.selections.forEach((el) => {
    if (el.kind === 'FragmentSpread') {
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
