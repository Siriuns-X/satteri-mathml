import { markdownToHtml } from "satteri";
import satteriMathml from "../dist/index.js";

const md = `
Inline math: $e^{i\\pi} + 1 = 0$.

Display math:

$$
\\int_{\\partial \\Omega} \\omega = \\int_\\Omega \\dd \\omega
$$

invalid $\\foo{$
`;

const { html } = markdownToHtml(md, {
    features: { math: true },
    mdastPlugins: [satteriMathml({ macros: { "dd": "\\mathrm{d}" } })],
});

console.log(html);