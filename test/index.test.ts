import { describe, expect, it } from "vitest";
import { markdownToHtml } from "satteri";
import satteriMathml from "../src/index.js";

const render = async (md: string, options?: Parameters<typeof satteriMathml>[0]) =>
    (await markdownToHtml(md, {
        features: { math: true },
        mdastPlugins: [satteriMathml(options)],
    })).html;

describe("satteri-mathml", () => {
    it("renders inline math", async () => {
        expect(await render("$e^{i\\pi} + 1 = 0$")).toMatchInlineSnapshot(`
          "<p><math><msup><mi>e</mi><mrow><mi>i</mi><mi>π</mi></mrow></msup><mo>+</mo><mn>1</mn><mo>=</mo><mn>0</mn></math></p>
          "
        `);
    });

    it("renders display math", async () => {
        expect(await render("$$\n\\int_{\\partial \\Omega} \\omega = \\int_\\Omega \\mathrm{d}\\omega\n$$")).toMatchInlineSnapshot(`
          "<math display="block"><msub><mo lspace="0">∫</mo><mrow><mi>∂</mi><mrow><mspace/><mi mathvariant="normal">Ω</mi></mrow></mrow></msub><mi>ω</mi><mo>=</mo><msub><mo lspace="0">∫</mo><mrow><mspace/><mi mathvariant="normal">Ω</mi></mrow></msub><mrow><mspace/><mi mathvariant="normal">d</mi></mrow><mi>ω</mi></math>
          "
        `);
    });

    it("supports custom macros", async () => {
        const html = await render("$\\dd x$", { macros: { dd: "\\mathrm{d}" } });
        expect(html).toContain('mathvariant="normal"');
        expect(html).not.toContain("\\dd");
    });

    it("falls back on invalid LaTeX", async () => {
        const html = await render("$\\foo{$");
        expect(html).toContain('class="math-error"');
        expect(html).toContain("\\foo{");
    });

    it("escapes HTML in fallback output", async () => {
        const html = await render("$\\foo{<script>$");
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it("throws when throwOnError is true", async () => {
        await expect(render("$\\foo{$", { throwOnError: true })).rejects.toThrow("[satteri-mathml]");
    });
});