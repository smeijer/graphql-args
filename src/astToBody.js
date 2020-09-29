const { Symbols } = require('./constants');

function astToBody(ast) {
  const body = extractSelectionSet(
    { selections: ast.fieldNodes },
    ast.variableValues,
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

function extractSelectionSet(set, variables) {
  let body = {};

  set.selections.forEach((el) => {
    if (!el.selectionSet) {
      body[el.name.value] = 1;
    } else {
      body[el.name.value] = extractSelectionSet(el.selectionSet, variables);
      body[el.name.value][Symbols.ARGUMENTS] = extractArguments(
        el.arguments,
        variables,
      );
    }
  });

  return body;
}

module.exports = {
  astToBody,
};