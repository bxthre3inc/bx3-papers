/**
 * File search utility for IDE adapter
 */

import { spawn } from "child_process";

export async function grep_search(pattern: string, cwd: string = "."): Promise<string[]> {
  return new Promise((resolve) => {
    const results: string[] = [];
    const proc = spawn("grep", ["-r", "-l", pattern, cwd], { shell: true });

    proc.stdout?.on("data", (data) => {
      results.push(...data.toString().split("\n").filter(Boolean));
    });

    proc.stderr?.on("data", () => {});

    proc.on("close", () => resolve(results));
  });
}

export async function find_files(pattern: string, cwd: string = "."): Promise<string[]> {
  return new Promise((resolve) => {
    const results: string[] = [];
    const proc = spawn("find", [cwd, "-name", pattern, "-type", "f"], { shell: true });

    proc.stdout?.on("data", (data) => {
      results.push(...data.toString().split("\n").filter(Boolean));
    });

    proc.on("close", () => resolve(results));
  });
}
