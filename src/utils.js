export function get(path, object) {
  if (!path) {
    return object;
  }

  const parts = Array.isArray(path) ? path : path.split('.');

  while (object && parts.length > 0) {
    object = object[parts.shift()];
  }

  if (!object) {
    return undefined;
  }

  return object;
}

export function clean(obj, maxDepth = 1, depth = 1) {
  if (Array.isArray(obj)) {
    return obj.map((item) => clean(item, maxDepth, depth + 1));
  }

  if (typeof obj === 'object') {
    // symbols are excluded from Object.keys({})
    return Object.keys(obj).reduce((acc, key) => {
      if (key === '__typename') {
        return acc;
      }

      acc[key] =
        depth < maxDepth || maxDepth < 1
          ? clean(obj[key], maxDepth, depth + 1)
          : true;

      return acc;
    }, {});
  }

  return obj;
}
