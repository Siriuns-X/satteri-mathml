import { defineMdastPlugin, type MdastPluginDefinition } from "satteri";
import { LatexToMathML } from "math-core";

type MathCoreOptions = ConstructorParameters<typeof LatexToMathML>[0];

export interface SatteriMathmlOptions
    extends Omit<MathCoreOptions, "macros" | "throwOnError"> {
    macros?: Record<string, string>;
    throwOnError?: boolean;
}

const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    );

export function satteriMathml(options: SatteriMathmlOptions = {}): MdastPluginDefinition {
    const { macros = {}, throwOnError = false, ...rest } = options;

    const converter = new LatexToMathML({
        ...rest,
        macros: new Map(Object.entries(macros)),
        throwOnError: true,
    });

    const render = (latex: string, display: boolean, report: (msg: string) => void) => {
        try {
            return { type: "html" as const, value: converter.convert_with_local_state(latex, display) };
        } catch (err) {
            const msg = err instanceof Error || (err && typeof err === "object" && "message" in err)
                ? String((err as { message: unknown }).message)
                : String(err);
            if (throwOnError) throw new Error(`[satteri-mathml] ${msg}`);
            report(msg);
            const tag = display ? "pre" : "code";
            return {
                type: "html" as const,
                value: `<${tag} class="math-error" title="${escapeHtml(msg)}">${escapeHtml(latex)}</${tag}>`,
            };
        }
    };

    return defineMdastPlugin({
        name: "satteri-mathml",
        math: (node, ctx) =>
            render(node.value, true, (message) => ctx.report({ message, node, severity: "warning" })),
        inlineMath: (node, ctx) =>
            render(node.value, false, (message) => ctx.report({ message, node, severity: "warning" })),
    });
}

export default satteriMathml;