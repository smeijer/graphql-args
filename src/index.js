import { astToBody } from './astToBody';
import { Symbols } from './constants';
import { get, clean } from './utils';
export { getAst } from './test-utils';

export function parse(ast) {
  const body = astToBody(ast);

  return {
    getArgs: (path) => {
      const node = get(path, body);

      if (!node) {
        return {};
      }

      return node[Symbols.ARGUMENTS] || {};
    },

    getFields: (path, options = {}) => {
      const node = get(path, body) || {};
      return clean(node, options.depth);
    },
  };
}

export function getArgs(ast, path) {
  if (typeof path === 'undefined') {
    return parse(ast).getArgs;
  }

  return parse(ast).getArgs(path);
}

export function getFields(ast, path, options) {
  if (typeof path === 'undefined') {
    return parse(ast).getFields;
  }

  return parse(ast).getFields(path, options);
}
