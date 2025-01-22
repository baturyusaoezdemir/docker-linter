export function lintDockerfile(parsedDockerfile) {
  const rules = [
    { rule: avoidLatestTag, severity: "High" },
    { rule: combineRunInstructions, severity: "Medium" },
    { rule: cleanAptCache, severity: "High" },
    { rule: avoidRootUser, severity: "Critical" },
    { rule: checkLabels, severity: "Medium" },
    { rule: preferEntrypointOverCmd, severity: "Medium" },
    { rule: avoidLargeBaseImages, severity: "Medium" },
    { rule: checkDockerignore, severity: "High" },
    { rule: avoidCopyWithoutChown, severity: "High" },
    { rule: checkMultiStageBuild, severity: "Medium" },
    { rule: checkHealthcheck, severity: "Medium" },
    { rule: avoidLargeFiles, severity: "Medium" },
    { rule: preferWorkdirOverCd, severity: "Medium" },
    { rule: avoidSensitiveDataInEnv, severity: "Critical" },
    { rule: useArgForBuildVariables, severity: "Medium" },
    { rule: enforcePermissionsWithAddOrCopy, severity: "High" },
    { rule: cleanTemporaryFiles, severity: "Medium" },
    { rule: checkUnusedInstructions, severity: "Low" },
    { rule: avoidAddForHttp, severity: "High" },
    { rule: avoidRedundantInstructions, severity: "Low" }
  ];

  let warnings = rules.flatMap(({ rule, severity }) =>
    rule(parsedDockerfile).map((warning) => ({ ...warning, severity }))
  );

  const severityOrder = { Critical: 1, High: 2, Medium: 3, Low: 4 };
  return warnings.sort(
    (a, b) =>
      severityOrder[a.severity] - severityOrder[b.severity] || a.line - b.line
  );
}

function avoidLatestTag(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "FROM" && inst.args.includes("latest"))
    .map((inst) => ({
      line: inst.line,
      message: "Avoid using 'latest' tag in FROM statement.",
      explanation: "Using 'latest' makes the image unpredictable and can lead to unexpected behavior if the base image changes. Use a specific version instead.",
    }));
}

function combineRunInstructions(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "RUN" && inst.args.includes("apt-get install"))
    .map((inst) => ({
      line: inst.line,
      message: "Combine RUN instructions to reduce image layers.",
      explanation: "Each RUN instruction creates a new layer. Combining them reduces the number of layers and improves performance.",
    }));
}

function cleanAptCache(parsedDockerfile) {
  return parsedDockerfile
    .filter(
      (inst) =>
        inst.instruction === "RUN" &&
        inst.args.includes("apt-get install") &&
        !inst.args.includes("rm -rf /var/lib/apt/lists/*")
    )
    .map((inst) => ({
      line: inst.line,
      message: "Always clean up 'apt-get' cache to reduce image size.",
      explanation: "Leaving the apt cache increases the image size unnecessarily. Clean the cache to optimize the image size.",
    }));
}

function avoidRootUser(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "USER" && inst.args === "root")
    .map((inst) => ({
      line: inst.line,
      message: "Avoid running containers as 'root'. Use a non-root user instead.",
      explanation: "Running as 'root' increases security risks. Create and switch to a non-root user to minimize vulnerabilities.",
    }));
}

function checkLabels(parsedDockerfile) {
  const hasLabels = parsedDockerfile.some((inst) => inst.instruction === "LABEL");
  return hasLabels
    ? []
    : [{
        line: 0,
        message: "Consider adding metadata labels for maintainability (e.g., maintainer, version).",
        explanation: "Labels provide important metadata about the image, such as maintainer information and version details, improving maintainability.",
      }];
}

function preferEntrypointOverCmd(parsedDockerfile) {
  const hasEntrypoint = parsedDockerfile.some((inst) => inst.instruction === "ENTRYPOINT");
  return !hasEntrypoint
    ? parsedDockerfile
        .filter((inst) => inst.instruction === "CMD")
        .map((inst) => ({
          line: inst.line,
          message: "Consider using ENTRYPOINT instead of CMD for better container control.",
          explanation: "ENTRYPOINT allows you to define a fixed command while allowing additional parameters via CMD.",
        }))
    : [];
}

function avoidLargeBaseImages(parsedDockerfile) {
  return parsedDockerfile
    .filter(
      (inst) => inst.instruction === "FROM" && inst.args.includes("ubuntu") && !inst.args.includes("alpine")
    )
    .map((inst) => ({
      line: inst.line,
      message: "Consider using a smaller base image (e.g., alpine) to reduce image size.",
      explanation: "Smaller base images reduce the overall image size, making it faster to download and deploy.",
    }));
}

function checkDockerignore(parsedDockerfile) {
  return parsedDockerfile.some((inst) => inst.instruction === ".dockerignore")
    ? []
    : [{
        line: 0,
        message: "Ensure you have a '.dockerignore' file to exclude unnecessary files.",
        explanation: "A '.dockerignore' file helps reduce the image size by excluding unnecessary files from the build context.",
      }];
}

