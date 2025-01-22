<template>
  <div>
    <monaco-editor
      language="dockerfile"
      theme="vs-dark"
      :value="content"
      @change="updateContent"
    />
  </div>
</template>

<script>
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
</script>
