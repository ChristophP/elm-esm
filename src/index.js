#!/usr/bin/env node

const {spawn} = require('child_process')
const {promisify} = require('util')
const fs = require('fs')

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

const args = process.argv;
const outputArg = process.argv.find(arg => arg.startsWith('--output'))
const outputFile = outputArg ? outputArg.split('=')[1] : 'index.html'

const delegateToElmCompiler = () => {
  const elm = spawn('node_modules/.bin/elm', args.slice(2), {stdio: 'inherit'});

  return new Promise((resolve, reject) => {
    elm.on('close', resolve);
    elm.on('error', reject);
  })
};

const postProcess = async () => {
  const js = await readFileAsync(outputFile, 'utf8');
  await writeFileAsync(outputFile, makeESModule(js), 'utf8');
};

const makeESModule = (js) => {
  const elmExports = js.match(/^_Platform_export\((.*?)\);/m)[1]
  return js.replace(/^\(function\(scope\)\{$/m, '// -- $&')
    .replace(/^'use strict';$/m, '// -- $&')
    .replace(/function _Platform_export([^]*?)\n\}\n/g, '/*\n$&\n*/')
    .replace(/function _Platform_mergeExports([^]*?)\n\}\n/g, '/*\n$&\n*/')
    .replace(/^_Platform_export(.*?)$/m, '// $&')
    .concat('\n')
    .concat(`export const Elm = ${elmExports};\n`)
}


const run = async () => {
  await delegateToElmCompiler()
  await postProcess();
}

run();