function avoidCopyWithoutChown(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "COPY" && !inst.args.includes("--chown"))
    .map((inst) => ({
      line: inst.line,
      message: "Use '--chown' with COPY to set proper ownership of copied files.",
      explanation: "'--chown' ensures files are owned by the correct user, improving security and maintainability.",
    }));
}

function checkMultiStageBuild(parsedDockerfile) {
  const fromStatements = parsedDockerfile.filter((inst) => inst.instruction === "FROM");
  return fromStatements.length > 1
    ? []
    : [{
        line: 0,
        message: "Consider using a multi-stage build to optimize image size.",
        explanation: "Multi-stage builds help reduce image size by copying only the required artifacts into the final image.",
      }];
}

function checkHealthcheck(parsedDockerfile) {
  const hasHealthcheck = parsedDockerfile.some((inst) => inst.instruction === "HEALTHCHECK");
  return hasHealthcheck
    ? []
    : [{
        line: 0,
        message: "Add a HEALTHCHECK instruction to monitor container health.",
        explanation: "HEALTHCHECK ensures that the container is running as expected and restarts it if necessary.",
      }];
}

function avoidLargeFiles(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "COPY" && inst.args.includes("."))
    .map((inst) => ({
      line: inst.line,
      message: "Avoid copying large directories or files without excluding unnecessary content.",
      explanation: "Copying large directories increases image size unnecessarily. Use a '.dockerignore' file to exclude unwanted files.",
    }));
}

function preferWorkdirOverCd(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "RUN" && inst.args.includes("cd "))
    .map((inst) => ({
      line: inst.line,
      message: "Use WORKDIR instead of 'RUN cd' for setting the working directory.",
      explanation: "WORKDIR is more reliable and makes the Dockerfile easier to read and maintain.",
    }));
}

function avoidSensitiveDataInEnv(parsedDockerfile) {
  const sensitiveKeys = ["PASSWORD", "SECRET", "TOKEN"];
  return parsedDockerfile
    .filter(
      (inst) =>
        inst.instruction === "ENV" &&
        sensitiveKeys.some((key) => inst.args.toUpperCase().includes(key))
    )
    .map((inst) => ({
      line: inst.line,
      message: "Avoid storing sensitive data in ENV variables. Use secrets management instead.",
      explanation: "Storing sensitive data in ENV variables can lead to unintentional leaks. Use a secrets management tool.",
    }));
}

function useArgForBuildVariables(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "RUN" && inst.args.includes("$"))
    .map((inst) => ({
      line: inst.line,
      message: "Use ARG for build-time variables instead of hardcoding them in RUN.",
      explanation: "Using ARG ensures that build-time variables are not baked into the image, improving flexibility.",
    }));
}

function enforcePermissionsWithAddOrCopy(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst) => inst.instruction === "ADD" || inst.instruction === "COPY")
    .filter((inst) => !inst.args.includes("--chmod"))
    .map((inst) => ({
      line: inst.line,
      message: "Use '--chmod' with ADD or COPY to explicitly set file permissions.",
      explanation: "'--chmod' ensures proper file permissions, improving security and maintainability.",
    }));
}

function cleanTemporaryFiles(parsedDockerfile) {
  return parsedDockerfile
    .filter(
      (inst) =>
        inst.instruction === "RUN" &&
        (inst.args.includes("wget") || inst.args.includes("curl")) &&
        !inst.args.includes("rm")
    )
    .map((inst) => ({
      line: inst.line,
      message: "Remove temporary files (e.g., wget, curl downloads) after using them.",
      explanation: "Leaving temporary files increases image size unnecessarily. Clean them up after use.",
    }));
}

function checkUnusedInstructions(parsedDockerfile) {
  const unusedInstructions = ["MAINTAINER"];
  return parsedDockerfile
    .filter((inst) => unusedInstructions.includes(inst.instruction))
    .map((inst) => ({
      line: inst.line,
      message: `${inst.instruction} is deprecated. Remove or replace with recommended alternatives.`,
      explanation: "The 'MAINTAINER' instruction is deprecated. Use 'LABEL maintainer=' instead.",
    }));
}

function avoidAddForHttp(parsedDockerfile) {
  return parsedDockerfile
    .filter(
      (inst) =>
        inst.instruction === "ADD" &&
        (inst.args.includes("http://") || inst.args.includes("https://"))
    )
    .map((inst) => ({
      line: inst.line,
      message: "Avoid using ADD for HTTP/HTTPS downloads. Use RUN with curl or wget instead.",
      explanation: "Using ADD for downloads is less explicit and secure. Use RUN with curl or wget for better control.",
    }));
}

function avoidRedundantInstructions(parsedDockerfile) {
  return parsedDockerfile
    .filter((inst, index, array) => {
      if (inst.instruction === "RUN") {
        const previous = array[index - 1];
        return previous && previous.instruction === "RUN" && previous.args === inst.args;
      }
      return false;
    })
    .map((inst) => ({
      line: inst.line,
      message: "Avoid redundant RUN instructions with the same content.",
      explanation: "Redundant RUN instructions increase image size unnecessarily. Combine them into one instruction.",
    }));
}
