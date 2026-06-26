/**
 * Post-tool plugin: formats with Prettier and auto-fixes lint with ESLint.
 * Triggered after Write, Edit, and MultiEdit tool calls.
 *
 * Migrated from the project's format-and-lint hook.
 */
import type { Plugin } from "@opencode-ai/plugin";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const WRITE_TOOLS = new Set(["write", "edit", "multiedit"]);

export default (async ({ project }) => {
  const projectDir = project.path;

  return {
    "tool.execute.after": async (input, _output) => {
      const toolName = (input.tool ?? "").toLowerCase();
      if (!WRITE_TOOLS.has(toolName)) return;

      const filePath: string =
        input.args?.file_path ?? input.args?.filePath ?? "";
      if (!filePath) return;

      const absolutePath = resolve(projectDir, filePath);
      if (!existsSync(absolutePath)) return;

      // Prettier: format whatever it understands; --ignore-unknown silently skips unsupported types
      try {
        execFileSync(
          "npx",
          ["--no-install", "prettier", "--write", "--ignore-unknown", absolutePath],
          { cwd: projectDir, stdio: "ignore" }
        );
      } catch {
        // ignore errors
      }

      // ESLint --fix: only JS/TS family files
      if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(absolutePath)) {
        try {
          execFileSync(
            "npx",
            ["--no-install", "eslint", "--fix", absolutePath],
            { cwd: projectDir, stdio: "ignore" }
          );
        } catch {
          // ignore errors
        }
      }
    },
  };
}) satisfies Plugin;
