# satteri-mathml

A [Sätteri](https://github.com/bruits/satteri) plugin that renders LaTeX math to native MathML using [math-core](https://github.com/tmke8/math-core).

No client-side JavaScript. Output is plain MathML rendered by the browser.

## Install

```sh
pnpm add satteri-mathml
```

## Usage

### Astro

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import satteriMathml from "satteri-mathml";

export default defineConfig({
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [satteriMathml()],
    }),
  },
});
```

Import the styles once in your layout:

```js
import "satteri-mathml/style.css";
```

### Standalone

```js
import { markdownToHtml } from "satteri";
import satteriMathml from "satteri-mathml";

const { html } = markdownToHtml("$x^2$", {
  features: { math: true },
  mdastPlugins: [satteriMathml()],
});
```

## Options

| Option         | Type                     | Default | Description                                                                             |
| -------------- | ------------------------ | ------- | --------------------------------------------------------------------------------------- |
| `macros`       | `Record<string, string>` | `{}`    | Custom macros, e.g. `{ "dd": "\\mathrm{d}" }`                                           |
| `throwOnError` | `boolean`                | `false` | By default, invalid LaTeX renders as a fallback. Set to true to fail the build instead. |

Other options are passed to math-core.

## Styles

- `satteri-mathml/style.css`: MathML fixes + NewCM Math font (recommended)
- `satteri-mathml/mathmlfixes.css`: fixes only, bring your own math font

Invalid formulas render as `<code class="math-error">` with the error message in `title`.

## License

[MIT](./LICENSE) for the plugin code.

Bundled third-party assets keep their own licenses:

- `mathmlfixes.css`: MIT, see [`assets/LICENSE-math-core.txt`](./assets/LICENSE-math-core.txt)
- `NewCMMath-Book.woff2`: GUST Font License, see [`assets/LICENSE-NewCM.txt`](./assets/LICENSE-NewCM.txt)