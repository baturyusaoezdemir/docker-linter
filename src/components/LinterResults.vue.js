export default (await import('vue')).defineComponent({
    props: {
        results: {
            type: Array,
            required: true,
        },
    },
    computed: {
        groupedResults() {
            const severityOrder = ["Critical", "High", "Medium", "Low"];
            const grouped = this.results.reduce((acc, result) => {
                acc[result.severity] = acc[result.severity] || [];
                acc[result.severity].push(result);
                return acc;
            }, {});
            return Object.fromEntries(severityOrder
                .map((severity) => [severity, grouped[severity] || []])
                .filter(([_, group]) => group.length > 0));
        },
    },
    methods: {
        severityClass(severity) {
            return {
                Critical: "critical",
                High: "high",
                Medium: "medium",
                Low: "low",
            }[severity];
        },
        severityIcon(severity) {
            return {
                Critical: "fas fa-exclamation-circle",
                High: "fas fa-exclamation-triangle",
                Medium: "fas fa-info-circle",
                Low: "fas fa-check-circle",
            }[severity];
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("lint-results") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    if (__VLS_ctx.results.length) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        for (const [severityGroup, severity] of __VLS_getVForSourceType((__VLS_ctx.groupedResults))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: ((severity)),
                ...{ class: ("result-group") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
                ...{ class: ((__VLS_ctx.severityClass(severity))) },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
                ...{ class: ((__VLS_ctx.severityIcon(severity))) },
            });
            (severity);
            __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
            for (const [result, index] of __VLS_getVForSourceType((severityGroup))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                    key: ((index)),
                });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: ("line-number") },
                });
                (result.line);
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: ("message") },
                });
                (result.message);
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: ("tooltip") },
                });
                __VLS_elementAsFunction(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
                    ...{ class: ("info-icon") },
                });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: ("tooltip-text") },
                });
                (result.explanation);
            }
        }
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
    ['lint-results', 'result-group', 'line-number', 'message', 'tooltip', 'info-icon', 'tooltip-text',];
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
