<template>
  <div>
    <div class="editor-container" ref="editorContainer"></div>
    <div class="lint-results">
      <h2>Linting Results</h2>
      <div v-if="results.length">
        <div v-for="(severityGroup, severity) in groupedResults" :key="severity">
          <h3>{{ severity }} Issues</h3>
          <ul>
            <li v-for="(result, index) in severityGroup" :key="index">
              Line {{ result.line }}: {{ result.message }}
            </li>
          </ul>
        </div>
      </div>
      <p v-else>No issues found!</p>
    </div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
import { lintDockerfile } from "../utils/lintRules.js"; // Importiere die Linter-Logik

export default {
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
      return Object.fromEntries(
        severityOrder
          .map((severity) => [severity, grouped[severity] || []])
          .filter(([_, group]) => group.length > 0)
      );
    },
  },
};
</script>

<style>
.editor-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
}

.lint-results {
  margin-top: 20px;
}

.lint-results h2 {
  font-size: 1.5rem;
}

.lint-results h3 {
  font-size: 1.2rem;
  margin-top: 10px;
}

.lint-results ul {
  list-style: none;
  padding: 0;
}

.lint-results li {
  margin: 5px 0;
  font-size: 1rem;
}
</style>
