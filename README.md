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
import('./myElmModule.js').then((Elm) => {
  Elm.Main.init({ node: document.body })
});
```

```html
<!-- preload our Elm module for faster startup when you need it -->
<link rel="modulepreload" href="./myElmModule.js">
```

It's like it's 2020 already 🥳🎉

## FAQs

### How does that work under the hood?

It's just a few simple Regex transforms, designed to work under different circumstances.
It only operates on necessary lines of code that are related to exporting.
Some code that isn't needed is commented out, and one line to export in ES6 style is added.

### Will this work in my browser?

Probably, yes. All modern Browsers support ES6 modules now. Check out the compatibility table.

### How can I use this with Webpack/Parcel/Rome

I haven't 100% figured that out, but it should be pretty easy. `elm-esm` is designed to be a wrapper around `elm`.
Most bundler plugins for elm allow passing an option with a path to the elm executable.
Just pass the path to `elm-esm` instead.
On the other hand why bundle when you can load the module in the browser directly?
If you're looking to bundle your app, then you probably don't need this `elm-esm`.

Please open an issue if you run into problems here!

### What about elm-test?

Don't use this for elm-test. `elm-esm` is meant for use in the browser. NodeJS
still only has experimental support for ESM *sigh*.

