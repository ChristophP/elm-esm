# Turn Elm compiler output into modern ES Modules

Wanna load Elm as ES Modules in your browser? Say no more. With this package
you can easily do just that.

```sh
npx elm-esm make src/Main.elm --output=myElmModule.js
```

Then use your favorite way of loading it as a new ES module
```html
<script type="module">
import { Elm } from './myElmModule.js';

Elm.Main.init({ node: document.body })
</script>
```

It's even possible to use your favorite ES6 features like `dynamic-import` or `modulepreload` now.

```javascript
// this is great for lazy loading an Elm app
import('./myElmModule.js').then(({ Elm }) => {
  Elm.Main.init({ node: document.body })
});
```

```html
<!-- preload our Elm module for faster startup when you need it -->
<link rel="modulepreload" href="./myElmModule.js">
```

It's like it's 2020 already 🥳🎉

## CLI Usage

`elm-esm` accepts all the options that `elm` accepts. Run `elm-esm --help` for an
overview.

```sh
npx elm-esm make src/Main.elm --output=myElmModule.js

# Or globally installed
npm i -g elm-esm
elm-esm make src/Main.elm --output=myElmModule.js
```

`elm-esm` accepts one extra option called `--compiler=path/to/elm`. By default it looks
for an Elm compiler in the following order.
1. In whatever you pass with the `--compiler=path/to/elm` flag, if present
2. In the nearest `node_modules/.bin`
3. In your `$PATH`

## NodeJS Usage

Plugin authors or other tooling may want to use the transform as a standalone
function. Here's how:

```sh
# install the package to your dependencies
npm i -D elm-esm
```

The module exports a named function called `toESModule`. It takes one argument,
which is the compiled Elm code as a string. It returns the ESModule transformed code
as a string.

```javascript
const { toESModule } = require('elm-esm');

const transformedElmOutputAsESModule = toESModule(compiledElmOutput);
```

## FAQs

### How does that work under the hood?

It's just a few simple Regex transforms on the compiler output, designed to work under different circumstances.
It only operates on necessary lines of code that are related to exporting.
Some code that isn't needed is commented out, and one line to export in ES6 style is added.

### Will this work in my browser?

Probably, yes. All modern Browsers support ES6 modules now. Check out the [compatibility table](https://caniuse.com/es6-module).

### How can I use this with Webpack/Parcel/Rome

I haven't 100% figured that out, but it should be pretty easy. `elm-esm` is designed to be a wrapper around `elm`.
Most bundler plugins for Elm allow passing an option with a path to the Elm executable.
Just pass the path to `elm-esm` instead.
On the other hand why bundle when you can load the module in the browser directly?
If you're looking to bundle your app, then you probably don't need this `elm-esm`.

Please open an issue if you run into problems here!

### What about elm-test?

Don't use this for elm-test. `elm-esm` is meant for use in the browser. NodeJS
still only has [experimental support for ESM](https://nodejs.org/docs/latest-v14.x/api/esm.html) *sigh*.

But if you're looking to launch a `Platform.worker` Elm program in
[Deno](https://deno.land/), then `elm-esm` can generate the necessary ES module for you.

### Does this work for all Elm versions?

It's only tested for Elm 0.19.1, but it may work with 0.19.0 too.
Please open an issue if you run into problems here!

### What if I compile to an HTML file?

Nothing happens. Having an inline script with `type=module` doesn't make sense
with exports since I don't think you can import it anywhere else.
