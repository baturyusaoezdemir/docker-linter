import { defineComponent } from "vue";
import MonacoEditor from "@monaco-editor/vue";
export default defineComponent({
    components: { MonacoEditor },
    props: {
        content: {
            type: String,
            required: true,
        },
    },
    emits: ["update:content"],
    methods: {
        updateContent(newValue) {
            this.$emit("update:content", newValue);
        },
    },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_componentsOption = { MonacoEditor };
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_0 = {}.MonacoEditor;
    /** @type { [typeof __VLS_components.MonacoEditor, typeof __VLS_components.monacoEditor, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onChange': {} },
        language: ("dockerfile"),
        theme: ("vs-dark"),
        value: ((__VLS_ctx.content)),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onChange': {} },
        language: ("dockerfile"),
        theme: ("vs-dark"),
        value: ((__VLS_ctx.content)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_6;
    const __VLS_7 = {
        onChange: (__VLS_ctx.updateContent)
    };
    let __VLS_3;
    let __VLS_4;
    var __VLS_5;
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
