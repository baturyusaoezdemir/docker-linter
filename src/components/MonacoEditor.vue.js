import * as monaco from "monaco-editor";
import { lintDockerfile } from "../utils/lintRules.js"; // Importiere die Linter-Logik
export default (await import('vue')).defineComponent({
    props: {
        value: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            default: "dockerfile",
        },
        theme: {
            type: String,
            default: "vs-dark",
        },
    },
    data() {
        return {
            results: [], // Speichert die Linter-Ergebnisse
        };
    },
    emits: ["update:value"],
    mounted() {
        // Editor-Initialisierung
        this.editor = monaco.editor.create(this.$refs.editorContainer, {
            value: this.value,
            language: this.language,
            theme: this.theme,
        });
        // Listener für Änderungen im Editor
        this.editor.getModel().onDidChangeContent(() => {
            const content = this.editor.getValue();
            this.$emit("update:value", content);
            // Linter aufrufen und Ergebnisse speichern
            const parsedDockerfile = this.parseDockerfile(content);
            this.results = lintDockerfile(parsedDockerfile);
        });
        // Dockerfile-Syntax registrieren
        monaco.languages.register({ id: "dockerfile" });
        monaco.languages.setMonarchTokensProvider("dockerfile", {
            tokenizer: {
                root: [
                    [/FROM|RUN|CMD|COPY|ADD|WORKDIR|ENTRYPOINT|ENV|EXPOSE|LABEL/, "keyword"],
                    [/".*?"/, "string"],
                    [/#[^\n]*/, "comment"],
                ],
            },
        });
    },
    beforeUnmount() {
        if (this.editor) {
            this.editor.dispose();
        }
    },
    methods: {
        // Dockerfile in einzelne Anweisungen parsen
        parseDockerfile(content) {
            return content.split("\n").map((line, index) => {
                const trimmed = line.trim();
                if (trimmed.startsWith("#") || trimmed === "") {
                    return null; // Kommentare und leere Zeilen ignorieren
                }
                const [instruction, ...args] = trimmed.split(/\s+/);
                return { line: index + 1, instruction, args: args.join(" ") };
            }).filter(Boolean); // Entferne null-Werte
        },
    },
    computed: {
        // Gruppiere die Ergebnisse nach Schweregrad
        groupedResults() {
            const severityOrder = ["Critical", "High", "Medium", "Low"];
            const grouped = this.results.reduce((acc, result) => {
                acc[result.severity] = acc[result.severity] || [];
                acc[result.severity].push(result);
                return acc;
            }, {});
            // Sortiere die Gruppen nach Schweregrad
            return Object.fromEntries(severityOrder
                .map((severity) => [severity, grouped[severity] || []])
                .filter(([_, group]) => group.length > 0));
        },
    },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("editor-container") },
        ref: ("editorContainer"),
    });
    // @ts-ignore navigation for `const editorContainer = ref()`
    /** @type { typeof __VLS_ctx.editorContainer } */ ;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("lint-results") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    if (__VLS_ctx.results.length) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        for (const [severityGroup, severity] of __VLS_getVForSourceType((__VLS_ctx.groupedResults))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: ((severity)),
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
            (severity);
            __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
            for (const [result, index] of __VLS_getVForSourceType((severityGroup))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                    key: ((index)),
                });
                (result.line);
                (result.message);
            }
        }
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
    ['editor-container', 'lint-results',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {
        'editorContainer': __VLS_nativeElements['div'],
    };
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
let __VLS_self;
