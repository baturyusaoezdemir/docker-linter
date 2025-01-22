<template>
  <div class="app-container">
    <header>
      <h1>🚀 Docker Linter</h1>
      <p>Analyze your Dockerfile for potential issues, best practices, and optimizations.</p>
      <p style="font-size: small;">The rules are available <a href="">here</a>, and I welcome any help or collaboration; feel free to add your own rules!</p>
    </header>
    <main>
      <MonacoEditor v-model:value="dockerfileContent" />
      <div class="action-buttons">
        <button @click="lintDockerfile">Lint Dockerfile</button>
      </div>
    </main>
  </div>
</template>

<script>
import MonacoEditor from "./components/MonacoEditor.vue";
import LintResults from "./components/LinterResults.vue";
import { parseDockerfile } from "./utils/dockerfileParser.js";
import { lintDockerfile } from "./utils/lintRules.js";

export default {
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
};
</script>

<style>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

header h1 {
  font-size: 2.5rem;
}

header p {
  font-size: 1.2rem;
  color: #555;
}

main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-buttons {
  text-align: center;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
