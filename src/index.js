const toESModule = js => {
  const elmExports = js.match(
    /^\s*_Platform_export\(([^]*)\);\n?}\(this\)\);/m
  )[1];
  return js
    .replace(/\(function\s*\(scope\)\s*\{$/m, "// -- $&")
    .replace(/['"]use strict['"];$/m, "// -- $&")
    .replace(/function _Platform_export([^]*?)\}\n/g, "/*\n$&\n*/")
    .replace(/function _Platform_mergeExports([^]*?)\}\n\s*}/g, "/*\n$&\n*/")
    .replace(/^\s*_Platform_export\(([^]*)\);\n?}\(this\)\);/m, "/*\n$&\n*/")
    .concat(`
export const Elm = ${elmExports};
  `);
};

module.exports = {toESModule};
