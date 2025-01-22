import MonacoEditor from "./components/MonacoEditor.vue";
import LintResults from "./components/LinterResults.vue";
import { parseDockerfile } from "./utils/dockerfileParser.js";
import { lintDockerfile } from "./utils/lintRules.js";
export default (await import('vue')).defineComponent({
    components: { MonacoEditor, LintResults },
    data() {
        return {
            dockerfileContent: "# Type your Dockerfile here\n",
            lintResults: [],
        };
    },
    methods: {
        lintDockerfile() {
            const parsed = parseDockerfile(this.dockerfileContent);
            this.lintResults = lintDockerfile(parsed);
        },
    },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_componentsOption = { MonacoEditor, LintResults };
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("app-container") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ style: ({}) },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
        href: (""),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({});
    const __VLS_0 = {}.MonacoEditor;
    /** @type { [typeof __VLS_components.MonacoEditor, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        value: ((__VLS_ctx.dockerfileContent)),
    }));
    const __VLS_2 = __VLS_1({
        value: ((__VLS_ctx.dockerfileContent)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("action-buttons") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.lintDockerfile) },
    });
    ['app-container', 'action-buttons',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {};
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
