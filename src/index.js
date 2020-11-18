const toESModule = js => {
  const elmExports = js.match(/^_Platform_export\(([^]*)\);}\(this\)\);/m)[1];
  return js
    .replace(/^\(function\(scope\)\{$/m, "// -- $&")
    .replace(/^'use strict';$/m, "// -- $&")
    .replace(/function _Platform_export([^]*?)\n\}\n/g, "/*\n$&\n*/")
    .replace(/function _Platform_mergeExports([^]*?)\n\}\n/g, "/*\n$&\n*/")
    .replace(/^_Platform_export\(([^]*?)\(this\)\);$/m, '/*\n$&\n*/')
    .concat("\n")
    .concat(`export const Elm = ${elmExports};\n`);
};

module.exports = {toESModule};
