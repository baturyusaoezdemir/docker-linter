export function parseDockerfile(content) {
  const lines = content.split("\n");
  const instructions = lines.map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || trimmed === "") {
      return null; // Kommentare und leere Zeilen ignorieren
    }
    const [instruction, ...args] = trimmed.split(/\s+/);
    return { line: index + 1, instruction, args: args.join(" ") };
  });
  return instructions.filter(Boolean);
}