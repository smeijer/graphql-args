const { Symbols } = require('./constants');
const { astToBody } = require('./astToBody');

function createGetArgs(ast) {
  let node = astToBody(ast);

  return function (path) {
    if (!path) {
      return node[Symbols.ARGUMENTS];
    }

    const parts = path.split('.');

    while (node && parts.length > 0) {
      node = node[parts.shift()];
    }

    if (!node) {
      return {};
    }

    return node[Symbols.ARGUMENTS] || {};
  };
}

function getArgs(ast, path) {
  if (typeof path === 'undefined') {
    return createGetArgs(ast);
  }

  return createGetArgs(ast)(path);
}

module.exports = {
  createGetArgs,
  getArgs,
};
